import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Activity, Heart, Calendar } from 'lucide-react';
import banner1 from '../assets/images/banner_donate_life_1781900589166.jpg';
import banner2 from '../assets/images/banner_community_1781900606337.jpg';
import banner3 from '../assets/images/banner_taherpur_1781900623596.jpg';

export default function AnnouncementCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: banner1,
      tagBn: 'স্বেচ্ছাসেবা',
      tagEn: 'VOLUNTEERD',
      titleBn: 'রক্ত দিন, জীবন বাঁচান',
      titleEn: 'Donate Blood, Save Lives',
      descBn: 'আপনার মাত্র ১৫ মিনিটের দান একটি পরিবারের মুখে আজীবনের হাসি ফিরিয়ে দিতে পারে।',
      descEn: 'Your simple 15 minutes can bring a lifetime of happiness to an ailing family.',
      icon: <Heart className="w-5 h-5 text-red-500 fill-red-500" />
    },
    {
      image: banner2,
      tagBn: 'তাহেরপুর উদ্যোগ',
      tagEn: 'TAHERPUR INITIATIVE',
      titleBn: 'একত্রিত বন্ধন ও সহযোগিতা',
      titleEn: 'United for a Nobler Cause',
      descBn: 'পৌরসভার সর্ববৃহৎ রক্তদাতা নেটওয়ার্কে যোগ দিন। আমরা সর্বদা আপনার পাশে দাঁড়িয়েছি।',
      descEn: 'Join the largest blood donor network of Taherpur. We are always standing by you.',
      icon: <Activity className="w-5 h-5 text-red-500" />
    },
    {
      image: banner3,
      tagBn: 'সহজ রিকোয়েস্ট',
      tagEn: 'SMART SERVICES',
      titleBn: 'রক্তের খোঁজ মিলবে এক ক্লিকে',
      titleEn: 'Instant Blood Finder',
      descBn: 'জরুরী প্রয়োজনে রক্ত ক্রয়ের বা খোঁজার কোন ঝামেলা নেই। আমাদের মাধ্যমে বিনামূল্যে যোগাযোগ করুন।',
      descEn: 'No hassle of buying or searching during crisis. Find verified local donors free of charge.',
      icon: <Calendar className="w-5 h-5 text-red-500 animate-pulse" />
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl glass border border-white/40 h-[300px] md:h-[420px] group">
      
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-out ${
                isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              {/* Background Image with elegant overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/70 via-red-900/40 to-transparent z-10" />
              <img
                src={slide.image}
                alt={slide.titleEn}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />

              {/* Decorative slide details / texts */}
              <div className="absolute bottom-0 left-0 right-0 md:top-0 md:bottom-auto md:h-full flex flex-col justify-end md:justify-center p-6 md:p-12 z-20 text-white max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-red-600/90 text-[10px] md:text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full border border-red-400/20 w-fit mb-3 backdrop-blur-md shadow-sm">
                  {slide.icon}
                  <span>{slide.tagBn} / {slide.tagEn}</span>
                </div>
                
                <h2 className="font-sans text-2xl md:text-4xl font-extrabold tracking-tight drop-shadow-md leading-tight text-white mb-2">
                  {slide.titleBn}
                </h2>
                <h3 className="font-sans text-lg md:text-xl font-medium tracking-wide opacity-90 mb-3 drop-shadow-sm text-red-100 font-english">
                  {slide.titleEn}
                </h3>
                
                <p className="font-sans text-xs md:text-sm text-gray-100 leading-relaxed max-w-lg mb-2 opacity-85">
                  {slide.descBn}
                </p>
                <p className="font-sans text-[11px] md:text-xs text-red-50/70 leading-relaxed max-w-lg italic font-english">
                  {slide.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full glass hover:bg-white/90 text-red-600 flex items-center justify-center shadow-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100 border border-white/50 active:scale-95"
        aria-label="Previous Announcements"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full glass hover:bg-white/90 text-red-600 flex items-center justify-center shadow-lg cursor-pointer transition-all opacity-0 group-hover:opacity-100 border border-white/50 active:scale-95"
        aria-label="Next Announcements"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Navigation Indicators */}
      <div className="absolute bottom-4 right-6 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-white/55 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
