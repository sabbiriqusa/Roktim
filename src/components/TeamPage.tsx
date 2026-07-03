import React from 'react';
import { motion } from 'motion/react';
import { Heart, Mail, Phone, ShieldCheck, Github, Linkedin, Facebook, Award, Star, Globe, MessageCircle } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: 'নাজিম উদ্দিন সামি',
      role: 'প্রধান সমন্বয়ক',
      roleEn: 'Coordinator - Admin',
      phone: '+8801700000000',
      email: 'sami@roktim.org',
      fb: '#',
      responsibilities: ['রক্তদাতা ক্যাম্পেইন পরিচালনা', 'জরুরি রক্তের চাহিদা সমন্বয়', 'স্বেচ্ছাসেবী দল গঠন ও তদারকি'],
      image: 'https://www.image2url.com/r2/default/images/1783079152840-4383f39c-59b6-4664-bfdf-bfc958636498.jpg'
    },
    {
      name: 'মোঃ তানজিমুল বারী',
      role: 'প্রযুক্তি ও টেকনিক্যাল লিড',
      roleEn: 'Technical Lead & Developer',
      phone: '+8801787654321',
      email: 'tanjim@roktim.org',
      fb: '#',
      responsibilities: ['ডিজিটাল প্ল্যাটফর্ম উন্নয়ন ও নিরাপত্তা', 'ডেটাবেস ব্যাকআপ ও হোস্টিং রক্ষণাবেক্ষণ', 'টেকনিক্যাল সাপোর্ট প্রদান'],
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200'
    },
    {
      name: 'ডা. ফাহিম মুনতাসির',
      role: 'চিকিৎসা উপদেষ্টা',
      roleEn: 'Medical Advisor',
      phone: '+8801700011122',
      email: 'fahim@roktim.org',
      fb: '#',
      responsibilities: ['রক্তদানের স্বাস্থ্যগত দিক পর্যালোচনা', 'উপদেষ্টা প্যানেল পরিচালনা', 'অনলাইন রক্তদান সচেতনতা সেশন'],
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
    }
  ];

  return (
    <div 
      id="team-page-container" 
      className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-in fade-in duration-300"
    >
      {/* 1. Header Section */}
      <div className="text-center space-y-2">
        <span className="font-sans text-[10px] font-black tracking-widest text-red-600 uppercase bg-red-50 border border-red-200/50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs">
          <Award className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          রক্তিম পরিবার / The Leadership
        </span>
        <h2 className="font-sans text-2xl md:text-3xl font-black text-gray-950 leading-tight">
          আমাদের স্বপ্নদর্শী ও কর্মীবৃন্দ
        </h2>
        <p className="font-sans text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          তাহেরপুর ও বাগমারা অঞ্চলে রক্তদানকে সম্পূর্ণ সহজ ও ডিজিটালাইজড করার পেছনে নিয়োজিত আমাদের টিম।
        </p>
      </div>

      {/* 2. CEO & Founder Spotlight Section (Large Profile Card) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border border-red-200 bg-white shadow-[0_16px_48px_rgba(239,68,68,0.08)] p-6 md:p-8"
      >
        {/* Decorative ambient badge glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 right-4 z-10">
          <motion.span 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-sans text-[10.5px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md"
          >
            <Star className="w-3.5 h-3.5 fill-white" />
            প্রতিষ্ঠাতা ও সিইও
          </motion.span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 text-center md:text-left">
          
          {/* Main Photo Section */}
          <div className="relative group shrink-0">
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-red-100/80 shadow-xl relative bg-red-50"
            >
              <img 
                src="https://www.image2url.com/r2/default/images/1783078550203-b1b16648-13cb-4c40-88a9-09be09b42753.jpg" 
                alt="Sakibul Islam Sabbir" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            {/* Soft decorative glow ring */}
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 opacity-20 blur-md -z-10 group-hover:opacity-40 transition-opacity duration-300" />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h3 className="font-sans text-xl md:text-2.5xl font-black text-gray-900 flex items-center justify-center md:justify-start gap-1.5 leading-none">
                সাকিবুল ইসলাম সাব্বির
                <ShieldCheck className="w-5.5 h-5.5 text-red-600 shrink-0" />
              </h3>
              <p className="font-sans text-xs md:text-sm text-red-600 font-extrabold tracking-wider uppercase">
                Sakibul Islam Sabbir • Founder & CEO, Roktim
              </p>
            </div>

            <p className="font-sans text-xs md:text-sm text-stone-600 leading-relaxed font-semibold">
              "রক্তের অভাব যেন আর কোনো হাসিমুখ কেড়ে না নেয়—এই লক্ষ্যেই রক্তিম ব্লাড ব্যাংকের পথচলা। তাহেরপুর ও সমগ্র বাংলাদেশে রক্তদান ব্যবস্থাকে প্রযুক্তির সাহায্যে প্রতিটি মানুষের হাতের মুঠোয় পৌঁছে দিতে আমরা অঙ্গীকারবদ্ধ।"
            </p>

            {/* Quick Contacts Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-stone-500 font-sans text-xs">
              <a 
                href="tel:+8801700000000" 
                className="flex items-center justify-center md:justify-start gap-2.5 bg-red-50/40 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-xl border border-red-100/30 transition-colors"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span className="font-extrabold font-english">+৮৮০১৭০০-০০০০০০</span>
              </a>
              <a 
                href="mailto:sabbir.iqusa@gmail.com" 
                className="flex items-center justify-center md:justify-start gap-2.5 bg-red-50/40 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-xl border border-red-100/30 transition-colors"
              >
                <Mail className="w-4 h-4 text-red-600" />
                <span className="font-extrabold">sabbir.iqusa@gmail.com</span>
              </a>
            </div>

            {/* Comprehensive Social & Corporate Links Grid */}
            <div className="pt-2">
              <span className="text-[10px] font-sans font-black text-stone-400 uppercase tracking-widest block mb-2 text-center md:text-left">যোগাযোগ ও কর্পোরেট লিংক:</span>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                
                {/* Facebook Profile */}
                <a 
                  href="https://www.facebook.com/sakibulislamrc1" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-sans text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>ফেসবুক প্রোফাইল</span>
                </a>

                {/* Facebook Page */}
                <a 
                  href="https://www.facebook.com/Bismahsoftbd" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-sans text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>Bismahsoftbd পেজ</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/sakibulislamsbmc" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-sans text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-current" />
                  <span>লিঙ্কডইন</span>
                </a>

                {/* Linktree */}
                <a 
                  href="https://linktr.ee/sakibulislamrc" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-sans text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>লিঙ্কট্রি</span>
                </a>

                {/* Bismahsoftbd Corporate Website */}
                <a 
                  href="https://bismahsoftbd.vercel.app/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 px-3 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 rounded-xl font-sans text-[11px] font-black transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>বিসমাহসফট ওয়েবসাইট</span>
                </a>

              </div>
            </div>

          </div>

        </div>
      </motion.div>

      {/* 3. Team grid header */}
      <div className="border-b border-red-100/60 pb-2">
        <h4 className="font-sans text-sm font-black text-red-600 tracking-wider uppercase flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-600 animate-pulse fill-red-100" />
          সহযোগী প্যানেল ও দায়িত্বশীলগণ
        </h4>
      </div>

      {/* 4. Small Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-red-200 transition-all text-center md:text-left flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Photo & Role Header */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-red-100 bg-red-50/20 shrink-0">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-0.5 text-center md:text-left">
                  <h5 className="font-sans text-sm font-black text-gray-900 leading-tight">
                    {member.name}
                  </h5>
                  <p className="font-sans text-[10px] text-red-600 font-extrabold leading-none">
                    {member.role}
                  </p>
                  <p className="font-sans text-[9px] text-stone-400 font-bold leading-none">
                    {member.roleEn}
                  </p>
                </div>
              </div>

              {/* Responsibilities list */}
              <div className="space-y-1.5 pt-2 text-left">
                <span className="text-[9px] font-sans font-black text-stone-400 uppercase tracking-widest block">মূল দায়িত্বসমূহ:</span>
                <ul className="space-y-1 text-[11px] text-stone-600 font-sans list-disc list-inside">
                  {member.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="leading-snug truncate" title={resp}>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Small Contact buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100">
              <a 
                href={`tel:${member.phone}`}
                className="flex items-center justify-center gap-1.5 bg-stone-50 hover:bg-red-50 text-stone-700 hover:text-red-600 py-1.5 rounded-lg border border-stone-150 text-[10px] font-sans font-bold transition-all cursor-pointer"
              >
                <Phone className="w-3 h-3" />
                <span>কল করুন</span>
              </a>
              <a 
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-1.5 bg-stone-50 hover:bg-red-50 text-stone-700 hover:text-red-600 py-1.5 rounded-lg border border-stone-150 text-[10px] font-sans font-bold transition-all cursor-pointer"
              >
                <Mail className="w-3 h-3" />
                <span>মেইল</span>
              </a>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}
