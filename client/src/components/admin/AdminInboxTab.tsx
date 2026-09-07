import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  X,
  Reply,
} from 'lucide-react';
import { contactService } from '@/services/contactService';
import type { ContactMessage } from '@/types/contact';
import { formatDate } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export function AdminInboxTab() {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => contactService.getMessages(),
  });

  const toggleReadMutation = useMutation({
    mutationFn: (id: number) => contactService.toggleRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
    },
    onError: () => {
      toast.error('Durum güncellenemedi ❌');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactService.deleteMessage(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      if (selectedMessage) setSelectedMessage(null);
      setDeleteTarget(null);
      toast.success('Mesaj başarıyla silindi ✅');
    },
    onError: () => {
      setDeleteTarget(null);
      toast.error('Silme işlemi başarısız oldu ❌');
    },
  });

  const handleOpenMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      toggleReadMutation.mutate(msg.id);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
              Gelen Kutusu (Inbox)
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--color-accent)] text-white">
                {unreadCount} Okunmamış
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--color-text-tertiary)]">
            İletişim formundan gelen ziyaretçi mesajlarını görüntüleyin ve yönetin.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-[var(--color-text-tertiary)]">Yükleniyor...</div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <Inbox className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-3 opacity-40" />
          <p className="text-[var(--color-text-tertiary)]">Gelen kutunuzda mesaj bulunmuyor.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden divide-y divide-[var(--color-border)]">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer ${
                !msg.isRead ? 'bg-[var(--color-accent)]/5' : ''
              }`}
              onClick={() => handleOpenMessage(msg)}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-[260px]">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    !msg.isRead
                      ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]'
                      : 'bg-[var(--color-surface-hover)] text-[var(--color-text-tertiary)]'
                  }`}
                >
                  {!msg.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                      {msg.name}
                    </span>
                    <span className="text-xs text-[var(--color-text-tertiary)]">
                      &lt;{msg.email}&gt;
                    </span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] shrink-0" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] truncate">
                    {msg.subject || '(Konusuz)'}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                    {msg.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-[var(--color-text-muted)] mr-2">
                  {formatDate(msg.createdAt)}
                </span>
                <button
                  onClick={() => toggleReadMutation.mutate(msg.id)}
                  className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer"
                  title={msg.isRead ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
                >
                  {msg.isRead ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: msg.id, name: msg.name })}
                  className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-red-400 hover:bg-red-400/10 cursor-pointer"
                  title="Sil"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message View Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                    {selectedMessage.subject || '(Konusuz Mesaj)'}
                  </h3>
                  <div className="text-xs text-[var(--color-text-tertiary)] flex flex-wrap gap-2 items-center">
                    <span>
                      <strong className="text-[var(--color-text-secondary)]">{selectedMessage.name}</strong> (
                      {selectedMessage.email})
                    </span>
                    <span>•</span>
                    <span>{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] whitespace-pre-wrap max-h-72 overflow-y-auto">
                {selectedMessage.message}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setDeleteTarget({ id: selectedMessage.id, name: selectedMessage.name })}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Mesajı Sil
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject || 'Mesajınız'
                    )}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
                  >
                    <Reply className="w-3.5 h-3.5" /> Yanıtla
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        title="Mesajı Sil"
        message={`"${deleteTarget?.name}" tarafından gönderilen mesajı silmek istediğinize emin misiniz?`}
      />
    </div>
  );
}
