import Image from "next/image";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[100svh] w-[100svw] -translate-x-1/2 -translate-y-1/2">
        <Image
          src={"/big_brother.png"}
          alt={"background"}
          fill
          quality={100}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain opacity-50"
        />
      </div>

      <div className="z-10 text-center text-white">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-4 text-xl opacity-70">Signal not found</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 hover:bg-blue-700"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
