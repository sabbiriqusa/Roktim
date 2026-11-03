import React, { useState } from 'react';
import { Home, Users, Heart, Award, Grid, X, ChevronRight, Sparkles, BookOpen, Share2, Compass, Flame, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PWAInstallButton } from './PWAInstallButton';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: any;
  onOpenAuth: () => void;
}

export default function BottomNavigation({ 
  currentPage, 
  onNavigate, 
  currentUser, 
  onOpenAuth 
}: BottomNavigationProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const primaryItems = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'timeline', label: 'টাইমলাইন', icon: Flame },
    { id: 'location', label: 'রাডার', icon: Compass },
    { id: 'requests', label: 'আবেদন', icon: Heart },
    { id: 'more', label: 'মেনু', icon: Grid },
    { id: 'register', label: 'প্রোফাইল', icon: Award }
  ];

  const handleNavClick = (id: string) => {
    if (id === 'more') {
      setSheetOpen(true);
    } else if (id === 'register' && !currentUser) {
      onOpenAuth();
    } else {
      onNavigate(id);
    }
  };

  const handleSheetOptionClick = (pageId: string) => {
    setSheetOpen(false);
    onNavigate(pageId);
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'রক্তিম ব্লাড ব্যাংক তাহেরপুর',
        text: 'জরুরি রক্তের প্রয়োজনে তাহেরপুর ও বাগমারা অঞ্চলের সেরা লাইভ রক্তদাতা প্ল্যাটফর্ম।',
        url: window.location.origin
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('ওয়েবসাইট লিংকটি কপি করা হয়েছে! বন্ধুদের সাথে শেয়ার করুন।');
    }
    setSheetOpen(false);
  };

  return (
    <>
      <div 
        id="android-bottom-navigation"
        className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-lg border-t border-red-100/60 shadow-[0_-8px_32px_rgba(239,68,68,0.08)] py-1 pb-safe"
      >
        <div className="flex items-center justify-around px-1">
          {primaryItems.map((item) => {
            const IconComponent = item.icon;
            
            // Check active state
            const isActive = item.id === 'more' 
              ? (currentPage === 'team' || currentPage === 'about' || currentPage === 'donors')
              : currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex flex-col items-center justify-center py-1 px-1.5 min-w-[50px] cursor-pointer transition-all duration-200 relative select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active pill background */}
                <div 
                  className={`flex items-center justify-center rounded-2xl h-7 w-11 transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-50 text-red-600 scale-105 shadow-xs' 
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <IconComponent className={`w-4.5 h-4.5 transition-transform duration-200 ${isActive ? 'scale-110 fill-red-100/30' : ''}`} />
                </div>
                
                {/* Active Text label */}
                <span 
                  className={`font-sans text-[9px] mt-0.5 transition-all duration-200 ${
                    isActive 
                      ? 'text-red-600 font-black scale-105' 
                      : 'text-stone-500 font-bold'
                  }`}
                >
                  {item.label}
                </span>

                {/* Counter indicator for Timeline or Requests */}
                {item.id === 'timeline' && (
                  <span className="absolute top-1 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide-Up Android Material Bottom Sheet Modal */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 bg-stone-900/60 z-50 lg:hidden backdrop-blur-xs"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 inset-x-0 bg-white rounded-t-[28px] z-50 lg:hidden border-t border-red-100/50 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] overflow-hidden pb-8 px-5 pt-3.5 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Android notch bar */}
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-1 cursor-pointer" onClick={() => setSheetOpen(false)} />

              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="text-left">
                  <span className="font-sans text-[10px] font-black tracking-widest text-red-600 uppercase">রক্তিম মোবাইল নেভিগেশন</span>
                  <h4 className="font-sans text-base font-black text-gray-900 leading-none mt-1">সকল ফিচার ও পৃষ্ঠা</h4>
                </div>
                <button 
                  onClick={() => setSheetOpen(false)}
                  className="p-1.5 bg-stone-100 rounded-xl text-stone-500 active:scale-95 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* PWA Mobile App Download Prompt */}
              <div className="p-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl text-white text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-white" /> রক্তিম অ্যাপ ইনস্টল করুন
                  </span>
                  <PWAInstallButton variant="compact" />
                </div>
                <p className="text-[11px] text-red-100 leading-tight">
                  ফোনে সরাসরি ইন্সটল করে অফলাইন মোড ও তাত্ক্ষণিক ব্লাড নোটিফিকেশন পান।
                </p>
              </div>

              {/* Grid of shortcuts */}
              <div className="space-y-2.5">
                
                {/* 1. Donors List */}
                <button
                  onClick={() => handleSheetOptionClick('donors')}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-sans text-xs font-black text-gray-900 leading-none">রক্তদাতা তালিকা</h5>
                      <p className="font-sans text-[10px] text-stone-500 font-semibold mt-1">রক্তের গ্রুপ অনুযায়ী রক্তদাতা অনুসন্ধান</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                {/* 2. Real-time Location Tracking */}
                <button
                  onClick={() => handleSheetOptionClick('location')}
                  className="w-full flex items-center justify-between p-3.5 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-sans text-xs font-black text-emerald-900 leading-none">রিয়েল-টাইম লোকেশন রাডার</h5>
                      <p className="font-sans text-[10px] text-stone-500 font-semibold mt-1">জিপিএস ভিত্তিক নিকটবর্তী ডোনার ম্যাপ</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                {/* 3. Team link */}
                <button
                  onClick={() => handleSheetOptionClick('team')}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white">
                      <Sparkles className="w-4 h-4 fill-white/20" />
                    </div>
                    <div>
                      <h5 className="font-sans text-xs font-black text-gray-900 leading-none">রক্তিম টিম</h5>
                      <p className="font-sans text-[10px] text-stone-500 font-semibold mt-1">আমাদের সমন্বয়ক ও স্বেচ্ছাসেবী প্যানেল</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                {/* 4. About Link */}
                <button
                  onClick={() => handleSheetOptionClick('about')}
                  className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-sans text-xs font-black text-gray-900 leading-none">আমাদের সম্পর্কে</h5>
                      <p className="font-sans text-[10px] text-stone-500 font-semibold mt-1">আমাদের ইতিবৃত্ত ও লক্ষ্য</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

                {/* 5. Share link */}
                <button
                  onClick={handleShareApp}
                  className="w-full flex items-center justify-between p-3.5 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-sans text-xs font-black text-emerald-800 leading-none">অ্যাপ লিংক শেয়ার করুন</h5>
                      <p className="font-sans text-[10px] text-stone-500 font-semibold mt-1">ফেসবুক বা হোয়াটসঅ্যাপে অন্যকে জানান</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
