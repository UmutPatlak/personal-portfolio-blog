import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  FolderGit2,
  Briefcase,
  Wrench,
  GraduationCap,
  User,
  Inbox,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// Tabs
import { AdminExperienceTab } from '@/components/admin/AdminExperienceTab';
import { AdminProjectsTab } from '@/components/admin/AdminProjectsTab';
import { AdminSkillsTab } from '@/components/admin/AdminSkillsTab';
import { AdminEducationTab } from '@/components/admin/AdminEducationTab';
import { AdminBlogTab } from '@/components/admin/AdminBlogTab';
import { AdminProfileTab } from '@/components/admin/AdminProfileTab';
import { AdminInboxTab } from '@/components/admin/AdminInboxTab';

// Services for counts
import { blogService } from '@/services/blogService';
import { projectService } from '@/services/projectService';
import { experienceService } from '@/services/experienceService';
import { contactService } from '@/services/contactService';

type TabType =
  | 'overview'
  | 'experiences'
  | 'projects'
  | 'skills'
  | 'education'
  | 'blog'
  | 'profile'
  | 'inbox';

export function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Stats queries
  const { data: postsData } = useQuery({
    queryKey: ['admin-blog-posts', 'all', ''],
    queryFn: () => blogService.getAdminPosts({ limit: 100 }),
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => projectService.getProjects(),
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: () => experienceService.getExperiences(),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => contactService.getMessages(),
  });

  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'experiences', label: 'Deneyimler', icon: Briefcase, badge: experiences.length },
    { id: 'projects', label: 'Projeler', icon: FolderGit2, badge: projects.length },
    { id: 'skills', label: 'Yetenekler', icon: Wrench },
    { id: 'education', label: 'Eğitim & Diller', icon: GraduationCap },
    { id: 'blog', label: 'Blog', icon: FileText, badge: postsData?.total },
    { id: 'profile', label: 'Profil & Ayarlar', icon: User },
    { id: 'inbox', label: 'Gelen Kutusu', icon: Inbox, badge: unreadMessagesCount || undefined },
  ];

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 md:py-20 w-full min-h-[calc(100vh-80px)]">
      <SEO title="Admin Dashboard | İçerik Yönetim Paneli" noindex={true} />
      <Container className="max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                Admin Panel (CMS)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)] mt-1">
              Hoş geldiniz, <span className="font-semibold text-[var(--color-text-secondary)]">{user?.name || 'Admin'}</span>. Tüm portfolyo içeriğini buradan anında yönetebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/" target="_blank">
              <Button variant="secondary" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                Siteyi Gör
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} icon={<LogOut className="w-4 h-4" />}>
              Çıkış
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[var(--color-accent)] text-white shadow-[var(--shadow-glow)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/40'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-[var(--color-accent)]' : 'bg-[var(--color-surface-hover)] text-[var(--color-accent)]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Blog Yazıları',
                      value: postsData?.total ?? 0,
                      desc: `${postsData?.data?.filter((p) => p.status === 'published').length || 0} Yayında, ${
                        postsData?.data?.filter((p) => p.status === 'draft').length || 0
                      } Taslak`,
                      icon: FileText,
                      tab: 'blog' as TabType,
                    },
                    {
                      label: 'Projeler',
                      value: projects.length,
                      desc: `${projects.filter((p) => p.featured).length} Öne Çıkan Proje`,
                      icon: FolderGit2,
                      tab: 'projects' as TabType,
                    },
                    {
                      label: 'İş Deneyimleri',
                      value: experiences.length,
                      desc: 'Güncel zaman çizelgesi',
                      icon: Briefcase,
                      tab: 'experiences' as TabType,
                    },
                    {
                      label: 'İletişim Mesajları',
                      value: messages.length,
                      desc: `${unreadMessagesCount} Okunmamış Mesaj`,
                      icon: Inbox,
                      tab: 'inbox' as TabType,
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      onClick={() => setActiveTab(stat.tab)}
                      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)]/50 hover:shadow-[var(--shadow-card-hover)] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                          Yönet &rarr;
                        </span>
                      </div>
                      <p className="text-3xl font-extrabold text-[var(--color-text-primary)]">
                        {stat.value}
                      </p>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)] mt-0.5">
                        {stat.label}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1">{stat.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Shortcuts */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                  <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4">
                    Hızlı İşlemler
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab('experiences')}
                      className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] text-left transition-all cursor-pointer"
                    >
                      <span className="font-semibold text-sm text-[var(--color-text-primary)] block">
                        + Deneyim Ekle
                      </span>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        Yeni iş veya staj kaydı oluştur
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] text-left transition-all cursor-pointer"
                    >
                      <span className="font-semibold text-sm text-[var(--color-text-primary)] block">
                        + Proje Ekle
                      </span>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        Yeni portfolyo çalışması veya case study ekle
                      </span>
                    </button>
                    <Link
                      to="/admin/posts/new"
                      className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent)] text-left transition-all block"
                    >
                      <span className="font-semibold text-sm text-[var(--color-text-primary)] block">
                        + Blog Yazısı Yaz
                      </span>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        Markdown editör ile yeni makale oluştur
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'experiences' && <AdminExperienceTab />}
            {activeTab === 'projects' && <AdminProjectsTab />}
            {activeTab === 'skills' && <AdminSkillsTab />}
            {activeTab === 'education' && <AdminEducationTab />}
            {activeTab === 'blog' && <AdminBlogTab />}
            {activeTab === 'profile' && <AdminProfileTab />}
            {activeTab === 'inbox' && <AdminInboxTab />}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
