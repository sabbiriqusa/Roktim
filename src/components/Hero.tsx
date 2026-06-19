import React, { useEffect, useState } from 'react';
import { Heart, Search, PlusCircle, Users, Activity, CheckCircle, MapPin } from 'lucide-react';
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
    <div className="w-full max-w-6xl mx-auto py-12 px-4 text-center space-y-12 relative z-10">
      
      {/* Intro Text header */}
      <div className="space-y-4">
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
        
        <p className="font-sans text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          একটি জীবন রক্ষাকারী স্বেচ্ছাসেবী সংঘ। আমাদের মাধ্যমে আপনি দ্রুত রক্তের সন্ধান করতে পারবেন, রক্তের রিকোয়েস্ট পোস্ট করতে পারবেন এবং স্বেচ্ছায় একজন নিবন্ধিত রক্তদাতা হিসেবে মানবতার সেবায় যুক্ত হতে পারেন।
        </p>
      </div>

      {/* Primary CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
        <button
          onClick={() => onNavigate('donors')}
          className="w-full flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-base py-4 px-6 rounded-2xl shadow-xl shadow-red-500/20 hover:shadow-red-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Search className="w-5 h-5" />
          রক্তদাতা খুঁজুন
        </button>

        <button
          onClick={() => onNavigate('requests')}
          className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-800 font-sans font-bold text-base py-4 px-6 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-red-600" />
          রক্তের আবেদন করুন
        </button>
      </div>

      {/* Bento Grid Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
        
        {/* Stat 1 */}
        <div className="glass-card p-6 rounded-3xl border border-white/60 text-center flex flex-col justify-between h-40">
          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2 mx-auto shadow-inner">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-gray-900 font-english">
              <AnimatedCounter value={stats.totalDonors} />+
            </div>
            <div className="text-sm font-medium text-gray-500 font-sans mt-1">
              নিবন্ধিত রক্তদাতা (Donors)
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card p-6 rounded-3xl border border-white/60 text-center flex flex-col justify-between h-40">
          <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-2 mx-auto shadow-inner">
            <Activity className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-red-600 font-english">
              <AnimatedCounter value={stats.activeRequests} />
            </div>
            <div className="text-sm font-medium text-gray-500 font-sans mt-1">
              জরুরি রক্তের রিকোয়েস্ট (Active)
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card p-6 rounded-3xl border border-white/60 text-center flex flex-col justify-between h-40">
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2 mx-auto shadow-inner">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-emerald-600 font-english">
              <AnimatedCounter value={stats.fulfilledRequests + 18} />
            </div>
            <div className="text-sm font-medium text-gray-500 font-sans mt-1">
              সফল রক্তদান সমন্বয় (Fulfilled)
            </div>
          </div>
        </div>

      </div>

      {/* Quick notice indicator */}
      {!userLoggedIn && (
        <p className="font-sans text-xs text-gray-400 mt-2">
          💡 এখনো একাউন্ট খুলেননি?{' '}
          <button onClick={onOpenAuth} className="text-red-600 hover:underline font-bold">
            এখানে লগ-ইন করুন
          </button>{' '}
          এবং আপনার রক্তের গ্রুপ প্রদান করে একজন গর্বিত রক্তদাতা হোন!
        </p>
      )}

    </div>
  );
}
