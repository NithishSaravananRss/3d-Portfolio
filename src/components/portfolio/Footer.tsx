import React from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { sound } from '../../utils/sound';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      className="bg-[#020202] text-white overflow-hidden select-none border-t border-white/10 py-10 px-6 md:px-16 font-sans relative z-10"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Navigation Bar (ABOUT, SERVICES, PROJECTS, TOP) */}
        <div className="flex items-center justify-center gap-8 md:gap-12 pb-8 border-b border-white/10 text-xs font-mono text-gray-400">
          <a
            href="#about"
            onClick={() => sound.playClick()}
            className="hover:text-white transition-colors tracking-widest"
          >
            ABOUT
          </a>
          <a
            href="#service"
            onClick={() => sound.playClick()}
            className="hover:text-white transition-colors tracking-widest"
          >
            SERVICES
          </a>
          <a
            href="#project"
            onClick={() => sound.playClick()}
            className="hover:text-white transition-colors tracking-widest"
          >
            PROJECTS
          </a>
          <button
            onClick={scrollToTop}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-white/15 text-gray-300 hover:text-white hover:border-white/40 transition-colors"
          >
            <span>TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-gray-500 gap-3">
          <span>© 2026 {PORTFOLIO_DATA.profile.wordmark}. All rights reserved.</span>
          <span>Crafted with GSAP, Framer Motion & Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
