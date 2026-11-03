import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Bell, 
  WifiOff, 
  QrCode, 
  Share2, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AndroidIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Android Icon">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0002 0-.5515.4482-1.0001.9993-1.0001.5515 0 .9997.4486.9997 1.0001 0 .5516-.4482 1.0002-.9997 1.0002m-11.046 0c-.5514 0-.9993-.4486-.9993-1.0002 0-.5515.4479-1.0001.9993-1.0001.5515 0 .9996.4486.9996 1.0001 0 .5516-.4481 1.0002-.9996 1.0002m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1523-.5676.416.416 0 00-.5676.1523l-2.0223 3.503C15.5902 8.4111 13.8566 8.125 12 8.125c-1.8562 0-3.5898.2861-5.1326.8249L4.8451 5.4469a.416.416 0 00-.5676-.1523.416.416 0 00-.1523.5676l1.9973 3.4592C2.6889 11.1867.3333 15.1118.3333 19.6667h23.3334c0-4.5549-2.3556-8.48-5.7867-10.3453" />
  </svg>
);

export const GooglePlayIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 512 512" className={className} aria-label="Google Play Store Icon">
    <path fill="#4285F4" d="M38.5 28.5c-4.4 4.7-7 12-7 21v413c0 9 2.6 16.3 7 21l228.3-227.5L38.5 28.5z"/>
    <path fill="#FBBC04" d="M341.2 327.4l-74.4-74.4 74.4-74.4 84.1 48.1c24 13.7 24 36.1 0 49.8l-84.1 50.9z"/>
    <path fill="#EA4335" d="M38.5 483.5c7.8 8.2 20.6 9.2 34.6 1.3l268.1-157.4-74.4-74.4-228.3 230.5z"/>
    <path fill="#34A853" d="M38.5 28.5l228.3 227.5 74.4-74.4L73.1 24.2C59.1 16.3 46.3 17.3 38.5 28.5z"/>
  </svg>
);

export default function InstallMobileAppSection() {
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'qr'>('android');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 5000);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://roktim-bloodbank.org';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&color=dc2626`;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8" id="download-mobile-app">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-slate-900 to-red-950 text-white shadow-2xl border border-red-500/20">
        
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Badge Header */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md shadow-red-600/30 font-sans">
                  <Smartphone className="w-3.5 h-3.5" />
                  Install Mobile App
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-medium font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  অ্যান্ড্রয়েড রেডি • নিরাপদ ও ফ্রি
                </span>
                {isInstalled && (
                  <span className="inline-flex items-center gap-1 bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-medium font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    অ্যাপটি ইতোমধ্যে ইনস্টল আছে
                  </span>
                )}
              </div>

              {/* Headings */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight font-sans">
                  জরুরি প্রয়োজনে মুহূর্তেই রক্তদাতা খুঁজুন <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-amber-200">
                    রক্তিম অ্যান্ড্রয়েড অ্যাপ ইনস্টল করুন
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans max-w-xl">
                  তাহেরপুর ও বাগমারা অঞ্চলের সকল নিবন্ধিত রক্তদাতাদের সাথে ২৪/৭ যুক্ত থাকুন। কোনো গুগল ড্রাইভ বা আলাদা ভারী ফাইল ডাউনলোড ছাড়া ১ ক্লিকেই মোবাইলের হোমস্ক্রিনে অ্যাপ হিসেবে যুক্ত করুন।
                </p>
              </div>

              {/* Feature Points Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                  <div className="w-7 h-7 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center mb-1.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white font-sans">অতি হালকা</div>
                  <div className="text-[11px] text-gray-400 font-sans">মাত্র ২ মেগাবাইট</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                  <div className="w-7 h-7 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-1.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white font-sans">পুশ অ্যালার্ট</div>
                  <div className="text-[11px] text-gray-400 font-sans">রক্তের জরুরি নোটিফিকেশন</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                  <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-1.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white font-sans">১-ক্লিক ইনস্টল</div>
                  <div className="text-[11px] text-gray-400 font-sans">সরাসরি হোম স্ক্রিনে</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-xs">
                  <div className="w-7 h-7 bg-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center mb-1.5">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-white font-sans">অফলাইন সুবিধা</div>
                  <div className="text-[11px] text-gray-400 font-sans">নেট ছাড়াও নম্বর দেখুন</div>
                </div>
              </div>

              {/* Call-to-Action Buttons: Explicitly states "Download Android App" with Android / Google Play Icon */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                
                {/* PRIMARY ACTION: Download Android App */}
                <button
                  onClick={handleDownloadClick}
                  className="group relative flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-red-400/40"
                  aria-label="Download Android App"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:rotate-6 transition-transform">
                    <AndroidIcon className="w-5 h-5 fill-white" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-red-200 font-sans leading-tight">
                      Android Native PWA
                    </span>
                    <span className="font-sans font-black text-white text-base">
                      Download Android App
                    </span>
                  </div>
                  <Download className="w-5 h-5 ml-auto text-white group-hover:translate-y-0.5 transition-transform" />
                </button>

                {/* SECONDARY ACTION: Google Play Store Style / Quick Manual Install */}
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 text-white px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base border border-white/20 backdrop-blur-md hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <GooglePlayIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-wider text-gray-300 font-sans leading-tight">
                      Google Play / Manual
                    </span>
                    <span className="font-sans font-bold text-white text-sm">
                      ইনস্টলেশন নির্দেশনা ও কিউআর
                    </span>
                  </div>
                </button>
              </div>

              {/* Status Message */}
              {downloadSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>সফলভাবে ইনস্টলেশন শুরু হয়েছে! আপনার ফোনের হোমস্ক্রিনে রক্তিম অ্যাপ যুক্ত হচ্ছে।</span>
                </div>
              )}

              {/* Bottom Micro Copy */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-sans pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  ভার্সন ২.১ • বাগমারা ও তাহেরপুর স্পেশাল
                </span>
                <span>•</span>
                <span>অ্যান্ড্রয়েড ৫.০ বা তদূর্ধ্ব সব ফোনে সমর্থিত</span>
              </div>

            </div>

            {/* Right Mockup Area (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[320px]">
                
                {/* Outer Smartphone Frame */}
                <div className="relative mx-auto rounded-[38px] p-3 bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 shadow-2xl border-4 border-gray-600/50">
                  {/* Phone Speaker Notch */}
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-950 rounded-full z-20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gray-900 border border-gray-800 mr-2" />
                    <div className="w-8 h-1 rounded-full bg-gray-800" />
                  </div>

                  {/* Inner Screen */}
                  <div className="relative overflow-hidden rounded-[28px] bg-white text-gray-900 pt-7 pb-4 px-3.5 shadow-inner">
                    
                    {/* App Header Inside Phone */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                          <span className="text-xs font-black">র</span>
                        </div>
                        <div className="text-left">
                          <div className="text-[11px] font-black text-gray-900 font-sans leading-none">রক্তিম ব্লাড ব্যাংক</div>
                          <div className="text-[9px] text-red-600 font-sans font-medium">তাহেরপুর ও বাগমারা</div>
                        </div>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        লাইভ ২৪/৭
                      </span>
                    </div>

                    {/* Quick Mock Card inside phone */}
                    <div className="mt-3 p-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl text-white text-left space-y-1">
                      <div className="text-[10px] text-red-200 font-sans font-semibold">জরুরি রক্তের খোঁজ</div>
                      <div className="text-sm font-black font-sans">B+ পজিটিভ জরুরি প্রয়োজন</div>
                      <div className="text-[10px] text-red-100 font-sans">তাহেরপুর স্বাস্থ্য কমপ্লেক্স • ১ ক্লিকে যোগাযোগ</div>
                    </div>

                    {/* App Feature Highlights in Phone */}
                    <div className="mt-3 space-y-2 text-left">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl text-xs font-sans">
                        <span className="text-gray-700 font-medium text-[11px]">নিবন্ধিত রক্তদাতা সংখ্যা</span>
                        <span className="font-bold text-red-600">১,৪৫০+</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl text-xs font-sans">
                        <span className="text-gray-700 font-medium text-[11px]">জিপিএস নিকটবর্তী রেডার</span>
                        <span className="font-bold text-emerald-600 text-[11px]">সক্রিয়</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-xl text-xs font-sans">
                        <span className="text-gray-700 font-medium text-[11px]">ইনস্টল সাইজ</span>
                        <span className="font-bold text-gray-900 text-[11px]">১.৮ MB</span>
                      </div>
                    </div>

                    {/* Download Button in Mockup Phone */}
                    <button
                      onClick={handleDownloadClick}
                      className="mt-3.5 w-full bg-gray-900 hover:bg-black text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-md font-sans"
                    >
                      <AndroidIcon className="w-4 h-4 fill-emerald-400" />
                      <span>Download Android App</span>
                    </button>

                  </div>
                </div>

                {/* Floating Rating Badge */}
                <div className="absolute -bottom-3 -right-3 bg-white text-gray-900 px-3.5 py-2 rounded-2xl shadow-xl border border-gray-150 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                  <div className="text-left font-sans">
                    <div className="text-xs font-black text-gray-900">৪.৯ / ৫.০</div>
                    <div className="text-[10px] text-gray-500">ইউজার রেটিং</div>
                  </div>
                </div>

                {/* Floating Verified Badge */}
                <div className="absolute -top-3 -left-3 bg-gray-900 text-white px-3 py-1.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-300 font-sans">Play Protect Safe</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Manual Installation Guide & QR Code Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl text-gray-900 border border-gray-150 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-150">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AndroidIcon className="w-6 h-6 fill-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-sans">
                    মোবাইল অ্যাপ ইনস্টল ও ডাউনলোড
                  </h3>
                  <p className="text-xs text-gray-550 font-sans">
                    রক্তিম ব্লাড ব্যাংক তাহেরপুর ও বাগমারা
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs (Android Step-by-Step vs QR Code) */}
            <div className="flex border-b border-gray-150 mt-4">
              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'android'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <AndroidIcon className="w-4 h-4 fill-current" />
                <span>অ্যান্ড্রয়েড ইনস্টলেশন ধাপ</span>
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 font-sans flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'qr'
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>কিউআর কোড স্ক্যান (PC to Mobile)</span>
              </button>
            </div>

            {/* Tab 1: Android Step-by-Step Instructions */}
            {activeTab === 'android' && (
              <div className="py-4 space-y-3 font-sans text-xs">
                
                {isInstallable && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-left">
                    <p className="text-xs font-bold text-red-800 mb-2">
                      আপনার ব্রাউজারে ডিরেক্ট ইনস্টল সুবিধা পাওয়া গেছে!
                    </p>
                    <button
                      onClick={async () => {
                        await install();
                        setShowGuideModal(false);
                      }}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Android App এখনই নিশ্চিত করুন</span>
                    </button>
                  </div>
                )}

                <div className="space-y-2.5 text-left text-gray-700">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-7 h-7 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-xs">
                      ১
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">গুগল ক্রোম (Chrome) বা ব্রাউজার মেনু খুলুন</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        আপনার ফোনের ব্রাউজারের উপরে বা নিচে ডানপাশের ৩ ডট মেনু ( <span className="font-bold">⋮</span> ) বাটনে ট্যাপ করুন।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-7 h-7 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-xs">
                      ২
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">'Install App' অথবা 'Add to Home screen' চাপুন</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        মেনু থেকে <strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> (হোম স্ক্রিনে যুক্ত করুন) অপশনটি নির্বাচন করুন।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-xs">
                      ৩
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">ইনস্টল নিশ্চিত করুন</p>
                      <p className="text-gray-500 text-[11px] mt-0.5">
                        পপ-আপে <strong>"Install"</strong> বাটনে ক্লিক করলেই মুহূর্তেই রক্তিম অ্যাপ আপনার ফোনের অ্যাপ ড্রয়ারে ও হোমস্ক্রিনে চলে আসবে।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 text-amber-900 text-[11px] text-left leading-relaxed">
                  💡 <strong>টিপস:</strong> এই অ্যাপটি গুগল সার্টিফাইড প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA), ফলে এটি প্লে-স্টোরের মতোই অফলাইনে কাজ করে এবং কোনো অতিরিক্ত মেমোরি খরচ করে না।
                </div>
              </div>
            )}

            {/* Tab 2: QR Code Scan for Mobile */}
            {activeTab === 'qr' && (
              <div className="py-5 text-center space-y-3 font-sans">
                <p className="text-xs text-gray-600">
                  আপনার অ্যান্ড্রয়েড ফোনের ক্যামেরা বা কিউআর কোড স্ক্যানার দিয়ে স্ক্যান করে সরাসরি অ্যাপ পেজে আসুন:
                </p>
                <div className="inline-block p-3 bg-white rounded-2xl border-2 border-red-500/30 shadow-md">
                  <img 
                    src={qrUrl} 
                    alt="Scan QR code to install Roktim App" 
                    className="w-44 h-44 mx-auto rounded-lg"
                    loading="lazy"
                  />
                </div>
                <p className="text-[11px] text-gray-550">
                  ক্যামেরা দিয়ে স্ক্যান করলে সরাসরি ব্রাউজারে লিংক ওপেন হবে এবং ১ ক্লিকে <strong>Download Android App</strong> করতে পারবেন।
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-2 pt-3 border-t border-gray-150 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs font-sans transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
