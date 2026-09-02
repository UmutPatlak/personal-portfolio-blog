import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { contactService } from '@/services/contactService';
import { personalInfo } from '@/data/cv-data';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function Contact() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await contactService.sendMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden py-16 sm:py-20 lg:py-28 w-full">
      <Container>
        <SectionHeading
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-start">
          {/* Contact Info — slides from left with blur */}
          <ScrollReveal
            direction="left"
            effect="blur"
            distance={50}
            duration={0.7}
            className="lg:col-span-5 space-y-6 min-w-0"
          >
            <p className="text-[var(--color-text-secondary)] text-base sm:text-lg leading-relaxed break-words">
              {t('contact.intro')}
            </p>

            <div className="space-y-4">
              <motion.a
                href={`mailto:${personalInfo.email}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-hover)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 group min-w-0"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 250 }}
                  className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center group-hover:bg-[var(--color-accent)]/20 transition-colors shrink-0"
                >
                  <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-[var(--color-text-tertiary)]">{t('contact.emailLabel')}</p>
                  <p className="text-[var(--color-text-primary)] font-medium text-sm sm:text-base break-all">
                    {personalInfo.email}
                  </p>
                </div>
              </motion.a>
            </div>
          </ScrollReveal>

          {/* Contact Form — slides from right with scale */}
          <ScrollReveal
            direction="right"
            effect="scale"
            distance={40}
            duration={0.7}
            delay={0.15}
            className="lg:col-span-7 min-w-0 w-full"
          >
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 min-w-0 w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <Input
                  id="contact-name"
                  label={t('contact.nameLabel')}
                  placeholder={t('contact.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
                <Input
                  id="contact-email"
                  label={t('contact.emailInputLabel')}
                  type="email"
                  placeholder={t('contact.emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Input
                  id="contact-subject"
                  label={t('contact.subjectLabel')}
                  placeholder={t('contact.subjectPlaceholder')}
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Textarea
                  id="contact-message"
                  label={t('contact.messageLabel')}
                  placeholder={t('contact.messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={status === 'sending'}
                  icon={<Send className="w-4 h-4" />}
                >
                  {status === 'sending' ? t('contact.sending') : t('contact.sendButton')}
                </Button>
              </motion.div>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-center gap-2 text-xs sm:text-sm text-[var(--color-accent-emerald)] break-words"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t('contact.success')}</span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="flex items-center gap-2 text-xs sm:text-sm text-red-400 break-words"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{t('contact.error')}</span>
                </motion.div>
              )}
            </motion.form>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
