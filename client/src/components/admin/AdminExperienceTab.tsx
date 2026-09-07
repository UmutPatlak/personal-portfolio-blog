import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  Briefcase,
  Calendar,
  MapPin,
  Edit2,
  Trash2,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  ListPlus,
} from 'lucide-react';
import { experienceService } from '@/services/experienceService';
import type { Experience } from '@/types/experience';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface ExperienceFormData {
  id?: number;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
  achievements: string[];
}

const emptyForm: ExperienceFormData = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  order: 0,
  achievements: [''],
};

export function AdminExperienceTab() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ExperienceFormData>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; company: string } | null>(null);

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['admin-experiences'],
    queryFn: () => experienceService.getExperiences(),
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ExperienceFormData) => {
      const payload = {
        company: data.company,
        position: data.position,
        location: data.location || undefined,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        description: data.description || undefined,
        order: data.order,
        achievements: data.achievements.filter((a) => a.trim().length > 0),
      };

      if (data.id) {
        return experienceService.updateExperience(data.id, payload);
      } else {
        return experienceService.createExperience(payload);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      void queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setIsModalOpen(false);
      setFormData(emptyForm);
      setFormError(null);
      toast.success('Başarıyla kaydedildi ✅');
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to save experience');
      toast.error('Bir hata oluştu, tekrar deneyin ❌');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => experienceService.deleteExperience(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      void queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setDeleteTarget(null);
      toast.success('Başarıyla silindi ✅');
    },
    onError: () => {
      setDeleteTarget(null);
      toast.error('Silme işlemi başarısız oldu ❌');
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (items: { id: number; order: number }[]) =>
      experienceService.reorderExperiences(items),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-experiences'] });
      void queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Sıralama güncellendi ✅');
    },
    onError: () => {
      toast.error('Sıralama güncellenemedi ❌');
    },
  });

  const handleOpenAdd = () => {
    setFormData({
      ...emptyForm,
      order: experiences.length,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setFormData({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: exp.startDate,
      endDate: exp.endDate || '',
      description: exp.description || '',
      order: exp.order,
      achievements: exp.achievements.length > 0 ? [...exp.achievements] : [''],
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, company: string) => {
    setDeleteTarget({ id, company });
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === experiences.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = experiences[index];
    const target = experiences[targetIndex];
    if (!current || !target) return;

    const reordered = [
      { id: current.id, order: target.order },
      { id: target.id, order: current.order },
    ];

    reorderMutation.mutate(reordered);
  };

  const handleAddAchievementRow = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ''],
    }));
  };

  const handleAchievementChange = (index: number, value: string) => {
    setFormData((prev) => {
      const next = [...prev.achievements];
      next[index] = value;
      return { ...prev, achievements: next };
    });
  };

  const handleRemoveAchievementRow = (index: number) => {
    setFormData((prev) => {
      const next = prev.achievements.filter((_, i) => i !== index);
      return { ...prev, achievements: next.length > 0 ? next : [''] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.position.trim() || !formData.startDate.trim()) {
      setFormError('Company, Position, and Start Date are required');
      return;
    }
    saveMutation.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Deneyim Yönetimi (Experience)
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            İş ve staj deneyimlerinizi ekleyin, düzenleyin ve başarı maddelerini yönetin.
          </p>
        </div>
        <Button onClick={handleOpenAdd} icon={<Plus className="w-4 h-4" />}>
          Yeni Deneyim Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-[var(--color-text-tertiary)]">Yükleniyor...</div>
      ) : experiences.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-3 opacity-40" />
          <p className="text-[var(--color-text-tertiary)]">Henüz eklenmiş deneyim bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)]/30 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                      {exp.position}
                    </h3>
                    <span className="text-[var(--color-accent)] font-semibold">@ {exp.company}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                      Sıra: {exp.order}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-2">
                      {exp.description}
                    </p>
                  )}
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
                    disabled={index === experiences.length - 1}
                    className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 cursor-pointer"
                    title="Aşağı Taşı"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id, exp.company)}
                    className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {exp.achievements && exp.achievements.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[var(--color-border)]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Başarılar ({exp.achievements.length})
                  </span>
                  <ul className="mt-1 space-y-1">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="text-xs text-[var(--color-text-secondary)] flex items-start gap-1.5">
                        <span className="text-[var(--color-accent)] shrink-0">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal / Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {formData.id ? 'Deneyimi Düzenle' : 'Yeni Deneyim Ekle'}
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
                    label="Şirket Adı *"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Örn: Zebra Elektronik"
                    required
                  />
                  <Input
                    label="Pozisyon / Rol *"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Örn: Full-Stack Developer"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Başlangıç Tarihi *"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="Örn: Jan 2026"
                    required
                  />
                  <Input
                    label="Bitiş Tarihi"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="Örn: Aug 2026 (Boş = Present)"
                  />
                  <Input
                    label="Lokasyon"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Örn: Istanbul, Turkey"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    Açıklama / Özet
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Rol ve katkılar hakkında genel özet..."
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                </div>

                {/* Achievements dynamic rows */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                      Başarı & Sorumluluk Maddeleri (Achievements)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAchievementRow}
                      className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
                    >
                      <ListPlus className="w-3.5 h-3.5" /> Madde Ekle
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formData.achievements.map((ach, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-text-muted)] w-5 text-right shrink-0">
                          {i + 1}.
                        </span>
                        <input
                          type="text"
                          value={ach}
                          onChange={(e) => handleAchievementChange(i, e.target.value)}
                          placeholder="Başarı maddesi girin..."
                          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievementRow(i)}
                          className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 hover:bg-red-400/10 cursor-pointer shrink-0"
                          title="Sil"
                        >
                          <X className="w-4 h-4" />
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
        title="Deneyimi Sil"
        message={`"${deleteTarget?.company}" şirketindeki deneyimi silmek istediğinize emin misiniz?`}
      />
    </div>
  );
}
