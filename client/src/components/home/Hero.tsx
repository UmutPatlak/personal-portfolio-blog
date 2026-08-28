import { motion } from 'framer-motion';
import { Download, Github, Linkedin, MapPin, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { personalInfo } from '@/data/cv-data';

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--color-accent-secondary)]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-accent-cyan)]/3 rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 text-[var(--color-accent)] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-emerald)] animate-pulse" />
              Available for opportunities
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Hi, I'm{' '}
              <span className="gradient-text">{personalInfo.name}</span>
            </h1>

            <h2 className="text-xl sm:text-2xl text-[var(--color-text-secondary)] font-medium mb-6">
              {personalInfo.title}
            </h2>

            <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed mb-4 max-w-xl">
              {personalInfo.bio}
            </p>

            <div className="flex items-center gap-2 text-sm text-[var(--color-text-tertiary)] mb-8">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a href={`/${personalInfo.cvFileName}`} download>
                <Button variant="primary" size="lg" icon={<Download className="w-4 h-4" />}>
                  Download CV
                </Button>
              </a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" icon={<Github className="w-4 h-4" />}>
                  GitHub
                </Button>
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" icon={<Linkedin className="w-4 h-4" />}>
                  LinkedIn
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-secondary)] to-[var(--color-accent-cyan)] blur-2xl opacity-20 scale-110" />
              {/* Photo container */}
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden gradient-border">
                <img
                  src={`/${personalInfo.photoFileName}`}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating decorations */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-xl"
              >
                ⚡
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-2 -left-6 w-14 h-14 rounded-xl bg-[var(--color-accent-secondary)]/10 border border-[var(--color-accent-secondary)]/20 flex items-center justify-center text-xl"
              >
                🚀
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <span className="text-xs text-[var(--color-text-muted)]">Scroll down</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
