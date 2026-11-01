import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { sound } from '../../utils/sound';
import confetti from 'canvas-confetti';
import { Copy, Check, Github, Linkedin, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (text: string, field: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ffffff', '#E5B869', '#D4A373'],
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section
      id="contact"
      className="relative min-h-screen text-white font-sans flex flex-col justify-between overflow-hidden border-t border-white/5 pt-20 pb-16 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto w-full z-10 py-10">
        
        {/* Top Header: Big Bold Headline */}
        <div className="mb-14 text-left">
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter drop-shadow-2xl leading-[0.9] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800">
            LET'S TALK
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Direct Outreach Philosophy (Aligned with Shipped typography) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans leading-tight mb-3">
              Have an ambitious idea? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
                Let's engineer it into reality.
              </span>
            </h3>

            <p className="text-sm sm:text-[15px] text-gray-300 font-normal leading-relaxed font-sans mb-3">
              From early-stage startup concepts to complex enterprise platforms, I build digital solutions designed around performance, scalability, and long-term impact.
            </p>

            <p className="text-sm sm:text-[15px] text-gray-300 font-normal leading-relaxed font-sans mb-4">
              Whether you're launching a new product, transforming an existing system, or tackling a challenging engineering problem, let's create something exceptional.
            </p>
          </div>

          {/* Right Column: Direct Contact Hub in place of form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#0a0a0a]/92 backdrop-blur-2xl shadow-2xl space-y-4">
              
              {/* 1. Direct Email Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#E5B869]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-[#E5B869]/15 border border-[#E5B869]/30 flex items-center justify-center text-[#E5B869] shrink-0">
                    <Mail size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider font-medium">
                      EMAIL
                    </div>
                    <a
                      href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                      className="text-xs sm:text-sm md:text-base font-sans text-white hover:text-[#FFF6E5] transition-colors font-semibold whitespace-nowrap"
                    >
                      {PORTFOLIO_DATA.profile.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                  <a
                    href={`mailto:${PORTFOLIO_DATA.profile.email}`}
                    onClick={() => sound.playClick()}
                    className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white hover:text-black transition-all text-xs font-sans font-semibold flex items-center space-x-1"
                  >
                    <span>MAIL</span>
                    <ArrowUpRight size={13} />
                  </a>
                  <button
                    onClick={() => copyText(PORTFOLIO_DATA.profile.email, 'email')}
                    onMouseEnter={() => sound.playHover()}
                    className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white hover:text-black transition-all text-xs font-sans font-semibold flex items-center space-x-1.5"
                  >
                    {copiedField === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedField === 'email' ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* 2. Phone Number Card */}
              <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider font-medium">
                      PHONE NUMBER
                    </div>
                    <a
                      href="tel:+919444726699"
                      className="text-sm sm:text-base font-sans text-white hover:text-emerald-400 transition-colors font-semibold"
                    >
                      +91 94447 26699
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                  <a
                    href="tel:+919444726699"
                    onClick={() => sound.playClick()}
                    className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white hover:text-black transition-all text-xs font-sans font-semibold flex items-center space-x-1"
                  >
                    <span>CALL</span>
                    <ArrowUpRight size={13} />
                  </a>
                  <button
                    onClick={() => copyText('+919444726699', 'phone')}
                    onMouseEnter={() => sound.playHover()}
                    className="px-3.5 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white hover:text-black transition-all text-xs font-sans font-semibold flex items-center space-x-1.5"
                  >
                    {copiedField === 'phone' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedField === 'phone' ? 'COPIED' : 'COPY'}</span>
                  </button>
                </div>
              </div>

              {/* 3. WhatsApp Direct Button Card */}
              <a
                href="https://wa.me/919444726699?text=Hi%20Nithish,%20I%20saw%20your%20portfolio"
                target="_blank"
                rel="noreferrer"
                onClick={() => sound.playClick()}
                onMouseEnter={() => sound.playHover()}
                className="p-4 sm:p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-900/30 hover:border-emerald-500/60 transition-all flex items-center justify-between group font-sans"
              >
                <div className="flex items-center space-x-4 text-left">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] font-sans text-emerald-400 uppercase tracking-wider font-semibold">
                      WHATSAPP
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      Chat on WhatsApp
                    </div>
                  </div>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all flex items-center space-x-1 text-xs font-sans font-bold self-start sm:self-auto">
                  <span>CHAT</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>

              {/* 4. GitHub & LinkedIn Dual Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                {/* GitHub Button */}
                <a
                  href={PORTFOLIO_DATA.profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.06] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Github size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider font-medium">
                        GITHUB
                      </div>
                      <div className="text-xs sm:text-sm font-sans text-white group-hover:text-[#FFF6E5] transition-colors font-semibold">
                        GitHub Profile
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight size={15} className="text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                {/* LinkedIn Button */}
                <a
                  href={PORTFOLIO_DATA.profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.playClick()}
                  onMouseEnter={() => sound.playHover()}
                  className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-[#E5B869]/40 hover:bg-[#E5B869]/5 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-[#E5B869]/15 border border-[#E5B869]/30 flex items-center justify-center text-[#E5B869] shrink-0">
                      <Linkedin size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider font-medium">
                        LINKEDIN
                      </div>
                      <div className="text-xs sm:text-sm font-sans text-white group-hover:text-[#FFF6E5] transition-colors font-semibold">
                        LinkedIn Profile
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight size={15} className="text-gray-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* 5. Chennai Location Badge */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between text-left font-sans">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E5B869]/15 border border-[#E5B869]/30 flex items-center justify-center text-[#E5B869] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-[11px] font-sans text-gray-400 uppercase tracking-wider font-medium">
                      LOCATION
                    </div>
                    <div className="text-sm font-bold text-white tracking-wide font-sans">
                      Chennai, Tamil Nadu, India
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-sans px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium">
                  Chennai
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
