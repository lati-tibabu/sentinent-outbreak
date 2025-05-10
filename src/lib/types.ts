export type UserRole = 'hew' | 'officer';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface Report {
  id: string;
  timestamp: number;
  symptoms: string;
  suspectedDisease: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other' | '';
  location: {
    latitude: number;
    longitude: number;
  } | null;
  region?: string; // e.g., 'Addis Ababa', 'Tigray', etc.
  // imageUrl?: string; // For simplicity, not storing actual image data
  isAnonymous?: boolean;
}
