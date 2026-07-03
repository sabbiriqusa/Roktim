import React from 'react';
import { Home, Users, Heart, Award, ShieldAlert } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: any;
  onOpenAuth: () => void;
}

export default function BottomNavigation({ 
  currentPage, 
  onNavigate, 
  currentUser, 
  onOpenAuth 
}: BottomNavigationProps) {
  
  const menuItems = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'donors', label: 'রক্তদাতা', icon: Users },
    { id: 'requests', label: 'আবেদন', icon: Heart },
    { id: 'register', label: 'প্রোফাইল', icon: Award }
  ];

  const handleNavClick = (id: string) => {
    if (id === 'register' && !currentUser) {
      // Prompt login if they try to access profile/card without auth
      onOpenAuth();
    } else {
      onNavigate(id);
    }
  };

  return (
    <div 
      id="android-bottom-navigation"
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-red-100/60 shadow-[0_-8px_32px_rgba(239,68,68,0.08)] py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around px-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[70px] cursor-pointer transition-all duration-200 relative select-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {/* Material You Active Indicator pill background */}
              <div 
                className={`flex items-center justify-center rounded-2xl h-8 w-14 transition-all duration-300 ${
                  isActive 
                    ? 'bg-red-50 text-red-600 scale-105 shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <IconComponent className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 fill-red-100/30' : ''}`} />
              </div>
              
              {/* Active Text under indicator */}
              <span 
                className={`font-sans text-[10px] mt-1 transition-all duration-200 ${
                  isActive 
                    ? 'text-red-600 font-black scale-105' 
                    : 'text-stone-500 font-bold'
                }`}
              >
                {item.label}
              </span>

              {/* Top ambient dot for pending indicators (optional styling) */}
              {item.id === 'requests' && (
                <span className="absolute top-1.5 right-6 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
