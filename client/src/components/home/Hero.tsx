import { motion } from 'framer-motion';
import { Download, Github, Linkedin, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/cv-data';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full flex items-center min-h-[calc(100vh-5rem)]">
      {/* Background glow orbs - bounded within section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-12 -left-12 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[var(--color-accent)]/8 blur-3xl" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[var(--color-accent-secondary)]/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[480px] sm:h-[480px] rounded-full bg-[var(--color-accent-cyan)]/4 blur-3xl" />
      </div>

      <Container className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start min-w-0 w-full"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-[var(--color-accent)] text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-emerald)] animate-pulse" />
              {t('hero.available')}
            </motion.div>

            {/* Title / Greeting */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] mb-3 sm:mb-4 break-words">
              {t('hero.greeting')}{' '}
              <span className="gradient-text inline-block">{personalInfo.name}</span>
            </h1>

            <h2 className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium mb-4 sm:mb-6 leading-normal">
              {t('hero.title')}
            </h2>

            <p className="text-[var(--color-text-secondary)] text-sm sm:text-base md:text-lg leading-relaxed mb-6 max-w-xl break-words">
              {t('hero.bio')}
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-text-tertiary)] mb-6 sm:mb-8">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="break-words">{t('hero.location')}</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full">
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
            </div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end w-full min-w-0"
          >
            <div className="relative flex items-center justify-center">
              {/* Glow ring behind photo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-cyan)] blur-2xl opacity-25 scale-105 pointer-events-none" />

              {/* Photo frame */}
              <div className="relative p-1 sm:p-1.5 rounded-full bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-cyan)] shadow-2xl shadow-[var(--color-accent)]/20">
                <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-full overflow-hidden bg-[var(--color-surface)] border-2 border-[var(--color-bg-primary)]">
                  <img
                    src={`/${personalInfo.photoFileName}`}
                    alt={personalInfo.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
