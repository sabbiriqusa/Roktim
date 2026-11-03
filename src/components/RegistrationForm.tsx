import React, { useEffect, useState, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Donor, AppUser } from '../types';
import { bloodGroups, taherpurLocations, occupationsList } from '../utils/defaultData';
import { processAndCompressImage, MAX_PHOTO_SIZE_MB } from '../utils/imageUtils';
import { 
  Lock, Heart, ShieldAlert, BadgeCheck, Phone, MapPin, Edit, Check, 
  Calendar, ToggleLeft, ToggleRight, User, Award, Download, CheckCircle, 
  Briefcase, Mail, Compass, CloudCheck, Sparkles, Navigation,
  Camera, Upload, Trash2, AlertCircle
} from 'lucide-react';

interface RegistrationFormProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
}

export default function RegistrationForm({ currentUser, onOpenAuth }: RegistrationFormProps) {
  const [donorProfile, setDonorProfile] = useState<Donor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  // Form input states (Mandatory fields requested)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [gender, setGender] = useState('পুরুষ');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('শিক্ষার্থী (Student)');
  const [customOccupation, setCustomOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('তাহেরপুর বাজার');
  const [age, setAge] = useState(25);
  const [isAvailable, setIsAvailable] = useState(true);

  // Location GPS fields
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [accuracy, setAccuracy] = useState<number | undefined>(undefined);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsDetected, setGpsDetected] = useState(false);

  // Supplementary registry detail fields
  const [photoURL, setPhotoURL] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [institution, setInstitution] = useState('');
  const [workOrganization, setWorkOrganization] = useState('');
  const [role, setRole] = useState('রক্তদাতা / Blood Donor');
  const [donationCount, setDonationCount] = useState(0);
  const [requestsManaged, setRequestsManaged] = useState(0);
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [lastDonationDate, setLastDonationDate] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load user's donor profile from Cloud Firestore if they are logged in
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
          setName(profile.name || currentUser.displayName || '');
          setEmail(profile.email || currentUser.email || '');
          setBloodGroup(profile.bloodGroup || 'O+');
          setGender(profile.gender || 'পুরুষ');
          setPhone(profile.phone || currentUser.phoneNumber || '');
          setOccupation(profile.occupation || 'শিক্ষার্থী (Student)');
          setAddress(profile.address || '');
          setLocation(profile.location || 'তাহেরপুর বাজার');
          setAge(profile.age || 25);
          setIsAvailable(profile.isAvailable !== false);

          // GPS
          if (profile.latitude) {
            setLatitude(profile.latitude);
            setLongitude(profile.longitude);
            setGpsDetected(true);
          }

          // Extended parameters
          setPhotoURL(profile.photoURL || currentUser.photoURL || '');
          setInstitution(profile.institution || '');
          setWorkOrganization(profile.workOrganization || '');
          setRole(profile.role || 'রক্তদাতা / Blood Donor');
          setDonationCount(profile.donationCount || 0);
          setRequestsManaged(profile.requestsManaged || 0);
          setJoinDate(profile.joinDate || profile.createdAt?.substring(0, 10) || new Date().toISOString().split('T')[0]);
          setLastDonationDate(profile.lastDonationDate || profile.lastDonatedDate || '');
        } else {
          setDonorProfile(null);
          // Set initial values from user login credentials
          if (currentUser.displayName) setName(currentUser.displayName);
          if (currentUser.email) setEmail(currentUser.email);
          if (currentUser.phoneNumber) setPhone(currentUser.phoneNumber);
          if (currentUser.photoURL) setPhotoURL(currentUser.photoURL);
        }
      } catch (err) {
        console.error("Error reading donor profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // GPS auto-detection
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert("আপনার ব্রাউজারে লোকেশন সার্ভিস সাপোর্ট করে না।");
      return;
    }
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setAccuracy(pos.coords.accuracy);
        setGpsDetected(true);
        setDetectingGps(false);
        if (!address) {
          setAddress(`জিপিএস চিহ্নিত এলাকা (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        }
      },
      (err) => {
        console.warn("Location error:", err);
        setDetectingGps(false);
        alert("লোকেশন পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজারে লোকেশন পারমিশন দিন অথবা সরাসরি ঠিকানা লিখুন।");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    setImageUploading(true);

    try {
      const compressedDataUrl = await processAndCompressImage(file, MAX_PHOTO_SIZE_MB);
      setPhotoURL(compressedDataUrl);
    } catch (err: any) {
      console.warn("Image upload error:", err);
      setImageError(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে। ২ এমবি-র কম সাইজের ছবি দিন।');
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoURL('');
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    
    setMessage(null);
    setSaving(true);

    const finalOccupation = occupation === 'অন্যান্য (Other)' && customOccupation ? customOccupation : occupation;

    if (!name || !email || !phone || !bloodGroup || !gender || !address) {
      setMessage({ type: 'error', text: 'অনুগ্রহ করে সকল আবশ্যক ঘর (নাম, ইমেইল, রক্তের গ্রুপ, লিঙ্গ, ফোন, পেশা ও ঠিকানা) পূরণ করুন।' });
      setSaving(false);
      return;
    }

    if (age < 18 || age > 65) {
      setMessage({ type: 'error', text: 'রক্তদানের জন্য বয়স ১৮ থেকে ৬৫ বছর সম্বলিত হতে হবে।' });
      setSaving(false);
      return;
    }

    try {
      const updatedProfile: Donor = {
        id: currentUser.uid,
        name: name.trim(),
        email: email.trim(),
        bloodGroup,
        gender,
        phone: phone.trim(),
        occupation: finalOccupation,
        address: address.trim(),
        location: location || 'তাহেরপুর বাজার',
        age: Number(age),
        isAvailable,
        isRegisteredDonor: true,
        createdAt: donorProfile?.createdAt || new Date().toISOString(),
        photoURL: photoURL || '',
        institution: institution || '',
        workOrganization: workOrganization || '',
        role: role || 'রক্তদাতা / Blood Donor',
        donationCount: Number(donationCount),
        requestsManaged: Number(requestsManaged),
        joinDate: joinDate || new Date().toISOString().split('T')[0],
        lastDonationDate: lastDonationDate || '',
        lastDonatedDate: lastDonationDate || '',
        isVerified: true,
        phoneVerified: currentUser.phoneVerified || false,
        verificationMethod: currentUser.verifiedBy || (currentUser.email ? 'google' : 'phone'),
        latitude: latitude || 24.4258,
        longitude: longitude || 88.8475,
        locationAccuracy: accuracy || 10,
        isLocationSharing: true,
        lastLocationUpdate: new Date().toISOString()
      };

      // Clean undefined fields for Cloud Firestore
      const cleanedProfile = Object.fromEntries(
        Object.entries(updatedProfile).filter(([_, v]) => v !== undefined)
      );

      // Save directly to Cloud Firestore
      await setDoc(doc(db, 'donors', currentUser.uid), cleanedProfile);
      setDonorProfile(updatedProfile);
      setEditMode(false);
      setMessage({ 
        type: 'success', 
        text: 'অভিনন্দন! আপনার তথ্য সফলভাবে গুগল ক্লাউড ফায়ারস্টোরে সংরক্ষিত হয়েছে।' 
      });
    } catch (err: any) {
      console.error("Error saving profile to Firestore:", err);
      setMessage({ type: 'error', text: 'তথ্য ক্লাউডে সংরক্ষণ করতে একটি ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!currentUser || !donorProfile) return;
    const nextAvailability = !donorProfile.isAvailable;
    try {
      await setDoc(doc(db, 'donors', currentUser.uid), {
        ...donorProfile,
        isAvailable: nextAvailability
      });
      setDonorProfile(prev => prev ? { ...prev, isAvailable: nextAvailability } : null);
      setIsAvailable(nextAvailability);
    } catch (err) {
      console.error("Error updating availability status", err);
    }
  };

  const downloadBadgeAsJpg = () => {
    if (!donorProfile) return;
    
    document.fonts.load('12px "Hind Siliguri"').then(() => {
      renderBadgeCanvas();
    }).catch(() => {
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

      // Header bar with crimson linear gradient
      const headerGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      headerGrad.addColorStop(0, '#7f1d1d');
      headerGrad.addColorStop(0.3, '#b91c1c');
      headerGrad.addColorStop(0.65, '#dc2626');
      headerGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(0, 0, canvas.width, 140);

      // Amber accent line
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, 135, canvas.width, 5);

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 24px "Hind Siliguri", sans-serif';
      ctx.fillText('রক্তিম ডিজিটাল রক্তদাতা কার্ড', canvas.width / 2, 45);
      ctx.font = 'bold 12px "Hind Siliguri", sans-serif';
      ctx.fillText('ROKTIM DIGITAL BLOOD DONOR IDENTITY', canvas.width / 2, 72);
      ctx.font = '600 10.5px "Hind Siliguri", sans-serif';
      ctx.fillText('TAHERPUR BLOOD BANK NETWORK • ESTD 2026', canvas.width / 2, 98);

      const drawProfileAndContent = (imgElem?: HTMLImageElement) => {
        const centerX = canvas.width / 2;
        const centerY = 235;
        const radius = 60;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 4, 0, Math.PI * 2);
        const circleGrad = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius + 4);
        circleGrad.addColorStop(0, '#f43f5e');
        circleGrad.addColorStop(1, '#b91c1c');
        ctx.fillStyle = circleGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#f3f4f6';
        ctx.fill();

        if (imgElem) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(imgElem, centerX - radius, centerY - radius, radius * 2, radius * 2);
          ctx.restore();
        } else {
          ctx.fillStyle = '#b91c1c';
          ctx.font = '800 36px "Hind Siliguri", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(donorProfile.name ? donorProfile.name.charAt(0) : 'R', centerX, centerY + 12);
        }

        // Name & Role details
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

        // Info Table Grid
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

        drawItem('পেশা (Occupation)', donorProfile.occupation || 'শিক্ষার্থী', leftColX, 470);
        drawItem('মোবাইল নাম্বার (Phone)', donorProfile.phone || 'N/A', rightColX, 470);

        drawItem('ঠিকানা (Address)', donorProfile.address || donorProfile.location || 'তাহেরপুর', leftColX, 525);
        drawItem('রক্তদান সংখ্যা (Times Donated)', `${donorProfile.donationCount || 0} বার`, rightColX, 525);

        drawItem('যাচাইকরণ মাধ্যম (Verification)', donorProfile.verificationMethod === 'google' ? 'Google Verified' : 'Phone Verified', leftColX, 580);
        drawItem('সর্বশেষ রক্তদান (Last Donation)', donorProfile.lastDonationDate || 'কখনো নয়', rightColX, 580);

        // Global Red Frame border
        const borderGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        borderGrad.addColorStop(0, '#991b1b');
        borderGrad.addColorStop(0.5, '#dc2626');
        borderGrad.addColorStop(1, '#7f1d1d');
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 14;
        ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);

        // Serial block
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'center';
        ctx.font = '10px "Hind Siliguri", monospace';
        ctx.fillText(`VERIFIED ID: RKT-${donorProfile.id.toUpperCase().substring(0, 8)} • CLOUD STORED`, canvas.width / 2, 812);

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
        img.crossOrigin = "anonymous";
        img.onload = () => drawProfileAndContent(img);
        img.onerror = () => drawProfileAndContent();
        img.src = donorProfile.photoURL;
      } else {
        drawProfileAndContent();
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="max-w-md mx-auto glass-card rounded-3xl p-8 border border-white/60 text-center space-y-6 shadow-xl bg-white/90">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2 mx-auto border border-red-100 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-sans text-xl font-black text-gray-950">স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন</h3>
            <p className="font-sans text-xs sm:text-sm text-gray-600 leading-relaxed">
              স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন সম্পন্ন করতে ও আপনার তথ্য ক্লাউডে সংরক্ষণ করতে অনুগ্রহ করে প্রথমে গুগল বা ফোন নাম্বারের মাধ্যমে যাচাইকরণ সম্পন্ন করুন।
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={onOpenAuth}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-red-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <BadgeCheck className="w-5 h-5 text-white" />
              গুগল বা ফোন যাচাইকরণ শুরু করুন
            </button>
          </div>

          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-150 text-left space-y-1.5 text-xs text-gray-500 font-sans">
            <div className="flex items-center gap-1.5 font-bold text-gray-700">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>নিবন্ধনের সুবিধাসমূহ:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
              <li>ক্লাউড স্টোরেজে সুরক্ষিত প্রোফাইল সংরক্ষণ</li>
              <li>রিয়েল-টাইম জিপিএস লোকেশন শেয়ারিং</li>
              <li>জরুরি রক্তের আবেদনে স্বয়ংক্রিয় নোটিফিকেশন এলার্ট</li>
              <li>অনলাইনে ডিজিটাল রক্তদাতা আইডি কার্ড ডাউনলোড</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm text-gray-500">আপনার ক্লাউড প্রোফাইল তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-2xl md:text-3xl font-black text-gray-900">
              স্বেচ্ছাসেবী রক্তদাতা নিবন্ধন পোর্টাল
            </h2>
            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              <CloudCheck className="w-3.5 h-3.5" /> ক্লাউড সিঙ্কড
            </span>
          </div>
          <p className="font-sans text-xs md:text-sm text-gray-500">
            যাচাইকৃত ব্যবহারকারী: <strong className="text-gray-800">{currentUser.displayName || currentUser.email || currentUser.phoneNumber}</strong>
          </p>
        </div>

        {donorProfile && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-xl text-xs font-bold border border-red-200 transition cursor-pointer self-start md:self-auto font-sans"
          >
            <Edit className="w-4 h-4" />
            প্রোফাইল সংশোধন করুন
          </button>
        )}
      </div>

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

      {/* Main Content: Digital Card View (if already registered) OR Comprehensive Form */}
      {donorProfile && !editMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Apple Wallet style Digital Badge Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative overflow-hidden group shadow-2xl transition-transform duration-300 rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-800 to-red-950 -z-10" />
              <div className="p-6 md:p-8 text-white space-y-6 relative border border-white/20">
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-md overflow-hidden">
                      {donorProfile.photoURL ? (
                        <img src={donorProfile.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Heart className="w-6 h-6 fill-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-black tracking-wide uppercase opacity-95">তাহেরপুর রক্তদাতা পরিষদ</h4>
                      <span className="font-sans text-[11px] text-red-200 flex items-center gap-1 font-bold">
                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-300" /> ভেরিফাইড ক্লাউড প্রোফাইল
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/40 shadow-sm bg-white/10 p-0.5">
                      <img 
                        src="/assets/aistudio/file_00000000015c821194aa85f9e857dff1_7ccd5a14.png" 
                        alt="রক্তিম সিল" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <span className="font-sans text-xs bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl font-black border border-white/30 text-white">
                      {donorProfile.bloodGroup}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-red-200 font-semibold">রক্তদাতার নাম (Donor Name)</span>
                  <h3 className="font-sans text-2xl font-black text-white">{donorProfile.name}</h3>
                  <p className="font-sans text-xs text-red-100 flex items-center gap-1 pt-1">
                    <Briefcase className="w-3.5 h-3.5 text-amber-300" /> {donorProfile.occupation || 'স্বেচ্ছাসেবী'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/20 pt-4 text-xs font-sans">
                  <div>
                    <span className="text-[10px] text-red-200/80 block">মোবাইল নাম্বার:</span>
                    <span className="font-bold font-english">{donorProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-200/80 block">রক্তদানের অবস্থা:</span>
                    <span className={`inline-flex items-center gap-1 font-bold ${donorProfile.isAvailable ? 'text-emerald-300' : 'text-gray-300'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${donorProfile.isAvailable ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                      {donorProfile.isAvailable ? 'প্রস্তুত (Ready)' : 'বিশ্রামে'}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-red-200/80 block">ঠিকানা:</span>
                    <span className="font-semibold text-[11px] truncate block">{donorProfile.address || donorProfile.location}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleToggleAvailability}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 border border-red-200 bg-red-50 hover:bg-red-100 rounded-2xl font-sans text-xs sm:text-sm font-bold text-red-700 cursor-pointer shadow-sm transition-colors"
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
                onClick={downloadBadgeAsJpg}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-sans text-xs sm:text-sm font-bold cursor-pointer shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                ডিজিটাল আইডি ডাউনলোড
              </button>
            </div>
          </div>

          {/* Right Column: Donor Profile Meta & Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-4 text-left font-sans">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                ক্লাউড ডাটাবেজ তথ্য (Cloud Record)
              </h4>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px] font-semibold">ইমেইল এড্রেস:</span>
                  <span className="font-bold text-gray-900">{donorProfile.email || 'রেকর্ড নেই'}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px] font-semibold">পেশা ও কর্মক্ষেত্র:</span>
                  <span className="font-bold text-gray-900">{donorProfile.occupation}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px] font-semibold">সম্পূর্ণ ঠিকানা:</span>
                  <span className="font-bold text-gray-900">{donorProfile.address || donorProfile.location}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px] font-semibold">লিঙ্গ ও বয়স:</span>
                    <span className="font-bold text-gray-900">{donorProfile.gender} • {donorProfile.age} বছর</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-400 block text-[10px] font-semibold">রক্তদান সংখ্যা:</span>
                    <span className="font-bold text-emerald-700">{donorProfile.donationCount || 0} বার</span>
                  </div>
                </div>
                {donorProfile.latitude && (
                  <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800">
                    <span className="text-rose-600 block text-[10px] font-bold flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" /> জিপিএস লোকেশন শেয়ারিং সক্রিয়
                    </span>
                    <span className="font-mono text-[11px] block mt-0.5">
                      Lat: {donorProfile.latitude.toFixed(4)}, Lon: {donorProfile.longitude?.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Comprehensive Registration / Edit Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md text-left space-y-6">
          <div className="flex items-center justify-between border-b border-gray-150 pb-4">
            <div>
              <h3 className="font-sans text-xl font-bold text-gray-900">
                {donorProfile ? 'রক্তদাতা প্রোফাইল হালনাগাদ করুন' : 'নতুন রক্তদাতা নিবন্ধন ফরম'}
              </h3>
              <p className="font-sans text-xs text-gray-500 mt-0.5">
                সকল আবশ্যক তথ্য পূরণ করুন। আপনার তথ্য সরাসরি ক্লাউড ডাটাবেজে সংরক্ষিত হবে।
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              <span>যাচাইকৃত সেশন</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6 font-sans">
            
            {/* ROW 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-red-600" />
                  <span>পূর্ণ নাম (Name) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদাঃ মোঃ আবির আহমেদ"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-red-600" />
                  <span>ইমেইল এড্রেস (Email) *</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white font-english"
                />
              </div>
            </div>

            {/* ROW 2: Blood Group, Gender & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                  <span>রক্তের গ্রুপ (Blood Group) *</span>
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-red-300 bg-red-50/30 rounded-xl text-sm font-bold text-red-700 outline-none focus:border-red-500"
                >
                  {bloodGroups.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  লিঙ্গ (Gender) *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                >
                  <option value="পুরুষ">পুরুষ (Male)</option>
                  <option value="নারী">নারী (Female)</option>
                  <option value="অন্যান্য">অন্যান্য (Other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  বয়স (Age ১৮-৬৫) *
                </label>
                <input
                  type="number"
                  min={18}
                  max={65}
                  required
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white font-english"
                />
              </div>
            </div>

            {/* ROW 3: Phone Number & Occupation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>ফোন নাম্বার (Phone Number) *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01712345678"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white font-english"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">জরুরি রক্তের প্রয়োজনে গ্রহীতারা এই নাম্বারে যোগাযোগ করবেন।</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-red-600" />
                  <span>পেশা (Occupation) *</span>
                </label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                >
                  {occupationsList.map((occ) => (
                    <option key={occ} value={occ}>{occ}</option>
                  ))}
                </select>

                {occupation === 'অন্যান্য (Other)' && (
                  <input
                    type="text"
                    required
                    value={customOccupation}
                    onChange={(e) => setCustomOccupation(e.target.value)}
                    placeholder="আপনার পেশা লিখুন"
                    className="w-full mt-2 px-3.5 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:border-red-500 bg-white"
                  />
                )}
              </div>
            </div>

            {/* ROW 4: Detailed Address & Primary Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  <span>সম্পূর্ণ ঠিকানা (Full Address) *</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাড়ি/রোড নং, গ্রাম/পাড়া, ওয়ার্ড, তাহেরপুর"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  প্রধান এলাকা / জোন (তাহেরপুর ও বাগমারা):
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-500 bg-white"
                >
                  {taherpurLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile Photo Upload Option (Direct Device Upload with Size Limit) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-red-600" />
                  <span>প্রোফাইল ছবি (Profile Picture - ডিভাইস থেকে আপলোড):</span>
                </label>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded-lg">
                  সর্বোচ্চ সাইজ: ২ মেগাবাইট (Max 2MB)
                </span>
              </div>

              {/* Hidden File Input for Device Image Selection */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="hidden"
              />

              {photoURL ? (
                <div className="p-3.5 bg-red-50/40 border border-red-200 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-red-500 shadow-md bg-white shrink-0">
                      <img 
                        src={photoURL} 
                        alt="Uploaded donor photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                        ছবি সফলভাবে সংযুক্ত হয়েছে
                      </span>
                      <span className="text-[11px] text-gray-500 block">
                        ডিজিটাল রক্তদাতা আইডি কার্ড ও প্রোফাইল ব্যাজে প্রদর্শিত হবে।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Upload className="w-3 h-3 text-red-600" />
                      <span>পরিবর্তন</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 rounded-xl transition cursor-pointer shadow-xs"
                      title="ছবি মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-red-400 bg-gray-50/70 hover:bg-red-50/30 rounded-2xl p-4 transition-all cursor-pointer text-center space-y-2 group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 mx-auto shadow-xs border border-gray-200 group-hover:scale-105 transition-transform">
                    {imageUploading ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block group-hover:text-red-600 transition-colors">
                      {imageUploading ? 'ছবি আপলোড ও প্রসেসিং হচ্ছে...' : 'ডিভাইস থেকে ছবি আপলোড করুন'}
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      ক্যামেরা বা মোবাইল গ্যালারি থেকে ছবি সিলেক্ট করুন (সর্বোচ্চ সাইজ: ২ এমবি / 2MB)
                    </span>
                  </div>
                </div>
              )}

              {imageError && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-xl flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{imageError}</span>
                </div>
              )}
            </div>

            {/* ROW 5: Real-time GPS Location Detection Box */}
            <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200/80 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-red-600" />
                    রিয়েল-টাইম জিপিএস লোকেশন ট্র্যাকিং (Real-Time Location)
                  </span>
                  <p className="text-[11px] text-gray-600">
                    জরুরি রক্তের প্রয়োজনে নিকটবর্তী গ্রহীতাদের সাথে সহজে যোগাযোগের জন্য জিপিএস স্থানাঙ্ক সংযুক্ত করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={detectingGps}
                  className="flex items-center gap-2 bg-white hover:bg-red-50 text-red-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-red-300 shadow-sm transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
                >
                  {detectingGps ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Compass className="w-4 h-4 text-red-600" />
                  )}
                  {gpsDetected ? 'জিপিএস পুনঃশনাক্ত করুন' : 'বর্তমান লোকেশন শনাক্ত করুন'}
                </button>
              </div>

              {gpsDetected && latitude && longitude && (
                <div className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>লোকেশন শনাক্ত হয়েছে: Lat: {latitude.toFixed(5)}, Lon: {longitude.toFixed(5)} (নির্ভুলতা: ~{Math.round(accuracy || 10)} মি.)</span>
                </div>
              )}
            </div>

            {/* Availability Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsAvailable(!isAvailable)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 border border-gray-200 transition cursor-pointer"
              >
                {isAvailable ? (
                  <ToggleRight className="w-6 h-6 text-red-600 fill-red-100" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-gray-400" />
                )}
                <span>আমি এই মুহূর্তে রক্তদানের জন্য প্রস্তুত ও উপলব্ধ আছি (Available for Donation)</span>
              </button>
            </div>

            {/* Form Action Buttons */}
            <div className="flex gap-3 pt-3 border-t border-gray-200">
              {editMode && (
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-sm transition cursor-pointer"
                >
                  বাতিল করুন
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-5 h-5 text-white" />
                )}
                {donorProfile ? 'ক্লাউডে পরিবর্তন সংরক্ষণ করুন' : 'রক্তদাতা হিসেবে নিবন্ধন সম্পন্ন করুন'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
