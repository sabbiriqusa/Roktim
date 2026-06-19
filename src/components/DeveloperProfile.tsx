import React from 'react';
import { Mail, MapPin, Code2, Cpu, Wrench, X, MessageSquare, Terminal } from 'lucide-react';

interface DeveloperProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeveloperProfile({ isOpen, onClose }: DeveloperProfileProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-250">
      
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="max-w-xl sm:max-w-2xl w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden group z-10 animate-in zoom-in-95 duration-200">
        
        {/* Glow corner decorations */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-rose-600/5 rounded-full blur-3xl pointer-events-none -ml-12 -mb-12" />

        {/* Top Header & close button */}
        <div className="flex items-center justify-between border-b border-slate-800/50 px-6 py-4">
          <div className="flex items-center gap-2 text-red-500">
            <Terminal className="w-4 h-4" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-400">ডেভলপার তথ্য প্রোফাইল</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-800 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* User info head */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            
            <div className="relative shrink-0">
              {/* Halos */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-slate-800 bg-slate-950 flex items-center justify-center relative overflow-hidden z-10 select-none">
                <span className="text-white font-sans text-2xl sm:text-3xl font-extrabold tracking-tight">SIS</span>
              </div>
              <div className="absolute bottom-0.5 right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center text-white z-20 shadow-lg">
                <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                  <path d="M9 16.17l-4.17-4.17-1.42 1.41 5.59 5.59 12-12-1.41-1.41z" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-sans text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                সাকিবুল ইসলাম সাব্বির
              </h4>
              <p className="font-english text-xs text-red-400 font-bold tracking-wider uppercase leading-none">
                Sakibul Islam Sabbir
              </p>
              <div className="pt-2 text-[11px] text-gray-400 font-sans flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>তাহেরপুর বাগমারা, রাজশাহী</span>
              </div>
            </div>

          </div>

          {/* Description section */}
          <div className="space-y-2 border-t border-slate-800/60 pt-5 text-left">
            <span className="font-sans text-xs text-red-500 font-bold uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <Cpu className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              সিস্টেম ডেভেলপার ও মেইনটেইনার
            </span>
            <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
              আসসালামু আলাইকুম, আমি <strong>সাকিবুল ইসলাম সাকিব</strong>। রক্তিম ডিজিটাল রক্তদাতা প্ল্যাটফর্মের প্রধান কারিগরি ডেভলপার ও কোর সিস্টেম অ্যাডমিনিস্ট্রেটর হিসেবে কর্মরত। আমি এই ক্লাউড ওয়েব অ্যাপলিকেশনটির রিয়েল-টাইম ফায়ারস্টোর সিংক্রোনাইজেশন ম্যাপিং, সিকিউরিটি প্যারামিটার এবং সুন্দর সম্পূর্ণ মোবাইল-বান্ধব ইন্টারফেসটি সুচারুভাবে ডেভেলপ করেছি।
            </p>
          </div>

          {/* Credentials list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800/60 pt-5 text-left leading-normal">
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-950/40 flex items-center justify-center text-red-450 border border-red-900/35 shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-sans text-xs font-bold text-gray-100">ডেভেলপমেন্ট ও রক্ষণাবেক্ষণ</h5>
                <p className="font-sans text-[10px] text-gray-400 mt-1 leading-normal">রক্তদাতা তালিকা আপডেট করা, ডাটাবেজ ব্যাকআপ ও সিকিউরিটি প্যাচ নিয়মিত নিরীক্ষণ করা হয়।</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-rose-400 border border-slate-700/50 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-sans text-xs font-bold text-gray-100">প্রযুক্তিগত সহায়তা যোগাযোগ</h5>
                <a href="mailto:sabbir.iqusa@gmail.com" className="font-sans text-[11px] text-red-400 hover:underline mt-1 block">
                  sabbir.iqusa@gmail.com
                </a>
                <span className="text-[9px] text-gray-500 font-english block mt-0.5 leading-none">Send a message for direct site support</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer info lock style */}
        <div className="bg-slate-950 border-t border-slate-800/60 px-6 py-4 text-center text-xs text-gray-500 font-sans flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Code2 className="w-3.5 h-3.5 text-gray-400" />
            <span>সিস্টেম সংস্করণ: ২.৬ (২০২৬)</span>
          </div>
          <div>রক্তিম ব্লাড ফাউন্ডেশন</div>
        </div>

      </div>

    </div>
  );
}
