import React from 'react';

export const CelebrationDanceSection: React.FC = () => {
  return (
    <section
      id="dance"
      className="w-full min-h-[520px] md:min-h-[580px] flex flex-col items-center justify-center relative overflow-hidden border-t border-white/5 pt-16 pb-12 select-none"
    >
      {/* Ambient celebratory stage lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E5B869]/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[340px] h-[30px] bg-white/[0.03] rounded-full blur-xl pointer-events-none" />
    </section>
  );
};

export default CelebrationDanceSection;
