import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'button' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'button' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Variant: Banner (e.g. for Home hero or mobile sticky banner)
  if (variant === 'banner') {
    if (bannerDismissed) return null;
    return (
      <div className="w-full bg-gradient-to-r from-red-650 via-red-600 to-rose-700 text-white p-3.5 sm:p-4 rounded-2xl shadow-lg border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-xs">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h4 className="font-sans font-bold text-sm text-white flex items-center gap-1.5">
              <span>রক্তিম মোবাইল অ্যাপ ইন্সটল করুন</span>
              <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full uppercase tracking-wider font-english">PWA App</span>
            </h4>
            <p className="font-sans text-xs text-red-100">
              অ্যাপ ডাউনলোড ছাড়াই হোমস্ক্রিনে যুক্ত করুন। দ্রুত নোটিফিকেশন ও অফলাইন সুবিধা পান।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {isInstallable && (
            <button
              onClick={install}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              ইন্সটল করুন
            </button>
          )}

          {isIOS && (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              iPhone এ ইন্সটল
            </button>
          )}

          {!isInstallable && !isIOS && (
            <button
              onClick={() => {
                alert("ব্রাউজারের ৩ ডট মেনু ( ⋮ ) থেকে 'Install App' বা 'Add to Home screen' চাপুন।");
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/90 text-red-800 hover:bg-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              হোম স্ক্রিনে যুক্ত করুন
            </button>
          )}

          <button
            onClick={() => setBannerDismissed(true)}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
      {isInstallable && (
        <button
          onClick={install}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all cursor-pointer font-sans"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ইন্সটল অ্যাপ</span>
        </button>
      )}

      {isIOS && (
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer font-sans"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-600" />
          <span>iOS অ্যাপ</span>
        </button>
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
