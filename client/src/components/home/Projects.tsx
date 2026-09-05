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
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import { projects } from '@/data/cv-data';

const featureIcons = [Cpu, Radio, ShieldCheck, Network];

export function Projects() {
  const { t } = useTranslation();

  const rawItems = t('projects.items', { returnObjects: true });
  const translatedList = Array.isArray(rawItems)
    ? (rawItems as Array<{ title?: string; type?: string; description?: string; highlights?: string[] }>)
    : [];
  const primaryProject = projects[0];
  const otherProjects = projects.slice(1);

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

        {/* Main project card — scale + blur entrance */}
        <ScrollReveal
          direction="up"
          effect="scale"
          distance={40}
          duration={0.7}
          className="relative rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-8 md:p-10 lg:p-12 shadow-xl hover:border-[var(--color-accent)]/30 transition-all duration-300 overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-accent-secondary)]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            {/* Header / Project Identity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 sm:gap-6 pb-6 border-b border-[var(--color-border)]"
            >
              <div className="space-y-2 max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20 mb-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t('projects.featuredBadge')}</span>
                </motion.div>
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
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto"
              >
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
                <Link to="/projects/ocpp-gateway" className="flex-1 sm:flex-initial inline-block">
                  <Button variant="outline" size="md" className="w-full sm:w-auto" icon={<ArrowRight className="w-4 h-4" />}>
                    {t('projects.viewDetails')}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Architecture Highlights Grid — staggered slide from right */}
            <div className="space-y-4">
              <motion.h4
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2"
              >
                <Cpu className="w-5 h-5 text-[var(--color-accent)]" />
                <span>{t('projects.architectureTitle')}</span>
              </motion.h4>

              <ScrollReveal
                stagger
                staggerDelay={0.1}
                delay={0.35}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {architectureFeatures.map((feat, idx) => {
                  const Icon = featureIcons[idx % featureIcons.length] ?? Cpu;
                  return (
                    <ScrollRevealItem
                      key={idx}
                      direction="right"
                      effect="fade"
                      distance={30}
                    >
                      <motion.div
                        whileHover={{ y: -3 }}
                        className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)]/30 transition-all duration-200"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + idx * 0.1, type: 'spring', stiffness: 200 }}
                          className="w-9 h-9 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-3"
                        >
                          <Icon className="w-4 h-4" />
                        </motion.div>
                        <h5 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] mb-1">
                          {feat.title}
                        </h5>
                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                          {feat.description}
                        </p>
                      </motion.div>
                    </ScrollRevealItem>
                  );
                })}
              </ScrollReveal>
            </div>

            {/* Implementation Highlights Checklist — staggered with check icon pop */}
            <div className="space-y-3 pt-2">
              <ScrollReveal
                stagger
                staggerDelay={0.08}
                delay={0.2}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
              >
                {projectHighlights.map((highlight, i) => (
                  <ScrollRevealItem
                    key={i}
                    direction="up"
                    effect="fade"
                    distance={20}
                  >
                    <li
                      className="flex items-start gap-3 p-3.5 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/80 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed list-none"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 400 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-emerald)] shrink-0 mt-0.5" />
                      </motion.span>
                      <span className="flex-1 break-words">{highlight}</span>
                    </li>
                  </ScrollRevealItem>
                ))}
              </ScrollReveal>
            </div>

            {/* Tech Stack — slide up with blur */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center gap-2"
            >
              <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mr-2">
                Tech Stack:
              </span>
              {primaryProject?.stack.map((tech, idx) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + idx * 0.04, duration: 0.3 }}
                >
                  <Badge variant="accent">
                    {tech}
                  </Badge>
                </motion.span>
              ))}
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Other Core Projects Showcase */}
        {otherProjects.length > 0 && (
          <div className="mt-16 sm:mt-20 space-y-8">
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                {t('projects.otherProjectsTitle', 'Diğer Önemli Projeler')}
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
                {t('projects.otherProjectsSubtitle', 'Mikroservis mimarisi, reaktif akışlar ve tam teşekküllü web sistemleri.')}
              </p>
            </div>

            <ScrollReveal
              stagger
              staggerDelay={0.15}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"
            >
              {otherProjects.map((proj, idx) => {
                const trItem = translatedList[idx + 1];
                const title = trItem?.title ?? proj.title;
                const type = trItem?.type ?? proj.type;
                const desc = trItem?.description ?? proj.description;
                const highlights = trItem?.highlights ?? proj.highlights;

                return (
                  <ScrollRevealItem
                    key={proj.title}
                    direction="up"
                    effect="fade"
                    distance={30}
                  >
                    <div className="h-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8 shadow-lg hover:border-[var(--color-accent)]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                      <div className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
                              {type}
                            </span>
                            <h4 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-200">
                              {title}
                            </h4>
                          </div>

                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${title} GitHub`}
                              className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-accent)] hover:border-transparent transition-all duration-200 shrink-0"
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                        </div>

                        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed">
                          {desc}
                        </p>

                        {/* Key Highlights */}
                        <ul className="space-y-2.5 pt-2">
                          {highlights.map((hl, hIdx) => (
                            <li
                              key={hIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-emerald)] shrink-0 mt-0.5" />
                              <span className="flex-1">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6 mt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {proj.stack.map((tech) => (
                            <Badge key={tech} variant="default">
                              {tech}
                            </Badge>
                          ))}
                        </div>

                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              icon={<Github className="w-4 h-4" />}
                            >
                              <span>{t('projects.viewSource', 'Kaynak Kod')}</span>
                              <ExternalLink className="w-3 h-3 ml-1 opacity-70" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </ScrollRevealItem>
                );
              })}
            </ScrollReveal>
          </div>
        )}
      </Container>
    </section>
  );
}
