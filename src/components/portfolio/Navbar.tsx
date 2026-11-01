import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { sound } from '../../utils/sound';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleToggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#service' },
    { label: 'Projects', href: '#project' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#050505]/75 border-b border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Brand Wordmark (Exact Match) */}
        <div className="flex items-center space-x-6">
          <a
            href="#home"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white hover:text-gray-300 transition-colors"
          >
            {PORTFOLIO_DATA.profile.wordmark}
          </a>

          {/* Availability Status Dot */}
          <div className="hidden lg:flex items-center space-x-2 pl-4 border-l border-white/10 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide text-gray-300 font-medium">Available for work</span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-[0.2em] font-medium text-gray-400">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playHover()}
              className="hover:text-white transition-colors duration-200 py-1"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Action Tools: Audio Toggle & Contact CTA */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/25 transition-all"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <a
            href="#contact"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="px-5 py-2 rounded-full border border-white/20 bg-white text-black font-semibold text-xs tracking-wider uppercase flex items-center space-x-1.5 hover:bg-gray-200 transition-all shadow-md"
          >
            <span>Let's Talk</span>
            <ArrowUpRight size={13} />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-full border border-white/10 text-gray-400"
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-white hover:text-gray-300"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080808]/95 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                sound.playClick();
                setMobileOpen(false);
              }}
              className="block text-sm uppercase tracking-widest text-gray-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-white/10">
            <a
              href="#contact"
              onClick={() => {
                sound.playClick();
                setMobileOpen(false);
              }}
              className="block w-full py-3 text-center rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
