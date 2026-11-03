import React, { useEffect, useState } from 'react';
import { Heart, Search, PlusCircle, Users, Activity, CheckCircle, MapPin, Compass, Flame, UserPlus } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { defaultDonors, defaultRequests } from '../utils/defaultData';
import AnimatedCounter from './AnimatedCounter';

interface HeroProps {
  onNavigate: (page: string) => void;
  onOpenAuth: () => void;
  userLoggedIn: boolean;
}

export default function Hero({ onNavigate, onOpenAuth, userLoggedIn }: HeroProps) {
  const [stats, setStats] = useState({
    totalDonors: defaultDonors.length,
    activeRequests: defaultRequests.filter(r => r.status === 'pending').length,
    fulfilledRequests: defaultRequests.filter(r => r.status === 'fulfilled').length,
  });

  useEffect(() => {
    // Sync statistics live from firestore collections!
    const unsubDonors = onSnapshot(collection(db, 'donors'), (snapshot) => {
      let donorCount = 0;
      snapshot.forEach(() => {
        donorCount++;
      });
      setStats(prev => ({
        ...prev,
        totalDonors: donorCount > 0 ? donorCount : defaultDonors.length
      }));
    }, (error) => {
      console.warn("Firestore count failed, using offline default stats. Error:", error);
    });

    const unsubRequests = onSnapshot(collection(db, 'requests'), (snapshot) => {
      let pending = 0;
      let fulfilled = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === 'pending') {
          pending++;
        } else if (data.status === 'fulfilled') {
          fulfilled++;
        }
      });
      
      setStats(prev => ({
        ...prev,
        activeRequests: pending > 0 ? pending : defaultRequests.filter(r => r.status === 'pending').length,
        fulfilledRequests: fulfilled > 0 ? fulfilled : defaultRequests.filter(r => r.status === 'fulfilled').length
      }));
    }, (error) => {
      console.warn("Firestore requests count failed.", error);
    });

    return () => {
      unsubDonors();
      unsubRequests();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 text-center space-y-10 relative z-10">
      
      {/* Intro Text header with official logo badge */}
      <div className="space-y-4">
        
        {/* Official App Logo Emblem */}
        <div className="flex justify-center">
          <div className="relative group cursor-pointer" onClick={() => onNavigate('about')}>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden shadow-2xl shadow-red-500/25 border-2 border-red-500/30 bg-gradient-to-br from-red-600 to-rose-700 p-1 group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/assets/aistudio/file_00000000015c821194aa85f9e857dff1_7ccd5a14.png" 
                alt="রক্তিম ব্লাড ব্যাংক তাহেরপুর" 
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 font-sans text-xs font-semibold px-4 py-1.5 rounded-full border border-red-200/50 shadow-inner">
          <MapPin className="w-3.5 h-3.5" />
          <span>তাহেরপুর পৌর এলাকার ডিজিটাল ব্লাড নেটওয়ার্ক</span>
        </div>
        
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
          রক্তিম ব্লাড ব্যাংক <br className="sm:hidden" />
          <span className="text-red-600 font-extrabold relative">
            তাহেরপুর
            <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-red-100 rounded-full -z-10" />
          </span>
        </h1>

        {/* Blood donation slogan */}
        <div className="inline-block px-4 py-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-full font-sans text-xs sm:text-sm font-bold shadow-md shadow-red-500/20">
          "এক ফোঁটা রক্ত, একটি জীবন — রক্তদানে বাঁচাই জীবন"
        </div>
        
        <p className="font-sans text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          একটি জীবন রক্ষাকারী ডিজিটাল প্ল্যাটফর্ম। রক্তের সন্ধান করুন, লাইভ লোকেশন রাডারে নিকটবর্তী দাতা খুঁজুন এবং স্বয়ংক্রিয় নোটিফিকেশনের মাধ্যমে রক্ত রিকোয়েস্ট সম্প্রচার করুন।
        </p>
      </div>

      {/* Primary CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
        <button
          onClick={() => onNavigate('timeline')}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl shadow-red-500/20 hover:shadow-red-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Flame className="w-5 h-5 fill-white text-white" />
          লাইভ রিকোয়েস্ট টাইমলাইন
        </button>

        <button
          onClick={() => onNavigate('location')}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Compass className="w-5 h-5" />
          রিয়েল-টাইম ডোনার রাডার
        </button>

        <button
          onClick={() => onNavigate('register')}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-800 font-sans font-bold text-sm sm:text-base py-3.5 px-5 rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <UserPlus className="w-5 h-5 text-red-600" />
          রক্তদাতা নিবন্ধন
        </button>
      </div>

      {/* Bento Grid Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-2">
        
        {/* Stat 1 */}
        <div className="glass-card p-6 rounded-3xl border border-white/60 text-center flex flex-col justify-between h-36">
          <div className="w-9 h-9 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-1 mx-auto shadow-inner">
            <Users className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900 font-english">
              <AnimatedCounter value={stats.totalDonors} />+
            </div>
            <div className="text-xs font-semibold text-gray-500 font-sans mt-0.5">
              নিবন্ধিত রক্তদাতা (Donors)
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card p-6 rounded-3xl border border-white/60 text-center flex flex-col justify-between h-36">
          <div className="w-9 h-9 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-1 mx-auto shadow-inner">
            <Activity className="w-4.5 h-4.5 text-red-500 animate-pulse" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-red-600 font-english">
              <AnimatedCounter value={stats.activeRequests} />
            </div>
            <div className="text-xs font-semibold text-gray-500 font-sans mt-0.5">
              জরুরি রক্তের রিকোয়েস্ট (Active)
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card p-6 rounded-3xl border border-white/60 text-center flex flex-col justify-between h-36">
          <div className="w-9 h-9 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-1 mx-auto shadow-inner">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-emerald-600 font-english">
              <AnimatedCounter value={stats.fulfilledRequests + 18} />
            </div>
            <div className="text-xs font-semibold text-gray-500 font-sans mt-0.5">
              সফল রক্তদান সমন্বয় (Fulfilled)
            </div>
          </div>
        </div>

      </div>

      {/* Quick notice indicator */}
      {!userLoggedIn && (
        <p className="font-sans text-xs text-gray-400">
          💡 এখনো একাউন্ট খুলেননি?{' '}
          <button onClick={onOpenAuth} className="text-red-600 hover:underline font-bold cursor-pointer">
            এখানে গুগল বা ফোন নাম্বার দিয়ে যাচাই করুন
          </button>{' '}
          এবং ক্লাউডে সংরক্ষিত রক্তদাতা কার্ড তৈরি করুন!
        </p>
      )}

    </div>
  );
}
