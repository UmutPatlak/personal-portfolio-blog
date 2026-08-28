import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { experiences } from '@/data/cv-data';

export function Experience() {
  return (
    <section id="experience" className="py-24">
      <Container>
        <SectionHeading
          title="Experience"
          subtitle="My professional journey building production software."
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-transparent" />

          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-20 pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-accent)] border-4 border-[var(--color-bg-primary)] shadow-[0_0_12px_var(--color-accent)]" />

              {/* Experience Card */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 hover:border-[var(--color-border-hover)] transition-all duration-300 hover:shadow-[var(--shadow-card)]">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[var(--color-accent)]" />
                      {exp.role}
                    </h3>
                    <p className="text-[var(--color-accent)] font-medium mt-1">{exp.company}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm text-[var(--color-text-tertiary)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
                  {exp.description}
                </p>

                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex gap-3 text-sm text-[var(--color-text-secondary)] leading-relaxed"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                      <span>{achievement}</span>
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
