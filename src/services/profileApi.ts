// Mock API Service for Profile Management
// This simulates backend API calls using localStorage

import { UserProfile, ProfileType } from '../context/ProfileContext';

const STORAGE_KEY = 'user_profiles';
const USER_ID_KEY = 'current_user_id';

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get current user ID (simulated - in real app this would come from auth)
const getCurrentUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

// Get all profiles data from storage
const getStorageData = (): Record<string, UserProfile[]> => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

// Save profiles data to storage
const setStorageData = (data: Record<string, UserProfile[]>): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Initialize default profiles for new users
const getDefaultProfiles = (): UserProfile[] => [
  {
    id: 1,
    name: 'Ben',
    type: 'KIDS',
    subtitle: 'KIDS',
    avatar: '🧒',
    progress: 0,
  },
  {
    id: 2,
    name: 'Sarah',
    type: 'STUDENTS',
    subtitle: 'STUDENTS',
    avatar: '👧',
    progress: 0,
  },
];

/**
 * Fetch profiles for current user
 * Simulates: GET /api/users/{userId}/profiles
 */
export const fetchUserProfiles = async (): Promise<ApiResponse<UserProfile[]>> => {
  await delay(300); // Simulate network delay
  
  try {
    const userId = getCurrentUserId();
    const allData = getStorageData();
    
    // If user has no profiles, return defaults
    if (!allData[userId]) {
      allData[userId] = getDefaultProfiles();
      setStorageData(allData);
    }
    
    return {
      success: true,
      data: allData[userId],
      message: 'Profiles fetched successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch profiles'
    };
  }
};

/**
 * Create a new profile for current user
 * Simulates: POST /api/users/{userId}/profiles
 */
export const createProfile = async (
  name: string, 
  type: ProfileType
): Promise<ApiResponse<UserProfile>> => {
  await delay(400);
  
  try {
    const userId = getCurrentUserId();
    const allData = getStorageData();
    const userProfiles = allData[userId] || [];
    
    // Generate new profile
    const avatars = {
      KIDS: ['🧒', '👧', '🧑', '👦', '🧒🏻', '👧🏻', '🧒🏽', '👧🏽'],
      STUDENTS: ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '👨🏻‍🎓', '👩🏻‍🎓', '👨🏽‍🎓', '👩🏽‍🎓'],
      ASPIRANTS: ['💼', '📚', '🎯', '🏆', '⭐', '🌟', '✨', '🚀']
    };
    
    const randomAvatar = avatars[type][Math.floor(Math.random() * avatars[type].length)];
    
    const newProfile: UserProfile = {
      id: Date.now(),
      name,
      type,
      subtitle: type,
      avatar: randomAvatar,
      progress: 0,
    };
    
    userProfiles.push(newProfile);
    allData[userId] = userProfiles;
    setStorageData(allData);
    
    return {
      success: true,
      data: newProfile,
      message: 'Profile created successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create profile'
    };
  }
};

/**
 * Delete a profile for current user
 * Simulates: DELETE /api/users/{userId}/profiles/{profileId}
 */
export const deleteProfile = async (profileId: number): Promise<ApiResponse<null>> => {
  await delay(300);
  
  try {
    const userId = getCurrentUserId();
    const allData = getStorageData();
    const userProfiles = allData[userId] || [];
    
    const updatedProfiles = userProfiles.filter(p => p.id !== profileId);
    allData[userId] = updatedProfiles;
    setStorageData(allData);
    
    return {
      success: true,
      message: 'Profile deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete profile'
    };
  }
};

/**
 * Update profile progress
 * Simulates: PATCH /api/users/{userId}/profiles/{profileId}
 */
export const updateProfileProgress = async (
  profileId: number, 
  progress: number
): Promise<ApiResponse<UserProfile>> => {
  await delay(300);
  
  try {
    const userId = getCurrentUserId();
    const allData = getStorageData();
    const userProfiles = allData[userId] || [];
    
    const profileIndex = userProfiles.findIndex(p => p.id === profileId);
    if (profileIndex === -1) {
      return {
        success: false,
        message: 'Profile not found'
      };
    }
    
    userProfiles[profileIndex].progress = progress;
    allData[userId] = userProfiles;
    setStorageData(allData);
    
    return {
      success: true,
      data: userProfiles[profileIndex],
      message: 'Profile updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update profile'
    };
  }
};
