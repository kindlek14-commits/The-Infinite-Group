
import React from 'react';
import Logo from './Logo';

interface HeroProps {
  onAction: () => void;
}

const Hero: React.FC<HeroProps> = ({ onAction }) => {
  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2000')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>
      
      <div className="relative z-10 text-left px-6 max-w-6xl w-full">
        <Logo className="mb-12" />
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
          Where Luxury Meets <br />
          <span className="text-[#D4AF37]">Infinite Reliability</span>
        </h1>
        <p className="text-gray-300 text-xl md:text-2xl mb-10 max-w-2xl font-light">
          Bespoke property management services tailored for modern portfolios. 
          The benchmark of property excellence and elite resident satisfaction.
        </p>
        <div className="flex space-x-4">
          <button 
            onClick={onAction}
            className="bg-[#D4AF37] text-black px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-[#B89630] transition-colors"
          >
            Start Application
          </button>
          <button className="border border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-black transition-all">
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
