import { deleteStoredItem, getStoredItem, setStoredItem } from './deviceStorage';

const URL_KEY = 'soteria_guardian_ha_url';
const TOKEN_KEY = 'soteria_guardian_ha_token';

export type HomeAssistantCredentials = {
  url: string;
  token: string;
};

export async function saveCredentials(credentials: HomeAssistantCredentials) {
  await Promise.all([
    setStoredItem(URL_KEY, credentials.url.replace(/\/$/, '')),
    setStoredItem(TOKEN_KEY, credentials.token.trim()),
  ]);
}

export async function loadCredentials(): Promise<HomeAssistantCredentials | null> {
  const [url, token] = await Promise.all([
    getStoredItem(URL_KEY),
    getStoredItem(TOKEN_KEY),
  ]);
  return url && token ? { url, token } : null;
}

export async function clearCredentials() {
  await Promise.all([
    deleteStoredItem(URL_KEY),
    deleteStoredItem(TOKEN_KEY),
  ]);
}
