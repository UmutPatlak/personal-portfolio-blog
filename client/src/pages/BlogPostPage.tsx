import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { blogService } from '@/services/blogService';
import { formatDate } from '@/lib/utils';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogService.getPostBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 min-h-[calc(100vh-4rem)]">
        <SEO title="Loading Post..." noindex={true} />
        <Container className="max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 rounded bg-[var(--color-surface)]" />
            <div className="h-4 w-1/3 rounded bg-[var(--color-surface)]" />
            <div className="h-64 rounded-xl bg-[var(--color-surface)] mt-8" />
          </div>
        </Container>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="py-12 sm:py-16 min-h-[calc(100vh-4rem)]">
        <SEO title="Post Not Found" noindex={true} />
        <Container className="max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            {t('blog.postNotFound')}
          </h1>
          <Link
            to="/blog"
            className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog.backToBlog')}
          </Link>
        </Container>
      </section>
    );
  }

  // Extract clean plain text for description fallback
  const cleanDescription =
    post.summary ||
    post.content
      .replace(/[#*`_~[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160);

  return (
    <section className="py-12 sm:py-16 min-h-[calc(100vh-4rem)]">
      <SEO
        title={post.title}
        description={cleanDescription}
        image={post.coverImage || undefined}
        url={`/blog/${post.slug}`}
        type="article"
        author="Umut Patlak"
        publishedTime={post.publishedAt || undefined}
        modifiedTime={post.updatedAt || undefined}
        tags={post.tags}
      />
      <Container className="max-w-3xl">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog.backToBlog')}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight break-words">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--color-text-tertiary)] mb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Umut Patlak
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt, i18n.language)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {t('blog.minRead', { count: post.readingTime })}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="accent">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 sm:mb-10 rounded-2xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose-custom text-[var(--color-text-secondary)] break-words min-w-0">
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
                      className="rounded-xl !bg-[#1e1e2e] !my-6"
                    >
                      {codeString}
                    </SyntaxHighlighter>
                  );
                }

                return (
                  <code
                    className="px-1.5 py-0.5 rounded-md bg-[var(--color-surface)] text-[var(--color-accent)] text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </article>
      </Container>
    </section>
  );
}
