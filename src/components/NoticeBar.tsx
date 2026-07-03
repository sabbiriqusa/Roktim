import React from 'react';
import { Volume2 } from 'lucide-react';

export default function NoticeBar() {
  const googleFormUrl = "https://forms.gle/L4udP8fpYshcCAr27";

  return (
    <div className="w-full bg-red-600 text-white py-2 px-4 shadow-[0_4px_16px_rgba(239,68,68,0.15)] flex items-center overflow-hidden h-11 border-y border-red-500/30 relative z-20">
      {/* Notice Tag label */}
      <div className="flex items-center gap-2 bg-red-700/80 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-red-500/20 mr-4 shrink-0 shadow-sm z-30 select-none">
        <Volume2 className="w-3.5 h-3.5 animate-bounce text-yellow-300" />
        <span className="font-sans hidden sm:inline">ঘোষণা / Announcements</span>
        <span className="font-sans inline sm:hidden">ঘোষণা</span>
      </div>
      
      {/* Seamless Infinite Loop Marquee Container */}
      <div className="seamless-marquee-container w-full relative flex items-center">
        <div className="seamless-marquee-track">
          
          {/* Segment 1 */}
          <div className="flex items-center gap-12 font-sans font-medium text-sm text-red-50 pr-12">
            {/* Introduction */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-800 text-yellow-300 font-bold px-2.5 py-0.5 rounded-full text-[11px]">মূল লক্ষ্য</span>
              <span>রক্তের অভাবে ঝরবে না আর একটিও প্রাণ! তাহেরপুর ও এর আশেপাশের এলাকার মানুষের সেবায় রাজশাহী কলেজের শিক্ষার্থী সাকিবুল ইসলাম সাব্বিরের উদ্যোগে পথ চলা শুরু করলো <strong>‘রক্তিম ব্লাড ব্যাংক’</strong>। আমাদের সাথে স্বেচ্ছাসেবী হিসেবে যুক্ত হতে, ডোনার হিসেবে নাম লেখাতে কিংবা আপনার ক্লিনিক/ডায়াগনস্টিকের বিজ্ঞাপন দিতে আজই যোগাযোগ করুন।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Title */}
            <span className="flex items-center gap-2 font-bold text-white shrink-0">
              <span>🩸 তাহেরপুর ‘রক্তিম ব্লাড ব্যাংক’ (Roktim Blood Bank, Taherpur) 🩸</span>
              <span className="text-red-100 font-medium">— নিরাপদ রক্ত সঞ্চালনে, আমরা আছি আপনার পাশে।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Inspiration */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-yellow-400 text-red-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shrink-0">🌟 উদ্যোগ ও অনুপ্রেরণা</span>
              <span>তাহেরপুর পৌরসভা এবং এর আশেপাশের এলাকার রক্তের জরুরি প্রয়োজন মেটাতে রাজশাহী কলেজের শিক্ষার্থী সাকিবুল ইসলাম সাব্বিরের উদ্যোগে গড়ে উঠেছে এই সংগঠন। দলমত নির্বিশেষে আমাদের সকলের উচিত এই মানবিক প্ল্যাটফর্মটিকে নিজ নিজ জায়গা থেকে সর্বোচ্চ সহযোগিতা করা।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Mission */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-850 text-red-100 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">🎯 মিশন ও ভিশন</span>
              <span><strong>"রক্তদান হোক সামাজিক আন্দোলন, সুস্থ থাকুক প্রতিটি জীবন।"</strong> রক্তের জরুরি প্রয়োজনে যেন কোনো মানুষকে অসহায় বোধ করতে না হয়, সেই লক্ষ্য নিয়েই আমাদের এই পথচলা।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Ads */}
            <span className="flex items-center gap-2.5 shrink-0">
              <span className="bg-white text-red-700 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">🤝 বিজ্ঞাপন দিন</span>
              <span>ক্লিনিক ও ডায়াগনস্টিক সেন্টারের প্রচার বাড়াতে আমাদের ওয়েবসাইটে বিজ্ঞাপন দিন। বুকিং ও যোগাযোগের জন্য সরাসরি কল করুন:</span>
              <a 
                href="tel:+8801712456789" 
                className="bg-yellow-300 hover:bg-white text-red-900 font-bold px-2.5 py-0.5 rounded-lg transition duration-200 border border-yellow-400/30 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                📞 +৮৮০ ১৭১২-৪৫৬৭৮৯
              </a>
            </span>

            <span className="text-white/40">★</span>

            {/* Volunteer Needed */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-900 text-yellow-300 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">📢 স্বেচ্ছাসেবী প্রয়োজন</span>
              <span>আমাদের টিমে সোশ্যাল মিডিয়া এক্সিকিউটিভ, ফেসবুক পেজ মডারেটর, ব্লাড ম্যানেজমেন্ট গ্লাস কানেক্টর, কলেজ/ভিলেজ/পৌরসভা/উপজেলা/ক্লিনিক/অ্যাডভার্টাইজমেন্ট রিপ্রেজেন্টিটিভ প্রয়োজন।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Quotes */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-800 text-red-50 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">❤️ বাণী</span>
              <span className="italic">"আপনার রক্তে বেঁচে উঠুক আরেকটি প্রাণ, এর চেয়ে বড় আর কী হতে পারে দান?" • "এক ব্যাগ রক্ত, একটি জীবন—আপনার সামান্য ত্যাগেই মিলবে কারো মুখের হাসি।" • "রক্ত দিলে হয় না ক্ষতি, জাগ্রত হোক মানবিক অনুভূতি।"</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Register Links */}
            <span className="flex items-center gap-3 shrink-0">
              <span className="bg-yellow-400 text-red-950 font-black px-3 py-0.5 rounded-full text-[11px] shrink-0">📝 আজই রেজিস্ট্রেশন করুন</span>
              <a 
                href={googleFormUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-white hover:bg-yellow-300 text-red-700 font-bold px-3 py-1 rounded-xl text-xs transition duration-200 flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
              >
                👉 রক্তদাতা (Donor) হিসেবে যুক্ত হতে ক্লিক করুন
              </a>
              <a 
                href={googleFormUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-red-900 hover:bg-yellow-300 text-white hover:text-red-950 font-bold px-3 py-1 rounded-xl text-xs transition duration-200 flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
              >
                👉 স্বেচ্ছাসেবী (Volunteer) হিসেবে যুক্ত হতে ক্লিক করুন
              </a>
            </span>

            <span className="text-white/40">★</span>

            {/* Contact Msg */}
            <span className="flex items-center gap-2 shrink-0">
              <span>যেকোনো তথ্যের জন্য আমাদের ফেসবুক পেজে মেসেজ করুন অথবা সরাসরি যোগাযোগ করুন। ধন্যবাদ!</span>
            </span>
          </div>

          {/* Segment 2 (Duplicate for seamless infinite marquee loop) */}
          <div className="flex items-center gap-12 font-sans font-medium text-sm text-red-50 pr-12">
            {/* Introduction */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-800 text-yellow-300 font-bold px-2.5 py-0.5 rounded-full text-[11px]">মূল লক্ষ্য</span>
              <span>রক্তের অভাবে ঝরবে না আর একটিও প্রাণ! তাহেরপুর ও এর আশেপাশের এলাকার মানুষের সেবায় রাজশাহী কলেজের শিক্ষার্থী সাকিবুল ইসলাম সাব্বিরের উদ্যোগে পথ চলা শুরু করলো <strong>‘রক্তিম ব্লাড ব্যাংক’</strong>। আমাদের সাথে স্বেচ্ছাসেবী হিসেবে যুক্ত হতে, ডোনার হিসেবে নাম লেখাতে কিংবা আপনার ক্লিনিক/ডায়াগনস্টিকের বিজ্ঞাপন দিতে আজই যোগাযোগ করুন।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Title */}
            <span className="flex items-center gap-2 font-bold text-white shrink-0">
              <span>🩸 তাহেরপুর ‘রক্তিম ব্লাড ব্যাংক’ (Roktim Blood Bank, Taherpur) 🩸</span>
              <span className="text-red-100 font-medium">— নিরাপদ রক্ত সঞ্চালনে, আমরা আছি আপনার পাশে।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Inspiration */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-yellow-400 text-red-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shrink-0">🌟 উদ্যোগ ও অনুপ্রেরণা</span>
              <span>তাহেরপুর পৌরসভা এবং এর আশেপাশের এলাকার রক্তের জরুরি প্রয়োজন মেটাতে রাজশাহী কলেজের শিক্ষার্থী সাকিবুল ইসলাম সাব্বিরের উদ্যোগে গড়ে উঠেছে এই সংগঠন। দলমত নির্বিশেষে আমাদের সকলের উচিত এই মানবিক প্ল্যাটফর্মটিকে নিজ নিজ জায়গা থেকে সর্বোচ্চ সহযোগিতা করা।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Mission */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-850 text-red-100 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">🎯 মিশন ও ভিশন</span>
              <span><strong>"রক্তদান হোক সামাজিক আন্দোলন, সুস্থ থাকুক প্রতিটি জীবন।"</strong> রক্তের জরুরি প্রয়োজনে যেন কোনো মানুষকে অসহায় বোধ করতে না হয়, সেই লক্ষ্য নিয়েই আমাদের এই পথচলা।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Ads */}
            <span className="flex items-center gap-2.5 shrink-0">
              <span className="bg-white text-red-700 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">🤝 বিজ্ঞাপন দিন</span>
              <span>ক্লিনিক ও ডায়াগনস্টিক সেন্টারের প্রচার বাড়াতে আমাদের ওয়েবসাইটে বিজ্ঞাপন দিন। বুকিং ও যোগাযোগের জন্য সরাসরি কল করুন:</span>
              <a 
                href="tel:+8801712456789" 
                className="bg-yellow-300 hover:bg-white text-red-900 font-bold px-2.5 py-0.5 rounded-lg transition duration-200 border border-yellow-400/30 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                📞 +৮৮০ ১৭১২-৪৫৬৭৮৯
              </a>
            </span>

            <span className="text-white/40">★</span>

            {/* Volunteer Needed */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-900 text-yellow-300 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">📢 স্বেচ্ছাসেবী প্রয়োজন</span>
              <span>আমাদের টিমে সোশ্যাল মিডিয়া এক্সিকিউটিভ, ফেসবুক পেজ মডারেটর, ব্লাড ম্যানেজমেন্ট গ্লাস কানেক্টর, college/village/পৌরসভা/উপজেলা/ক্লিনিক/অ্যাডভার্টাইজমেন্ট রিপ্রেজেন্টিটিভ প্রয়োজন।</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Quotes */}
            <span className="flex items-center gap-2 shrink-0">
              <span className="bg-red-800 text-red-50 font-bold px-2.5 py-0.5 rounded-full text-[11px] shrink-0">❤️ বাণী</span>
              <span className="italic">"আপনার রক্তে বেঁচে উঠুক আরেকটি প্রাণ, এর চেয়ে বড় আর কী হতে পারে দান?" • "এক ব্যাগ রক্ত, একটি জীবন—আপনার সামান্য ত্যাগেই মিলবে কারো মুখের হাসি।" • "রক্ত দিলে হয় না ক্ষতি, জাগ্রত হোক মানবিক অনুভূতি।"</span>
            </span>

            <span className="text-white/40">★</span>

            {/* Register Links */}
            <span className="flex items-center gap-3 shrink-0">
              <span className="bg-yellow-400 text-red-950 font-black px-3 py-0.5 rounded-full text-[11px] shrink-0">📝 আজই রেজিস্ট্রেশন করুন</span>
              <a 
                href={googleFormUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-white hover:bg-yellow-300 text-red-700 font-bold px-3 py-1 rounded-xl text-xs transition duration-200 flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
              >
                👉 রক্তদাতা (Donor) হিসেবে যুক্ত হতে ক্লিক করুন
              </a>
              <a 
                href={googleFormUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-red-900 hover:bg-yellow-300 text-white hover:text-red-950 font-bold px-3 py-1 rounded-xl text-xs transition duration-200 flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
              >
                👉 স্বেচ্ছাসেবী (Volunteer) হিসেবে যুক্ত হতে ক্লিক করুন
              </a>
            </span>

            <span className="text-white/40">★</span>

            {/* Contact Msg */}
            <span className="flex items-center gap-2 shrink-0">
              <span>যেকোনো তথ্যের জন্য আমাদের ফেসবুক পেজে মেসেজ করুন অথবা সরাসরি যোগাযোগ করুন। ধন্যবাদ!</span>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
