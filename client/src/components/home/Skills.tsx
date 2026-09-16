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
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import { SkeletonSection } from '@/components/ui/SkeletonSection';
import { skillCategories as fallbackSkillCategories } from '@/data/cv-data';
import { skillService } from '@/services/skillService';

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Layout,
  Server,
  Database,
  Wrench,
  Sparkles,
  BookOpen,
};

export function Skills() {
  const { t } = useTranslation();

  const { data: apiSkills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => skillService.getSkills(),
  });

  const activeCategories =
    apiSkills && apiSkills.length > 0
      ? apiSkills.map((c) => ({
          name: c.name,
          icon: c.icon || 'Code2',
          skills: (c.skills || []).map((s) => s.name),
        }))
      : fallbackSkillCategories;

  if (isLoading) {
    return <SkeletonSection />;
  }

  return (
    <section id="skills" className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full">
      <Container>
        <SectionHeading
          title={t('skills.title')}
          subtitle={t('skills.subtitle')}
        />

        {/* Staggered grid — each card slides from alternating directions */}
        <ScrollReveal
          stagger
          staggerDelay={0.1}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 md:gap-6"
        >
          {activeCategories.map((category, idx) => {
            const Icon = iconMap[category.icon] ?? Code2;
            const categoryName = t(`skills.categories.${category.name}`, { defaultValue: category.name });
            // Alternate directions for visual variety
            const directions: Array<'up' | 'left' | 'right'> = ['up', 'left', 'right'];
            const dir = directions[idx % 3]!;

            return (
              <ScrollRevealItem
                key={category.name}
                direction={dir}
                effect="fade"
                distance={40}
              >
                <motion.div
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
              </ScrollRevealItem>
            );
          })}
        </ScrollReveal>
      </Container>
    </section>
  );
}
