import { entities, scripts } from '@/config/entities';
import type { HomeAssistantCredentials } from './secureSettings';

export type HassState = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
};

export type GuardianSnapshot = {
  currentRoom: string;
  lastMovement: string;
  activeAlert: boolean;
  alertSource: string;
  alertStarted: string | null;
  wearableBattery: string;
  wearableAvailable: boolean;
  bedroomPresence: boolean;
  bedroomSensorAvailable: boolean;
  livingRoomPresence: boolean;
  livingRoomSensorAvailable: boolean;
  cameraAvailable: boolean;
  lastUpdated: string | null;
};

async function request<T>(credentials: HomeAssistantCredentials, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${credentials.url}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`Home Assistant request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function testConnection(credentials: HomeAssistantCredentials) {
  await request(credentials, '/api/');
}

export async function getState(credentials: HomeAssistantCredentials, entityId: string): Promise<HassState | null> {
  try {
    return await request<HassState>(credentials, `/api/states/${entityId}`);
  } catch {
    return null;
  }
}

export async function loadGuardianSnapshot(credentials: HomeAssistantCredentials): Promise<GuardianSnapshot> {
  const [room, movement, alert, alertSource, alertStarted, battery, bedroom, livingRoom, camera] = await Promise.all([
    getState(credentials, entities.currentRoom),
    getState(credentials, entities.lastMovement),
    getState(credentials, entities.activeAlert),
    getState(credentials, entities.alertSource),
    getState(credentials, entities.alertStarted),
    getState(credentials, entities.wearableBattery),
    getState(credentials, entities.bedroomPresence),
    getState(credentials, entities.livingRoomPresence),
    getState(credentials, entities.livingRoomCamera),
  ]);

  return {
    currentRoom: room?.state ?? 'Unknown',
    lastMovement: movement?.state ?? 'Unavailable',
    activeAlert: alert?.state === 'on',
    alertSource: alertSource?.state && alertSource.state !== 'None' ? alertSource.state : 'Safety alert',
    alertStarted: alertStarted?.state && !['unknown', 'unavailable'].includes(alertStarted.state) ? alertStarted.state : null,
    wearableBattery: battery?.state ? `${battery.state}%` : 'Unavailable',
    wearableAvailable: isAvailable(battery),
    bedroomPresence: bedroom?.state === 'on',
    bedroomSensorAvailable: isAvailable(bedroom),
    livingRoomPresence: livingRoom?.state === 'on',
    livingRoomSensorAvailable: isAvailable(livingRoom),
    cameraAvailable: Boolean(camera && !['unavailable', 'unknown'].includes(camera.state)),
    lastUpdated: latestTimestamp([room, movement, alert, battery, bedroom, livingRoom]),
  };
}

export async function callScript(credentials: HomeAssistantCredentials, script: keyof typeof scripts) {
  return request(credentials, `/api/services/script/${scripts[script]}`, {
    method: 'POST',
    body: '{}',
  });
}

export function getCameraSource(credentials: HomeAssistantCredentials) {
  return {
    uri: `${credentials.url}/api/camera_proxy/${entities.livingRoomCamera}?time=${Date.now()}`,
    headers: { Authorization: `Bearer ${credentials.token}` },
  };
}

function isAvailable(state: HassState | null) {
  return Boolean(state && !['unknown', 'unavailable'].includes(state.state));
}

function latestTimestamp(states: (HassState | null)[]) {
  const timestamps = states.flatMap((state) => (state?.last_updated ? [state.last_updated] : []));
  return timestamps.length ? timestamps.sort().at(-1) ?? null : null;
}
