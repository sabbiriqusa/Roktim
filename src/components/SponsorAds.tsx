import React, { useState, useEffect } from 'react';
import { ShieldCheck, Heart, ExternalLink, Volume2, VolumeX, Sparkles, X, Gift, PhoneCall, Award, Play } from 'lucide-react';

export default function SponsorAds() {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [showPopupAd, setShowPopupAd] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);

  // Rotate banner advertisements every 6 seconds
  const banners = [
    {
      id: 1,
      titleBn: "রয়্যাল স্পেশাল হেলথ চেকআপ প্যাকেজ",
      titleEn: "Royal Comprehensive Lipid Profile Packages",
      descBn: "রক্তিম রক্তদাতাদের জন্য রয়্যাল আল্ট্রাসাউন্ড এন্ড হাসপাতালে সব ধরণের প্যাথলজি টেস্টে ১৫% বিশেষ ছাড়!",
      descEn: "Get 15% exclusive discount on all clinical reports for verified Roktim blood donors.",
      badge: "স্পন্সরড অফার",
      bgGradient: "from-blue-600 to-indigo-800",
      phone: "+৮৮০ ১৭৫৩-১১২২৩৪"
    },
    {
      id: 2,
      titleBn: "ফোর স্টার কার্ডিয়াক কেয়ার ক্যাম্পেইন",
      titleEn: "Four Star Cardiac Diagnostics & Safety",
      descBn: "বিনামূল্যে ডায়াবেটিস ও রক্তচাপ পরীক্ষা! চৌকিপাড়া শাখায় অভিজ্ঞ কার্ডিওলজিস্ট দ্বারা চিকিৎসা সেবা নিন।",
      descEn: "Free diabetes and BP monitoring checkups. Expert cardiologists visiting this week.",
      badge: "জরুরী ক্যাম্পেইন",
      bgGradient: "from-emerald-600 to-teal-800",
      phone: "+৮৮০ ১৭৬৫-৪৪৫৫৬৬"
    },
    {
      id: 3,
      titleBn: "স্পন্দন প্যাথলজি ও রক্তের প্লাজমা সেশন",
      titleEn: "Spandan Diagnostics Platform & Blood Testing",
      descBn: "বিভাগীয় সেরা ল্যাব টেকনোলজি দ্বারা নিখুঁত রিপোর্ট নিশ্চিত করুন। রক্তদাতাদের জন্য কোনো রি-টেস্ট ফি লাগবে না।",
      descEn: "Precise reports assured by state-of-the-art laboratory machinery. Zero re-test fees for active donors.",
      badge: "ল্যাব পার্টনার",
      bgGradient: "from-purple-600 to-rose-800",
      phone: "+৮৮০ ১৭২৭-৮৮৯৯০০"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Show a sponsored popup-ad 4 seconds after landing on the page (but only once per session)
  useEffect(() => {
    const popShown = sessionStorage.getItem('bb_sponsor_popup_shown');
    if (!popShown) {
      const timer = setTimeout(() => {
        setShowPopupAd(true);
        sessionStorage.setItem('bb_sponsor_popup_shown', 'true');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12 border-t border-red-100/50">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <span className="font-sans text-xs font-bold text-red-600 tracking-widest uppercase bg-rose-50 border border-rose-200/50 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
          আমাদের স্পন্সর ও পার্টনার বিজ্ঞাপন (Sponsor Ads)
        </span>
        <h3 className="font-sans text-xl sm:text-2xl font-black text-gray-900 leading-tight">
          সহযোগী চিকিৎসাকেন্দ্র ও হাসপাতাল সমূহের স্বাস্থ্য বুলেটিন
        </h3>
        <p className="font-sans text-xs text-gray-500 max-w-xl mx-auto leading-normal">
          রক্তিম ব্লাড ব্যাংকের রোগীদের উন্নত চিকিৎসাসেবা ও বিনামূল্যে রক্ত পরীক্ষার সুযোগ নিয়ে পার্টনার হাসপাতালগুলোর বিশেষ ছাড় ও বিজ্ঞাপনসমূহ নিচে দেওয়া হলো।
        </p>
      </div>

      {/* Grid Layout containing Banner Ad and Video Ad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        
        {/* Left Column: Interactive Banner Ads (Rotating Gradient Banners) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex flex-col h-full bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800 justify-between min-h-[340px]">
            
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br opacity-90 transition-all duration-1000 bg-linear-to-br">
              <div className={`absolute inset-0 bg-gradient-to-br ${banners[activeBanner].bgGradient} mix-blend-multiply opacity-80`} />
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-red-500/10 rounded-full blur-2xl" />
            </div>

            {/* Banner Top elements */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/15">
                📌 {banners[activeBanner].badge}
              </span>
              <div className="flex gap-1">
                {banners.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveBanner(idx)}
                    className={`w-4 h-1.5 rounded-full transition-all cursor-pointer ${activeBanner === idx ? 'bg-amber-400 w-6' : 'bg-white/30'}`}
                  />
                ))}
              </div>
            </div>

            {/* Banner Middle Text Content */}
            <div className="relative z-10 space-y-3.5 my-6">
              <h4 className="font-sans text-xl sm:text-2xl font-extrabold leading-tight text-amber-300 drop-shadow-sm">
                {banners[activeBanner].titleBn}
              </h4>
              <p className="font-english text-[11px] font-semibold text-slate-300 tracking-wide">
                {banners[activeBanner].titleEn}
              </p>
              <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed max-w-lg font-medium">
                {banners[activeBanner].descBn}
              </p>
              <p className="font-english text-[11px] text-white/70">
                {banners[activeBanner].descEn}
              </p>
            </div>

            {/* Banner Bottom Action items */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-[9px] text-white/60">ডায়াল করুন / Hotline:</p>
                  <p className="text-sm font-bold font-english text-amber-300">{banners[activeBanner].phone}</p>
                </div>
              </div>

              <a
                href={`tel:${banners[activeBanner].phone}`}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/10 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                হটলাইন যোগাযোগ
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

        {/* Right Column: Educational/Partner Video Ads */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="flex flex-col bg-white rounded-3xl p-6 border border-gray-150 shadow-md justify-between h-full relative overflow-hidden min-h-[340px]">
            <div>
              <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-widest">
                Partner Broadcasting
              </span>
              <h4 className="font-sans text-base sm:text-lg font-black text-gray-900 mt-2.5 leading-snug" id="sponsor-vid-title">
                Sponsor Advertisement Video
              </h4>
              <p className="font-sans text-xs text-gray-400 mt-1">
                রক্তদান সচেতনতা ও পার্টনার হাসপাতাল সংক্রান্ত বিশেষ ভিডিও বুলেটিনটি অটো-প্লে হচ্ছে।
              </p>
            </div>

            {/* Real Autoplay YouTube Embed configured cleanly */}
            <div className="w-full aspect-video rounded-2xl bg-black my-4 relative overflow-hidden shadow-inner border border-gray-100" id="sponsor-youtube-container">
              <iframe
                src="https://www.youtube-nocookie.com/embed/_d2fGohfSXM?autoplay=1&mute=1&loop=1&playlist=_d2fGohfSXM&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1"
                title="Sponsor Advertisement Video"
                className="absolute inset-0 w-full h-full border-0 rounded-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            </div>

            {/* Safety tag footer details */}
            <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-gray-100 pt-3">
              <span className="font-sans flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                রক্তিম ভেরিফাইড ব্রডকাস্ট
              </span>
              <span className="font-english">DOCK: LIVE FEED</span>
            </div>

          </div>
        </div>

      </div>

      {/* Interactive pop-up ad for Special Clinic Promo Coupon */}
      {showPopupAd && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full font-sans text-sm text-left animate-in px-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            {/* Glossy overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-xl pointer-events-none" />
            
            <button 
              onClick={() => setShowPopupAd(false)}
              className="absolute top-3.5 right-3.5 p-1 bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex gap-3 mt-1 relative z-10">
              <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-950 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div className="space-y-1 pr-4">
                <span className="text-[9px] bg-indigo-500 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                  সীমিত সময়ের অফার
                </span>
                <h5 className="font-extrabold text-amber-300 text-sm leading-tight pt-1">
                  বিনামূল্যে ব্লাড গ্রুপ টেস্ট ভাউচার!
                </h5>
                <p className="text-xs text-slate-300 leading-snug">
                  স্পন্দন ডায়াগনস্টিক সেন্টারে স্ক্রিনিং করতে প্রোমো কোডটি দেখান।
                </p>
                <div className="bg-white/10 rounded-lg p-1.5 px-3 border border-white/5 font-mono text-center text-xs text-amber-200 mt-2 select-all font-bold">
                  ROKTIM2026_FREE
                </div>
                <p className="text-[9px] text-slate-400 italic pt-1">
                  *যেকোনো রক্তদাতা কার্ড দেখিয়ে সরাসরি ক্যাশ কাউন্টারে ডিসকাউন্ট নিন।
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
