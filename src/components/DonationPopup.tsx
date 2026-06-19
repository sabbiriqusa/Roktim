import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, X, Copy, Check, ShieldAlert, Award, DollarSign } from 'lucide-react';

export default function DonationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const bKashNumber = "01819235331";

  useEffect(() => {
    // Show on homepage mount, but check sessionStorage so it doesn't interrupt repeatedly
    const donationShown = sessionStorage.getItem('bb_donation_popup_shown_v2');
    if (!donationShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('bb_donation_popup_shown_v2', 'true');
      }, 1200); // Appear elegantly after 1.2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(bKashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark elegant backdrop-overlay with soft blur matching Apple aesthetics */}
      <div 
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-neutral-900/35 backdrop-blur-md animate-fade-in duration-300" 
      />

      {/* Floating Apple-Style Dialog Card with transparent glassmorphic white/rose glow gradient */}
      <div className="relative w-full max-w-lg bg-white/80 dark:bg-white/90 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-white/50 shadow-2xl shadow-rose-950/15 animate-in zoom-in-95 slide-in-from-bottom-10 duration-350 overflow-hidden text-left font-sans select-none">
        
        {/* Subtle decorative top pinkish/orange glow gradient */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-rose-500/10 via-red-500/5 to-transparent pointer-events-none" />
        
        {/* Apple close button circle inside header bar */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/[0.04] hover:bg-black/[0.08] flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
          title="বন্ধ করুন (Close)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Body Layout */}
        <div className="relative z-10 space-y-5 pt-2">
          
          {/* Top Apple Icon badge */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20 blood-drop-pulse">
              <Heart className="w-6 h-6 fill-white animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest bg-red-100/50 px-2.5 py-0.5 rounded-full">
                ডোনার অ্যাসিস্ট্যান্স ফান্ড / Fund Assistant
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-0.5 leading-none">
                রক্তিম ব্লাড ব্যাংক ডোনেশন পোর্টাল
              </h3>
            </div>
          </div>

          {/* Supportive messaging */}
          <div className="space-y-3.5 text-gray-650 leading-relaxed text-xs sm:text-sm">
            <p className="font-semibold text-gray-800">
              প্রিয় রক্তিম ভিজিটর ও শুভানুধ্যায়ী,
            </p>
            <p className="font-medium text-gray-650">
              রক্তিম ব্লাড ব্যাংক একটি সম্পূর্ণ অলাভজনক ও পরম পরোপকারী মানবিক সমাজসেবামূলক ডিজিটাল প্ল্যাটফর্ম। কোনো ফি ছাড়াই রোগীরা এখানে রক্তদাতাদের সরাসরি খোঁজ করতে পারেন।
            </p>
            <p className="font-medium text-gray-650">
              সার্ভার হোস্টিং মূল্য পরিশোধ, অটোমেটেড SMS গেটওয়ে সক্রিয় রাখা, স্বেচ্ছাসেবক টিমের লজিস্টিক বা ক্যাম্পেইন সহায়তা এবং রক্তদাতা ও গ্রহীতাদের সমন্বয়ে আমাদের সর্বোচ্চ নির্ভরযোগ্যতা ধরে রাখতে প্রতিমাসে নির্দিষ্ট অপারেশনাল খরচ রয়েছে। আপনজনদের জীবন রক্ষাকারী এই মহৎ পথচলা মসৃণ ও সফল রাখতে আপনার সামর্থ্য অনুযায়ী রক্তিম ফান্ডে স্বেচ্ছায় বিকাশে ডোনেট করে পাশে দাঁড়াতে পারেন।
            </p>
          </div>

          {/* bKash Apple-themed Interface panel */}
          <div className="bg-gradient-to-br from-[#e11470]/10 via-[#e11470]/5 to-transparent rounded-2xl p-4.5 border border-[#e11470]/20 space-y-3 relative overflow-hidden">
            
            {/* Soft pink bkash glow inside container */}
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#e11470]/5 rounded-full blur-xl pointer-events-none" />

            {/* bKash Header tag */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-6 w-14 bg-[#e11470] rounded-md flex items-center justify-center px-1">
                  {/* Styled minimal SVG Logo of bKash */}
                  <span className="text-[10px] font-bold text-white tracking-widest font-sans italic">bKash</span>
                </div>
                <span className="text-[11px] font-bold text-[#e11470] tracking-wide uppercase">
                  মোবাইল ব্যাংকিং (Donation Number)
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-white border border-[#e11470]/10 px-2 py-0.5 rounded-full select-none">
                বিকাশ পার্সোনাল
              </span>
            </div>

            {/* Main Interactive Payment Row */}
            <div className="flex items-center justify-between bg-white border border-[#e11470]/20 rounded-xl p-3.5 shadow-xs relative">
              <div>
                <p className="text-[10px] mobile-banking-label text-gray-400 font-sans leading-none">বিকাশ পার্সোনাল নম্বর (Personal No)</p>
                <p className="text-lg font-black font-english text-[#e11470] tracking-wider mt-1">{bKashNumber}</p>
              </div>

              {/* Copy action toggled cleanly */}
              <button
                type="button"
                onClick={handleCopy}
                className={`py-2 px-4 rounded-xl text-xs font-bold font-sans transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  copied 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-[#e11470] hover:bg-[#c20e5f] text-white shadow-lg shadow-[#e11470]/20'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    কপি হয়েছে!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    নম্বর কপি করুন
                  </>
                )}
              </button>
            </div>

            {/* Instruction list on sending money */}
            <div className="text-[10.5px] text-slate-500 space-y-1 pl-1 line-height-relaxed font-sans">
              <p className="font-semibold text-[#e11470]/90">📌 কীভাবে অনুদান পাঠাবেন:</p>
              <p>১. আপনার বিকাশ অ্যাপের হোমস্ক্রিন থেকে <span className="font-bold text-gray-700">"Send Money"</span> অপশনে যান।</p>
              <p>২. প্রাপক নম্বর হিসেবে উপরে উল্লেখিত নম্বরটি দিন: <span className="font-bold text-gray-700 font-english">01819235331</span></p>
              <p>৩. আপনার যথাসাধ্য অনুদানের পরিমাণ উল্লেখ করে বিকাশ পিন দিয়ে সফল করুন।</p>
            </div>

          </div>

          {/* Dialog Footnote controls */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              আপনার ক্ষুদ্রতম দানও রক্ষা করবে অমূল্য জীবন!
            </span>
            <button 
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-red-600 font-bold underline cursor-pointer hover:no-underline"
            >
              আমি পরে সহায়তা করবো
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
