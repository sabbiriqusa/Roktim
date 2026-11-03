import React, { useEffect, useState } from 'react';
import { Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  isAuthenticated: boolean;
}

export default function SplashScreen({ onComplete, isAuthenticated }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2600; // 2.6 seconds smooth splash

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(currentProgress);

      if (elapsed >= duration) {
        clearInterval(timer);
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-red-950 via-stone-950 to-red-900 text-white select-none px-6 py-10 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient glowing radial orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-rose-600/20 rounded-full blur-[90px] pointer-events-none" />

      {/* Top subtle badge */}
      <div className="relative z-10 pt-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-200 text-xs font-sans font-semibold tracking-wide shadow-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>তাহেরপুর ও বাগমারা ডিজিটাল ব্লাড নেটওয়ার্ক</span>
        </div>
      </div>

      {/* Center Hero: Official Logo + App Name + Blood Donation Slogan */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full animate-in zoom-in-95 duration-700 space-y-6">
        
        {/* Official 3D Glossy App Icon */}
        <div className="relative group cursor-pointer" onClick={handleSkip}>
          {/* Pulsing glow ring */}
          <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 rounded-[44px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse" />
          
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-[36px] bg-gradient-to-br from-red-600 to-red-900 p-1.5 shadow-2xl border-2 border-white/30 backdrop-blur-md overflow-hidden transform transition-transform group-hover:scale-105 active:scale-95">
            <img 
              src="/assets/aistudio/file_00000000015c821194aa85f9e857dff1_7ccd5a14.png" 
              alt="রক্তিম ব্লাড ব্যাংক তাহেরপুর অফিসিয়াল লোগো"
              className="w-full h-full object-cover rounded-[30px] drop-shadow-md"
            />
          </div>

          <div className="absolute -bottom-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg border border-white/40 animate-bounce">
            <Heart className="w-4 h-4 fill-white" />
          </div>
        </div>

        {/* App Title */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-[0.25em] text-red-300 font-sans font-bold">
            স্বেচ্ছাসেবী রক্তদাতা প্ল্যাটফর্ম
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            রক্তিম রক্তদান সমিতি
          </h1>
          <p className="font-sans text-sm text-red-200/90 font-medium">
            Raktim Blood Bank — Taherpur & Bagmara
          </p>
        </div>

        {/* Blood Donation Slogan */}
        <div className="relative p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl max-w-sm w-full mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-rose-300 text-[11px] font-sans font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>আমাদের মূল স্লোগান</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </div>
          <p className="font-sans text-base sm:text-lg font-bold text-white leading-relaxed">
            "এক ফোঁটা রক্ত, একটি জীবন — রক্তদানে বাঁচাই জীবন"
          </p>
          <p className="font-sans text-xs text-rose-100/70 mt-1 italic">
            Donate Blood, Save Lives — Be a Hero
          </p>
        </div>

      </div>

      {/* Bottom: Progress Bar & Skip CTA */}
      <div className="relative z-10 w-full max-w-xs flex flex-col items-center space-y-4 pb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Loading Progress Bar */}
        <div className="w-full space-y-1.5 text-center">
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-xs">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 transition-all duration-100 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-red-200/80 font-sans">
            <span>
              {isAuthenticated ? 'সরাসরি হোমে প্রবেশ করা হচ্ছে...' : 'নিরাপদ গেটওয়ে লোড হচ্ছে...'}
            </span>
            <span className="font-mono font-bold">{progress}%</span>
          </div>
        </div>

        {/* Enter Now CTA */}
        <button
          onClick={handleSkip}
          className="w-full flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 active:scale-98 text-white font-sans text-xs font-bold py-2.5 px-4 rounded-xl border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-md"
        >
          <span>{isAuthenticated ? 'হোমপেজে প্রবেশ করুন' : 'সাইন-ইন ও নিবন্ধন করুন'}</span>
          <ArrowRight className="w-4 h-4 text-red-300" />
        </button>

        <div className="text-[10px] text-gray-400 font-sans">
          কপিরাইট © ২০২৬ রক্তিম রক্তদান সমিতি তাহেরপুর
        </div>
      </div>
    </div>
  );
}
