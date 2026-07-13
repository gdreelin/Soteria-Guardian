import * as SecureStore from 'expo-secure-store';

const URL_KEY = 'soteria_guardian_ha_url';
const TOKEN_KEY = 'soteria_guardian_ha_token';

export type HomeAssistantCredentials = {
  url: string;
  token: string;
};

export async function saveCredentials(credentials: HomeAssistantCredentials) {
  await Promise.all([
    SecureStore.setItemAsync(URL_KEY, credentials.url.replace(/\/$/, '')),
    SecureStore.setItemAsync(TOKEN_KEY, credentials.token.trim()),
  ]);
}

export async function loadCredentials(): Promise<HomeAssistantCredentials | null> {
  const [url, token] = await Promise.all([
    SecureStore.getItemAsync(URL_KEY),
    SecureStore.getItemAsync(TOKEN_KEY),
  ]);
  return url && token ? { url, token } : null;
}

export async function clearCredentials() {
  await Promise.all([
    SecureStore.deleteItemAsync(URL_KEY),
    SecureStore.deleteItemAsync(TOKEN_KEY),
  ]);
}
