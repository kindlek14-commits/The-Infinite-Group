
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AgreementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-white text-black max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl p-12 font-serif">
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tight mb-2">Property Management Agreement</h1>
            <p className="text-gray-600 italic">Official Document of The Infinite Group</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>This <strong>Agreement</strong> is made and entered into this 1st day of January, 2026, by and between:</p>
          <p><strong>The Infinite Group</strong> (hereinafter referred to as "Property Manager"), with its principal place of business at 1500 N. Grant St. Suite C Aurora, Co. 80203, and <strong>the Client (Owner)</strong>, an entity represented by the signed party of record.</p>

          <section>
            <h2 className="font-bold text-lg mb-2 underline">1. Property Description</h2>
            <p>This Agreement applies to the following property/properties ("the Property"): <strong>All Properties owned by the Client/Owner of record.</strong></p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 underline">2. Term</h2>
            <p>This Agreement shall begin on 1st day of January, 2026 and continue on a month-to-month basis until terminated by either party with thirty (30) days' written notice.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 underline">3. Manager's Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Advertise and market vacant units.</li>
              <li>Screen and approve tenants.</li>
              <li>Collect rents and deposits.</li>
              <li>Enforce lease terms and handle tenant relations.</li>
              <li>Coordinate maintenance and repairs with Owner’s approval.</li>
              <li>Provide monthly accounting statements and reports to the Owner.</li>
              <li>Comply with all applicable federal, state, and local laws, including Arkansas landlord-tenant law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 underline">4. Owner's Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintain appropriate property insurance and comply with all legal obligations.</li>
              <li>Approve all repairs, maintenance, and improvements prior to execution, including emergencies.</li>
              <li>Provide all necessary property documentation and disclosures to the Manager.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 underline">5. Compensation</h2>
            <p>The Owner agrees to compensate the Manager at a rate of <strong>10% of the gross monthly rent per door</strong> collected. This fee shall be deducted from rental proceeds before remittance to the Owner each month.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 underline">6. Repairs and Improvements</h2>
            <p>The Manager shall not perform or contract for any repairs, maintenance, or property improvements without prior written or verbal approval from the Owner. All expenditures require the Owner's consent, including emergencies.</p>
          </section>

          <section>
            <h2 className="font-bold text-lg mb-2 underline">7. Tenant Deposits and Funds</h2>
            <p>All tenant deposits and operating funds will be held in a separate trust account by the Owner, in compliance with Arkansas law.</p>
          </section>

          <div className="pt-12 border-t border-gray-200 grid grid-cols-2 gap-12">
            <div>
              <p className="font-bold mb-4">The Client / Owner</p>
              <div className="h-12 border-b border-black mb-1 italic font-serif text-xl px-2 text-gray-400 font-light">E-Signature on File</div>
              <p className="text-xs">By: Authorized Member</p>
              <p className="text-xs">Title: Owner/Member</p>
            </div>
            <div>
              <p className="font-bold mb-4">The Infinite Group</p>
              <div className="h-12 border-b border-black mb-1 italic font-serif text-xl px-2 text-gray-400 font-light">E-Signature on File</div>
              <p className="text-xs">By: Authorized Representative</p>
              <p className="text-xs">Title: Property Manager</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={onClose}
            className="bg-black text-white px-12 py-3 rounded font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
