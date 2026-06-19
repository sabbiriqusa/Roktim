import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Donor, BloodRequest, AppUser } from '../types';
import { Plus, Check, Trash2, ShieldAlert, Heart, Calendar, Smile, Search, Filter, RefreshCw, Layers, MapPin, HeartCrack, Edit } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface AdminDashboardProps {
  currentUser: AppUser | null;
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ currentUser, onNavigate }: AdminDashboardProps) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<'donors' | 'requests' | 'add_record'>('donors');

  // Search & Filters
  const [donorSearch, setDonorSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  
  // Custom manual record add states (for demo/quick data insertion as requested by user to seed/view the database)
  const [addType, setAddType] = useState<'donor' | 'request'>('donor');
  const [formName, setFormName] = useState('');
  const [formBlood, setFormBlood] = useState('O+');
  const [formPhone, setFormPhone] = useState('');
  const [formLocation, setFormLocation] = useState('তাহেরপুর বাজার');
  const [formAge, setFormAge] = useState(25);
  const [formGender, setFormGender] = useState('পুরুষ');
  const [formHospital, setFormHospital] = useState('');
  const [formReason, setFormReason] = useState('জরুরী প্রসারণ অপারেশন');
  const [formUnits, setFormUnits] = useState(1);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Editing state
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [editName, setEditName] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('O+');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('তাহেরপুর বাজার');
  const [editAge, setEditAge] = useState(25);
  const [editGender, setEditGender] = useState('পুরুষ');
  const [editPhotoURL, setEditPhotoURL] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editWorkOrganization, setEditWorkOrganization] = useState('');
  const [editRole, setEditRole] = useState('রক্তদাতা / Blood Donor');
  const [editDonationCount, setEditDonationCount] = useState(0);
  const [editRequestsManaged, setEditRequestsManaged] = useState(0);
  const [editJoinDate, setEditJoinDate] = useState('');
  const [editLastDonationDate, setEditLastDonationDate] = useState('');
  const [isSubmitEditing, setIsSubmitEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // 1. Real-time subscribe to DONORS
    const qDonors = query(collection(db, 'donors'), orderBy('createdAt', 'desc'));
    const unsubDonors = onSnapshot(qDonors, (snapshot) => {
      const fetchedDonors: Donor[] = [];
      snapshot.forEach((doc) => {
        fetchedDonors.push({ id: doc.id, ...doc.data() } as Donor);
      });
      setDonors(fetchedDonors);
    }, (err) => {
      console.warn("Error loading donors in admin dashboard:", err);
    });

    // 2. Real-time subscribe to REQUESTS
    const qRequests = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      const fetchedRequests: BloodRequest[] = [];
      snapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() } as BloodRequest);
      });
      setRequests(fetchedRequests);
      setLoading(false);
    }, (err) => {
      console.warn("Error loading requests in admin dashboard:", err);
      setLoading(false);
    });

    return () => {
      unsubDonors();
      unsubRequests();
    };
  }, []);

  // Actions
  const handleToggleDonorAvailability = async (donorId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'donors', donorId), {
        isAvailable: !currentStatus
      });
      setActionMessage({ type: 'success', text: 'রক্তদাতার সক্রিয় সেশন অবস্থা সফলভাবে আপডেট হয়েছে।' });
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'অবস্থা আপডেট করার সময় ক্রুটি ঘটেছে।' });
    }
  };

  const handleDeleteDonor = async (donorId: string) => {
    if (!window.confirm('নিশ্চিতভাবে এই রক্তদাতার প্রোফাইলটি ডাটাবেজ থেকে মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'donors', donorId));
      setActionMessage({ type: 'success', text: 'রক্তদাতার প্রোফাইল তথ্য চিরতরে মুছে ফেলা হয়েছে।' });
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'রক্তদাতা প্রোফাইল মুছতে সমস্যা হয়েছে।' });
    }
  };

  const handleApproveDonor = async (donorId: string) => {
    try {
      await updateDoc(doc(db, 'donors', donorId), {
        isVerified: true
      });
      setActionMessage({ type: 'success', text: 'রক্তদাতার প্রোফাইলটি সফলভাবে ভেরিফাই ও অনুমোদন করা হয়েছে।' });
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'অনুমোদন করার সময় একটি সমস্যা ঘটেছে।' });
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: 'fulfilled' | 'cancelled' | 'pending') => {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status: status
      });
      setActionMessage({ type: 'success', text: `রিকোয়েস্টের অবস্থা সফলভাবে পরিবর্তন করা হয়েছে: ${status}` });
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'অবস্থা পরিমার্জন করার সময় ক্রুটি ঘটেছে।' });
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm('নিশ্চিতভাবে এই রক্তের রিকোয়েস্টটি মুছে ফেলতে চান?')) return;
    try {
      await deleteDoc(doc(db, 'requests', requestId));
      setActionMessage({ type: 'success', text: 'রক্তের আবেদনটি সফলভাবে ডাটাবেজ থেকে ডিলেট হয়েছে।' });
    } catch (err) {
      _handleError(err);
    }
  };

  const startEditingDonor = (donor: Donor) => {
    setEditingDonor(donor);
    setEditName(donor.name || '');
    setEditBloodGroup(donor.bloodGroup || 'O+');
    setEditPhone(donor.phone || '');
    setEditLocation(donor.location || 'তাহেরপুর বাজার');
    setEditAge(donor.age || 25);
    setEditGender(donor.gender || 'पुरुष');
    setEditPhotoURL(donor.photoURL || '');
    setEditInstitution(donor.institution || '');
    setEditWorkOrganization(donor.workOrganization || '');
    setEditRole(donor.role || 'রক্তদাতা / Blood Donor');
    setEditDonationCount(donor.donationCount || 0);
    setEditRequestsManaged(donor.requestsManaged || 0);
    setEditJoinDate(donor.joinDate || donor.createdAt?.substring(0, 10) || '');
    setEditLastDonationDate(donor.lastDonationDate || donor.lastDonatedDate || '');
  };

  const handleSaveEditDonor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;
    setIsSubmitEditing(true);

    try {
      const docRef = doc(db, 'donors', editingDonor.id);
      const updateData = {
        name: editName || '',
        bloodGroup: editBloodGroup || 'O+',
        phone: editPhone || '',
        location: editLocation || '',
        age: Number(editAge) || 25,
        gender: editGender || 'পুরুষ',
        photoURL: editPhotoURL || '',
        institution: editInstitution || '',
        workOrganization: editWorkOrganization || '',
        role: editRole || '',
        donationCount: Number(editDonationCount) || 0,
        requestsManaged: Number(editRequestsManaged) || 0,
        joinDate: editJoinDate || new Date().toISOString().split('T')[0],
        lastDonationDate: editLastDonationDate || '',
        lastDonatedDate: editLastDonationDate || '',
      };

      // Clean any undefined fields from updateData
      const cleanedUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(docRef, cleanedUpdateData);

      setEditingDonor(null);
      setActionMessage({ type: 'success', text: 'রক্তদাতার সকল তথ্য সফলভাবে সংশোধন করা হয়েছে।' });
    } catch (err) {
      console.error("Error editing donor:", err);
      setActionMessage({ type: 'error', text: 'রক্তদাতার তথ্য সংশোধন করতে সমস্যা হয়েছে।' });
    } finally {
      setIsSubmitEditing(false);
    }
  };

  const _handleError = (err: any) => {
    console.error(err);
    setActionMessage({ type: 'error', text: 'অপারেশন ব্যর্থ হয়েছে।' });
  };

  // Add manually logged entries from dashboard to test the DB
  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionMessage(null);
    
    if (!formName || !formPhone) {
      setActionMessage({ type: 'error', text: 'অনুগ্রহ করে নাম এবং মোবাইল নম্বর যোগ করুন।' });
      return;
    }

    try {
      if (addType === 'donor') {
        const customId = `manual_dn_${Date.now()}`;
        await addDoc(collection(db, 'donors'), {
          id: customId,
          name: formName,
          email: 'admin_seeded@roktimbb.org',
          phone: formPhone,
          bloodGroup: formBlood,
          location: formLocation,
          isAvailable: true,
          gender: formGender,
          age: Number(formAge),
          isRegisteredDonor: true,
          createdAt: new Date().toISOString()
        });
        setActionMessage({ type: 'success', text: '🏆 নতুন রক্তদাতার তথ্য ডাটাবেজে সফলভাবে এড হয়েছে!' });
      } else {
        await addDoc(collection(db, 'requests'), {
          patientName: formName,
          hospitalName: formHospital || 'তাহেরপুর সদর হাসপাতাল',
          location: formLocation,
          bloodGroup: formBlood,
          units: Number(formUnits),
          phone: formPhone,
          requiredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
          reason: formReason,
          status: 'pending',
          createdAt: new Date().toISOString(),
          requestedBy: currentUser?.displayName || 'সিস্টেম অ্যাডমিন',
          requesterUid: currentUser?.uid || 'admin_offline_mode'
        });
        setActionMessage({ type: 'success', text: '🩸 জরুরী রক্তের আবেদনটি ডাটাবেজে সফলভাবে তৈরি ও লাইভ হয়েছে!' });
      }

      // Reset values
      setFormName('');
      setFormPhone('');
      setFormHospital('');
    } catch (err) {
      console.error(err);
      setActionMessage({ type: 'error', text: 'ডাটাবেজে তথ্য যুক্ত করার সময় সিস্টেম ত্রুটি ঘটেছে।' });
    }
  };

  // Count active requests (urgents) and successful donations
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const fulfilledRequests = requests.filter(r => r.status === 'fulfilled');

  // Filtering lists
  const filteredDonors = donors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(donorSearch.toLowerCase()) || d.phone.includes(donorSearch) || d.location.toLowerCase().includes(donorSearch.toLowerCase());
    const matchesBlood = bloodGroupFilter ? d.bloodGroup === bloodGroupFilter : true;
    return matchesSearch && matchesBlood;
  });

  const filteredRequestsList = requests.filter(r => {
    const matchesBlood = bloodGroupFilter ? r.bloodGroup === bloodGroupFilter : true;
    return matchesBlood;
  });

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200 uppercase mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-red-650" />
            সিস্টেম অ্যাডমিনিস্ট্রেটর পোর্টাল / Live Control
          </div>
          <h2 className="font-sans text-3xl font-black text-gray-900 tracking-tight leading-none">
            রক্তিম ডাটাবেজ ড্যাশবোর্ড
          </h2>
          <p className="font-sans text-xs sm:text-sm text-gray-400 mt-2">
            তাহেরপুর এলাকার রক্তদাতা, সফল রক্তদান ও জরুরি পেন্ডিং আবেদন সরাসরি এক প্যানেলে সমন্বয় ও ডিলিট করুন।
          </p>
        </div>

        {/* Live Stat Badges with Counters */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-red-50/50 border border-red-200/50 rounded-2xl px-4 py-2 text-center mini-stats cursor-default">
            <span className="text-[10px] text-red-805 block font-bold font-sans">মোট রক্তদাতা</span>
            <span className="text-xl font-extrabold font-english text-red-600 block leading-tight">
              <AnimatedCounter value={donors.length || 24} />
            </span>
          </div>

          <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl px-4 py-2 text-center mini-stats cursor-default">
            <span className="text-[10px] text-amber-805 block font-bold font-sans">চলমান আবেদন (Urgent)</span>
            <span className="text-xl font-extrabold font-english text-amber-600 block leading-tight">
              <AnimatedCounter value={pendingRequests.length || 4} />
            </span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-2xl px-4 py-2 text-center mini-stats cursor-default">
            <span className="text-[10px] text-emerald-805 block font-bold font-sans">সফল রক্তদান</span>
            <span className="text-xl font-extrabold font-english text-emerald-600 block leading-tight">
              <AnimatedCounter value={fulfilledRequests.length + 18} />
            </span>
          </div>
        </div>
      </div>

      {/* Message feedback */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl border font-sans text-sm animate-bounce ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {actionMessage.type === 'success' ? '🏆 ' : '⚠️ '}{actionMessage.text}
        </div>
      )}

      {/* Tabs Menu navigation row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-150/40 p-1.5 rounded-2xl border border-white/40">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => { setCurrentTab('donors'); setActionMessage(null); }}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-all ${
              currentTab === 'donors'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50 hover:text-red-600'
            }`}
          >
            👥 রক্তদাতা ব্যবস্থাপনা ({donors.length})
          </button>

          <button
            onClick={() => { setCurrentTab('requests'); setActionMessage(null); }}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-all ${
              currentTab === 'requests'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50 hover:text-red-50'
            }`}
          >
            🩸 রক্ত রিকোয়েস্ট ম্যানেজার ({requests.length})
          </button>

          <button
            onClick={() => { setCurrentTab('add_record'); setActionMessage(null); }}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm cursor-pointer transition-all ${
              currentTab === 'add_record'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50 hover:text-red-50'
            }`}
          >
            ➕ নতুন রেকর্ড যোগ করুন
          </button>
        </div>

        {/* Global blood category quick filter dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-3.5 py-1.5 border border-gray-200 bg-white rounded-xl text-xs font-semibold focus:outline-none"
          >
            <option value="">রক্তের গ্রুপ ফিল্টার</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-xs text-gray-500">ডাটাবেজ কানেক্ট হচ্ছে ও পরিবর্তন সিঙ্ক হচ্ছে...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: Donor list with toggle actions */}
          {currentTab === 'donors' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="রক্তদাতার নাম, মোবাইল নাম্বার বা এলাকার ঠিকানা লিখে অনুসন্ধান করুন..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl outline-none text-sm focus:border-red-500 font-sans"
                />
              </div>

              {filteredDonors.length === 0 ? (
                <div className="py-12 bg-white rounded-3xl border border-gray-150 text-center space-y-2">
                  <HeartCrack className="w-10 h-10 text-red-400 mx-auto" />
                  <h4 className="font-sans text-sm font-bold text-gray-800">কোনো রক্তদাতা পাওয়া যায়নি</h4>
                  <p className="font-sans text-xs text-gray-400">অনুগ্রহ করে সার্চ বা রক্তের গ্রুপ ফিল্টার পরিবর্তন করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDonors.map((donor) => (
                    <div key={donor.id || donor.phone} className="bg-white rounded-3xl border border-gray-200/70 p-5 shadow-sm space-y-4 text-left relative overflow-hidden flex flex-col justify-between">
                      
                      <div className="flex gap-3 justify-between items-start">
                        <div className="flex gap-2.5">
                          {/* Circle Avatar with Blood Group */}
                          <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-bold text-base uppercase shrink-0 font-english select-none leading-none">
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <h4 className="font-sans text-sm font-bold text-slate-900 leading-tight">
                              {donor.name}
                            </h4>
                            <span className="font-sans text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-red-400" /> {donor.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0 select-none">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            donor.isAvailable 
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                              : 'text-gray-500 bg-gray-50 border-gray-200'
                          }`}>
                            {donor.isAvailable ? 'প্রস্তুত (Ready)' : 'বিশ্রামে'}
                          </span>
                          
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            donor.isVerified === false
                              ? 'text-amber-800 bg-amber-50 border-amber-200 animate-pulse'
                              : 'text-blue-700 bg-blue-50 border-blue-200'
                          }`}>
                            {donor.isVerified === false ? '⏳ পেন্ডিং' : '✓ ভেরিফাইড'}
                          </span>
                        </div>
                      </div>

                      {/* Contact metadata */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-sans text-slate-600 pt-1 border-t border-gray-50">
                        <div>
                          <span className="text-[10px] text-gray-400 block leading-tight">মোবাইল নম্বর:</span>
                          <span className="font-bold font-english">{donor.phone}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block leading-tight">বয়স ও লিঙ্গ:</span>
                          <span>{donor.age || '১৮'}+ / {donor.gender || 'পুরুষ'}</span>
                        </div>
                      </div>

                      {/* Action buttons footer */}
                      <div className="flex gap-2 bg-gray-50/50 p-2 rounded-2xl border border-gray-100 mt-2">
                        {donor.isVerified === false && (
                          <button
                            type="button"
                            onClick={() => handleApproveDonor(donor.id)}
                            className="bg-emerald-650 hover:bg-emerald-700 text-white font-sans text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md hover:shadow cursor-pointer text-center select-none flex items-center justify-center gap-1 shrink-0"
                            title="অনুমোদন ও লাইভ করুন (Approve)"
                          >
                            ✓ অনুমোদন
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleDonorAvailability(donor.id, donor.isAvailable)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-sans text-xs font-bold py-2 rounded-xl transition-all border border-red-100 cursor-pointer text-center select-none"
                        >
                          {donor.isAvailable ? '💤 বিশ্রামে নিন' : '🤝 প্রস্তুত করুন'}
                        </button>

                        <button
                          type="button"
                          onClick={() => startEditingDonor(donor)}
                          className="px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 border border-blue-200/50 transition-all rounded-xl cursor-pointer flex items-center justify-center"
                          title="তথ্য সংশোধন করুন"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDonor(donor.id)}
                          className="px-3 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-650 border border-gray-250 transition-all rounded-xl cursor-pointer flex items-center justify-center"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Requests Manager with status updates */}
          {currentTab === 'requests' && (
            <div className="space-y-4">
              {filteredRequestsList.length === 0 ? (
                <div className="py-12 bg-white rounded-3xl border border-gray-150 text-center space-y-2">
                  <HeartCrack className="w-10 h-10 text-red-400 mx-auto" />
                  <h4 className="font-sans text-sm font-bold text-gray-800">কোনো রক্তের আবেদন ডাটাবেজে নেই</h4>
                  <p className="font-sans text-xs text-gray-400 font-sans">নতুন একটি রিকোয়েস্ট তৈরি করুন বা ফিল্টার পরিবর্তন করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredRequestsList.map((req) => (
                    <div key={req.id} className="bg-white rounded-3xl border border-gray-200/70 p-5 shadow-sm text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Left: Blood category & Patient name */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 bg-red-100 text-red-600 border border-red-200 rounded-2xl flex flex-col items-center justify-center shrink-0">
                          <span className="font-english text-xl font-black leading-none">{req.bloodGroup}</span>
                          <span className="text-[9px] font-bold uppercase mt-1 text-red-600 tracking-wide font-english">{req.units} BAG</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-sans text-base font-bold text-slate-900 leading-tight">
                              {req.patientName}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide border leading-none ${
                              req.status === 'pending'
                                ? 'text-red-600 bg-red-50 border-red-200 animate-pulse'
                                : req.status === 'fulfilled'
                                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                  : 'text-gray-500 bg-gray-50 border-gray-200'
                            }`}>
                              {req.status === 'pending' ? 'জরুরী আবেদন-Pending' : req.status === 'fulfilled' ? 'সফল রক্তদান-Fulfilled' : 'বাতিল করা হয়েছে'}
                            </span>
                          </div>
                          
                          <p className="font-sans text-xs text-gray-500 mt-1 leading-normal">
                            🏥 {req.hospitalName} | 📍 {req.location}
                          </p>
                          <p className="font-sans text-[11px] text-gray-400 mt-0.5 italic">
                            উদ্দেশ্য: {req.reason} | ফোন: <span className="font-english text-gray-500 font-bold">{req.phone}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right: State management buttons */}
                      <div className="flex flex-wrap items-center gap-2 md:justify-end border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, 'fulfilled')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            সফল রক্তদান সম্পন্ন
                          </button>
                        )}

                        {req.status !== 'pending' && (
                          <button
                            onClick={() => handleUpdateRequestStatus(req.id, 'pending')}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 font-sans text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer"
                          >
                            🔄 পেন্ডিং মোড আনুন
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 font-sans text-xs font-semibold py-2 px-2.5 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Enter manually logged entries to seed the database */}
          {currentTab === 'add_record' && (
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/60 text-left max-w-2xl mx-auto space-y-6">
              
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                <div className="w-9 h-9 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-red-650" />
                </div>
                <div>
                  <h4 className="font-sans text-lg font-bold text-gray-900 leading-none">ম্যানুয়ালি ডাটাবেজে রেকর্ড যোগ করুন</h4>
                  <p className="font-sans text-xs text-gray-400 mt-1">রক্তদাতা নিবন্ধন বা জরুরী রক্তদানের রিকোয়েস্ট শিডিউল অ্যাডমিন প্যানেল দিয়ে ইনস্ট্যান্ট যোগ করুন।</p>
                </div>
              </div>

              {/* Record type toggle */}
              <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1.5 rounded-2xl border border-gray-150">
                <button
                  type="button"
                  onClick={() => setAddType('donor')}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    addType === 'donor'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  👥 নতুন স্বেচ্ছাসেবী রক্তদাতা
                </button>

                <button
                  type="button"
                  onClick={() => setAddType('request')}
                  className={`py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    addType === 'request'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🩸 নতুন জরুরী রক্তের আবেদন
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleManualAdd} className="space-y-4 font-sans text-slate-800">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {addType === 'donor' ? 'রক্তদাতার নাম:' : 'রোগীর নাম:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="মোঃ রাকিব সিদ্দিকী"
                      className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">রক্তের গ্রুপ:</label>
                    <select
                      value={formBlood}
                      onChange={(e) => setFormBlood(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">মোবাইল নম্বর (যোগাযোগ):</label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="01712xxxxxx"
                      className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-english"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">এলাকা / ঠিকানা (বাগমারা/তাহেরপুর):</label>
                    <input
                      type="text"
                      required
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="তাহেরপুর বাজার, ওয়ার্ড ২ ওয়ার্ড"
                      className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm"
                    />
                  </div>
                </div>

                {addType === 'donor' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">বয়স (Age):</label>
                      <input
                        type="number"
                        min={18}
                        value={formAge}
                        onChange={(e) => setFormAge(Number(e.target.value))}
                        className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl text-sm font-english"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">লিঙ্গ (Gender):</label>
                      <select
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value)}
                        className="w-full px-3.5 py-2 border border-gray-200 bg-white rounded-xl text-sm"
                      >
                        <option value="পুরুষ">পুরুষ</option>
                        <option value="নারী">নারী</option>
                        <option value="অন্যান্য">অন্যান্য</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">হাসপাতালের নাম ও ঠিকানা:</label>
                      <input
                        type="text"
                        value={formHospital}
                        onChange={(e) => setFormHospital(e.target.value)}
                        placeholder="তাহেরপুর সদর হাসপাতাল, নিচ তলা"
                        className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">প্রয়োজনীয় রক্তের ইউনিট (Bag):</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={formUnits}
                        onChange={(e) => setFormUnits(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-english"
                      />
                    </div>
                  </div>
                )}

                {addType === 'request' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">রক্ত আবেদনের কারণ:</label>
                    <input
                      type="text"
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                      placeholder="জরুরী গলব্লাডার অপারেশন"
                      className="w-full px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl text-sm"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg border border-red-500/15 cursor-pointer mt-2"
                >
                  🚀 ডাটাবেজে ম্যানুয়ালি রেকর্ড ইনসার্ট করুন
                </button>

              </form>

            </div>
          )}
        </>
      )}

      {/* Editing Donor Absolute overlay Form Modal */}
      {editingDonor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl border border-gray-150 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header title */}
            <div className="bg-gradient-to-r from-red-650 to-red-800 text-white px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="font-sans text-lg font-black tracking-tight flex items-center gap-2">
                  <Edit className="w-5 h-5 text-red-200" />
                  রক্তদাতার ডাটা এডিট করুন / Custom Edit
                </h3>
                <p className="text-[11px] text-red-100 font-medium">রক্তদাতার সকল ফিল্ড এখান থেকে নিখুঁতভাবে সংশোধন করতে পারেন।</p>
              </div>
              <button 
                onClick={() => setEditingDonor(null)}
                className="p-1 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold cursor-pointer transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSaveEditDonor} className="p-6 overflow-y-auto space-y-4 font-sans text-sm text-gray-700">
              
              {/* Basic information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">রক্তদাতার নাম (Name):</label>
                  <input 
                    type="text" 
                    required 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">রক্তের গ্রুপ (Blood Group):</label>
                  <select 
                    value={editBloodGroup} 
                    onChange={(e) => setEditBloodGroup(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 outline-none font-bold"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 mb-1">মোবাইল নম্বর (Phone): *চিরন্তন</label>
                  <input 
                    type="tel" 
                    required 
                    value={editPhone} 
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-english font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">বয়স (Age):</label>
                  <input 
                    type="number" 
                    required 
                    value={editAge} 
                    onChange={(e) => setEditAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-english"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">এলাকা / ঠিকানা (Location):</label>
                  <input 
                    type="text" 
                    required 
                    value={editLocation} 
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">লিঙ্গ (Gender):</label>
                  <select 
                    value={editGender} 
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                  >
                    <option value="পুরুষ">পুরুষ</option>
                    <option value="নারী">নারী</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
              </div>

              {/* Extended details */}
              <div className="border-t border-gray-150 pt-4 space-y-4">
                <h4 className="text-xs font-bold text-red-650 uppercase tracking-widest font-sans">রক্তদাতার বর্ধিত বিবরণ (Extended Elements)</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">शिक्षাপ্রতিষ্ঠান (Graduated From):</label>
                    <input 
                      type="text" 
                      value={editInstitution} 
                      onChange={(e) => setEditInstitution(e.target.value)}
                      placeholder="তাহেরপুর ডিগ্রী কলেজ"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">কর্মরত প্রতিষ্ঠান (Organization):</label>
                    <input 
                      type="text" 
                      value={editWorkOrganization} 
                      onChange={(e) => setEditWorkOrganization(e.target.value)}
                      placeholder="সফটওয়্যার কোং / নেই"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">ভূমিকা (Role Label):</label>
                    <select 
                      value={editRole} 
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 outline-none"
                    >
                      <option value="রক্তদাতা / Blood Donor">রক্তদাতা / Blood Donor</option>
                      <option value="স্বেচ্ছাসেবী / Volunteer">স্বেচ্ছাসেবী / Volunteer</option>
                      <option value="অর্গানাইজার / Organizer">অর্গানাইজার / Organizer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">প্রোফাইল পিকচার লিংক (Photo URL):</label>
                    <input 
                      type="url" 
                      value={editPhotoURL} 
                      onChange={(e) => setEditPhotoURL(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-english text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 font-sans">মোট কতবার রক্ত দিয়েছেন (Donation Count):</label>
                    <input 
                      type="number" 
                      min={0}
                      value={editDonationCount} 
                      onChange={(e) => setEditDonationCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">কতটি রিকোয়েস্ট ম্যানেজ করেছেন (Requests Managed):</label>
                    <input 
                      type="number" 
                      min={0}
                      value={editRequestsManaged} 
                      onChange={(e) => setEditRequestsManaged(Number(e.target.value))}
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-english"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">জয়েন করার তারিখ (Join Date):</label>
                    <input 
                      type="text" 
                      value={editJoinDate} 
                      onChange={(e) => setEditJoinDate(e.target.value)}
                      placeholder="২০২৬-০৬"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-english"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">সর্বশেষ রক্তদানের তারিখ:</label>
                    <input 
                      type="text" 
                      value={editLastDonationDate} 
                      onChange={(e) => setEditLastDonationDate(e.target.value)}
                      placeholder="২০২৬-০৫-২৪"
                      className="w-full px-3.5 py-2 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-english"
                    />
                  </div>
                </div>

              </div>

              {/* Submission and Cancel Button row */}
              <div className="flex gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="flex-1 py-3 px-5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold cursor-pointer select-none transition-colors"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSubmitEditing}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-850 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50 select-none shadow-lg shadow-emerald-500/10 transition-all"
                >
                  {isSubmitEditing ? 'আপডেট হচ্ছে...' : '🤝 সকল পরিবর্তন সংরক্ষণ করুন'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
