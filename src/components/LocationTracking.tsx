import React, { useState, useEffect } from 'react';
import { Donor, AppUser } from '../types';
import { defaultDonors, bloodGroups } from '../utils/defaultData';
import { calculateDistanceKm } from '../utils/notifications';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Compass, MapPin, Navigation, Phone, MessageSquare, ShieldCheck, 
  ExternalLink, Radio, CheckCircle, RefreshCw, AlertCircle, Hospital, Heart 
} from 'lucide-react';

interface LocationTrackingProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
  onSelectDonor?: (donor: Donor) => void;
}

export default function LocationTracking({ currentUser, onOpenAuth }: LocationTrackingProps) {
  // User's own live coordinates
  const [userLat, setUserLat] = useState<number>(24.4258); // Taherpur default
  const [userLng, setUserLng] = useState<number>(88.8475);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [hasUserLocation, setHasUserLocation] = useState<boolean>(false);
  const [isSharingLocation, setIsSharingLocation] = useState<boolean>(false);

  // Filter states
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedRadius, setSelectedRadius] = useState<number>(15); // km
  const [availableOnly, setAvailableOnly] = useState<boolean>(true);

  // Donors from Firestore & Defaults
  const [donors, setDonors] = useState<Donor[]>(defaultDonors);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // Hospitals nearby Taherpur & Rajshahi
  const emergencyHospitals = [
    { name: 'তাহেরপুর উপ-স্বাস্থ্য কেন্দ্র', lat: 24.4258, lng: 88.8475, emergencyPhone: '01700000001' },
    { name: 'বাগমারা উপজেলা স্বাস্থ্য কমপ্লেক্স', lat: 24.4600, lng: 88.7900, emergencyPhone: '01700000002' },
    { name: 'রাজশাহী মেডিকেল কলেজ হাসপাতাল (রামেক)', lat: 24.3725, lng: 88.5835, emergencyPhone: '01700000003' },
  ];

  // Real-time Firestore sync of active donors
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'donors'), (snapshot) => {
      const fetched: Donor[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Donor);
      });

      if (fetched.length > 0) {
        // Merge with defaults if default not already in fetched
        const merged = [...fetched];
        defaultDonors.forEach((d) => {
          if (!merged.some((m) => m.id === d.id || m.phone === d.phone)) {
            merged.push(d);
          }
        });
        setDonors(merged);
      }
    }, (err) => {
      console.warn("Could not fetch real-time location donors:", err);
    });

    return () => unsubscribe();
  }, []);

  // Detect user's current GPS position
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("আপনার ডিভাইসে জিপিএস লোকেশন সমর্থিত নয়।");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setHasUserLocation(true);
        setIsLocating(false);

        // If user is logged in, optionally update their live location in Cloud Firestore
        if (currentUser && !currentUser.isGuest) {
          try {
            await updateDoc(doc(db, 'donors', currentUser.uid), {
              latitude: lat,
              longitude: lng,
              lastLocationUpdate: new Date().toISOString(),
              isLocationSharing: true,
            });
            setIsSharingLocation(true);
          } catch (e) {
            // Profile doc might not exist yet if not registered
          }
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setIsLocating(false);
        alert("লোকেশন পাওয়া যায়নি। ডিফল্টভাবে তাহেরপুর কেন্দ্রবিন্দু ব্যবহার করা হচ্ছে।");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Toggle live location sharing in Firestore
  const toggleLocationSharing = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const nextState = !isSharingLocation;
    setIsSharingLocation(nextState);

    try {
      await updateDoc(doc(db, 'donors', currentUser.uid), {
        isLocationSharing: nextState,
        lastLocationUpdate: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Could not update sharing state:", e);
    }
  };

  // Filter and sort donors by calculated Haversine distance
  const nearbyDonorsWithDistance = donors
    .map((d) => {
      // Use donor coordinates or approximate offset based on area
      const dLat = d.latitude || 24.4258 + (Math.sin(d.id.charCodeAt(0)) * 0.03);
      const dLng = d.longitude || 88.8475 + (Math.cos(d.id.charCodeAt(0)) * 0.03);
      const distance = calculateDistanceKm(userLat, userLng, dLat, dLng);
      return {
        ...d,
        computedLat: dLat,
        computedLng: dLng,
        distanceKm: distance
      };
    })
    .filter((d) => {
      if (selectedBloodGroup !== 'all' && d.bloodGroup !== selectedBloodGroup) return false;
      if (availableOnly && !d.isAvailable) return false;
      if (d.distanceKm > selectedRadius) return false;
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <h2 className="font-sans text-2xl md:text-3xl font-black text-gray-900">
              রিয়েল-টাইম রক্তদাতা লোকেশন ট্র্যাকিং
            </h2>
          </div>
          <p className="font-sans text-xs md:text-sm text-gray-500">
            নিকটবর্তী সক্রিয় রক্তদাতাদের জিপিএস দূরত্ব ও লাইভ অবস্থান শনাক্ত করে তাৎক্ষণিক রক্তের ব্যবস্থা করুন।
          </p>
        </div>

        {/* Live GPS detect button */}
        <div className="flex items-center gap-2">
          <button
            onClick={detectCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-sans text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
          >
            {isLocating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{hasUserLocation ? 'জিপিএস রিফ্রেশ করুন' : 'আমার বর্তমান অবস্থান শনাক্ত করুন'}</span>
          </button>
        </div>
      </div>

      {/* Top Banner: Donor Location Broadcasting Toggle */}
      <div className="bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 p-4 sm:p-5 rounded-3xl border border-red-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5 text-left font-sans">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span>লাইভ লোকেশন ব্রডকাস্টার</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isSharingLocation ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
              }`}>
                {isSharingLocation ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
              </span>
            </h4>
            <p className="text-xs text-gray-600">
              আপনি একজন রক্তদাতা হলে আপনার লাইভ জিপিএস স্থানাঙ্ক শেয়ার করুন, যাতে বিপদের সময় রোগীরা আপনাকে দ্রুত খুঁজে পায়।
            </p>
          </div>
        </div>

        <button
          onClick={toggleLocationSharing}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto font-sans shadow-sm ${
            isSharingLocation
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-white hover:bg-red-50 text-red-700 border border-red-300'
          }`}
        >
          {isSharingLocation ? 'লোকেশন শেয়ার বন্ধ করুন' : 'আমার লোকেশন শেয়ার করুন'}
        </button>
      </div>

      {/* Main Grid: Visual Radar & Nearby Donors List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Radar Locator View */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-gray-950 rounded-3xl p-6 text-white border border-gray-800 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-300">
                  তাহেরপুর লাইভ রক্তদাতা রাডার
                </span>
              </div>
              <span className="font-mono text-[11px] text-gray-400">
                {userLat.toFixed(3)}°N, {userLng.toFixed(3)}°E
              </span>
            </div>

            {/* Radar Circle Screen */}
            <div className="relative aspect-square max-w-sm mx-auto flex items-center justify-center my-4">
              
              {/* Concentric distance rings */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
              <div className="absolute inset-8 rounded-full border border-emerald-500/25" />
              <div className="absolute inset-16 rounded-full border border-emerald-500/30" />
              <div className="absolute inset-24 rounded-full border border-emerald-500/40" />

              {/* Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-emerald-500/20" />

              {/* Rotating radar sweep */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none origin-center animate-spin"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.25) 360deg)',
                  animationDuration: '4s'
                }}
              />

              {/* Center point: User */}
              <div className="relative z-10 w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center shadow-lg shadow-blue-500/50">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              {/* Donor Markers on Radar */}
              {nearbyDonorsWithDistance.slice(0, 10).map((donor, idx) => {
                // Calculate pseudo-polar positions on radar
                const angle = (idx * 47) % 360;
                const normalizedDist = Math.min(130, Math.max(30, (donor.distanceKm / selectedRadius) * 140));
                const rad = (angle * Math.PI) / 180;
                const x = Math.cos(rad) * normalizedDist;
                const y = Math.sin(rad) * normalizedDist;

                return (
                  <button
                    key={donor.id}
                    onClick={() => setSelectedDonor(donor)}
                    title={`${donor.name} (${donor.bloodGroup}) - ${donor.distanceKm} কিমি`}
                    className="absolute z-20 group transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 cursor-pointer"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-5 h-5 rounded-full bg-red-500/50 animate-ping" />
                      <span className="w-5 h-5 rounded-full bg-red-600 border border-white text-[9px] font-bold text-white flex items-center justify-center font-english shadow-md">
                        {donor.bloodGroup}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Radar Footer stats */}
            <div className="grid grid-cols-3 gap-2 border-t border-gray-800 pt-3 text-center text-xs font-sans">
              <div>
                <span className="text-gray-400 block text-[10px]">খোঁজের পরিধি</span>
                <span className="font-bold text-emerald-400 font-english">{selectedRadius} KM</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">সক্রিয় রক্তদাতা</span>
                <span className="font-bold text-white font-english">{nearbyDonorsWithDistance.length} জন</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px]">নিকটতম রক্তদাতা</span>
                <span className="font-bold text-amber-400 font-english">
                  {nearbyDonorsWithDistance[0] ? `${nearbyDonorsWithDistance[0].distanceKm} KM` : 'N/A'}
                </span>
              </div>
            </div>

          </div>

          {/* Emergency Hospitals Distance Quick Card */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm space-y-3 font-sans text-left">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Hospital className="w-4 h-4 text-red-600" />
              জরুরি স্বাস্থ্য কেন্দ্র ও হাসপাতালগুলোর দূরত্ব
            </h4>
            <div className="space-y-2">
              {emergencyHospitals.map((h, i) => {
                const dist = calculateDistanceKm(userLat, userLng, h.lat, h.lng);
                return (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{h.name}</span>
                      <span className="text-gray-400 text-[11px]">তাহেরপুর জোন</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-lg text-xs font-english">
                        ~{dist} km
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Filter Controls & Sorted Nearby Donors List */}
        <div className="lg:col-span-6 space-y-4 text-left font-sans">
          
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-sm space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-150 pb-3">
              <span className="text-xs font-bold text-gray-700">রক্তদাতা ফিল্টার:</span>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span>শুধুমাত্র প্রস্তুত (Available) রক্তদাতা</span>
              </label>
            </div>

            {/* Blood group chips */}
            <div>
              <span className="text-[11px] font-bold text-gray-400 block mb-1.5 uppercase">রক্তের গ্রুপ:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedBloodGroup('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedBloodGroup === 'all'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  সকল গ্রুপ
                </button>
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold font-english transition cursor-pointer ${
                      selectedBloodGroup === bg
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Radius Range */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-bold text-gray-600">দূরত্বের পরিধি:</span>
                <span className="font-bold text-red-600 font-english">{selectedRadius} কিলোমিটার</span>
              </div>
              <input
                type="range"
                min={2}
                max={50}
                step={1}
                value={selectedRadius}
                onChange={(e) => setSelectedRadius(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-english">
                <span>2 km</span>
                <span>15 km</span>
                <span>30 km</span>
                <span>50 km</span>
              </div>
            </div>

          </div>

          {/* List of Donors */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-sm font-bold text-gray-900">
                নিকটবর্তী রক্তদাতা তালিকা ({nearbyDonorsWithDistance.length} জন)
              </h3>
              <span className="text-[11px] text-gray-500">দূরত্ব অনুযায়ী সাজানো</span>
            </div>

            {nearbyDonorsWithDistance.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-gray-200 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500 font-bold">এই দূরত্বের পরিধিতে কোনো রক্তদাতা পাওয়া যায়নি।</p>
                <p className="text-[11px] text-gray-400">দূরত্বের স্লাইডার বাড়িয়ে বা অন্য রক্তের গ্রুপ নির্বাচন করে দেখুন।</p>
              </div>
            ) : (
              nearbyDonorsWithDistance.map((donor) => {
                const isSelected = selectedDonor?.id === donor.id;
                return (
                  <div
                    key={donor.id}
                    className={`bg-white rounded-2xl p-4 border transition-all shadow-sm hover:shadow-md ${
                      isSelected ? 'border-red-500 ring-2 ring-red-500/20' : 'border-gray-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-english text-lg font-black shadow-md shrink-0">
                          {donor.bloodGroup}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-950 flex items-center gap-1.5">
                            <span>{donor.name}</span>
                            {donor.isVerified && (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            )}
                          </h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span>{donor.address || donor.location}</span>
                          </p>
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            পেশা: {donor.occupation || 'রক্তদাতা'}
                          </span>
                        </div>
                      </div>

                      {/* Distance Badge */}
                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-english font-bold text-xs px-2.5 py-1 rounded-xl shadow-xs">
                          <Navigation className="w-3 h-3 text-emerald-600" />
                          {donor.distanceKm} km
                        </span>
                        <span className={`block text-[10px] font-bold mt-1 ${
                          donor.isAvailable ? 'text-emerald-600' : 'text-gray-400'
                        }`}>
                          {donor.isAvailable ? '● প্রস্তুত' : '○ বিশ্রামে'}
                        </span>
                      </div>

                    </div>

                    {/* Actions: Direct Call & Route */}
                    <div className="flex gap-2 pt-3 mt-3 border-t border-gray-100">
                      <a
                        href={`tel:${donor.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>সরাসরি কল ({donor.phone})</span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${donor.computedLat},${donor.computedLng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-xl text-xs font-bold transition"
                        title="গুগল ম্যাপে ডিরেকশন দেখুন"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
                        <span className="hidden sm:inline">ম্যাপে রুট</span>
                      </a>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
