import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ title, subtitle, align = 'left' }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`mb-10 sm:mb-14 lg:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-3 sm:mb-4 break-words">
        {title}
        <span className="gradient-text">.</span>
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] max-w-2xl leading-relaxed break-words"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: align === 'center' ? 'center' : 'left' }}
        className={`mt-4 sm:mt-5 h-1 w-12 sm:w-16 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </motion.div>
  );
}
