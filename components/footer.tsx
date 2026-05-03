import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-border py-6 px-6 bg-white z-10 sticky">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/">
          <span
            className="text-sm text-muted-foreground flex items-center gap-2"
            translate="no"
          >
            <Image
              src="/files.webp"
              alt="Pixii Logo"
              width={20}
              height={20}
              className="object-contain opacity-80"
            />
            Pixii Image Upgrader
          </span>
        </Link>
        <span className="text-sm text-muted-foreground">
          Made by{' '}
          <Link
            href="https://www.linkedin.com/in/rishit30g/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline"
          >
            Rishit Gupta
          </Link>
        </span>
      </div>
    </footer>
  );
}
