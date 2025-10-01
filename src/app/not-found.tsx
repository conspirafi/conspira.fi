import Image from "next/image";

export default function NotFound() {
  return (
    <div className="pointer-events-none fixed top-1/2 left-1/2 -z-10 h-[100svh] w-[100svw] -translate-x-1/2 -translate-y-1/2">
      <Image
        src={"/big_brother.png"}
        alt={"background"}
        fill
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
      />
    </div>
  );
}
