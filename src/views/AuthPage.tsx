import React, { useState } from 'react';
import { useMockDb } from '../context/MockDbContext';
import type { UserRole } from '../context/MockDbContext';
import { Shield, UserPlus, LogIn, CheckCircle } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const { login, signup, users } = useMockDb();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('Organization');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail) {
      setLoginError('Please enter your email.');
      return;
    }
    const success = login(loginEmail);
    if (success) {
      onLoginSuccess();
    } else {
      setLoginError('User not found. Try one of the demo accounts below or sign up.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!signupName || !signupEmail) {
      setLoginError('Please fill out all fields.');
      return;
    }
    
    const exists = users.find(u => u.email.toLowerCase() === signupEmail.toLowerCase());
    if (exists) {
      setLoginError('Email already registered.');
      return;
    }

    signup(signupName, signupEmail, signupRole);
    setSignupSuccess(true);
    setTimeout(() => {
      setSignupSuccess(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleQuickLogin = (email: string) => {
    login(email);
    onLoginSuccess();
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setActiveTab('login'); setLoginError(''); }}
          className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'login' 
              ? 'text-emerald-600 bg-slate-50 border-b-2 border-emerald-500' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <LogIn size={16} />
          Sign In
        </button>
        <button
          onClick={() => { setActiveTab('signup'); setLoginError(''); }}
          className={`flex-1 py-4 text-center font-bold text-sm transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'signup' 
              ? 'text-emerald-600 bg-slate-50 border-b-2 border-emerald-500' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
          }`}
        >
          <UserPlus size={16} />
          Register Account
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {signupSuccess ? (
          <div className="py-8 text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Registration Complete</h3>
            <p className="text-slate-500 text-sm">
              Your account has been created. Approvals for Organizations, Vendors, and Recyclers require Admin verification.
            </p>
          </div>
        ) : (
          <>
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-750 rounded-lg text-xs font-semibold">
                {loginError}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. tata@ecosync.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:shadow-emerald-600/10 transition duration-200 text-sm"
                >
                  Access Platform
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name / Entity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Steel Inc"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. contact@tatasteel.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Platform Role</label>
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as UserRole)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-250 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-500 text-sm"
                  >
                    <option value="Organization">Organization (Procures Hardware)</option>
                    <option value="Vendor">Vendor (Supplies Efficiency Hardware)</option>
                    <option value="Recycler">Recycler (E-Waste circular loop processor)</option>
                    <option value="Admin">Admin (Platform Governor)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:shadow-emerald-600/10 transition duration-200 text-sm"
                >
                  Create B2B Account
                </button>
              </form>
            )}

            {/* Quick Demo Login Accounts */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Shield size={12} className="text-emerald-600" />
                Quick Mock Sandbox Login
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u.email)}
                    className="px-3 py-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 rounded-lg transition text-slate-600 hover:text-slate-900 flex flex-col justify-between"
                  >
                    <span className="font-bold text-slate-800 truncate">{u.name}</span>
                    <span className="text-[10px] text-slate-500 truncate flex items-center justify-between w-full mt-0.5 font-mono">
                      <span>{u.role}</span>
                      <span className={u.isVerified ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                        {u.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
