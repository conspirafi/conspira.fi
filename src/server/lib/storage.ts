import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * Storage handler for filesystem-based uploads
 * Works in both development and production (with persistent volume)
 */

export interface UploadResult {
  success: boolean;
  url: string;
  filename: string;
  error?: string;
}

/**
 * Upload file to filesystem storage
 * Development: public/admin-uploads/
 * Production: public/admin-uploads/ (with persistent volume mount)
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

    // Always use filesystem
    return await uploadToFilesystem(buffer, filename, options);
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
 * Upload to local filesystem
 */
async function uploadToFilesystem(
  buffer: Buffer,
  filename: string,
  _options?: { folder?: string },
): Promise<UploadResult> {
  try {
    // Always use public/admin-uploads directory
    // In Docker/Railway, this will be a persistent volume mount
    const uploadDir = join(process.cwd(), "public", "admin-uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Public URL is always /admin-uploads/filename
    const publicUrl = `/admin-uploads/${filename}`;

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
