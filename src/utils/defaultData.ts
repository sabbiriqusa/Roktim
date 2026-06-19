import { Donor, BloodRequest } from '../types';

export const NoticeBn = "তাহেরপুর পৌরসভা ও আশেপাশের এলাকার সকল স্বেচ্ছাসেবী রক্তদাতাদের রক্তিম ব্লাড ব্যাংকে অবদানের জন্য আন্তরিক ধন্যবাদ। কোনো রোগীর জন্য জরুরী রক্তের প্রয়োজন হলে অবিলম্বে আমাদের ব্লাড রিকোয়েস্ট ফর্মে আবেদন করুন।";
export const NoticeEn = "Sincere thanks to all voluntary blood donors in Taherpur Municipality and surrounding areas for contributing to Roktim Blood Bank. For emergency blood requirements, please submit a blood request form immediately.";

export const defaultDonors: Donor[] = [
  {
    id: 'donor1',
    name: 'সাকিব আল হাসান',
    email: 'sakib.donor@gmail.com',
    phone: '01712345678',
    bloodGroup: 'O+',
    isAvailable: true,
    location: 'তাহেরপুর বাজার, বাগমারা',
    gender: 'পুরুষ',
    age: 28,
    isRegisteredDonor: true,
    lastDonatedDate: '2026-03-10',
    createdAt: new Date().toISOString()
  },
  {
    id: 'donor2',
    name: 'মোছাঃ ফাতেমা খাতুন',
    email: 'fatema.donor@gmail.com',
    phone: '01823456789',
    bloodGroup: 'A+',
    isAvailable: true,
    location: 'তাহেরপুর কলেজ মোড়',
    gender: 'নারী',
    age: 24,
    isRegisteredDonor: true,
    lastDonatedDate: '2026-04-15',
    createdAt: new Date().toISOString()
  },
  {
    id: 'donor3',
    name: 'মোঃ মেহেদী হাসান',
    email: 'mehedi.b@gmail.com',
    phone: '01934567890',
    bloodGroup: 'B+',
    isAvailable: true,
    location: 'হরিতলা, তাহেরপুর',
    gender: 'পুরুষ',
    age: 32,
    isRegisteredDonor: true,
    lastDonatedDate: '2026-01-20',
    createdAt: new Date().toISOString()
  },
  {
    id: 'donor4',
    name: 'তানভীর আহমেদ',
    email: 'tanvir@gmail.com',
    phone: '01545678901',
    bloodGroup: 'AB+',
    isAvailable: false,
    location: 'তাহেরপুর পাইলট উচ্চ বিদ্যালয় ঘাট',
    gender: 'পুরুষ',
    age: 26,
    isRegisteredDonor: true,
    lastDonatedDate: '2026-05-28',
    createdAt: new Date().toISOString()
  },
  {
    id: 'donor5',
    name: 'রুপা আক্তার',
    email: 'rupa.abneg@gmail.com',
    phone: '01356789012',
    bloodGroup: 'A-',
    isAvailable: true,
    location: 'তাহেরপুর রেলস্টেশন এলাকা',
    gender: 'নারী',
    age: 22,
    isRegisteredDonor: true,
    lastDonatedDate: '2026-02-14',
    createdAt: new Date().toISOString()
  },
  {
    id: 'donor6',
    name: 'মোঃ জাহিদ হাসান',
    email: 'jahid.o@gmail.com',
    phone: '01467890123',
    bloodGroup: 'O-',
    isAvailable: true,
    location: 'রামরামা, তাহেরপুর',
    gender: 'पुरुष',
    age: 29,
    isRegisteredDonor: true,
    lastDonatedDate: '2026-05-01',
    createdAt: new Date().toISOString()
  }
];

export const defaultRequests: BloodRequest[] = [
  {
    id: 'req1',
    patientName: 'মতিউর রহমান',
    hospitalName: 'তাহেরপুর ক্লিনিক অ্যান্ড ডায়াগনস্টিক',
    location: 'তাহেরপুর বাজার রোড',
    bloodGroup: 'B+',
    units: 2,
    phone: '01799887766',
    requiredDate: '2026-06-21',
    reason: 'হিমোগ্লোবিন কমে যাওয়া ও রক্তস্বল্পতা',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    requestedBy: 'মোস্তফা কামাল (ছেলে)',
    requesterUid: 'mock_user'
  },
  {
    id: 'req2',
    patientName: 'মোছাঃ রোকেয়া বেগম',
    hospitalName: 'রাজশাহী মেডিকেল কলেজ হাসপাতাল (রামেক)',
    location: 'ওয়ার্ড নং ১২, আইসিইউ',
    bloodGroup: 'AB+',
    units: 1,
    phone: '01866554433',
    requiredDate: '2026-06-20',
    reason: 'জরুরি পিত্তথলি অপারেশন',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    requestedBy: 'আব্দুস সবুর (স্বামী)',
    requesterUid: 'mock_user'
  },
  {
    id: 'req3',
    patientName: 'খাদিজা আক্তার (সিজার)',
    hospitalName: 'তাহেরপুর সেবা সার্জিক্যাল ক্লিনিক',
    location: 'মহিলা কলেজ সংলগ্ন',
    bloodGroup: 'O+',
    units: 1,
    phone: '01511223344',
    requiredDate: '2026-06-19',
    reason: 'জরুরি সিজারিয়ান অপারেশন',
    status: 'fulfilled',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    requestedBy: 'মোঃ রফিক (ভাই)',
    requesterUid: 'mock_user'
  }
];

export const taherpurLocations = [
  'তাহেরপুর বাজার',
  'তাহেরপুর কলেজ মোড়',
  'তাহেরপুর রেলস্টেশন এলাকা',
  'তাহেরপুর পাইলট উচ্চ বিদ্যালয় ঘাট',
  'হরিতলা, তাহেরপুর',
  'মহিলা কলেজ সংলগ্ন',
  'রামরামা',
  'নুরপুর',
  'জামালপুর',
  'কোহিনূর মোড়',
  'বিহীগ্রাম',
  'মাধাইমুড়ি',
  'বাগমারা উপজেলা এলাকা',
  'অন্যান্য (অন্যত্র)',
];

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
