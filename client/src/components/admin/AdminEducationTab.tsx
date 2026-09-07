import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  GraduationCap,
  Globe2,
  Edit2,
  Trash2,
  X,
  Check,
  Calendar,
} from 'lucide-react';
import { educationService } from '@/services/educationService';
import type { Education, Language } from '@/types/education';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function AdminEducationTab() {
  const queryClient = useQueryClient();

  // Education state
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [eduForm, setEduForm] = useState<Partial<Education>>({
    school: '',
    department: '',
    degree: '',
    startDate: '',
    endDate: '',
  });
  const [deleteEduTarget, setDeleteEduTarget] = useState<{ id: number; school: string } | null>(null);

  // Language state
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [langForm, setLangForm] = useState<Partial<Language>>({
    name: '',
    level: '',
  });
  const [deleteLangTarget, setDeleteLangTarget] = useState<{ id: number; name: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-education'],
    queryFn: () => educationService.getEducation(),
  });

  const educationList = data?.education || [];
  const languagesList = data?.languages || [];

  // Education mutations
  const saveEduMutation = useMutation({
    mutationFn: async (form: Partial<Education>) => {
      if (form.id) {
        return educationService.updateEducation(form.id, form);
      } else {
        return educationService.createEducation(form);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      void queryClient.invalidateQueries({ queryKey: ['education'] });
      setIsEduModalOpen(false);
      setEduForm({ school: '', department: '', degree: '', startDate: '', endDate: '' });
      toast.success('Eğitim başarıyla kaydedildi ✅');
    },
    onError: () => {
      toast.error('Eğitim kaydedilemedi ❌');
    },
  });

  const deleteEduMutation = useMutation({
    mutationFn: (id: number) => educationService.deleteEducation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      void queryClient.invalidateQueries({ queryKey: ['education'] });
      setDeleteEduTarget(null);
      toast.success('Eğitim başarıyla silindi ✅');
    },
    onError: () => {
      setDeleteEduTarget(null);
      toast.error('Silme işlemi başarısız oldu ❌');
    },
  });

  // Language mutations
  const saveLangMutation = useMutation({
    mutationFn: async (form: Partial<Language>) => {
      if (form.id) {
        return educationService.updateLanguage(form.id, form);
      } else {
        return educationService.createLanguage(form);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      void queryClient.invalidateQueries({ queryKey: ['education'] });
      setIsLangModalOpen(false);
      setLangForm({ name: '', level: '' });
      toast.success('Dil bilgisi başarıyla kaydedildi ✅');
    },
    onError: () => {
      toast.error('Dil bilgisi kaydedilemedi ❌');
    },
  });

  const deleteLangMutation = useMutation({
    mutationFn: (id: number) => educationService.deleteLanguage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-education'] });
      void queryClient.invalidateQueries({ queryKey: ['education'] });
      setDeleteLangTarget(null);
      toast.success('Dil başarıyla silindi ✅');
    },
    onError: () => {
      setDeleteLangTarget(null);
      toast.error('Silme işlemi başarısız oldu ❌');
    },
  });

  const handleOpenAddEdu = () => {
    setEduForm({ school: '', department: '', degree: '', startDate: '', endDate: '' });
    setIsEduModalOpen(true);
  };

  const handleOpenEditEdu = (edu: Education) => {
    setEduForm({ ...edu });
    setIsEduModalOpen(true);
  };

  const handleOpenAddLang = () => {
    setLangForm({ name: '', level: '' });
    setIsLangModalOpen(true);
  };

  const handleOpenEditLang = (lang: Language) => {
    setLangForm({ ...lang });
    setIsLangModalOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Education Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[var(--color-accent)]" /> Eğitim Bilgisi (Education)
            </h2>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Üniversite, derece ve bölüm bilgilerinizi yönetin.
            </p>
          </div>
          <Button onClick={handleOpenAddEdu} size="sm" icon={<Plus className="w-4 h-4" />}>
            Eğitim Ekle
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-[var(--color-text-tertiary)]">Yükleniyor...</div>
        ) : educationList.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-tertiary)]">
            Kayıtlı eğitim bilgisi bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {educationList.map((edu) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-[var(--color-text-primary)]">{edu.school}</h3>
                  <p className="text-sm text-[var(--color-accent)] font-medium">
                    {edu.degree} — {edu.department}
                  </p>
                  {(edu.startDate || edu.endDate) && (
                    <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.startDate || ''} – {edu.endDate || 'Present'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditEdu(edu)}
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteEduTarget({ id: edu.id, school: edu.school })}
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[var(--color-accent)]" /> Diller (Languages)
            </h2>
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Bildiğiniz dilleri ve seviyelerini yönetin.
            </p>
          </div>
          <Button onClick={handleOpenAddLang} size="sm" icon={<Plus className="w-4 h-4" />}>
            Dil Ekle
          </Button>
        </div>

        {languagesList.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-tertiary)]">
            Kayıtlı dil bilgisi bulunmuyor.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {languagesList.map((lang) => (
              <motion.div
                key={lang.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="font-bold text-[var(--color-text-primary)]">{lang.name}</h4>
                  <p className="text-xs text-[var(--color-text-secondary)]">{lang.level}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditLang(lang)}
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteLangTarget({ id: lang.id, name: lang.name })}
                    className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Education Modal */}
      <AnimatePresence>
        {isEduModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  {eduForm.id ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}
                </h3>
                <button
                  onClick={() => setIsEduModalOpen(false)}
                  className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!eduForm.school?.trim() || !eduForm.degree?.trim() || !eduForm.department?.trim())
                    return;
                  saveEduMutation.mutate(eduForm);
                }}
                className="space-y-4"
              >
                <Input
                  label="Okul / Üniversite *"
                  value={eduForm.school || ''}
                  onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                  placeholder="Örn: Okan University"
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Derece *"
                    value={eduForm.degree || ''}
                    onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                    placeholder="Örn: B.Sc."
                    required
                  />
                  <Input
                    label="Bölüm *"
                    value={eduForm.department || ''}
                    onChange={(e) => setEduForm({ ...eduForm, department: e.target.value })}
                    placeholder="Örn: Information Systems"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Başlangıç Yılı"
                    value={eduForm.startDate || ''}
                    onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                    placeholder="2022"
                  />
                  <Input
                    label="Bitiş Yılı"
                    value={eduForm.endDate || ''}
                    onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                    placeholder="2026"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEduModalOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={saveEduMutation.isPending}
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

      {/* Language Modal */}
      <AnimatePresence>
        {isLangModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  {langForm.id ? 'Dili Düzenle' : 'Yeni Dil Ekle'}
                </h3>
                <button
                  onClick={() => setIsLangModalOpen(false)}
                  className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!langForm.name?.trim() || !langForm.level?.trim()) return;
                  saveLangMutation.mutate(langForm);
                }}
                className="space-y-4"
              >
                <Input
                  label="Dil Adı *"
                  value={langForm.name || ''}
                  onChange={(e) => setLangForm({ ...langForm, name: e.target.value })}
                  placeholder="Örn: İngilizce, Türkçe, Almanca"
                  required
                />
                <Input
                  label="Seviye *"
                  value={langForm.level || ''}
                  onChange={(e) => setLangForm({ ...langForm, level: e.target.value })}
                  placeholder="Örn: Native, Professional working proficiency, B2"
                  required
                />

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLangModalOpen(false)}
                  >
                    İptal
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={saveLangMutation.isPending}
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
        isOpen={!!deleteEduTarget}
        onClose={() => setDeleteEduTarget(null)}
        onConfirm={() => deleteEduTarget && deleteEduMutation.mutate(deleteEduTarget.id)}
        title="Eğitimi Sil"
        message={`"${deleteEduTarget?.school}" eğitimini silmek istediğinize emin misiniz?`}
      />

      <ConfirmDialog
        isOpen={!!deleteLangTarget}
        onClose={() => setDeleteLangTarget(null)}
        onConfirm={() => deleteLangTarget && deleteLangMutation.mutate(deleteLangTarget.id)}
        title="Dili Sil"
        message={`"${deleteLangTarget?.name}" dilini silmek istediğinize emin misiniz?`}
      />
    </div>
  );
}
