
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-auto" }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Simplified Infinity Symbol Representation */}
        <svg viewBox="0 0 100 50" className="w-24 h-12">
          <path 
            d="M30,25 C30,15 10,15 10,25 C10,35 30,35 30,25 C30,15 50,15 50,25 C50,35 70,35 70,25 C70,15 90,15 90,25 C90,35 70,35 70,25" 
            fill="none" 
            stroke="#1B3022" 
            strokeWidth="4"
          />
          <path 
            d="M30,25 C30,15 50,15 50,25 C50,35 70,35 70,25" 
            fill="none" 
            stroke="#D4AF37" 
            strokeWidth="2"
          />
        </svg>
        {/* Building Icon Placeholder inside Infinity */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#D4AF37]" fill="currentColor">
            <path d="M19 21H5V3h14v18zM7 5v2h2V5H7zm0 4v2h2V9H7zm0 4v2h2v-2H7zm0 4v2h2v-2H7zm4-12v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2zm0 4v2h2v-2h-2zm4-12v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2zm0 4v2h2v-2h-2z"/>
          </svg>
        </div>
      </div>
      <div className="text-center">
        <span className="block text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-serif leading-none">Experience Infinite Possibilities</span>
        <span className="block text-white font-serif font-bold text-lg uppercase tracking-widest mt-1">The Infinite <span className="text-[#D4AF37]">Group</span></span>
      </div>
    </div>
  );
};

export default Logo;
