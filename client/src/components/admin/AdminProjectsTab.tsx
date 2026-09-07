import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  FolderGit2,
  ExternalLink,
  Github,
  Edit2,
  Trash2,
  X,
  Check,
  Star,
  ArrowUp,
  ArrowDown,
  Upload,
  Layers,
} from 'lucide-react';
import { projectService } from '@/services/projectService';
import { uploadService } from '@/services/uploadService';
import type { Project } from '@/types/project';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ProjectFormData {
  id?: number;
  title: string;
  type: string;
  description: string;
  technologiesText: string;
  githubUrl: string;
  demoUrl: string;
  imageUrl: string;
  featured: boolean;
  order: number;
  architecture: string;
  challenges: string[];
  solutions: string[];
}

const emptyForm: ProjectFormData = {
  title: '',
  type: '',
  description: '',
  technologiesText: '',
  githubUrl: '',
  demoUrl: '',
  imageUrl: '',
  featured: false,
  order: 0,
  architecture: '',
  challenges: [''],
  solutions: [''],
};

export function AdminProjectsTab() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => projectService.getProjects(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const techList = data.technologiesText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title: data.title,
        type: data.type || undefined,
        description: data.description,
        technologies: techList,
        githubUrl: data.githubUrl || null,
        demoUrl: data.demoUrl || null,
        imageUrl: data.imageUrl || null,
        featured: data.featured,
        order: data.order,
        architecture: data.architecture || null,
        challenges: data.challenges.filter((c) => c.trim().length > 0),
        solutions: data.solutions.filter((s) => s.trim().length > 0),
      };

      if (data.id) {
        return projectService.updateProject(data.id, payload);
      } else {
        return projectService.createProject(payload);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsModalOpen(false);
      setFormData(emptyForm);
      setFormError(null);
      toast.success('Proje başarıyla kaydedildi ✅');
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Proje kaydedilirken hata oluştu');
      toast.error('Proje kaydedilemedi ❌');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectService.deleteProject(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteTarget(null);
      toast.success('Proje başarıyla silindi ✅');
    },
    onError: () => {
      setDeleteTarget(null);
      toast.error('Silme işlemi başarısız oldu ❌');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items: { id: number; order: number }[]) =>
      projectService.reorderProjects(items),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Sıralama güncellendi ✅');
    },
    onError: () => {
      toast.error('Sıralama güncellenemedi ❌');
    },
  });

  const handleOpenAdd = () => {
    setFormData({
      ...emptyForm,
      order: projects.length,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proj: Project) => {
    setFormData({
      id: proj.id,
      title: proj.title,
      type: proj.type || '',
      description: proj.description,
      technologiesText: (proj.technologies || []).join(', '),
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || '',
      imageUrl: proj.imageUrl || '',
      featured: proj.featured,
      order: proj.order,
      architecture: proj.architecture || '',
      challenges: proj.challenges && proj.challenges.length > 0 ? [...proj.challenges] : [''],
      solutions: proj.solutions && proj.solutions.length > 0 ? [...proj.solutions] : [''],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === projects.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = projects[index];
    const target = projects[targetIndex];
    if (!current || !target) return;

    const reordered = [
      { id: current.id, order: target.order },
      { id: target.id, order: current.order },
    ];

    reorderMutation.mutate(reordered);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const res = await uploadService.uploadImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: res.url }));
      toast.success('Görsel başarıyla yüklendi ✅');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Görsel yüklenemedi ❌');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setFormError('Proje Başlığı ve Açıklaması zorunludur');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Proje Yönetimi (Projects)
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Öne çıkan ve diğer projelerinizi, tech stack ve case study detaylarını yönetin.
          </p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Yeni Proje Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-[var(--color-text-tertiary)]">Yükleniyor...</div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <FolderGit2 className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-3 opacity-40" />
          <p className="text-[var(--color-text-tertiary)]">Henüz eklenmiş proje bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, index) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)]/30 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1 min-w-[280px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                      {proj.title}
                    </h3>
                    {proj.featured && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        <Star className="w-3 h-3 fill-amber-400" /> Öne Çıkan
                      </span>
                    )}
                    {proj.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {proj.type}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                    {proj.description}
                  </p>

                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--color-surface-hover)] text-[var(--color-text-tertiary)] border border-[var(--color-border)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)] pt-1">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[var(--color-accent)]"
                      >
                        <Github className="w-3.5 h-3.5" /> GitHub
                      </a>
                    )}
                    {proj.demoUrl && (
                      <a
                        href={proj.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[var(--color-accent)]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Canlı Demo
                      </a>
                    )}
                    <span>Sıra: {proj.order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 cursor-pointer"
                    title="Yukarı Taşı"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === projects.length - 1}
                    className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 cursor-pointer"
                    title="Aşağı Taşı"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
                    className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {formData.id ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Proje Adı *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Örn: OCPP Gateway Admin Panel"
                    required
                  />
                  <Input
                    label="Proje Tipi"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Örn: Solo Full-Stack Project"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    Açıklama *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Proje hakkında genel özet..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                    required
                  />
                </div>

                <Input
                  label="Teknolojiler (virgülle ayırın)"
                  value={formData.technologiesText}
                  onChange={(e) => setFormData({ ...formData, technologiesText: e.target.value })}
                  placeholder="React, TypeScript, NestJS, PostgreSQL, Tailwind CSS"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="GitHub URL"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                  <Input
                    label="Demo / Canlı URL"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                {/* Image Upload / URL */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    Proje Kapak Görseli
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Görsel URL veya dosya yükleyin"
                      className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageFileChange}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      icon={<Upload className="w-4 h-4" />}
                    >
                      {isUploadingImage ? 'Yükleniyor...' : 'Fotoğraf Seç'}
                    </Button>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                    />
                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                      Öne Çıkan Proje Olarak İşaretle (Featured)
                    </span>
                  </label>
                </div>

                {/* Case Study Section */}
                <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-4">
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[var(--color-accent)]" /> Case Study Detayları
                  </h4>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
                      Mimari Açıklama (Architecture)
                    </label>
                    <textarea
                      value={formData.architecture}
                      onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                      rows={2}
                      placeholder="Mimarisi ve teknik tasarımı..."
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-2 text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                    />
                  </div>

                  {/* Challenges dynamic rows */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Zorluklar (Challenges)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, challenges: [...prev.challenges, ''] }))
                        }
                        className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
                      >
                        + Zorluk Ekle
                      </button>
                    </div>
                    {formData.challenges.map((ch, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ch}
                          onChange={(e) => {
                            const next = [...formData.challenges];
                            next[i] = e.target.value;
                            setFormData({ ...formData, challenges: next });
                          }}
                          placeholder="Zorluk maddesi..."
                          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs text-[var(--color-text-primary)]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.challenges.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, challenges: next.length > 0 ? next : [''] });
                          }}
                          className="p-1 text-[var(--color-text-tertiary)] hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Solutions dynamic rows */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-[var(--color-text-secondary)]">
                        Çözümler (Solutions)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, solutions: [...prev.solutions, ''] }))
                        }
                        className="text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
                      >
                        + Çözüm Ekle
                      </button>
                    </div>
                    {formData.solutions.map((sol, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={sol}
                          onChange={(e) => {
                            const next = [...formData.solutions];
                            next[i] = e.target.value;
                            setFormData({ ...formData, solutions: next });
                          }}
                          placeholder="Çözüm maddesi..."
                          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs text-[var(--color-text-primary)]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = formData.solutions.filter((_, idx) => idx !== i);
                            setFormData({ ...formData, solutions: next.length > 0 ? next : [''] });
                          }}
                          className="p-1 text-[var(--color-text-tertiary)] hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    disabled={saveMutation.isPending}
                    icon={<Check className="w-4 h-4" />}
                  >
                    {saveMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Projeyi Sil"
        message={`"${deleteTarget?.title}" projesini silmek istediğinize emin misiniz?`}
      />
    </div>
  );
}
