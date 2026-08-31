import { motion } from 'framer-motion';
import { Download, Github, Linkedin, MapPin, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/cv-data';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-[var(--color-accent-secondary)]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] lg:w-[600px] h-80 sm:h-[500px] lg:h-[600px] bg-[var(--color-accent-cyan)]/3 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-start min-w-0 w-full"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-[var(--color-accent)] text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-emerald)] animate-pulse" />
              {t('hero.available')}
            </motion.div>

            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] mb-3 sm:mb-4 break-words">
              {t('hero.greeting')}{' '}
              <span className="gradient-text inline-block">{personalInfo.name}</span>
            </h1>

            <h2 className="text-lg sm:text-xl md:text-2xl text-[var(--color-text-secondary)] font-medium mb-4 sm:mb-6 leading-normal">
              {t('hero.title')}
            </h2>

            <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed mb-6 max-w-xl break-words">
              {t('hero.bio')}
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-text-tertiary)] mb-6 sm:mb-8">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="break-words">{t('hero.location')}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full">
              <a href={`/${personalInfo.cvFileName}`} download className="w-full xs:w-auto inline-block">
                <Button variant="primary" size="lg" className="w-full xs:w-auto" icon={<Download className="w-4 h-4" />}>
                  {t('hero.downloadCv')}
                </Button>
              </a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex-1 xs:flex-none inline-block">
                <Button variant="secondary" size="lg" className="w-full xs:w-auto" icon={<Github className="w-4 h-4" />}>
                  GitHub
                </Button>
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 xs:flex-none inline-block">
                <Button variant="secondary" size="lg" className="w-full xs:w-auto" icon={<Linkedin className="w-4 h-4" />}>
                  LinkedIn
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="order-1 lg:order-2 lg:col-span-5 flex justify-center lg:justify-end w-full min-w-0 mb-4 lg:mb-0"
          >
            <div className="relative flex items-center justify-center">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-cyan)] blur-2xl opacity-25 scale-105 pointer-events-none" />

              {/* Photo container */}
              <div className="relative p-1 sm:p-1.5 rounded-full bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-cyan)] shadow-2xl shadow-[var(--color-accent)]/20">
                <div className="w-40 h-40 xs:w-52 xs:h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-full overflow-hidden bg-[var(--color-surface)] border-2 border-[var(--color-bg-primary)]">
                  <img
                    src={`/${personalInfo.photoFileName}`}
                    alt={personalInfo.name}
                    width={384}
                    height={384}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Floating decorations */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-2 right-0 sm:-top-3 sm:right-2 w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-[var(--color-surface)]/90 border border-[var(--color-accent)]/30 backdrop-blur-md flex items-center justify-center text-base sm:text-lg shadow-lg pointer-events-none select-none"
              >
                ⚡
              </motion.div>
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-2 left-0 sm:-bottom-3 sm:left-2 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[var(--color-surface)]/90 border border-[var(--color-accent-secondary)]/30 backdrop-blur-md flex items-center justify-center text-lg sm:text-xl shadow-lg pointer-events-none select-none"
              >
                🚀
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden lg:flex absolute bottom-4 xl:bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 pointer-events-none"
        >
          <span className="text-xs text-[var(--color-text-muted)] tracking-wider uppercase font-medium">{t('hero.scrollDown')}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
