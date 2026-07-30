import { getStoredItem, setStoredItem } from './deviceStorage';

const PROFILE_KEY = 'soteria_guardian_household_profile';

export type HouseholdProfile = {
  residentName: string;
  homeLabel: string;
  residentPhone: string;
  primaryCaregiverName: string;
  primaryCaregiverPhone: string;
  backupCaregiverName: string;
  backupCaregiverPhone: string;
};

export const defaultHouseholdProfile: HouseholdProfile = {
  residentName: process.env.EXPO_PUBLIC_RESIDENT_NAME?.trim() || 'Resident',
  homeLabel: process.env.EXPO_PUBLIC_HOME_LABEL?.trim() || 'Home',
  residentPhone: process.env.EXPO_PUBLIC_RESIDENT_PHONE?.trim() || '',
  primaryCaregiverName: process.env.EXPO_PUBLIC_PRIMARY_CAREGIVER_NAME?.trim() || 'Primary Caregiver',
  primaryCaregiverPhone: process.env.EXPO_PUBLIC_PRIMARY_CAREGIVER_PHONE?.trim() || '',
  backupCaregiverName: process.env.EXPO_PUBLIC_BACKUP_CAREGIVER_NAME?.trim() || 'Backup Caregiver',
  backupCaregiverPhone: process.env.EXPO_PUBLIC_BACKUP_CAREGIVER_PHONE?.trim() || '',
};

export async function loadHouseholdProfile(): Promise<HouseholdProfile> {
  const stored = await getStoredItem(PROFILE_KEY);
  if (!stored) return defaultHouseholdProfile;

  try {
    return normalizeProfile({ ...defaultHouseholdProfile, ...(JSON.parse(stored) as Partial<HouseholdProfile>) });
  } catch {
    return defaultHouseholdProfile;
  }
}

export async function saveHouseholdProfile(profile: HouseholdProfile) {
  const normalized = normalizeProfile(profile);
  await setStoredItem(PROFILE_KEY, JSON.stringify(normalized));
  return normalized;
}

function normalizeProfile(profile: HouseholdProfile): HouseholdProfile {
  return {
    residentName: profile.residentName.trim() || 'Resident',
    homeLabel: profile.homeLabel.trim() || 'Home',
    residentPhone: profile.residentPhone.trim(),
    primaryCaregiverName: profile.primaryCaregiverName.trim() || 'Primary Caregiver',
    primaryCaregiverPhone: profile.primaryCaregiverPhone.trim(),
    backupCaregiverName: profile.backupCaregiverName.trim() || 'Backup Caregiver',
    backupCaregiverPhone: profile.backupCaregiverPhone.trim(),
  };
}
