import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NoticeBn, NoticeEn } from '../utils/defaultData';
import { Volume2 } from 'lucide-react';

export default function NoticeBar() {
  const [notices, setNotices] = useState<{ id: string; textBn: string; textEn: string }[]>([]);

  useEffect(() => {
    // Realtime listener for notices
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotices: any[] = [];
      snapshot.forEach((doc) => {
        fetchedNotices.push({ id: doc.id, ...doc.data() });
      });
      if (fetchedNotices.length > 0) {
        setNotices(fetchedNotices);
      } else {
        // Fallback to defaults
        setNotices([
          { id: 'd1', textBn: NoticeBn, textEn: NoticeEn },
          { id: 'd2', textBn: "জরুরী রক্তদানে সরাসরি আমাদের হটলাইনের যোগাযোগ করুন: +৮৮০১৭১২৪৫৬৭৮৯।", textEn: "For emergency blood needs, contact our helpline directly: +8801712456789." }
        ]);
      }
    }, (error) => {
      console.warn("Notice fetch error, using fallback. Error:", error);
      setNotices([
        { id: 'd1', textBn: NoticeBn, textEn: NoticeEn },
        { id: 'd2', textBn: "জরুরী রক্তদানে সরাসরি আমাদের হটলাইনের যোগাযোগ করুন: +৮৮০১৭১২৪৫৬৭৮৯।", textEn: "For emergency blood needs, contact our helpline directly: +8801712456789." }
      ]);
    });

    return () => unsubscribe();
  }, []);

  const scrollingText = notices.map(n => `📢 ${n.textBn} | ${n.textEn}`).join('　•　');

  return (
    <div className="w-full bg-red-600 text-white py-2.5 px-4 shadow-[0_4px_16px_rgba(239,68,68,0.15)] flex items-center overflow-hidden h-10 border-y border-red-500/30 relative z-20">
      <div className="flex items-center gap-2 bg-red-700/80 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-red-500/20 mr-4 shrink-0 shadow-sm">
        <Volume2 className="w-3.5 h-3.5 animate-bounce" />
        <span className="font-sans hidden sm:inline">ঘোষণা / Notice</span>
        <span className="font-sans inline sm:hidden">নোটিশ</span>
      </div>
      <div className="scrolling-notice-container w-full relative flex items-center">
        <p className="scrolling-notice-content font-medium text-sm md:text-base tracking-wide select-none cursor-pointer">
          {scrollingText || "রক্তিম ব্লাড ব্যাংক তাহেরপুর-এ আপনাকে স্বাগতম। রক্ত দান করুন, জীবন বাঁচান। Welcome to Roktim Blood Bank Taherpur. Donate blood, save a life."}
        </p>
      </div>
    </div>
  );
}
