
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TenantPortal from './components/TenantPortal';
import OwnerPortal from './components/OwnerPortal';
import ApplicationForm from './components/ApplicationForm';
import PortalLogin from './components/PortalLogin';
import Footer from './components/Footer';
import Assistant from './components/Assistant';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [isTenantAuth, setIsTenantAuth] = useState(false);
  const [isOwnerAuth, setIsOwnerAuth] = useState(false);
  const [authenticatedOwnerId, setAuthenticatedOwnerId] = useState<string | null>(null);

  const navigateToTenant = () => {
    if (isTenantAuth) {
      setCurrentView('TENANT_PORTAL');
    } else {
      setCurrentView('TENANT_LOGIN');
    }
  };

  const navigateToOwner = () => {
    if (isOwnerAuth) {
      setCurrentView('OWNER_PORTAL');
    } else {
      setCurrentView('OWNER_LOGIN');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <>
            <Hero onAction={() => setCurrentView('APPLICATION')} />
            
            <div className="bg-[#1B3022] py-20 px-6 border-y border-[#D4AF37]/10">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-serif text-[#D4AF37] mb-8">Elevated Property Management</h2>
                <p className="text-white text-lg max-w-3xl mx-auto leading-relaxed">
                  The Infinite Group provides premium property management solutions. 
                  From high-end residential complexes to commercial portfolios, we ensure 
                  seamless operations, maximal returns, and ultimate peace of mind.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-16">
                  {[
                    { title: "Smart Rent Collection", desc: "Automated, secure digital payments.", action: navigateToTenant },
                    { title: "Precision Reporting", desc: "Detailed analytics for property owners.", action: navigateToOwner },
                    { title: "Tenant Excellence", desc: "Premium screening and dedicated support.", action: navigateToTenant }
                  ].map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="bg-black/30 p-8 border border-[#D4AF37]/20 rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors group"
                      onClick={feature.action}
                    >
                      <h3 className="text-[#D4AF37] text-xl font-bold mb-4 group-hover:scale-105 transition-transform">{feature.title}</h3>
                      <p className="text-gray-300">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* About Section - Updated with Founder Portrait */}
            <div className="bg-black py-24 px-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1B3022]/5 skew-x-12 transform translate-x-32"></div>
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div className="relative">
                  <div className="aspect-[4/5] bg-[#1B3022] rounded-lg overflow-hidden border border-[#D4AF37]/20 shadow-2xl relative">
                    <img 
                      src="https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-full object-cover brightness-105 contrast-105" 
                      alt="Kanekalon Kindle - The Infinite Group Founder"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-[#D4AF37] p-8 rounded-lg shadow-xl hidden lg:block z-10">
                    <p className="text-black font-serif text-2xl font-bold italic">"Excellence is infinite."</p>
                  </div>
                </div>
                <div>
                  <h2 className="text-[#D4AF37] text-xs uppercase tracking-[0.4em] font-bold mb-4">Our Leadership</h2>
                  <h3 className="text-4xl font-serif text-white mb-8">Guided by Visionary Expertise</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">
                    Under the direction of Lead Manager <strong>Kanekalon Kindle</strong>, The Infinite Group has established itself as a premier authority in professional asset management. Our approach combines rigorous attention to detail with a commitment to long-term property value.
                  </p>
                  <p className="text-gray-500 mb-10">
                    We believe that property management is more than just maintenance; it is the stewardship of a legacy. Every unit we manage is treated with the same level of prestige and operational precision, ensuring that both owners and residents experience the infinite reliability we are known for.
                  </p>
                  <div className="flex items-center space-x-4 border-l-2 border-[#D4AF37] pl-6 py-2">
                    <div>
                      <p className="text-white font-serif text-xl">Kanekalon Kindle</p>
                      <p className="text-[#D4AF37] text-sm uppercase tracking-widest font-bold">Property Manager & Founder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'TENANT_LOGIN':
        return (
          <PortalLogin 
            type="Tenant" 
            onSuccess={() => {
              setIsTenantAuth(true);
              setCurrentView('TENANT_PORTAL');
            }} 
            onBack={() => setCurrentView('HOME')}
          />
        );
      case 'OWNER_LOGIN':
        return (
          <PortalLogin 
            type="Owner" 
            onSuccess={(ownerId) => {
              setIsOwnerAuth(true);
              setAuthenticatedOwnerId(ownerId || 'c1');
              setCurrentView('OWNER_PORTAL');
            }} 
            onBack={() => setCurrentView('HOME')}
          />
        );
      case 'TENANT_PORTAL':
        return isTenantAuth ? <TenantPortal /> : <PortalLogin type="Tenant" onSuccess={() => setIsTenantAuth(true)} onBack={() => setCurrentView('HOME')} />;
      case 'OWNER_PORTAL':
        return isOwnerAuth ? <OwnerPortal authId={authenticatedOwnerId} /> : <PortalLogin type="Owner" onSuccess={(oid) => { setIsOwnerAuth(true); setAuthenticatedOwnerId(oid || 'c1'); }} onBack={() => setCurrentView('HOME')} />;
      case 'APPLICATION':
        return <ApplicationForm onComplete={() => setCurrentView('HOME')} />;
      default:
        return <Hero onAction={() => setCurrentView('APPLICATION')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar setView={setCurrentView} activeView={currentView} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Assistant />
      <Footer setView={setCurrentView} />
    </div>
  );
};

export default App;
