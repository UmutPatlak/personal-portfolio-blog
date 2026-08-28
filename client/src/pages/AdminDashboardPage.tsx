import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Eye, FileText, LogOut } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { blogService } from '@/services/blogService';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

export function AdminDashboardPage() {
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => blogService.getPosts({ limit: 100 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => blogService.deletePost(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
    },
  });

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <section className="py-24">
      <Container>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">Dashboard</h1>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
              Welcome back, {user?.name ?? 'Admin'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/posts/new">
              <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
                New Post
              </Button>
            </Link>
            <Button variant="ghost" onClick={logout} icon={<LogOut className="w-4 h-4" />}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Total Posts',
              value: data?.total ?? 0,
              icon: FileText,
            },
            {
              label: 'Published',
              value: data?.data.filter((p) => p.status === 'published').length ?? 0,
              icon: Eye,
            },
            {
              label: 'Drafts',
              value: data?.data.filter((p) => p.status === 'draft').length ?? 0,
              icon: Edit3,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Posts List */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border)]">
            <h2 className="font-semibold text-[var(--color-text-primary)]">All Posts</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-[var(--color-text-tertiary)]">Loading...</div>
          ) : data && data.data.length > 0 ? (
            <div className="divide-y divide-[var(--color-border)]">
              {data.data.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-medium text-[var(--color-text-primary)] truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant={post.status === 'published' ? 'success' : 'default'}>
                        {post.status}
                      </Badge>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[var(--color-text-tertiary)]">
              No posts yet. Create your first post!
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
