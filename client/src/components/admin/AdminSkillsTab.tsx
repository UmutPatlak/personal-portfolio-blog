import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  Wrench,
  Edit2,
  Trash2,
  X,
  Check,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { skillService } from '@/services/skillService';
import type { SkillCategoryWithSkills } from '@/types/skill';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function AdminSkillsTab() {
  const queryClient = useQueryClient();
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState<{ id?: number; name: string; icon: string }>({
    name: '',
    icon: '',
  });
  const [newSkillNames, setNewSkillNames] = useState<Record<number, string>>({});
  const [deleteCatTarget, setDeleteCatTarget] = useState<{ id: number; name: string } | null>(null);
  const [deleteSkillTarget, setDeleteSkillTarget] = useState<{ id: number; name: string } | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: () => skillService.getSkills(),
  });

  const catMutation = useMutation({
    mutationFn: async (data: { id?: number; name: string; icon: string }) => {
      if (data.id) {
        return skillService.updateCategory(data.id, {
          name: data.name,
          icon: data.icon || undefined,
        });
      } else {
        return skillService.createCategory(data.name, data.icon || undefined);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsCatModalOpen(false);
      setCatForm({ name: '', icon: '' });
      toast.success('Kategori kaydedildi ✅');
    },
    onError: () => {
      toast.error('Kategori kaydedilemedi ❌');
    },
  });

  const deleteCatMutation = useMutation({
    mutationFn: (id: number) => skillService.deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
      setDeleteCatTarget(null);
      toast.success('Kategori silindi ✅');
    },
    onError: () => {
      setDeleteCatTarget(null);
      toast.error('Kategori silinemedi ❌');
    },
  });

  const reorderCatMutation = useMutation({
    mutationFn: (items: { id: number; order: number }[]) =>
      skillService.reorderCategories(items),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Sıralama güncellendi ✅');
    },
    onError: () => {
      toast.error('Sıralama güncellenemedi ❌');
    },
  });

  const addSkillMutation = useMutation({
    mutationFn: (data: { categoryId: number; name: string }) =>
      skillService.addSkill(data.categoryId, data.name),
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
      setNewSkillNames((prev) => ({ ...prev, [vars.categoryId]: '' }));
      toast.success('Yetenek eklendi ✅');
    },
    onError: () => {
      toast.error('Yetenek eklenemedi ❌');
    },
  });

  const deleteSkillMutation = useMutation({
    mutationFn: (id: number) => skillService.deleteSkill(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      void queryClient.invalidateQueries({ queryKey: ['skills'] });
      setDeleteSkillTarget(null);
      toast.success('Yetenek silindi ✅');
    },
    onError: () => {
      setDeleteSkillTarget(null);
      toast.error('Yetenek silinemedi ❌');
    },
  });

  const handleOpenAddCat = () => {
    setCatForm({ name: '', icon: '' });
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: SkillCategoryWithSkills) => {
    setCatForm({ id: cat.id, name: cat.name, icon: cat.icon || '' });
    setIsCatModalOpen(true);
  };

  const handleDeleteCat = (id: number, name: string) => {
    setDeleteCatTarget({ id, name });
  };

  const handleDeleteSkill = (id: number, name: string) => {
    setDeleteSkillTarget({ id, name });
  };

  const handleMoveCat = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const current = categories[index];
    const target = categories[targetIndex];
    if (!current || !target) return;

    reorderCatMutation.mutate([
      { id: current.id, order: target.order },
      { id: target.id, order: current.order },
    ]);
  };

  const handleAddSkill = (categoryId: number) => {
    const name = (newSkillNames[categoryId] || '').trim();
    if (!name) return;
    addSkillMutation.mutate({ categoryId, name });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Yetenekler Yönetimi (Skills)
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Kategorileri ve her kategori altındaki yetenek etiketlerini yönetin.
          </p>
        </div>
        <Button onClick={handleOpenAddCat} icon={<Plus className="w-4 h-4" />}>
          Yeni Kategori Ekle
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-[var(--color-text-tertiary)]">Yükleniyor...</div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <Wrench className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-3 opacity-40" />
          <p className="text-[var(--color-text-tertiary)]">Henüz kategori bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                    <h3 className="font-bold text-[var(--color-text-primary)]">{cat.name}</h3>
                    {cat.icon && (
                      <span className="text-xs text-[var(--color-text-tertiary)]">({cat.icon})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveCat(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 cursor-pointer"
                      title="Yukarı Taşı"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveCat(index, 'down')}
                      disabled={index === categories.length - 1}
                      className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] disabled:opacity-30 cursor-pointer"
                      title="Aşağı Taşı"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEditCat(cat)}
                      className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] cursor-pointer"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCat(cat.id, cat.name)}
                      className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 cursor-pointer"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-2 pt-3 min-h-[48px]">
                  {cat.skills && cat.skills.length > 0 ? (
                    cat.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/50 transition-colors"
                      >
                        {skill.name}
                        <button
                          type="button"
                          onClick={() => handleDeleteSkill(skill.id, skill.name)}
                          className="text-[var(--color-text-tertiary)] hover:text-red-400 cursor-pointer"
                          title="Sil"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)] italic">
                      Bu kategoriye henüz yetenek eklenmedi.
                    </span>
                  )}
                </div>
              </div>

              {/* Add skill input */}
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border)]">
                <input
                  type="text"
                  value={newSkillNames[cat.id] || ''}
                  onChange={(e) =>
                    setNewSkillNames((prev) => ({ ...prev, [cat.id]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(cat.id);
                    }
                  }}
                  placeholder="Yetenek adı (Enter)..."
                  className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAddSkill(cat.id)}
                  disabled={!newSkillNames[cat.id]?.trim()}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Ekle
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  {catForm.id ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
                </h3>
                <button
                  onClick={() => setIsCatModalOpen(false)}
                  className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!catForm.name.trim()) return;
                  catMutation.mutate(catForm);
                }}
                className="space-y-4"
              >
                <Input
                  label="Kategori Adı *"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="Örn: Frontend, Cloud, DevOps"
                  required
                />
                <Input
                  label="İkon Adı (Opsiyonel)"
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  placeholder="Örn: Layout, Server, Database, Code2"
                />

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCatModalOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={catMutation.isPending}
                    icon={<Check className="w-4 h-4" />}
                  >
                    Kaydet
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!deleteCatTarget}
        onClose={() => setDeleteCatTarget(null)}
        onConfirm={() => deleteCatTarget && deleteCatMutation.mutate(deleteCatTarget.id)}
        title="Kategoriyi Sil"
        message={`"${deleteCatTarget?.name}" kategorisini ve altındaki tüm yetenekleri silmek istediğinize emin misiniz?`}
      />

      <ConfirmDialog
        isOpen={!!deleteSkillTarget}
        onClose={() => setDeleteSkillTarget(null)}
        onConfirm={() => deleteSkillTarget && deleteSkillMutation.mutate(deleteSkillTarget.id)}
        title="Yetenek Sil"
        message={`"${deleteSkillTarget?.name}" yeteneğini silmek istediğinize emin misiniz?`}
      />
    </div>
  );
}
