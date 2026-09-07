import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  FileText,
  Search,
} from 'lucide-react';
import { blogService } from '@/services/blogService';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate } from '@/lib/utils';

export function AdminBlogTab() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blog-posts', statusFilter, searchTerm],
    queryFn: () =>
      blogService.getAdminPosts({
        status: statusFilter,
        search: searchTerm || undefined,
        limit: 100,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => blogService.deletePost(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDeleteTarget(null);
      toast.success('Yazı başarıyla silindi ✅');
    },
    onError: () => {
      setDeleteTarget(null);
      toast.error('Silme işlemi başarısız oldu ❌');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => blogService.toggleStatus(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      void queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Durum güncellendi ✅');
    },
    onError: () => {
      toast.error('Durum güncellenemedi ❌');
    },
  });

  const handleDelete = (id: number, title: string) => {
    setDeleteTarget({ id, title });
  };

  const posts = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
            Blog Yönetimi (Posts)
          </h2>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            Blog yazılarını Markdown editör ile oluşturun, taslak/yayın durumunu ve etiketleri yönetin.
          </p>
        </div>
        <Link to="/admin/posts/new">
          <Button icon={<Plus className="w-4 h-4" />}>Yeni Yazı Oluştur</Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-2">
          {(['all', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              {st === 'all' ? 'Tümü' : st === 'published' ? 'Yayında' : 'Taslak'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Başlıkta ara..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-[var(--color-text-tertiary)]">Yükleniyor...</div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-3 opacity-40" />
          <p className="text-[var(--color-text-tertiary)]">Yazı bulunamadı.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden divide-y divide-[var(--color-border)]">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <div className="flex-1 min-w-[260px] space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-base">
                    {post.title}
                  </h3>
                  <button
                    onClick={() => toggleStatusMutation.mutate(post.id)}
                    className="cursor-pointer"
                    title="Durumu Değiştir"
                  >
                    <Badge variant={post.status === 'published' ? 'success' : 'default'}>
                      {post.status === 'published' ? 'Yayında' : 'Taslak'}
                    </Badge>
                  </button>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
                  {post.summary}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-tertiary)] pt-1">
                  <span>{formatDate(post.createdAt)}</span>
                  <span>•</span>
                  <span>{post.readingTime} dk okuma</span>
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {post.tags.map((t) => (
                          <span key={t} className="text-[11px] text-[var(--color-accent)]">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/blog/${post.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all"
                  title="Sitede Görüntüle"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all"
                  title="Düzenle"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
                  className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Yazıyı Sil"
        message={`"${deleteTarget?.title}" yazısını silmek istediğinize emin misiniz?`}
      />
    </div>
  );
}
