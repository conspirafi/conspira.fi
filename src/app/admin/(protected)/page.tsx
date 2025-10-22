"use client";

import dynamic from "next/dynamic";

// Disable static optimization for admin pages (react-admin requires client-side rendering)

const AdminClient = dynamic(() => import("./AdminClient"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div>Loading admin panel...</div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminClient />;
}
