"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <p className="mt-4 text-gray-400">{error.message}</p>
          <button
            onClick={reset}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
