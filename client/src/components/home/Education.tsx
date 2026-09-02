import { motion } from 'framer-motion';
import { GraduationCap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { education as fallbackEducation, languages as fallbackLanguages, type EducationItem, type LanguageItem } from '@/data/cv-data';

export function Education() {
  const { t } = useTranslation();

  const rawEducation = t('education.items', { returnObjects: true });
  const eduList: EducationItem[] = Array.isArray(rawEducation) ? rawEducation : fallbackEducation;

  const rawLanguages = t('education.languages', { returnObjects: true });
  const langList: LanguageItem[] = Array.isArray(rawLanguages) ? rawLanguages : fallbackLanguages;

  return (
    <section id="education" className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full">
      <Container>
        <SectionHeading title={t('education.title')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education — slides from left with blur */}
          <ScrollReveal direction="left" effect="blur" distance={50} duration={0.7}>
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 h-full min-w-0 hover:border-[var(--color-accent)]/40 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0"
                >
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)]" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] break-words">
                  {t('education.eduTitle')}
                </h3>
              </div>
              {eduList.map((edu, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="space-y-1"
                >
                  <h4 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] break-words">
                    {edu.institution}
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--color-accent)] break-words">
                    {edu.degree} {edu.degree ? '– ' : ''}{edu.field}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </ScrollReveal>

          {/* Languages — slides from right with blur */}
          <ScrollReveal direction="right" effect="blur" distance={50} duration={0.7} delay={0.15}>
            <motion.div
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 h-full min-w-0 hover:border-[var(--color-accent-cyan)]/40 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-5">
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-accent-cyan)]/10 flex items-center justify-center shrink-0"
                >
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent-cyan)]" />
                </motion.div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] break-words">
                  {t('education.langTitle')}
                </h3>
              </div>
              <div className="space-y-3">
                {langList.map((lang, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-medium text-xs sm:text-sm text-[var(--color-text-primary)] break-words">
                      {lang.language}
                    </span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                      className="text-xs sm:text-sm text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-2.5 sm:px-3 py-1 rounded-lg shrink-0"
                    >
                      {lang.proficiency}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
