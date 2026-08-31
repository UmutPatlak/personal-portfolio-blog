import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, LogIn } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch {
      // error is set in useAuth
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <SEO title="Admin Login" noindex={true} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 mb-4">
            <Terminal className="w-7 h-7 text-[var(--color-accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
          <p className="text-sm text-[var(--color-text-tertiary)] mt-1">Sign in to manage your content</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4"
        >
          <Input
            id="admin-email"
            label="Email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="admin-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
            icon={<LogIn className="w-4 h-4" />}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
