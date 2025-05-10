
export type UserRole = 'hew' | 'officer';

export interface User {
  id: string; // This will correspond to MongoDB's _id string representation
  username: string;
  role: UserRole;
}

export interface Report {
  id: string; // This will correspond to MongoDB's _id string representation
  timestamp: number;
  symptoms: string;
  suspectedDisease: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other' | 'not_specified';
  location: {
    latitude: number;
    longitude: number;
  } | null; // Make location explicitly nullable
  region?: string;
  isAnonymous?: boolean;
  // imageUrl?: string; 
  // MongoDB specific fields like _id, createdAt, updatedAt are handled by Mongoose model
  // but 'id' will be the string version of _id for frontend use.
}
