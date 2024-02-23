'use client';

import { cubicBezier, motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: cubicBezier(0.16, 1, 0.3, 1) },
      }}
    >
      {children}
    </motion.div>
  );
}
