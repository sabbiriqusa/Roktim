import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BloodRequest, AppUser } from '../types';
import { defaultRequests } from '../utils/defaultData';
import { 
  Heart, Hospital, MapPin, Phone, Clock, Share2, CheckCircle2, 
  AlertCircle, MessageCircle, Send, UserCheck, Flame, Filter 
} from 'lucide-react';

interface RequestTimelineProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onNewRequestClick: () => void;
}

export default function RequestTimeline({ currentUser, onOpenAuth, onNewRequestClick }: RequestTimelineProps) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [pledgedIds, setPledgedIds] = useState<string[]>([]);
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Read user pledges from local storage
    const storedPledges = localStorage.getItem('roktim_pledged_requests');
    if (storedPledges) {
      try {
        setPledgedIds(JSON.parse(storedPledges));
      } catch (e) {
        // ignore
      }
    }

    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: BloodRequest[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as BloodRequest);
      });

      if (list.length === 0) {
        setRequests(defaultRequests);
      } else {
        // Combine with default requests if not present
        const merged = [...list];
        defaultRequests.forEach((def) => {
          if (!merged.some((m) => m.id === def.id || (m.patientName === def.patientName && m.phone === def.phone))) {
            merged.push(def);
          }
        });
        setRequests(merged);
      }
      setLoading(false);
    }, (err) => {
      console.warn("Could not fetch timeline from Firestore:", err);
      setRequests(defaultRequests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handlePledge = (reqId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const newPledges = pledgedIds.includes(reqId)
      ? pledgedIds.filter((id) => id !== reqId)
      : [...pledgedIds, reqId];

    setPledgedIds(newPledges);
    localStorage.setItem('roktim_pledged_requests', JSON.stringify(newPledges));
  };

  const handleShare = async (req: BloodRequest) => {
    const shareText = `🚨 জরুরি রক্তের আবেদন! রোগী: ${req.patientName}, রক্তের গ্রুপ: ${req.bloodGroup}, হাসপাতাল: ${req.hospitalName}, স্থান: ${req.location}। যোগাযোগ: ${req.phone}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `রক্তিম ব্লাড ব্যাংক - জরুরি ${req.bloodGroup} রক্ত প্রয়োজন`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (e) {
        // user cancelled or failed, fallback to clipboard
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setShareSuccess(req.id);
      setTimeout(() => setShareSuccess(null), 3000);
    } catch (e) {
      alert("তথ্যটি কপি করা হয়েছে: " + shareText);
    }
  };

  const filtered = requests.filter((r) => {
    if (filterGroup === 'all') return true;
    if (filterGroup === 'pledged') return pledgedIds.includes(r.id);
    return r.bloodGroup === filterGroup;
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6 animate-in fade-in duration-300">
      
      {/* Timeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <Flame className="w-5 h-5 fill-red-600" />
            </div>
            <h2 className="font-sans text-2xl md:text-3xl font-black text-gray-900">
              লাইভ রক্ত রিকোয়েস্ট টাইমলাইন
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-gray-500">
            রিয়েল-টাইমে সকল ব্যবহারকারীদের ফিডে স্বয়ংক্রিয়ভাবে আসা জরুরি রক্তের আবেদনের সম্প্রচার।
          </p>
        </div>

        <button
          onClick={onNewRequestClick}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer font-sans self-start sm:self-auto"
        >
          <Heart className="w-4 h-4 fill-white" />
          <span>রক্তের আবেদন পোস্ট করুন</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-sans text-xs">
        <span className="text-gray-400 font-bold shrink-0 text-[11px] flex items-center gap-1">
          <Filter className="w-3 h-3" /> ফিল্টার:
        </span>
        <button
          onClick={() => setFilterGroup('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
            filterGroup === 'all'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          সকল টাইমলাইন ({requests.length})
        </button>
        <button
          onClick={() => setFilterGroup('pledged')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 cursor-pointer ${
            filterGroup === 'pledged'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          আমার সাড়া দেওয়া ({pledgedIds.length})
        </button>
        {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((bg) => (
          <button
            key={bg}
            onClick={() => setFilterGroup(bg)}
            className={`px-3 py-1.5 rounded-xl font-bold font-english transition shrink-0 cursor-pointer ${
              filterGroup === bg
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {bg}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      {loading ? (
        <div className="py-16 text-center space-y-2">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-500 font-sans">টাইমলাইন আপডেট লোড হচ্ছে...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center space-y-2 font-sans">
          <AlertCircle className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-bold text-gray-600">এই বিভাগে কোনো রক্তের আবেদন নেই।</p>
          <p className="text-xs text-gray-400">নতুন কোনো রক্তের প্রয়োজন হলে উপরোক্ত বাটনে ক্লিক করে পোস্ট করুন।</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-red-200 ml-4 sm:ml-6 space-y-6 pl-4 sm:pl-6 text-left font-sans">
          {filtered.map((req) => {
            const isPledged = pledgedIds.includes(req.id);
            const timeString = new Date(req.createdAt).toLocaleDateString('bn-BD', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={req.id} className="relative group">
                
                {/* Timeline node icon */}
                <div className="absolute -left-7 sm:-left-9 top-3 w-6 h-6 rounded-full bg-white border-4 border-red-600 flex items-center justify-center shadow-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                </div>

                {/* Timeline Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-sm hover:shadow-md transition-all space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-650 to-red-500 text-white flex items-center justify-center font-english text-xl font-black shadow-md">
                        {req.bloodGroup}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-gray-950">
                            {req.patientName}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'fulfilled'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800 animate-pulse'
                          }`}>
                            {req.status === 'fulfilled' ? '✓ রক্ত পাওয়া গেছে' : '🚨 জরুরি রক্ত প্রয়োজন'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" /> {timeString} • {req.units} ব্যাগ
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-gray-500 block">আবেদনকারী:</span>
                      <span className="text-xs font-semibold text-gray-800">{req.requestedBy}</span>
                    </div>
                  </div>

                  {/* Card Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-150/60">
                    <div className="flex items-start gap-2">
                      <Hospital className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block">{req.hospitalName}</span>
                        <span className="text-gray-500 text-[11px]">{req.location}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900 block">রক্তদানের কারণ:</span>
                        <span className="text-gray-500 text-[11px]">{req.reason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.phone}`}
                        className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>সরাসরি কল ({req.phone})</span>
                      </a>

                      <button
                        onClick={() => handlePledge(req.id)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          isPledged
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <UserCheck className={`w-3.5 h-3.5 ${isPledged ? 'text-emerald-600' : 'text-gray-500'}`} />
                        <span>{isPledged ? '✓ আমি রক্ত দিচ্ছি' : 'আমি রক্ত দিতে রাজি'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleShare(req)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition cursor-pointer p-2 rounded-xl hover:bg-red-50"
                      title="সোশ্যাল মিডিয়া বা হোয়াটসঅ্যাপে শেয়ার করুন"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{shareSuccess === req.id ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
