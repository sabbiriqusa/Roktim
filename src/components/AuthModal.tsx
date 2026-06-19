import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { AppUser } from '../types';
import { LogIn, HelpCircle, Shield, Chrome, ArrowRight, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [useEmailAuth, setUseEmailAuth] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      onLoginSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isGuest: false
      });
      onClose();
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      let errMsg = "গুগল সাইন-ইন সম্পন্ন করা যায়নি।";
      if (err.code === 'auth/popup-blocked') {
        errMsg = "পপআপ উইন্ডোটি ব্রাউজার দ্বারা ব্লক করা হয়েছে। অনুগ্রহ করে পপআপ সম্মতি দিন অথবা 'গেস্ট সাইন-ইন' ব্যবহার করুন।";
      } else if (err.code === 'auth/network-request-failed') {
        errMsg = "নেটওয়ার্ক সংযোগে সমস্যা। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।";
      } else {
        errMsg = `ত্রুটি: ${err.message || "অজানা সমস্যা"}. আপনি ইচ্ছে করলে নিচের 'গেস্ট/টেস্ট সাইন-ইন' ব্যবহার করতে পারেন।`;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (useEmailAuth) {
      if (!customName || !customEmail) {
        setError("অনুগ্রহ করে আপনার নাম এবং ইমেইল দুটোই পূরণ করুন।");
        return;
      }
      onLoginSuccess({
        uid: 'guest_' + Date.now(),
        email: customEmail,
        displayName: customName,
        photoURL: null,
        isGuest: true
      });
    } else {
      // Fast guest sign in
      onLoginSuccess({
        uid: 'guest_user_1',
        email: 'guest.taherpur@gmail.com',
        displayName: 'তাহেরপুর অতিথি',
        photoURL: null,
        isGuest: true
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-red-950/20 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md glass-card rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 border border-white/60 animate-in fade-in zoom-in duration-200">
        
        {/* Title */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-3 text-red-600 shadow-inner">
            <LogIn className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-xl md:text-2xl font-bold text-gray-900">
            একাউন্টে লগ-ইন করুন
          </h3>
          <p className="font-sans text-xs md:text-sm text-gray-500 mt-1">
            রক্তদাতা হিসেবে নিবন্ধন ও রক্ত রিকোয়েস্ট তৈরি করতে লগ-ইন আবশ্যক।
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-3.5 mb-5 text-xs font-sans leading-relaxed flex flex-col gap-1 shadow-sm">
            <span className="font-semibold">⚠️ লগ-ইন ত্রুটি:</span>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Main Google Sign in */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-2xl py-3 px-4 font-sans font-medium text-sm transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Chrome className="w-5 h-5 text-red-500" />
            )}
            গুগল একাউন্ট দিয়ে সাইন-ইন
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-sans text-gray-400 font-medium">অথবা বিকল্প বিকল্প</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {!useEmailAuth ? (
            <div className="space-y-3">
              <button
                onClick={() => {
                  onLoginSuccess({
                    uid: 'guest_user_' + Math.floor(Math.random() * 1000),
                    email: 'test.donor@roktimbb.org',
                    displayName: 'জরুরী রক্তদাতা (স্বেচ্ছাসেবী)',
                    photoURL: null,
                    isGuest: true
                  });
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-2xl py-3 px-4 font-sans font-medium text-sm transition-all border border-red-200/50 cursor-pointer shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-red-600" />
                টেস্ট একাউন্ট সাইন-ইন (পরীক্ষামূলক)
              </button>

              <button
                onClick={() => setUseEmailAuth(true)}
                className="w-full text-center font-sans text-xs text-red-600 hover:text-red-700 hover:underline transition-colors block py-1 cursor-pointer"
              >
                ইমেইল ও নাম দিয়ে সাইন-ইন করতে চান?
              </button>
            </div>
          ) : (
            <form onSubmit={handleGuestSignIn} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 font-sans">
                  আপনার নাম (বাংলা/ইংরেজি):
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="উদাঃ মোঃ আবির আহমেদ"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-sans text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 font-sans">
                  ইমেইল এড্রেস:
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="example@roktimbb.org"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl font-sans text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 bg-white/50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUseEmailAuth(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-2 px-3 font-sans text-xs font-semibold transition-colors cursor-pointer"
                >
                  ফিরে যান
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2 px-3 font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
                >
                  লগ-ইন করুন <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security assurance */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-sans border-t border-gray-100 pt-4">
          <Shield className="w-3.5 h-3.5 text-gray-400" />
          <span>আপনার তথ্য নিরাপদ ও সর্বোচ্চ সুসমন্বিত পদ্ধতিতে সংরক্ষিত।</span>
        </div>
      </div>
    </div>
  );
}
