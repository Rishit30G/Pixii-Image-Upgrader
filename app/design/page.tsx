import Image from 'next/image';
import Link from 'next/link';
import { PhotoUpgrader } from '@/components/photo-upgrader';
import { DashedGrid } from '@/components/dashed-grid';
import { Footer } from '@/components/footer';

export default function DesignPage() {
  return (
    <div className="min-h-screen w-full relative text-foreground">
      <DashedGrid />

      <div className="relative z-10 flex flex-col min-h-full">
        <div className="w-full bg-background sticky z-10 border-b border-border">
          <Link href="/">
            <header className="px-6 py-5 flex items-center justify-center gap-2 max-w-7xl mx-auto">
              <Image
                src="/files.webp"
                alt="Pixii Logo"
                width={24}
                height={24}
                className="object-contain"
              />
              <h1 className="text-lg tracking-tight">Pixii Image Upgrader</h1>
            </header>
          </Link>
        </div>

        <main className="flex-1 px-6 pb-10 pt-10">
          <PhotoUpgrader />
        </main>
      </div>

      <Footer />
    </div>
  );
}
