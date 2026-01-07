
import React, { useState, useEffect } from 'react';
import { Lock, Crown, Key, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ProGateProps {
  children: React.ReactNode;
}

const ProGate: React.FC<ProGateProps> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const status = localStorage.getItem('pro_unlocked');
    if (status === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    if (licenseKey.trim().length >= 20) {
      localStorage.setItem('pro_unlocked', 'true');
      setIsUnlocked(true);
      setShowKeyInput(false);
      setError('');
    } else {
      setError('Invalid license key. Keys must be at least 20 characters.');
    }
  };

  const openCheckout = () => {
    window.open('https://tradecompoundpro.lemonsqueezy.com/checkout/buy/aa68e063-ab0c-40ba-b55f-c45619127fbe', '_blank');
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      {/* Blurred Content Container */}
      <div className="filter blur-[8px] pointer-events-none select-none opacity-40 transition-all duration-700">
        {children}
      </div>

      {/* Paywall Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-50/10 backdrop-blur-[2px] rounded-2xl">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-inner">
            <Crown className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">
            Sustainable Withdrawals are a Pro Feature
          </h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Unlock the Phase 2 Wealth Accretion Strategy to calculate exactly when your capital becomes self-sustaining. 
            Withdraw income while your principal continues to expand.
          </p>

          {!showKeyInput ? (
            <div className="space-y-3">
              <button
                onClick={openCheckout}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
              >
                Upgrade to Pro
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setShowKeyInput(true)}
                className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                Enter License Key
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="text-left">
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5 ml-1 tracking-widest">Paste your key here</label>
                <input
                  type="text"
                  placeholder="XXXX-XXXX-XXXX-XXXX-XXXX"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                />
                {error && <p className="text-rose-500 text-[10px] font-bold mt-2 ml-1">{error}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowKeyInput(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleUnlock}
                  className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Unlock Now
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            Secure Client-Side Activation
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProGate;
