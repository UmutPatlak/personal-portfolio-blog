import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { experiences as fallbackExperiences, type ExperienceItem } from '@/data/cv-data';

export function Experience() {
  const { t } = useTranslation();
  const rawItems = t('experience.items', { returnObjects: true });
  const experienceItems: ExperienceItem[] = Array.isArray(rawItems) ? rawItems : fallbackExperiences;

  return (
    <section id="experience" className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full">
      <Container>
        <SectionHeading
          title={t('experience.title')}
          subtitle={t('experience.subtitle')}
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-2.5 sm:left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-transparent" />

          {experienceItems.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-6 sm:pl-10 md:pl-14 pb-8 sm:pb-12 last:pb-0 w-full min-w-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-2.5 sm:left-4 md:left-6 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[var(--color-accent)] border-2 sm:border-4 border-[var(--color-bg-primary)] shadow-[0_0_12px_var(--color-accent)]" />

              {/* Experience Card */}
              <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 md:p-8 hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-5">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2 break-words">
                      <Briefcase className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                      <span className="break-words">{exp.role}</span>
                    </h3>
                    <p className="text-[var(--color-accent)] font-medium mt-1 text-sm sm:text-base break-words">
                      {exp.company}
                    </p>
                  </div>
                  <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 sm:gap-1 text-xs sm:text-sm text-[var(--color-text-tertiary)] shrink-0">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-[var(--color-text-secondary)] text-sm sm:text-base leading-relaxed mb-6 break-words">
                  {exp.description}
                </p>

                <ul className="space-y-3 w-full">
                  {exp.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex gap-2.5 sm:gap-3 items-start text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed"
                    >
                      <span className="mt-1.5 sm:mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                      <span className="min-w-0 flex-1 break-words">{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
