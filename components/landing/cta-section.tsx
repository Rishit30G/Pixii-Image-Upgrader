'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

export function CtaSection() {
  return (
    <section className="py-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="max-w-3xl mx-auto border border-border rounded-3xl px-4 py-10 md:py-10 text-center shadow-lg relative overflow-hidden"
      >
        {/* Amber Glow Background */}
        <div
          className="absolute inset-0 -z-0"
          style={{
            backgroundImage: `
              radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #f59e0b 300%)
            `,
            backgroundSize: '100% 100%',
          }}
        />

        <div className="relative z-10">
          <motion.h2
            variants={fadeUp}
            className="text-3xl tracking-tight text-pretty font-medium"
          >
            Ready to upgrade?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-sm text-muted-foreground mt-3"
          >
            Join thousands saving hours on photo post&#8209;production.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Link
              href="/design"
              className="inline-flex items-center gap-2 text-base bg-primary text-primary-foreground px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity font-medium shadow-xl"
            >
              Get Started
              <ArrowRight className="size-3.5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
