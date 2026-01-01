
import React, { useState } from 'react';
import { Tenant } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tenant: Omit<Tenant, 'id'>) => void;
}

const AddTenantModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    unit: '',
    status: 'Active' as Tenant['status'],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', email: '', phone: '', unit: '', status: 'Active' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#D4AF37]/50 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1B3022]/40">
          <h3 className="text-xl font-serif text-[#D4AF37]">Add New Tenant</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none"
                placeholder="(555) 000-0000"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Unit Address / ID</label>
            <input
              type="text"
              required
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none"
              placeholder="e.g. 5 Pine Place"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Tenant['status'] })}
              className="w-full bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none"
            >
              <option value="Active">Active</option>
              <option value="Delinquent">Delinquent</option>
              <option value="Notice Given">Notice Given</option>
            </select>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-black py-4 rounded font-bold uppercase tracking-widest hover:bg-[#B89630] transition-colors"
            >
              Add Tenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTenantModal;
