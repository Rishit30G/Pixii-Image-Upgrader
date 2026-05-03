'use client';

import { motion } from 'motion/react';
import { Upload, Sparkles, Download } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

const steps = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Drop your low-res or poorly lit photos onto the canvas.',
  },
  {
    icon: Sparkles,
    title: 'Enhance',
    description:
      'AI rebuilds details, corrects lighting, and refines the image.',
  },
  {
    icon: Download,
    title: 'Download',
    description: 'Export studio-quality assets ready for professional use.',
  },
];

export function HowItWorksSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
      className="bg-muted/50 py-20"
    >
      <div className="max-w-4xl mx-auto px-6">
        <motion.div variants={fadeUp} className="text-center mb-12">
          <h2 className="text-2xl font-medium tracking-tight text-pretty">
            How it works
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Three steps to professional imagery.
          </p>
        </motion.div>

        <motion.div variants={stagger} className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              className="bg-background border border-border rounded-xl p-6 text-center"
            >
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <step.icon className="size-4" aria-hidden="true" />
              </div>
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-base tracking-tight mb-2 font-medium">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
