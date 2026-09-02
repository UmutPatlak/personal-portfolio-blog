import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
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
          {/* Timeline line — animated grow */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: 'top' }}
            className="absolute left-2.5 sm:left-4 md:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-transparent"
          />

          {experienceItems.map((exp, index) => (
            <ScrollReveal
              key={index}
              direction="left"
              effect="slide"
              delay={index * 0.15}
              distance={50}
              duration={0.6}
              className="relative pl-6 sm:pl-10 md:pl-14 pb-8 sm:pb-12 last:pb-0 w-full min-w-0"
            >
              {/* Timeline dot — pops in */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute left-2.5 sm:left-4 md:left-6 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[var(--color-accent)] border-2 sm:border-4 border-[var(--color-bg-primary)] shadow-[0_0_12px_var(--color-accent)]"
              />

              {/* Experience Card */}
              <div className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 md:p-8 hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
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

                <ul className="space-y-3.5 w-full">
                  {exp.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                      className="flex gap-2.5 sm:gap-3 items-start text-xs sm:text-sm md:text-base text-[var(--color-text-secondary)] leading-relaxed"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.06, type: 'spring', stiffness: 400 }}
                        className="mt-1.5 sm:mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0"
                      />
                      <span className="min-w-0 flex-1 break-words">{achievement}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
