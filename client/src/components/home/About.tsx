import { motion } from 'framer-motion';
import { Zap, Users, Server, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const statIcons = [Zap, Users, Server, Layers];

export function About() {
  const { t } = useTranslation();

  const rawStats = t('about.stats', { returnObjects: true });
  const statsList = Array.isArray(rawStats)
    ? (rawStats as Array<{ value: string; label: string; detail: string }>)
    : [
        { value: '1,200+', label: 'EV Stations Managed', detail: 'Production scale across Turkey' },
        { value: '~20', label: 'Team Members', detail: 'Cross-functional engineering & QA' },
        { value: '70+', label: 'REST Endpoints', detail: 'Designed & implemented end-to-end' },
        { value: 'SaaS', label: 'Multi-Tenant Architecture', detail: 'Strict data isolation & security' },
      ];

  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full">
      <Container>
        <SectionHeading
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-4 sm:space-y-5 text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed"
          >
            <p className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              {t('about.paragraph1')}
            </p>
            <p className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
              {t('about.paragraph2')}
            </p>
          </motion.div>

          {/* Key Stats / Metrics Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5"
          >
            {statsList.map((stat, idx) => {
              const Icon = statIcons[idx % statIcons.length] ?? Zap;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5 md:p-6 hover:border-[var(--color-accent)]/40 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 min-w-0"
                >
                  <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-[var(--color-accent)]/5 rounded-bl-full pointer-events-none group-hover:bg-[var(--color-accent)]/10 transition-colors" />

                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                      {stat.value}
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/20 transition-colors shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <h3 className="font-semibold text-xs sm:text-sm md:text-base text-[var(--color-text-primary)] mb-0.5 sm:mb-1 break-words">
                    {stat.label}
                  </h3>
                  <p className="text-xs text-[var(--color-text-tertiary)] leading-tight sm:leading-snug break-words">
                    {stat.detail}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
