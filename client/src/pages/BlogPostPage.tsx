import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { blogService } from '@/services/blogService';
import { formatDate } from '@/lib/utils';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogService.getPostBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <section className="py-24">
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
      <section className="py-24">
        <Container className="max-w-3xl text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            Post not found
          </h1>
          <Link
            to="/blog"
            className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-24">
      <Container className="max-w-3xl">
        {/* Back link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)] mb-4">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Umut Patlak
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min read
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
          <div className="mb-10 rounded-2xl overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
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
