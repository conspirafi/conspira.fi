import { ApiDataProvider } from "../providers/apiDataProvider/ApiDataProvider";
import { ViewportProvider } from "../providers/ViewportProvider";
import { LoaderProvider } from "../providers/LoaderProvider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApiDataProvider>
      <ViewportProvider>
        <LoaderProvider>
          <main className="relative">{children}</main>
        </LoaderProvider>
      </ViewportProvider>
    </ApiDataProvider>
  );
}
