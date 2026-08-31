import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { blogService } from '@/services/blogService';

export function AdminPostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
    coverImage: '',
  });

  // Load existing post for editing
  useQuery({
    queryKey: ['admin-post', id],
    queryFn: async () => {
      // For editing, we need to fetch by ID — we'll use slug as workaround
      // In real app, the backend would have a GET by ID endpoint
      return null;
    },
    enabled: isEditing,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      blogService.createPost({
        title: form.title,
        summary: form.summary,
        content: form.content,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: form.status,
        coverImage: form.coverImage || null,
      }),
    onSuccess: () => navigate('/admin/dashboard'),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-12 sm:py-16 md:py-24">
      <SEO title={isEditing ? 'Edit Post' : 'New Post'} noindex={true} />
      <Container className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            icon={<Eye className="w-4 h-4" />}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold text-[var(--color-text-primary)] mb-8"
        >
          {isEditing ? 'Edit Post' : 'New Post'}
        </motion.h1>

        {showPreview ? (
          /* Preview Mode */
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              {form.title || 'Untitled'}
            </h2>
            <p className="text-[var(--color-text-tertiary)] mb-6">{form.summary}</p>
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
                {form.content || '*Start writing to see preview...*'}
              </ReactMarkdown>
            </article>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="post-title"
              label="Title"
              placeholder="My awesome blog post"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
            />

            <Input
              id="post-summary"
              label="Summary"
              placeholder="A brief description of your post"
              value={form.summary}
              onChange={(e) => updateField('summary', e.target.value)}
              required
            />

            <Input
              id="post-cover"
              label="Cover Image URL (optional)"
              placeholder="https://..."
              value={form.coverImage}
              onChange={(e) => updateField('coverImage', e.target.value)}
            />

            <Input
              id="post-tags"
              label="Tags (comma-separated)"
              placeholder="react, typescript, tutorial"
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
            />

            <div className="space-y-1.5">
              <label
                htmlFor="post-content"
                className="block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                Content (Markdown)
              </label>
              <textarea
                id="post-content"
                value={form.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="# My Post&#10;&#10;Write your content in Markdown..."
                className="w-full h-96 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-200 focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]/30 font-mono resize-y"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                Status
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
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={createMutation.isPending}
                icon={<Save className="w-4 h-4" />}
              >
                {createMutation.isPending
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Post'
                    : 'Create Post'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
            </div>

            {createMutation.isError && (
              <p className="text-sm text-red-400">
                Failed to save post. Make sure the backend is running.
              </p>
            )}
          </form>
        )}
      </Container>
    </section>
  );
}
