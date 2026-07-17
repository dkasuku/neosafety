import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import HeaderActions from "./HeaderActions";

export default function Header() {
  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="container-x py-3 md:py-4">
        <div className="flex items-center gap-3 md:gap-8">
          <Link href="/" className="shrink-0">
            <Image src="/logo.png" alt="NEO Safety Supplies Ltd" width={300} height={150} priority className="h-12 w-auto sm:h-16 md:h-20" />
          </Link>
          <SearchBar className="hidden flex-1 md:block" />
          <HeaderActions />
        </div>
        <SearchBar className="mt-3 md:hidden" />
      </div>
    </header>
  );
}
