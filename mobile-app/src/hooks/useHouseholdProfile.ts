import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { defaultHouseholdProfile, loadHouseholdProfile } from '@/services/householdProfile';

export function useHouseholdProfile() {
  const [profile, setProfile] = useState(defaultHouseholdProfile);

  useFocusEffect(useCallback(() => {
    void loadHouseholdProfile().then(setProfile);
  }, []));

  return profile;
}
