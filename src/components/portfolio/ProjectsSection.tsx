import React from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { sound } from '../../utils/sound';
import { ArrowUpRight, Github } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="project"
      className="text-white pt-24 pb-36 px-6 md:px-12 font-sans relative overflow-visible border-t border-white/5"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/10 w-[600px] h-[600px] bg-[#E5B869]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full z-10">
        {/* Centered Physical 3D Stacking Cards Deck - Wide Screen Format */}
        <div className="max-w-5xl xl:max-w-6xl mx-auto space-y-16 lg:space-y-28 relative">
          {PORTFOLIO_DATA.projects.map((project, index) => {
            // Staggered top offset creates the layered physical stack sensation
            const stickyTopPx = 90 + index * 24;

            return (
              <div
                key={project.id}
                id={`project-card-${project.id}`}
                data-project-card
                style={{
                  top: `${stickyTopPx}px`,
                  zIndex: 10 + index,
                }}
                className="sticky transition-transform duration-500 ease-out"
              >
                {/* Wide-Screen Card Shell with Glassmorphism & Subtle Rim */}
                <div className="p-6 sm:p-8 lg:p-9 rounded-3xl bg-[#0a0a0e]/94 backdrop-blur-2xl border border-white/10 hover:border-[#E5B869]/50 shadow-[0_30px_70px_rgba(0,0,0,0.9)] transition-all duration-300 group relative overflow-hidden">
                  {/* Glowing Cerulean Top Rim Accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5B869] to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

                  {/* Wide-Screen 12-Column Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    {/* LEFT SIDE: Project Preview Image with Bottom Hover Buttons (No blur, no chrome bar) */}
                    <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden relative group/img shadow-2xl">
                      <div className="aspect-[16/10] relative overflow-hidden bg-black/40">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                        />

                        {/* Subtle bottom shadow gradient for button contrast without blurring the image */}
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />

                        {/* HOVER BUTTONS: Slide up cleanly at the bottom over the image without blur */}
                        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-wrap items-center gap-3 z-10 translate-y-3 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-300">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => sound.playClick()}
                              onMouseEnter={() => sound.playHover()}
                              className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs tracking-wide flex items-center space-x-1.5 hover:bg-[#E5B869] hover:shadow-[0_0_20px_rgba(229,184,105,0.5)] transition-all shadow-lg group/btn font-sans"
                            >
                              <span>Explore Live</span>
                              <ArrowUpRight
                                size={14}
                                className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"
                              />
                            </a>
                          )}

                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => sound.playClick()}
                              onMouseEnter={() => sound.playHover()}
                              className="px-4 py-2.5 rounded-xl border border-white/20 bg-black/70 hover:bg-white/20 text-white transition-all text-xs font-sans font-medium flex items-center space-x-1.5"
                              title="View GitHub Repository"
                            >
                              <Github size={14} />
                              <span>Source Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE: Professional Editorial Case Study (Unified sans font, matched with Shipped) */}
                    <div className="lg:col-span-5 flex flex-col justify-center text-left">
                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight font-sans mb-3">
                        {project.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-[15px] text-gray-300 font-normal leading-relaxed font-sans mb-4">
                        {project.description}
                      </p>

                      {/* Architecture & Impact Highlight Box (Styled like Shipped Operational Challenge) */}
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-4">
                        <div className="text-xs font-sans tracking-wider text-[#E5B869] uppercase font-semibold mb-1.5 font-mono">
                          Architecture & Impact
                        </div>
                        <p className="text-sm sm:text-[15px] text-gray-200 leading-relaxed font-normal font-sans">
                          {project.impact}
                        </p>
                      </div>

                      {/* Tech Stack Pills (Matched with Shipped pill style) */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-sans font-medium bg-white/[0.04] border border-white/10 text-gray-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
