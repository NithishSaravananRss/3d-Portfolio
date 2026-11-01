import React, { useState, useEffect } from 'react';
import { Monitor, MoreVertical, X, CheckCircle2 } from 'lucide-react';
import { sound } from '../../utils/sound';

export const MobileDesktopNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('mobile_notice_dismissed');
    if (dismissed) return;

    // Detect mobile by width or touch capability
    const checkMobile = () => {
      const isMobileWidth = window.innerWidth < 1024;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isMobileWidth || isTouch) {
        // Slight delay so page renders first
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    };

    checkMobile();
  }, []);

  const handleDismiss = () => {
    sound.playClick();
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('mobile_notice_dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-6 duration-500 font-sans">
      <div className="max-w-md w-full p-5 rounded-3xl bg-[#0a0a0e]/95 border border-[#E5B869]/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] pointer-events-auto relative overflow-hidden">
        {/* Subtle Champagne Gold Top Rim */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5B869] to-transparent" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          aria-label="Dismiss notice"
        >
          <X size={16} />
        </button>

        <div className="flex items-start space-x-3.5 pr-6">
          <div className="w-10 h-10 rounded-2xl bg-[#E5B869]/15 border border-[#E5B869]/30 flex items-center justify-center text-[#E5B869] shrink-0 mt-0.5">
            <Monitor size={20} />
          </div>

          <div className="flex-1 text-left">
            <h4 className="text-sm font-bold text-white tracking-tight flex items-center space-x-1.5 mb-1 font-sans">
              <span>Best Experienced on Desktop</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-sans mb-3">
              This portfolio features interactive 3D WebGL avatars, physics typography, and cinematic widescreen staging.
            </p>

            {/* Step-by-Step Mobile Instructions */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-gray-200 space-y-2 mb-3.5 font-sans">
              <div className="flex items-center space-x-2 text-gray-300 font-medium">
                <span className="text-[#E5B869] font-bold">To view full 3D mode on mobile:</span>
              </div>
              <div className="flex items-start space-x-2 text-[11px] text-gray-300">
                <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">1</span>
                <span>Tap the browser menu (<MoreVertical size={12} className="inline mx-0.5 text-[#E5B869]" /> three dots in Chrome or <strong>aA</strong> in Safari)</span>
              </div>
              <div className="flex items-start space-x-2 text-[11px] text-gray-300">
                <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">2</span>
                <span className="flex items-center flex-wrap gap-1">
                  Enable <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold border border-white/20"><CheckCircle2 size={10} className="mr-1 text-[#E5B869]" /> Desktop site</span>
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleDismiss}
                className="w-full py-2.5 px-4 rounded-xl bg-[#E5B869] hover:bg-[#FFF6E5] text-black font-semibold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(229,184,105,0.3)] hover:shadow-[0_0_25px_rgba(229,184,105,0.5)] font-sans text-center"
              >
                Continue in Mobile View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDesktopNotice;
