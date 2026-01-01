
import React, { useState } from 'react';
import { Tenant } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onGenerate: (type: string, context: string) => void;
}

const NOTICE_TYPES = [
  { id: 'LEASE_RENEWAL', label: 'Lease Renewal' },
  { id: 'LATE_RENT', label: 'Late Rent / Delinquency' },
  { id: 'MAINTENANCE', label: 'Maintenance / Entry' },
  { id: 'GENERAL', label: 'General Announcement' },
];

const NoticeModal: React.FC<Props> = ({ isOpen, onClose, tenant, onGenerate }) => {
  const [type, setType] = useState('LEASE_RENEWAL');
  const [context, setContext] = useState('');

  if (!isOpen || !tenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(type, context);
    onClose();
    setContext('');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-[#111] border border-[#D4AF37]/40 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-[#1B3022]/40 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-serif text-[#D4AF37]">Draft AI Notice</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Recipient: {tenant.name} • {tenant.unit}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-2">Notice Type</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none text-sm appearance-none"
            >
              {NOTICE_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-2">Additional Context / Details</label>
            <textarea 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Lease expires in 60 days. Please review renewal terms in the owner portal."
              className="w-full bg-black border border-white/10 p-4 rounded text-white h-32 focus:border-[#D4AF37] outline-none text-sm resize-none custom-scrollbar"
            />
            <p className="text-[9px] text-gray-600 mt-2 italic">
              * The Infinite Group AI will use this context to craft a professional notice.
            </p>
          </div>

          <div className="pt-4 flex space-x-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold uppercase text-gray-500 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-[#D4AF37] text-black py-3 rounded font-bold uppercase tracking-widest hover:bg-[#B89630] transition-transform hover:scale-[1.02] shadow-xl"
            >
              Generate Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeModal;
