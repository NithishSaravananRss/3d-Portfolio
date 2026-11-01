import React from 'react';
import { ParticleVortexBackground } from './components/portfolio/ParticleVortexBackground';
import { WordmarkHero } from './components/portfolio/WordmarkHero';
import { AboutSection } from './components/portfolio/AboutSection';
import { ServicesSection } from './components/portfolio/ServicesSection';
import { ProjectsSection } from './components/portfolio/ProjectsSection';
import { ContactSection } from './components/portfolio/ContactSection';
import { CelebrationDanceSection } from './components/portfolio/CelebrationDanceSection';
import { Footer } from './components/portfolio/Footer';

export const App: React.FC = () => {
  return (
    <div className="w-full bg-[#020202] text-white relative selection:bg-white selection:text-black font-sans min-h-screen">
      {/* 3D Continuous Particle Vortex Background (Qronos-Style Hyperboloid) */}
      <ParticleVortexBackground />

      {/* Main Cinematic Movie Intro Stage & Companion */}
      <main className="w-full relative z-10">
        <WordmarkHero />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
        <CelebrationDanceSection />
        <Footer />
      </main>
    </div>
  );
};

export default App;
