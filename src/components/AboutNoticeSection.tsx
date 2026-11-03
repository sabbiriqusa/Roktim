import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Target, 
  Megaphone, 
  Users, 
  Quote, 
  ClipboardList, 
  ExternalLink, 
  Phone, 
  Award, 
  MapPin, 
  CheckCircle2, 
  Briefcase, 
  Building2 
} from 'lucide-react';

export default function AboutNoticeSection() {
  const volunteerRoles = [
    { title: 'সোশ্যাল মিডিয়া এক্সিকিউটিভ', eng: 'Social Media Executive', desc: 'অনলাইন কার্যক্রম ও প্রচারণার দায়িত্ব সামলানোর জন্য।' },
    { title: 'ফেসবুক পেজ মডারেটর', eng: 'Facebook Page Moderator', desc: 'পেজের মেসেজ ও কমেন্টের উত্তর দিয়ে রক্তপ্রার্থীদের সাহায্য করার জন্য।' },
    { title: 'ব্লাড ম্যানেজমেন্ট গ্লাস কানেক্টর', eng: 'Blood Management Glass Connector', desc: 'রক্তদাতা ও গ্রহীতার মধ্যে দ্রুত যোগাযোগ ও সমন্বয় বজায় রাখার জন্য।' },
    { title: 'কলেজ রিপ্রেজেন্টেটিভ', eng: 'College Representative', desc: 'বিভিন্ন কলেজের শিক্ষার্থীদের রক্তদানে উৎসাহিত ও সংগঠিত করার জন্য।' },
    { title: 'ভিলেজ রিপ্রেজেন্টেটিভ', eng: 'Village Representative', desc: 'গ্রামীণ পর্যায়ে রক্তদানের সচেতনতা তৈরি ও ডোনার খোঁজার জন্য।' },
    { title: 'পৌরসভা ও উপজেলা রিপ্রেজেন্টেটিভ', eng: 'Pourashava & Upazila Representative', desc: 'পৌরসভা ও উপজেলা পর্যায়ে আমাদের কার্যক্রমের নেতৃত্ব দেওয়ার জন্য।' },
    { title: 'ক্লিনিক রিপ্রেজেন্টেটিভ', eng: 'Clinic Representative', desc: 'ক্লিনিকে কর্মরত থেকে আমাদের প্রতিনিধি হিসেবে দ্রুত রক্তদানে সাহায্য করার জন্য।' },
    { title: 'অ্যাডভার্টাইজমেন্ট রিপ্রেজেন্টেটিভ', eng: 'Advertisement Representative', desc: 'সংগঠনের প্রচার-প্রচারণা এবং স্পন্সর ও বিজ্ঞাপন সংগ্রহে সাহায্য করার জন্য।' }
  ];

  const quotes = [
    "আপনার রক্তে বেঁচে উঠুক আরেকটি প্রাণ, এর চেয়ে বড় আর কী হতে পারে দান?",
    "এক ব্যাগ রক্ত, একটি জীবন—আপনার সামান্য ত্যাগেই মিলবে কারো মুখের হাসি।",
    "রক্ত দিলে হয় না ক্ষতি, জাগ্রত হোক মানবিক অনুভূতি।",
    "আসুন, রক্তদানের মতো মহৎ কাজে নিজেকে শামিল করি, সুস্থ ও সুন্দর সমাজ গড়ি।"
  ];

  const googleFormUrl = "https://forms.gle/L4udP8fpYshcCAr27";

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 space-y-12">
      
      {/* 1. Main Welcome Banner Board */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-red-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md border-2 border-white/40 bg-white/10 p-0.5">
              <img 
                src="/assets/aistudio/file_00000000015c821194aa85f9e857dff1_7ccd5a14.png" 
                alt="রক্তিম ব্লাড ব্যাংক লোগো" 
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-[11px] md:text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-white/15 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              <span>আমাদের লক্ষ্য ও উদ্যোগ / Our Initiative</span>
            </div>
          </div>

          <h2 className="font-sans text-3xl md:text-5xl font-black tracking-tight leading-tight">
            🩸 তাহেরপুর ‘রক্তিম ব্লাড ব্যাংক’ <br className="hidden sm:inline" />
            <span className="text-red-100 font-bold text-2xl md:text-3xl">(Roktim Blood Bank, Taherpur)</span>
          </h2>

          <p className="font-sans text-base md:text-lg text-red-50 font-medium italic border-l-4 border-white/60 pl-4">
            "নিরাপদ রক্ত সঞ্চালনে, আমরা আছি আপনার পাশে।"
          </p>

          <p className="font-sans text-sm md:text-base text-red-50/90 leading-relaxed max-w-3xl">
            <strong>রক্তের অভাবে ঝরবে না আর একটিও প্রাণ!</strong> তাহেরপুর ও এর আশেপাশের এলাকার মানুষের সেবায় রাজশাহী কলেজের শিক্ষার্থী সাকিবুল ইসলাম সাব্বিরের উদ্যোগে পথ চলা শুরু করলো ‘রক্তিম ব্লাড ব্যাংক’। আমাদের সাথে স্বেচ্ছাসেবী হিসেবে যুক্ত হতে, ডোনার হিসেবে নাম লেখাতে কিংবা আপনার ক্লিনিক/ডায়াগনস্টিকের বিজ্ঞাপন দিতে আজই যোগাযোগ করুন। বিস্তারিত নিচে দেখুন...
          </p>
        </div>
      </div>

      {/* 2. Inspiration, Mission & Vision (Bento Box Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Inspiration (Spans 2 cols on desktop) */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-[32px] border border-white/60 shadow-lg space-y-6 flex flex-col justify-between bg-white/80">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-xl md:text-2xl font-black text-gray-900">
                🌟 আমাদের পেছনের অনুপ্রেরণা ও উদ্যোগ
              </h3>
            </div>
            
            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              তাহেরপুর পৌরসভা এবং এর আশেপাশের এলাকার মানুষের জন্য রক্তের জরুরি প্রয়োজন মেটাতে সম্পূর্ণ মানবিক উদ্দেশ্যে গড়ে উঠেছে এই সংগঠন। এই মহৎ উদ্যোগের পেছনে রয়েছেন <strong>রাজশাহী কলেজের শিক্ষার্থী সাকিবুল ইসলাম সাব্বির</strong>। একজন তরুণ শিক্ষার্থী হয়েও জাতীয় বিশ্ববিদ্যালয়ের (National University) অধীনে পড়াশোনা করার পাশাপাশি সমাজের প্রতি দায়বদ্ধতা থেকে তিনি এই বিশাল ও কল্যাণকর উদ্যোগ হাতে নিয়েছেন।
            </p>

            <p className="font-sans text-sm text-gray-600 leading-relaxed">
              একটি পুরো পৌরসভা ও তার সংলগ্ন অঞ্চলের সাধারণ মানুষের জীবন বাঁচাতে এবং এই সেবাকে সকলের জন্য সহজলভ্য করতে এই ধরনের উদ্যোগ সত্যিই প্রশংসনীয় এবং অনুকরণীয়। তাই কোনো নির্দিষ্ট দল বা মতের গণ্ডিতে সীমাবদ্ধ না থেকে, <strong>দলমত নির্বিশেষে আমাদের সকলের উচিত এই মানবিক প্ল্যাটফর্মটিকে নিজ নিজ জায়গা থেকে সর্বোচ্চ সহযোগিতা করা</strong>। আপনার একটু সহযোগিতা এই প্রতিষ্ঠানটিকে আরও সামনের দিকে এগিয়ে নিয়ে যাবে এবং মানুষের কল্যাণে বড় ভূমিকা রাখবে।
            </p>
          </div>
          
          <div className="pt-4 border-t border-red-100/40 text-xs text-red-700/80 font-semibold flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>তাহেরপুর পৌরসভা, বাগমারা, রাজশাহী, বাংলাদেশ</span>
          </div>
        </div>

        {/* Right Side: Mission & Vision */}
        <div className="glass-card p-6 md:p-8 rounded-[32px] border border-white/60 shadow-lg space-y-6 bg-gradient-to-b from-white/90 to-red-50/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-inner">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-sans text-xl font-black text-gray-900">
              🎯 মিশন ও ভিশন (Mission & Vision)
            </h3>
          </div>

          <div className="bg-white/80 p-5 rounded-2xl border border-red-100/30 shadow-inner space-y-3">
            <p className="font-sans text-sm font-extrabold text-red-600 leading-snug">
              "রক্তদান হোক সামাজিক আন্দোলন, সুস্থ থাকুক প্রতিটি জীবন।"
            </p>
            <p className="font-sans text-xs text-gray-500 leading-relaxed">
              তাহেরপুর ও এর আশেপাশের এলাকায় রক্তের জরুরি প্রয়োজনে যেন কোনো মানুষকে অসহায় বোধ করতে না হয়, সেই লক্ষ্য নিয়েই আমাদের এই পথচলা।
            </p>
          </div>

          <p className="font-sans text-xs md:text-sm text-gray-600 leading-relaxed">
            আমরা চাই প্রতিটি মুমূর্ষু মানুষের কাছে সঠিক সময়ে নিরাপদ রক্ত পৌঁছে দিতে এবং তরুণ সমাজকে স্বেচ্ছায় রক্তদানে উদ্বুদ্ধ করতে। একটি সুস্থ, সচেতন এবং রক্তদাতাবান্ধব সমাজ গড়ে তোলাই ‘রক্তিম ব্লাড ব্যাংক’-এর মূল স্বপ্ন।
          </p>
        </div>

      </div>

      {/* 3. Volunteer Recruitment Section */}
      <div className="glass-card p-6 md:p-8 rounded-[32px] border border-white/60 shadow-lg space-y-6 bg-white/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-inner">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-xl md:text-2xl font-black text-gray-900">
                📢 স্বেচ্ছাসেবী প্রয়োজন: আমাদের টিমে যুক্ত হোন!
              </h3>
            </div>
            <p className="font-sans text-xs md:text-sm text-gray-500 max-w-3xl leading-relaxed">
              আমাদের সংগঠনটি নতুন উদ্যমে কাজ শুরু করেছে। তাহেরপুরের আনাচে-কানাচে আমাদের সেবা পৌঁছে দিতে আমাদের প্রয়োজন একঝাঁক প্রাণবন্ত ও মানবিক জনবল। আপনি যদি স্বেচ্ছায় কাজ করতে আগ্রহী হন, তবে যুক্ত হোন:
            </p>
          </div>
          
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold px-4 py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>ভলান্টিয়ার ফরম পূরণ করুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Roles list as Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {volunteerRoles.map((role, idx) => (
            <div 
              key={idx} 
              className="bg-white hover:bg-red-50/35 p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="font-sans text-sm font-extrabold text-gray-900 leading-tight">
                    {role.title}
                  </span>
                </div>
                <span className="block text-[10px] text-gray-400 font-mono font-bold tracking-wider">
                  {role.eng}
                </span>
                <p className="font-sans text-[11px] md:text-xs text-gray-500 leading-relaxed">
                  {role.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sponsorship Advertisement Booking & Quotes Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Ads Section */}
        <div className="glass-card p-6 md:p-8 rounded-[32px] border border-white/60 shadow-lg space-y-5 bg-gradient-to-br from-white to-rose-50/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-inner">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg md:text-xl font-black text-gray-900">
                🤝 আপনার ক্লিনিক ও ডায়াগনস্টিক সেন্টারের বিজ্ঞাপন দিন!
              </h3>
            </div>
            <p className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed">
              আপনি কি আপনার ক্লিনিক, হাসপাতাল কিংবা ডায়াগনস্টিক সেন্টারের প্রচার বাড়াতে চান? আমাদের ওয়েবসাইটের বিশেষ সেকশনে আপনার প্রতিষ্ঠানের বিজ্ঞাপন প্রদর্শন করতে পারেন। আপনার দেওয়া একটি বিজ্ঞাপন যেমন আপনার ব্যবসার প্রসার ঘটাবে, তেমনি আমাদের এই মানবিক সংগঠনটিকে এগিয়ে নিতে সাহায্য করবে।
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              📞 বিজ্ঞাপন বুকিং বা এ সংক্রান্ত যেকোনো যোগাযোগের জন্য সরাসরি কল করুন:
            </span>
            <a
              href="tel:+8801712456789"
              className="inline-flex items-center gap-2.5 bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-700 font-sans font-bold text-sm px-5 py-3 rounded-2xl transition-all shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>+৮৮০ ১৭১২-৪৫৬৭৮৯</span>
            </a>
          </div>
        </div>

        {/* Quotes Section */}
        <div className="glass-card p-6 md:p-8 rounded-[32px] border border-white/60 shadow-lg space-y-5 bg-gradient-to-tr from-white to-red-50/25 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 shadow-inner">
                <Quote className="w-5 h-5" />
              </div>
              <h3 className="font-sans text-lg md:text-xl font-black text-gray-900">
                ❤️ রক্তদান নিয়ে কিছু মানবিক বাণী (Inspirational Quotes)
              </h3>
            </div>

            <div className="space-y-3">
              {quotes.map((quote, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600 mt-1 shrink-0" />
                  <p className="font-sans text-xs md:text-sm text-gray-600 italic leading-relaxed">
                    "{quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider text-right">
            — রক্তিম ব্লাড ব্যাংক
          </span>
        </div>

      </div>

      {/* 5. Highlighted Action Links / Registration Call out */}
      <div className="relative overflow-hidden bg-white border border-red-100 shadow-xl rounded-[32px] p-6 md:p-10 text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border border-red-150 shadow-inner">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>আজই রেজিস্ট্রেশন করুন / Digital Registration Links</span>
          </div>
          <h3 className="font-sans text-xl md:text-2xl font-black text-gray-900">
            আসুন রক্তদানে নিজেকে শামিল করি, সুস্থ ও সুন্দর সমাজ গড়ি
          </h3>
          <p className="font-sans text-xs md:text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed">
            আমাদের সাথে যুক্ত হতে নিচের লিংকে ক্লিক করে আমাদের অফিশিয়াল গুগল রেজিস্ট্রেশন ফর্মটি পূরণ করুন:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          {/* Link 1: Blood Donor Register */}
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm px-6 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/35 transition-all transform hover:-translate-y-0.5 select-none"
          >
            <span>👉 রক্তদাতা (Donor) হিসেবে যুক্ত হতে এখানে ক্লিক করুন</span>
            <ExternalLink className="w-4 h-4 text-red-100" />
          </a>

          {/* Link 2: Volunteer Register */}
          <a
            href={googleFormUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-800 font-sans font-bold text-sm px-6 py-4 rounded-2xl border border-gray-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 select-none"
          >
            <span>👉 স্বেচ্ছাসেবী (Volunteer) হিসেবে যুক্ত হতে এখানে ক্লিক করুন</span>
            <ExternalLink className="w-4 h-4 text-red-600" />
          </a>
        </div>
      </div>

    </div>
  );
}
