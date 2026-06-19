import React, { useState } from 'react';
import { AppUser } from '../types';
import { Heart, LogIn, LogOut, Menu, X, User, ShieldAlert, Award, Grid, Sparkles, ShieldCheck } from 'lucide-react';
import { signOut } from '../lib/firebase';

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
    { id: 'donors', labelBn: 'রক্তদাতা তালিকা', labelEn: 'Donors' },
    { id: 'requests', labelBn: 'রক্তের আবেদন', labelEn: 'Requests' },
    { id: 'register', labelBn: 'রক্তদাতা নিবন্ধন', labelEn: 'Register' }
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
    <nav className="sticky top-0 z-40 w-full glass bg-white/75 border-b border-white/50 shadow-sm backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        
        {/* Logo brand */}
        <div 
          onClick={() => handleMenuClick('home')} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 blood-drop-pulse transition-transform group-hover:scale-105 duration-300">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-sans text-lg md:text-xl font-black text-gray-950 tracking-tight">
            রক্তিম <span className="text-red-600 transition-colors group-hover:text-red-700">ব্লাড ব্যাংক</span>
          </span>
        </div>

        {/* Desktop navigation menu */}
        <div className="hidden md:flex items-center gap-1.5 bg-gray-150/40 p-1.5 rounded-2xl border border-white/40">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-xl shadow-red-500/10 font-bold scale-[1.02]' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-white/50'
                }`}
              >
                {item.labelBn}
              </button>
            );
          })}
        </div>

        {/* User profile controls & Sign in */}
        <div className="flex items-center gap-3 relative">

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-red-50/50 hover:bg-red-50 text-red-700 rounded-2xl transition-all cursor-pointer border border-red-150 relative h-9"
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
                
                <span className="font-sans text-xs font-bold leading-none hidden sm:inline-block max-w-[90px] truncate">
                  {currentUser.displayName}
                </span>

                {currentUser.isGuest && (
                  <span className="bg-red-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full scale-90 -mr-1">
                    GUEST
                  </span>
                )}
              </button>

              {/* Elegant floating dropdown */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2.5 w-48 bg-white/95 rounded-2xl shadow-xl border border-gray-100 py-2.5 z-20 animate-in fade-in slide-in-from-top-3 duration-150 backdrop-blur-md">
                    
                    <div className="px-4 py-1.5 border-b border-gray-50 mb-1">
                      <p className="text-[10px] text-gray-400 font-sans leading-none">লগড-ইন একাউন্ট</p>
                      <p className="text-xs font-bold text-gray-800 font-sans truncate mt-1">{currentUser.displayName}</p>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('register');
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-sans flex items-center gap-2 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5 text-red-600" />
                      আমার দাতা কার্ড (Profile)
                    </button>

                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-sans flex items-center gap-2 border-t border-gray-50 pt-2 cursor-pointer"
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
              className="flex items-center gap-2 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-red-500/10 cursor-pointer transition-all active:scale-95 border border-red-500/5 relative overflow-hidden"
            >
              <LogIn className="w-4 h-4 shadow-sm" />
              <span>লগ-ইন করুন</span>
            </button>
          )}

          {/* Mobile menu hamburger toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-700 cursor-pointer active:scale-95 transition-all"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile navigation side menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-1 border-t border-gray-150 bg-white/95 backdrop-blur-md space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-red-600 text-white font-bold' 
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  {item.labelBn}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </nav>
  );
}
