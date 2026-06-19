import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BloodRequest, AppUser } from '../types';
import { defaultRequests, bloodGroups, taherpurLocations } from '../utils/defaultData';
import { Plus, Check, MapPin, Hospital, Calendar, Phone, Activity, UserPlus, Send, X, HeartHandshake, BookmarkCheck } from 'lucide-react';

interface BloodRequestsProps {
  currentUser: AppUser | null;
  onOpenAuth: () => void;
}

export default function BloodRequests({ currentUser, onOpenAuth }: BloodRequestsProps) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [location, setLocation] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [units, setUnits] = useState(1);
  const [phone, setPhone] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Read blood requests in real time, ordered by date
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests: BloodRequest[] = [];
      snapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() } as BloodRequest);
      });
      setRequests(fetchedRequests);
      setLoading(false);
    }, (error) => {
      console.warn("Could not load requests from database, using offline defaults. Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const mergedRequests = [...requests];
  defaultRequests.forEach((defReq) => {
    const isAlreadyPresent = requests.some(r => r.id === defReq.id || (r.patientName === defReq.patientName && r.phone === defReq.phone));
    if (!isAlreadyPresent) {
      mergedRequests.push(defReq);
    }
  });

  const handlePostRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!patientName || !hospitalName || !location || !phone || !requiredDate || !reason) {
      setFormError("অনুগ্রহ করে সবগুলি ঘর পূরণ করুন।");
      return;
    }

    try {
      const newRequest = {
        patientName: patientName || '',
        hospitalName: hospitalName || '',
        location: location || '',
        bloodGroup: bloodGroup || 'O+',
        units: Number(units) || 1,
        phone: phone || '',
        requiredDate: requiredDate || '',
        reason: reason || '',
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        requestedBy: currentUser.displayName || 'তাহেরপুর সেবক',
        requesterUid: currentUser.uid || 'guest_unknown'
      };

      // Clean undefined variables to prevent Firestore serialisation bugs
      const cleanedRequest = Object.fromEntries(
        Object.entries(newRequest).filter(([_, v]) => v !== undefined)
      );

      await addDoc(collection(db, 'requests'), cleanedRequest);

      // Clear form
      setPatientName('');
      setHospitalName('');
      setLocation('');
      setPhone('');
      setRequiredDate('');
      setReason('');
      setUnits(1);
      setShowForm(false);
    } catch (err: any) {
      console.error("Error creating blood request:", err);
      setFormError("রক্তের রিকোয়েস্ট তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'fulfilled' | 'cancelled') => {
    try {
      // Find the request first to see if it is in firestore
      const isDbRequest = requests.some(r => r.id === id);
      if (isDbRequest) {
        await updateDoc(doc(db, 'requests', id), {
          status: newStatus
        });
      } else {
        // Fallback or local status update for pre-seeded default requests to maintain clean UI state
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        // Also update local list of default requests
        const idx = defaultRequests.findIndex(r => r.id === id);
        if (idx !== -1) {
          defaultRequests[idx].status = newStatus;
        }
      }
    } catch (err) {
      console.error("Error updating request status:", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-300">
      
      {/* Header bar with total and create button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="font-sans text-3xl font-black text-gray-900 flex items-center justify-center sm:justify-start gap-2">
            রক্তের জরুরী আবেদনের তালিকা
          </h2>
          <p className="font-sans text-sm text-gray-500">
            তাহেরপুর অঞ্চলে বর্তমানে চিকিৎসাধীন রোগীদের জন্য জরুরী রক্তের আবেদনসমূহ। রক্তদান করতে সরাসরি কল করুন।
          </p>
        </div>

        <button
          onClick={() => {
            if (!currentUser) {
              onOpenAuth();
            } else {
              setShowForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-red-500/10 hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer active:scale-95 mx-auto sm:mx-0 shrink-0"
        >
          <Plus className="w-4 h-4 text-white" />
          রিকোয়েস্ট পোস্ট করুন
        </button>
      </div>

      {/* Embedded Form Modal if active */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-950/20 backdrop-blur-md" onClick={() => setShowForm(false)} />
          
          <div className="relative w-full max-w-xl glass-card rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 border border-white/60 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans text-lg md:text-xl font-black text-gray-950 flex items-center gap-2">
                🩸 রক্তের রিকোয়েস্ট ফর্ম
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-5 text-sm font-sans">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handlePostRequest} className="space-y-4">
              
              {/* Form grid row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">রোগীর নাম (Patient Name):</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="উদাঃ রফিকুল ইসলাম"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">হাসপাতাল/ক্লিনিক (Hospital):</label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="উদাঃ তাহেরপুর জেনারেল হাসপাতাল"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-red-500 bg-white"
                  />
                </div>
              </div>

              {/* Form grid row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">রোগীর অবস্থান/রক্তদানের স্থান:</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-red-500 bg-white"
                  >
                    <option value="">নির্বাচন করুন</option>
                    {taherpurLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                    <option value="রাজশাহী সদর হাসপাতাল">রাজশাহী সদর হাসপাতাল</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">রক্তের গ্রুপ:</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-semibold font-sans text-sm outline-none focus:border-red-500 bg-white"
                    >
                      {bloodGroups.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">ইউনিট/ব্যাগ সংখ্যা:</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      required
                      value={units}
                      onChange={(e) => setUnits(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-red-500 bg-white font-english"
                    />
                  </div>
                </div>
              </div>

              {/* Form grid row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">মোবাইল ফোন (যোগাযোগ):</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-red-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">রক্তদানের সময়/তারিখ (Required Date):</label>
                  <input
                    type="date"
                    required
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-red-500 bg-white"
                  />
                </div>
              </div>

              {/* Reason box */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 font-sans">রক্তদানের কারণ/অসুখ (Reason/Illness):</label>
                <textarea
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="উদাঃ সিজারিয়ান ডেলিভারি, থ্যালাসেমিয়া ডায়ালাইসিস, আকস্মিক সড়ক দুর্ঘটনা..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-sans text-sm outline-none focus:border-red-500 bg-white"
                />
              </div>

              {/* Description about logged in poster */}
              <div className="bg-red-50/50 rounded-xl p-3 border border-red-100 flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                <p className="font-sans text-[11px] text-red-800 leading-relaxed">
                  ধন্যবাদ, রক্ত পোস্টকারী হিসেবে আপনার নাম (<strong>{currentUser?.displayName}</strong>) সনাক্ত করা হবে এবং রক্তদাতা সংগ্রহ সুনিশ্চিত করা হবে।
                </p>
              </div>

              {/* Confirm submit buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold font-sans text-sm transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold font-sans text-sm transition-colors cursor-pointer shadow-lg shadow-red-500/10 hover:shadow-red-500/25 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> আবেদন জমা দিন
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Grid containing Active Requests */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-gray-500">ডাটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
        </div>
      ) : mergedRequests.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center max-w-md mx-auto border border-white/60">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-3 mx-auto">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <p className="font-sans text-sm text-gray-500 leading-relaxed">
            বর্তমানে কোনো রক্তের পেন্ডিং আবেদন নেই। আলহামদুলিল্লাহ!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {mergedRequests.map((req) => {
            const isCreator = currentUser && (currentUser.uid === req.requesterUid || (currentUser.isGuest && req.requesterUid === 'mock_user'));
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                className={`glass-card rounded-3xl p-5 border overflow-hidden relative flex flex-col justify-between shadow-sm transition-all duration-300 ${
                  req.status === 'fulfilled' 
                    ? 'bg-emerald-50/20 border-emerald-100/50 opacity-80' 
                    : req.status === 'cancelled'
                    ? 'opacity-65 grayscale bg-gray-50/50'
                    : 'border-white/60 hover:shadow-lg'
                }`}
              >
                
                {/* Visual blood card background glow */}
                {isPending && (
                  <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none -mr-8 -mt-8" />
                )}

                {/* Patient / blood details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-english shadow-sm">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans text-base md:text-lg font-black text-gray-900 leading-tight">
                          {req.patientName} (রোগী)
                        </h4>
                        <span className="font-sans text-xs text-gray-400 mt-1 block">
                          আবেদনকারী: {req.requestedBy || 'তাহেরপুর সেবক'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-english text-lg font-black text-white bg-red-600 border border-red-500/10 w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/10">
                        {req.bloodGroup}
                      </span>
                      <span className="font-sans text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full mt-1 border border-red-200/50 inline-block font-english">
                        {req.units} ব্যাগ/ইউনিট
                      </span>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Hospital/location info bento style */}
                  <div className="space-y-2.5 text-xs text-gray-600 leading-relaxed font-sans">
                    <p className="flex items-center gap-2">
                      <Hospital className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="font-medium text-gray-800">{req.hospitalName}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{req.location}</span>
                    </p>
                    <p className="flex items-center gap-2 font-english">
                      <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="font-bold text-gray-800 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                        তারিখ: {req.requiredDate}
                      </span>
                    </p>
                    
                    <div className="bg-red-50/50 p-2.5 rounded-2xl border border-red-100/30 text-[11px] text-red-950 font-medium">
                      <span className="font-bold">কারণ:</span> {req.reason}
                    </div>
                  </div>
                </div>

                {/* Action button bar */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3.5 mt-4">
                  <div>
                    {req.status === 'fulfilled' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-sans">
                        ✓ রক্তদাতা মিলেছে (Fulfilled)
                      </span>
                    ) : req.status === 'cancelled' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full font-sans">
                        বাতিল করা হয়েছে (Cancelled)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-red-700 bg-red-50 border border-red-200/50 px-3 py-1 rounded-full animate-pulse font-sans">
                        ● রক্ত প্রয়োজন (Pending)
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {isPending && (
                      <a
                        href={`tel:${req.phone}`}
                        className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-sans flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md shadow-red-500/10"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        কল করুন
                      </a>
                    )}

                    {/* Requester manager dashboard */}
                    {isCreator && isPending && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleStatusChange(req.id, 'fulfilled')}
                          className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-semibold font-sans border border-emerald-100 cursor-pointer active:scale-95"
                          title="রক্ত পাওয়া গেছে"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(req.id, 'cancelled')}
                          className="p-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold font-sans border border-gray-200 cursor-pointer active:scale-95"
                          title="আবেদন বাতিল করুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
