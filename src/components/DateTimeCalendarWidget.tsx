import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw, 
  Heart,
  Phone,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DateTimeCalendarWidget() {
  const [time, setTime] = useState(new Date());
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(new Date().getDate());
  const [isFlipping, setIsFlipping] = useState(true);
  const [flipCount, setFlipCount] = useState(0);

  // Trigger page flip animation sequence on mount and when flipCount increases
  useEffect(() => {
    setIsFlipping(true);
    const timer = setTimeout(() => {
      setIsFlipping(false);
    }, 2400); // 2.4 seconds total sequence
    return () => clearTimeout(timer);
  }, [flipCount]);

  // Update time live every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Bangla number helper
  const getBanglaNumber = (num: number | string): string => {
    const numbers: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(digit => numbers[digit] || digit).join('');
  };

  const banglaMonths = [
    'জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  const banglaDays = [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
  ];

  const englishMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const englishDays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const formattedTimeEn = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedTimeBn = getBanglaNumber(formattedTimeEn);

  const currentDayBn = banglaDays[time.getDay()];
  const currentDateBn = `${getBanglaNumber(time.getDate())} ${banglaMonths[time.getMonth()]} ${getBanglaNumber(time.getFullYear())}`;

  const currentDayEn = englishDays[time.getDay()];
  const currentDateEn = `${time.getDate()} ${englishMonths[time.getMonth()]}, ${time.getFullYear()}`;

  // Generate calendar days array
  const calendarDays = [];
  // Fill leading empty days
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  // Fill month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const today = new Date();
  const isToday = (day: number) => {
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  // Stack of decorative pages flipping away to reveal current calendar
  const pagesToFlip = [
    { id: 1, monthName: 'April', delay: 0.1, title: 'রক্তদানই সর্বোত্তম মহৎ দান' },
    { id: 2, monthName: 'May', delay: 0.7, title: 'বাঁচবে প্রাণ, হাসবে দেশ!' },
    { id: 3, monthName: 'June', delay: 1.3, title: 'রক্তিম ব্লাড ব্যাংক তাহেরপুর' }
  ];

  const googleFormUrl = "https://forms.gle/L4udP8fpYshcCAr27";

  return (
    <div className="relative mx-auto w-full max-w-5xl pt-4 pb-10">
      
      {/* 3D Realistic Cardboard Base stand for Desktop Calendar */}
      <div className="absolute bottom-4 left-6 right-6 h-8 bg-gradient-to-t from-stone-800 to-stone-900 rounded-b-2xl shadow-2xl transform translate-y-3 origin-top skew-x-1 pointer-events-none opacity-95 border-b border-stone-950 z-0" />
      <div className="absolute bottom-6 left-12 right-12 h-14 bg-stone-700/80 rounded-b-xl transform translate-y-2 origin-top pointer-events-none -z-10" />
      
      {/* Metal spiral binding rings along the top edge */}
      <div className="absolute top-0 left-0 right-0 -mt-3.5 flex justify-around px-10 pointer-events-none z-30 select-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div 
            key={i} 
            className="w-3 h-8 rounded-full bg-gradient-to-r from-stone-400 via-gray-200 to-stone-500 shadow-md border-t border-white/50"
          />
        ))}
      </div>

      {/* Main realistic page frame */}
      <div className="relative bg-white rounded-3xl border border-stone-200/95 shadow-2xl p-1 overflow-hidden z-10">
        
        {/* Paper stack depth cards underneath */}
        <div className="absolute inset-0 bg-stone-50 border border-stone-200/50 rounded-3xl transform translate-y-1.5 translate-x-1.5 -z-10 shadow" />
        <div className="absolute inset-0 bg-stone-100/80 border border-stone-200/30 rounded-3xl transform translate-y-3 translate-x-3 -z-20 shadow-sm" />

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/80 relative bg-stone-50/50">
          
          {/* ==================== LEFT PAGE: EMBOSSED LOGO & SLOGAN AREA ==================== */}
          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-br from-white via-red-50/5 to-stone-50/35 relative select-none">
            
            {/* Soft decorative background patterns */}
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-red-50/10 to-transparent pointer-events-none" />
            
            {/* Page Header */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <span className="text-[10px] font-mono font-black text-red-600 tracking-widest">ESTD. 2026</span>
              <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest">ORGANIZATION PROFILE</span>
            </div>

            {/* Central Slogan and Brand Area */}
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-5 py-4 z-10">
              
              {/* Premium Embossed Heartbeat Blood Drop Logo */}
              <div className="relative group cursor-pointer transition-transform duration-500 hover:scale-105 active:scale-95">
                <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-full blur-xl opacity-20 group-hover:opacity-35 transition-all duration-500" />
                
                <svg className="w-24 h-24 text-red-600 drop-shadow-lg relative" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="bloodDropGrad" x1="50" y1="12" x2="50" y2="88" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="60%" stopColor="#dc2626" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                    <filter id="cardShadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#991b1b" floodOpacity="0.3" />
                    </filter>
                  </defs>
                  
                  {/* Outer delicate concentric circles */}
                  <circle cx="50" cy="50" r="46" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="5 4" />
                  <circle cx="50" cy="50" r="41" stroke="#fee2e2" strokeWidth="1" />
                  
                  {/* The Heartbeat Blood Drop */}
                  <path 
                    d="M50 14C50 14 20 44 20 62C20 78.568 33.431 92 50 92C66.568 92 80 78.568 80 62C80 44 50 14 50 14Z" 
                    fill="url(#bloodDropGrad)" 
                    filter="url(#cardShadow)"
                  />
                  
                  {/* Glowing EKG Line Inside */}
                  <path 
                    d="M32 64H41L44 51L48 76L52 58L54 64H68" 
                    stroke="white" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>

              {/* Slogan and Branding Labels */}
              <div className="space-y-3">
                <h3 className="font-sans text-2xl font-black text-gray-900 tracking-tight leading-none">
                  রক্তিম ব্লাড ব্যাংক
                </h3>
                
                {/* User Explicitly requested English slogan "Raktim Blood Bank, Taitpur" */}
                <div className="inline-block bg-gradient-to-r from-red-600 to-rose-700 text-white font-sans text-[11px] font-black uppercase tracking-widest px-4.5 py-1.5 rounded-full shadow-md border border-red-500/25">
                  Raktim Blood Bank, Taitpur
                </div>
                
                <p className="font-sans text-xs font-semibold text-gray-500 italic max-w-xs mx-auto leading-relaxed">
                  "রক্তদান হোক সামাজিক আন্দোলন, সুস্থ থাকুক প্রতিটি জীবন।"
                </p>
              </div>
            </div>

            {/* Bottom Footer Info on Left Page */}
            <div className="border-t border-stone-100 pt-3 text-center space-y-1 z-10">
              <span className="block text-[10px] text-gray-400 font-bold tracking-wide uppercase">উদ্যোক্তা ও প্রতিষ্ঠাতা</span>
              <p className="font-sans text-xs text-red-700 font-extrabold leading-tight">
                সাকিবুল ইসলাম সাব্বির
              </p>
              <p className="font-sans text-[10px] text-gray-500 leading-none">
                রাজশাহী কলেজ (জাতীয় বিশ্ববিদ্যালয়)
              </p>
            </div>
          </div>

          {/* ==================== RIGHT PAGE: SCHEDULER & CALENDAR GRID ==================== */}
          <div className="lg:col-span-7 p-6 md:p-8 space-y-6 flex flex-col justify-between">
            
            {/* Dynamic Clock and Date Top Display Row */}
            <div className="grid grid-cols-2 gap-4 items-center border-b border-stone-100 pb-4">
              
              {/* Live Clock Widget */}
              <div className="space-y-1 text-center bg-stone-100/50 border border-stone-200/30 p-2.5 rounded-2xl">
                <div className="flex items-center justify-center gap-1.5 text-red-600">
                  <Clock className="w-3.5 h-3.5 animate-spin-slow text-red-500" />
                  <span className="font-sans text-[9px] font-black uppercase tracking-wider">রিয়েল-টাইম সময়</span>
                </div>
                <div className="text-lg md:text-xl font-black font-english text-stone-900 tracking-tight leading-none">
                  {formattedTimeEn}
                </div>
                <div className="text-[10px] font-bold text-stone-400 font-sans">
                  {formattedTimeBn}
                </div>
              </div>

              {/* Current Date Widget */}
              <div className="space-y-1 text-center bg-stone-100/50 border border-stone-200/30 p-2.5 rounded-2xl">
                <div className="flex items-center justify-center gap-1.5 text-stone-600">
                  <CalendarIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span className="font-sans text-[9px] font-black uppercase tracking-wider">আজকের দিন</span>
                </div>
                <div className="text-xs font-black text-stone-800 font-sans tracking-tight leading-none truncate">
                  {currentDayBn}, {currentDateBn}
                </div>
                <span className="text-[10px] font-bold text-stone-400 font-english block truncate">
                  {currentDayEn}, {currentDateEn}
                </span>
              </div>

            </div>

            {/* Interactive Calendar Controller */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-sans text-xs font-black text-gray-800 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-red-600" />
                  <span>ক্যালেন্ডার শিডিউল</span>
                </h4>
                
                {/* Calendar Navigation & Interactive Re-flip button */}
                <div className="flex items-center gap-2.5">
                  {/* Interactive Re-flip Page button */}
                  <button
                    onClick={() => setFlipCount(prev => prev + 1)}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 text-stone-400 rounded-xl transition-all duration-300 flex items-center gap-1 group relative cursor-pointer"
                    title="ক্যালেন্ডার পাতা উল্টানো অ্যানিমেশন পুনরায় দেখুন"
                  >
                    <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-[10px] font-sans font-black tracking-wide hidden sm:inline text-stone-400 group-hover:text-red-600">পাতা ফ্লিপ করুন</span>
                  </button>

                  <div className="flex items-center gap-1 bg-stone-100 border border-stone-200/40 rounded-xl p-0.5 shadow-inner">
                    <button 
                      onClick={prevMonth} 
                      className="p-1.5 hover:bg-white hover:text-red-600 text-stone-600 rounded-lg transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-sans text-xs font-black text-stone-800 px-2 font-english">
                      {englishMonths[month]} {year}
                    </span>
                    <button 
                      onClick={nextMonth} 
                      className="p-1.5 hover:bg-white hover:text-red-600 text-stone-600 rounded-lg transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Weekday Titles - Friday highlighted in bold red */}
              <div className="grid grid-cols-7 text-center text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest border-b border-stone-100 pb-1.5 font-sans">
                <span>রবি</span>
                <span>সোম</span>
                <span>মঙ্গল</span>
                <span>বুধ</span>
                <span>বৃহ</span>
                <span className="text-red-600 font-black bg-red-50/50 rounded-md py-0.5 shadow-sm border border-red-100/30">শুক্র</span>
                <span>শনি</span>
              </div>

              {/* Month Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center font-english text-xs md:text-sm">
                {calendarDays.map((day, idx) => {
                  if (day === null) {
                    return <div key={`empty-${idx}`} className="py-2" />;
                  }

                  const isCurrentToday = isToday(day);
                  const isSelected = selectedCalendarDay === day;
                  
                  // Highlight Friday: idx % 7 === 5 represents Friday in our layout
                  const isFriday = idx % 7 === 5;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedCalendarDay(day)}
                      className={`py-2 rounded-xl font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer select-none border ${
                        isCurrentToday 
                          ? 'bg-red-600 text-white border-red-700 shadow-md shadow-red-500/30 scale-102 font-black' 
                          : isSelected 
                            ? 'bg-red-100 text-red-800 border-red-300 font-extrabold' 
                            : isFriday 
                              ? 'bg-rose-50 hover:bg-rose-100 text-red-600 border-rose-150 font-black shadow-inner-sm' 
                              : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-100 shadow-sm'
                      }`}
                    >
                      <span>{getBanglaNumber(day)}</span>
                      
                      {/* Friday Small Holiday Label Indicator */}
                      {isFriday && !isCurrentToday && !isSelected && (
                        <span className="absolute top-0.5 right-0.5 text-[8px] text-red-400 font-black shrink-0 pointer-events-none scale-90">•</span>
                      )}

                      {/* Campaign scheduled marker points */}
                      {(day === 12 || day === 19 || day === 25) && (
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                          isCurrentToday ? 'bg-white animate-ping' : 'bg-red-600'
                        }`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Schedule Box for Selected Day */}
            <div className="bg-gradient-to-r from-red-50/60 to-rose-50/30 border border-red-100/50 rounded-2xl p-4 text-left space-y-2.5 shadow-inner mt-2">
              <div className="flex items-center justify-between border-b border-red-100/40 pb-1.5">
                <span className="font-sans text-[10px] text-stone-400 font-black uppercase tracking-wider">
                  নির্বাচিত দিনের শিডিউল: {getBanglaNumber(selectedCalendarDay)} {banglaMonths[month]}
                </span>
                <span className="text-[9px] bg-red-600 text-white font-sans font-bold px-2 py-0.5 rounded-full shadow-sm">
                  সক্রিয়
                </span>
              </div>
              
              <div className="font-sans text-xs text-stone-700 leading-relaxed flex items-start gap-2 pt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {selectedCalendarDay === 12 || selectedCalendarDay === 19 || selectedCalendarDay === 25 ? (
                    <p className="font-sans font-bold text-red-800">
                      রক্তিম ব্লাড ক্যাম্পেইন ও ডোনার সেশন তাহেরপুর সদর শাখা। জরুরী সহায়তায় আমাদের মেডিকেল টিম সার্বক্ষণিক রেডি।
                    </p>
                  ) : (
                    <p className="font-sans text-stone-600">
                      সাধারণ রক্তদান, রোগীর প্রয়োজনীয় রক্তের সন্ধান ও সমন্বয় কার্যক্রম চালু রয়েছে। যেকোনো জরুরি রক্তদানের প্রয়োজনে সরাসরি যোগাযোগ করতে পারেন।
                    </p>
                  )}
                  
                  {/* Direct interactive contact actions inside the schedule box */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href="tel:+8801712456789"
                      className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-sans text-[10px] font-black px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <Phone className="w-3 h-3" />
                      <span>কল করুন: +৮৮০ ১৭১২-৪৫৬৭৮৯</span>
                    </a>
                    
                    <a
                      href={googleFormUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 font-sans text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      <span>রক্তের আবেদন ফরম</span>
                      <ExternalLink className="w-3 h-3 text-red-500" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ==================== PAGE FLIP ANIMATION OVERLAY ==================== */}
        <AnimatePresence>
          {isFlipping && (
            <div className="absolute inset-0 z-40 overflow-hidden rounded-3xl pointer-events-none select-none">
              {pagesToFlip.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ rotateX: 0, opacity: 1 }}
                  animate={{ 
                    rotateX: -140, 
                    opacity: [1, 1, 0.95, 0],
                    y: -12,
                    z: -10
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 1.1, 
                    delay: p.delay,
                    ease: "easeInOut"
                  }}
                  style={{ 
                    transformOrigin: "top",
                    backfaceVisibility: "hidden",
                    perspective: "1400px"
                  }}
                  className="absolute inset-0 bg-stone-50 border border-stone-200 shadow-2xl p-8 flex flex-col justify-between"
                >
                  {/* Matching binders for the flipping page */}
                  <div className="absolute top-0 left-0 right-0 -mt-2 flex justify-around px-10">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="w-3 h-4 rounded-b-full bg-stone-300 border-x border-b border-stone-400/50" />
                    ))}
                  </div>

                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-stone-200/60 pb-4">
                    <span className="text-[10px] font-bold font-english text-gray-400 uppercase tracking-widest">{p.monthName}</span>
                    <span className="text-[10px] font-bold text-red-600 tracking-wide font-sans">রক্তিম ব্লাড ব্যাংক তাহেরপুর</span>
                  </div>

                  {/* Content of the flipping page */}
                  <div className="flex-grow flex flex-col items-center justify-center space-y-5 pt-8">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-inner">
                      <Heart className="w-8 h-8 text-red-600 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-center">
                      <h3 className="text-xl font-sans font-black text-gray-800">{p.title}</h3>
                      <p className="text-xs text-gray-400 font-sans tracking-wide">নিরাপদ রক্ত সঞ্চালনে আমরা আছি আপনার পাশে</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="text-center text-[10px] text-stone-400 font-sans border-t border-stone-150 pt-4">
                    ক্যালেন্ডার পৃষ্ঠা উল্টানো হচ্ছে...
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
