import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Simple in-memory rate limiter
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: Request): string {
  // Try to get IP from headers (works with most proxies/load balancers)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip || "unknown";
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  // Clean up expired records
  if (record && now > record.resetTime) {
    loginAttempts.delete(ip);
  }

  const current = loginAttempts.get(ip);
  
  if (!current) {
    // First attempt
    loginAttempts.set(ip, {
      count: 1,
      resetTime: now + 15 * 60 * 1000, // 15 minutes
    });
    return { allowed: true };
  }

  if (current.count >= 5) {
    // Too many attempts
    const retryAfter = Math.ceil((current.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment attempt count
  current.count++;
  return { allowed: true };
}

export async function POST(request: Request) {
  // Check rate limit
  const ip = getRateLimitKey(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { 
        error: `Too many login attempts. Please try again in ${rateLimit.retryAfter} seconds.` 
      },
      { 
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
        },
      },
    );
  }
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
