import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 },
      );
    }

    if (password === adminPassword) {
      // Set httpOnly cookie for 7 days
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth");

  return NextResponse.json({
    authenticated: adminAuth?.value === "true",
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");

  return NextResponse.json({ success: true });
}
