export interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
  profile: UserProfile;
}

export interface UserProfile {
  medicalHistory: string[];
  healthGoals: string[];
  dateOfBirth: string;
  gender: string;
  weight: number;
  height: number;
  allergies: string[];
  medications: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}