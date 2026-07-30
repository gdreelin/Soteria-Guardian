import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/theme';
import { loadCredentials, saveCredentials } from '@/services/secureSettings';
import { testConnection } from '@/services/homeAssistant';

export default function SetupScreen() {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [hasSavedConnection, setHasSavedConnection] = useState(false);

  useEffect(() => {
    void loadCredentials().then((credentials) => {
      if (!credentials) return;
      setUrl(credentials.url);
      setToken(credentials.token);
      setHasSavedConnection(true);
    });
  }, []);

  async function connect() {
    if (!url.trim() || !token.trim()) {
      Alert.alert('Missing information', 'Enter the Home Assistant URL and access token.');
      return;
    }

    const credentials = { url: url.trim(), token: token.trim() };
    try {
      setBusy(true);
      await testConnection(credentials);
      await saveCredentials(credentials);
      setHasSavedConnection(true);
      Alert.alert('Connection saved', 'The Home Assistant address and token are saved on this device.', [
        { text: 'Done', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      Alert.alert('Connection failed', error instanceof Error ? error.message : 'Unable to connect.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Connect Home Assistant</Text>
        <Text style={styles.body}>Use a dedicated, least-privileged Home Assistant account. The saved connection remains on this device.</Text>

        {hasSavedConnection && (
          <View style={styles.savedBand}>
            <Ionicons name="checkmark-circle" size={22} color={colors.green} />
            <Text style={styles.savedText}>Saved connection loaded</Text>
          </View>
        )}

        <Text style={styles.label}>Home Assistant URL</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          placeholder="https://home.example.com"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Long-lived access token</Text>
        <View style={styles.tokenInput}>
          <TextInput
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={!showToken}
            placeholder="Paste token"
            placeholderTextColor={colors.muted}
            style={styles.tokenText}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showToken ? 'Hide access token' : 'Show access token'}
            onPress={() => setShowToken((current) => !current)}
            style={styles.iconButton}
          >
            <Ionicons name={showToken ? 'eye-off-outline' : 'eye-outline'} size={23} color={colors.mutedStrong} />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Test and save Home Assistant connection"
          disabled={busy}
          onPress={connect}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, busy && styles.disabled]}
        >
          <Text style={styles.buttonText}>{busy ? 'Testing connection...' : 'Test and Save Connection'}</Text>
        </Pressable>
        <Text style={styles.storageNote}>On web, save credentials only on a trusted personal device.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { width: '100%', maxWidth: 680, minHeight: '100%', alignSelf: 'center', padding: spacing.lg, gap: spacing.sm },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: spacing.sm },
  body: { color: colors.muted, fontSize: 16, lineHeight: 23, marginBottom: spacing.md },
  label: { color: colors.text, fontWeight: '700', marginTop: spacing.sm },
  input: { minHeight: 54, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: spacing.md, fontSize: 16 },
  tokenInput: { minHeight: 54, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  tokenText: { flex: 1, minHeight: 52, color: colors.text, paddingHorizontal: spacing.md, fontSize: 16 },
  iconButton: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  savedBand: { minHeight: 50, marginBottom: spacing.sm, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.green, borderRadius: 12, backgroundColor: colors.surface },
  savedText: { color: colors.text, fontSize: 14, fontWeight: '800' },
  button: { minHeight: 56, marginTop: spacing.lg, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
  storageNote: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.sm },
});
