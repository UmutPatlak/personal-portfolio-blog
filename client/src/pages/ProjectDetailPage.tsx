import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Cpu,
  Radio,
  ShieldCheck,
  Network,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  Database,
  Globe,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ScrollReveal, ScrollRevealItem } from '@/components/ui/ScrollReveal';
import { projects } from '@/data/cv-data';

const featureIcons = [Cpu, Radio, ShieldCheck, Network];

const challengeIcons = [AlertTriangle, Lightbulb];

const techDetailIcons: Record<string, typeof Code2> = {
  React: Code2,
  Vite: Zap,
  TypeScript: Code2,
  'Tailwind CSS': Globe,
  'react-router': Globe,
  'react-i18next': Globe,
  NestJS: Database,
  'Drizzle ORM': Database,
  PostgreSQL: Database,
};

export function ProjectDetailPage() {
  const { t } = useTranslation();
  const project = projects[0]!;

  const rawFeatures = t('projects.features', { returnObjects: true });
  const architectureFeatures = Array.isArray(rawFeatures)
    ? (rawFeatures as Array<{ title: string; description: string }>)
    : [];

  const rawChallenges = t('projectDetail.challenges', { returnObjects: true });
  const challenges = Array.isArray(rawChallenges)
    ? (rawChallenges as Array<{ problem: string; solution: string }>)
    : [];

  const rawItems = t('projects.items', { returnObjects: true });
  const translatedList = Array.isArray(rawItems)
    ? (rawItems as Array<{ title?: string; type?: string; description?: string; highlights?: string[] }>)
    : [];

  const projectTitle = translatedList[0]?.title ?? project.title;
  const projectType = translatedList[0]?.type ?? project.type;
  const projectDesc = translatedList[0]?.description ?? project.description;
  const projectHighlights: string[] = translatedList[0]?.highlights ?? project.highlights;

  return (
    <div className="w-full overflow-x-hidden pb-12 sm:pb-16">
      <SEO
        title={`${project.title} — Case Study`}
        description={project.description}
        url="/projects/ocpp-gateway"
        keywords={['OCPP', 'Gateway', 'Admin Panel', 'React', 'NestJS', 'TypeScript', ...project.stack]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-24 w-full">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-12 -left-12 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[var(--color-accent)]/8 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[var(--color-accent-secondary)]/8 blur-3xl" />
        </div>

        <Container className="relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Link to="/#projects">
              <Button
                variant="ghost"
                size="sm"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                {t('projectDetail.backToHome')}
              </Button>
            </Link>
          </motion.div>

          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('projectDetail.caseStudyBadge')}</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--color-text-primary)] leading-tight">
              {projectTitle}
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-accent-secondary)] font-medium">
              {projectType}
            </p>

            <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-3xl">
              {projectDesc}
            </p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 pt-4"
            >
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={<Github className="w-4 h-4" />}
                  >
                    {t('projects.viewSource')}
                  </Button>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<ExternalLink className="w-4 h-4" />}
                  >
                    {t('projects.viewDemo')}
                  </Button>
                </a>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Architecture Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 w-full">
        <Container>
          <ScrollReveal
            direction="up"
            effect="fade"
            distance={30}
            duration={0.6}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                {t('projectDetail.architectureTitle')}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-8 max-w-3xl">
              {t('projectDetail.architectureDesc')}
            </p>
          </ScrollReveal>

          {/* Architecture Cards */}
          <ScrollReveal
            stagger
            staggerDelay={0.12}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
          >
            {architectureFeatures.map((feat, idx) => {
              const Icon = featureIcons[idx % featureIcons.length] ?? Cpu;
              return (
                <ScrollRevealItem
                  key={idx}
                  direction="up"
                  effect="fade"
                  distance={25}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="h-full p-5 sm:p-7 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/30 hover:shadow-[var(--shadow-card-hover)] transition-all duration-300"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.1, type: 'spring', stiffness: 200 }}
                      className="w-11 h-11 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-4"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <h3 className="font-bold text-base sm:text-lg text-[var(--color-text-primary)] mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {feat.description}
                    </p>
                  </motion.div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>
        </Container>
      </section>

      {/* Challenges & Solutions Section */}
      {challenges.length > 0 && (
        <section className="relative overflow-hidden py-12 sm:py-16 w-full">
          <Container>
            <ScrollReveal
              direction="up"
              effect="fade"
              distance={30}
              duration={0.6}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-secondary)]/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[var(--color-accent-secondary)]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                  {t('projectDetail.challengesTitle')}
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal
              stagger
              staggerDelay={0.15}
              className="space-y-5"
            >
              {challenges.map((challenge, idx) => {
                const ProblemIcon = challengeIcons[0]!;
                const SolutionIcon = challengeIcons[1]!;

                return (
                  <ScrollRevealItem
                    key={idx}
                    direction="up"
                    effect="fade"
                    distance={20}
                  >
                    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7 hover:border-[var(--color-accent)]/20 transition-all duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Problem */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <ProblemIcon className="w-4 h-4 text-amber-500" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1 block">
                              {t('projectDetail.problemLabel')}
                            </span>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                              {challenge.problem}
                            </p>
                          </div>
                        </div>

                        {/* Solution */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-emerald)]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <SolutionIcon className="w-4 h-4 text-[var(--color-accent-emerald)]" />
                          </div>
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent-emerald)] mb-1 block">
                              {t('projectDetail.solutionLabel')}
                            </span>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                              {challenge.solution}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollRevealItem>
                );
              })}
            </ScrollReveal>
          </Container>
        </section>
      )}

      {/* Implementation Highlights */}
      <section className="relative overflow-hidden py-12 sm:py-16 w-full">
        <Container>
          <ScrollReveal
            direction="up"
            effect="fade"
            distance={30}
            duration={0.6}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-emerald)]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-accent-emerald)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                {t('projectDetail.highlightsTitle')}
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal
            stagger
            staggerDelay={0.08}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {projectHighlights.map((highlight, i) => (
              <ScrollRevealItem
                key={i}
                direction="up"
                effect="fade"
                distance={20}
              >
                <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)]/80 hover:border-[var(--color-accent-emerald)]/30 transition-all duration-200">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 400 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-emerald)] shrink-0 mt-0.5" />
                  </motion.span>
                  <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed break-words flex-1">
                    {highlight}
                  </span>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollReveal>
        </Container>
      </section>

      {/* Tech Stack Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 w-full">
        <Container>
          <ScrollReveal
            direction="up"
            effect="fade"
            distance={30}
            duration={0.6}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-cyan)]/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-[var(--color-accent-cyan)]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                {t('projectDetail.techStackTitle')}
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal
            stagger
            staggerDelay={0.08}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {project.stack.map((tech, idx) => {
              const Icon = techDetailIcons[tech] ?? Code2;
              return (
                <ScrollRevealItem
                  key={tech}
                  direction="up"
                  effect="fade"
                  distance={20}
                >
                  <motion.div
                    whileHover={{ y: -3, scale: 1.02 }}
                    className="flex items-center gap-3 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent-cyan)]/30 transition-all duration-200"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.05, type: 'spring', stiffness: 300 }}
                      className="w-9 h-9 rounded-lg bg-[var(--color-accent-cyan)]/10 flex items-center justify-center shrink-0"
                    >
                      <Icon className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                    </motion.div>
                    <span className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)]">
                      {tech}
                    </span>
                  </motion.div>
                </ScrollRevealItem>
              );
            })}
          </ScrollReveal>

          {/* Tech Stack Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center gap-2"
          >
            <span className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mr-2">
              {t('projectDetail.fullStackLabel', 'Full Stack:')}
            </span>
            {project.stack.map((tech) => (
              <Badge key={tech} variant="accent">
                {tech}
              </Badge>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 sm:py-16 w-full">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
              {t('projectDetail.ctaTitle')}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<Github className="w-4 h-4" />}
                  >
                    {t('projects.viewSource')}
                  </Button>
                </a>
              )}
              <Link to="/#projects">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  {t('projectDetail.backToHome')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
