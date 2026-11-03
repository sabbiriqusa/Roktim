import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppUser, Donor } from '../types';

/**
 * Record and sync user login metadata to Cloud Firestore under `users/{uid}`
 * This ensures all user accounts and login sessions appear in the Firebase console.
 */
export async function recordUserLogin(user: AppUser): Promise<void> {
  if (!user || !user.uid) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const loginData = {
      uid: user.uid,
      displayName: user.displayName || 'স্বেচ্ছাসেবী',
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      photoURL: user.photoURL || null,
      verifiedBy: user.verifiedBy || 'guest',
      phoneVerified: Boolean(user.phoneVerified),
      isGuest: Boolean(user.isGuest),
      lastLoginAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
      platform: typeof navigator !== 'undefined' ? (navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop') : 'web'
    };

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        ...loginData,
        createdAt: serverTimestamp()
      }, { merge: true });
    } else {
      await updateDoc(userRef, loginData);
    }
  } catch (error) {
    console.warn("Could not sync user login to Firestore:", error);
  }
}

/**
 * Persist comprehensive user profile and donor registry data in both `donors` and `users`
 * ensuring all photo, contact, and personal details are visible live on the website and in Firebase console.
 */
export async function syncUserProfileToFirebase(donor: Donor): Promise<void> {
  if (!donor || !donor.id) return;

  try {
    const donorRef = doc(db, 'donors', donor.id);
    const userRef = doc(db, 'users', donor.id);

    const cleanData = Object.fromEntries(
      Object.entries(donor).filter(([_, v]) => v !== undefined)
    );

    // Save in donors collection
    await setDoc(donorRef, {
      ...cleanData,
      isRegisteredDonor: true,
      updatedAt: serverTimestamp()
    }, { merge: true });

    // Also mirror core profile into users collection for Firebase console visibility
    await setDoc(userRef, {
      uid: donor.id,
      displayName: donor.name,
      email: donor.email || null,
      phoneNumber: donor.phone,
      photoURL: donor.photoURL || null,
      bloodGroup: donor.bloodGroup,
      gender: donor.gender,
      occupation: donor.occupation,
      address: donor.address,
      location: donor.location,
      age: donor.age,
      isAvailable: donor.isAvailable,
      latitude: donor.latitude || null,
      longitude: donor.longitude || null,
      isRegisteredDonor: true,
      updatedAt: serverTimestamp()
    }, { merge: true });

  } catch (error) {
    console.error("Error saving profile to Firebase:", error);
    throw error;
  }
}
