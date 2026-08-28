import { motion } from 'framer-motion';
import { GraduationCap, Globe } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { education, languages } from '@/data/cv-data';

export function Education() {
  return (
    <section id="education" className="py-24">
      <Container>
        <SectionHeading title="Education & Languages" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Education</h3>
            </div>
            {education.map((edu, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-semibold text-[var(--color-text-primary)]">{edu.institution}</h4>
                <p className="text-sm text-[var(--color-accent)]">
                  {edu.degree} in {edu.field}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-cyan)]/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-[var(--color-accent-cyan)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Languages</h3>
            </div>
            <div className="space-y-3">
              {languages.map((lang, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-medium text-[var(--color-text-primary)]">{lang.language}</span>
                  <span className="text-sm text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] px-3 py-1 rounded-lg">
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
