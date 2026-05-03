'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

export function ShowcaseSection() {
  return (
    <motion.section
      id="showcase"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className="max-w-5xl mx-auto px-6 py-16"
    >
      <motion.div variants={fadeUp} className="text-center mb-10">
        <h2 className="text-2xl tracking-tight text-pretty font-medium">
          The Difference
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          From everyday snapshots to studio standards.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-3">
        {/* Before */}
        <div className="relative rounded-xl overflow-hidden border border-border group">
          <span className="absolute top-3 left-3 z-10 text-xs bg-background/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border">
            Before
          </span>
          <Image
            alt="Low-resolution photo before enhancement"
            width={800}
            height={500}
            loading="eager"
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxAj51SVyTKUjg8U1PiBLWsC2cpFRgyrjJ233zQRd0qprfZ6Oqh77bXH5dreBqEBGJaq5RbC859whaO7JxYd1VU4r6sVOYWNo5YmLuZpn_Iun-VutuCz0OYoBohuubhD8vRjXWYtPgPP5p6DVodukKysGnfIDFJLr6In4r-n_XOaBRQqSj4LaqRH5lYgOZhdANeAAgbxEzWpHvz9XJ11o7OZAlu04znysw3zf3y4AyAdp-jgusqeF7evF1DvzHeeQE8INtthEyDvA"
          />
        </div>

        {/* After */}
        <div className="relative rounded-xl overflow-hidden border border-primary/30 group">
          <span className="absolute top-3 left-3 z-10 text-xs bg-primary text-primary-foreground px-2.5 py-1 rounded-full inline-flex items-center gap-1">
            <Sparkles className="size-3" aria-hidden="true" />
            After
          </span>
          <Image
            alt="Enhanced photo after Pixii AI processing"
            width={800}
            height={500}
            loading="eager"
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm0GUJsqlgUGGEbB36aPPHYep91HDt10LO3qBrtzSEb0ccvuUfwLyo3RqjoDY9n5E5taZvsWHY57Gao2OospGDFshcxW9bZO2f9KycyQ5afXd_ukSY7-JplnAxUnVDcHGrNLgGtDJLrvPDOH05sREIX9AHheXh_9yiMPycFqqI_OQlDnSO_OFR_8HsMQ7UBbIE5KQKYNjGn4geNFs2hg9gNnEqYl7NN_Ix9hisjHhUJ9EAnauXwwb5UgdqOlEawAxeHAvygVWRmCw"
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
