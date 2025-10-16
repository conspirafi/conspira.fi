import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "~/server/lib/storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Upload file using the storage handler
    const result = await uploadFile(file, {
      bucket: "admin-uploads",
      folder: "",
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to upload file" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      filename: result.filename,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 },
    );
  }
}
