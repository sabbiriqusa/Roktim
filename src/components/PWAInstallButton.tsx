import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { AndroidIcon, GooglePlayIcon } from './InstallMobileAppSection';

interface PWAInstallButtonProps {
  variant?: 'button' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Variant: Banner (e.g. for Home hero or mobile sticky banner)
  if (variant === 'banner') {
    if (bannerDismissed) return null;
    return (
      <div className="w-full bg-gradient-to-r from-gray-950 via-red-950 to-gray-950 text-white p-3.5 sm:p-4 rounded-3xl shadow-xl border border-red-500/30 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-red-600/30">
            <AndroidIcon className="w-7 h-7 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                Android App
              </span>
              <span className="text-[11px] text-emerald-400 font-sans font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> নিরাপদ ও ফ্রি
              </span>
            </div>
            <h4 className="font-sans font-black text-sm sm:text-base text-white mt-0.5">
              Install Mobile App • রক্তিম অ্যান্ড্রয়েড অ্যাপ
            </h4>
            <p className="font-sans text-xs text-gray-300">
              জরুরি রক্তের প্রয়োজনে দ্রুত নোটিফিকেশন ও অফলাইন নম্বরের জন্য ফোনে যুক্ত করুন।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {isInstallable && (
            <button
              onClick={install}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/30 cursor-pointer font-sans"
            >
              <AndroidIcon className="w-4 h-4 fill-white" />
              <span>Download Android App</span>
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-red-700 hover:bg-red-50 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer font-sans"
            >
              <Smartphone className="w-4 h-4" />
              <span>iPhone এ ইন্সটল</span>
            </button>
          )}

          {!isInstallable && !isIOS && (
            <button
              onClick={() => setShowAndroidGuide(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-red-600/30 cursor-pointer font-sans"
            >
              <AndroidIcon className="w-4 h-4 fill-white" />
              <span>Download Android App</span>
            </button>
          )}

          <button
            onClick={() => {
              const el = document.getElementById('download-mobile-app');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setShowAndroidGuide(true);
              }
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold font-sans transition cursor-pointer"
            title="বিস্তারিত দেখুন"
          >
            <span>বিস্তারিত</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setBannerDismissed(true)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Android Installation Modal */}
        {showAndroidGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-gray-900 border border-gray-100 animate-in zoom-in-95 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                    <AndroidIcon className="w-5 h-5 fill-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-sans">Download Android App</h3>
                    <p className="text-[10px] text-gray-500 font-sans">রক্তিম মোবাইল অ্যাপ্লিকেশন</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 font-sans leading-relaxed">
                <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                  <span className="w-5 h-5 rounded-md bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-[11px]">১</span>
                  <p>ক্রোম ব্রাউজারের উপরে ডানপাশের ৩ ডট মেনু ( <span className="font-bold">⋮</span> ) চাপুন।</p>
                </div>
                <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                  <span className="w-5 h-5 rounded-md bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-[11px]">২</span>
                  <p><strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> বাটনে ক্লিক করুন।</p>
                </div>
                <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                  <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">৩</span>
                  <p><strong>"Install"</strong> নিশ্চিত করলে রক্তিম অ্যাপ আপনার ফোনের স্ক্রিনে যুক্ত হবে।</p>
                </div>
              </div>

              <button
                onClick={() => setShowAndroidGuide(false)}
                className="mt-4 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-md font-sans"
              >
                বুঝেছি, বন্ধ করুন
              </button>
            </div>
          </div>
        )}

        {/* iOS installation modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-gray-900 border border-gray-100 animate-in zoom-in-95">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-3 mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 text-center font-sans">
                iPhone / iPad-এ অ্যাপ ইন্সটল করুন
              </h3>
              <div className="mt-4 space-y-3 text-xs text-gray-600 font-sans leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <p>১. সাফারি ব্রাউজারের নিচের <strong>শেয়ার (Share)</strong> আইকনে চাপ দিন।</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <p>২. নিচে স্ক্রল করে <strong>'Add to Home Screen'</strong> নির্বাচন করুন।</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                  <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p>৩. উপরে ডানপাশের <strong>'Add'</strong> বাটনে ট্যাপ করলেই হোমস্ক্রিনে যুক্ত হবে।</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-md"
              >
                বুঝেছি, বন্ধ করুন
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Variant: Compact button (for Navbar or Header)
  return (
    <>
      <button
        onClick={async () => {
          if (isInstallable) {
            await install();
          } else if (isIOS) {
            setShowIOSGuide(true);
          } else {
            setShowAndroidGuide(true);
          }
        }}
        className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-red-500/20 hover:shadow-red-500/30 transition-all cursor-pointer font-sans"
        aria-label="Download Android App"
      >
        <AndroidIcon className="w-3.5 h-3.5 fill-white" />
        <span className="hidden sm:inline">Android App</span>
        <span className="sm:hidden">অ্যাপ</span>
      </button>

      {/* Android Guide Modal for compact button */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-gray-900 border border-gray-100 animate-in zoom-in-95 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center">
                  <AndroidIcon className="w-5 h-5 fill-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-sans">Download Android App</h3>
                  <p className="text-[10px] text-gray-500 font-sans">রক্তিম মোবাইল অ্যাপ্লিকেশন</p>
                </div>
              </div>
              <button
                onClick={() => setShowAndroidGuide(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-gray-600 font-sans leading-relaxed">
              <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 rounded-md bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-[11px]">১</span>
                <p>ক্রোম ব্রাউজারের উপরে ডানপাশের ৩ ডট মেনু ( <span className="font-bold">⋮</span> ) চাপুন।</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 rounded-md bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0 text-[11px]">২</span>
                <p><strong>"Install app"</strong> বা <strong>"Add to Home screen"</strong> বাটনে ক্লিক করুন।</p>
              </div>
              <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded-xl">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[11px]">৩</span>
                <p><strong>"Install"</strong> নিশ্চিত করলে রক্তিম অ্যাপ আপনার ফোনের স্ক্রিনে যুক্ত হবে।</p>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidGuide(false)}
              className="mt-4 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-md font-sans"
            >
              বুঝেছি, বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-gray-900 border border-gray-100 animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-3 mx-auto">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center font-sans">
              iPhone / iPad-এ অ্যাপ ইন্সটল করুন
            </h3>
            <div className="mt-4 space-y-3 text-xs text-gray-600 font-sans leading-relaxed">
              <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Share2 className="w-3.5 h-3.5" />
                </div>
                <p>১. সাফারি ব্রাউজারের নিচের <strong>শেয়ার (Share)</strong> আইকনে চাপ দিন।</p>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <PlusSquare className="w-3.5 h-3.5" />
                </div>
                <p>২. নিচে স্ক্রল করে <strong>'Add to Home Screen'</strong> নির্বাচন করুন।</p>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <p>৩. উপরে ডানপাশের <strong>'Add'</strong> বাটনে ট্যাপ করলেই হোমস্ক্রিনে যুক্ত হবে।</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-md"
            >
              বুঝেছি, বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </>
  );
};
