import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { sound } from '../../utils/sound';
import {
  Truck,
  Calendar,
  Building2,
  Factory,
} from 'lucide-react';

interface EnhancedService {
  id: string;
  domain: string;
  title: string;
  subtitle: string;
  productDescription: string;
  challengeSolved: string;
  challengeSummary: string;
  keyDeliverables: string[];
  tags: string[];
  icon: React.ReactNode;
}

const ENHANCED_SERVICES: EnhancedService[] = [
  {
    id: "srv-logistics",
    domain: "LOGISTICS & FLEET OPERATIONS",
    title: "Fleet & Fuel Management CRM",
    subtitle: "Transport ERP & Automated Financial Reconciliation",
    productDescription: "An end-to-end transport and fleet management ERP handling multi-vehicle operations, trip billing, automated GST accounting, and operational cashflow.",
    challengeSolved: "Fleet operators spent dozens of hours manually calculating per-kilometer diesel consumption from bunk bills across hundreds of trips, losing track of vehicle breakdown histories, client credit balances, and monthly GST filing statuses.",
    challengeSummary: "Operators spent hours calculating diesel consumption from bunk bills across trips, losing track of breakdown logs and GST statuses.",
    keyDeliverables: [
      "Excel Diesel ETL: Auto-parses bunk sheets to compute per-vehicle mileage, liters, and cost",
      "GST & Debt Ledger: Real-time tracking of filed vs. pending GST bills and client credit balances",
      "Lifecycle Maintenance: Comprehensive tracking of repairs, parts replaced, and breakdown logs",
      "Financial Dashboard: Unified income, trip expenses, and invoice profit margins"
    ],
    tags: ["PostgreSQL", "Node.js (NestJS)", "TypeScript", "Excel ETL", "Tailwind CSS"],
    icon: <Truck size={18} className="text-emerald-400" />
  },
  {
    id: "srv-physio",
    domain: "HEALTHCARE & REHABILITATION",
    title: "PhysioCare Clinical Web Platform",
    subtitle: "Digital Healthcare Portal & Automated Scheduling",
    productDescription: "A patient-centric clinical web platform for an active physiotherapy and rehabilitation center featuring automated appointment scheduling and doctor profiles.",
    challengeSolved: "Patients experienced friction booking therapy over phone calls, leading to double-booked time slots, missed appointments, and a lack of accessible guidance for treatment programs.",
    challengeSummary: "Patients faced friction scheduling therapy over phone calls, causing double-booked time slots, missed appointments, and unguided rehab.",
    keyDeliverables: [
      "Self-Serve Scheduling: Interactive appointment booking with instant EmailJS confirmations",
      "WhatsApp Direct Bridge: One-tap consultation and emergency query navigation",
      "Clinic Facility Locator: Embedded interactive Google Maps API with route directions",
      "Therapy Education Hub: Detailed doctor credentials, treatment advantages, and rehab plans"
    ],
    tags: ["React.js", "EmailJS", "Google Maps API", "Framer Motion", "Tailwind CSS"],
    icon: <Calendar size={18} className="text-purple-400" />
  },
  {
    id: "srv-conglomerate",
    domain: "ENTERPRISE & CONGLOMERATE",
    title: "Conglomerate Multi-Business Portal",
    subtitle: "Multi-Subsidiary Corporate Architecture & Subdomain Hub",
    productDescription: "A centralized corporate group web platform uniting multiple operating subsidiaries and business verticals under one cohesive parent enterprise identity.",
    challengeSolved: "Fragmented digital presence across independent subsidiaries with no centralized authority to showcase conglomerate heritage, executive leadership, or cross-business ventures.",
    challengeSummary: "Fragmented digital presence across independent subsidiaries with no centralized authority for corporate governance or heritage.",
    keyDeliverables: [
      "Multi-Entity Subdomain Routing: Central navigation hub linking to subsidiary subdomains",
      "Heritage & Governance: Interactive showcase of founding history, executive board, and leaders",
      "Cross-Industry Matrix: Dedicated showcases for each subsidiary, industry sector, and venture",
      "Unified Design System: High-performance branding and cohesive typography across all companies"
    ],
    tags: ["React.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Subdomain DNS"],
    icon: <Building2 size={18} className="text-[#E5B869]" />
  },
  {
    id: "srv-cnc",
    domain: "PRECISION MANUFACTURING & CNC",
    title: "CNC Production & Shopfloor CRM",
    subtitle: "Digital Machine Operations, Tooling & Audit Floor CRM",
    productDescription: "A digital shopfloor operations CRM digitizing precision CNC machining lines, machine utilization rates, tooling inventory, and floor compliance.",
    challengeSolved: "Floor supervisors tracked active job orders, machine downtime, and tool wear strictly in handwritten paper notebooks, causing lost production logs and zero audit transparency.",
    challengeSummary: "Floor supervisors tracked machine downtime and tool wear strictly in paper notebooks, causing lost shift logs and zero transparency.",
    keyDeliverables: [
      "Hourly & Daily Production: Real-time floor logging measuring hourly output against targets",
      "Machine Breakdown & Downtime: Rapid incident reporting tracking root causes and repair times",
      "Tooling & Cutter Management: Live inventory monitoring cutting tools and wear replacement cycles",
      "Digital Floor Audit Gates: Shift operator logs, staff allocation, and compliance checklist gates"
    ],
    tags: ["PostgreSQL", "Spring Boot", "React.js", "Tailwind CSS", "REST APIs"],
    icon: <Factory size={18} className="text-[#E5B869]" />
  }
];

const TOTAL_HEIGHT = 750;
const GAP = 20;
const STACK_GAP = 14;

export const ServicesSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isFirstRender = useRef(true);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  const isAnimatingRef = useRef(false);
  const lastActivePos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  // Responsive desktop detection
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Compute exact target bounds for each card in the puzzle
  const getCardTarget = (srvId: string, idx: number, containerWidth: number) => {
    if (activeId === null) {
      // DEFAULT: Balanced 2x2 Grid (0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right)
      const colWidth = (containerWidth - GAP) / 2;
      const rowHeight = (TOTAL_HEIGHT - GAP) / 2;

      const col = idx % 2;
      const row = Math.floor(idx / 2);

      return {
        left: col === 0 ? 0 : colWidth + GAP,
        top: row === 0 ? 0 : rowHeight + GAP,
        width: colWidth,
        height: rowHeight,
      };
    } else if (srvId === activeId) {
      // ACTIVE FLAGSHIP: Expands to entire left column (full height)
      const leftWidth = Math.floor(containerWidth * 0.58);
      return {
        left: 0,
        top: 0,
        width: leftWidth,
        height: TOTAL_HEIGHT,
      };
    } else {
      // INACTIVE STACKED CARDS: Stack in the right column in natural ascending order
      const leftWidth = Math.floor(containerWidth * 0.58);
      const rightWidth = containerWidth - leftWidth - GAP;
      const remainingServices = ENHANCED_SERVICES.filter((s) => s.id !== activeId);
      const actualStackIndex = remainingServices.findIndex((s) => s.id === srvId);

      const stackItemHeight = (TOTAL_HEIGHT - STACK_GAP * 2) / 3;

      return {
        left: leftWidth + GAP,
        top: actualStackIndex * (stackItemHeight + STACK_GAP),
        width: rightWidth,
        height: stackItemHeight,
      };
    }
  };

  // GSAP Smooth Sliding Puzzle Animation
  useEffect(() => {
    if (!isDesktop || !containerRef.current) {
      // Clear inline GSAP positioning on mobile
      cardRefs.current.forEach((el) => {
        if (el) gsap.set(el, { clearProps: 'all' });
      });
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    if (!containerWidth || containerWidth <= 0) return;

    if (isFirstRender.current) {
      // Instant hardware placement on initial mount - zero flash
      ENHANCED_SERVICES.forEach((srv, idx) => {
        const el = cardRefs.current[idx];
        if (!el) return;
        const target = getCardTarget(srv.id, idx, containerWidth);
        gsap.set(el, {
          left: target.left,
          top: target.top,
          width: target.width,
          height: target.height,
        });
      });
      isFirstRender.current = false;
      return;
    }

    isAnimatingRef.current = true;
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    ENHANCED_SERVICES.forEach((srv, idx) => {
      const el = cardRefs.current[idx];
      if (!el) return;
      const target = getCardTarget(srv.id, idx, containerWidth);

      tl.to(
        el,
        {
          left: target.left,
          top: target.top,
          width: target.width,
          height: target.height,
          duration: 0.65,
          ease: 'power3.inOut',
          overwrite: 'auto',
        },
        0
      );
    });
  }, [activeId, isDesktop]);

  // Pointer movement listener with intentional threshold
  const handleCardPointer = (e: React.MouseEvent, id: string) => {
    if (!isDesktop) return;
    if (activeId === id) return;

    // Prevent cards sliding under a resting cursor from triggering an unwanted loop
    if (lastActivePos.current.x > 0 && activeId !== null) {
      const dist = Math.hypot(
        e.clientX - lastActivePos.current.x,
        e.clientY - lastActivePos.current.y
      );
      if (dist < 18) {
        return;
      }
    }

    if (isAnimatingRef.current) return;

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (!isAnimatingRef.current && activeId !== id) {
        sound.playHover();
        lastActivePos.current = { x: e.clientX, y: e.clientY };
        setActiveId(id);
      }
    }, 180);
  };

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    if (!isDesktop) return;
    sound.playClick();
    lastActivePos.current = { x: e.clientX, y: e.clientY };
    setActiveId(id);
  };

  const handleContainerLeave = () => {
    if (!isDesktop) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveId(null);
      lastActivePos.current = { x: -1000, y: -1000 };
    }, 200);
  };

  return (
    <section
      id="service"
      onMouseLeave={handleContainerLeave}
      className="text-white pt-16 pb-28 px-6 md:px-12 flex flex-col relative overflow-hidden font-sans border-t border-white/5"
    >
      <div
        ref={containerRef}
        onMouseLeave={handleContainerLeave}
        className="max-w-5xl mx-auto w-full z-10 relative lg:h-[750px] flex flex-col lg:block gap-5"
      >
        {ENHANCED_SERVICES.map((srv, idx) => {
          const isActive = isDesktop && activeId === srv.id;
          const isCompact = isDesktop && activeId !== null && !isActive;

          return (
            <div
              key={srv.id}
              ref={(node) => {
                cardRefs.current[idx] = node;
              }}
              data-card-id={srv.id}
              onMouseEnter={(e) => handleCardPointer(e, srv.id)}
              onMouseMove={(e) => handleCardPointer(e, srv.id)}
              onClick={(e) => handleCardClick(e, srv.id)}
              className={`rounded-3xl backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-300 relative overflow-hidden flex flex-col justify-between text-left select-none ${
                isCompact ? 'p-5 sm:p-5.5' : 'p-6 sm:p-7'
              } ${
                isDesktop ? 'lg:absolute' : 'w-full'
              } ${
                isActive
                  ? 'bg-[#0a0a0e]/96 border border-[#E5B869]/50 shadow-[0_25px_60px_rgba(229,184,105,0.22)] z-30'
                  : isCompact
                  ? 'bg-[#0a0a0e]/90 hover:bg-[#14141c] border border-white/10 hover:border-[#E5B869]/40 shadow-lg cursor-pointer z-10'
                  : 'bg-[#0a0a0e]/92 hover:bg-[#111118] border border-white/10 hover:border-[#E5B869]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] cursor-pointer group z-10'
              }`}
            >
              {/* Glowing Top Rim Accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r transition-opacity duration-300 ${
                  isActive
                    ? 'from-[#E5B869] via-[#FFF6E5] to-[#E5B869] opacity-90'
                    : 'from-transparent via-[#E5B869] to-transparent opacity-0 group-hover:opacity-100'
                }`}
              />

              {/* Subtle Radial Backlight for Active Flagship */}
              {isActive && (
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#E5B869]/10 rounded-full blur-[90px] pointer-events-none" />
              )}

              {/* Card Header & Content */}
              <div className="relative z-10 flex-1 flex flex-col">
                {/* Domain Tag Bar (Clear uppercase typography, no bullet dot) */}
                <div
                  className={`flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-sans ${
                    isCompact ? 'mb-2' : 'mb-3'
                  }`}
                >
                  <span className="text-[#E5B869] uppercase tracking-widest text-xs font-semibold font-mono">
                    {srv.domain}
                  </span>

                  <div className="text-gray-400">
                    {srv.icon}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`font-bold tracking-tight text-white transition-colors leading-tight mb-1 font-sans ${
                    isActive
                      ? 'text-2xl sm:text-3xl text-white'
                      : isCompact
                      ? 'text-base sm:text-lg font-semibold text-white group-hover:text-[#FFF6E5] truncate'
                      : 'text-xl sm:text-[22px] group-hover:text-[#FFF6E5] line-clamp-1'
                  }`}
                >
                  {srv.title}
                </h3>

                {/* Subtitle / Category - Truncate in compact to prevent wrapping onto 2 lines */}
                <div
                  className={`font-sans text-gray-400 font-normal ${
                    isCompact
                      ? 'text-xs truncate mb-2'
                      : 'text-sm tracking-normal mb-2.5'
                  }`}
                >
                  {srv.subtitle}
                </div>

                {/* Product Description */}
                {isCompact ? (
                  <p className="text-xs text-gray-300 font-normal leading-relaxed line-clamp-2 mb-2 font-sans">
                    {srv.productDescription}
                  </p>
                ) : (
                  <p
                    className={`text-sm sm:text-[15px] text-gray-200 font-normal leading-relaxed mb-3.5 font-sans ${
                      isActive ? 'sm:text-base' : 'line-clamp-2'
                    }`}
                  >
                    {srv.productDescription}
                  </p>
                )}

                {/* ACTIVE FLAGSHIP EXPANDED CONTENT: Operational Challenge & Engineered Solution */}
                {isActive && (
                  <div className="space-y-4 my-2">
                    {/* The Operational Challenge Solved Box */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="text-xs font-mono tracking-wider text-[#E5B869] uppercase font-semibold mb-1.5">
                        Operational Challenge Solved
                      </div>
                      <p className="text-sm sm:text-[15px] text-gray-200 leading-relaxed font-normal font-sans">
                        {srv.challengeSolved}
                      </p>
                    </div>

                    {/* Key Engineering Delivered */}
                    <div>
                      <div className="text-xs font-mono tracking-wider text-[#E5B869] uppercase font-semibold mb-2.5">
                        Key Engineering Delivered
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-200">
                        {srv.keyDeliverables.map((item, i) => (
                          <div key={i} className="flex items-start space-x-2.5 font-sans">
                            <span className="text-[#E5B869] font-medium shrink-0 mt-0.5">–</span>
                            <span className="leading-snug text-sm sm:text-[15px] text-gray-200 font-sans">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* DEFAULT 2x2 GRID PREVIEW OF CHALLENGE (Sized uniform height, clean readable font) */}
                {!isActive && !isCompact && (
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 h-[92px] flex flex-col justify-center my-auto">
                    <div className="text-xs font-mono font-semibold text-[#E5B869] uppercase tracking-wide mb-1">
                      Challenge Solved
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed line-clamp-2 font-sans font-normal">
                      {srv.challengeSummary}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Row: Tech Stack Tags (No +2, clean readable text) */}
              <div
                className={`${
                  isCompact ? 'pt-2.5' : 'pt-3.5'
                } mt-auto border-t border-white/10 flex items-center justify-between relative z-10`}
              >
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(isActive ? srv.tags : srv.tags.slice(0, 3)).map((tag) => (
                    <span
                      key={tag}
                      className={`${
                        isCompact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs sm:text-[13px]'
                      } rounded-full font-sans font-medium ${
                        isActive
                          ? 'bg-white/[0.08] border border-white/20 text-gray-100'
                          : 'bg-white/[0.04] border border-white/10 text-gray-200'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
