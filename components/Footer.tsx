
import React from 'react';
import { ViewState } from '../types';

interface FooterProps {
  setView: (view: ViewState) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-black border-t border-[#D4AF37]/20 py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div 
            className="cursor-pointer mb-4 inline-block"
            onClick={() => setView('HOME')}
          >
            <span className="text-[#D4AF37] text-xl font-serif font-bold tracking-widest uppercase block">
              The <span className="text-white">Infinite</span> Group
            </span>
          </div>
          <p className="text-gray-500 max-w-sm">
            Setting the standard in professional property management. Seamless digital solutions for owners and tenants.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Resources</h4>
          <ul className="text-gray-500 space-y-2 text-sm">
            <li>
              <button 
                onClick={() => setView('TENANT_LOGIN')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Tenant Portal
              </button>
            </li>
            <li>
              <button 
                onClick={() => setView('OWNER_LOGIN')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Owner Login
              </button>
            </li>
            <li>
              <button 
                onClick={() => setView('TENANT_LOGIN')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Maintenance Request
              </button>
            </li>
            <li>
              <button 
                onClick={() => setView('APPLICATION')}
                className="hover:text-[#D4AF37] transition-colors"
              >
                Online Application
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Contact</h4>
          <ul className="text-gray-500 space-y-2 text-sm">
            <li>admin@theinfintegroup.net</li>
            <li>720.271.3556</li>
            <li>1500 N. Grant St. Suite C</li>
            <li>Aurora, Co. 80203</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-xs text-gray-600">
        <p>&copy; 2024 The Infinite Group. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <span className="cursor-pointer hover:text-white">FB</span>
          <span className="cursor-pointer hover:text-white">IG</span>
          <span className="cursor-pointer hover:text-white">LI</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
