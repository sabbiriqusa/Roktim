import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Donor, AppUser } from '../types';
import { bloodGroups, taherpurLocations } from '../utils/defaultData';
import { Lock, Heart, ShieldAlert, BadgeCheck, Phone, MapPin, Edit, Check, Calendar, ToggleLeft, ToggleRight, User, Award, ArrowUpRight, Download, CheckCircle } from 'lucide-react';

interface RegistrationFormProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
}

export default function RegistrationForm({ currentUser, onOpenAuth }: RegistrationFormProps) {
  const [donorProfile, setDonorProfile] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Form input states
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('पुरुष');
  const [lastDonatedDate, setLastDonatedDate] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // New registry detail fields
  const [photoURL, setPhotoURL] = useState('');
  const [institution, setInstitution] = useState('');
  const [workOrganization, setWorkOrganization] = useState('');
  const [role, setRole] = useState('রক্তদাতা / Blood Donor');
  const [donationCount, setDonationCount] = useState(0);
  const [requestsManaged, setRequestsManaged] = useState(0);
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastDonationDate, setLastDonationDate] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load user's donor profile if they are logged in
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'donors', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const profile = docSnap.data() as Donor;
          setDonorProfile(profile);
          
          // Seed form with profile data
          setName(profile.name);
          setBloodGroup(profile.bloodGroup);
          setPhone(profile.phone);
          setLocation(profile.location);
          setAge(profile.age || 25);
          setGender(profile.gender || 'पुरुष');
          setLastDonatedDate(profile.lastDonatedDate || '');
          setIsAvailable(profile.isAvailable);

          // Seed new parameters
          setPhotoURL(profile.photoURL || '');
          setInstitution(profile.institution || '');
          setWorkOrganization(profile.workOrganization || '');
          setRole(profile.role || 'রক্তদাতা / Blood Donor');
          setDonationCount(profile.donationCount || 0);
          setRequestsManaged(profile.requestsManaged || 0);
          setJoinDate(profile.joinDate || profile.createdAt?.substring(0, 10) || new Date().toISOString().split('T')[0]);
          setLastDonationDate(profile.lastDonationDate || profile.lastDonatedDate || '');
        } else {
          setDonorProfile(null);
          // Set some fallback defaults from current user object
          if (currentUser.displayName) {
            setName(currentUser.displayName);
          }
        }
      } catch (err) {
        console.error("Error reading donor profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setMessage(null);
    setSaving(true);

    if (!name || !phone || !location) {
      setMessage({ type: 'error', text: 'অনুগ্রহ করে সবগুলি ঘর পূরণ করুন।' });
      setSaving(false);
      return;
    }

    if (age < 18 || age > 65) {
      setMessage({ type: 'error', text: 'রক্তদানের জন্য আপনার বয়স ১৮ থেকে ৬৫ বছর সম্বলিত হতে হবে।' });
      setSaving(false);
      return;
    }

    try {
      const updatedProfile: Donor = {
        id: currentUser.uid,
        name,
        email: currentUser.email || 'guest@roktimbb.org',
        phone,
        bloodGroup,
        location,
        isAvailable,
        age: Number(age),
        gender,
        lastDonatedDate: lastDonationDate || lastDonatedDate || '',
        isRegisteredDonor: true,
        createdAt: donorProfile?.createdAt || new Date().toISOString(),
        photoURL: photoURL || '',
        institution: institution || '',
        workOrganization: workOrganization || '',
        role: role || '',
        donationCount: Number(donationCount),
        requestsManaged: Number(requestsManaged),
        joinDate: joinDate || new Date().toISOString().split('T')[0],
        lastDonationDate: lastDonationDate || lastDonatedDate || '',
        isVerified: donorProfile?.isVerified ?? false,
      };

      // Clean any remaining undefined or empty fields to prevent firebase serialization errors
      const cleanedProfile = Object.fromEntries(
        Object.entries(updatedProfile).filter(([_, v]) => v !== undefined)
      );

      await setDoc(doc(db, 'donors', currentUser.uid), cleanedProfile);
      setDonorProfile(updatedProfile);
      setEditMode(false);
      setMessage({ type: 'success', text: 'অভিনন্দন! রক্তদাতা হিসেবে আপনার তথ্য সফলভাবে আপডেট হয়েছে।' });
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setMessage({ type: 'error', text: 'তথ্য সংরক্ষণ করতে একটি ত্রুটি ঘটেছে।' });
    } finally {
      setSaving(false);
    }
  };

  const downloadBadgeAsJpg = () => {
    if (!donorProfile) return;
    
    // Ensure "Hind Siliguri" is loaded so it renders with perfect typography on the canvas
    document.fonts.load('12px "Hind Siliguri"').then(() => {
      renderBadgeCanvas();
    }).catch((err) => {
      console.warn("Failed pre-loading Hind Siliguri font, falling back to rendering:", err);
      renderBadgeCanvas();
    });

    function renderBadgeCanvas() {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 850;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background layout
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header bar with beautiful crimson linear gradient
      const headerGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      headerGrad.addColorStop(0, '#7f1d1d'); // deep red maroon
      headerGrad.addColorStop(0.3, '#b91c1c'); // Crimson
      headerGrad.addColorStop(0.65, '#dc2626'); // Vibrant red
      headerGrad.addColorStop(1, '#991b1b'); // Deep Red
      ctx.fillStyle = headerGrad;
      ctx.fillRect(0, 0, canvas.width, 140);

      // Amber accent line
      ctx.fillStyle = '#f59e0b'; // Amber accent
      ctx.fillRect(0, 135, canvas.width, 5);

      // Helper to draw sharp glossy vector blood drops
      const drawBloodDrop = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, gloss: boolean = false) => {
        c.save();
        c.beginPath();
        c.moveTo(x, y - size);
        c.bezierCurveTo(x + size * 0.85, y - size * 0.1, x + size * 0.85, y + size * 0.7, x, y + size);
        c.bezierCurveTo(x - size * 0.85, y + size * 0.7, x - size * 0.85, y - size * 0.1, x, y - size);
        c.fillStyle = color;
        c.fill();

        if (gloss) {
          c.beginPath();
          c.ellipse(x - size * 0.3, y + size * 0.1, size * 0.15, size * 0.35, Math.PI / 4, 0, Math.PI * 2);
          c.fillStyle = 'rgba(255, 255, 255, 0.45)';
          c.fill();
        }
        c.restore();
      };

      // Header text using gorgeous "Hind Siliguri" typeface
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText('রক্তিম ডিজিটাল রক্তদাতা কার্ড', canvas.width / 2, 45);
      
      ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
      ctx.fillText('ROKTIM DIGITAL BLOOD DONOR IDENTITY', canvas.width / 2, 72);
      
      ctx.font = '600 10.5px "Hind Siliguri", sans-serif';
      ctx.fillText('TAHERPUR BLOOD BANK NETWORK • ESTD 2026', canvas.width / 2, 98);

      // Draw beautiful flanking gloss blood drops
      drawBloodDrop(ctx, canvas.width / 2 - 175, 36, 11, '#ffffff', true);
      drawBloodDrop(ctx, canvas.width / 2 + 175, 36, 11, '#ffffff', true);

      const drawProfileAndContent = (imgElem?: HTMLImageElement) => {
        // Photo circle frame
        const centerX = canvas.width / 2;
        const centerY = 235;
        const radius = 60;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
        
        // Gradient circular frame
        const circleGrad = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius + 4);
        circleGrad.addColorStop(0, '#f43f5e');
        circleGrad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = circleGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f3f4f6'; // Light placeholder bg
        ctx.fill();

        if (imgElem) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(imgElem, centerX - radius, centerY - radius, radius * 2, radius * 2);
          ctx.restore();
        } else {
          // Initials or first letter of name
          ctx.fillStyle = '#b91c1c';
          ctx.font = '800 36px "Hind Siliguri", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(donorProfile.name ? donorProfile.name.charAt(0) : 'R', centerX, centerY + 12);
        }

        // Name & Role details with "Hind Siliguri"
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(donorProfile.name, canvas.width / 2, 335);

        ctx.fillStyle = '#dc2626';
        ctx.font = '600 13px "Hind Siliguri", sans-serif';
        ctx.fillText(donorProfile.role || 'নিবন্ধিত রক্তদাতা / Blood Donor', canvas.width / 2, 360);

        // Separator
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(40, 385);
        ctx.lineTo(canvas.width - 40, 385);
        ctx.stroke();

        // Giant Background watermark blood drop (with very soft 4% opacity to guarantee flawless legibility)
        drawBloodDrop(ctx, canvas.width / 2, 510, 130, 'rgba(239, 68, 68, 0.04)', false);

        // Info Table Grid using premium "Hind Siliguri" weights
        ctx.textAlign = 'left';
        const leftColX = 55;
        const rightColX = canvas.width / 2 + 15;

        const drawItem = (label: string, value: string, x: number, y: number) => {
          ctx.font = '600 11px "Hind Siliguri", sans-serif';
          ctx.fillStyle = '#4b5563';
          ctx.fillText(label, x, y);
          ctx.font = 'bold 13px "Hind Siliguri", sans-serif';
          ctx.fillStyle = '#0f172a';
          ctx.fillText(value || 'N/A', x, y + 18);
        };

        drawItem('রক্তের গ্রুপ (Blood Group)', donorProfile.bloodGroup || 'O+', leftColX, 415);
        drawItem('বয়স ও লিঙ্গ (Age / Gender)', `${donorProfile.age || 25} বছর / ${donorProfile.gender || 'পুরুষ'}`, rightColX, 415);

        drawItem('শিক্ষাপ্রতিষ্ঠান (Graduated From)', donorProfile.institution || 'উল্লেখ নেই (তাহেরপুর/বাগমারা)', leftColX, 470);
        drawItem('কর্মক্ষেত্র / সংস্থা (Work Organization)', donorProfile.workOrganization || 'উল্লেখ নেই', rightColX, 470);

        drawItem('রক্তদান সংখ্যা (Times Donated)', `${donorProfile.donationCount || 0} বার (Donations)`, leftColX, 525);
        drawItem('পরিচালিত রক্তদান রিকোয়েস্ট (Managed)', `${donorProfile.requestsManaged || 0}টি সেশন`, rightColX, 525);

        drawItem('সদস্য যোগদানের তারিখ (Join Date)', donorProfile.joinDate || donorProfile.createdAt?.substring(0, 10) || '২০২৬-০৬', leftColX, 580);
        drawItem('সর্বশেষ রক্তদান তারিখ (Last Donation)', donorProfile.lastDonationDate || donorProfile.lastDonatedDate || 'কখনো নয়', rightColX, 580);

        // Signature separator line
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(40, 625);
        ctx.lineTo(canvas.width - 40, 625);
        ctx.stroke();

        // Real Signature Drawing from User Image (Sabbir)
        ctx.save();
        ctx.strokeStyle = '#000000'; // Pure ink color
        ctx.lineWidth = 2.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const sigX = canvas.width / 2;
        const sigY = 672;

        // Stroke 1: Giant surrounding loop
        ctx.beginPath();
        ctx.moveTo(sigX - 70, sigY - 5);
        ctx.bezierCurveTo(sigX - 80, sigY - 40, sigX + 60, sigY - 45, sigX + 85, sigY - 20);
        ctx.bezierCurveTo(sigX + 105, sigY, sigX + 90, sigY + 25, sigX + 20, sigY + 25);
        ctx.bezierCurveTo(sigX - 40, sigY + 25, sigX - 90, sigY + 15, sigX - 85, sigY - 2);
        ctx.bezierCurveTo(sigX - 82, sigY - 15, sigX - 60, sigY - 10, sigX - 35, sigY - 5);
        ctx.stroke();

        // Stroke 2: Elegant Cursive letters Sabbir
        ctx.beginPath();
        ctx.moveTo(sigX - 35, sigY - 5);
        ctx.bezierCurveTo(sigX - 20, sigY - 2, sigX - 15, sigY + 30, sigX - 25, sigY + 22);
        ctx.bezierCurveTo(sigX - 32, sigY + 15, sigX - 22, sigY + 0, sigX - 10, sigY + 5);
        ctx.bezierCurveTo(sigX - 2, sigY + 8, sigX, sigY - 8, sigX + 4, sigY + 10);
        ctx.bezierCurveTo(sigX + 10, sigY + 10, sigX + 12, sigY - 10, sigX + 17, sigY + 8);
        ctx.bezierCurveTo(sigX + 22, sigY + 8, sigX + 25, sigY - 8, sigX + 28, sigY + 15);
        ctx.bezierCurveTo(sigX + 34, sigY + 22, sigX + 40, sigY + 5, sigX + 50, sigY);
        ctx.stroke();

        // Stroke 3: Dot for the letter i
        ctx.beginPath();
        ctx.arc(sigX + 17, sigY - 18, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Stroke 4: Double underline swashes matching original
        ctx.beginPath();
        ctx.moveTo(sigX - 95, sigY + 30);
        ctx.quadraticCurveTo(sigX, sigY + 25, sigX + 95, sigY + 22);
        ctx.moveTo(sigX - 55, sigY + 38);
        ctx.quadraticCurveTo(sigX, sigY + 34, sigX + 75, sigY + 32);
        ctx.stroke();

        ctx.restore();

        // CEO Text details (placed lower with perfect spacing to avoid overlap)
        ctx.textAlign = 'center';
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
        ctx.fillText('Sakibul Islam Sabbir', canvas.width / 2, 730);
        
        ctx.fillStyle = '#4b5563';
        ctx.font = '600 9px "Hind Siliguri", sans-serif';
        ctx.fillText('CEO, Roktim Blood Bank', canvas.width / 2, 745);

        ctx.fillStyle = '#9ca3af';
        ctx.font = 'italic 8.5px "Hind Siliguri", sans-serif';
        ctx.fillText('"I, Sakibul Islam Sabbir, CEO of Roktim Blood Bank, hereby sign this document."', canvas.width / 2, 762);

        // Global Red Frame border with gorgeous crimson gradient
        const borderGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        borderGrad.addColorStop(0, '#991b1b');
        borderGrad.addColorStop(0.5, '#dc2626');
        borderGrad.addColorStop(1, '#7f1d1d');
        
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 14;
        ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);

        // Serial/Credential block
        ctx.fillStyle = '#9ca3af';
        ctx.font = '10px "Hind Siliguri", monospace';
        ctx.fillText(`VERIFIED ID: RKT-${donorProfile.id.toUpperCase().substring(0, 8)}`, canvas.width / 2, 812);

        // Download trigger
        try {
          const dataUri = canvas.toDataURL('image/jpeg', 0.95);
          const link = document.createElement('a');
          link.href = dataUri;
          link.download = `roktim_badge_${donorProfile.name.toLowerCase().replace(/\s+/g, '_')}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (err) {
          console.error("Canvas toDataURL failed:", err);
        }
      };

      if (donorProfile.photoURL) {
        const img = new Image();
        img.crossOrigin = "anonymous"; // bypass CORS if hosting allows
        img.onload = () => {
          drawProfileAndContent(img);
        };
        img.onerror = () => {
          drawProfileAndContent();
        };
        img.src = donorProfile.photoURL;
      } else {
        drawProfileAndContent();
      }
    }
  };

  const handleToggleAvailability = async () => {
    if (!currentUser || !donorProfile) return;
    
    const nextAvailability = !donorProfile.isAvailable;
    try {
      await updateDoc(doc(db, 'donors', currentUser.uid), {
        isAvailable: nextAvailability
      });
      setDonorProfile(prev => prev ? { ...prev, isAvailable: nextAvailability } : null);
      setIsAvailable(nextAvailability);
    } catch (err) {
      console.error("Error updating availability status", err);
    }
  };

  if (!currentUser) {
    return (
      <div className="w-full max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="max-w-md mx-auto glass-card rounded-3xl p-8 border border-white/60 text-center space-y-6 shadow-xl">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2 mx-auto border border-red-100 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-sans text-xl font-black text-gray-950">স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন</h3>
            <p className="font-sans text-sm text-gray-500 leading-relaxed">
              স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন সম্পন্ন করতে ও আপনার ডিজিটাল দাতা কার্ড তৈরি করতে অনুগ্রহ করে প্রথমে সাইন-ইন করে নিন।
            </p>
          </div>

          <button
            onClick={onOpenAuth}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm py-4.5 px-6 rounded-2xl shadow-lg shadow-red-500/10 hover:shadow-red-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            অফিশিয়াল সাইন-ইন করুন
          </button>

          <p className="font-sans text-[11px] text-gray-400">
            🔒 আমরা আপনার যোগাযোগের সাধারণ তথ্যগুলি শুধুমাত্র রক্তের প্রয়োজনে সাহায্য করার উদ্দেশ্যেই ডাটাবেজে সংরক্ষণ করব।
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto py-20 text-center flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm text-gray-500">আপনার একাউন্ট তথ্য অনুসন্ধান করা হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Page header */}
      <div className="text-center md:text-left space-y-2">
        <h2 className="font-sans text-3xl font-black text-gray-900">
          স্বেচ্ছাসেবী রক্তদাতা পোর্টাল
        </h2>
        <p className="font-sans text-sm text-gray-500">
          এখানে আপনি আপনার রক্তদানের তথ্য পরিমার্জন করতে পারেন এবং অন্য গ্রহীতাদের সেবা সুনিশ্চিত করতে প্রস্তুত বা বিশ্রাম মোড টগল করতে পারেন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Register Form or Digital card */}
        <div className="lg:col-span-7 space-y-6">
          
          {message && (
            <div className={`p-4 rounded-2xl border font-sans text-sm ${
              message.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? '🏆 ' : '⚠️ '}
              {message.text}
            </div>
          )}

          {donorProfile && !editMode ? (
            /* Digital Wallet Card View */
            <div className="space-y-6 text-left">
              
              {/* Verification alert banner */}
              {donorProfile.isVerified === false && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-xs font-sans flex items-start gap-2.5 shadow-sm">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">⚠️ প্রোফাইলটি অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে (Pending Verification)</p>
                    <p className="text-gray-600 leading-relaxed">
                      আপনার রক্তদাতা প্রোফাইলটি সফলভাবে নিবন্ধিত হয়েছে। এটি আমাদের অ্যাডমিন প্যানেল দ্বারা ভেরিফাই হলে স্বয়ংক্রিয়ভাবে মূল রক্তদাতা তালিকায় প্রদর্শিত হবে। ধন্যবাদ আপনার ধৈর্য্যের জন্য!
                    </p>
                  </div>
                </div>
              )}
              
              {/* Apple Wallet Style Glassmorphic Card */}
              <div className="relative overflow-hidden group shadow-2xl transition-transform duration-300">
                
                {/* Background layout gradient layer */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-650 via-red-800 to-red-950 -z-10 rounded-3xl" />
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm -z-10 rounded-3xl" />
                
                {/* Card glow */}
                <div className="absolute right-0 bottom-0 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-8 -mb-8" />
                <div className="absolute left-6 top-8 w-11 h-11 bg-white/10 rounded-full blur-md" />

                {/* Card Content container */}
                <div className="p-6 md:p-8 text-white space-y-6 relative rounded-3xl border border-white/20">
                  
                  {/* Card top banner */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 blood-drop-pulse">
                        {donorProfile.photoURL ? (
                          <img src={donorProfile.photoURL} alt="Profile" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                        ) : (
                          <Heart className="w-6 h-6 fill-red-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-black tracking-wide uppercase opacity-90 leading-none">স্বেচ্ছাসেবী রক্তদাতা</h4>
                        <span className="font-sans text-[10px] uppercase font-bold text-red-200 font-english mt-1 block">Taherpur Blood Network</span>
                      </div>
                    </div>
                    <span className="font-sans text-xs bg-red-500/45 px-3 py-1 rounded-full border border-white/10 font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      {donorProfile.role?.split('/')[1]?.trim() || 'Donor'}
                    </span>
                  </div>

                  {/* Card middle info */}
                  <div className="flex justify-between items-end gap-4 pt-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] md:text-xs font-semibold text-red-200/80 font-sans uppercase">রক্তদাতার নাম (Donor Name)</span>
                      <h3 className="font-sans text-2xl font-black drop-shadow-sm tracking-tight text-white leading-none">
                        {donorProfile.name}
                      </h3>
                      <p className="font-sans text-sm text-red-100/90 font-english flex items-center gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5" /> {donorProfile.location}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-center select-none">
                      <span className="text-[10px] md:text-xs font-semibold text-red-200/80 font-sans uppercase">রক্তের গ্রুপ</span>
                      <span className="font-english text-4xl font-extrabold text-white bg-white/15 px-4.5 py-1.5 rounded-2xl border border-white/30 h-16 w-20 flex items-center justify-center shadow-lg leading-none mt-1">
                        {donorProfile.bloodGroup}
                      </span>
                    </div>
                  </div>

                  {/* Card bottom details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/15 pt-5 text-left font-sans">
                    <div>
                      <span className="text-[10px] text-red-200/70 block leading-none mb-1">ফোন নাম্বার (Phone):</span>
                      <span className="font-bold text-xs md:text-sm font-english">{donorProfile.phone}</span>
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-red-200/70 block leading-none mb-1">অবস্থা (Availability):</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        donorProfile.isAvailable 
                          ? 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30' 
                          : 'text-gray-300 bg-gray-900/40 border-gray-500/30'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          donorProfile.isAvailable ? 'bg-emerald-400' : 'bg-gray-400'
                        }`} />
                        {donorProfile.isAvailable ? 'প্রস্তুত (Ready)' : 'বিশ্রামে'}
                      </span>
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <span className="text-[10px] text-red-200/70 block leading-none mb-1">শেষ রক্তদান:</span>
                      <span className="font-semibold text-xs text-red-100">{donorProfile.lastDonationDate || donorProfile.lastDonatedDate || 'অনির্ধারিত/নতুন'}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Extended Details Grid display */}
              <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-4">
                <h4 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider">রক্তদাতার বর্ধিত তথ্যাবলী (Extended Registry Info)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-gray-700 font-medium">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-450 block mb-0.5 font-semibold">শিক্ষাপ্রতিষ্ঠান (Graduated From):</span>
                    <span className="font-bold text-gray-950 text-sm">{donorProfile.institution || 'উল্লেখ করা হয়নি'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-450 block mb-0.5 font-semibold">কর্মক্ষেত্র / কর্মরত প্রতিষ্ঠান:</span>
                    <span className="font-bold text-gray-950 text-sm">{donorProfile.workOrganization || 'উল্লেখ করা হয়নি'}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-450 block mb-0.5 font-semibold">মোট রক্তদানের সংখ্যা (Donation Count):</span>
                    <span className="font-bold text-emerald-800 text-sm">{donorProfile.donationCount || 0} বার</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-450 block mb-0.5 font-semibold">পরিচালিত রিকোয়েস্ট সংখ্যা:</span>
                    <span className="font-bold text-red-800 text-sm">{donorProfile.requestsManaged || 0}টি সেশন</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl col-span-1 sm:col-span-2">
                    <span className="text-gray-450 block mb-0.5 font-semibold">আমাদের সাথে যুক্ত হওয়ার তারিখ (Join Date):</span>
                    <span className="font-bold text-gray-950 text-sm">{donorProfile.joinDate || '২০২৬-০৬'}</span>
                  </div>
                </div>

                {/* JPG Download Action Button */}
                <button
                  type="button"
                  onClick={downloadBadgeAsJpg}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold font-sans text-sm cursor-pointer shadow-lg transition-all"
                >
                  <Download className="w-5 h-5 text-white" />
                  রক্তদাতা আইডি কার্ড ডাউনলোড করুন (badge.jpg)
                </button>

                {/* CEO Signature box beneath download button */}
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-200/40 text-center space-y-1">
                  <div className="text-[10px] text-amber-800 font-bold flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ভেরিফাইড রক্তিম আইডি কার্ড ও সনদপত্র প্রস্তুত
                  </div>
                  <p className="text-[11px] text-gray-500 italic">"I, Sakibul Islam Sabbir, CEO of Roktim Blood Bank, hereby sign this document."</p>
                  <div className="pt-2 border-t border-amber-200/30 flex flex-col items-center justify-center select-none font-english">
                    <svg viewBox="0 0 240 100" className="w-40 h-16 text-slate-800 drop-shadow-xs -mt-1 -mb-2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {/* Stroke 1: Giant surrounding loop */}
                      <path d="M50 45 C40 10, 180 5, 205 30 C225 50, 210 75, 140 75 C80 75, 30 65, 35 48 C38 35, 60 40, 85 45" />
                      {/* Stroke 2: Elegant Cursive letters Sabbir */}
                      <path d="M85 45 C100 48, 105 80, 95 72 C88 65, 98 50, 110 55 C118 58, 120 42, 124 60 C130 60, 132 40, 137 58 C142 58, 145 42, 148 65 C154 72, 160 55, 170 50" strokeWidth="2.8" />
                      {/* Stroke 3: Dot for the letter i */}
                      <circle cx="137" cy="32" r="2.5" fill="currentColor" stroke="none" />
                      {/* Stroke 4: Distinct dual underline swashes matching original */}
                      <path d="M25 80 Q120 75, 215 72" strokeWidth="2.0" />
                      <path d="M65 88 Q135 84, 195 82" strokeWidth="1.6" />
                    </svg>
                    <span className="text-[9px] text-gray-400 font-bold block pt-0.5">Sakibul Islam Sabbir, CEO</span>
                  </div>
                </div>
              </div>

              {/* Edit Buttons & Quick Availability Toggle */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleToggleAvailability}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 border border-red-200 bg-red-50 hover:bg-red-100 rounded-2xl font-sans text-sm font-bold text-red-700 cursor-pointer shadow-sm transition-colors select-none"
                >
                  {donorProfile.isAvailable ? (
                    <>
                      <ToggleRight className="w-6 h-6 text-red-600 fill-red-100" />
                      রক্তদানের অবস্থা: প্রস্তুত (Ready)
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                      রক্তদানের অবস্থা: বিশ্রামে (Resting)
                    </>
                  )}
                </button>

                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 py-3.5 px-5 rounded-2xl border border-gray-200 font-sans font-bold text-sm cursor-pointer shadow-sm transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                  প্রোফাইল সংশোধন করুন
                </button>
              </div>

            </div>
          ) : (
            /* Register Form view */
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/60 space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-150">
                <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-lg md:text-xl font-bold text-gray-900">
                    {donorProfile ? 'প্রোফাইল সংশোধন করুন' : 'নতুন রক্তদাতা নিবন্ধন'}
                  </h3>
                  <p className="font-sans text-xs text-gray-400">
                    অনুগ্রহ করে সক্রিয় যোগাযোগের নাম্বার এবং সঠিক রক্তের গ্রুপ প্রদান করুন।
                  </p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-5 font-sans leading-relaxed text-left">
                
                {/* 1. Profile Photo Input & Preview */}
                <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200/50 space-y-3">
                  <span className="block text-xs font-bold text-gray-700">ছবি আপলোড করুন (Profile Picture) - ঐচ্ছিক:</span>
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                      {photoURL ? (
                        <img src={photoURL} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-semibold text-gray-400">ছবি নাই</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-1 w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 1024 * 1024) {
                              alert("অনুগ্রহ করে ১ মেগাবাইটের নিচের কোনো ছবি আপলোড করুন।");
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setPhotoURL(ev.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="block w-full text-xs text-gray-505
                          file:mr-4 file:py-1.5 file:px-3
                          file:rounded-xl file:border-0
                          file:text-xs file:font-semibold
                          file:bg-red-50 file:text-red-700
                          hover:file:bg-red-100 cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-400">জেপিজি/পিএনজি ফরম্যাট সাপোর্ট করে। আপলোড না করলে সাধারণ ছবি প্রদর্শিত হবে।</p>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">পূর্ণ নাম (বাংলা/ইংরেজি):</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="মোঃ আবির আহমেদ"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">রক্তের গ্রুপ:</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:border-red-500 bg-white"
                    >
                      {bloodGroups.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">মোবাইল নাম্বার (যোগাযোগ):</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712xxxxxx"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">বসবাসের এলাকা/স্থান (তাহেরপুর সংলগ্ন):</label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    >
                      <option value="">নির্বাচন করুন</option>
                      {taherpurLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">বয়স (Age):</label>
                      <input
                        type="number"
                        min={18}
                        max={65}
                        required
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white font-english"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">লিঙ্গ (Gender):</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                      >
                        <option value="পুরুষ">পুরুষ</option>
                        <option value="নারী">নারী</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">রক্তদাতার ভূমিকা (Role):</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    >
                      <option value="রক্তদাতা / Blood Donor">রক্তদাতা (Blood Donor)</option>
                      <option value="স্বেচ্ছাসেবী / Volunteer">স্বেচ্ছাসেবী (Volunteer)</option>
                      <option value="সংগঠক / Organizer">সংগঠক (Organizer)</option>
                    </select>
                  </div>
                </div>

                {/* Extended Details Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">শিক্ষাপ্রতিষ্ঠান (পাসকৃত/অধ্যয়নরত):</label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="তাহেরপুর ডিগ্রি কলেজ"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">কোনো প্রতিষ্ঠানে কর্মরত আছেন কিনা?</label>
                    <input
                      type="text"
                      value={workOrganization}
                      onChange={(e) => setWorkOrganization(e.target.value)}
                      placeholder="বেসরকারি কল্যাণ ট্রাস্ট"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">কতবার রক্ত দিয়েছেন?</label>
                    <input
                      type="number"
                      min={0}
                      value={donationCount}
                      onChange={(e) => {
                        setDonationCount(Number(e.target.value));
                      }}
                      className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-sm bg-white font-english"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">পরিচালিত রিকোয়েস্ট সংখ্যা:</label>
                    <input
                      type="number"
                      min={0}
                      value={requestsManaged}
                      onChange={(e) => setRequestsManaged(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border border-gray-250 rounded-xl text-sm bg-white font-english"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">আমাদের সংস্থায় কখন যুক্ত হন?</label>
                    <input
                      type="date"
                      value={joinDate}
                      onChange={(e) => setJoinDate(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">শেষ রক্তদানের তারিখ:</label>
                    <input
                      type="date"
                      value={lastDonationDate}
                      onChange={(e) => {
                        setLastDonationDate(e.target.value);
                        setLastDonatedDate(e.target.value);
                      }}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                    />
                  </div>
                </div>

                {/* Available for donate checkbox */}
                <div>
                  <button
                    type="button"
                    onClick={() => setIsAvailable(!isAvailable)}
                    className="flex items-center gap-2 px-3 py-1 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-gray-700 shadow-sm border border-gray-200/50"
                  >
                    {isAvailable ? (
                      <ToggleRight className="w-6 h-6 text-red-600 fill-red-150" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-400" />
                    )}
                    <span>নিবন্ধন করার সাথে সাথেই আমি রক্তদানে আগ্রহী ও প্রস্তুত। (Available Now)</span>
                  </button>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-gray-150">
                  {editMode && (
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shadow-sm"
                    >
                      বাতিল করুন
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-5 h-5 text-white" />
                    )}
                    {donorProfile ? 'পরিবর্তন সংরক্ষণ করুন' : 'রক্তদাতা হিসেবে যুক্ত হোন'}
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>

        {/* Right Column: Information panel / FAQs about donating blood */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/60 space-y-4">
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
              রক্তদানের শর্তাবলী ও নির্দেশনা
            </h4>
            <div className="space-y-3.5 text-xs text-gray-600 leading-relaxed font-sans">
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-[10px] sm:text-xs shrink-0">১</div>
                <p>রক্তদাতার বয়স অবশ্যই ন্যূনতম <strong>১৮ থেকে ৬০</strong> বছরের মধ্যে হতে হবে এবং ওজন কমপক্ষে <strong>৫০ কেজি</strong> হওয়া বাঞ্ছনীয়।</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-[10px] sm:text-xs shrink-0">২</div>
                <p>সর্বশেষ রক্তদানের পর অন্তত <strong>৯০ দিন (৩ মাস)</strong> বা ১১২ দিন (৪ মাস) সময় অতিবাহিত হতে হবে।</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-[10px] sm:text-xs shrink-0">৩</div>
                <p>হেপাটাইটিস বি/সি, এইডস বা কোনো সংক্রামক ব্যাধি থাকলে রক্তদান করা সম্পূর্ণ নিষিদ্ধ।</p>
              </div>
              <div className="flex gap-2.5 items-start">
                <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-[10px] sm:text-xs shrink-0">৪</div>
                <p>রক্তদানের পূর্বে চিকিৎসকের পরামর্শ নিন এবং সম্পূর্ণ সুস্থতাবোধ করলেই রক্তদানে অগ্রসর হোন।</p>
              </div>
            </div>
          </div>

          {/* Inspirational bento block */}
          <div className="bg-gradient-to-tr from-rose-50 to-red-50/50 p-6 rounded-3xl border border-red-200/20 text-center space-y-3">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <h5 className="font-sans text-sm font-bold text-gray-900">“রক্ত দিন, জীবন বাঁচান”</h5>
            <p className="font-sans text-xs text-gray-500 leading-relaxed italic max-w-xs mx-auto">
              আপনার দানের একমাত্র রক্তবিন্দু হতে পারে অপরের নিভে যাওয়া প্রদীপের অন্তহীন আলোকরশ্মি।
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
