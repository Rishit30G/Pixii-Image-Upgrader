/**
 * Shared Framer Motion animation variants used across landing page sections.
 */

export const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};
