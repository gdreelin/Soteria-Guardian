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
  wearableBattery: string;
  bedroomPresence: boolean;
  livingRoomPresence: boolean;
  cameraAvailable: boolean;
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
  const [room, movement, alert, battery, bedroom, livingRoom, camera] = await Promise.all([
    getState(credentials, entities.currentRoom),
    getState(credentials, entities.lastMovement),
    getState(credentials, entities.activeAlert),
    getState(credentials, entities.wearableBattery),
    getState(credentials, entities.bedroomPresence),
    getState(credentials, entities.livingRoomPresence),
    getState(credentials, entities.livingRoomCamera),
  ]);

  return {
    currentRoom: room?.state ?? 'Unknown',
    lastMovement: movement?.state ?? 'Unavailable',
    activeAlert: alert?.state === 'on',
    wearableBattery: battery?.state ? `${battery.state}%` : 'Unavailable',
    bedroomPresence: bedroom?.state === 'on',
    livingRoomPresence: livingRoom?.state === 'on',
    cameraAvailable: Boolean(camera && !['unavailable', 'unknown'].includes(camera.state)),
  };
}

export async function callScript(credentials: HomeAssistantCredentials, script: keyof typeof scripts) {
  return request(credentials, `/api/services/script/${scripts[script]}`, {
    method: 'POST',
    body: '{}',
  });
}
