import { motion } from 'framer-motion';
import {
  Github,
  ExternalLink,
  Layers,
  Cpu,
  Radio,
  ShieldCheck,
  Network,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { projects } from '@/data/cv-data';

const featureIcons = [Cpu, Radio, ShieldCheck, Network];

export function Projects() {
  const { t } = useTranslation();

  const rawItems = t('projects.items', { returnObjects: true });
  const translatedList = Array.isArray(rawItems)
    ? (rawItems as Array<{ title?: string; type?: string; description?: string; highlights?: string[] }>)
    : [];
  const primaryProject = projects[0];

  const projectTitle = translatedList[0]?.title ?? primaryProject?.title ?? 'OCPP Gateway Admin Panel';
  const projectType = translatedList[0]?.type ?? primaryProject?.type ?? 'Solo Full-Stack Project';
  const projectDesc = translatedList[0]?.description ?? primaryProject?.description ?? '';
  const projectHighlights: string[] = translatedList[0]?.highlights ?? primaryProject?.highlights ?? [];

  const rawFeatures = t('projects.features', { returnObjects: true });
  const architectureFeatures = Array.isArray(rawFeatures)
    ? (rawFeatures as Array<{ title: string; description: string }>)
    : [
        {
          title: 'Mock-First API Architecture',
          description:
            'Single GatewayApi TypeScript interface backed by both mockApi.ts and realApi.ts, catching drift at compile time.',
        },
        {
          title: 'Real-Time SSE Streaming',
          description:
            'Live station telemetry and connectivity status over Server-Sent Events with unified subscription handlers.',
        },
        {
          title: 'Hardened Auth & Security',
          description:
            'JWT with in-memory token store mirrored to sessionStorage (narrower XSS surface) & centralized auto-logout.',
        },
        {
          title: '70+ REST Endpoints',
          description:
            'Full lifecycle modeling for station registration, OCPP admin commands, configuration mappings, and tenant isolation.',
        },
      ];

  return (
    <section id="projects" className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full">
      <Container>
        <SectionHeading
          title={t('projects.title')}
          subtitle={t('projects.subtitle')}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8 md:p-10 lg:p-12 shadow-xl hover:border-[var(--color-accent)]/30 transition-all duration-300 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-accent-secondary)]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Header / Project Identity */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 sm:gap-6 pb-6 border-b border-[var(--color-border)]">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('projects.featuredBadge')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                  {projectTitle}
                </h3>
                <p className="text-xs sm:text-sm md:text-base font-medium text-[var(--color-accent-secondary)]">
                  {projectType}
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[var(--color-text-secondary)] leading-relaxed pt-1 sm:pt-2">
                  {projectDesc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto">
                {primaryProject?.githubUrl && (
                  <a
                    href={primaryProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-block"
                  >
                    <Button variant="secondary" size="md" className="w-full sm:w-auto" icon={<Github className="w-4 h-4" />}>
                      {t('projects.viewSource')}
                    </Button>
                  </a>
                )}
                {primaryProject?.demoUrl && (
                  <a
                    href={primaryProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial inline-block"
                  >
                    <Button variant="primary" size="md" className="w-full sm:w-auto" icon={<ExternalLink className="w-4 h-4" />}>
                      {t('projects.viewDemo')}
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Architecture Highlights Grid */}
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[var(--color-accent)]" />
                <span>{t('projects.architectureTitle')}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {architectureFeatures.map((feat, idx) => {
                  const Icon = featureIcons[idx % featureIcons.length] ?? Cpu;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)]/30 transition-all duration-200"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h5 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] mb-1">
                        {feat.title}
                      </h5>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {feat.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Implementation Highlights Checklist */}
            <div className="space-y-3 pt-2">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {projectHighlights.map((highlight, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/80 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-emerald)] shrink-0 mt-0.5" />
                    <span className="flex-1 break-words">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mr-2">
                Tech Stack:
              </span>
              {primaryProject?.stack.map((tech) => (
                <Badge key={tech} variant="accent">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
