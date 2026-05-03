import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center h-14 px-6 max-w-5xl mx-auto">
        <span
          className="text-xl tracking-tight flex items-center gap-2"
          translate="no"
        >
          <Image
            src="/files.webp"
            alt="Pixii Logo"
            width={24}
            height={24}
            className="object-contain"
          />
          Pixii Image Upgrader
        </span>
        <Link
          href="/design"
          className="text-sm tracking-tight text-primary-foreground bg-primary px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity shadow-md"
        >
          Get Started
          <ArrowRight className="size-3.5 inline-block ml-1" />
        </Link>
      </div>
    </nav>
  );
}
