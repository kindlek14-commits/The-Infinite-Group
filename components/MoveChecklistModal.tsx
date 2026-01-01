
import React, { useState, useEffect } from 'react';
import { Tenant, ChecklistItem, TenantChecklist } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onSave: (checklist: TenantChecklist) => void;
  existingChecklist?: TenantChecklist;
}

const DEFAULT_ITEMS: Omit<ChecklistItem, 'id' | 'isCompleted'>[] = [
  { label: 'Keys/Fobs Handed Over' },
  { label: 'Unit Cleaning Verified' },
  { label: 'Kitchen Appliances Tested' },
  { label: 'HVAC/Thermostat Operation Checked' },
  { label: 'Smoke & CO Alarms Tested' },
  { label: 'Utilities Transfer Confirmed' },
  { label: 'Paint & Walls Inspected' },
  { label: 'Flooring Condition Verified' },
  { label: 'Plumbing (Faucets/Toilets) Checked' },
  { label: 'Move-in/out Photos Taken' },
];

const MoveChecklistModal: React.FC<Props> = ({ isOpen, onClose, tenant, onSave, existingChecklist }) => {
  const [type, setType] = useState<'MOVE_IN' | 'MOVE_OUT'>('MOVE_IN');
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    if (isOpen && tenant) {
      if (existingChecklist && existingChecklist.tenantId === tenant.id) {
        setItems(existingChecklist.items);
        setType(existingChecklist.type);
      } else {
        // Auto-infer type based on tenant status if no existing checklist
        const inferredType = tenant.status === 'Notice Given' ? 'MOVE_OUT' : 'MOVE_IN';
        setType(inferredType);
        setItems(DEFAULT_ITEMS.map((item, idx) => ({
          id: `item-${idx}`,
          label: item.label,
          isCompleted: false,
        })));
      }
    }
  }, [isOpen, tenant, existingChecklist]);

  if (!isOpen || !tenant) return null;

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const handleSave = () => {
    onSave({
      tenantId: tenant.id,
      type,
      items,
      lastUpdated: new Date().toLocaleString(),
    });
    onClose();
  };

  const completedCount = items.filter(i => i.isCompleted).length;
  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-[#111] border border-[#D4AF37]/40 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-[#1B3022]/30">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-serif text-[#D4AF37]">Inspection Checklist</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                {tenant.name} • {tenant.unit}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setType('MOVE_IN')}
              className={`flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${
                type === 'MOVE_IN' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-gray-500 hover:border-white/30'
              }`}
            >
              Move-In
            </button>
            <button 
              onClick={() => setType('MOVE_OUT')}
              className={`flex-1 py-2 rounded text-[10px] font-bold uppercase tracking-widest border transition-all ${
                type === 'MOVE_OUT' ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/10 text-gray-500 hover:border-white/30'
              }`}
            >
              Move-Out
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase font-bold text-gray-400 tracking-tighter">
              <span>Completion Progress</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#D4AF37] transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow p-8 overflow-y-auto space-y-3 custom-scrollbar">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`group flex items-center p-4 rounded-lg border transition-all cursor-pointer ${
                item.isCompleted 
                  ? 'bg-[#1B3022]/40 border-[#D4AF37]/30' 
                  : 'bg-black/40 border-white/5 hover:border-white/20'
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                item.isCompleted 
                  ? 'bg-[#D4AF37] border-[#D4AF37]' 
                  : 'border-white/20 group-hover:border-[#D4AF37]'
              }`}>
                {item.isCompleted && (
                  <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`ml-4 text-sm font-medium transition-colors ${
                item.isCompleted ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-black flex justify-between items-center">
          <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest italic">
            * Items auto-saved locally upon finalization.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded text-xs font-bold uppercase text-gray-500 hover:text-white transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={handleSave}
              className="bg-[#D4AF37] text-black px-10 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#B89630] transition-transform hover:scale-105 shadow-xl"
            >
              Finalize Inspection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveChecklistModal;
