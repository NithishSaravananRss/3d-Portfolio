import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

interface LetterPhysicsIntroProps {
  word?: string;
  pivotIndex?: number;
  className?: string;
  letterClassName?: string;
  dotClassName?: string;
  speed?: number;
  onComplete?: () => void;
}

interface LetterMetrics {
  cx: number;
  bottom: number;
  height: number;
}

// Canvas-based precise glyph metric calculation with robust fallbacks
const measureGlyphMetrics = (
  char: string,
  element: HTMLElement,
  containerHeight: number
): LetterMetrics => {
  try {
    const canvas = (measureGlyphMetrics as any).canvas || 
      ((measureGlyphMetrics as any).canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { cx: 20, bottom: containerHeight, height: containerHeight * 0.78 };
    }

    const style = getComputedStyle(element);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics = ctx.measureText(char);

    const left = Number.isFinite(metrics.actualBoundingBoxLeft) ? metrics.actualBoundingBoxLeft : 0;
    const right = Number.isFinite(metrics.actualBoundingBoxRight) ? metrics.actualBoundingBoxRight : 40;
    const ascent = Number.isFinite(metrics.fontBoundingBoxAscent)
      ? metrics.fontBoundingBoxAscent
      : (Number.isFinite(metrics.actualBoundingBoxAscent) ? metrics.actualBoundingBoxAscent : containerHeight * 0.72);
    const descent = Number.isFinite(metrics.fontBoundingBoxDescent)
      ? metrics.fontBoundingBoxDescent
      : (Number.isFinite(metrics.actualBoundingBoxDescent) ? metrics.actualBoundingBoxDescent : containerHeight * 0.18);

    const baselineOffset =
      (containerHeight - (ascent + descent)) / 2 + ascent;

    return {
      cx: Math.max(8, (right - left) / 2),
      bottom: Number.isFinite(baselineOffset + descent) ? baselineOffset + descent : containerHeight,
      height: Math.max(16, ascent + descent),
    };
  } catch {
    return { cx: 20, bottom: containerHeight, height: containerHeight * 0.78 };
  }
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const LetterPhysicsIntro: React.FC<LetterPhysicsIntroProps> = ({
  word = 'NITHISH',
  pivotIndex,
  className = '',
  letterClassName = '',
  dotClassName = 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)]',
  speed = 1.1,
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const [resizeKey, setResizeKey] = useState(0);
  const letters = useMemo(() => Array.from(word), [word]);

  // Determine optimal pivot letter.
  // In NITHISH: indices 1 ('I') and 4 ('I'). Index 4 gives 4 letters left ('NITH') and 2 right ('SH')
  const resolvedPivot = useMemo(() => {
    if (Number.isInteger(pivotIndex) && letters[pivotIndex!]?.trim()) {
      return pivotIndex!;
    }
    const secondI = letters.findIndex((ch, i) => i > 2 && 'Iil1'.includes(ch));
    if (secondI !== -1) return secondI;
    const firstI = letters.findIndex((ch) => 'Iil1'.includes(ch));
    return firstI !== -1 ? firstI : Math.floor(letters.length / 2);
  }, [letters, pivotIndex]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const heading = headingRef.current;
    const dot = dotRef.current;
    const flash = flashRef.current;
    const spans = letterRefs.current.slice(0, letters.length);
    const pivotSpan = spans[resolvedPivot];

    if (!container || !heading || !dot || !pivotSpan) return;

    const nonPivotIndices = spans
      .map((span, idx) => (span && idx !== resolvedPivot && letters[idx].trim() ? idx : -1))
      .filter((idx) => idx !== -1);

    if (prefersReducedMotion()) {
      gsap.set(spans.filter(Boolean), { opacity: 1 });
      gsap.set(dot, { opacity: 0 });
      const timer = setTimeout(() => onCompleteRef.current?.(), 250);
      return () => clearTimeout(timer);
    }

    gsap.set(spans.filter(Boolean), { opacity: 0 });
    gsap.set(dot, { opacity: 0 });

    let ctx: gsap.Context | null = null;
    let isCleanedUp = false;

    // Safety timeout to ensure intro sequence always resolves even if an animation frame is delayed
    const safetyTimer = setTimeout(() => {
      onCompleteRef.current?.();
    }, Math.round(5200 / speed));

    const fontPromise = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 300)),
    ]);
    fontPromise.then(() => {
      if (isCleanedUp) return;

      ctx = gsap.context(() => {
        gsap.set([...spans.filter(Boolean), dot], { clearProps: 'transform' });

        const contRect = container.getBoundingClientRect();
        const fontSize = parseFloat(getComputedStyle(heading).fontSize) || 16;

        const letterBounds = spans.map((span) => {
          if (!span) return null;
          const rect = span.getBoundingClientRect();
          return {
            left: rect.left - contRect.left,
            top: rect.top - contRect.top,
            w: rect.width,
            h: rect.height,
            cx: rect.left - contRect.left + rect.width / 2,
            cy: rect.top - contRect.top + rect.height / 2,
          };
        });

        const pivotBounds = letterBounds[resolvedPivot];
        if (!pivotBounds) return;

        const glyphMetrics =
          measureGlyphMetrics(letters[resolvedPivot], pivotSpan, pivotBounds.h) ?? {
            cx: pivotBounds.w / 2,
            bottom: pivotBounds.h,
            height: pivotBounds.h * 0.78,
          };

        const pivotAnchor = {
          x: pivotBounds.left + glyphMetrics.cx,
          y: pivotBounds.top + glyphMetrics.bottom,
        };

        const pivotHeight = glyphMetrics.height;
        const dotSize = fontSize * 0.22;

        gsap.set(pivotSpan, {
          transformOrigin: `${(glyphMetrics.cx / pivotBounds.w) * 100}% ${(glyphMetrics.bottom / pivotBounds.h) * 100}%`,
        });

        gsap.set(dot, {
          width: dotSize,
          height: dotSize,
          left: pivotAnchor.x - dotSize / 2,
          top: pivotAnchor.y + fontSize * 0.1,
        });

        const getArcPosition = (angleDeg: number) => {
          const rad = (angleDeg * Math.PI) / 180;
          return {
            x: pivotAnchor.x + Math.sin(rad) * pivotHeight,
            y: pivotAnchor.y - Math.cos(rad) * pivotHeight,
          };
        };

        const dropOriginY = -(contRect.top + pivotAnchor.y) - fontSize;
        const flashSize = fontSize * 2.6;

        const triggerImpactFlash = (
          tl: gsap.core.Timeline,
          pos: { x: number; y: number },
          opacityVal: number,
          time: number
        ) => {
          if (!flash) return;
          tl.set(
            flash,
            {
              width: flashSize,
              height: flashSize,
              left: pos.x - flashSize / 2,
              top: pos.y - flashSize / 2,
            },
            time
          )
            .to(flash, { opacity: opacityVal, duration: 0.05, ease: 'none' }, time)
            .to(flash, { opacity: 0, duration: 0.34, ease: 'power2.out' }, time + 0.05);
        };

        const catapultLetter = (
          tl: gsap.core.Timeline,
          idx: number,
          launchPos: { x: number; y: number },
          startTime: number,
          isRightSide: boolean
        ) => {
          const targetSpan = spans[idx];
          const targetBounds = letterBounds[idx];
          if (!targetSpan || !targetBounds) return startTime;

          // For rightward letters (S, H): startX must be strictly NEGATIVE so they travel from the pivot to the right
          // For leftward letters (N, I, T, H): startX must be strictly POSITIVE so they travel from the pivot to the left
          let startX: number;
          let launchSpin: number;
          if (isRightSide) {
            startX = -Math.max(targetBounds.cx - pivotAnchor.x, 35);
            launchSpin = gsap.utils.random(180, 320); // clockwise spin
          } else {
            startX = Math.max(pivotAnchor.x - targetBounds.cx, 35);
            launchSpin = -gsap.utils.random(180, 320); // counter-clockwise spin
          }

          const startY = launchPos.y - targetBounds.cy;
          const travelDuration = 0.42 + Math.min(Math.abs(startX) / 850, 0.25);
          const arcApex = -(Math.abs(startX) * 0.32 + fontSize * 0.28);

          tl.set(
            targetSpan,
            {
              x: startX,
              y: startY,
              rotation: launchSpin,
              scale: 0.35,
              opacity: 0,
              transformOrigin: '50% 50%',
            },
            startTime
          )
            .to(targetSpan, { opacity: 1, scale: 1, duration: travelDuration * 0.4 }, startTime)
            .to(targetSpan, { x: 0, duration: travelDuration, ease: 'power1.out' }, startTime)
            .to(
              targetSpan,
              {
                y: startY + arcApex,
                duration: travelDuration * 0.45,
                ease: 'power2.out',
              },
              startTime
            )
            .to(
              targetSpan,
              {
                y: 0,
                duration: travelDuration * 0.55,
                ease: 'power2.in',
              },
              startTime + travelDuration * 0.45
            )
            .to(targetSpan, { rotation: 0, duration: travelDuration, ease: 'power2.out' }, startTime)
            .to(
              targetSpan,
              {
                y: -fontSize * 0.04,
                duration: 0.08,
                ease: 'power2.out',
              },
              startTime + travelDuration
            )
            .to(
              targetSpan,
              {
                y: 0,
                duration: 0.14,
                ease: 'power2.in',
              },
              startTime + travelDuration + 0.08
            );

          return startTime + travelDuration;
        };

        const catapultGroup = (
          tl: gsap.core.Timeline,
          tiltAngle: number,
          groupIndices: number[],
          startTime: number,
          isRightSide: boolean
        ) => {
          if (!groupIndices.length) return startTime;
          const launchPos = getArcPosition(tiltAngle);

          // Snappy windup opposite, then dynamic catapult tilt
          const windupAngle = isRightSide ? -10 : 10;
          tl.to(pivotSpan, { rotation: windupAngle, duration: 0.10, ease: 'power1.out' }, startTime)
            .to(pivotSpan, { rotation: tiltAngle, duration: 0.26, ease: 'back.out(1.8)' }, startTime + 0.10);

          let maxEndTime = startTime + 0.36;
          groupIndices.forEach((letterIdx, order) => {
            const letterLaunchTime = startTime + 0.20 + order * 0.13;
            triggerImpactFlash(tl, launchPos, 0.5 - order * 0.08, letterLaunchTime);
            maxEndTime = Math.max(
              maxEndTime,
              catapultLetter(tl, letterIdx, launchPos, letterLaunchTime, isRightSide)
            );
          });

          return maxEndTime;
        };

        // Master Timeline
        const masterTL = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => {
            onCompleteRef.current?.();
          },
        });

        masterTL.timeScale(speed);

        // Initial setup
        masterTL
          .set(container, { opacity: 1 })
          .set(spans.filter(Boolean), { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 })
          .set(pivotSpan, { opacity: 0, y: dropOriginY, rotation: 0 })
          .set(dot, { opacity: 0, y: dropOriginY, scale: 1 });

        // Phase 1: Ball drop & squash/stretch
        const ballTL = gsap.timeline({ defaults: { ease: 'power2.out' } });
        const bounceHeight = fontSize * 0.35;

        ballTL
          .set(dot, { opacity: 1 }, 0)
          .to(dot, { y: 0, duration: 0.32, ease: 'power2.in' }, 0)
          .to(dot, { scaleX: 0.82, scaleY: 1.22, duration: 0.20, ease: 'power1.in' }, 0.12)
          .to(dot, { scaleX: 1.4, scaleY: 0.52, duration: 0.05 }, 0.32)
          .to(dot, { y: -bounceHeight, duration: 0.16 }, 0.37)
          .to(dot, { scaleX: 1, scaleY: 1, duration: 0.14 }, 0.37)
          .to(dot, { y: 0, duration: 0.15, ease: 'power2.in' }, 0.53)
          .to(dot, { scaleX: 1.2, scaleY: 0.74, duration: 0.05 }, 0.68)
          .to(dot, { scaleX: 1, scaleY: 1, duration: 0.25, ease: 'elastic.out(1, 0.42)' }, 0.73);

        triggerImpactFlash(ballTL, pivotAnchor, 0.4, 0.32);
        triggerImpactFlash(ballTL, pivotAnchor, 0.24, 0.68);

        // Phase 2: Pivot Letter Drop (crisp, authoritative drop from top)
        const letterBounce = fontSize * 0.11;
        ballTL
          .set(pivotSpan, { opacity: 1 }, 0.40)
          .to(pivotSpan, { y: 0, duration: 0.30, ease: 'power3.in' }, 0.40)
          .to(pivotSpan, { scaleX: 0.88, scaleY: 1.15, duration: 0.20, ease: 'power1.in' }, 0.48)
          .to(pivotSpan, { scaleX: 1.30, scaleY: 0.68, duration: 0.05 }, 0.70)
          .to(pivotSpan, { y: -letterBounce, duration: 0.08 }, 0.75)
          .to(pivotSpan, { scaleX: 1, scaleY: 1, duration: 0.10 }, 0.75)
          .to(pivotSpan, { y: 0, duration: 0.08, ease: 'power2.in' }, 0.83)
          .to(pivotSpan, { scaleX: 1.12, scaleY: 0.88, duration: 0.05 }, 0.91)
          .to(pivotSpan, { scaleX: 1, scaleY: 1, duration: 0.26, ease: 'elastic.out(1, 0.4)' }, 0.96)
          .fromTo(
            pivotSpan,
            { rotation: -6 },
            { rotation: 0, duration: 0.35, ease: 'elastic.out(1, 0.4)' },
            0.74
          );

        triggerImpactFlash(ballTL, pivotAnchor, 0.6, 0.70);
        triggerImpactFlash(ballTL, pivotAnchor, 0.26, 0.91);

        masterTL.add(ballTL, 0);

        // Phase 3 & 4: Catapult Left (-28°) and Right (+28°)
        const leftGroup = nonPivotIndices.filter((idx) => idx < resolvedPivot).reverse();
        const rightGroup = nonPivotIndices.filter((idx) => idx > resolvedPivot);

        let launchTime = 0.92;
        launchTime = catapultGroup(masterTL, -28, leftGroup, launchTime, false);
        launchTime = catapultGroup(
          masterTL,
          28,
          rightGroup,
          leftGroup.length ? launchTime - 0.18 : launchTime,
          true
        );

        // Settle pivot back to upright and fade out bouncing dot
        masterTL
          .to(pivotSpan, { rotation: 0, duration: 0.45, ease: 'elastic.out(1.2, 0.5)' }, launchTime - 0.10)
          .to(dot, { opacity: 0, scale: 0, duration: 0.25, ease: 'power2.in' }, launchTime - 0.05);
      }, container);
    });

    let resizeTimer: any;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setResizeKey((k) => k + 1);
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isCleanedUp = true;
      clearTimeout(safetyTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      ctx?.revert();
    };
  }, [letters, resolvedPivot, speed, resizeKey]);

  return (
    <div
      ref={containerRef}
      aria-label={word}
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-100 select-none pointer-events-none z-30"
    >
      <h1 ref={headingRef} className={className}>
        {letters.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
            className={`inline-block will-change-transform ${letterClassName}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* Physics bouncing dot */}
      <span
        ref={dotRef}
        className={`absolute rounded-full pointer-events-none z-40 ${dotClassName}`}
      />

      {/* Glow flash on impact */}
      <span
        ref={flashRef}
        className="absolute rounded-full opacity-0 pointer-events-none z-30"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(229, 184, 105, 0.45) 40%, rgba(255, 255, 255, 0) 70%)',
        }}
      />
    </div>
  );
};

export default LetterPhysicsIntro;
