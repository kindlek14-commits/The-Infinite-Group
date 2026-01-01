
import React, { useState, useEffect } from 'react';
import { Lease } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lease: Lease | null;
  onRenew: (updatedLease: Lease) => void;
}

const RenewLeaseModal: React.FC<Props> = ({ isOpen, onClose, lease, onRenew }) => {
  const [formData, setFormData] = useState({
    monthlyRent: 0,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (lease) {
      // Logic to suggest a renewal: 1 year from the current end date
      const currentEnd = new Date(lease.endDate);
      const newStart = new Date(currentEnd);
      newStart.setDate(newStart.getDate() + 1);
      
      const newEnd = new Date(newStart);
      newEnd.setFullYear(newEnd.getFullYear() + 1);

      setFormData({
        monthlyRent: lease.monthlyRent,
        startDate: newStart.toISOString().split('T')[0],
        endDate: newEnd.toISOString().split('T')[0],
      });
    }
  }, [lease]);

  if (!isOpen || !lease) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRenew({
      ...lease,
      monthlyRent: formData.monthlyRent,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#D4AF37]/50 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1B3022]/40">
          <div>
            <h3 className="text-xl font-serif text-[#D4AF37]">Lease Renewal Agreement</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
              Tenant: {lease.tenantName} • {lease.unit}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-black/40 p-4 border border-white/5 rounded-lg mb-4">
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Current Lease Terms</p>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Current Rent:</span>
              <span className="text-white">${lease.monthlyRent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-400">Current End Date:</span>
              <span className="text-white">{lease.endDate}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">New Monthly Rent</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  required
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) })}
                  className="w-full bg-black border border-white/10 p-3 pl-8 rounded text-white focus:border-[#D4AF37] outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">New Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">New End Date</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <p className="text-[9px] text-gray-600 italic mb-4">
              * Renewing this lease will generate a new digital contract for the tenant to sign. The portfolio analytics will reflect these updated terms starting from the new effective date.
            </p>
            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-black py-4 rounded font-bold uppercase tracking-widest hover:bg-[#B89630] transition-colors shadow-lg"
            >
              Finalize Renewal Terms
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewLeaseModal;
