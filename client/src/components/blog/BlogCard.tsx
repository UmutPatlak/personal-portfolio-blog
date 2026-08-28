import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/post';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:border-[var(--color-accent)]/30 hover:shadow-[var(--shadow-card-hover)]"
    >
      {post.coverImage && (
        <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-[var(--color-bg-secondary)]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] mb-3">
        {post.publishedAt && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(post.publishedAt)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {post.readingTime} min read
        </span>
      </div>

      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-200">
        {post.title}
      </h3>

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 line-clamp-3">
        {post.summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="flex items-center gap-1 text-sm text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Read more <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
