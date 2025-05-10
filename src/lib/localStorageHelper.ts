
import type { User, Report } from './types';

const USER_KEY = 'outbreak_sentinel_user';
// const REPORTS_KEY = 'outbreak_sentinel_reports'; // No longer primary storage for reports

// User functions (still used for client-side session persistence)
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const storeUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
};

// Report functions are removed as primary storage is now MongoDB.
// The following functions are either removed or adapted.

// This function now just returns the sample data array, doesn't store it in localStorage.
export const getSampleReportsArray = (): Omit<Report, 'id'>[] => {
  // Timestamps are relative to "now" when this function is called.
  const now = Date.now();
  const sampleReports: Omit<Report, 'id'>[] = [ // Omit 'id' as backend will generate it
    {
      // id: 'sample-1', // No client-side ID
      timestamp: now - 86400000 * 2, // 2 days ago
      symptoms: 'High fever, headache, joint pain',
      suspectedDisease: 'Malaria',
      patientName: 'Abebe Bikila',
      patientAge: 35,
      patientGender: 'male',
      location: { latitude: 9.03, longitude: 38.74 }, // Addis Ababa approx
      region: 'Addis Ababa',
      isAnonymous: false,
    },
    {
      // id: 'sample-2',
      timestamp: now - 86400000, // 1 day ago
      symptoms: 'Severe diarrhea, vomiting, dehydration',
      suspectedDisease: 'Cholera',
      patientName: 'Fatuma Roba',
      patientAge: 28,
      patientGender: 'female',
      location: { latitude: 13.49, longitude: 39.47 }, // Mekelle approx
      region: 'Tigray',
      isAnonymous: false,
    },
    {
      // id: 'sample-3',
      timestamp: now,
      symptoms: 'Cough, fever, difficulty breathing',
      suspectedDisease: 'Pneumonia',
      location: null, // No GPS
      region: 'Oromia',
      isAnonymous: false,
    },
     {
      // id: 'sample-4-anon',
      timestamp: now - 86400000 * 0.5, // 12 hours ago
      symptoms: 'Unexplained rash, mild fever',
      suspectedDisease: 'Other',
      location: null, 
      region: 'Amhara',
      isAnonymous: true,
    },
  ];
  // No longer storing in localStorage here:
  // if (typeof window !== 'undefined') {
  //   localStorage.setItem(REPORTS_KEY, JSON.stringify(sampleReports.map((r, i) => ({...r, id: `sample-${i+1}`))));
  // }
  return sampleReports;
};

// clearStoredReports can be kept if some local caching mechanism for reports is ever re-introduced for offline,
// but for now, it's not directly used by the main flows.
// export const clearStoredReports = (): void => {
//   if (typeof window === 'undefined') return;
//   localStorage.removeItem(REPORTS_KEY);
// };
