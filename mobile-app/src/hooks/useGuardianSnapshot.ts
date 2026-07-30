import { useCallback, useEffect, useState } from 'react';
import { loadGuardianSnapshot, testConnection, type GuardianSnapshot } from '@/services/homeAssistant';
import { loadCredentials } from '@/services/secureSettings';

export type GuardianConnectionState = 'loading' | 'setup' | 'connected' | 'offline';

export const emptySnapshot: GuardianSnapshot = {
  currentRoom: 'Unknown',
  lastMovement: 'Unavailable',
  activeAlert: false,
  alertSource: 'Safety alert',
  alertStarted: null,
  wearableBattery: 'Unavailable',
  wearableAvailable: false,
  bedroomPresence: false,
  bedroomSensorAvailable: false,
  livingRoomPresence: false,
  livingRoomSensorAvailable: false,
  cameraAvailable: false,
  lastUpdated: null,
};

export function useGuardianSnapshot() {
  const [snapshot, setSnapshot] = useState<GuardianSnapshot>(emptySnapshot);
  const [connectionState, setConnectionState] = useState<GuardianConnectionState>('loading');
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    const credentials = await loadCredentials();

    if (!credentials) {
      setConnectionState('setup');
      setRefreshing(false);
      return;
    }

    try {
      await testConnection(credentials);
      setSnapshot(await loadGuardianSnapshot(credentials));
      setConnectionState('connected');
    } catch {
      setConnectionState('offline');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { snapshot, connectionState, refreshing, refresh };
}
