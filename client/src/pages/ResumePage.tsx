import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Languages,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SkeletonSection } from '@/components/ui/SkeletonSection';
import { personalInfoService } from '@/services/personalInfoService';
import { experienceService } from '@/services/experienceService';
import { educationService } from '@/services/educationService';
import { skillService } from '@/services/skillService';
import { projectService } from '@/services/projectService';
import {
  personalInfo as fallbackPersonalInfo,
  experiences as fallbackExperiences,
  education as fallbackEducation,
  languages as fallbackLanguages,
  skillCategories as fallbackSkillCategories,
  projects as fallbackProjects,
  type ExperienceItem,
} from '@/data/cv-data';

export function ResumePage() {
  const { t, i18n } = useTranslation();
  const isTr = i18n.language.startsWith('tr');

  // Interactive UI States
  const [activeFilter, setActiveFilter] = useState<'all' | 'backend' | 'frontend' | 'devops'>('all');
  const [isCompactMode, setIsCompactMode] = useState(false);

  // Queries with graceful fallbacks to static cv-data
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => personalInfoService.getPersonalInfo(),
  });

  const { data: rawExperiences, isLoading: isExpLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => experienceService.getExperiences(),
  });

  const { data: rawEdu, isLoading: isEduLoading } = useQuery({
    queryKey: ['education'],
    queryFn: () => educationService.getEducation(),
  });

  const { data: rawSkills, isLoading: isSkillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => skillService.getSkills(),
  });

  const { data: rawProjects, isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  const isLoading = isExpLoading || isEduLoading || isSkillsLoading || isProjectsLoading;

  // Personal Info data
  const personal = {
    name: profile?.name || fallbackPersonalInfo.name,
    title: profile?.title || fallbackPersonalInfo.title,
    email: profile?.email || fallbackPersonalInfo.email,
    phone: profile?.phone || fallbackPersonalInfo.phone,
    location: profile?.location || fallbackPersonalInfo.location,
    bio: profile?.bio || fallbackPersonalInfo.bio,
    github: profile?.githubUrl || fallbackPersonalInfo.github,
    linkedin: profile?.linkedinUrl || fallbackPersonalInfo.linkedin,
    cvUrl: profile?.cvUrl || `/${fallbackPersonalInfo.cvFileName}`,
  };

  // Experiences List (Supports TR localized content if available)
  const experienceItems: ExperienceItem[] = useMemo(() => {
    if (isTr) {
      const trList = t('experience.items', { returnObjects: true });
      if (Array.isArray(trList) && trList.length > 0) {
        return trList as ExperienceItem[];
      }
    }
    const source = rawExperiences && rawExperiences.length > 0 ? rawExperiences : fallbackExperiences;
    return source.map((exp: any) => ({
      company: exp.company,
      role: exp.role || exp.position,
      location: exp.location || '',
      period: exp.period || `${exp.startDate} – ${exp.endDate || (isTr ? 'Günümüz' : 'Present')}`,
      description: exp.description || '',
      achievements: Array.isArray(exp.achievements)
        ? exp.achievements.map((a: any) => (typeof a === 'string' ? a : a.content || ''))
        : [],
    }));
  }, [rawExperiences, isTr, t]);

  interface ResumeProject {
    title: string;
    type: string;
    stack: string[];
    description: string;
    highlights: string[];
    githubUrl?: string;
    demoUrl?: string;
  }

  // Projects List (Supports TR localized content if available)
  const projectList: ResumeProject[] = useMemo(() => {
    if (isTr) {
      const rawTr = t('projects.items', { returnObjects: true });
      if (Array.isArray(rawTr) && rawTr.length > 0) {
        return fallbackProjects.map((p, idx) => {
          const trItem = rawTr[idx] as { title?: string; type?: string; description?: string; highlights?: string[] } | undefined;
          return {
            title: trItem?.title || p.title,
            type: trItem?.type || p.type,
            stack: p.stack,
            description: trItem?.description || p.description,
            highlights: trItem?.highlights || p.highlights,
            githubUrl: p.githubUrl,
            demoUrl: p.demoUrl,
          };
        });
      }
    }
    if (rawProjects && rawProjects.length > 0) {
      return rawProjects.map((p) => ({
        title: p.title,
        type: p.type || 'Solo Project',
        stack: p.technologies || [],
        description: p.description,
        highlights: p.challenges || [],
        githubUrl: p.githubUrl || undefined,
        demoUrl: p.demoUrl || undefined,
      }));
    }
    return fallbackProjects;
  }, [rawProjects, isTr, t]);

  // Skill Categories & Filter
  const skillCategoryList = useMemo(() => {
    const list =
      rawSkills && rawSkills.length > 0
        ? rawSkills.map((c) => ({
            name: c.name,
            icon: c.icon || 'Code2',
            skills: (c.skills || []).map((s) => s.name),
          }))
        : fallbackSkillCategories;

    if (activeFilter === 'all') return list;

    if (activeFilter === 'backend') {
      return list.filter((c) =>
        ['Backend', 'Database', 'Languages', 'Concepts'].includes(c.name)
      );
    }
    if (activeFilter === 'frontend') {
      return list.filter((c) =>
        ['Frontend', 'Languages', 'Tools & CI/CD'].includes(c.name)
      );
    }
    if (activeFilter === 'devops') {
      return list.filter((c) =>
        ['Tools & CI/CD', 'Database', 'AI & Productivity'].includes(c.name)
      );
    }
    return list;
  }, [rawSkills, activeFilter]);

  // Education & Languages
  const eduList = useMemo(() => {
    if (isTr) {
      const rawTrEdu = t('education.items', { returnObjects: true });
      if (Array.isArray(rawTrEdu) && rawTrEdu.length > 0) {
        return rawTrEdu as Array<{ institution: string; degree: string; field: string }>;
      }
    }
    const list = rawEdu?.education && rawEdu.education.length > 0 ? rawEdu.education : fallbackEducation;
    return list.map((e: any) => ({
      institution: e.institution || e.school,
      degree: e.degree,
      field: e.field || e.department,
    }));
  }, [rawEdu, isTr, t]);

  const langList = useMemo(() => {
    if (isTr) {
      const rawTrLang = t('education.languages', { returnObjects: true });
      if (Array.isArray(rawTrLang) && rawTrLang.length > 0) {
        return rawTrLang as Array<{ language: string; proficiency: string }>;
      }
    }
    const list = rawEdu?.languages && rawEdu.languages.length > 0 ? rawEdu.languages : fallbackLanguages;
    return list.map((l: any) => ({
      language: l.language || l.name,
      proficiency: l.proficiency || l.level,
    }));
  }, [rawEdu, isTr, t]);

  // Handlers
  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('resume.copied'));
    } catch {
      toast.error('Could not copy link');
    }
  };

  if (isLoading) {
    return (
      <Container className="py-20">
        <SkeletonSection />
      </Container>
    );
  }

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 pb-20 text-[var(--color-text-primary)]">
      <SEO
        title={t('resume.pageTitle')}
        description={t('resume.pageDesc')}
        url="/resume"
      />

      {/* ─── Recruiter Action Bar (Screen Only - Hidden in Print) ─── */}
      <section
        aria-label="Resume Action Bar"
        className="no-print print-hidden sticky top-16 z-40 mb-8 backdrop-blur-md bg-[var(--color-bg-primary)]/80 border-b border-[var(--color-border)] py-3 transition-all"
      >
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Navigation and Mode Switch */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('resume.backToHome')}</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsCompactMode(!isCompactMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium border transition-all cursor-pointer ${
                  isCompactMode
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title="Toggle Compact ATS View"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {isCompactMode
                    ? t('resume.toggleView.compact')
                    : t('resume.toggleView.detailed')}
                </span>
              </button>
            </div>

            {/* Middle: Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              {(
                [
                  { id: 'all', label: t('resume.filter.all') },
                  { id: 'backend', label: t('resume.filter.backend') },
                  { id: 'frontend', label: t('resume.filter.frontend') },
                  { id: 'devops', label: t('resume.filter.devops') },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-[var(--color-accent)] text-white shadow-xs'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Right: Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={personal.cvUrl}
                download
                className="inline-flex"
                title={t('resume.downloadPdf')}
              >
                <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
                  {t('resume.downloadPdf')}
                </Button>
              </a>

              <Button
                variant="secondary"
                size="sm"
                icon={<Printer className="w-3.5 h-3.5" />}
                onClick={handlePrint}
                title={t('resume.printCv')}
              >
                {t('resume.printCv')}
              </Button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
                title={t('resume.copyLink')}
                aria-label={t('resume.copyLink')}
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Recruiter Key Highlights Cards (Screen Only, Hidden in Compact/Print) ─── */}
      {!isCompactMode && (
        <Container className="no-print print-hidden mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3.5 sm:p-4 hover:border-[var(--color-accent)]/30 transition-all">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-accent)] tracking-tight">
                {t('resume.stats.stations')}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-snug">
                {t('resume.stats.stationsDesc')}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3.5 sm:p-4 hover:border-[var(--color-accent-secondary)]/30 transition-all">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-accent-secondary)] tracking-tight">
                {t('resume.stats.endpoints')}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-snug">
                {t('resume.stats.endpointsDesc')}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3.5 sm:p-4 hover:border-[var(--color-accent-cyan)]/30 transition-all">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-accent-cyan)] tracking-tight">
                {t('resume.stats.architecture')}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-snug">
                {t('resume.stats.architectureDesc')}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-3.5 sm:p-4 hover:border-[var(--color-accent-emerald)]/30 transition-all">
              <div className="text-xl sm:text-2xl font-extrabold text-[var(--color-accent-emerald)] tracking-tight">
                {t('resume.stats.team')}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-snug">
                {t('resume.stats.teamDesc')}
              </p>
            </div>
          </div>
        </Container>
      )}

      {/* ─── Main Paper / Document Container ─── */}
      <Container>
        <motion.article
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="resume-paper max-w-4xl mx-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 shadow-2xl p-6 sm:p-10 md:p-12 relative overflow-hidden print:p-0 print:border-none print:shadow-none print:bg-white"
        >
          {/* Subtle Document Header Ambient Glow (hidden in print) */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--color-accent)]/5 rounded-full blur-3xl pointer-events-none -z-10 no-print print-hidden" />

          {/* ─── Header: Name, Title & Contacts ─── */}
          <header className="resume-section-item border-b border-[var(--color-border)] pb-6 sm:pb-8 mb-8 print:border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] print:text-black">
                    {personal.name}
                  </h1>
                  <span className="no-print print-hidden inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('resume.availableBadge')}
                  </span>
                </div>

                <p className="text-lg sm:text-xl font-medium text-[var(--color-accent)] mt-1 tracking-wide print:text-gray-700">
                  {personal.title}
                </p>
              </div>

              {/* Quick Contact Action (Screen only) */}
              <div className="no-print print-hidden flex items-center gap-2">
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 text-[var(--color-accent)] transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t('resume.getInTouch')}</span>
                </a>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs sm:text-sm text-[var(--color-text-secondary)] print:text-gray-800">
              <a
                href={`mailto:${personal.email}`}
                className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
              >
                <Mail className="w-4 h-4 text-[var(--color-accent)] shrink-0 print:text-gray-600" />
                <span className="truncate">{personal.email}</span>
              </a>

              {personal.phone && (
                <a
                  href={`tel:${personal.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--color-accent)] shrink-0 print:text-gray-600" />
                  <span>{personal.phone}</span>
                </a>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--color-accent)] shrink-0 print:text-gray-600" />
                <span>{personal.location}</span>
              </div>

              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[var(--color-accent)] shrink-0 print:text-gray-600" />
                  <span>linkedin.com/in/umutpatlak</span>
                </a>
              )}

              {personal.github && (
                <a
                  href={personal.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                >
                  <Github className="w-4 h-4 text-[var(--color-accent)] shrink-0 print:text-gray-600" />
                  <span>github.com/UmutPatlak</span>
                </a>
              )}

              <Link
                to="/"
                className="flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
              >
                <Globe className="w-4 h-4 text-[var(--color-accent)] shrink-0 print:text-gray-600" />
                <span>umutpatlak.dev</span>
              </Link>
            </div>
          </header>

          {/* ─── Executive Summary ─── */}
          <section className="resume-section-item page-break-inside-avoid mb-8">
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-[var(--color-border)] pb-2 print:text-black print:border-gray-300">
              <FileText className="w-4 h-4 text-[var(--color-accent)] print:text-gray-600" />
              {t('resume.summaryTitle')}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)] print:text-gray-800">
              {isTr ? t('hero.bio') : personal.bio}
            </p>
          </section>

          {/* ─── Work Experience ─── */}
          <section className="resume-section-item mb-8">
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-[var(--color-border)] pb-2 print:text-black print:border-gray-300">
              <Briefcase className="w-4 h-4 text-[var(--color-accent)] print:text-gray-600" />
              {t('resume.experienceTitle')}
            </h2>

            <div className="space-y-6">
              {experienceItems.map((exp, idx) => (
                <div
                  key={idx}
                  className="resume-section-item page-break-inside-avoid rounded-2xl p-4 sm:p-5 border border-[var(--color-border)]/60 bg-[var(--color-surface-hover)]/30 print:border-none print:p-0 print:bg-transparent"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] print:text-black">
                        {exp.role}
                      </h3>
                      <div className="text-sm font-semibold text-[var(--color-accent)] print:text-gray-700">
                        {exp.company}
                        {exp.location && (
                          <span className="font-normal text-[var(--color-text-tertiary)] print:text-gray-500">
                            {' '}
                            • {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] shrink-0 self-start sm:self-auto print:border-none print:p-0 print:text-gray-600">
                      {exp.period}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed print:text-gray-800">
                      {exp.description}
                    </p>
                  )}

                  {exp.achievements && exp.achievements.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2 print:text-gray-700">
                        {t('resume.keyAchievements')}
                      </h4>
                      <ul className="space-y-1.5">
                        {exp.achievements.map((ach, aIdx) => (
                          <li
                            key={aIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed print:text-gray-800"
                          >
                            <span className="text-[var(--color-accent)] font-bold mt-1 shrink-0 print:text-gray-600">
                              •
                            </span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ─── Featured Key Projects ─── */}
          <section className="resume-section-item mb-8">
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-[var(--color-border)] pb-2 print:text-black print:border-gray-300">
              <FolderGit2 className="w-4 h-4 text-[var(--color-accent)] print:text-gray-600" />
              {t('resume.projectsTitle')}
            </h2>

            <div className="grid grid-cols-1 gap-5">
              {projectList.map((project, pIdx) => (
                <div
                  key={pIdx}
                  className="resume-section-item page-break-inside-avoid rounded-2xl p-4 sm:p-5 border border-[var(--color-border)]/60 bg-[var(--color-surface-hover)]/30 print:border-none print:p-0 print:bg-transparent"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[var(--color-text-primary)] print:text-black">
                          {project.title}
                        </h3>
                        <Badge variant="outline">
                          {project.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="no-print print-hidden flex items-center gap-2 shrink-0">
                      {project.title.includes('OCPP') && (
                        <Link
                          to="/projects/ocpp-gateway"
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline font-medium"
                        >
                          <span>{t('resume.viewProject')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium"
                        >
                          <Github className="w-3 h-3" />
                          <span>{t('resume.viewCode')}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-3 leading-relaxed print:text-gray-800">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {project.highlights.slice(0, 3).map((hl: string, hIdx: number) => (
                        <li
                          key={hIdx}
                          className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)] leading-relaxed print:text-gray-800"
                        >
                          <span className="text-[var(--color-accent)] font-semibold shrink-0 mt-0.5 print:text-gray-600">
                            ✓
                          </span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-tertiary)] print:border-gray-200 print:text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Technical Skills ─── */}
          <section className="resume-section-item page-break-inside-avoid mb-8">
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-2 print:text-black print:border-gray-300">
              <Wrench className="w-4 h-4 text-[var(--color-accent)] print:text-gray-600" />
              {t('resume.skillsTitle')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skillCategoryList.map((cat, cIdx) => (
                <div
                  key={cIdx}
                  className="rounded-xl p-3.5 border border-[var(--color-border)]/50 bg-[var(--color-surface-hover)]/20 print:border-none print:p-0"
                >
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] mb-2 print:text-black">
                    {cat.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg text-xs font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] print:border-gray-200 print:text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ─── Education & Languages ─── */}
          <section className="resume-section-item page-break-inside-avoid">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-2 print:text-black print:border-gray-300">
                  <GraduationCap className="w-4 h-4 text-[var(--color-accent)] print:text-gray-600" />
                  {t('resume.educationTitle')}
                </h2>
                <div className="space-y-3">
                  {eduList.map((edu, eIdx) => (
                    <div key={eIdx} className="text-sm">
                      <h3 className="font-bold text-[var(--color-text-primary)] print:text-black">
                        {edu.institution}
                      </h3>
                      <div className="text-xs font-medium text-[var(--color-accent)] print:text-gray-700">
                        {edu.degree} — {edu.field}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-2 print:text-black print:border-gray-300">
                  <Languages className="w-4 h-4 text-[var(--color-accent)] print:text-gray-600" />
                  {t('resume.languagesTitle')}
                </h2>
                <div className="space-y-2">
                  {langList.map((lang, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center justify-between text-xs sm:text-sm"
                    >
                      <span className="font-semibold text-[var(--color-text-primary)] print:text-black">
                        {lang.language}
                      </span>
                      <span className="text-[var(--color-text-tertiary)] print:text-gray-600">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Footer Notice (Screen Only) */}
          <div className="no-print print-hidden mt-10 pt-4 border-t border-[var(--color-border)]/50 text-center text-xs text-[var(--color-text-tertiary)]">
            <p>{t('resume.printNotice')}</p>
          </div>
        </motion.article>
      </Container>
    </div>
  );
}
