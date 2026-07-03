import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Donor } from '../types';
import { defaultDonors, bloodGroups } from '../utils/defaultData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  Users, 
  Search, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';

// Handcrafted, highly aesthetic vectorized illustration of a Muslim person (man wearing a traditional tupi/kufi and elegant beard silhouette)
function MuslimAvatarIcon({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} transition-transform duration-300 group-hover:scale-105`}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Concentric glossy glass ring */}
      <circle cx="50" cy="50" r="47" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="42" fill="currentColor" fillOpacity="0.05" />
      
      {/* Head & Neck silhouette */}
      <path 
        d="M50 30C41.5 30 36.5 34 36.5 43.5C36.5 52.5 41.5 56.5 50 56.5C58.5 56.5 63.5 52.5 63.5 43.5C63.5 34 58.5 30 50 30Z" 
        fill="currentColor" 
        fillOpacity="0.22"
      />
      
      {/* Muslim Cap (Traditional Tupi / Kufi) */}
      <path 
        d="M36 34.5C37 25 41 22 50 22C59 22 63 25 64 34.5C59 33.5 41 33.5 36 34.5Z" 
        fill="currentColor" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      {/* Decorative vertical lines on Tupi */}
      <line x1="44" y1="22.5" x2="44" y2="28.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="50" y1="22" x2="50" y2="29" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="56" y1="22.5" x2="56" y2="28.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
      
      {/* Solid Bearded Silhouette of the Muslim Person */}
      <path 
        d="M36.5 43.5C36.5 56.5 40 65.5 50 65.5C60 65.5 63.5 56.5 63.5 43.5C58.5 46.5 41.5 46.5 36.5 43.5Z" 
        fill="currentColor" 
        fillOpacity="0.6"
      />
      {/* Stylized mustache curve */}
      <path 
        d="M41 47.5C44 50 56 50 59 47.5C56 46.5 44 46.5 41 47.5Z" 
        fill="currentColor" 
        fillOpacity="0.8"
      />
      
      {/* Neck base */}
      <path 
        d="M46.5 56V62" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      
      {/* Apple-style clean shoulders & tunic (Panjabi) outline */}
      <path 
        d="M25 78C25 69 33 64 41 62H59C67 64 75 69 75 78V83H25V78Z" 
        fill="currentColor" 
        fillOpacity="0.12"
        stroke="currentColor" 
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      
      {/* Center placket with button */}
      <line x1="50" y1="62" x2="50" y2="70" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="50" cy="67.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function HighlightedDonors() {
  const [dbDonors, setDbDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'donors'), where('isRegisteredDonor', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDonors: Donor[] = [];
      snapshot.forEach((doc) => {
        fetchedDonors.push({ id: doc.id, ...doc.data() } as Donor);
      });
      setDbDonors(fetchedDonors);
      setLoading(false);
    }, (error) => {
      console.warn("Could not load donors from db for Highlighted list, using default offline data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper to rewrite and sanitize any potential female details or names to male counterparts
  const sanitizeDonor = (donor: Donor): Donor => {
    let name = donor.name || '';
    let gender = donor.gender || 'পুরুষ';

    // Check female indicators and replace with male equivalents
    const femaleIndicators = ['মোছাঃ', 'ফাতেমা', 'খাতুন', 'আক্তার', 'বেগম', 'রুপা', 'নারী', 'female', 'Female', 'Lady', 'sister', 'Sister'];
    const needsSanitization = femaleIndicators.some(ind => name.includes(ind) || gender.includes(ind));

    if (needsSanitization) {
      gender = 'পুরুষ';
      if (name.includes('ফাতেমা') || name.includes('খাতুন')) {
        name = name.replace('মোছাঃ ফাতেমা খাতুন', 'মোঃ ফাহিম মুনতাসির').replace('ফাতেমা খাতুন', 'ফাহিম মুনতাসির').replace('মোছাঃ', 'মোঃ');
      } else if (name.includes('রুপা') || name.includes('আক্তার')) {
        name = name.replace('রুপা আক্তার', 'তানজিমুল বারী').replace('আক্তার', 'রহমান');
      } else if (name.includes('বেগম')) {
        name = name.replace('বেগম', 'ইসলাম');
      } else {
        name = 'মোঃ আরিয়ান রহমান';
      }
    }

    return {
      ...donor,
      name,
      gender
    };
  };

  // Merge Firestore donors and default mock donors, and sanitize them
  const allDonors = [...dbDonors].map(sanitizeDonor);
  defaultDonors.map(sanitizeDonor).forEach((defDonor) => {
    const exists = allDonors.some(
      (d) => d.email.toLowerCase() === defDonor.email.toLowerCase() || d.phone === defDonor.phone
    );
    if (!exists) {
      allDonors.push(defDonor);
    }
  });

  // Calculate stats
  const totalDonorsCount = allDonors.filter(d => d.isVerified !== false).length;
  
  // Calculate count for each blood group
  const groupCounts = bloodGroups.reduce((acc, group) => {
    acc[group] = allDonors.filter(d => d.bloodGroup === group && d.isVerified !== false).length;
    return acc;
  }, {} as Record<string, number>);

  // Filtered donors list
  const filteredDonors = allDonors.filter(donor => {
    if (donor.isVerified === false) return false;
    
    // Filter by group
    if (selectedGroup && donor.bloodGroup !== selectedGroup) return false;

    // Filter by search text (name or location)
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = donor.name.toLowerCase().includes(q);
      const matchLoc = donor.location.toLowerCase().includes(q);
      const matchGroup = donor.bloodGroup.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchGroup) return false;
    }

    return true;
  });

  // Bangla numbers helper
  const toBanglaNum = (num: number): string => {
    const numbers: { [key: string]: string } = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return String(num).split('').map(digit => numbers[digit] || digit).join('');
  };

  return (
    <div 
      id="highlighted-donors-container"
      className="w-full relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl p-6 md:p-8 space-y-6 shadow-[0_8px_32px_rgba(239,68,68,0.03)]"
    >
      {/* Apple-style minimalist clean glowing line */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-red-600/20" />
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-red-100/30 pb-5">
        
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-sans text-[10px] font-black tracking-widest text-red-600 uppercase bg-red-50/50 border border-red-200/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-red-600" />
              আমাদের গর্ব / Highlighted Donors
            </span>
          </div>
          
          <h2 className="font-sans text-xl md:text-2xl font-black text-red-600 leading-tight">
            রক্তিম রক্তদাতা প্যানেল
          </h2>
          <p className="font-sans text-xs text-stone-500 font-medium">
            তাহেরপুর ও সংলগ্ন অঞ্চলের জীবনদানকারী স্বেচ্ছাসেবী রক্তদাতাদের লাইভ প্রোফাইল ও গ্রুপ তালিকা।
          </p>
        </div>

        {/* Dynamic Glass Count display */}
        <div className="flex items-center gap-3 bg-red-50/70 border border-red-200/50 text-red-600 rounded-2xl px-4 py-2.5 select-none shrink-0 w-full sm:w-auto">
          <div className="p-1.5 bg-red-100/60 rounded-xl">
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-left">
            <span className="block text-[9px] text-red-700/80 font-bold uppercase tracking-wider leading-none">মোট রক্তদাতা</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-black font-sans leading-none">
                {toBanglaNum(totalDonorsCount)}
              </span>
              <span className="text-[10px] font-sans text-red-600/80 font-bold">জন বীর</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Blood Group Filters - Single Brand Color Style */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-red-600 uppercase tracking-widest font-sans flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            গ্রুপ ভিত্তিক সক্রিয় রক্তদাতা সংখ্যা:
          </label>
          {selectedGroup && (
            <button 
              onClick={() => setSelectedGroup(null)} 
              className="text-[10px] font-sans font-black text-red-600 hover:text-red-700 underline cursor-pointer"
            >
              ফিল্টার মুছুন
            </button>
          )}
        </div>

        {/* Clean Apple-style unified button row */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2">
          
          {/* Total Filter Button */}
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-3 py-2 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-center items-center h-14 ${
              selectedGroup === null
                ? 'bg-red-600 text-white border-red-700 shadow-sm'
                : 'bg-white/40 hover:bg-white/80 text-stone-700 border-red-100/80'
            }`}
          >
            <span className="font-sans text-[10px] font-black block tracking-wide opacity-90">সব গ্রুপ</span>
            <span className="text-xs font-black font-sans mt-0.5 leading-none">
              {toBanglaNum(totalDonorsCount)} জন
            </span>
          </button>

          {/* Clean Unified Brand Style Groups */}
          {bloodGroups.map((group) => {
            const count = groupCounts[group] || 0;
            const isSelected = selectedGroup === group;

            return (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-2 py-2 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col justify-center items-center h-14 ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-700 shadow-sm'
                    : 'bg-white/40 hover:bg-white/80 text-stone-700 border-red-100/80'
                }`}
              >
                <span className={`font-sans text-xs font-black block ${isSelected ? 'text-white' : 'text-red-600'}`}>
                  {group}
                </span>
                <span className={`text-[10px] font-bold mt-0.5 leading-none ${isSelected ? 'text-red-100' : 'text-stone-500'}`}>
                  {toBanglaNum(count)} জন
                </span>
              </button>
            );
          })}

        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 w-4 h-4" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="নির্দিষ্ট বীর রক্তদাতার নাম অথবা এলাকা লিখে খুঁজুন... (উদাঃ মেহদী, বাগমারা)"
          className="w-full pl-11 pr-4 py-2.5 bg-white/40 border border-red-100/50 rounded-xl font-sans text-xs md:text-sm outline-none focus:border-red-500 focus:bg-white/80 transition-all shadow-inner placeholder-stone-400"
        />
      </div>

      {/* 3. Grid of Highlighted Donors */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-7 h-7 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-xs text-stone-500 font-medium">লোডিং ডাটা...</p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="bg-white/30 border border-red-100/30 rounded-2xl p-8 text-center max-w-sm mx-auto space-y-2 backdrop-blur-md">
          <Info className="w-7 h-7 text-red-400 mx-auto" />
          <h4 className="font-sans text-xs font-bold text-stone-800">কোনো রক্তদাতার বিবরণ মেলেনি!</h4>
          <p className="font-sans text-[11px] text-stone-400 leading-relaxed">
            দুঃখিত, বর্তমানে এই ফিল্টারে কোনো হাইলাইটেড রক্তদাতা খুঁজে পাওয়া যায়নি।
          </p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1"
        >
          <AnimatePresence mode="popLayout">
            {filteredDonors.map((donor) => {
              return (
                <motion.div
                  layout
                  key={donor.id}
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col justify-between h-[172px] rounded-2xl border border-white/40 bg-white/45 p-4 backdrop-blur-md hover:shadow-lg hover:border-red-200 hover:-translate-y-0.5 transition-all duration-300 text-left"
                >
                  {/* Status Indicator inside Card */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-xs font-sans ${
                      donor.isAvailable 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                        : 'bg-stone-50 text-stone-500 border border-stone-200/50'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${donor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                      {donor.isAvailable ? 'প্রস্তুত' : 'সক্রিয়'}
                    </span>
                  </div>

                  <div className="flex gap-3.5 items-start">
                    
                    {/* Handcrafted Stylized Muslim Avatar Icon (Unified Red Brand Theme) */}
                    <div className="relative shrink-0 text-red-600">
                      <MuslimAvatarIcon className="w-13 h-13" />
                      
                      {/* Integrated Blood Group Tag */}
                      <span className="absolute -bottom-1 -right-1 bg-red-600 text-white font-sans text-[10px] font-black px-1.5 py-0.5 rounded-md border border-white shadow-xs scale-90">
                        {donor.bloodGroup}
                      </span>
                    </div>

                    {/* Basic details with Single Brand Color (Red for Highlight / Accent) */}
                    <div className="space-y-1.5 text-left min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="font-sans text-xs sm:text-sm font-extrabold text-red-600 truncate leading-none" title={donor.name}>
                          {donor.name}
                        </h4>
                        {donor.isVerified !== false && (
                          <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        )}
                      </div>

                      {/* Location details */}
                      <p className="font-sans text-[11px] text-stone-500 flex items-center gap-1.5 leading-none">
                        <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                        <span className="truncate font-semibold">{donor.location}</span>
                      </p>

                      {/* Last donation details (rendered always for perfect container alignment) */}
                      <p className="font-sans text-[10px] text-stone-400">
                        সর্বশেষ রক্তদান: <span className="font-english font-bold text-stone-500">{donor.lastDonatedDate || 'কখনো নয়'}</span>
                      </p>
                    </div>

                  </div>

                  {/* Actions row */}
                  <div className="flex items-center justify-between border-t border-red-100/30 pt-3">
                    <span className="font-sans text-[10px] text-stone-500 font-bold">
                      {donor.gender || 'পুরুষ'} • {donor.age ? `${toBanglaNum(donor.age)} বছর` : 'স্বেচ্ছাসেবী'}
                    </span>

                    {/* Clean unified Dial direct action */}
                    <a 
                      href={`tel:${donor.phone}`}
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-sans font-black px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
                    >
                      <Phone className="w-2.5 h-2.5 text-white animate-bounce" />
                      <span>কল করুন</span>
                    </a>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Soft Apple visual brand decoration */}
      <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-red-100/20 rounded-full blur-3xl pointer-events-none select-none" />
    </div>
  );
}
