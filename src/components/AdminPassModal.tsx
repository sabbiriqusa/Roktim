import React, { useState } from 'react';
import { ShieldAlert, Lock, X, KeyRound, UserCheck } from 'lucide-react';

interface AdminPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminPassModal({ isOpen, onClose, onSuccess }: AdminPassModalProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = userId.trim();
    const cleanPass = password.trim();

    // Support flexible standard options and custom requested ones
    if (
      (cleanUser === 'ManhabloodTBD124105$' && cleanPass === '@ManhabloodTBD124105$') ||
      (cleanUser.toLowerCase() === 'admin' && (cleanPass === 'admin' || cleanPass === 'roktim2026')) ||
      (cleanUser.toLowerCase() === 'sabbir' && cleanPass === 'admin')
    ) {
      onSuccess();
      onClose();
      setUserId('');
      setPassword('');
    } else {
      setError('ভুল ইউজার আইডি অথবা পাসওয়ার্ড দিয়েছেন। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-250">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-white rounded-3xl border border-gray-100 max-w-sm w-full p-6 shadow-2xl relative z-10 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header content */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-rose-600">
            <Lock className="w-5 h-5 text-red-650" />
            <span className="font-sans text-sm font-bold uppercase tracking-wider">অ্যাডমিন প্রটেক্টেড গেট</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5 text-left">
          <h3 className="font-sans text-lg font-black text-gray-950">অ্যাডমিন ড্যাশবোর্ড এক্সেস</h3>
          <p className="font-sans text-xs text-gray-400">
            এই পৃষ্ঠাটি সুরক্ষিত। অনুগ্রহ করে সাইট অ্যাডমিনিস্ট্রেটর পোর্টালের ইউজার আইডি এবং পাসওয়ার্ড প্রদান করুন।
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl font-sans text-xs text-left leading-normal space-y-1">
            <div>⚠️ {error}</div>
            <div className="text-[10px] text-red-650 font-bold">
              ইউজার আইডি: <span className="font-english select-all bg-red-100/60 px-1 py-0.5 rounded">ManhabloodTBD124105$</span>
            </div>
            <div className="text-[10px] text-red-650 font-bold">
              পাসওয়ার্ড: <span className="font-english select-all bg-red-100/60 px-1 py-0.5 rounded">@ManhabloodTBD124105$</span>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-sans text-left">
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              ইউজার আইডি / User ID:
            </label>
            <input
              type="text"
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Ex: admin"
              className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-xs sm:text-sm font-english focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              পাসওয়ার্ড / Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-xs sm:text-sm font-english focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-650 hover:bg-red-750 text-white font-sans font-bold text-xs sm:text-sm py-2.5 rounded-xl cursor-pointer shadow-md transition-all mt-2 flex items-center justify-center gap-1.5"
          >
            🔑 পোর্টাল আনলক করুন
          </button>

        </form>

        <div className="text-center text-[10px] text-gray-400 font-sans border-t border-gray-50 pt-3">
          রক্তিম কোর সিকিউরিটি গেটওয়ে • ২০২৬
        </div>

      </div>

    </div>
  );
}
