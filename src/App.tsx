import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import NoticeBar from './components/NoticeBar';
import AnnouncementCarousel from './components/AnnouncementCarousel';
import Hero from './components/Hero';
import DonorList from './components/DonorList';
import BloodRequests from './components/BloodRequests';
import RegistrationForm from './components/RegistrationForm';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DateTimeCalendarWidget from './components/DateTimeCalendarWidget';
import BranchesList from './components/BranchesList';
import DeveloperProfile from './components/DeveloperProfile';
import AdminDashboard from './components/AdminDashboard';
import SponsorAds from './components/SponsorAds';
import DonationPopup from './components/DonationPopup';
import AdminPassModal from './components/AdminPassModal';
import { AppUser } from './types';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { BookOpen, ShieldCheck, Heart, UserPlus, PhoneIncoming, MessageSquareDot } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [devProfileOpen, setDevProfileOpen] = useState(false);
  const [adminPassOpen, setAdminPassOpen] = useState(false);

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'স্বেচ্ছাসেবী',
          photoURL: user.photoURL,
          isGuest: false
        });
      } else {
        // Fallback check to see if we stored a guest user locally during this session
        const storedGuest = sessionStorage.getItem('bb_guest_user');
        if (storedGuest) {
          try {
            setCurrentUser(JSON.parse(storedGuest));
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

  const handleLoginSuccess = (user: AppUser) => {
    setCurrentUser(user);
    if (user.isGuest) {
      sessionStorage.setItem('bb_guest_user', JSON.stringify(user));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('bb_guest_user');
  };

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden selection:bg-red-200">
      
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
      />

      {/* Main Container */}
      <main className="flex-grow">
        
        {/* Dynamic Screen Routing */}
        {currentPage === 'home' && (
          <div className="space-y-4 pt-4 md:pt-8">
            
            {/* 1. Rotating Announcement Carousel Banners */}
            <AnnouncementCarousel />

            {/* 2. Horizontal Scrolling Notices */}
            <NoticeBar />

            {/* 2.5 Live Real-time Clock, Date & Calendar schedule Widget */}
            <div className="w-full max-w-6xl mx-auto px-4 pt-6">
              <DateTimeCalendarWidget />
            </div>

            {/* 3. Welcome Main Board & Live Stats Dashboard */}
            <Hero
              onNavigate={handleNavigation}
              onOpenAuth={() => setAuthModalOpen(true)}
              userLoggedIn={!!currentUser}
            />

            {/* 4. Elegant Features Grid / Informational steps */}
            <div className="w-full max-w-6xl mx-auto py-12 px-4 space-y-10 border-t border-red-100/50">
              <div className="text-center space-y-2">
                <span className="font-sans text-xs font-bold text-red-600 tracking-widest uppercase bg-red-50 border border-red-200/50 px-3 py-1 rounded-full">
                  সহজ ধাপসমূহ / Workflow
                </span>
                <h3 className="font-sans text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  রক্তদান ও গ্রহণের সহজতম ডিজিটাল সমাধান
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                
                {/* Step 1 */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 space-y-4 shadow-sm">
                  <div className="w-11 h-11 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans text-base md:text-lg font-bold text-gray-900 leading-none">১. একাউন্ট যুক্ত করুন</h4>
                  <p className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed">
                    ১ ক্লিকে গুগল সাইন-ইন বা ইনস্ট্যান্ট গেস্ট অ্যাকাউন্ট ব্যবহার করে ড্যাশবোর্ডে প্রবেশ করুন। কোনো জটিল পাসওয়ার্ড মনে রাখার ঝামেলা নেই।
                  </p>
                </div>

                {/* Step 2 */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 space-y-4 shadow-sm">
                  <div className="w-11 h-11 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-inner">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-sans text-base md:text-lg font-bold text-gray-900 leading-none">২. দাতা হিসেবে নিবন্ধন</h4>
                  <p className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed">
                    আপনার রক্তের গ্রুপ, থাকার জায়গা এবং ফোন নম্বর দিয়ে সদস্য টিকিট কার্ড সংগ্রহ করুন। রক্তের প্রয়োজনে মানুষ আপনাকে সরাসরি ও সুরক্ষিত উপায়ে খুঁজতে পারবে।
                  </p>
                </div>

                {/* Step 3 */}
                <div className="glass-card p-6 rounded-3xl border border-white/60 space-y-4 shadow-sm">
                  <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                    <PhoneIncoming className="w-5 h-5" />
                  </div>
                  <h4 className="font-sans text-base md:text-lg font-bold text-gray-900 leading-none">৩. আবেদন ও জীবন সমন্বয়</h4>
                  <p className="font-sans text-xs md:text-sm text-gray-550 leading-relaxed">
                    রোগীর জন্য রক্তের প্রয়োজন হলে রিকোয়েস্ট তৈরি করুন অথবা বিদ্যমান আবেদনে সাড়া দিয়ে সরাসরি ফোনে কথা বলুন ও অতিদ্রুত রক্তদান সম্পন্ন করুন।
                  </p>
                </div>

              </div>
            </div>

            {/* 4.5 Sponsor and Partner Clinical Advertisements Section */}
            <SponsorAds />

            {/* 5. Affiliated Partner Hospitals & Clinical Diagnostics */}
            <BranchesList onOpenAdmin={() => setAdminPassOpen(true)} />

          </div>
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

      </main>

      {/* Platform Footer */}
      <Footer onNavigate={handleNavigation} onOpenDevProfile={() => setDevProfileOpen(true)} />

      {/* Authentication Dialog Popup */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
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

      {/* Landing Fundraising & Operational Donation Popup with Apple styling */}
      <DonationPopup />

    </div>
  );
}
