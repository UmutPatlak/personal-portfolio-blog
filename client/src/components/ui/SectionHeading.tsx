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
      className={`mb-8 sm:mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2 sm:mb-3 break-words">
        {title}
        <span className="gradient-text">.</span>
      </h2>
      {subtitle && (
        <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl break-words">
          {subtitle}
        </p>
      )}
      <div
        className={`mt-3 sm:mt-4 h-1 w-12 sm:w-16 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </motion.div>
  );
}
