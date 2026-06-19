import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface DateValue {
  day: number;
  month: number;
  year: number;
}

export default function DateTimeCalendarWidget() {
  const [time, setTime] = useState(new Date());
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(new Date().getDate());

  // Update time live every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format options
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

  const getBanglaNumber = (num: number | string): string => {
    const numbers: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(digit => numbers[digit] || digit).join('');
  };

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
  const currentDateBn = `${getBanglaNumber(time.getDate())} ${banglaMonths[time.getMonth()]}, ${getBanglaNumber(time.getFullYear())}`;

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

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/60 space-y-6 shadow-md bg-white/40 backdrop-blur-md">
      
      {/* Live Widget Header: Time and Date */}
      <div className="grid grid-cols-2 gap-4 items-center divide-x divide-red-100/50">
        
        {/* Left Side: Realtime Clock */}
        <div className="space-y-1.5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 text-red-600">
            <Clock className="w-4 h-4 animate-spin-slow text-red-500" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider">রিয়েল-টাইম সময়</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-english text-gray-900 tracking-tight leading-none">
            {formattedTimeEn}
          </div>
          <div className="text-xs font-semibold text-gray-400 font-sans">
            {formattedTimeBn}
          </div>
        </div>

        {/* Right Side: Date BN and EN */}
        <div className="space-y-1.5 flex flex-col items-center justify-center pl-4 bg-transparent">
          <div className="flex items-center gap-1.5 text-gray-600">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="font-sans text-xs font-bold uppercase tracking-wider">আজকের তারিখ</span>
          </div>
          <div className="text-sm font-black text-gray-800 font-sans tracking-tight leading-none text-center">
            {currentDayBn}, {currentDateBn}
          </div>
          <span className="text-[11px] font-semibold text-gray-400 font-english block text-center">
            {currentDayEn}, {currentDateEn}
          </span>
        </div>

      </div>

      {/* Mini Interactive Calendar Grid */}
      <div className="border-t border-red-50 pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-sans text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-red-500" />
            ক্যালেন্ডার শিডিউল
          </h4>
          
          <div className="flex items-center gap-1 text-gray-500">
            <button 
              onClick={prevMonth} 
              className="p-1 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-sans text-xs font-bold text-gray-800 px-1 font-english">
              {englishMonths[month]} {year}
            </span>
            <button 
              onClick={nextMonth} 
              className="p-1 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week titles */}
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
          <span>ই</span> <span>সো</span> <span>ম</span> <span>বু</span> <span>বৃ</span> <span>শু</span> <span>শ</span>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-7 gap-1 text-center font-english text-xs">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="py-1.5" />;
            }

            const isCurrentToday = isToday(day);
            const isSelected = selectedCalendarDay === day;

            return (
              <button
                key={`day-${day}`}
                onClick={() => setSelectedCalendarDay(day)}
                className={`py-1.5 rounded-lg font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                  isCurrentToday 
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/25 scale-102' 
                    : isSelected 
                      ? 'bg-red-150 text-red-700 border border-red-300' 
                      : 'hover:bg-red-50 text-gray-700'
                }`}
              >
                <span>{getBanglaNumber(day)}</span>
                
                {/* Specific days scheduled markers */}
                {(day === 12 || day === 19 || day === 25) && (
                  <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                    isCurrentToday ? 'bg-white' : 'bg-red-500'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive schedule details for the selected day */}
        <div className="bg-red-50/45 border border-red-100/50 rounded-2xl p-3 mt-2 text-left space-y-1">
          <p className="font-sans text-[10px] text-gray-400 font-semibold uppercase leading-none">নির্বাচিত দিনের শিডিউল:</p>
          <div className="font-sans text-xs text-gray-600 leading-normal flex items-start gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              {selectedCalendarDay === 12 || selectedCalendarDay === 19 || selectedCalendarDay === 25 ? (
                <span>রক্তিম ব্লাড ক্যাম্পেইন & ডোনার সেশন তাহেরপুর সদর শাখা। জরুরী সহায়তায় টিম রেডি।</span>
              ) : (
                <span>সাধারণ রক্তদান ও সেবা সমন্বয় কার্যক্রম সক্রিয় রয়েছে।</span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
