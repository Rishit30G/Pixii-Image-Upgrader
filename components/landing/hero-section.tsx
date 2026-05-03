'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fadeUp, stagger } from '@/lib/motion';

export function HeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="max-w-3xl mx-auto px-6 pt-24 pb-16 text-center"
    >
      <motion.div variants={fadeUp} className="mb-6 flex justify-center">
        <Badge
          variant="secondary"
          className="uppercase text-xs tracking-widest p-3 bg-primary/10"
        >
          <Sparkles
            className="size-4 text-primary animate-pulse"
            aria-hidden="true"
          />
          <p className="ml-1">AI photo enhancement</p>
        </Badge>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        className="text-4xl md:text-5xl tracking-tighter text-pretty leading-tight font-normal"
      >
        Upgrade your photos to studio quality in{' '}
        <span className="font-semibold text-primary tracking-tight">
          seconds
        </span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        className="text-base text-muted-foreground mt-4 max-w-lg mx-auto text-pretty"
      >
        Transform ordinary snapshots into high-fidelity assets with
        AI&#8209;powered upscaling and enhancement.
      </motion.p>

      <motion.div variants={fadeUp} className="flex gap-3 justify-center mt-10">
        <Link
          href="/design"
          className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Try It Now
          <ArrowRight className="size-3.5" />
        </Link>
        <a
          href="#showcase"
          className="inline-flex items-center text-sm border border-border px-5 py-2 rounded-full hover:bg-muted transition-colors"
        >
          See Examples
        </a>
      </motion.div>
    </motion.section>
  );
}
