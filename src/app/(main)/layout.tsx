// import DesktopOnlyGuard from "../_components/guards/DesktopOnlyGuard";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <DesktopOnlyGuard>
    <main className="relative">{children}</main>
    // </DesktopOnlyGuard>
  );
}
