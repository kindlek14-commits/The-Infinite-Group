
import React, { useState } from 'react';
import { ViewState } from '../types';

interface NavbarProps {
  setView: (view: ViewState) => void;
  activeView: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ setView, activeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { label: string; view: ViewState }[] = [
    { label: 'Home', view: 'HOME' },
    { label: 'Tenant Portal', view: 'TENANT_LOGIN' },
    { label: 'Owner Portal', view: 'OWNER_LOGIN' },
    { label: 'Apply', view: 'APPLICATION' },
  ];

  const handleNavClick = (view: ViewState) => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black border-b border-[#D4AF37]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick('HOME')}
          >
            <div className="mr-4 transition-transform group-hover:scale-105">
              <svg viewBox="0 0 100 50" className="w-12 h-6">
                <path d="M30,25 C30,15 10,15 10,25 C10,35 30,35 30,25 C30,15 50,15 50,25 C50,35 70,35 70,25 C70,15 90,15 90,25 C90,35 70,35 70,25" fill="none" stroke="#D4AF37" strokeWidth="3" />
              </svg>
            </div>
            <span className="text-[#D4AF37] text-xl font-serif font-bold tracking-widest uppercase">
              The <span className="text-white">Infinite</span> Group
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const isActive = activeView === item.view || 
                (item.view === 'TENANT_LOGIN' && activeView === 'TENANT_PORTAL') ||
                (item.view === 'OWNER_LOGIN' && activeView === 'OWNER_PORTAL');
                
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`${
                    isActive 
                      ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' 
                      : 'text-gray-300 hover:text-[#D4AF37]'
                  } px-1 py-2 text-sm font-medium transition-colors duration-200`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#D4AF37] p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-[#D4AF37]/20 px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`block w-full text-left text-lg font-medium px-4 py-2 rounded-lg ${
                activeView === item.view 
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37]' 
                  : 'text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
