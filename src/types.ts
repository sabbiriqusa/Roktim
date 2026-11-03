export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: string;
  gender: string;
  occupation: string;
  address: string;
  location: string;
  age: number;
  isAvailable: boolean;
  isRegisteredDonor: boolean;
  createdAt: string;
  photoURL?: string;
  institution?: string;
  workOrganization?: string;
  role?: string; // e.g. "রক্তদাতা" or "স্বেচ্ছাসেবী"
  donationCount?: number;
  requestsManaged?: number;
  joinDate?: string;
  lastDonationDate?: string;
  lastDonatedDate?: string;
  isVerified?: boolean;
  verificationMethod?: 'google' | 'phone' | 'email';
  phoneVerified?: boolean;
  // Real-time location tracking
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  lastLocationUpdate?: string;
  isLocationSharing?: boolean;
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
  urgencyLevel?: 'emergency' | 'urgent' | 'regular';
  latitude?: number;
  longitude?: number;
}

export interface AppNotification {
  id: string;
  requestId: string;
  bloodGroup: string;
  patientName: string;
  hospitalName: string;
  location: string;
  phone: string;
  timestamp: string;
  read: boolean;
  type: 'blood_request' | 'status_update' | 'system';
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
  phoneNumber?: string | null;
  photoURL: string | null;
  isGuest?: boolean;
  phoneVerified?: boolean;
  verifiedBy?: 'google' | 'phone' | 'email';
  isRegistrationComplete?: boolean;
  hasLocationPermission?: boolean;
  hasNotificationPermission?: boolean;
  hasManuallyProceeded?: boolean;
  bloodGroup?: string;
  gender?: string;
  occupation?: string;
  address?: string;
  location?: string;
  age?: number;
  latitude?: number;
  longitude?: number;
}
