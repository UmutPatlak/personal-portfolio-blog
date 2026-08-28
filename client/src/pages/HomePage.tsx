import { Hero } from '@/components/home/Hero';
import { Experience } from '@/components/home/Experience';
import { Projects } from '@/components/home/Projects';
import { Skills } from '@/components/home/Skills';
import { Education } from '@/components/home/Education';
import { Contact } from '@/components/home/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
