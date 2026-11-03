import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoticeBar from './components/NoticeBar';
import AnnouncementCarousel from './components/AnnouncementCarousel';
import Hero from './components/Hero';
import DonorList from './components/DonorList';
import BloodRequests from './components/BloodRequests';
import RegistrationForm from './components/RegistrationForm';
import RequestTimeline from './components/RequestTimeline';
import LocationTracking from './components/LocationTracking';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DateTimeCalendarWidget from './components/DateTimeCalendarWidget';
import HighlightedDonors from './components/HighlightedDonors';
import BranchesList from './components/BranchesList';
import DeveloperProfile from './components/DeveloperProfile';
import AdminDashboard from './components/AdminDashboard';
import SponsorAds from './components/SponsorAds';
import DonationPopup from './components/DonationPopup';
import AboutNoticeSection from './components/AboutNoticeSection';
import AdminPassModal from './components/AdminPassModal';
import BottomNavigation from './components/BottomNavigation';
import TeamPage from './components/TeamPage';
import AboutPage from './components/AboutPage';
import { PWAInstallButton } from './components/PWAInstallButton';
import InstallMobileAppSection from './components/InstallMobileAppSection';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AppUser } from './types';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './lib/firebase';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import { UserPlus, Heart, PhoneIncoming, Flame, Compass, BellRing } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [hasEnteredMainWebsite, setHasEnteredMainWebsite] = useState<boolean>(() => {
    return sessionStorage.getItem('roktim_main_website_entered') === 'true';
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [devProfileOpen, setDevProfileOpen] = useState(false);
  const [adminPassOpen, setAdminPassOpen] = useState(false);

  useEffect(() => {
    // Listen for Firebase Auth changes without automatic home redirect
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser((prev) => {
          return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'স্বেচ্ছাসেবী',
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            isGuest: false,
            verifiedBy: 'google',
            ...prev
          };
        });
      } else {
        const storedVerified = sessionStorage.getItem('bb_verified_user') || sessionStorage.getItem('bb_guest_user');
        if (storedVerified) {
          try {
            setCurrentUser(JSON.parse(storedVerified));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // When user explicitly clicks "Proceed to Main Website" after completing registration and permissions
  const handleProceedToMainPage = (user: AppUser) => {
    setCurrentUser(user);
    setHasEnteredMainWebsite(true);
    sessionStorage.setItem('roktim_main_website_entered', 'true');
    sessionStorage.setItem('bb_verified_user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Logout error:", e);
    }
    setCurrentUser(null);
    setHasEnteredMainWebsite(false);
    sessionStorage.removeItem('bb_verified_user');
    sessionStorage.removeItem('bb_guest_user');
    sessionStorage.removeItem('roktim_main_website_entered');
    setCurrentPage('home');
  };

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Display splash screen with app logo, name, and blood donation slogan
  if (showSplash) {
    return (
      <SplashScreen 
        onComplete={() => setShowSplash(false)} 
        isAuthenticated={hasEnteredMainWebsite && !!currentUser} 
      />
    );
  }

  // 2. Mandatory Gate: A user CANNOT be taken to the main page until they have
  // manually completed the registration process and granted location & notification permissions.
  // There is ZERO automatic redirection.
  if (!hasEnteredMainWebsite || !currentUser) {
    return (
      <AuthScreen 
        currentUser={currentUser}
        onProceedToMainPage={handleProceedToMainPage}
        onReplaySplash={() => setShowSplash(true)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-red-200 bg-stone-50/50">
      
      {/* Offline Status Floating Indicator */}
      <OfflineIndicator />

      {/* Dynamic Ambient Background Dots */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-400/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-rose-400/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Topbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onNavigate={handleNavigation}
        currentPage={currentPage}
        onLogout={handleLogout}
        onReplaySplash={() => setShowSplash(true)}
      />

      {/* Main Container */}
      <main className="flex-grow pb-24 md:pb-0">
        
        {/* Dynamic Screen Routing */}
        {currentPage === 'home' && (
          <div className="space-y-4 pt-4 md:pt-6">
            
            {/* PWA Mobile App Install Promo Banner */}
            <div className="w-full max-w-6xl mx-auto px-4">
              <PWAInstallButton variant="banner" />
            </div>

            {/* 1. Rotating Announcement Carousel Banners */}
            <AnnouncementCarousel />

            {/* 2. Horizontal Scrolling Notices */}
            <NoticeBar />

            {/* 2.4 Highlighted Volunteers & Blood Donors Panel */}
            <div className="w-full max-w-6xl mx-auto px-4 pt-4">
              <HighlightedDonors />
            </div>

            {/* 2.5 Live Real-time Clock, Date & Calendar schedule Widget */}
            <div className="w-full max-w-6xl mx-auto px-4 pt-4">
              <DateTimeCalendarWidget />
            </div>

            {/* 3. Welcome Main Board & Live Stats Dashboard */}
            <Hero
              onNavigate={handleNavigation}
              onOpenAuth={() => setAuthModalOpen(true)}
              userLoggedIn={!!currentUser}
            />

            {/* 3.5 Install Mobile App Section (Dedicated Download Android App Feature) */}
            <InstallMobileAppSection />

            {/* 4. Core Features Showcase Banner */}
            <div className="w-full max-w-6xl mx-auto py-8 px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Feature 1: Real-Time Location Radar */}
                <div 
                  onClick={() => handleNavigation('location')}
                  className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group text-left"
                >
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-xs">
                    <Compass className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 font-sans">GPS RADAR</span>
                  <h3 className="font-sans text-xl font-black mt-1">রিয়েল-টাইম রক্তদাতা লোকেশন ট্র্যাকিং</h3>
                  <p className="font-sans text-xs text-emerald-100 mt-2 leading-relaxed">
                    জিপিএস দূরত্বের মাধ্যমে তাহেরপুর ও বাগমারা অঞ্চলের নিকটবর্তী রক্তদাতাদের অবস্থান ও হাসপাতালের দূরত্ব সরাসরি শনাক্ত করুন।
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold font-sans mt-4 text-emerald-200 group-hover:text-white transition-colors">
                    লাইভ রাডারে প্রবেশ করুন →
                  </span>
                </div>

                {/* Feature 2: Automated Notification Timeline */}
                <div 
                  onClick={() => handleNavigation('timeline')}
                  className="bg-gradient-to-br from-red-650 via-rose-700 to-red-950 text-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group text-left"
                >
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center mb-3 backdrop-blur-xs">
                    <Flame className="w-5 h-5 fill-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-red-200 font-sans">AUTOMATED TIMELINE</span>
                  <h3 className="font-sans text-xl font-black mt-1">স্বয়ংক্রিয় রক্ত রিকোয়েস্ট টাইমলাইন</h3>
                  <p className="font-sans text-xs text-red-100 mt-2 leading-relaxed">
                    সকল জরুরি রক্তের আবেদন স্বয়ংক্রিয়ভাবে ব্যবহারকারীদের টাইমলাইনে পোস্ট হয় এবং সাউন্ড অ্যালার্ট ও পুশ নোটিফিকেশন পাঠায়।
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold font-sans mt-4 text-red-200 group-hover:text-white transition-colors">
                    লাইভ টাইমলাইন দেখুন →
                  </span>
                </div>

              </div>
            </div>

            {/* 5. Elegant Features Grid / Informational steps */}
            <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8 border-t border-red-100/50">
              <div className="text-center space-y-1.5">
                <span className="font-sans text-xs font-bold text-red-600 tracking-widest uppercase bg-red-50 border border-red-200/50 px-3 py-1 rounded-full">
                  সহজ ধাপসমূহ / Workflow
                </span>
                <h3 className="font-sans text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  রক্তদান ও গ্রহণের সহজতম ডিজিটাল সমাধান
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* Step 1 */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 space-y-4 shadow-sm text-left">
                  <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans text-base md:text-lg font-bold text-gray-900 leading-none">১. একাউন্ট যাচাই ও সাইন-ইন</h4>
                  <p className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed">
                    গুগল একাউন্ট বা মোবাইল নাম্বার ও ওটিপি ভেরিফিকেশনের মাধ্যমে ১ ক্লিকে নিরাপদ ক্লাউড একাউন্ট তৈরি করুন।
                  </p>
                </div>

                {/* Step 2 */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 space-y-4 shadow-sm text-left">
                  <div className="w-11 h-11 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-sans text-base md:text-lg font-bold text-gray-900 leading-none">২. দাতা নিবন্ধন ও আইডি কার্ড</h4>
                  <p className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed">
                    নাম, ইমেইল, রক্তের গ্রুপ, লিঙ্গ, ফোন, পেশা ও ঠিকানা পূরণ করে ডিজিটাল রক্তদাতা কার্ড সংগ্রহ করুন যা ক্লাউডে সংরক্ষিত থাকবে।
                  </p>
                </div>

                {/* Step 3 */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 space-y-4 shadow-sm text-left">
                  <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <PhoneIncoming className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans text-base md:text-lg font-bold text-gray-900 leading-none">৩. লাইভ আবেদন ও জীবন সমন্বয়</h4>
                  <p className="font-sans text-xs md:text-sm text-gray-550 leading-relaxed">
                    রক্তের প্রয়োজন হলে আবেদন করুন। স্বয়ংক্রিয় নোটিফিকেশনের মাধ্যমে সকল রক্তদাতার কাছে অ্যালার্ট পৌঁছাবে এবং দ্রুত ব্যবস্থা হবে।
                  </p>
                </div>

              </div>
            </div>

            {/* 4.2 About and Detailed Notice Board section */}
            <AboutNoticeSection />

            {/* 4.5 Sponsor and Partner Clinical Advertisements Section */}
            <SponsorAds />

            {/* 5. Affiliated Partner Hospitals & Clinical Diagnostics */}
            <BranchesList onOpenAdmin={() => setAdminPassOpen(true)} />

          </div>
        )}

        {currentPage === 'timeline' && (
          <RequestTimeline
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
            onNewRequestClick={() => handleNavigation('requests')}
          />
        )}

        {currentPage === 'location' && (
          <LocationTracking
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'donors' && (
          <DonorList />
        )}

        {currentPage === 'requests' && (
          <BloodRequests
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'register' && (
          <RegistrationForm
            currentUser={currentUser}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {currentPage === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onNavigate={handleNavigation}
          />
        )}

        {currentPage === 'team' && (
          <TeamPage />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

      </main>

      {/* Platform Footer */}
      <Footer onNavigate={handleNavigation} onOpenDevProfile={() => setDevProfileOpen(true)} />

      {/* Authentication Dialog Popup with Google & Phone OTP Verification */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleProceedToMainPage}
      />

      {/* Developer Profile Modal Dialog popup */}
      <DeveloperProfile
        isOpen={devProfileOpen}
        onClose={() => setDevProfileOpen(false)}
      />

      {/* Admin Credentials Modal Dialog popup */}
      <AdminPassModal
        isOpen={adminPassOpen}
        onClose={() => setAdminPassOpen(false)}
        onSuccess={() => handleNavigation('admin')}
      />

      {/* Landing Fundraising & Operational Donation Popup */}
      <DonationPopup />

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNavigation 
        currentPage={currentPage}
        onNavigate={handleNavigation}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

    </div>
  );
}
