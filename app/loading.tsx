import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-green [animation-duration:1s]" />
        <Image src="/icon.png" alt="Loading" width={72} height={72} className="h-14 w-14 object-contain" />
      </div>
    </div>
  );
}
