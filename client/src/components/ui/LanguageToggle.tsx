import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language?.startsWith('tr') ? 'tr' : 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="relative px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-primary)] shadow-sm"
      aria-label={t('language.toggle')}
      title={t('language.toggle')}
      id="language-toggle"
    >
      <Globe className="w-3.5 h-3.5 text-[var(--color-accent)] shrink-0" />
      <span className="tracking-wide uppercase font-bold">{currentLang === 'tr' ? 'TR' : 'EN'}</span>
    </button>
  );
}
