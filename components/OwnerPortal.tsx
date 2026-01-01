
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { summarizeOwnerReport, generateTenantNotice, generateBackgroundReport } from '../services/geminiService';
import { ClientPortfolio, Applicant, Tenant, DamageReport, Photo, Lease, TenantChecklist } from '../types';
import { calculateLateFeeAmount } from '../utils/feeCalculations';
import AgreementModal from './AgreementModal';
import DamageGallery from './DamageGallery';
import AddTenantModal from './AddTenantModal';
import RenewLeaseModal from './RenewLeaseModal';
import MoveChecklistModal from './MoveChecklistModal';
import NoticeModal from './NoticeModal';

const initialApplicants: Applicant[] = [
  { id: 'a1', name: 'Jordan Smith', email: 'jordan@email.com', property: '1201 S. Hickory St', income: '$85,000', status: 'Pending' },
  { id: 'a2', name: 'Casey Rivera', email: 'casey.r@email.com', property: '502 S Missouri St', income: '$120,000', status: 'Pending' },
];

const staticPortfolios: ClientPortfolio[] = [
  {
    id: 'c1',
    name: 'Infinite REI, LLC',
    totalProperties: 8,
    tenants: [
      { id: 't1', name: 'Aaliyah Fox', unit: '1607 Vaughn St.', email: 'afox@email.com', phone: '(720) 555-0101', status: 'Active' },
      { id: 't2', name: 'Angela Jackson', unit: '1609 Vaughn St.', email: 'ajackson@email.com', phone: '(720) 555-0102', status: 'Active' },
      { id: 't3', name: 'Janine Maxwell', unit: '1604 W. 9th', email: 'jmaxwell@email.com', phone: '(720) 555-0103', status: 'Active' },
      { id: 't_v1', name: 'Vacant Unit', unit: '1201 S. Hickory St', email: '-', phone: '-', status: 'Inactive' },
      { id: 't_v2', name: 'Vacant Unit', unit: '502 S Missouri St.', email: '-', phone: '-', status: 'Inactive' },
      { id: 't_v3', name: 'Vacant Unit', unit: '4028 w 16th Ave', email: '-', phone: '-', status: 'Inactive' },
      { id: 't_v4', name: 'Vacant Unit', unit: '2015 W. 26th Ave', email: '-', phone: '-', status: 'Inactive' },
      { id: 't_v5', name: 'Vacant Unit', unit: '2017 W. 26th', email: '-', phone: '-', status: 'Inactive' },
    ],
    leases: [
      { id: 'l1', tenantId: 't1', tenantName: 'Aaliyah Fox', unit: '1607 Vaughn St.', startDate: '2024-01-01', endDate: '2025-01-01', monthlyRent: 900, documentUrl: '#' },
      { id: 'l2', tenantId: 't2', tenantName: 'Angela Jackson', unit: '1609 Vaughn St.', startDate: '2024-02-01', endDate: '2025-02-01', monthlyRent: 725, documentUrl: '#' },
      { id: 'l3', tenantId: 't3', tenantName: 'Janine Maxwell', unit: '1604 W. 9th', startDate: '2023-11-01', endDate: '2024-11-01', monthlyRent: 825, documentUrl: '#' },
    ]
  },
  {
    id: 'c2',
    name: 'Bridget Holmes-Merguez',
    totalProperties: 1,
    tenants: [
      { id: 't4', name: 'Vacant Unit', unit: '3607 Missouri St. Pine Bluff, Ar. 71601', email: '-', phone: '-', status: 'Inactive' },
    ],
    leases: []
  },
  {
    id: 'c3',
    name: 'LaTherese Ellis',
    totalProperties: 5,
    tenants: [
      { id: 't6', name: 'Adrienne Dirk', unit: '5 Pine Place', email: 'a.dirk@email.com', phone: '(555) 777-8888', status: 'Active' },
      { id: 't7', name: 'Vacant Unit', unit: '2006 W. 17th', email: '-', status: 'Inactive' },
      { id: 't9', name: 'Vacant Unit', unit: '2008 W. 17th', email: '-', status: 'Inactive' },
      { id: 't8', name: 'Vacant Unit', unit: '1215 W. 17th', email: '-', status: 'Inactive' },
      { id: 't10', name: 'Vacant Unit', unit: '1217 W. 17th', email: '-', status: 'Inactive' },
    ],
    leases: [
      { id: 'l4', tenantId: 't6', tenantName: 'Adrienne Dirk', unit: '5 Pine Place', startDate: '2024-01-01', endDate: '2025-01-01', monthlyRent: 850, documentUrl: '#' },
    ]
  }
];

const mockFinancials = [
  { month: 'Jan', revenue: 45000, expenses: 12000 },
  { month: 'Feb', revenue: 48000, expenses: 14000 },
  { month: 'Mar', revenue: 52000, expenses: 11000 },
  { month: 'Apr', revenue: 50000, expenses: 15000 },
  { month: 'May', revenue: 55000, expenses: 12500 },
];

interface OwnerPortalProps {
  authId?: string | null;
}

const OwnerPortal: React.FC<OwnerPortalProps> = ({ authId }) => {
  const leaseFileInputRef = useRef<HTMLInputElement>(null);
  const [activeLeaseId, setActiveLeaseId] = useState<string | null>(null);

  const loadPortfolios = (): ClientPortfolio[] => {
    const saved = localStorage.getItem('infinite_portfolios');
    return saved ? JSON.parse(saved) : staticPortfolios;
  };

  const loadDamageReports = (): Record<string, DamageReport> => {
    const saved = localStorage.getItem('infinite_damage_reports');
    return saved ? JSON.parse(saved) : {};
  };

  const loadChecklists = (): Record<string, TenantChecklist> => {
    const saved = localStorage.getItem('infinite_checklists');
    return saved ? JSON.parse(saved) : {};
  };

  const [allPortfolios, setAllPortfolios] = useState<ClientPortfolio[]>(loadPortfolios());
  const [selectedClientId, setSelectedClientId] = useState(authId || allPortfolios[0].id);
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'TENANTS' | 'LEASES' | 'APPLICANTS' | 'COMMUNICATIONS'>('ANALYTICS');
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [noticeDraft, setNoticeDraft] = useState('');
  const [generatingNotice, setGeneratingNotice] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [isRenewLeaseOpen, setIsRenewLeaseOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isNoticeGeneratorOpen, setIsNoticeGeneratorOpen] = useState(false);
  const [selectedTenantForNotice, setSelectedTenantForNotice] = useState<Tenant | null>(null);
  const [selectedTenantForChecklist, setSelectedTenantForChecklist] = useState<Tenant | null>(null);
  const [selectedLeaseForRenewal, setSelectedLeaseForRenewal] = useState<Lease | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  
  const CURRENT_SIM_DAY = 8;
  const [damageReports, setDamageReports] = useState<Record<string, DamageReport>>(loadDamageReports());
  const [tenantChecklists, setTenantChecklists] = useState<Record<string, TenantChecklist>>(loadChecklists());
  const [inspectingTenant, setInspectingTenant] = useState<Tenant | null>(null);

  const currentPortfolio = useMemo(() => {
    return allPortfolios.find(p => p.id === selectedClientId) || allPortfolios[0];
  }, [allPortfolios, selectedClientId]);

  // If logged in with a specific owner code (not GROUP/Master), limit selection
  const isMasterLogin = authId === 'c1' || !authId;
  const availablePortfolios = isMasterLogin ? allPortfolios : allPortfolios.filter(p => p.id === authId);

  useEffect(() => {
    localStorage.setItem('infinite_portfolios', JSON.stringify(allPortfolios));
  }, [allPortfolios]);

  useEffect(() => {
    localStorage.setItem('infinite_damage_reports', JSON.stringify(damageReports));
  }, [damageReports]);

  useEffect(() => {
    localStorage.setItem('infinite_checklists', JSON.stringify(tenantChecklists));
  }, [tenantChecklists]);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await summarizeOwnerReport({ 
        portfolioName: currentPortfolio.name, 
        data: mockFinancials,
        policyContext: "Rent due 1st, grace until 5th. $50 fee on 6th, $10/day incremental, capped at $300."
      });
      setSummary(res || 'Error generating summary.');
    } catch (e) {
      setSummary('Failed to load summary. Check API Key.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleRunBackgroundCheck = async (applicantId: string) => {
    const applicant = applicants.find(a => a.id === applicantId);
    if (!applicant) return;
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'Check Running' } : a));
    try {
      const report = await generateBackgroundReport(applicant.name, applicant.income);
      setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'Completed', report } : a));
    } catch (e) {
      alert('Error running background check.');
      setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: 'Pending' } : a));
    }
  };

  const handleGenerateNotice = async (type: string, customContext: string) => {
    if (!selectedTenantForNotice) return;
    setGeneratingNotice(true);
    setNoticeDraft('');
    const signature = localStorage.getItem('infinite_ai_signature') || undefined;
    
    const details = `Tenant: ${selectedTenantForNotice.name} (${selectedTenantForNotice.email} / ${selectedTenantForNotice.phone}) in Portfolio: ${currentPortfolio.name}. Unit: ${selectedTenantForNotice.unit}. Context: ${customContext}`;
    
    try {
      const res = await generateTenantNotice(type, details, signature);
      setNoticeDraft(res || 'Error drafting notice.');
    } catch (e) {
      setNoticeDraft('Failed to draft notice.');
    } finally {
      setGeneratingNotice(false);
    }
  };

  const openNoticeGenerator = (tenant: Tenant) => {
    setSelectedTenantForNotice(tenant);
    setIsNoticeGeneratorOpen(true);
  };

  const handleAddTenant = (tenantData: Omit<Tenant, 'id'>) => {
    const newTenant: Tenant = { ...tenantData, id: `t_${Date.now()}` };
    setAllPortfolios(prev => prev.map(p => p.id === selectedClientId ? { ...p, tenants: [...p.tenants, newTenant] } : p));
  };

  const toggleTenantStatus = (tenantId: string) => {
    setAllPortfolios(prev => prev.map(p => p.id === selectedClientId ? {
      ...p,
      tenants: p.tenants.map(t => t.id === tenantId ? { ...t, status: (t.status === 'Inactive' ? 'Active' : 'Inactive') as Tenant['status'] } : t)
    } : p));
  };

  const handleRenewLeaseAction = (lease: Lease) => {
    setSelectedLeaseForRenewal(lease);
    setIsRenewLeaseOpen(true);
  };

  const handleFinalizeRenewal = (updatedLease: Lease) => {
    setAllPortfolios(prev => prev.map(p => p.id === selectedClientId ? {
      ...p,
      leases: p.leases.map(l => l.id === updatedLease.id ? updatedLease : l)
    } : p));
    alert(`Lease renewed successfully for ${updatedLease.tenantName}. New rent: $${updatedLease.monthlyRent}.`);
  };

  const handleLeaseDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeLeaseId) return;

    // Simulate upload by creating a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setAllPortfolios(prev => prev.map(p => p.id === selectedClientId ? {
        ...p,
        leases: p.leases.map(l => l.id === activeLeaseId ? { ...l, documentUrl: url } : l)
      } : p));
      setActiveLeaseId(null);
      alert('Lease agreement associated and verified successfully.');
    };
    reader.readAsDataURL(file);
  };

  const triggerLeaseUpload = (leaseId: string) => {
    setActiveLeaseId(leaseId);
    leaseFileInputRef.current?.click();
  };

  const handleUploadPhotos = (tenantId: string, newPhotos: Photo[]) => {
    setDamageReports(prev => ({
      ...prev,
      [tenantId]: {
        tenantId,
        photos: [...(prev[tenantId]?.photos || []), ...newPhotos],
        lastUpdated: new Date().toLocaleString(),
      }
    }));
  };

  const handleSaveChecklist = (checklist: TenantChecklist) => {
    setTenantChecklists(prev => ({
      ...prev,
      [checklist.tenantId]: checklist,
    }));
  };

  const openChecklist = (tenant: Tenant) => {
    setSelectedTenantForChecklist(tenant);
    setIsChecklistOpen(true);
  };

  useEffect(() => {
    fetchSummary();
  }, [selectedClientId]);

  const displayedTenants = currentPortfolio.tenants.filter(t => showInactive ? true : t.status !== 'Inactive');

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 text-white">
      <AgreementModal isOpen={isAgreementOpen} onClose={() => setIsAgreementOpen(false)} />
      <AddTenantModal isOpen={isAddTenantOpen} onClose={() => setIsAddTenantOpen(false)} onAdd={handleAddTenant} />
      <RenewLeaseModal 
        isOpen={isRenewLeaseOpen} 
        onClose={() => setIsRenewLeaseOpen(false)} 
        lease={selectedLeaseForRenewal} 
        onRenew={handleFinalizeRenewal} 
      />
      <MoveChecklistModal 
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        tenant={selectedTenantForChecklist}
        onSave={handleSaveChecklist}
        existingChecklist={selectedTenantForChecklist ? tenantChecklists[selectedTenantForChecklist.id] : undefined}
      />
      <NoticeModal 
        isOpen={isNoticeGeneratorOpen}
        onClose={() => setIsNoticeGeneratorOpen(false)}
        tenant={selectedTenantForNotice}
        onGenerate={handleGenerateNotice}
      />
      
      {/* Hidden File Input for Lease Documents */}
      <input 
        type="file" 
        ref={leaseFileInputRef} 
        className="hidden" 
        onChange={handleLeaseDocumentUpload} 
        accept=".pdf,image/*"
      />

      {inspectingTenant && (
        <DamageGallery 
          tenant={inspectingTenant}
          photos={damageReports[inspectingTenant.id]?.photos || []}
          onUpload={(newPhotos) => handleUploadPhotos(inspectingTenant.id, newPhotos)}
          onDelete={(photoId) => {}}
          onClose={() => setInspectingTenant(null)}
        />
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-serif text-[#D4AF37] mb-2">Portfolio Management</h2>
          <p className="text-gray-400">Deep-dive into client assets managed by <strong>The Infinite Group</strong>.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsAgreementOpen(true)}
            className="bg-white/5 border border-white/20 hover:border-[#D4AF37] px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>View Management Agreement</span>
          </button>
          
          <div className="relative group">
            <select 
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              disabled={!isMasterLogin}
              className={`bg-[#1B3022] border border-[#D4AF37]/30 p-3 pr-10 rounded text-white outline-none focus:border-[#D4AF37] min-w-[240px] appearance-none cursor-pointer ${!isMasterLogin ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              {availablePortfolios.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {isMasterLogin && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex border-b border-white/10 mb-8 space-x-8 overflow-x-auto pb-1">
        {(['ANALYTICS', 'TENANTS', 'LEASES', 'APPLICANTS', 'COMMUNICATIONS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'ANALYTICS' && (
            <div className="bg-[#1B3022] p-8 border border-[#D4AF37]/30 rounded-lg">
              <h3 className="text-xl font-serif mb-8 text-white">Performance: {currentPortfolio.name}</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockFinancials}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c4c36" />
                    <XAxis dataKey="month" stroke="#D4AF37" />
                    <YAxis stroke="#D4AF37" />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #D4AF37' }} itemStyle={{ color: '#D4AF37' }} />
                    <Bar dataKey="revenue" fill="#D4AF37" name="Revenue" />
                    <Bar dataKey="expenses" fill="#4B5563" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'TENANTS' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#1B3022]/40 p-4 border border-white/5 rounded-lg mb-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer space-x-2">
                    <input 
                      type="checkbox" 
                      checked={showInactive} 
                      onChange={() => setShowInactive(!showInactive)} 
                      className="w-4 h-4 accent-[#D4AF37]"
                    />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Show Archived / Vacant</span>
                  </label>
                </div>
                <button 
                  onClick={() => setIsAddTenantOpen(true)}
                  className="bg-[#D4AF37] text-black px-6 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-[#B89630] transition-colors shadow-lg"
                >
                  + Add New Tenant
                </button>
              </div>

              <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#1B3022] text-[#D4AF37] text-xs uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Tenant / Contact</th>
                      <th className="px-6 py-4">Unit</th>
                      <th className="px-6 py-4 text-center">Late Fee (Day {CURRENT_SIM_DAY})</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {displayedTenants.map(tenant => {
                      const isDelinquent = tenant.status === 'Delinquent';
                      const currentLateFee = isDelinquent ? calculateLateFeeAmount(CURRENT_SIM_DAY) : 0;
                      const hasChecklist = !!tenantChecklists[tenant.id];
                      return (
                        <tr key={tenant.id} className={`hover:bg-white/5 transition-colors ${tenant.status === 'Inactive' ? 'opacity-50 grayscale' : ''}`}>
                          <td className="px-6 py-4 font-medium">
                            {tenant.name}
                            <div className="flex flex-col mt-1 space-y-0.5">
                              <span className="text-[10px] text-gray-400 font-mono tracking-tight">{tenant.email}</span>
                              {tenant.phone && <span className="text-[10px] text-[#D4AF37] font-mono tracking-tight">{tenant.phone}</span>}
                            </div>
                            <div className={`text-[10px] uppercase font-bold tracking-tighter mt-1.5 ${
                              tenant.status === 'Inactive' ? 'text-gray-600' :
                              tenant.status === 'Delinquent' ? 'text-red-400' : 'text-gray-500'
                            }`}>
                              {tenant.status === 'Inactive' ? 'Vacant' : tenant.status}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-400">{tenant.unit}</td>
                          <td className="px-6 py-4 text-center">
                            {isDelinquent ? (
                              <span className="text-[#D4AF37] font-bold font-mono">
                                +${currentLateFee.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-600">--</span>
                            )}
                          </td>
                          <td className="px-6 py-4 flex justify-end items-center space-x-4">
                            {tenant.status !== 'Inactive' && (
                              <button 
                                onClick={() => openChecklist(tenant)}
                                title="Inspection Checklist"
                                className={`p-1.5 rounded border transition-all ${
                                  hasChecklist ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]' : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                              </button>
                            )}

                            {tenant.status !== 'Inactive' && (
                              <button onClick={() => openNoticeGenerator(tenant)} className="text-[#D4AF37] hover:underline text-xs uppercase font-bold tracking-tighter transition-colors">Contact / Notice</button>
                            )}
                            <button 
                              onClick={() => toggleTenantStatus(tenant.id)} 
                              className={`${tenant.status === 'Inactive' ? 'text-green-500' : 'text-gray-500'} hover:underline text-xs uppercase font-bold tracking-tighter transition-colors`}
                            >
                              {tenant.status === 'Inactive' ? 'Assign Tenant' : 'Archive / Vacate'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'COMMUNICATIONS' && (
            <div className="space-y-6">
              <div className="bg-[#1B3022] p-6 border border-[#D4AF37]/30 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-serif text-[#D4AF37]">Infinite Smart Reminders</h3>
                  <p className="text-xs text-gray-400">AI-driven automated payment nudges and late notices via Email/SMS.</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-bold uppercase text-gray-500">{automationEnabled ? 'Automation Active' : 'Paused'}</span>
                  <button 
                    onClick={() => setAutomationEnabled(!automationEnabled)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${automationEnabled ? 'bg-[#D4AF37]' : 'bg-gray-800'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${automationEnabled ? 'right-1' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
                <div className="p-4 bg-white/5 border-b border-white/10 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                  Automated Messaging Log (Recent)
                </div>
                <div className="divide-y divide-white/5">
                  {[
                    { tenant: 'Aaliyah Fox', unit: '1607 Vaughn St.', msg: 'Polite rent reminder sent.', time: 'Today, 9:00 AM', status: 'Delivered (SMS)', contact: '555-0101' },
                    { tenant: 'Adrienne Dirk', unit: '5 Pine Place', msg: 'Polite rent reminder sent.', time: 'Today, 9:00 AM', status: 'Delivered (SMS)', contact: '777-8888' },
                    { tenant: 'Angela Jackson', unit: '1609 Vaughn St.', msg: 'Monthly statement delivered.', time: 'Yesterday, 8:00 AM', status: 'Read (Email)', contact: 'ajackson@email.com' },
                  ].map((log, i) => (
                    <div key={i} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-white">{log.tenant} <span className="text-gray-600 font-normal ml-2">({log.unit})</span></p>
                        <p className="text-xs text-gray-500 mt-1 font-mono">{log.contact}</p>
                        <p className="text-xs text-gray-400 mt-1 italic">"{log.msg}"</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-mono">{log.time}</p>
                        <p className={`text-[9px] font-bold uppercase mt-1 ${log.status.includes('Failed') ? 'text-red-400' : 'text-[#D4AF37]'}`}>{log.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LEASES' && (
            <div className="space-y-4">
              {currentPortfolio.leases.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-lg">
                  <p className="text-gray-500 italic">No active leases found for this portfolio.</p>
                </div>
              ) : (
                currentPortfolio.leases.map(lease => {
                  const hasDocument = lease.documentUrl && lease.documentUrl !== '#';
                  return (
                    <div key={lease.id} className="bg-[#111] p-6 border border-white/10 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-[#D4AF37] font-serif text-lg">{lease.tenantName}</h4>
                          {hasDocument && (
                            <div title="Lease Agreement Verified & Securely Associated" className="text-green-500 animate-in fade-in zoom-in duration-300">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{lease.unit} • Expires: {lease.endDate}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <p className="text-sm">Rent: <span className="text-white font-bold">${lease.monthlyRent.toLocaleString()}</span></p>
                          <p className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${hasDocument ? 'bg-[#1B3022] text-[#D4AF37]' : 'bg-red-900/20 text-red-400'}`}>
                            {hasDocument ? 'Associated Agreement Found' : 'Missing Documentation'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {hasDocument ? (
                          <a 
                            href={lease.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded text-xs font-bold uppercase tracking-tighter transition-colors flex items-center space-x-2 border border-white/10"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View Document</span>
                          </a>
                        ) : (
                          <button 
                            onClick={() => triggerLeaseUpload(lease.id)}
                            className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 px-4 py-2 rounded text-xs font-bold uppercase tracking-tighter transition-all flex items-center space-x-2"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Associate Agreement</span>
                          </button>
                        )}
                        
                        {hasDocument && (
                          <button 
                            onClick={() => triggerLeaseUpload(lease.id)}
                            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-tighter transition-colors"
                          >
                            Replace File
                          </button>
                        )}

                        <button 
                          onClick={() => handleRenewLeaseAction(lease)}
                          className="border border-[#D4AF37] text-[#D4AF37] px-4 py-2 rounded text-xs font-bold uppercase tracking-tighter transition-all hover:bg-[#D4AF37] hover:text-black"
                        >
                          Renew Lease
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === 'APPLICANTS' && (
            <div className="space-y-6">
              <div className="bg-black border border-white/10 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#1B3022] text-[#D4AF37] text-xs uppercase tracking-widest font-bold">
                    <tr>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Property</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {applicants.map(app => (
                      <tr key={app.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium">{app.name}</div>
                          <div className="text-xs text-gray-500">{app.income} / yr</div>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">{app.property}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                            app.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                            app.status === 'Check Running' ? 'bg-blue-500/10 text-blue-400 animate-pulse' : 'bg-gray-500/10 text-gray-400'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {app.status === 'Completed' ? (
                            <button 
                              onClick={() => setSelectedReport(app.report || null)}
                              className="bg-[#D4AF37] text-black px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-[#B89630]"
                            >
                              View Report
                            </button>
                          ) : (
                            <button 
                              disabled={app.status === 'Check Running'}
                              onClick={() => handleRunBackgroundCheck(app.id)}
                              className="border border-[#D4AF37] text-[#D4AF37] px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-[#D4AF37] hover:text-black transition-all disabled:opacity-50"
                            >
                              {app.status === 'Check Running' ? 'Processing...' : 'Run Credit/BG'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-black p-8 border border-[#D4AF37]/30 rounded-lg">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
              <h3 className="text-xl font-serif text-[#D4AF37]">AI Insight</h3>
            </div>
            {loadingSummary ? (
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-white/5 rounded animate-pulse w-full"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm">
                <p className="text-gray-300 leading-relaxed italic">"{summary}"</p>
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Policy Compliance</p>
                  <p className="text-xs text-gray-400 leading-relaxed">Automated late fee enforcement: 1st-5th grace period. $50 applied on Day 6. $10/day incremental accrual. Max fee cap $300.</p>
                </div>
              </div>
            )}
          </div>

          {(noticeDraft || generatingNotice) && (
            <div className="bg-[#111] p-6 border border-white/10 rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-serif mb-4 text-[#D4AF37]">Generated Notice</h3>
              <div className="bg-black border border-white/10 p-4 rounded h-64 overflow-y-auto text-xs text-gray-400 whitespace-pre-wrap mb-4 custom-scrollbar">
                {generatingNotice ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                    <p className="animate-pulse">Infinite AI is drafting your notice...</p>
                  </div>
                ) : (
                  noticeDraft
                )}
              </div>
              {!generatingNotice && (
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-colors">Copy Text</button>
                  <button onClick={() => setNoticeDraft('')} className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Dismiss</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerPortal;
