import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl border border-amber-400/40 animate-bounce font-sans">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>অফলাইন মোড — ক্যাশ করা পূর্ববর্তী তথ্য প্রদর্শিত হচ্ছে।</span>
    </div>
  );
};
