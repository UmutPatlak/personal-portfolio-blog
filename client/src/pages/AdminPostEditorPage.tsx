import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { blogService } from '@/services/blogService';
import { uploadService } from '@/services/uploadService';

export function AdminPostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    coverImage: '',
  });

  // Load existing post for editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['admin-post', id],
    queryFn: async () => {
      if (!id) return null;
      return blogService.getPostById(parseInt(id, 10));
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingPost) {
      setForm({
        title: existingPost.title || '',
        summary: existingPost.summary || '',
        content: existingPost.content || '',
        tags: (existingPost.tags || []).join(', '),
        status: existingPost.status || 'draft',
        coverImage: existingPost.coverImage || '',
      });
    }
  }, [existingPost]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        summary: form.summary,
        content: form.content,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: form.status,
        coverImage: form.coverImage || null,
      };

      if (isEditing && id) {
        return blogService.updatePost(parseInt(id, 10), payload);
      } else {
        return blogService.createPost(payload);
      }
    },
    onSuccess: () => navigate('/admin/dashboard'),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const res = await uploadService.uploadImage(file);
      setForm((prev) => ({ ...prev, coverImage: res.url }));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Görsel yüklenemedi');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (isEditing && isLoadingPost) {
    return <div className="py-24 text-center text-[var(--color-text-tertiary)]">Yazı yükleniyor...</div>;
  }

  return (
    <section className="py-12 sm:py-16 md:py-24">
      <SEO title={isEditing ? 'Yazıyı Düzenle' : 'Yeni Yazı'} noindex={true} />
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Panoya Dön
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            icon={<Eye className="w-4 h-4" />}
          >
            {showPreview ? 'Düzenleme Modu' : 'Önizleme'}
          </Button>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        >
          {isEditing ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
        </motion.h1>

        {showPreview ? (
          /* Preview Mode */
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              {form.title || 'Başlıksız'}
            </h2>
            <p className="text-[var(--color-text-tertiary)] mb-6">{form.summary}</p>
            {form.coverImage && (
              <img
                src={form.coverImage}
                alt="Cover"
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}
            <article className="prose-custom text-[var(--color-text-secondary)]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className ?? '');
                    const codeString = String(children).replace(/\n$/, '');
                    if (match) {
                      return (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-xl !bg-[#1e1e2e]"
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      );
                    }
                    return (
                      <code className="px-1.5 py-0.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-accent)] text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {form.content || '*Önizlemeyi görmek için içerik yazmaya başlayın...*'}
              </ReactMarkdown>
            </article>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="post-title"
              label="Başlık *"
              placeholder="Örn: Microservices with NestJS and Drizzle"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />

            <Input
              id="post-summary"
              label="Özet *"
              placeholder="Yazı hakkında kısa bir özet..."
              value={form.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              required
            />

            {/* Cover image field & upload button */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Kapak Görseli
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="https://... veya görsel yükleyin"
                  value={form.coverImage}
                  onChange={(e) => updateField('coverImage', e.target.value)}
                  className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  icon={<Upload className="w-4 h-4" />}
                >
                  {isUploadingImage ? 'Yükleniyor...' : 'Görsel Seç'}
                </Button>
              </div>
            </div>

            <Input
              id="post-tags"
              label="Etiketler (virgülle ayırın)"
              placeholder="react, nestjs, typescript, tutorial"
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="post-content"
                className="block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                İçerik (Markdown) *
              </label>
              <textarea
                id="post-content"
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="# Başlık&#10;&#10;İçeriğinizi Markdown formatında buraya yazın..."
                className="w-full h-96 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-200 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 font-mono resize-y"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Yayın Durumu
              </label>
              <div className="flex gap-3">
                {(['draft', 'published'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateField('status', status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      form.status === status
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
                    }`}
                  >
                    {status === 'published' ? 'Yayında (Published)' : 'Taslak (Draft)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={saveMutation.isPending}
                icon={<Save className="w-4 h-4" />}
              >
                {saveMutation.isPending
                  ? 'Kaydediliyor...'
                  : isEditing
                    ? 'Yazıyı Güncelle'
                    : 'Yazıyı Yayınla / Kaydet'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/admin/dashboard')}
              >
                İptal
              </Button>
            </div>

            {saveMutation.isError && (
              <p className="text-sm text-red-400">
                Yazı kaydedilirken bir hata oluştu.
              </p>
            )}
          </form>
        )}
      </Container>
    </section>
  );
}
