export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  lastDonatedDate?: string;
  location: string;
  isAvailable: boolean;
  gender?: string;
  age?: number;
  isRegisteredDonor: boolean;
  createdAt: string;
  photoURL?: string;
  institution?: string;
  workOrganization?: string;
  role?: string; // e.g. "volunteer" or "donor" or "স্বেচ্ছাসেবী" or "রক্তদাতা"
  donationCount?: number;
  requestsManaged?: number;
  joinDate?: string;
  lastDonationDate?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  hospitalName: string;
  location: string;
  bloodGroup: string;
  units: number;
  phone: string;
  requiredDate: string;
  reason: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  createdAt: string;
  requestedBy: string;
  requesterUid: string;
}

export interface Announcement {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  imageUrl: string;
  date: string;
}

export interface Notice {
  id: string;
  textBn: string;
  textEn: string;
  date: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest?: boolean;
}

