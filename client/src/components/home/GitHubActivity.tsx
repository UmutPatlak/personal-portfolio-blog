import { motion } from 'framer-motion';
import { Github, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useTheme } from '@/hooks/useTheme';
import { personalInfo } from '@/data/cv-data';

const GITHUB_USERNAME = 'UmutPatlak';

export function GitHubActivity() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // ghchart.rshah.org renders a contribution heatmap SVG with custom color
  // Use accent color (indigo-ish) for dark mode, slightly darker for light mode
  const chartColor = theme === 'light' ? '4f46e5' : '6366f1';
  const chartUrl = `https://ghchart.rshah.org/${chartColor}/${GITHUB_USERNAME}`;

  return (
    <section id="github-activity" className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full">
      <Container>
        <SectionHeading
          title={t('github.title')}
          subtitle={t('github.subtitle')}
        />

        <ScrollReveal
          direction="up"
          effect="scale"
          distance={40}
          duration={0.7}
          className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8 md:p-10 shadow-xl hover:border-[var(--color-accent)]/30 transition-all duration-300 overflow-hidden"
        >
          {/* Background ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--color-accent-secondary)]/5 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                    @{GITHUB_USERNAME}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)]">
                    {t('github.contributionLabel', 'Contribution Activity')}
                  </p>
                </div>
              </div>

              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Github className="w-4 h-4" />}
                >
                  {t('github.viewProfile')}
                </Button>
              </a>
            </motion.div>

            {/* Contribution Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 p-4 sm:p-6"
            >
              <img
                src={chartUrl}
                alt={`${GITHUB_USERNAME}'s GitHub contribution graph`}
                className="w-full min-w-[680px] h-auto"
                loading="lazy"
                style={{
                  filter: theme === 'dark' ? 'brightness(1.1)' : 'none',
                }}
              />
            </motion.div>

            {/* Legend / Info */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-[var(--color-border)]"
            >
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                <span>{t('github.less', 'Less')}</span>
                <div className="flex items-center gap-1">
                  {[0.1, 0.25, 0.5, 0.75, 1].map((opacity, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        background: `var(--color-accent)`,
                        opacity,
                      }}
                    />
                  ))}
                </div>
                <span>{t('github.more', 'More')}</span>
              </div>

              <p className="text-xs text-[var(--color-text-tertiary)]">
                {t('github.dataSource', 'Data from GitHub contributions')}
              </p>
            </motion.div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
