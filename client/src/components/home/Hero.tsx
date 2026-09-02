import { motion, useScroll, useTransform } from 'framer-motion';
import { Download, Github, Linkedin, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/cv-data';

export function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Parallax glow orbs drift away as user scrolls
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full flex items-center min-h-[calc(100vh-5rem)]"
    >
      {/* Background glow orbs - parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          style={{ y: orbY1, scale: orbScale }}
          className="absolute -top-12 -left-12 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[var(--color-accent)]/8 blur-3xl"
        />
        <motion.div
          style={{ y: orbY2, scale: orbScale }}
          className="absolute -bottom-12 -right-12 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[var(--color-accent-secondary)]/8 blur-3xl"
        />
        <motion.div
          style={{ y: orbY1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[480px] sm:h-[480px] rounded-full bg-[var(--color-accent-cyan)]/4 blur-3xl"
        />
      </div>

      <Container className="relative z-10 w-full">
        <div className="max-w-3xl">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col items-start min-w-0 w-full"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-[var(--color-accent)] text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-emerald)] animate-pulse" />
              {t('hero.available')}
            </motion.div>

            {/* Title / Greeting */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] mb-4 sm:mb-6 break-words"
            >
              {t('hero.greeting')}{' '}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, type: 'spring', stiffness: 120 }}
                className="gradient-text inline-block"
              >
                {personalInfo.name}
              </motion.span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium mb-5 sm:mb-7 leading-relaxed"
            >
              {t('hero.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-[var(--color-text-secondary)] text-sm sm:text-base md:text-lg leading-relaxed mb-7 sm:mb-8 max-w-2xl break-words"
            >
              {t('hero.bio')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-text-tertiary)] mb-6 sm:mb-8"
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="break-words">{t('hero.location')}</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 w-full"
            >
              <a href={`/${personalInfo.cvFileName}`} download className="inline-flex">
                <Button variant="primary" size="lg" icon={<Download className="w-4 h-4" />}>
                  {t('hero.downloadCv')}
                </Button>
              </a>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="secondary" size="lg" icon={<Github className="w-4 h-4" />}>
                  GitHub
                </Button>
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="secondary" size="lg" icon={<Linkedin className="w-4 h-4" />}>
                  LinkedIn
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
