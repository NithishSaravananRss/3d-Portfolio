import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { sound } from '../../utils/sound';

interface WordProps {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}

const Word: React.FC<WordProps> = ({ word, range, progress }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const isSpecial = word === "Nithish." || word === "Full-Stack" || word === "Developer";

  return (
    <span className="relative inline-block mr-[0.28em] my-1">
      {/* Dim ghost baseline layer */}
      <span className="absolute opacity-20 text-white select-none pointer-events-none">
        {word}
      </span>
      {/* Scroll-illuminated active layer */}
      <motion.span
        style={{ opacity }}
        className={`relative ${
          isSpecial ? 'font-bold text-white' : 'text-gray-100'
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
};

export const AboutSection: React.FC = () => {
  // Scoped ref directly on the bio card so the scroll animation completes within the card itself
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: cardScroll } = useScroll({
    target: cardRef,
    offset: ['start 0.85', 'end 0.20'],
  });

  // Smooth exit fade-out scoped strictly to the card scrolling out of view
  const cardOpacity = useTransform(cardScroll, [0.75, 1.0], [1, 0.15]);
  const cardScale = useTransform(cardScroll, [0.75, 1.0], [1, 0.98]);

  // Approved first-person professional narrative
  const bioText =
    "Hey, I'm Nithish. A Full-Stack Developer building custom web platforms, applications, and workflow automations tailored precisely to business requirements. I handle the entire product lifecycle end to end — from architectural design and intelligent AI integration to production deployment and ongoing maintenance. I build software that eliminates manual bottlenecks, solves real operational challenges, and runs reliably in production so businesses can focus on growth.";

  const words = bioText.split(' ');

  // Technical stack marquee lists (bulletless, high contrast, including AI/LLM tools)
  const row1Backend = [
    'Java',
    'Spring Boot',
    'Spring Security',
    'Hibernate',
    'RESTful APIs',
    'Microservices',
    'PostgreSQL',
    'MySQL',
    'Python',
    'C++',
    'JPA',
    'Maven',
  ];

  const row2Frontend = [
    'React.js',
    'TypeScript',
    'JavaScript',
    'Next.js',
    'Three.js WebGL',
    'Tailwind CSS',
    'Vite',
    'HTML5',
    'CSS3',
    'Redux Toolkit',
    'Framer Motion',
    'Shadcn UI',
  ];

  const row3AIProtocols = [
    'AI Chatbots',
    'RAG Pipelines',
    'LangChain',
    'LLM Integration',
    'OpenAI API',
    'Vector Databases',
    'Workflow Automation',
    'Prompt Engineering',
    'WebSockets',
    'Redis Cache',
    'Prisma ORM',
  ];

  const row4DevOps = [
    'Docker',
    'Git',
    'GitHub Actions',
    'Linux CLI',
    'Postman',
    'JUnit 5',
    'Mockito',
    'CI/CD Pipelines',
    'VS Code',
    'IntelliJ IDEA',
    'Nginx',
    'Agile / Scrum',
  ];

  return (
    <>
      <section
        id="about"
        className="text-white pt-20 pb-16 flex flex-col justify-center relative overflow-hidden font-sans w-full"
      >
        <div className="w-full mx-auto">
          {/* Hasibul-Style Scroll-Driven Illuminating Bio Card (Self-Contained Fade In / Out) */}
          <div className="max-w-5xl mx-auto w-full px-6 md:px-10">
            <motion.div
              ref={cardRef}
              style={{ opacity: cardOpacity, scale: cardScale }}
              className="relative rounded-3xl bg-[#08080b]/92 border border-white/15 p-8 sm:p-12 md:p-16 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
            >
              {/* Scroll-Driven Illuminating Paragraph (Completes lighting by mid-screen, fades out at exit) */}
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-normal leading-relaxed md:leading-[1.55] tracking-tight">
                {words.map((word, i) => {
                  // Illuminates sequentially from progress 0.0 to 0.60
                  const start = (i / words.length) * 0.55;
                  const end = start + 0.08;
                  return (
                    <Word
                      key={`word-${i}`}
                      word={word}
                      range={[start, end]}
                      progress={cardScroll}
                    />
                  );
                })}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4-Row Continuous Infinite Stack Scroll with Opaque High-Contrast Shield (No Bullets) */}
      <section
        id="stack"
        className="relative w-full overflow-hidden space-y-4 pt-4 pb-20 font-sans [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        {/* Subtle dark gradient backdrop behind marquee zone to prevent background particle clutter */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/85 to-transparent pointer-events-none -z-10" />

        {/* Row 1: Backend Engineering & Architecture (Scrolls Left) */}
        <div className="animate-marquee-left-fast flex items-center gap-3 w-max">
          {[...row1Backend, ...row1Backend, ...row1Backend].map((skill, idx) => (
            <div
              key={`r1-${idx}`}
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#0a0a0e]/95 hover:bg-[#16161f] border border-white/20 hover:border-white/50 transition-all duration-300 group cursor-pointer select-none shadow-[0_4px_24px_rgba(0,0,0,0.9)] shrink-0"
            >
              <span className="text-xs sm:text-sm font-mono font-medium text-gray-100 group-hover:text-white transition-colors tracking-wide">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* Row 2: Frontend Architecture & 3D WebGL (Scrolls Right) */}
        <div className="animate-marquee-right-fast flex items-center gap-3 w-max">
          {[...row2Frontend, ...row2Frontend, ...row2Frontend].map((skill, idx) => (
            <div
              key={`r2-${idx}`}
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#0a0a0e]/95 hover:bg-[#16161f] border border-white/20 hover:border-white/50 transition-all duration-300 group cursor-pointer select-none shadow-[0_4px_24px_rgba(0,0,0,0.9)] shrink-0"
            >
              <span className="text-xs sm:text-sm font-mono font-medium text-gray-100 group-hover:text-white transition-colors tracking-wide">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* Row 3: AI, LLMs & Intelligent Automation (Scrolls Left) */}
        <div className="animate-marquee-left-slow flex items-center gap-3 w-max">
          {[...row3AIProtocols, ...row3AIProtocols, ...row3AIProtocols].map((skill, idx) => (
            <div
              key={`r3-${idx}`}
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#0a0a0e]/95 hover:bg-[#16161f] border border-white/20 hover:border-white/50 transition-all duration-300 group cursor-pointer select-none shadow-[0_4px_24px_rgba(0,0,0,0.9)] shrink-0"
            >
              <span className="text-xs sm:text-sm font-mono font-medium text-gray-100 group-hover:text-white transition-colors tracking-wide">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* Row 4: DevOps, QA & Tooling (Scrolls Right) */}
        <div className="animate-marquee-right-slow flex items-center gap-3 w-max">
          {[...row4DevOps, ...row4DevOps, ...row4DevOps].map((skill, idx) => (
            <div
              key={`r4-${idx}`}
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#0a0a0e]/95 hover:bg-[#16161f] border border-white/20 hover:border-white/50 transition-all duration-300 group cursor-pointer select-none shadow-[0_4px_24px_rgba(0,0,0,0.9)] shrink-0"
            >
              <span className="text-xs sm:text-sm font-mono font-medium text-gray-100 group-hover:text-white transition-colors tracking-wide">
                {skill}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutSection;
