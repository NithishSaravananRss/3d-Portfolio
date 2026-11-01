import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { LetterPhysicsIntro } from './LetterPhysicsIntro';
import { Character3DScene } from './Character3DScene';
import { sound } from '../../utils/sound';
import gsap from 'gsap';

interface WordmarkHeroProps {
  onPreloadComplete?: () => void;
}

export const WordmarkHero: React.FC<WordmarkHeroProps> = ({ onPreloadComplete }) => {
  const [displayText, setDisplayText] = useState<string>(PORTFOLIO_DATA.profile.wordmark);
  const [phase, setPhase] = useState<'letter-physics' | 'scramble' | 'split-revealed'>('letter-physics');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftSpanRef = useRef<HTMLSpanElement | null>(null);
  const rightSpanRef = useRef<HTMLSpanElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  // Track window scroll progress for character walk-to-corner transition
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollMax = Math.max(300, window.innerHeight * 0.85);
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollMax));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Called when the letter-by-letter physics animation finishes
  const handlePhysicsComplete = useCallback(() => {
    setPhase('scramble');

    const initialWord = PORTFOLIO_DATA.profile.wordmark; // "NITHISH"
    const targetWord = 'PORTFOLIO';

    // Step 2: High-speed scramble morph from NITHISH to PORTFOLIO
    let step = 0;
    const intervalId = window.setInterval(() => {
      setDisplayText(() => {
        return targetWord
          .split('')
          .map((char, index) => {
            if (index < Math.floor(step)) {
              return char;
            }
            if (index < initialWord.length) {
              return initialWord[index];
            }
            return '';
          })
          .join('');
      });

      step += 0.38;
      sound.playHover();

      if (step >= targetWord.length + 1) {
        clearInterval(intervalId);
        setDisplayText(targetWord);
        setPhase('split-revealed');
      }
    }, 45);
  }, []);

  // Step 3: GSAP Split and Center Frame
  const triggerGsapSplit = useCallback(() => {
    const isMobile = window.innerWidth < 768;

    const tl = gsap.timeline({
      onComplete: () => {
        if (onPreloadComplete) {
          onPreloadComplete();
        }
      },
    });

    // Ensure wordmark container is positioned in center
    tl.to(
      containerRef.current,
      {
        top: isMobile ? '50%' : '50%',
        duration: 1.2,
        ease: 'power3.inOut',
      },
      '+=0.1'
    );

    // Split wordmark in half (PORT moves left, FOLIO moves right)
    const splitAmount = isMobile
      ? window.innerWidth * 0.32
      : Math.min(520, window.innerWidth * 0.35);

    tl.to(
      leftSpanRef.current,
      { x: -splitAmount, duration: 1.4, ease: 'power3.out' },
      '<'
    );
    tl.to(
      rightSpanRef.current,
      { x: splitAmount, duration: 1.4, ease: 'power3.out' },
      '<'
    );

    // Subtitle slides up smoothly at the bottom-left
    tl.fromTo(
      subtitleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' },
      '-=0.8'
    );
  }, [onPreloadComplete]);

  // Execute GSAP split as soon as React commits the PORTFOLIO word update
  useEffect(() => {
    if (phase === 'split-revealed') {
      const raf = requestAnimationFrame(() => {
        triggerGsapSplit();
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [phase, triggerGsapSplit]);

  // Midpoint split of current word ("PORT" | "FOLIO")
  const midPoint = displayText === 'PORTFOLIO' ? 4 : Math.ceil(displayText.length / 2);
  const leftPart = displayText.slice(0, midPoint);
  const rightPart = displayText.slice(midPoint);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden select-none"
      style={{
        background: 'radial-gradient(circle at 50% 45%, rgba(24, 25, 32, 0.65) 0%, rgba(8, 8, 10, 0.85) 65%, rgba(2, 2, 2, 0.96) 100%)',
      }}
    >
      {/* Background Studio Vignette */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] pointer-events-none" />

      {/* 3D Character Studio Scene in Center Stage / Walking to Corner */}
      <div className="fixed inset-0 flex items-center justify-center z-30 pointer-events-none">
        <Character3DScene
          isIntroComplete={phase === 'split-revealed'}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Phase 1: Hasibul Hasan Letter-by-Letter Physics Catapult Animation */}
      {phase === 'letter-physics' && (
        <LetterPhysicsIntro
          key="letter-intro"
          word={PORTFOLIO_DATA.profile.wordmark}
          className="flex items-baseline text-[16vw] md:text-[11rem] lg:text-[15rem] font-black tracking-tighter drop-shadow-2xl leading-none uppercase"
          letterClassName="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-800"
          dotClassName="bg-white shadow-[0_0_25px_#E5B869]"
          speed={1.05}
          onComplete={handlePhysicsComplete}
        />
      )}

      {/* Phase 2 & 3: Wordmark Container with GSAP Scramble and Split */}
      <div
        ref={containerRef}
        className={`absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center w-max transition-opacity duration-300 ${
          phase === 'letter-physics' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <h1 className="flex items-baseline text-[16vw] md:text-[11rem] lg:text-[15rem] font-black tracking-tighter drop-shadow-2xl leading-none uppercase">
          <span
            ref={leftSpanRef}
            className="inline-block will-change-transform text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-700"
          >
            {leftPart}
          </span>
          <span
            ref={rightSpanRef}
            className="inline-block will-change-transform text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-700"
          >
            {rightPart}
          </span>
        </h1>
      </div>

      {/* Role Subtitle: Bold Software Engineer anchored at bottom-left */}
      <div
        ref={subtitleRef}
        className="absolute bottom-12 left-8 md:left-20 z-20 opacity-0 pointer-events-none w-max"
      >
        <p className="text-white text-base md:text-xl lg:text-2xl drop-shadow-md">
          <span className="font-extrabold tracking-tight">{PORTFOLIO_DATA.profile.role.bold}</span>
        </p>
      </div>

      {/* Cinematic Ambient Lighting Glows (Warm Champagne Gold & Amber) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E5B869]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4A373]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle indicator hint at bottom for scrolling in Hero */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center opacity-60">
        <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-gray-400 mb-1.5">
          SCROLL TO EXPLORE
        </span>
        <div className="w-4 h-7 rounded-full border border-gray-600 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#E5B869] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default WordmarkHero;
