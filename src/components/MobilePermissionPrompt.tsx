import React, { useState, useEffect } from 'react';
import { Bell, Compass, ShieldCheck, X, CheckCircle, Smartphone, AlertCircle } from 'lucide-react';
import { playEmergencyAlertSound } from '../utils/notifications';

interface MobilePermissionPromptProps {
  onLocationAcquired?: (lat: number, lng: number) => void;
}

export default function MobilePermissionPrompt({ onLocationAcquired }: MobilePermissionPromptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');
  const [gpsStatus, setGpsStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem('roktim_perms_dismissed');
    if (isDismissed) return;

    // Check Notification status if supported
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationStatus(Notification.permission);
    }

    // Check Geolocation permission state via Permissions API if available
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          setGpsStatus(result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'prompt');
          result.onchange = () => {
            setGpsStatus(result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'prompt');
          };
        })
        .catch(() => {
          // Permissions API might not support geolocation in all browsers
        });
    }

    // Check if on mobile or small screen
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
      || (typeof window !== 'undefined' && window.innerWidth <= 768);

    // If notifications or GPS are not yet granted, trigger prompt after a brief 1.5s delay
    const notifNeeded = typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default';
    
    if (isMobileDevice || notifNeeded) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRequestAllPermissions = async () => {
    setIsProcessing(true);
    let notifResult: NotificationPermission = 'default';

    // 1. Request Notification Permission
    try {
      if ('Notification' in window) {
        notifResult = await Notification.requestPermission();
        setNotificationStatus(notifResult);
        if (notifResult === 'granted') {
          playEmergencyAlertSound();
          try {
            new Notification("রক্তিম ব্লাড ব্যাংক - তাহেরপুর", {
              body: "নোটিফিকেশন সক্রিয় হয়েছে! জরুরি রক্তের যেকোনো আবেদনে সাথে সাথে অ্যালার্ট পাবেন।",
              icon: "/pwa-192x192.png"
            });
          } catch (e) {
            // Mobile PWA might require serviceWorker registration for notifications
          }
        }
      }
    } catch (err) {
      console.warn("Notification request error:", err);
    }

    // 2. Request Geolocation Permission
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setGpsStatus('granted');
            setIsProcessing(false);
            setSuccessBanner(true);
            if (onLocationAcquired) {
              onLocationAcquired(pos.coords.latitude, pos.coords.longitude);
            }
            setTimeout(() => {
              setIsOpen(false);
              sessionStorage.setItem('roktim_perms_dismissed', 'true');
            }, 2000);
          },
          (err) => {
            console.warn("Geolocation error:", err);
            setGpsStatus('denied');
            setIsProcessing(false);
            setTimeout(() => {
              setIsOpen(false);
              sessionStorage.setItem('roktim_perms_dismissed', 'true');
            }, 2500);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
        return;
      }
    } catch (err) {
      console.warn("GPS request error:", err);
    }

    setIsProcessing(false);
    setSuccessBanner(true);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem('roktim_perms_dismissed', 'true');
    }, 2000);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('roktim_perms_dismissed', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div 
        className="absolute inset-0 bg-gray-950/50 backdrop-blur-xs transition-opacity" 
        onClick={handleDismiss} 
      />

      {/* Floating Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-red-100 z-10 text-left font-sans animate-in slide-in-from-bottom duration-300">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-full">
              বাগমারা ও তাহেরপুর মোবাইল পারমিশন
            </span>
            <h3 className="text-base sm:text-lg font-black text-gray-950 mt-1">
              জরুরি রক্তের সুবিধা পেতে পারমিশন সক্রিয় করুন
            </h3>
          </div>
        </div>

        {/* Details list */}
        <div className="mt-4 space-y-2.5">
          
          {/* Permission 1: Push Notifications */}
          <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">১. জরুরি রক্তের পুশ নোটিফিকেশন</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  notificationStatus === 'granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {notificationStatus === 'granted' ? '✓ সক্রিয়' : 'প্রয়োজন'}
                </span>
              </div>
              <p className="text-gray-500 mt-0.5 leading-relaxed">
                বাগমারা ও তাহেরপুর অঞ্চলে কারো জরুরি রক্তের প্রয়োজন হলে তাৎক্ষণিক নোটিফিকেশন ও অ্যালার্ট সাউন্ড পাবেন।
              </p>
            </div>
          </div>

          {/* Permission 2: GPS Location Tracking */}
          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">২. লাইভ জিপিএস লোকেশন ট্র্যাকিং</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  gpsStatus === 'granted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {gpsStatus === 'granted' ? '✓ সক্রিয়' : 'প্রয়োজন'}
                </span>
              </div>
              <p className="text-gray-500 mt-0.5 leading-relaxed">
                আপনার নিকটবর্তী রক্তদাতা ও হাসপাতালের দূরত্ব গুগল ম্যাপে রিয়েল-টাইমে নিখুঁতভাবে দেখতে সহায়তা করবে।
              </p>
            </div>
          </div>

        </div>

        {/* Feedback message if granted */}
        {successBanner && (
          <div className="mt-3 p-2.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>পারমিশন সফলভাবে গ্রহণ করা হয়েছে! সেবা চালু হচ্ছে...</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-5 flex items-center gap-2.5">
          <button
            onClick={handleDismiss}
            className="w-1/3 py-3 px-3 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition cursor-pointer text-center"
          >
            পরে করব
          </button>

          <button
            onClick={handleRequestAllPermissions}
            disabled={isProcessing}
            className="w-2/3 py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-500/25 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>অনুমতি দিন (Allow Both)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
