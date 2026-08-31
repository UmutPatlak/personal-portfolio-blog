import { SEO } from '@/components/seo/SEO';
import { Hero } from '@/components/home/Hero';
import { About } from '@/components/home/About';
import { Experience } from '@/components/home/Experience';
import { Projects } from '@/components/home/Projects';
import { Skills } from '@/components/home/Skills';
import { Education } from '@/components/home/Education';
import { Contact } from '@/components/home/Contact';

export function HomePage() {
  return (
    <div className="w-full overflow-x-hidden pb-12 sm:pb-16">
      <SEO
        title="Umut Patlak — Full-Stack Developer | React, NestJS, Spring Boot"
        url="/"
      />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </div>
  );
}

