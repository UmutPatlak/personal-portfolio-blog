import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Background3D } from '@/components/ui/Background3D';

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col noise-bg w-full overflow-x-hidden relative">
      <Background3D />
      <Navbar />
      <main className="flex-1 pt-16 w-full overflow-x-hidden relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

