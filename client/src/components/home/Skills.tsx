import { motion } from 'framer-motion';
import {
  Code2,
  Layout,
  Server,
  Database,
  Wrench,
  Sparkles,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { skillCategories } from '@/data/cv-data';

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Layout,
  Server,
  Database,
  Wrench,
  Sparkles,
  BookOpen,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Skills() {
  const { t } = useTranslation();

  return (
    <section id="skills" className="py-12 sm:py-16 md:py-24">
      <Container>
        <SectionHeading
          title={t('skills.title')}
          subtitle={t('skills.subtitle')}
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6"
        >
          {skillCategories.map((category) => {
            const Icon = iconMap[category.icon] ?? Code2;
            const categoryName = t(`skills.categories.${category.name}`, { defaultValue: category.name });

            return (
              <motion.div
                key={category.name}
                variants={item}
                whileHover={{ y: -3 }}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 hover:border-[var(--color-accent)]/40 transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] min-w-0"
              >
                <div className="flex items-center gap-3 mb-3.5 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors duration-200 shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] break-words">
                    {categoryName}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/30 transition-all duration-200 cursor-default break-normal"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
