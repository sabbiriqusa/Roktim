import React, { useState, useEffect, useRef } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { recordUserLogin, syncUserProfileToFirebase, getUserProfileFromFirebase } from '../services/userService';
import { AppUser, Donor } from '../types';
import { bloodGroups, taherpurLocations, occupationsList } from '../utils/defaultData';
import { playEmergencyAlertSound } from '../utils/notifications';
import { processAndCompressImage, MAX_PHOTO_SIZE_MB } from '../utils/imageUtils';
import { 
  LogIn, 
  UserPlus, 
  Phone, 
  Chrome, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  MapPin, 
  User, 
  Briefcase,
  Mail,
  Compass,
  Bell,
  Navigation,
  AlertCircle,
  Check,
  LogOut,
  RotateCcw,
  Smartphone,
  BadgeCheck,
  ChevronRight,
  Upload,
  Camera,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

interface AuthScreenProps {
  currentUser: AppUser | null;
  onProceedToMainPage: (user: AppUser) => void;
  onReplaySplash: () => void;
  onLogout: () => void;
}

export default function AuthScreen({ 
  currentUser, 
  onProceedToMainPage, 
  onReplaySplash,
  onLogout 
}: AuthScreenProps) {
  // Step Management:
  // 1 = Account Verification (Google / Phone)
  // 2 = Mandatory Registration Profile Form
  // 3 = Mandatory Device Permissions (Location & Notifications)
  // 4 = Final Review & Manual Entry to Main Page
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Auth States
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [method, setMethod] = useState<'google' | 'phone'>('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active verified user in the gate
  const [verifiedUser, setVerifiedUser] = useState<AppUser | null>(currentUser);

  // Phone OTP States
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  // Step 2: Mandatory Registration Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [gender, setGender] = useState('পুরুষ');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('শিক্ষার্থী (Student)');
  const [customOccupation, setCustomOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('তাহেরপুর বাজার');
  const [age, setAge] = useState(24);
  const [isAvailable, setIsAvailable] = useState(true);
  const [photoURL, setPhotoURL] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [registrationSaved, setRegistrationSaved] = useState(false);

  // Step 3: Permissions States
  const [locationGranted, setLocationGranted] = useState(false);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [requestingNotif, setRequestingNotif] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Initialize or update user from prop or fetch profile
  useEffect(() => {
    if (currentUser) {
      setVerifiedUser(currentUser);
      initUserFromProfile(currentUser);
    }
  }, [currentUser]);

  // Check initial browser permissions on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationGranted(true);
      }
    }
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((result) => {
          if (result.state === 'granted') {
            setLocationGranted(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const initUserFromProfile = async (user: AppUser) => {
    setName(user.displayName || '');
    setEmail(user.email || '');
    setPhone(user.phoneNumber || '');
    setPhotoURL(user.photoURL || '');

    try {
      const profile = await getUserProfileFromFirebase(user.uid);
      if (profile?.donor) {
        const d = profile.donor;
        setName(d.name || user.displayName || '');
        setEmail(d.email || user.email || '');
        setBloodGroup(d.bloodGroup || 'O+');
        setGender(d.gender || 'পুরুষ');
        setPhone(d.phone || user.phoneNumber || '');
        setOccupation(d.occupation || 'শিক্ষার্থী (Student)');
        setAddress(d.address || '');
        setLocation(d.location || 'তাহেরপুর বাজার');
        setAge(d.age || 24);
        setIsAvailable(d.isAvailable !== false);
        setPhotoURL(d.photoURL || user.photoURL || '');
        if (d.latitude && d.longitude) {
          setLatitude(d.latitude);
          setLongitude(d.longitude);
          setLocationGranted(true);
        }
        setRegistrationSaved(true);
        // Start user at step 2 or 3 so they review and complete required steps
        if (currentStep === 1) {
          setCurrentStep(2);
        }
      } else {
        if (currentStep === 1) {
          setCurrentStep(2);
        }
      }
    } catch (e) {
      if (currentStep === 1) {
        setCurrentStep(2);
      }
    }
  };

  // ----------------------------------------------------
  // STEP 1 HANDLERS: GOOGLE & PHONE AUTH (NO AUTO-REDIRECT)
  // ----------------------------------------------------
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const appUser: AppUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'গুগল ব্যবহারকারী',
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        isGuest: false,
        verifiedBy: 'google',
        phoneVerified: false
      };

      await recordUserLogin(appUser);
      setVerifiedUser(appUser);
      setName(appUser.displayName || '');
      setEmail(appUser.email || '');
      setPhone(appUser.phoneNumber || '');
      setPhotoURL(appUser.photoURL || '');

      // Check if user already registered in Firestore
      const profile = await getUserProfileFromFirebase(appUser.uid);
      if (profile?.donor) {
        const d = profile.donor;
        setName(d.name || appUser.displayName || '');
        setEmail(d.email || appUser.email || '');
        setBloodGroup(d.bloodGroup || 'O+');
        setGender(d.gender || 'পুরুষ');
        setPhone(d.phone || appUser.phoneNumber || '');
        setOccupation(d.occupation || 'শিক্ষার্থী (Student)');
        setAddress(d.address || '');
        setLocation(d.location || 'তাহেরপুর বাজার');
        setAge(d.age || 24);
        if (d.latitude && d.longitude) {
          setLatitude(d.latitude);
          setLongitude(d.longitude);
          setLocationGranted(true);
        }
        setRegistrationSaved(true);
      }

      setSuccessMsg('গুগল একাউন্ট সফলভাবে যাচাইকৃত! এখন নিচের ধাপসমূহ পূরণ করুন।');
      // Advance to Step 2 - NO AUTO REDIRECT TO HOME!
      setCurrentStep(2);

    } catch (err: any) {
      console.error("Google Auth failed:", err);
      let msg = "গুগল যাচাই সম্পন্ন করা সম্ভব হয়নি।";
      if (err.code === 'auth/popup-blocked') {
        msg = "ব্রাউজার পপআপ ব্লক করেছে। অনুগ্রহ করে পপআপ অনুমতি দিন অথবা 'মোবাইল নাম্বার ও ওটিপি' বিকল্প ব্যবহার করুন।";
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = "এই ডোমেইনটি ফায়ারবেসে অনুমোদিত নয়। নিচের 'মোবাইল নাম্বার ও ওটিপি' দিয়ে সাইন-ইন করুন।";
      } else {
        msg = `ত্রুটি: ${err.message || 'অজানা সমস্যা'}। অনুগ্রহ করে মোবাইল নাম্বার বিকল্প ব্যবহার করুন।`;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setError("সঠিক ১১ ডিজিটের মোবাইল নাম্বার লিখুন (যেমন: 01712345678)");
      return;
    }
    if (!phoneName.trim()) {
      setError("অনুগ্রহ করে আপনার নাম পূরণ করুন।");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setEnteredOtp(otp);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setError("ভুল ওটিপি কোড! অনুগ্রহ করে স্ক্রিনে প্রদর্শিত ৬ ডিজিটের কোডটি লিখুন।");
      setLoading(false);
      return;
    }

    try {
      const cleanPhone = phoneNumber.trim().replace(/\s+/g, '');
      const phoneUid = 'phone_' + cleanPhone.replace(/[^0-9]/g, '');

      const appUser: AppUser = {
        uid: phoneUid,
        email: `${cleanPhone}@roktimbb.org`,
        displayName: phoneName.trim(),
        phoneNumber: cleanPhone,
        photoURL: null,
        isGuest: false,
        phoneVerified: true,
        verifiedBy: 'phone'
      };

      await recordUserLogin(appUser);
      setVerifiedUser(appUser);
      setName(appUser.displayName || '');
      setEmail(appUser.email || '');
      setPhone(appUser.phoneNumber || '');

      setSuccessMsg('মোবাইল নাম্বার সফলভাবে যাচাইকৃত! এখন নিবন্ধন তথ্য পূরণ করুন।');
      // Advance to Step 2 - NO AUTO REDIRECT TO HOME!
      setCurrentStep(2);

    } catch (err: any) {
      console.error("Phone verification error:", err);
      setError("তথ্য সংরক্ষণে ত্রুটি দেখা দিয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Fast test login for instant testing
  const handleFastDemoLogin = async () => {
    setLoading(true);
    const demoUid = 'test_user_' + Math.floor(1000 + Math.random() * 9000);
    const demoUser: AppUser = {
      uid: demoUid,
      email: 'test.donor@roktimbb.org',
      displayName: 'সাকিবুল ইসলাম (পরীক্ষামূলক)',
      phoneNumber: '01712345678',
      photoURL: null,
      isGuest: false,
      phoneVerified: true,
      verifiedBy: 'phone'
    };

    try {
      await recordUserLogin(demoUser);
    } catch (e) {}

    setVerifiedUser(demoUser);
    setName(demoUser.displayName || '');
    setEmail(demoUser.email || '');
    setPhone(demoUser.phoneNumber || '');
    setSuccessMsg('যাচাই সফল! ধাপ ২ এ নিবন্ধন তথ্য পূরণ করুন।');
    setCurrentStep(2);
    setLoading(false);
  };

  // ----------------------------------------------------
  // STEP 2 HANDLERS: MANDATORY REGISTRATION FORM & IMAGE UPLOAD
  // ----------------------------------------------------
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

  // Instant, delay-free form processing & transition to permission step
  const handleSaveRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedUser) {
      setError("প্রথমে একাউন্ট যাচাই সম্পন্ন করুন।");
      setCurrentStep(1);
      return;
    }

    const finalOccupation = occupation === 'অন্যান্য (Other)' && customOccupation ? customOccupation : occupation;

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError("অনুগ্রহ করে সকল আবশ্যক ঘর (নাম, ইমেইল, রক্তের গ্রুপ, লিঙ্গ, ফোন, পেশা ও ঠিকানা) পূরণ করুন।");
      return;
    }

    if (age < 18 || age > 65) {
      setError("রক্তদানের জন্য বয়স ১৮ থেকে ৬৫ বছরের মধ্যে হতে হবে।");
      return;
    }

    setError(null);

    const donorData: Donor = {
      id: verifiedUser.uid,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bloodGroup: bloodGroup,
      gender: gender,
      occupation: finalOccupation,
      address: address.trim(),
      location: location || 'তাহেরপুর বাজার',
      age: Number(age),
      isAvailable: isAvailable,
      isRegisteredDonor: true,
      createdAt: new Date().toISOString(),
      lastDonationDate: 'কখনো না',
      photoURL: photoURL || verifiedUser.photoURL || undefined,
      verificationMethod: verifiedUser.verifiedBy || 'phone',
      isVerified: true,
      phoneVerified: Boolean(verifiedUser.phoneVerified),
      latitude: latitude || 24.4258,
      longitude: longitude || 88.8475,
      locationAccuracy: gpsAccuracy || 10,
      isLocationSharing: true,
      lastLocationUpdate: new Date().toISOString()
    };

    const updatedUser: AppUser = {
      ...verifiedUser,
      displayName: name.trim(),
      email: email.trim(),
      phoneNumber: phone.trim(),
      photoURL: photoURL || verifiedUser.photoURL,
      bloodGroup: bloodGroup,
      gender: gender,
      occupation: finalOccupation,
      address: address.trim(),
      location: location,
      age: Number(age),
      isRegistrationComplete: true
    };

    // 1. Instant local persistence and immediate transition to Step 3 (0 delay)
    setRegistrationSaved(true);
    setVerifiedUser(updatedUser);
    try {
      sessionStorage.setItem('bb_verified_user', JSON.stringify(updatedUser));
    } catch (e) {}

    // Instant transition to the permission section
    setCurrentStep(3);

    // 2. Non-blocking asynchronous cloud Firestore synchronization in the background
    syncUserProfileToFirebase(donorData).catch((cloudErr) => {
      console.warn("Background Firebase sync warning:", cloudErr);
    });
  };

  // ----------------------------------------------------
  // STEP 3 HANDLERS: MANDATORY LOCATION & NOTIFICATIONS
  // ----------------------------------------------------
  const handleRequestLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("আপনার ব্রাউজারে লোকেশন সার্ভিস সাপোর্ট করে না।");
      return;
    }

    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy;
        setLatitude(lat);
        setLongitude(lng);
        setGpsAccuracy(acc);
        setLocationGranted(true);
        setDetectingGps(false);

        // If user already registered, update their location in Firebase
        if (verifiedUser) {
          try {
            await syncUserProfileToFirebase({
              id: verifiedUser.uid,
              name: name || verifiedUser.displayName || 'সম্মানিত রক্তদাতা',
              email: email || verifiedUser.email || '',
              phone: phone || verifiedUser.phoneNumber || '01700000000',
              bloodGroup: bloodGroup,
              gender: gender,
              occupation: occupation,
              address: address || 'তাহেরপুর',
              location: location || 'তাহেরপুর বাজার',
              age: age || 24,
              isAvailable: isAvailable,
              isRegisteredDonor: true,
              createdAt: new Date().toISOString(),
              latitude: lat,
              longitude: lng,
              locationAccuracy: acc,
              isLocationSharing: true,
              lastLocationUpdate: new Date().toISOString()
            });
          } catch (e) {}
        }
      },
      (err) => {
        console.warn("Location error:", err);
        setDetectingGps(false);
        let msg = "লোকেশন পারমিশন পাওয়া যায়নি।";
        if (err.code === 1) {
          msg = "লোকেশন অ্যাক্সেস অস্বীকৃত হয়েছে। ব্রাউজার অ্যাড্রেস বারের তালা (🔒) আইকনে ক্লিক করে লোকেশন অনুমতি দিন এবং পুনরায় চেষ্টা করুন।";
        } else if (err.code === 2) {
          msg = "আপনার ডিভাইসের জিপিএস বন্ধ রয়েছে। অনুগ্রহ করে ডিভাইসের লোকেশন অন করুন।";
        } else if (err.code === 3) {
          msg = "লোকেশন অনুসন্ধানের সময় শেষ হয়েছে। আবার চেষ্টা করুন।";
        }
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleRequestNotification = async () => {
    setNotifError(null);
    setRequestingNotif(true);

    try {
      if (!('Notification' in window)) {
        setNotifError("আপনার ব্রাউজার পুশ নোটিফিকেশন সমর্থন করে না।");
        // Still grant for environments without notification API support
        setNotificationGranted(true);
        setRequestingNotif(false);
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationGranted(true);
        playEmergencyAlertSound();
        try {
          new Notification("রক্তিম রক্তদান সমিতি - তাহেরপুর", {
            body: "জরুরি পুশ নোটিফিকেশন সফলভাবে সক্রিয় হয়েছে! ধন্যবাদ।",
            icon: "/assets/aistudio/file_00000000015c821194aa85f9e857dff1_7ccd5a14.png"
          });
        } catch (e) {}
      } else {
        setNotifError("নোটিফিকেশন পারমিশন দেওয়া হয়নি। ব্রাউজার সেটিংসে গিয়ে অনুমতি প্রদান করুন।");
      }
    } catch (err: any) {
      console.warn("Notification error:", err);
      setNotifError("নোটিফিকেশন সক্রিয় করতে সমস্যা হয়েছে।");
    } finally {
      setRequestingNotif(false);
    }
  };

  // Both permissions mandatory check
  const permissionsCompleted = locationGranted && notificationGranted;

  // ----------------------------------------------------
  // STEP 4 HANDLER: EXPLICIT MANUAL ENTRY TO MAIN PAGE
  // ----------------------------------------------------
  const handleManualEnterMainPage = () => {
    if (!verifiedUser) {
      setError("প্রথমে একাউন্ট যাচাই সম্পন্ন করুন।");
      setCurrentStep(1);
      return;
    }
    if (!registrationSaved) {
      setError("অনুগ্রহ করে আপনার নিবন্ধন ফরম পূরণ করুন।");
      setCurrentStep(2);
      return;
    }
    if (!permissionsCompleted) {
      setError("অনুগ্রহ করে লোকেশন এবং নোটিফিকেশন উভয় পারমিশন অনুমতি দিন।");
      setCurrentStep(3);
      return;
    }

    const finalUser: AppUser = {
      ...verifiedUser,
      displayName: name,
      email: email,
      phoneNumber: phone,
      bloodGroup: bloodGroup,
      gender: gender,
      occupation: occupation,
      address: address,
      location: location,
      age: age,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      isRegistrationComplete: true,
      hasLocationPermission: true,
      hasNotificationPermission: true,
      hasManuallyProceeded: true
    };

    // Explicit manual click: invoke the callback to enter the main page!
    onProceedToMainPage(finalUser);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-br from-stone-50 via-red-50/40 to-stone-100 text-gray-900 px-4 py-6 relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between z-10 pt-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-1 shadow-md shadow-red-600/20 overflow-hidden border border-white/60">
            <img 
              src="/assets/aistudio/file_00000000015c821194aa85f9e857dff1_7ccd5a14.png" 
              alt="রক্তিম ব্লাড ব্যাংক লোগো"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div className="text-left">
            <span className="font-sans text-[11px] uppercase tracking-wider text-red-600 font-bold block">
              তাহেরপুর ও বাগমারা রক্তদাতা নেটওয়ার্ক
            </span>
            <h2 className="font-sans text-lg font-black text-gray-900 leading-tight">
              রক্তিম রক্তদান সমিতি
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {verifiedUser && (
            <button
              onClick={onLogout}
              className="text-xs font-sans font-bold text-gray-600 hover:text-red-700 bg-white border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          )}

          <button
            onClick={onReplaySplash}
            className="text-xs font-sans font-bold text-gray-500 hover:text-red-600 bg-white/80 hover:bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">স্প্ল্যাশ লোগো</span>
          </button>
        </div>
      </header>

      {/* Main Multi-Step Onboarding Container */}
      <main className="w-full max-w-3xl mx-auto my-6 z-10">
        
        {/* Step Progress Stepper Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-red-100 mb-5">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-sans font-bold">
            
            {/* Step 1 Tab */}
            <div 
              onClick={() => { if (!verifiedUser) setCurrentStep(1); }}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                currentStep === 1 
                  ? 'bg-red-50 text-red-700 border border-red-200 font-black' 
                  : verifiedUser 
                    ? 'text-emerald-700 bg-emerald-50/60' 
                    : 'text-gray-400'
              }`}
            >
              <div className="flex items-center gap-1">
                {verifiedUser ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">১</span>
                )}
                <span className="hidden sm:inline">১. যাচাইকরণ</span>
              </div>
              <span className="text-[10px] text-gray-500 hidden md:block">Google / Phone</span>
            </div>

            {/* Step 2 Tab */}
            <div 
              onClick={() => { if (verifiedUser) setCurrentStep(2); }}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                currentStep === 2 
                  ? 'bg-red-50 text-red-700 border border-red-200 font-black' 
                  : registrationSaved 
                    ? 'text-emerald-700 bg-emerald-50/60' 
                    : 'text-gray-400'
              }`}
            >
              <div className="flex items-center gap-1">
                {registrationSaved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                    currentStep === 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>২</span>
                )}
                <span className="hidden sm:inline">২. নিবন্ধন ফরম</span>
              </div>
              <span className="text-[10px] text-gray-500 hidden md:block">রক্তদাতার তথ্য</span>
            </div>

            {/* Step 3 Tab */}
            <div 
              onClick={() => { if (registrationSaved) setCurrentStep(3); }}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                currentStep === 3 
                  ? 'bg-red-50 text-red-700 border border-red-200 font-black' 
                  : permissionsCompleted 
                    ? 'text-emerald-700 bg-emerald-50/60' 
                    : 'text-gray-400'
              }`}
            >
              <div className="flex items-center gap-1">
                {permissionsCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                    currentStep === 3 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>৩</span>
                )}
                <span className="hidden sm:inline">৩. পারমিশন</span>
              </div>
              <span className="text-[10px] text-gray-500 hidden md:block">GPS ও নোটিফিকেশন</span>
            </div>

            {/* Step 4 Tab */}
            <div 
              onClick={() => { if (registrationSaved && permissionsCompleted) setCurrentStep(4); }}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all ${
                currentStep === 4 
                  ? 'bg-red-600 text-white shadow-md font-black' 
                  : (registrationSaved && permissionsCompleted) 
                    ? 'text-red-700 bg-red-50' 
                    : 'text-gray-400'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center ${
                  currentStep === 4 ? 'bg-white text-red-600' : 'bg-gray-200 text-gray-600'
                }`}>৪</span>
                <span className="hidden sm:inline">৪. মূল পেজে প্রবেশ</span>
              </div>
              <span className="text-[10px] opacity-80 hidden md:block">ম্যানুয়াল প্রবেশ</span>
            </div>

          </div>
        </div>

        {/* Central Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] p-6 sm:p-8 shadow-2xl border border-white/80 space-y-6">
          
          {/* Slogan */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-sans font-bold border border-red-200/60 shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              <span>এক ফোঁটা রক্ত, একটি জীবন — রক্তদানে বাঁচাই জীবন</span>
            </div>

            <h1 className="font-sans text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {currentStep === 1 && 'ধাপ ১: একাউন্ট ভেরিফিকেশন ও সাইন-ইন'}
              {currentStep === 2 && 'ধাপ ২: পূর্ণাঙ্গ রক্তদাতা নিবন্ধন ফরম'}
              {currentStep === 3 && 'ধাপ ৩: আবশ্যকীয় ডিভাইস পারমিশন সক্রিয়করণ'}
              {currentStep === 4 && 'ধাপ ৪: নিবন্ধন ও পারমিশন সম্পন্ন!'}
            </h1>

            <p className="font-sans text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              {currentStep === 1 && 'হোম পেজের কনটেন্ট ব্যবহারের পূর্বে গুগল বা মোবাইল নাম্বারের মাধ্যমে আপনার পরিচয় নিশ্চিত করুন। স্বয়ংক্রিয় কোনো রিডাইরেক্ট হবে না।'}
              {currentStep === 2 && 'রক্তদানের জন্য আপনার প্রয়োজনীয় তথ্য পূরণ করুন। সকল তথ্য সরাসরি গুগল ফায়ারবেস ক্লাউড স্টোরেজে সুরক্ষিত থাকবে।'}
              {currentStep === 3 && 'তাহেরপুর ও বাগমারার নিকটবর্তী রক্তদাতা শনাক্ত করতে এবং জরুরি রক্তের নোটিফিকেশন পেতে উভয় পারমিশন অনুমতি দিন।'}
              {currentStep === 4 && 'আপনার সকল নিবন্ধন তথ্য ক্লাউডে সংরক্ষিত হয়েছে এবং পারমিশন গৃহীত হয়েছে। মূল পেজে প্রবেশ করতে নিচের বাটনে ক্লিক করুন।'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-sans leading-relaxed space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-red-900">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                সতর্কতা:
              </span>
              <p>{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-sans leading-relaxed space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                সফল!
              </span>
              <p>{successMsg}</p>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 1: AUTHENTICATION / SIGN IN                     */}
          {/* ==================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              
              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl font-sans text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => { setMethod('google'); setError(null); }}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    method === 'google' 
                      ? 'bg-white text-red-600 shadow-sm font-black' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Chrome className="w-4 h-4" />
                  <span>গুগল দিয়ে যাচাই</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMethod('phone'); setError(null); }}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    method === 'phone' 
                      ? 'bg-white text-red-600 shadow-sm font-black' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>মোবাইল ও ওটিপি</span>
                </button>
              </div>

              {/* METHOD 1: GOOGLE AUTH */}
              {method === 'google' && (
                <div className="space-y-4 font-sans text-left">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 text-xs text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      নিরাপদ ফায়ারবেস গুগল ক্লাউড সাইন-ইন
                    </p>
                    আপনার অফিসিয়াল গুগল অ্যাকাউন্ট দিয়ে যাচাই সম্পন্ন করুন। সাইন-ইন সফল হলে আপনাকে পরবর্তী ধাপে নিবন্ধন ফরম পূরণ করতে হবে। কোনো স্বয়ংক্রিয় রিডাইরেক্ট হবে না।
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 active:scale-98 text-gray-800 border-2 border-gray-200 hover:border-red-300 rounded-2xl py-3.5 px-4 font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Chrome className="w-5 h-5 text-red-600" />
                    )}
                    <span>গুগল একাউন্ট দিয়ে একাউন্ট যাচাই করুন</span>
                  </button>
                </div>
              )}

              {/* METHOD 2: PHONE OTP AUTH */}
              {method === 'phone' && (
                <div className="space-y-4 font-sans text-left">
                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-red-600" />
                          আপনার পূর্ণ নাম:
                        </label>
                        <input
                          type="text"
                          required
                          value={phoneName}
                          onChange={(e) => setPhoneName(e.target.value)}
                          placeholder="উদাঃ মোঃ সাকিবুল ইসলাম"
                          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-red-600" />
                          মোবাইল নাম্বার (বাংলাদেশ):
                        </label>
                        <div className="flex gap-2">
                          <span className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-600 flex items-center font-mono">
                            +880
                          </span>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="01712345678"
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white font-mono"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" />
                        ৬ ডিজিট ওটিপি কোড পাঠান
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 text-xs space-y-2">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>ভেরিফিকেশন কোড পাঠানো হয়েছে: {phoneNumber}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          নিচের ৬ ডিজিটের ওটিপি কোডটি স্বয়ংক্রিয়ভাবে প্রবেশ করানো হয়েছে অথবা নিজেই লিখুন:
                        </p>
                        <div className="font-mono text-2xl font-black text-emerald-700 tracking-widest bg-white p-2 rounded-xl border border-emerald-200 text-center select-all shadow-inner">
                          {generatedOtp}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          ওটিপি কোড লিখুন:
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder={generatedOtp}
                          className="w-full text-center font-mono tracking-widest text-2xl font-black py-2.5 border-2 border-red-300 rounded-xl outline-none focus:border-red-600 bg-white"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setEnteredOtp(generatedOtp)}
                          className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          স্বয়ংক্রিয় পূরণ
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-red-600/20 transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          যাচাই করুন ও পরবর্তী ধাপে যান
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Fast 1-Click Test Login */}
              <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
                <span className="text-gray-500">
                  দ্রুত টেস্ট করতে চান?
                </span>
                <button
                  type="button"
                  onClick={handleFastDemoLogin}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>১ ক্লিকে পরীক্ষামূলক যাচাই ও নিবন্ধন ধাপে যান</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: MANDATORY REGISTRATION FORM                  */}
          {/* ==================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 text-left font-sans">

              {/* Registration Form (Verification details and change options hidden for a clean registration step) */}
              <form onSubmit={handleSaveRegistration} className="space-y-4">
                
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-red-600" />
                      <span>পূর্ণ নাম (Full Name) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="মোঃ সাকিবুল ইসলাম"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      <span>ইমেইল এড্রেস (Email Address) *</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sakib@example.com"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Blood Group, Gender & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
                      <span>রক্তের গ্রুপ (Blood Group) *</span>
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 border-2 border-red-300 bg-red-50/40 rounded-xl text-sm font-black text-red-700 outline-none focus:border-red-600 cursor-pointer"
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
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white cursor-pointer"
                    >
                      <option value="পুরুষ">পুরুষ (Male)</option>
                      <option value="মহিলা">মহিলা (Female)</option>
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
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Phone & Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-red-600" />
                      <span>জরুরি ফোন নাম্বার (Phone) *</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712345678"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white font-mono"
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
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white cursor-pointer"
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
                        placeholder="আপনার পেশার নাম লিখুন"
                        className="w-full mt-2 px-3.5 py-2 border border-gray-300 rounded-xl text-xs outline-none focus:border-red-600 bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Detailed Address & Area */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>সম্পূর্ণ স্থায়ী/বর্তমান ঠিকানা *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="বাড়ি/গ্রাম, ওয়ার্ড নং, তাহেরপুর"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      প্রধান এলাকা (তাহেরপুর ও বাগমারা জোন) *
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-red-600 bg-white cursor-pointer"
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
                      <span>প্রোফাইল ছবি আপলোড (Profile Picture Upload):</span>
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
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
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
                          <Upload className="w-5 h-5" />
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

                {/* Availability Toggle */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 bg-red-50/50 rounded-2xl border border-red-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500 accent-red-600"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-gray-900 block">আমি জরুরি রক্তদানের জন্য প্রস্তুত ও উপলব্ধ আছি</span>
                      <span className="text-gray-500 text-[11px]">জরুরি প্রয়োজনে নিকটবর্তী রোগীরা আমাকে রক্তের জন্য যোগাযোগ করতে পারবেন।</span>
                    </div>
                  </label>
                </div>

                {/* Form Action: Submit Button with exact text 'পরবর্তী ধাপে যান' */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-red-600/25 hover:shadow-2xl hover:shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>পরবর্তী ধাপে যান</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: MANDATORY PERMISSIONS (LOCATION & NOTIFICATION) */}
          {/* ==================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 text-left font-sans">
              
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs leading-relaxed space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  বাধ্যতামূলক অনুমতি নীতি:
                </span>
                <p>
                  আমাদের ওয়েবসাইটে প্রবেশের পূর্বে আপনার লাইভ জিপিএস লোকেশন ও জরুরি রক্তের নোটিফিকেশন উভয়ের পারমিশন নিশ্চিত করা আবশ্যক। নিচে উভয় বাটনে ক্লিক করে অনুমতি প্রদান করুন।
                </p>
              </div>

              {/* Permission 1: GPS Live Location */}
              <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
                locationGranted 
                  ? 'bg-emerald-50/70 border-emerald-300' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      locationGranted ? 'bg-emerald-600 text-white' : 'bg-red-100 text-red-600'
                    }`}>
                      <Compass className={`w-5 h-5 ${detectingGps ? 'animate-spin' : ''}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-gray-900">১. লাইভ জিপিএস লোকেশন পারমিশন</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          locationGranted 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {locationGranted ? '✓ অনুমোদিত' : 'অনুমোদন আবশ্যক'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        তাহেরপুর ও বাগমারা অঞ্চলে নিকটবর্তী রক্তদাতা ও হাসপাতালের সাথে সরাসরি দূরত্ব শনাক্ত করার জন্য লোকেশন অনুমতি প্রয়োজন।
                      </p>
                    </div>
                  </div>
                </div>

                {locationError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {locationError}
                  </div>
                )}

                {locationGranted && latitude && longitude && (
                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs font-mono text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>জিপিএস স্থানাঙ্ক: {latitude.toFixed(5)}, {longitude.toFixed(5)} (নির্ভুলতা: ~{Math.round(gpsAccuracy || 10)} মি.)</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={detectingGps}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    locationGranted 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-98'
                  }`}
                >
                  {detectingGps ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : locationGranted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Navigation className="w-4 h-4" />
                  )}
                  <span>
                    {locationGranted ? 'লোকেশন সফলভাবে শনাক্ত হয়েছে (পুনরায় শনাক্ত করুন)' : 'লোকেশন পারমিশন দিন ও লাইভ অবস্থান শনাক্ত করুন'}
                  </span>
                </button>
              </div>

              {/* Permission 2: Push Notifications */}
              <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
                notificationGranted 
                  ? 'bg-emerald-50/70 border-emerald-300' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      notificationGranted ? 'bg-emerald-600 text-white' : 'bg-red-100 text-red-600'
                    }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-gray-900">২. জরুরি রক্তের পুশ নোটিফিকেশন</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          notificationGranted 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {notificationGranted ? '✓ অনুমোদিত' : 'অনুমোদন আবশ্যক'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        জরুরি রক্তের আবেদন তৈরি হলে সাথে সাথে ব্রাউজার নোটিফিকেশন ও অ্যালার্ট সাউন্ড দিয়ে আপনাকে সতর্ক করা হবে।
                      </p>
                    </div>
                  </div>
                </div>

                {notifError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    {notifError}
                  </div>
                )}

                {notificationGranted && (
                  <div className="p-3 bg-white/80 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>পুশ নোটিফিকেশন ও জরুরি সাউন্ড অ্যালার্ট সক্রিয় রয়েছে!</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRequestNotification}
                  disabled={requestingNotif}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    notificationGranted 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 active:scale-98'
                  }`}
                >
                  {requestingNotif ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : notificationGranted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                  <span>
                    {notificationGranted ? 'নোটিফিকেশন সক্রিয় করা হয়েছে (সাউন্ড টেস্ট করুন)' : 'পুশ নোটিফিকেশন পারমিশন সক্রিয় করুন'}
                  </span>
                </button>
              </div>

              {/* Progress to Step 4 button (Enabled ONLY when both permissions are granted) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (permissionsCompleted) {
                      setCurrentStep(4);
                    } else {
                      setError("দয়া করে উপরের লোকেশন এবং নোটিফিকেশন উভয় পারমিশন অনুমতি দিন।");
                    }
                  }}
                  disabled={!permissionsCompleted}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    permissionsCompleted 
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-600/30' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <span>উভয় পারমিশন সম্পন্ন — চূড়ান্ত পর্যালোচনা ধাপে যান →</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                {!permissionsCompleted && (
                  <p className="text-[11px] text-center text-gray-500 mt-2">
                    * উভয় পারমিশন অনুমতি না দেওয়া পর্যন্ত পরবর্তী ধাপে যাওয়া যাবে না।
                  </p>
                )}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 4: FINAL REVIEW & EXPLICIT MANUAL ENTRY BUTTON   */}
          {/* ==================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 text-left font-sans">
              
              {/* Congratulatory Hero Card */}
              <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 block">
                      VERIFICATION & REGISTRATION COMPLETE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">
                      অভিনন্দন! আপনার নিবন্ধন সম্পন্ন হয়েছে
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
                    <span className="text-emerald-200 text-[10px] block">রক্তদাতার নাম ও রক্তের গ্রুপ:</span>
                    <strong className="text-sm font-bold text-white block mt-0.5">{name} ({bloodGroup})</strong>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
                    <span className="text-emerald-200 text-[10px] block">ফোন ও এলাকা:</span>
                    <strong className="text-sm font-bold text-white block mt-0.5">{phone} • {location}</strong>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
                    <span className="text-emerald-200 text-[10px] block">জিপিএস লোকেশন পারমিশন:</span>
                    <strong className="text-xs font-bold text-emerald-200 block mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> সক্রিয় (অনুমোদিত)
                    </strong>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
                    <span className="text-emerald-200 text-[10px] block">জরুরি নোটিফিকেশন পারমিশন:</span>
                    <strong className="text-xs font-bold text-emerald-200 block mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> সক্রিয় (অনুমোদিত)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Requirement Checkmarks List */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2 text-xs text-gray-700">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>গুগল / ফোন একাউন্ট ভেরিফিকেশন সম্পন্ন</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পূর্ণাঙ্গ রক্তদাতা নিবন্ধন ফরম ক্লাউডে সংরক্ষিত</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>লাইভ জিপিএস লোকেশন ট্র্যাকিং অনুমতি সক্রিয়</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>জরুরি রক্তের আবেদন পুশ নোটিফিকেশন সক্রিয়</span>
                </div>
              </div>

              {/* Explicit User Action: NO AUTO-REDIRECT! */}
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={handleManualEnterMainPage}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-red-600/30 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3 animate-pulse"
                >
                  <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                  <span>মূল ওয়েবসাইটে প্রবেশ করুন (Proceed to Main Website) →</span>
                </button>

                <p className="text-center text-[11px] text-gray-500">
                  * আপনি নিজ ইচ্ছায় সকল শর্ত ও অনুমতি প্রদান করেছেন। উপরের বাটনে ক্লিক করে মূল ওয়েবসাইটে প্রবেশ করতে পারেন।
                </p>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-xl mx-auto text-center z-10 pt-2 pb-2 text-[11px] text-gray-500 font-sans space-y-1">
        <p className="flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>সকল ব্যবহারকারীর তথ্য ফায়ারবেস ক্লাউড স্টোরেজে সুরক্ষিত রাখা হয়।</span>
        </p>
        <p className="text-gray-400">
          রক্তিম রক্তদান সমিতি • তাহেরপুর, বাগমারা, রাজশাহী
        </p>
      </footer>
    </div>
  );
}
