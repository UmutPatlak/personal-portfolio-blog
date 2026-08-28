import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${align === 'center' ? 'text-center' : ''}`}
    >
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-3">
        {title}
        <span className="gradient-text">.</span>
      </h2>
      {subtitle && (
        <p className="text-[var(--color-text-secondary)] text-lg max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)]" />
    </motion.div>
  );
}
