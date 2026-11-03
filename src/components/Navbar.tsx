import React, { useState } from 'react';
import { AppUser } from '../types';
import { Heart, LogIn, LogOut, Menu, X, User, Award, Flame, Compass, ShieldCheck } from 'lucide-react';
import { signOut } from '../lib/firebase';
import { PWAInstallButton } from './PWAInstallButton';
import NotificationCenter from './NotificationCenter';

interface NavbarProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
}

export default function Navbar({ currentUser, onOpenAuth, onNavigate, currentPage, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'home', labelBn: 'হোম', labelEn: 'Home' },
    { id: 'timeline', labelBn: 'লাইভ টাইমলাইন', labelEn: 'Timeline', badge: 'New' },
    { id: 'location', labelBn: 'লাইভ লোকেশন', labelEn: 'Location', badge: 'GPS' },
    { id: 'donors', labelBn: 'রক্তদাতা তালিকা', labelEn: 'Donors' },
    { id: 'requests', labelBn: 'রক্তের আবেদন', labelEn: 'Requests' },
    { id: 'register', labelBn: 'নিবন্ধন ফরম', labelEn: 'Register' },
    { id: 'team', labelBn: 'রক্তিম টিম', labelEn: 'Team' },
    { id: 'about', labelBn: 'সম্পর্কে', labelEn: 'About' },
  ];

  const handleLogoutClick = async () => {
    try {
      await signOut;
      onLogout();
      setDropdownOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleMenuClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass bg-white/80 border-b border-white/60 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        
        {/* Left: Brand logo */}
        <div 
          onClick={() => handleMenuClick('home')} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 blood-drop-pulse transition-transform group-hover:scale-105 duration-300">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-sans text-base sm:text-lg md:text-xl font-black text-gray-950 tracking-tight">
            রক্তিম <span className="text-red-600 transition-colors group-hover:text-red-700">ব্লাড ব্যাংক</span>
          </span>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <div className="hidden lg:flex items-center gap-1 bg-gray-150/40 p-1.5 rounded-2xl border border-white/40">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans flex items-center gap-1 ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/20 scale-[1.02]' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-white/60'
                }`}
              >
                {item.id === 'timeline' && <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />}
                {item.id === 'location' && <Compass className="w-3 h-3 text-emerald-400" />}
                <span>{item.labelBn}</span>
                {item.badge && !isActive && (
                  <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.2 rounded-full font-english font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Controls (Install PWA, Notification Center, User Auth) */}
        <div className="flex items-center gap-2 sm:gap-2.5 relative">

          {/* In-App PWA Install Button */}
          <div className="hidden sm:block">
            <PWAInstallButton variant="compact" />
          </div>

          {/* Automated Blood Request Notification Center Bell */}
          <NotificationCenter onNavigateToRequestsPage={() => onNavigate('requests')} />

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50/60 hover:bg-red-50 text-red-700 rounded-2xl transition-all cursor-pointer border border-red-200 relative h-9"
              >
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || ''} 
                    className="w-6 h-6 rounded-lg object-cover border border-red-500/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                    <User className="w-3.5 h-3.5 fill-red-100" />
                  </div>
                )}
                
                <span className="font-sans text-xs font-bold leading-none hidden sm:inline-block max-w-[85px] truncate">
                  {currentUser.displayName}
                </span>

                {currentUser.phoneVerified && (
                  <span className="hidden md:inline-block text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                    ✓ Verified
                  </span>
                )}
              </button>

              {/* Floating Profile Dropdown */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-3 duration-150 backdrop-blur-md font-sans">
                    
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-[10px] text-gray-400 leading-none">যাচাইকৃত একাউন্ট</p>
                      <p className="text-xs font-bold text-gray-900 truncate mt-1">{currentUser.displayName}</p>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        {currentUser.verifiedBy === 'phone' ? '📱 ফোন নাম্বার যাচাইকৃত' : '🌐 গুগল যাচাইকৃত'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('register');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-red-600" />
                      আমার ডিজিটাল দাতা কার্ড
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('location');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      লাইভ জিপিএস লোকেশন শেয়ার
                    </button>

                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2 border-t border-gray-100 pt-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-gray-400" />
                      সাইন-আউট (Logout)
                    </button>

                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl text-xs font-bold shadow-md shadow-red-500/10 cursor-pointer transition-all active:scale-95 font-sans"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>লগ-ইন</span>
            </button>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-red-600 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 border-b border-gray-200 px-4 py-3 space-y-2 animate-in slide-in-from-top font-sans shadow-lg backdrop-blur-md">
          <div className="pb-2 mb-2 border-b border-gray-150 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">মেনু নেভিগেশন</span>
            <PWAInstallButton variant="compact" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                {item.id === 'timeline' && <Flame className="w-3.5 h-3.5 text-amber-300" />}
                {item.id === 'location' && <Compass className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{item.labelBn}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </nav>
  );
}
