import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { SEO } from '@/components/seo/SEO';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogCard } from '@/components/blog/BlogCard';
import { blogService } from '@/services/blogService';

export function BlogPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', { search: searchQuery, tag: selectedTag }],
    queryFn: () =>
      blogService.getPosts({
        search: searchQuery || undefined,
        tag: selectedTag ?? undefined,
      }),
  });

  const allTags = Array.from(
    new Set(data?.data.flatMap((post) => post.tags) ?? [])
  );

  return (
    <section className="py-12 sm:py-16 min-h-[calc(100vh-4rem)]">
      <SEO
        title={t('blog.title')}
        description="Articles, architectural notes, and tutorials on Full-Stack Web Development, React, NestJS, TypeScript, Spring Boot, and cloud architecture by Umut Patlak."
        url="/blog"
        keywords={[
          'Web Development Blog',
          'React Tutorials',
          'NestJS Architecture',
          'TypeScript Best Practices',
          'Full-Stack Guide',
          'Software Engineering Articles',
        ]}
      />
      <Container>
        <SectionHeading
          title={t('blog.title')}
          subtitle={t('blog.subtitle')}
        />

        {/* Search & Filter */}
        <div className="mb-10 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              id="blog-search"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-[var(--color-text-muted)]" />
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  selectedTag === null
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                }`}
              >
                {t('blog.all')}
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 animate-pulse"
              >
                <div className="h-40 rounded-xl bg-[var(--color-bg-secondary)] mb-4" />
                <div className="h-4 w-3/4 rounded bg-[var(--color-bg-secondary)] mb-2" />
                <div className="h-3 w-1/2 rounded bg-[var(--color-bg-secondary)]" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-secondary)]">
              {t('blog.error')}
            </p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {data.data.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </motion.div>
        )}

        {data && data.data.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-secondary)] text-lg">
              {t('blog.empty')}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
