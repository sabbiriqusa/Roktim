import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Target, 
  Eye, 
  CheckCircle, 
  Share2, 
  Facebook, 
  Twitter, 
  Youtube, 
  Linkedin, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

export default function AboutPage() {
  const coreValues = [
    {
      title: 'সম্পূর্ণ নিঃস্বার্থ সেবা',
      desc: 'রক্তিম প্ল্যাটফর্মের কোনো ফি বা চার্জ নেই। এটি শুধুমাত্র মানবতার কল্যাণে তৈরি একটি স্বেচ্ছাসেবী উদ্যোগ।',
      icon: Heart,
      color: 'text-red-600 bg-red-50'
    },
    {
      title: 'সর্বোচ্চ নিরাপত্তা ও ভেরিফিকেশন',
      desc: 'প্রতিটি রক্তদাতার তথ্য ও মোবাইল নম্বর ভেরিফাই করা হয় যাতে কোনো অপব্যবহার বা হয়রানি না ঘটে।',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'স্মার্ট ও সহজ সমন্বয়',
      desc: 'কোনো অতিরিক্ত থার্ড পার্টি অ্যাপ ছাড়া ব্রাউজার থেকেই ১ ক্লিকে সরাসরি রক্তদাতার সাথে যুক্ত হোন।',
      icon: Compass,
      color: 'text-blue-600 bg-blue-50'
    }
  ];

  return (
    <div 
      id="about-page-container" 
      className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-10 animate-in fade-in duration-300"
    >
      {/* 1. Header Banner */}
      <div className="text-center space-y-2">
        <span className="font-sans text-[10px] font-black tracking-widest text-red-600 uppercase bg-red-50 border border-red-200/50 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-red-600" />
          আমাদের ইতিহাস ও দর্শন / Our Story
        </span>
        <h2 className="font-sans text-2xl md:text-3xl font-black text-gray-950 leading-tight">
          রক্তিম ব্লাড ব্যাংক তাহেরপুর
        </h2>
        <p className="font-sans text-xs md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed">
          জরুরি মুহূর্তে ১ ব্যাগ রক্তের অভাবে যেন কোনো রোগীর জীবন বিপন্ন না হয়, সেই দায়বদ্ধতা থেকে গড়ে তোলা তাহেরপুর ও বাগমারা অঞ্চলের রক্তদাতাদের সমন্বয় নেটওয়ার্ক।
        </p>
      </div>

      {/* 2. Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission Card */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white to-red-50/20 border border-red-100 rounded-3xl p-6 space-y-3 shadow-xs text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-100/10 rounded-full blur-xl" />
          <div className="w-10 h-10 bg-red-100/60 text-red-600 rounded-2xl flex items-center justify-center">
            <Target className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="font-sans text-lg font-black text-gray-900">আমাদের লক্ষ্য (Our Mission)</h3>
          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
            তাহেরপুর বাজার, কলেজ মোড়, বাগমারা ও সংলগ্ন এলাকার হাজার হাজার সাধারণ মানুষ ও তরুণদের রক্তদানে উৎসাহিত করা এবং রক্তের খোঁজ সহজ করে মৃত্যুর হার কমানো।
          </p>
        </motion.div>

        {/* Vision Card */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-white to-emerald-50/10 border border-emerald-100 rounded-3xl p-6 space-y-3 shadow-xs text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/10 rounded-full blur-xl" />
          <div className="w-10 h-10 bg-emerald-100/60 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Eye className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-sans text-lg font-black text-gray-900">আমাদের ভিশন (Our Vision)</h3>
          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
            একটি ডিজিটাল প্রযুক্তি-বান্ধব সমাজ গড়ে তোলা যেখানে ১ ব্যাগ রক্তের জন্য কোনো রোগীকে ঘণ্টার পর ঘণ্টা অপেক্ষা করতে হবে না; রক্তদাতার খোঁজ হবে কেবল এক ক্লিকে ও কল-এ।
          </p>
        </motion.div>
      </div>

      {/* 3. Our Core Principles */}
      <div className="space-y-4">
        <div className="border-b border-stone-200/50 pb-2">
          <h4 className="font-sans text-sm font-black text-stone-700 tracking-wider uppercase flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-red-600 fill-red-50" />
            আমাদের মূল ভিত্তি ও আদর্শসমূহ
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-xs hover:border-red-200/50 transition-all text-left space-y-3"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${val.color} shrink-0 shadow-inner`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h5 className="font-sans text-sm font-black text-gray-900 leading-tight">
                  {val.title}
                </h5>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Timeline / Historical Background */}
      <div className="bg-red-50/40 border border-red-100/50 rounded-3xl p-6 space-y-4 text-left">
        <h4 className="font-sans text-base font-black text-red-600 flex items-center gap-1.5 leading-none">
          <Sparkles className="w-4 h-4 animate-pulse" />
          আমাদের সংক্ষিপ্ত জয়যাত্রা
        </h4>
        <div className="space-y-4 font-sans text-xs text-stone-600 leading-relaxed font-medium">
          <p>
            রক্তিম ব্লাড ব্যাংকের যাত্রা শুরু হয়েছিল তাহেরপুর অঞ্চলের কয়েকজন উদ্যোমী তরুণের হাত ধরে। শুরুতে রক্তের গ্রুপ বের করা ও কাগজে লিখে তালিকা তৈরি করার কাজটি ধীরে ধীরে গতি পায়। সময়ের আবর্তে আমরা উপলব্ধি করি যে, সঠিক সময় সঠিক রক্তদাতাকে ফোন কলেই দ্রুত পাওয়া সম্ভব, যদি তাদের তথ্য সুরক্ষিত ও সুবিন্যস্ত থাকে।
          </p>
          <p>
            আজ আমরা সম্পূর্ণ ডাইনামিক ডেটাবেস সমৃদ্ধ লাইভ পোর্টাল তৈরি করেছি, যার মাধ্যমে তাহেরপুর, বাগমারা ও আশেপাশের মানুষ তাদের দাতা ও সেবা কার্ড দেখতে পারেন, রক্তের রিকোয়েস্ট পোস্ট করতে পারেন এবং সরাসরি মোবাইলে কল করতে পারেন।
          </p>
        </div>
      </div>

      {/* 5. Social Media Connections (Clean, Stylish touchtargets) */}
      <div className="space-y-4 text-center md:text-left">
        <div className="border-b border-stone-200/50 pb-2">
          <h4 className="font-sans text-sm font-black text-stone-700 tracking-wider uppercase flex items-center justify-center md:justify-start gap-1.5">
            <Share2 className="w-4 h-4 text-red-600 animate-pulse" />
            আমাদের সাথে যুক্ত হোন (Social Media & Networks)
          </h4>
        </div>

        <p className="font-sans text-xs text-stone-500 max-w-lg leading-relaxed">
          রক্তিম ব্লাড ব্যাংকের ফেসবুক গ্রুপ, পেজ এবং ইউটিউবে যোগ দিয়ে আমাদের নিয়মিত সচেতনতা মূলক ক্যাম্পেইনগুলোতে শরিক হোন।
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Facebook Link */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/60 p-3 rounded-2xl transition-all cursor-pointer text-blue-700 justify-center sm:justify-start"
          >
            <Facebook className="w-5 h-5 fill-current shrink-0" />
            <div className="text-left leading-none">
              <span className="block text-[10px] font-sans font-extrabold uppercase opacity-80">Facebook</span>
              <span className="text-[11px] font-bold font-sans mt-0.5 block">রক্তিম পেজ</span>
            </div>
          </a>

          {/* Twitter Link */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 bg-sky-50/50 hover:bg-sky-50 border border-sky-100/60 p-3 rounded-2xl transition-all cursor-pointer text-sky-600 justify-center sm:justify-start"
          >
            <Twitter className="w-5 h-5 fill-current shrink-0" />
            <div className="text-left leading-none">
              <span className="block text-[10px] font-sans font-extrabold uppercase opacity-80">Twitter</span>
              <span className="text-[11px] font-bold font-sans mt-0.5 block">@RoktimTaherpur</span>
            </div>
          </a>

          {/* Youtube Link */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 bg-red-50/70 hover:bg-red-50 border border-red-100/60 p-3 rounded-2xl transition-all cursor-pointer text-red-600 justify-center sm:justify-start"
          >
            <Youtube className="w-5 h-5 fill-current shrink-0" />
            <div className="text-left leading-none">
              <span className="block text-[10px] font-sans font-extrabold uppercase opacity-80">YouTube</span>
              <span className="text-[11px] font-bold font-sans mt-0.5 block">রক্তিম চ্যানেল</span>
            </div>
          </a>

          {/* Linkedin Link */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/60 p-3 rounded-2xl transition-all cursor-pointer text-indigo-700 justify-center sm:justify-start"
          >
            <Linkedin className="w-5 h-5 fill-current shrink-0" />
            <div className="text-left leading-none">
              <span className="block text-[10px] font-sans font-extrabold uppercase opacity-80">LinkedIn</span>
              <span className="text-[11px] font-bold font-sans mt-0.5 block">roktim-taherpur</span>
            </div>
          </a>
        </div>
      </div>

      {/* 6. Legal and Disclaimer Banner */}
      <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4 text-left">
        <p className="font-sans text-[10px] text-stone-400 leading-relaxed font-bold">
          ডিজাইন ও কপিরাইট © ২০২৬ রক্তিম ব্লাড ব্যাংক তাহেরপুর। এটি সম্পূর্ণ অলাভজনক প্ল্যাটফর্ম। রক্তের সন্ধান বা রক্তদানে কোনো প্রকার আর্থিক লেনদেন রক্তিম সমর্থন করে না এবং এ ব্যাপারে ব্যবহারকারীদের সতর্ক থাকতে বিনীত অনুরোধ জানানো হচ্ছে।
        </p>
      </div>

    </div>
  );
}
