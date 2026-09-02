import { motion } from 'framer-motion';
import { Github, Linkedin, Heart, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { personalInfo } from '@/data/cv-data';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]">
      <Container className="py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            <span>© {currentYear} {personalInfo.name}.</span>
            <span className="inline-flex items-center gap-1.5">
              <span>{t('footer.builtWith')}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 shrink-0" />
              </motion.span>
              <span>{t('footer.techStack')}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {[
              { href: personalInfo.github, icon: Github, label: 'GitHub' },
              { href: personalInfo.linkedin, icon: Linkedin, label: 'LinkedIn' },
              { href: `mailto:${personalInfo.email}`, icon: Mail, label: 'Email' },
            ].map((link, idx) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.label !== 'Email' ? '_blank' : undefined}
                rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                whileHover={{ y: -2, scale: 1.1 }}
                className="p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all duration-200"
                aria-label={link.label}
              >
                <link.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
