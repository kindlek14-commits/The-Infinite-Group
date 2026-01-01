
import React, { useState } from 'react';

interface PortalLoginProps {
  type: 'Tenant' | 'Owner';
  onSuccess: (authId?: string) => void;
  onBack: () => void;
}

const PortalLogin: React.FC<PortalLoginProps> = ({ type, onSuccess, onBack }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Specific mapping for owners as requested
  // Group = Master/Admin (c1), Mergucz = Bridget (c2), Ellis = LaTherese (c3)
  const ownerCodes: Record<string, string> = {
    'ELLIS': 'c3',
    'MERGUCZ': 'c2',
    'GROUP': 'c1'
  };

  const tenantCode = 'RENT2024';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const normalizedCode = code.trim().toUpperCase();

    // Simulate authentication delay
    setTimeout(() => {
      if (type === 'Tenant') {
        if (normalizedCode === tenantCode) {
          onSuccess();
        } else {
          setError(true);
          setLoading(false);
        }
      } else {
        if (ownerCodes[normalizedCode]) {
          onSuccess(ownerCodes[normalizedCode]);
        } else {
          setError(true);
          setLoading(false);
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#1B3022] border border-[#D4AF37]/30 p-10 rounded-lg shadow-2xl relative overflow-hidden">
        {/* Aesthetic background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-black/50 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-full bg-black/40 border border-[#D4AF37]/20 mb-6">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-white mb-2">{type} Secure Entry</h2>
            <p className="text-gray-400 text-sm">Please enter your unique access code provided by The Infinite Group.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(false);
                }}
                placeholder="Access Code"
                className={`w-full bg-black/50 border ${error ? 'border-red-500' : 'border-white/10'} p-4 rounded text-white text-center text-xl tracking-[0.5em] font-mono outline-none focus:border-[#D4AF37] transition-all uppercase`}
                required
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-[10px] text-center mt-2 font-bold uppercase tracking-widest animate-pulse">
                  Invalid Security Code
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded font-bold uppercase tracking-[0.2em] transition-all shadow-xl ${
                loading ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#D4AF37] text-black hover:bg-[#B89630]'
              }`}
            >
              {loading ? 'Verifying...' : 'Unlock Portal'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest py-2 transition-colors"
            >
              ← Back to Main
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              <span>Security Tier 1</span>
              <span>The Infinite Group</span>
            </div>
            {type === 'Owner' ? (
              <div className="text-[9px] text-gray-700 mt-4 space-y-1 opacity-60">
                <p>* Client Codes: LaTherese (ELLIS), Bridget (MERGUCZ), Master (GROUP)</p>
              </div>
            ) : (
              <p className="text-[10px] text-gray-700 mt-4 text-center leading-relaxed">
                * Demo code: <strong>{tenantCode}</strong>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalLogin;
