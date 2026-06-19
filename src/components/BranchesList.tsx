import React from 'react';
import { Hospital, MapPin, Phone, Building2, ShieldCheck, HeartHandshake, Heart, Settings } from 'lucide-react';

interface Branch {
  nameBn: string;
  nameEn: string;
  locationBn: string;
  locationEn: string;
  phone: string;
  activeHours: string;
  type: string;
}

interface BranchesListProps {
  onOpenAdmin?: () => void;
}

export default function BranchesList({ onOpenAdmin }: BranchesListProps) {
  const branches: Branch[] = [
    {
      nameBn: 'রয়্যাল আল্ট্রাসাউন্ড এন্ড হাসপাতাল',
      nameEn: 'Royal Ultrasound and Hospital',
      locationBn: 'খন্দকার মসজিদের বিপরীতে, তাহেরপুর বাজার',
      locationEn: 'Opposite Khandakar Mosque, Taherpur Bazar',
      phone: '+৮৮০ ১৭৫৩-১১২২৩৪',
      activeHours: '২৪ ঘণ্টা (24/7 Hot)',
      type: 'হাসপাতাল পার্টনার'
    },
    {
      nameBn: 'ফোর স্টার ক্লিনিক',
      nameEn: 'Four Star Clinic',
      locationBn: 'দুর্গাপুর রোড, চৌকিপাড়া, তাহেরপুর',
      locationEn: 'Durgapur Road, Chokipara, Taherpur',
      phone: '+৮৮০ ১৭৬৫-৪৪৫৫৬৬',
      activeHours: 'সকাল ৮:০০ - রাত ১০:০০',
      type: 'ক্লিনিক্যাল ল্যাব পার্টনার'
    },
    {
      nameBn: 'স্পন্দন ক্লিনিক এন্ড ডায়াগনস্টিক',
      nameEn: 'Spandan Clinic and Diagnostics',
      locationBn: 'পুলিশ ফাঁড়ির পাশে, তাহেরপুর বাজার, তাহেরপুর পৌরসভা',
      locationEn: 'Beside Police Phari, Taherpur Bazar, Taherpur Pourashova',
      phone: '+৮৮০ ১৭২৭-৮৮৯৯০০',
      activeHours: 'সকাল ৭:০০ - রাত ১১:০০',
      type: 'টেস্টিং & ল্যাব পার্টনার'
    },
    {
      nameBn: 'এস. এইচ. হাসপাতাল',
      nameEn: 'SH Hospital',
      locationBn: 'তাহেরপুর ফিলিং স্টেশনের পাশে, কুঠিয়ার রোড',
      locationEn: 'Beside Taherpur Filling Station, Kuthiar Road',
      phone: '+৮৮০ ১৩০০-১১২২৩৪',
      activeHours: '২৪ ঘণ্টা জরুরী সেবা (24/7)',
      type: 'জরুরী কেয়ার পার্টনার'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 space-y-8 border-t border-red-100/50 relative">
      
      {/* Centered Admin Gateway (Prominent Settings / Love Icon) */}
      <div className="flex flex-col items-center justify-center gap-1.5 -mb-6 relative z-10">
        <button
          type="button"
          onClick={onOpenAdmin}
          className="relative w-14 h-14 bg-white hover:bg-rose-50 text-red-600 rounded-full border border-red-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center hover:scale-110 active:scale-95 group/admin select-none"
          title="🛡️ অ্যাডমিন ড্যাশবোর্ড সেটিংস ও লগইন"
        >
          {/* Subtle spinning outer settings accent */}
          <Settings className="w-5 h-5 absolute text-red-400/40 animate-spin group-hover/admin:text-red-500/80 duration-[12s]" />
          {/* Breathing Love icon */}
          <Heart className="w-6 h-6 fill-red-600 text-red-600 stroke-[1.5] relative z-10 animate-pulse" />
          
          <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 border border-white shadow-sm flex items-center justify-center">
            <Settings className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </button>
        <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">অ্যাডমিন সেটিংস ও লগইন</span>
      </div>

      {/* Branches Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 font-sans text-xs font-bold px-3.5 py-1 rounded-full border border-red-100 uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          রক্তিম রক্তব্যাংক অনুমোদিত শাখা (Rotim Blood Bank Approved Branches)
        </div>
        <h3 className="font-sans text-2xl sm:text-3xl font-black text-gray-950 leading-tight">
          আমাদের অফিসিয়াল শাখা ও সহযোগী চিকিৎসাকেন্দ্রসমূহ
        </h3>
        <p className="font-sans text-xs sm:text-sm text-gray-500 leading-relaxed">
          নিম্নে উল্লেখিত হাসপাতাল ও ক্লিনিকগুলোতে রক্তিম ব্লাড ব্যাংকের সরাসরি বুথ রয়েছে। আপনারা এই নিকটস্থ শাখাগুলোতে সরাসরি রক্তদান করতে ও জরুরি রক্তের রিকুয়েস্ট নিতে পারবেন।
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {branches.map((branch, i) => (
          <div 
            key={i} 
            className="glass-card rounded-3xl p-6 border border-white/60 shadow-md hover:shadow-xl transition-all relative overflow-hidden group hover:-translate-y-1 duration-300"
          >
            
            {/* Top Indicator */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner shrink-0">
                  <Hospital className="w-5.5 h-5.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-red-600 font-sans tracking-wide uppercase bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-full">
                    {branch.type}
                  </span>
                  <h4 className="font-sans text-base sm:text-lg font-black text-gray-900 mt-1.5 leading-none">
                    {branch.nameBn}
                  </h4>
                  <p className="font-english text-[11px] font-bold text-gray-400 mt-1">
                    {branch.nameEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Info details body */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100/80 pt-4.5 mt-4.5 text-left text-xs font-sans">
              <div className="space-y-1">
                <span className="text-gray-400 block text-[10px] select-none">📍 ঠিকানা / Location:</span>
                <span className="font-semibold text-gray-700 block leading-tight">{branch.locationBn}</span>
                <span className="font-english text-[10px] text-gray-400 font-bold block">{branch.locationEn}</span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-400 block text-[10px] select-none">📞 হটলাইন / Hotline:</span>
                <a 
                  href={`tel:${branch.phone.replace(/[^0-9+]/g, '')}`} 
                  className="font-bold text-red-600 hover:underline block text-sm font-english"
                >
                  {branch.phone}
                </a>
                <span className="text-emerald-600 font-semibold text-[10px] flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> {branch.activeHours}
                </span>
              </div>
            </div>

            {/* Faint watermark bg */}
            <Building2 className="absolute right-3 bottom-3 w-16 h-16 text-red-500/5 group-hover:scale-110 transition-transform pointer-events-none" />

          </div>
        ))}
      </div>

    </div>
  );
}
