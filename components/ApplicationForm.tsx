
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const ApplicationForm: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    property: '1201 S. Hickory St',
    income: '',
    consent: false,
    feeAcknowledged: false
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.feeAcknowledged) {
      alert('Please acknowledge the non-refundable application fee to proceed.');
      return;
    }
    alert('Application submitted successfully! Our agents will contact you after the background check. Please check your email for the $100 payment link.');
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 text-white">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif text-[#D4AF37] mb-4">Rental Application</h2>
        <div className="inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-2 rounded mb-6">
          <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
            Application Fee: $100.00 <span className="text-white/60 font-normal ml-2">(Non-Refundable)</span>
          </p>
        </div>
        <div className="flex justify-center items-center space-x-4">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`w-3 h-3 rounded-full ${step >= s ? 'bg-[#D4AF37]' : 'bg-gray-800'}`}
            ></div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1B3022] p-10 border border-[#D4AF37]/20 rounded-lg shadow-2xl">
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-6 border-b border-white/10 pb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="First Name" 
                required
                className="bg-black border border-white/10 p-3 rounded outline-none focus:border-[#D4AF37] transition-colors"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
              <input 
                type="text" 
                placeholder="Last Name" 
                required
                className="bg-black border border-white/10 p-3 rounded outline-none focus:border-[#D4AF37] transition-colors"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-black border border-white/10 p-3 rounded outline-none focus:border-[#D4AF37] transition-colors"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            <button 
              type="button" 
              onClick={nextStep}
              className="w-full bg-[#D4AF37] text-black py-4 rounded font-bold uppercase tracking-widest hover:bg-[#B89630] transition-colors mt-4"
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-6 border-b border-white/10 pb-4">Financial Details</h3>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Target Property</label>
              <select 
                className="w-full bg-black border border-white/10 p-3 rounded outline-none focus:border-[#D4AF37] transition-colors appearance-none"
                value={formData.property}
                onChange={e => setFormData({...formData, property: e.target.value})}
              >
                <option value="1201 S. Hickory St">1201 S. Hickory St (Infinite)</option>
                <option value="502 S Missouri St.">502 S Missouri St. (Infinite)</option>
                <option value="4028 w 16th Ave">4028 w 16th Ave (Infinite)</option>
                <option value="2015 W. 26th Ave">2015 W. 26th Ave (Infinite)</option>
                <option value="2017 W. 26th">2017 W. 26th (Infinite)</option>
                <option value="3607 Missouri St. Pine Bluff">3607 Missouri St. Pine Bluff (Bridget)</option>
                <option value="2006 W. 17th">2006 W. 17th (LaTherese)</option>
                <option value="2008 W. 17th">2008 W. 17th (LaTherese)</option>
                <option value="1215 W. 17th">1215 W. 17th (LaTherese)</option>
                <option value="1217 W. 17th">1217 W. 17th (LaTherese)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase text-gray-500 mb-2">Annual Gross Income</label>
              <input 
                type="text" 
                placeholder="$0.00" 
                required
                className="w-full bg-black border border-white/10 p-3 rounded outline-none focus:border-[#D4AF37] transition-colors"
                value={formData.income}
                onChange={e => setFormData({...formData, income: e.target.value})}
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={prevStep} className="flex-1 border border-white/20 py-4 rounded font-bold hover:bg-white/5 transition-colors">Back</button>
              <button type="button" onClick={nextStep} className="flex-1 bg-[#D4AF37] text-black py-4 rounded font-bold uppercase tracking-widest">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-2xl font-serif mb-6 border-b border-white/10 pb-4">Verification & Consent</h3>
            <div className="bg-black/50 p-6 rounded text-sm text-gray-400 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar border border-white/5">
              <p className="mb-4 text-white font-bold">Important Notice Regarding Fees:</p>
              <p className="mb-4 text-[#D4AF37]">A non-refundable application fee of $100.00 is required to process this request. This fee covers credit screening, background checks, and administrative overhead. By submitting this form, you understand that this payment is mandatory and will not be returned regardless of the application outcome.</p>
              <p className="mb-4">I authorize The Infinite Group to perform a comprehensive background and credit check, which includes but is not limited to: criminal records, eviction history, and credit score verification.</p>
              <p>Failure to provide accurate information may result in immediate rejection of this application.</p>
            </div>
            
            <div className="space-y-4 pt-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 accent-[#D4AF37] bg-black border-white/10"
                  checked={formData.feeAcknowledged}
                  onChange={e => setFormData({...formData, feeAcknowledged: e.target.checked})}
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">I acknowledge that the <strong>$100.00 application fee is non-refundable</strong>.</span>
              </label>
              
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="mt-1 w-5 h-5 accent-[#D4AF37] bg-black border-white/10"
                  checked={formData.consent}
                  onChange={e => setFormData({...formData, consent: e.target.checked})}
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">I consent to the background and credit check.</span>
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={prevStep} className="flex-1 border border-white/20 py-4 rounded font-bold hover:bg-white/5 transition-colors">Back</button>
              <button 
                type="submit" 
                disabled={!formData.consent || !formData.feeAcknowledged}
                className={`flex-1 py-4 rounded font-bold uppercase tracking-widest transition-all shadow-xl ${
                  (formData.consent && formData.feeAcknowledged) 
                  ? 'bg-[#D4AF37] text-black hover:bg-[#B89630] hover:scale-[1.02]' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                Submit Application
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ApplicationForm;
