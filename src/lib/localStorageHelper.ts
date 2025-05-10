import type { User, Report } from './types';

const USER_KEY = 'outbreak_sentinel_user';
const REPORTS_KEY = 'outbreak_sentinel_reports';

// User functions
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

// Report functions
export const getStoredReports = (): Report[] => {
  if (typeof window === 'undefined') return [];
  const reportsJson = localStorage.getItem(REPORTS_KEY);
  return reportsJson ? JSON.parse(reportsJson) : [];
};

export const storeReports = (reports: Report[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
};

export const addStoredReport = (report: Report): Report[] => {
  if (typeof window === 'undefined') return [];
  const reports = getStoredReports();
  const updatedReports = [...reports, report];
  storeReports(updatedReports);
  return updatedReports;
};

export const clearStoredReports = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(REPORTS_KEY);
};

export const loadSampleReports = (): Report[] => {
  const sampleReports: Report[] = [
    {
      id: 'sample-1',
      timestamp: Date.now() - 86400000 * 2, // 2 days ago
      symptoms: 'High fever, headache, joint pain',
      suspectedDisease: 'Malaria',
      patientName: 'Abebe Bikila',
      patientAge: 35,
      patientGender: 'male',
      location: { latitude: 9.03, longitude: 38.74 }, // Addis Ababa approx
      region: 'Addis Ababa',
    },
    {
      id: 'sample-2',
      timestamp: Date.now() - 86400000, // 1 day ago
      symptoms: 'Severe diarrhea, vomiting, dehydration',
      suspectedDisease: 'Cholera',
      patientName: 'Fatuma Roba',
      patientAge: 28,
      patientGender: 'female',
      location: { latitude: 13.49, longitude: 39.47 }, // Mekelle approx
      region: 'Tigray',
    },
    {
      id: 'sample-3',
      timestamp: Date.now(),
      symptoms: 'Cough, fever, difficulty breathing',
      suspectedDisease: 'Pneumonia',
      location: null, // No GPS
      region: 'Oromia',
    },
  ];
  storeReports(sampleReports);
  return sampleReports;
};
