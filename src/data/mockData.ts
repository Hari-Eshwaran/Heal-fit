import { User } from '../types/auth';

// Mock users data
export const mockUsers: Record<string, User & { password: string }> = {
  'hari@heal.com': {
    email: 'hari@heal.com',
    password: 'hari8892',
    name: 'Harishwaran P',
    role: 'admin',
    profile: {
      medicalHistory: ['Asthma', 'Seasonal allergies'],
      healthGoals: ['Improve cardiovascular health', 'Reduce stress'],
      dateOfBirth: '2004-06-11',
      gender: 'male',
      weight: 75,
      height: 175,
      allergies: ['Pollen', 'Dust'],
      medications: ['Albuterol inhaler']
    }
  },
  'anu@heal.com': {
    email: 'anu@heal.com',
    password: 'hari8892',
    name: 'Anusha B',
    role: 'user',
    profile: {
      medicalHistory: ['None'],
      healthGoals: ['Weight management', 'Better sleep'],
      dateOfBirth: '2005-03-07',
      gender: 'female',
      weight: 62,
      height: 165,
      allergies: [],
      medications: []
    }
  }
};

// Shared health metrics data
export const healthMetrics = {
  aggregated: {
    averageHeartRate: '72 bpm',
    averageBloodPressure: '120/80',
    averageSleepHours: '7.5 hrs',
    averageStepsDaily: '8,456'
  },
  byUser: {
    'hari@heal.com': {
      heartRate: '68 bpm',
      bloodPressure: '118/75',
      sleepHours: '7.8 hrs',
      stepsToday: '9,234'
    },
    'anu@heal.com': {
      heartRate: '75 bpm',
      bloodPressure: '122/82',
      sleepHours: '7.2 hrs',
      stepsToday: '7,845'
    }
  }
};

// System analytics data
export const systemData = {
  users: {
    total: Object.keys(mockUsers).length,
    active: Object.keys(mockUsers).length,
    demographics: {
      age: { '18-24': 20, '25-34': 35, '35-44': 25, '45+': 20 },
      gender: { male: 48, female: 49, other: 3 }
    }
  },
  system: {
    uptime: '99.9%',
    errors: {
      critical: 0,
      warning: 3,
      info: 12
    },
    lastDeployment: '2024-03-10 15:30 UTC'
  },
  features: {
    mostUsed: [
      { name: 'Health Tracking', usage: 78 },
      { name: 'Meal Planning', usage: 65 },
      { name: 'Exercise Logs', usage: 58 }
    ]
  },
  security: {
    recentLogins: [
      { user: 'john.doe@example.com', time: '10 minutes ago', status: 'success' },
      { user: 'jane.smith@example.com', time: '25 minutes ago', status: 'success' },
      { user: 'unknown@test.com', time: '1 hour ago', status: 'failed' }
    ]
  }
};