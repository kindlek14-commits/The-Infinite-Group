
import React, { useState, useMemo, useEffect } from 'react';
import { calculateLateFeeAmount, getLateFeeDescription } from '../utils/feeCalculations';
import { generateSmartReminder } from '../services/geminiService';

const TenantPortal: React.FC = () => {
  const [rentPaid, setRentPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [smartAlert, setSmartAlert] = useState<string>('');
  
  // Simulate "Today's Date" as May 8th (Late) or May 4th (Grace)
  const SIMULATED_DAY = 8;
  const BASE_RENT = 2850;
  
  const lateFee = useMemo(() => calculateLateFeeAmount(SIMULATED_DAY), [SIMULATED_DAY]);
  const totalDue = BASE_RENT + lateFee;

  useEffect(() => {
    if (!rentPaid) {
      const fetchAlert = async () => {
        try {
          const msg = await generateSmartReminder(SIMULATED_DAY, "Alex", SIMULATED_DAY > 5 ? "Past Due" : "Due Soon", totalDue);
          setSmartAlert(msg || '');
        } catch (e) {
          console.error("Failed to fetch smart reminder");
        }
      };
      fetchAlert();
    }
  }, [SIMULATED_DAY, rentPaid, totalDue]);

  const handlePayRent = () => {
    setLoading(true);
    setTimeout(() => {
      setRentPaid(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-white">
      {/* Smart Alert Bar */}
      {!rentPaid && smartAlert && (
        <div className="mb-8 bg-gradient-to-r from-[#1B3022] to-black border border-[#D4AF37]/40 p-4 rounded-lg animate-in fade-in slide-in-from-top-4 duration-700 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${SIMULATED_DAY > 5 ? 'bg-red-500/20 text-red-400' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="flex-grow">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-1 text-gray-500">System Notification</p>
              <p className="text-sm text-gray-200 leading-relaxed italic">"{smartAlert}"</p>
            </div>
            <button onClick={() => setSmartAlert('')} className="text-gray-600 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-serif text-[#D4AF37] mb-2">Welcome Back, Alex</h2>
          <p className="text-gray-400">Unit 402, The Infinite Plaza</p>
        </div>
        <div className="text-right">
          <p className="text-sm uppercase tracking-widest text-[#D4AF37]">Due Date</p>
          <p className="text-xl">May 1st, 2024</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Status: {SIMULATED_DAY > 5 ? 'Past Due' : 'Current'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Rent Card */}
        <div className="bg-[#1B3022] p-8 border border-[#D4AF37]/30 rounded-lg shadow-2xl relative overflow-hidden">
          {lateFee > 0 && !rentPaid && (
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-tighter shadow-lg">
              Action Required: Late Fees
            </div>
          )}
          
          <h3 className="text-2xl font-serif mb-6">Current Statement</h3>
          
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm text-gray-300">
              <span>Monthly Base Rent</span>
              <span>${BASE_RENT.toLocaleString()}</span>
            </div>
            
            {lateFee > 0 && (
              <div className="flex justify-between text-sm text-[#D4AF37] font-medium border-t border-white/5 pt-2">
                <div className="flex flex-col">
                  <span>Late Fee Accrual</span>
                  <span className="text-[10px] uppercase text-gray-500">{getLateFeeDescription(SIMULATED_DAY)}</span>
                </div>
                <span>+ ${lateFee.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline border-t border-[#D4AF37]/30 pt-4 mt-4">
              <span className="text-lg font-serif">Total Balance</span>
              <div className="flex flex-col items-end">
                <span className="text-4xl font-bold">${(rentPaid ? 0 : totalDue).toLocaleString()}</span>
                <span className={`text-[10px] uppercase font-bold tracking-widest mt-1 ${rentPaid ? 'text-green-400' : 'text-red-400'}`}>
                  {rentPaid ? 'Statement Cleared' : 'Payment Required'}
                </span>
              </div>
            </div>
          </div>

          <button 
            disabled={rentPaid || loading}
            onClick={handlePayRent}
            className={`w-full py-4 rounded font-bold uppercase tracking-widest transition-all ${
              rentPaid 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-[#D4AF37] text-black hover:bg-[#B89630] hover:scale-[1.02] shadow-xl'
            }`}
          >
            {loading ? 'Processing...' : rentPaid ? 'Payment Complete' : 'Pay Total Amount Now'}
          </button>
          
          {!rentPaid && (
            <p className="text-[10px] text-gray-500 text-center mt-4 italic">
              * Rent is due on the 1st. Late fees of $50 apply on the 6th, plus $10/day thereafter (Cap: $300).
            </p>
          )}
        </div>

        {/* Recent Notices */}
        <div className="bg-black p-8 border border-[#D4AF37]/30 rounded-lg">
          <h3 className="text-2xl font-serif mb-6 text-[#D4AF37]">Communication Hub</h3>
          <div className="space-y-4">
            {[
              { title: "Automated Late Fee Notification", date: "May 6", priority: "High" },
              { title: "Smart Payment Reminder", date: "May 4", priority: "Normal" },
              { title: "Fire Alarm Testing", date: "April 10", priority: "Normal" }
            ].map((notice, idx) => (
              <div key={idx} className="border-b border-white/10 pb-3 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className={`text-[8px] font-bold uppercase mb-1 ${notice.priority === 'High' ? 'text-red-400' : 'text-gray-500'}`}>
                    {notice.priority} Priority
                  </span>
                  <span className="text-gray-300 text-sm">{notice.title}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{notice.date}</span>
              </div>
            ))}
          </div>
          <button className="mt-6 text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:underline">
            View All Communications →
          </button>
        </div>
      </div>

      {/* Maintenance Request Section */}
      <div className="mt-12 bg-[#111] p-8 border border-white/5 rounded-lg">
        <h3 className="text-2xl font-serif mb-6">Service Request</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
            type="text" 
            placeholder="Issue Subject" 
            className="bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none text-sm"
          />
          <select className="bg-black border border-white/10 p-3 rounded text-white focus:border-[#D4AF37] outline-none text-sm appearance-none">
            <option>Urgency: Normal</option>
            <option>Urgency: High</option>
            <option>Urgency: Emergency</option>
          </select>
          <textarea 
            placeholder="Please describe the maintenance required in detail..." 
            className="md:col-span-2 bg-black border border-white/10 p-4 rounded text-white h-32 focus:border-[#D4AF37] outline-none text-sm resize-none"
          ></textarea>
          <button className="bg-white text-black py-3 px-10 rounded font-bold uppercase text-xs tracking-widest hover:bg-gray-200 transition-colors w-max">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantPortal;
