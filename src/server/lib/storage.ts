import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Storage handler that works in both development and production
 * - Development: Uses local filesystem
 * - Production: Uses Supabase Storage (or can be configured for other providers)
 */

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  error?: string;
}

/**
 * Upload file to storage
 * In development, saves to local filesystem
 * In production, uses Supabase Storage if configured, otherwise uses /tmp
 */
export async function uploadFile(
  file: File,
  options?: {
    bucket?: string;
    folder?: string;
  },
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        url: "",
        filename: "",
        error: validation.error,
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop() || "webp";
    const filename = `${timestamp}-${randomString}.${extension}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if we're in production and have Supabase configured
    if (
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      // Use Supabase Storage
      return await uploadToSupabase(buffer, filename, options);
    } else {
      // Use local filesystem (development) or /tmp (production fallback)
      return await uploadToFilesystem(buffer, filename, options);
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      url: "",
      filename: "",
      error: "Failed to upload file",
    };
  }
}

/**
 * Validate file type and size
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Only images are allowed.",
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File too large. Maximum size is 5MB.",
    };
  }

  return { valid: true };
}

/**
 * Upload to Supabase Storage
 */
async function uploadToSupabase(
  buffer: Buffer,
  filename: string,
  options?: { bucket?: string; folder?: string },
): Promise<UploadResult> {
  try {
    const { createClient } = await import("@supabase/supabase-js");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const bucket = options?.bucket || "admin-uploads";
    const folder = options?.folder || "";
    const path = folder ? `${folder}/${filename}` : filename;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: "image/*",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      // Fallback to filesystem if Supabase fails
      return await uploadToFilesystem(buffer, filename, options);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      filename,
    };
  } catch (error) {
    console.error("Error uploading to Supabase:", error);
    // Fallback to filesystem
    return await uploadToFilesystem(buffer, filename, options);
  }
}

/**
 * Upload to local filesystem or /tmp
 */
async function uploadToFilesystem(
  buffer: Buffer,
  filename: string,
  _options?: { folder?: string },
): Promise<UploadResult> {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    // In production (Vercel), use /tmp directory which is writable
    // In development, use public/admin-uploads
    const uploadDir = isProduction
      ? "/tmp/admin-uploads"
      : join(process.cwd(), "public", "admin-uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // In production, we'd need to serve these from /tmp via a separate route
    // For now, return a temporary URL
    const publicUrl = isProduction
      ? `/api/uploads/${filename}`
      : `/admin-uploads/${filename}`;

    return {
      success: true,
      url: publicUrl,
      filename,
    };
  } catch (error) {
    console.error("Error uploading to filesystem:", error);
    throw error;
  }
}
