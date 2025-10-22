"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Force dynamic rendering to prevent static generation issues with react-admin
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const fetchCache = "force-no-store";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/admin/auth");
        const data = await response.json();

        if (!data.authenticated) {
          router.push("/admin/login");
        } else {
          setIsChecking(false);
        }
      } catch {
        router.push("/admin/login");
      }
    }

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div>Checking authentication...</div>
      </div>
    );
  }

  return <>{children}</>;
}
