import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User,
  FileText,
  Upload,
  Check,
  ExternalLink,
  Camera,
} from 'lucide-react';
import { personalInfoService } from '@/services/personalInfoService';
import { uploadService } from '@/services/uploadService';
import type { PersonalInfo } from '@/types/personalInfo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';

export function AdminProfileTab() {
  const queryClient = useQueryClient();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<PersonalInfo>>({
    name: '',
    title: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    profileImage: '',
    cvUrl: '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => personalInfoService.getPersonalInfo(),
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        title: profile.title || '',
        bio: profile.bio || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        githubUrl: profile.githubUrl || '',
        linkedinUrl: profile.linkedinUrl || '',
        profileImage: profile.profileImage || '',
        cvUrl: profile.cvUrl || '',
      });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<PersonalInfo>) => personalInfoService.updatePersonalInfo(data),
    onSuccess: (updated) => {
      void queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      setForm((prev) => ({ ...prev, ...updated }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const res = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, profileImage: res.url }));
      await personalInfoService.updatePersonalInfo({ profileImage: res.url });
      void queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Fotoğraf başarıyla yüklendi ✅');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Fotoğraf yüklenemedi ❌');
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCv(true);
      const res = await uploadService.uploadDocument(file);
      setForm((prev) => ({ ...prev, cvUrl: res.url }));
      await personalInfoService.updatePersonalInfo({ cvUrl: res.url });
      void queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('CV belgesi başarıyla yüklendi ✅');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'CV belgesi yüklenemedi ❌');
    } finally {
      setIsUploadingCv(false);
      if (cvInputRef.current) cvInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-[var(--color-text-tertiary)]">Yükleniyor...</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
          Kişisel Bilgiler & Ayarlar
        </h2>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          Profil bilgilerinizi, iletişim linklerini, profil fotoğrafınızı ve CV belgenizi güncelleyin.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4" /> Değişiklikler başarıyla kaydedildi!
        </div>
      )}

      {/* Files Section: Avatar & CV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {/* Profile Picture */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
            Profil Fotoğrafı
          </label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[var(--color-bg-primary)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
              {form.profileImage ? (
                <img
                  src={form.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-[var(--color-text-tertiary)]" />
              )}
            </div>

            <div className="space-y-1.5">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploadingPhoto}
                icon={<Camera className="w-3.5 h-3.5" />}
              >
                {isUploadingPhoto ? 'Yükleniyor...' : 'Fotoğraf Değiştir'}
              </Button>
              <p className="text-[11px] text-[var(--color-text-tertiary)]">
                PNG, JPEG veya WebP (Maks 5MB)
              </p>
            </div>
          </div>
        </div>

        {/* CV PDF Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[var(--color-text-primary)]">
            CV Dosyası (PDF)
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={cvInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleCvUpload}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => cvInputRef.current?.click()}
                disabled={isUploadingCv}
                icon={<Upload className="w-3.5 h-3.5" />}
              >
                {isUploadingCv ? 'Yükleniyor...' : 'Yeni CV Yükle'}
              </Button>

              {form.cvUrl && (
                <a
                  href={form.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--color-accent)] hover:underline ml-2"
                >
                  <FileText className="w-3.5 h-3.5" /> Görüntüle <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-[11px] text-[var(--color-text-tertiary)]">
              PDF formatında güncel özgeçmiş (Maks 15MB)
            </p>
          </div>
        </div>
      </div>

      {/* Main Info Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ad Soyad"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Umut Patlak"
            required
          />
          <Input
            label="Unvan / Başlık"
            value={form.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Full-Stack Developer"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Hakkımda (Bio)
          </label>
          <textarea
            value={form.bio || ''}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            placeholder="Kısa biyografi ve uzmanlık alanları..."
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="E-posta"
            type="email"
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="umutpatlak77@gmail.com"
          />
          <Input
            label="Telefon"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+90 539 511 75 09"
          />
          <Input
            label="Konum"
            value={form.location || ''}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Istanbul, Turkey"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GitHub URL"
            value={form.githubUrl || ''}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            placeholder="https://github.com/UmutPatlak"
          />
          <Input
            label="LinkedIn URL"
            value={form.linkedinUrl || ''}
            onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
            placeholder="https://linkedin.com/in/umutpatlak"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            icon={<Check className="w-4 h-4" />}
          >
            {updateMutation.isPending ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      </form>
    </div>
  );
}
