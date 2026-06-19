import React from 'react';
import { Heart, Mail, Phone, MapPin, ExternalLink, ShieldCheck, HelpCircle } from 'lucide-react';
import { NoticeBn } from '../utils/defaultData';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenDevProfile: () => void;
}

export default function Footer({ onNavigate, onOpenDevProfile }: FooterProps) {
  return (
    <footer className="w-full bg-gradient-to-b from-transparent to-red-50/70 border-t border-red-100/50 pt-16 pb-8 px-4 mt-20 relative z-15">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-12 border-b border-red-200/40">
        
        {/* Brand & Vision */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white blood-drop-pulse">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="font-sans text-xl md:text-2xl font-black tracking-tight text-gray-900">
              রক্তিম <span className="text-red-600">ব্লাড ব্যাংক</span>
            </span>
          </div>
          <p className="font-sans text-sm text-gray-500 leading-relaxed">
            তাহেরপুর পৌর এলাকার প্রথম আধুনিক ডিজিটাল স্বেচ্ছাসেবী রক্তদাতা প্ল্যাটফর্ম। আমাদের মূল লক্ষ্য সঠিক সময়ে রক্তের যোগান নিশ্চিত করা ও মূল্যবান প্রাণের সুরক্ষা করা।
          </p>
          <span className="font-sans text-xs text-red-700/80 font-medium bg-red-50 border border-red-200/50 px-3 py-1 rounded-full inline-block">
            📍 তাহেরপুর বাগমারা রাজশাহী, বাংলাদেশ
          </span>
        </div>

        {/* Quick actions / pages navigation */}
        <div className="space-y-4">
          <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-gray-800">
            রক্ত সহায়তার লিংকসমূহ
          </h4>
          <ul className="space-y-2.5">
            <li>
              <button
                onClick={() => onNavigate('donors')}
                className="font-sans text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-2"
              >
                🔍 রক্তদাতার তালিকা খুঁজুন (Donor Roster)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('requests')}
                className="font-sans text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-2"
              >
                🩸 রক্তের রিকোয়েস্ট সমূহ (Blood Requests)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('register')}
                className="font-sans text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-2"
              >
                ✍️ স্বেচ্ছাসেবী রক্তদাতা হোন (Register)
              </button>
            </li>
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="font-sans text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                👥 ফেসবুক ভলান্টিয়ার গ্রুপ <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>
        </div>

        {/* Direct Emergency Contact */}
        <div className="space-y-4 bg-white/50 backdrop-blur-md p-5 rounded-3xl border border-red-200/20 shadow-sm leading-relaxed">
          <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-red-700 flex items-center gap-2">
            🚨 জরুরী রক্ত সহায়তায়
          </h4>
          <p className="font-sans text-xs text-gray-500">
            মুহূর্তে রক্তের ব্যবস্থা না হলে বা টেকনিক্যাল সহায়তার জন্য ২৪ ঘণ্টা খোলা হটলাইনে যোগাযোগ করুন:
          </p>
          
          <div className="space-y-2.5 pt-1.5">
            <a
              href="tel:+8801712456789"
              className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors group font-sans text-sm font-semibold"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <span>+৮৮০ ১৭১২-৪৫৬৭৮৯ (প্রধান)</span>
            </a>

            <a
              href="mailto:contact@roktimbb.org"
              className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-colors group font-sans text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span>support@roktimbb.org</span>
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-gray-400 text-center md:text-left">
          © ২০২৬ রক্তিম ব্লাড ব্যাংক তাহেরপুর। সর্বস্বত্ব সংরক্ষিত। 
          <span className="font-english block md:inline md:ml-2 text-gray-400">
            Designed for secure & life-saving local blood coordination.
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs font-sans text-gray-400">
          <button
            onClick={onOpenDevProfile}
            className="flex items-center gap-1.5 bg-red-100/50 hover:bg-red-100 text-rose-800 px-3 py-1.5 rounded-full border border-red-200/50 transition-all cursor-pointer font-bold text-[11px]"
            title="সিস্টেম ডেভলপার প্রোফাইল"
          >
            <HelpCircle className="w-3.5 h-3.5 text-red-650" />
            <span>ডেভলপার প্রোফাইল</span>
          </button>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>সিকিউরড ডাটাবেজ</span>
          </span>
          <span>•</span>
          <span>তাহেরপুর পৌরসভা, বাগমারা</span>
        </div>
      </div>
    </footer>
  );
}
