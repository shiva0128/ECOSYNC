import React, { useState } from 'react';
import { MockDbProvider, useMockDb } from './context/MockDbContext';
import { LandingPage } from './views/LandingPage';
import { AuthPage } from './views/AuthPage';
import { AdminPanel } from './views/AdminPanel';
import { OrgDashboard } from './views/OrgDashboard';
import { VendorDashboard } from './views/VendorDashboard';
import { RecyclerDashboard } from './views/RecyclerDashboard';
import { 
  Leaf, 
  LogOut, 
  LogIn, 
  Shield, 
  LayoutDashboard, 
  Compass
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, logout, setCurrentUserByRole } = useMockDb();
  const [currentView, setCurrentView] = useState<string>('landing');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleLoginSuccess = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  const renderActiveView = () => {
    if (currentView === 'landing') {
      return <LandingPage onNavigate={handleNavigate} />;
    }
    if (currentView === 'auth') {
      return <AuthPage onLoginSuccess={handleLoginSuccess} />;
    }
    
    if (currentView === 'dashboard') {
      if (!currentUser) {
        return <AuthPage onLoginSuccess={handleLoginSuccess} />;
      }
      switch (currentUser.role) {
        case 'Admin':
          return <AdminPanel />;
        case 'Organization':
          return <OrgDashboard />;
        case 'Vendor':
          return <VendorDashboard />;
        case 'Recycler':
          return <RecyclerDashboard />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }

    return <LandingPage onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 flex flex-col font-sans transition-all duration-300">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200 px-4 md:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto md:grid md:grid-cols-3 flex justify-between items-center gap-4">
          {/* Navigation Links (Left) */}
          <nav className="hidden md:flex items-center gap-6 text-sm col-start-1 justify-self-start">
            <button 
              onClick={() => handleNavigate('landing')}
              className={`flex items-center gap-1.5 font-semibold transition ${
                currentView === 'landing' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass size={16} />
              Explorer
            </button>
            
            {currentUser && (
              <button 
                onClick={() => handleNavigate('dashboard')}
                className={`flex items-center gap-1.5 font-semibold transition ${
                  currentView === 'dashboard' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutDashboard size={16} />
                My Dashboard
              </button>
            )}
          </nav>

          {/* Logo Badge (Center) */}
          <div 
            onClick={() => handleNavigate('landing')} 
            className="flex flex-col items-center justify-center cursor-pointer group select-none col-start-2 justify-self-center py-1"
          >
            <div className="relative p-2.5 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-600 group-hover:bg-emerald-100 transition-all duration-300 shadow-sm flex items-center justify-center">
              {/* Spinning dashed ring on hover */}
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20 group-hover:rotate-45 transition-transform duration-700"></div>
              <Leaf size={20} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-center mt-1 flex flex-col items-center">
              <span className="text-sm font-black tracking-wider text-slate-900 uppercase leading-none">EcoSync</span>
              <span className="text-[8px] block text-emerald-600 font-bold uppercase tracking-widest mt-0.5">Circular SaaS</span>
            </div>
          </div>

          {/* User Section / Authentication (Right) */}
          <div className="flex items-center gap-4 text-xs col-start-3 justify-self-end">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-slate-800 font-bold block">{currentUser.name}</span>
                  <span className="text-slate-500 font-mono text-[10px] flex items-center justify-end gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${currentUser.isVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                    {currentUser.role} {currentUser.isVerified ? '(Verified)' : '(Pending)'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded border border-slate-200 hover:border-slate-350 transition flex items-center gap-1.5 font-bold"
                  title="Sign Out"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigate('auth')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded shadow-md hover:shadow-emerald-600/10 transition flex items-center gap-1.5 text-sm"
              >
                <LogIn size={15} />
                Platform Access
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8">
        {renderActiveView()}
      </main>

      {/* Persistent Circular Loop Sandbox Controller (Floating Dev Bar) */}
      <div className="sticky bottom-0 z-50 bg-white border-t border-slate-200 p-4 shadow-xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Shield size={14} className="text-emerald-600" />
              Circular Sandbox Control
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">Quick-Switch Roles:</span>
            <button
              onClick={() => { setCurrentUserByRole('Guest'); handleNavigate('landing'); }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded transition font-medium"
            >
              Guest Explorer
            </button>
            <button
              onClick={() => { setCurrentUserByRole('Admin'); handleNavigate('dashboard'); }}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded transition font-semibold"
            >
              Admin (Governor)
            </button>
            <button
              onClick={() => { setCurrentUserByRole('Organization'); handleNavigate('dashboard'); }}
              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded transition font-semibold"
            >
              Tata Corp (Org)
            </button>
            <button
              onClick={() => { setCurrentUserByRole('Vendor'); handleNavigate('dashboard'); }}
              className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded transition font-semibold"
            >
              GreenVolt (Vendor)
            </button>
            <button
              onClick={() => { setCurrentUserByRole('Recycler'); handleNavigate('dashboard'); }}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded transition font-semibold"
            >
              CleanCycle (Recycler)
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-xs">
        <p className="max-w-md mx-auto text-slate-400">
          EcoSync Capstone Prototype. Built in light theme with React, Tailwind CSS, Recharts, and Lucide React.
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <MockDbProvider>
      <AppContent />
    </MockDbProvider>
  );
}

export default App;
