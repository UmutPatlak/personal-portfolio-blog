import { motion } from 'framer-motion';
import { GraduationCap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { education as fallbackEducation, languages as fallbackLanguages, type EducationItem, type LanguageItem } from '@/data/cv-data';

export function Education() {
  const { t } = useTranslation();

  const rawEducation = t('education.items', { returnObjects: true });
  const eduList: EducationItem[] = Array.isArray(rawEducation) ? rawEducation : fallbackEducation;

  const rawLanguages = t('education.languages', { returnObjects: true });
  const langList: LanguageItem[] = Array.isArray(rawLanguages) ? rawLanguages : fallbackLanguages;

  return (
    <section id="education" className="py-12 sm:py-16 md:py-24">
      <Container>
        <SectionHeading title={t('education.title')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 h-full min-w-0 hover:border-[var(--color-accent)]/40 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] break-words">
                {t('education.eduTitle')}
              </h3>
            </div>
            {eduList.map((edu, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] break-words">
                  {edu.institution}
                </h4>
                <p className="text-xs sm:text-sm text-[var(--color-accent)] break-words">
                  {edu.degree} {edu.degree ? '– ' : ''}{edu.field}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 h-full min-w-0 hover:border-[var(--color-accent-cyan)]/40 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-accent-cyan)]/10 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent-cyan)]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] break-words">
                {t('education.langTitle')}
              </h3>
            </div>
            <div className="space-y-3">
              {langList.map((lang, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-xs sm:text-sm text-[var(--color-text-primary)] break-words">
                    {lang.language}
                  </span>
                  <span className="text-xs sm:text-sm text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-2.5 sm:px-3 py-1 rounded-lg shrink-0">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
