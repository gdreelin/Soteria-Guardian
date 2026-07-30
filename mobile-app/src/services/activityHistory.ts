import { getStoredItem, setStoredItem } from './deviceStorage';

const ACTIVITY_KEY = 'soteria_guardian_activity_history';

export type GuardianActivity = {
  id: string;
  title: string;
  detail: string;
  occurredAt: string;
  kind: 'safe' | 'attention' | 'emergency' | 'information';
};

export async function loadActivities(): Promise<GuardianActivity[]> {
  const stored = await getStoredItem(ACTIVITY_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as GuardianActivity[];
  } catch {
    return [];
  }
}

export async function recordActivity(activity: Omit<GuardianActivity, 'id' | 'occurredAt'>) {
  const current = await loadActivities();
  const next: GuardianActivity[] = [
    {
      ...activity,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      occurredAt: new Date().toISOString(),
    },
    ...current,
  ].slice(0, 80);

  await setStoredItem(ACTIVITY_KEY, JSON.stringify(next));
}
