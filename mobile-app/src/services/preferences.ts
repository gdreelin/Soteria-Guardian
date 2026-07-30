import { getStoredItem, setStoredItem } from './deviceStorage';

const PREFERENCES_KEY = 'soteria_guardian_preferences';

export type AppPreferences = {
  criticalAlerts: boolean;
  vibration: boolean;
  lockScreenDetails: boolean;
};

export const defaultPreferences: AppPreferences = {
  criticalAlerts: true,
  vibration: true,
  lockScreenDetails: false,
};

export async function loadPreferences(): Promise<AppPreferences> {
  const stored = await getStoredItem(PREFERENCES_KEY);
  if (!stored) return defaultPreferences;

  try {
    return { ...defaultPreferences, ...(JSON.parse(stored) as Partial<AppPreferences>) };
  } catch {
    return defaultPreferences;
  }
}

export async function savePreferences(preferences: AppPreferences) {
  await setStoredItem(PREFERENCES_KEY, JSON.stringify(preferences));
}
