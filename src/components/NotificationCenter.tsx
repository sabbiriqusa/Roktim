import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BloodRequest, AppNotification } from '../types';
import { defaultRequests } from '../utils/defaultData';
import { 
  playEmergencyAlertSound, 
  requestNotificationPermission, 
  triggerBrowserNotification 
} from '../utils/notifications';
import { 
  Bell, BellRing, X, Check, Volume2, VolumeX, ShieldAlert, 
  Phone, Clock, ArrowRight, Heart, Hospital, Share2 
} from 'lucide-react';

interface NotificationCenterProps {
  onNavigateToRequest?: (reqId: string) => void;
  onNavigateToRequestsPage?: () => void;
}

export default function NotificationCenter({ onNavigateToRequestsPage }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserPermissionGranted, setBrowserPermissionGranted] = useState(false);
  const [latestEmergencyBanner, setLatestEmergencyBanner] = useState<AppNotification | null>(null);

  // Initialize browser notification permission state
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setBrowserPermissionGranted(true);
    }
  }, []);

  // Listen to Firestore real-time blood requests for automated alerts
  useEffect(() => {
    let initialLoad = true;

    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems: AppNotification[] = [];

      snapshot.forEach((doc) => {
        const req = doc.data() as BloodRequest;
        newItems.push({
          id: doc.id,
          requestId: doc.id,
          bloodGroup: req.bloodGroup || 'O+',
          patientName: req.patientName || 'রোগী',
          hospitalName: req.hospitalName || 'তাহেরপুর ক্লিনিক',
          location: req.location || 'তাহেরপুর',
          phone: req.phone || '',
          timestamp: req.createdAt || new Date().toISOString(),
          read: false,
          type: 'blood_request'
        });
      });

      // If database is empty or offline, populate from defaults
      if (newItems.length === 0) {
        defaultRequests.forEach((def) => {
          newItems.push({
            id: def.id,
            requestId: def.id,
            bloodGroup: def.bloodGroup,
            patientName: def.patientName,
            hospitalName: def.hospitalName,
            location: def.location,
            phone: def.phone,
            timestamp: def.createdAt,
            read: true,
            type: 'blood_request'
          });
        });
      }

      // Check if a brand new urgent request arrived after initial load
      if (!initialLoad && newItems.length > 0) {
        const newest = newItems[0];
        // Trigger automated alerts
        if (soundEnabled) {
          playEmergencyAlertSound();
        }
        triggerBrowserNotification(
          `🚨 জরুরি ${newest.bloodGroup} রক্ত প্রয়োজন!`,
          `${newest.patientName}-এর জন্য ${newest.hospitalName}-এ জরুরি রক্ত প্রয়োজন। কল করুন: ${newest.phone}`
        );
        setLatestEmergencyBanner(newest);
      }

      initialLoad = false;
      setNotifications(newItems);
    }, (err) => {
      console.warn("Notification listener offline fallback:", err);
    });

    return () => unsubscribe();
  }, [soundEnabled]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleEnableBrowserNotifications = async () => {
    const granted = await requestNotificationPermission();
    setBrowserPermissionGranted(granted);
    if (granted) {
      triggerBrowserNotification(
        "স্বাগতম রক্তিম ব্লাড ব্যাংক!",
        "জরুরি রক্তের আবেদনের নোটিফিকেশন এখন থেকে আপনার স্ক্রিনে প্রদর্শিত হবে।"
      );
    }
  };

  return (
    <>
      {/* 1. Global Floating Emergency Broadcast Banner when a new blood request is triggered */}
      {latestEmergencyBanner && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-xl mx-auto bg-gradient-to-r from-red-650 via-red-600 to-rose-700 text-white p-4 rounded-2xl shadow-2xl border border-red-400/40 animate-in slide-in-from-top duration-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white text-red-600 flex items-center justify-center font-english font-black text-sm shadow-md shrink-0">
              {latestEmergencyBanner.bloodGroup}
            </span>
            <div className="text-left font-sans">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                🚨 স্বয়ংক্রিয় জরুরি রক্তের রিকোয়েস্ট!
              </span>
              <p className="text-xs font-bold leading-tight">
                {latestEmergencyBanner.patientName} • {latestEmergencyBanner.hospitalName}
              </p>
              <span className="text-[11px] text-red-100 block">
                যোগাযোগ: <strong className="font-english">{latestEmergencyBanner.phone}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${latestEmergencyBanner.phone}`}
              className="bg-white text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm font-sans"
            >
              কল করুন
            </a>
            <button
              onClick={() => setLatestEmergencyBanner(null)}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Notification Bell Icon in Navbar */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) markAllAsRead();
          }}
          className="relative p-2 text-gray-700 hover:text-red-600 hover:bg-red-50/80 rounded-2xl transition cursor-pointer border border-transparent hover:border-red-100"
          title="রক্তের আবেদনের নোটিফিকেশন"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5 text-red-600 animate-wiggle" />
          ) : (
            <Bell className="w-5 h-5" />
          )}

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold font-english flex items-center justify-center border-2 border-white shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* 3. Notification Drawer / Popover Panel */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />

            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 font-sans">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-red-650 via-red-600 to-rose-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-tight">নোটিফিকেশন সেন্টার</h4>
                    <span className="text-[10px] text-red-100">রিয়েল-টাইম রক্তের আবেদন</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition cursor-pointer"
                    title={soundEnabled ? 'সাউন্ড অ্যালার্ট বন্ধ করুন' : 'সাউন্ড অ্যালার্ট চালু করুন'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/50" />}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/90 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Browser Permission Request Prompt (if not yet granted) */}
              {!browserPermissionGranted && (
                <div className="p-3 bg-amber-50 border-b border-amber-200/70 text-amber-900 text-xs flex items-center justify-between gap-2">
                  <p className="text-[11px] leading-tight">
                    মোবাইল ও পিসিতে সরাসরি পুশ নোটিফিকেশন পেতে অনুমতি দিন:
                  </p>
                  <button
                    onClick={handleEnableBrowserNotifications}
                    className="shrink-0 px-2.5 py-1 bg-amber-600 text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-amber-700 transition"
                  >
                    অনুমতি দিন
                  </button>
                </div>
              )}

              {/* Notification List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 space-y-1">
                    <Bell className="w-8 h-8 mx-auto text-gray-300" />
                    <p className="text-xs font-bold text-gray-500">কোনো নোটিফিকেশন নেই</p>
                    <p className="text-[10px]">নতুন কোনো রক্তের আবেদন পোস্ট হলে এখানে পাবেন।</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`p-3.5 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                        !item.read ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-english font-black text-sm shadow-sm shrink-0">
                        {item.bloodGroup}
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-gray-900 truncate">
                            {item.patientName} (জরুরি রক্ত)
                          </h5>
                          <span className="text-[10px] text-gray-400 shrink-0 font-english">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                          <Hospital className="w-3 h-3 text-red-500 shrink-0" />
                          <span>{item.hospitalName}</span>
                        </p>

                        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-gray-150/60">
                          <span className="text-[10px] text-gray-400 font-english">{item.phone}</span>
                          <a
                            href={`tel:${item.phone}`}
                            className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> কল করুন
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-150 flex items-center justify-between text-xs">
                <button
                  onClick={markAllAsRead}
                  className="text-gray-500 hover:text-gray-800 text-[11px] font-semibold cursor-pointer"
                >
                  সবগুলো পঠিত মার্ক করুন
                </button>

                {onNavigateToRequestsPage && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onNavigateToRequestsPage();
                    }}
                    className="text-red-600 hover:text-red-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    সকল আবেদন দেখুন <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
}
