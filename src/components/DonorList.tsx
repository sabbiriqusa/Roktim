import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Donor } from '../types';
import { defaultDonors, bloodGroups } from '../utils/defaultData';
import { Search, Phone, Mail, MapPin, User, Check, AlertCircle, Filter, CalendarCheck, ToggleLeft, ToggleRight } from 'lucide-react';

export default function DonorList() {
  const [dbDonors, setDbDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read donors from Firestore collection
    const q = query(collection(db, 'donors'), where('isRegisteredDonor', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDonors: Donor[] = [];
      snapshot.forEach((doc) => {
        fetchedDonors.push({ id: doc.id, ...doc.data() } as Donor);
      });
      setDbDonors(fetchedDonors);
      setLoading(false);
    }, (error) => {
      console.warn("Could not load donors from database, showing offline defaults. Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Combine database registered donors and defaults to prevent a blank slate
  // Ensure we don't duplicate custom profiles
  const mergedDonors = [...dbDonors];
  defaultDonors.forEach((defDonor) => {
    const isAlreadyPresent = dbDonors.some(
      (d) => d.email.toLowerCase() === defDonor.email.toLowerCase() || d.phone === defDonor.phone
    );
    if (!isAlreadyPresent) {
      mergedDonors.push(defDonor);
    }
  });

  // Apply filters in client side
  const filteredDonors = mergedDonors.filter((donor) => {
    // Blood group filter
    if (selectedGroup && donor.bloodGroup !== selectedGroup) return false;
    
    // Availability filter
    if (onlyAvailable && !donor.isAvailable) return false;

    // Search term (name or location)
    if (searchTerm) {
      const queryLower = searchTerm.toLowerCase();
      const matchName = donor.name.toLowerCase().includes(queryLower);
      const matchLocation = donor.location.toLowerCase().includes(queryLower);
      const matchBlood = donor.bloodGroup.toLowerCase().includes(queryLower);
      if (!matchName && !matchLocation && !matchBlood) return false;
    }

    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Intro section */}
      <div className="text-center md:text-left space-y-2">
        <h2 className="font-sans text-3xl font-black text-gray-900">
          রক্তদাতাদের ডাটাবেজ
        </h2>
        <p className="font-sans text-sm text-gray-500">
          তাহেরপুর ও বাগমারা অঞ্চলের সকল নিবন্ধিত এবং কর্মক্ষম রক্তদাতাদের একটি তালিকা। এখানে রক্তের গ্রুপ অনুযায়ী সহজে ফিল্টার করতে পারেন।
        </p>
      </div>

      {/* Modern Filter controls card */}
      <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/60 space-y-5">
        
        {/* Search Input and Avail checkbox */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="নাম, রক্তের গ্রুপ বা এলাকা দিয়ে খুঁজুন (উদাঃ ও+, তাহেরপুর বাজার)..."
              className="w-full pl-11 pr-4 py-3 bg-white/85 border border-gray-200 rounded-2xl font-sans text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/10 placeholder:text-gray-400/80 transition-all shadow-inner"
            />
          </div>

          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white/85 hover:bg-white rounded-2xl font-sans text-sm text-gray-700 transition-colors shadow-sm cursor-pointer w-full md:w-auto justify-center select-none"
          >
            {onlyAvailable ? (
              <ToggleRight className="w-6 h-6 text-red-600 fill-red-100" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-gray-400" />
            )}
            <span>শুধুমাত্র প্রস্তুত রক্তদাদাগণ (Ready)</span>
          </button>
        </div>

        {/* Blood Groups quick filters */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-gray-500 font-sans uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            রক্তের গ্রুপ ফিল্টার (Blood Group):
          </label>
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer shadow-sm ${
                selectedGroup === null
                  ? 'bg-red-600 text-white shadow-red-500/25 shadow-md scale-102 border border-red-600'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              সব গ্রুপ
            </button>
            {bloodGroups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer shadow-sm ${
                  selectedGroup === group
                    ? 'bg-red-600 text-white shadow-red-500/25 shadow-md scale-102 border border-red-600'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Grid of Donor Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-gray-500">ডাটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center max-w-lg mx-auto flex flex-col items-center gap-4 border border-white/50">
          <AlertCircle className="w-12 h-12 text-red-500 stroke-1" />
          <h4 className="font-sans text-lg font-bold text-gray-800">কোনো রক্তদাতার বিবরণ মেলেনি!</h4>
          <p className="font-sans text-sm text-gray-400 leading-relaxed">
            দুঃখিত, আপনার ফিল্টার করা মাপকাঠিতে কোনো রক্তদাতা পাওয়া যায়নি। দয়া করে ভিন্ন রক্তের গ্রুপ নির্বাচন করুন বা অন্য নামে অনুসন্ধান করুন।
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedGroup(null);
              setOnlyAvailable(false);
            }}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl px-4 py-2 font-sans text-xs font-semibold transition-colors cursor-pointer"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className={`glass-card rounded-3xl p-5 border border-white/60 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${
                !donor.isAvailable && 'opacity-70 grayscale-20'
              }`}
            >
              
              {/* Card top row */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-red-600 shadow-sm border border-red-200/20 overflow-hidden shrink-0">
                    {donor.photoURL ? (
                      <img src={donor.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-sans text-base md:text-lg font-black text-gray-900 leading-tight">
                      {donor.name}
                    </h4>
                    <span className="font-sans inline-block mt-0.5 text-[11px] text-gray-400 font-medium font-english">
                      {donor.gender || 'পুরুষ'} • বয়স: {donor.age || '২৬'} বছর
                    </span>
                    {donor.role && (
                      <span className="block text-[10.5px] font-black text-red-650 font-sans tracking-wide leading-none mt-1">
                        {donor.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Big Blood Group Badge */}
                <span className="font-english text-xl font-black text-red-600 bg-red-50 border border-red-200/50 w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  {donor.bloodGroup}
                </span>
              </div>

              {/* Extended Details / Metadata Grid */}
              <div className="space-y-2.5 my-3 pt-3 border-t border-gray-100/60 text-left font-sans text-xs">
                <p className="text-gray-600 flex items-center gap-1.5 leading-tight">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate font-medium">{donor.location}</span>
                </p>

                {donor.institution && (
                  <p className="text-gray-550 flex items-start gap-1.5 leading-snug">
                    <span className="text-gray-400 font-bold shrink-0">Grad:</span>
                    <span className="truncate font-semibold text-gray-800">{donor.institution}</span>
                  </p>
                )}

                {donor.workOrganization && (
                  <p className="text-gray-550 flex items-start gap-1.5 leading-snug">
                    <span className="text-gray-400 font-bold shrink-0">Work:</span>
                    <span className="truncate font-semibold text-gray-800">{donor.workOrganization}</span>
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100/30 text-center">
                    <span className="text-[10px] text-gray-400 block font-semibold leading-none mb-0.5">রক্ত দিয়েছেন:</span>
                    <span className="font-bold text-emerald-700 text-xs">{donor.donationCount || 0} বার</span>
                  </div>
                  <div className="bg-red-50/50 p-2 rounded-xl border border-red-100/30 text-center">
                    <span className="text-[10px] text-gray-400 block font-semibold leading-none mb-0.5">রিকোয়েস্ট:</span>
                    <span className="font-bold text-red-700 text-xs">{donor.requestsManaged || 0}টি</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-550 flex items-center gap-1.5 font-english pt-1 leading-none">
                  <CalendarCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>শেষ রক্তদান: {donor.lastDonateDate || donor.lastDonationDate || donor.lastDonatedDate || 'কখনো নয়'}</span>
                </p>
              </div>

              {/* Status and Action row */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                <span className={`inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold font-sans px-2.5 py-1 rounded-full border ${
                  donor.isAvailable 
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' 
                    : 'text-gray-500 bg-gray-50 border-gray-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    donor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                  }`} />
                  {donor.isAvailable ? 'রক্তদানে প্রস্তুত' : 'বিশ্রামে'}
                </span>

                <div className="flex gap-1.5">
                  <a
                    href={`tel:${donor.phone}`}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/10 hover:shadow-red-500/25 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                    title="রক্তদাতাকে কল করুন"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">কল করুন</span>
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
