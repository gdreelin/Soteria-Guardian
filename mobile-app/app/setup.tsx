import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/theme';
import { saveCredentials } from '@/services/secureSettings';
import { testConnection } from '@/services/homeAssistant';

export default function SetupScreen() {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);

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
      router.replace('/');
    } catch (error) {
      Alert.alert('Connection failed', error instanceof Error ? error.message : 'Unable to connect.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Connect Home Assistant</Text>
        <Text style={styles.body}>Use a dedicated, least-privileged Home Assistant account. Long-lived tokens are for development only.</Text>

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
        <TextInput
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          placeholder="Paste token"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Test and save Home Assistant connection"
          disabled={busy}
          onPress={connect}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, busy && styles.disabled]}
        >
          <Text style={styles.buttonText}>{busy ? 'Testing connection…' : 'Connect Securely'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: spacing.lg, gap: spacing.sm },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: spacing.sm },
  body: { color: colors.muted, fontSize: 16, lineHeight: 23, marginBottom: spacing.md },
  label: { color: colors.text, fontWeight: '700', marginTop: spacing.sm },
  input: { minHeight: 54, borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: spacing.md, fontSize: 16 },
  button: { minHeight: 56, marginTop: spacing.lg, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blue },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.6 },
});
