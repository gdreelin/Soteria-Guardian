import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { recordActivity } from '@/services/activityHistory';
import { callScript } from '@/services/homeAssistant';
import {
  defaultHouseholdProfile,
  loadHouseholdProfile,
  saveHouseholdProfile,
  type HouseholdProfile,
} from '@/services/householdProfile';
import { defaultPreferences, loadPreferences, savePreferences, type AppPreferences } from '@/services/preferences';
import { clearCredentials, loadCredentials } from '@/services/secureSettings';
import { colors, spacing } from '@/theme';

export default function SettingsScreen() {
  const [profile, setProfile] = useState<HouseholdProfile>(defaultHouseholdProfile);
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useFocusEffect(useCallback(() => {
    void Promise.all([loadHouseholdProfile(), loadPreferences(), loadCredentials()]).then(([savedProfile, savedPreferences, credentials]) => {
      setProfile(savedProfile);
      setPreferences(savedPreferences);
      setConnectionUrl(credentials?.url ?? null);
    });
  }, []));

  function updateProfile(key: keyof HouseholdProfile, value: string) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile() {
    if (!profile.residentName.trim() || !profile.homeLabel.trim()) {
      Alert.alert('Resident information needed', 'Enter a resident name and home or place name.');
      return;
    }

    try {
      setSaving(true);
      const saved = await saveHouseholdProfile(profile);
      setProfile(saved);
      await recordActivity({ title: 'Household profile updated', detail: `${saved.residentName} · ${saved.homeLabel}`, kind: 'information' });
      Alert.alert('Profile saved', 'The dashboard and caregiver actions now use this information.');
    } finally {
      setSaving(false);
    }
  }

  function updatePreference(key: keyof AppPreferences, value: boolean) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    void savePreferences(next);
  }

  function forgetConnection() {
    Alert.alert('Forget Home Assistant connection?', 'The saved server address and token will be removed from this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Forget Connection',
        style: 'destructive',
        onPress: async () => {
          await clearCredentials();
          setConnectionUrl(null);
          await recordActivity({ title: 'Home Assistant connection removed', detail: 'Saved credentials cleared from this device', kind: 'attention' });
        },
      },
    ]);
  }

  async function runSystemTest() {
    const credentials = await loadCredentials();
    if (!credentials) {
      router.push('/setup');
      return;
    }

    try {
      await callScript(credentials, 'systemTest');
      await recordActivity({ title: 'System test started', detail: 'Test signal sent to the home safety system', kind: 'information' });
      Alert.alert('System test started', 'The home safety system accepted the test request.');
    } catch {
      Alert.alert('Test could not start', 'Check the connection and try again.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Resident profile</Text>
        <ProfileInput label="Resident name" value={profile.residentName} onChangeText={(value) => updateProfile('residentName', value)} placeholder="Resident" />
        <ProfileInput label="Home or place name" value={profile.homeLabel} onChangeText={(value) => updateProfile('homeLabel', value)} placeholder="Example: Oak Street Apartment" />
        <ProfileInput label="Resident phone" value={profile.residentPhone} onChangeText={(value) => updateProfile('residentPhone', value)} placeholder="Phone number" keyboardType="phone-pad" />

        <Text style={styles.sectionTitle}>Primary caregiver</Text>
        <ProfileInput label="Primary caregiver name" value={profile.primaryCaregiverName} onChangeText={(value) => updateProfile('primaryCaregiverName', value)} placeholder="Primary caregiver" />
        <ProfileInput label="Primary caregiver phone" value={profile.primaryCaregiverPhone} onChangeText={(value) => updateProfile('primaryCaregiverPhone', value)} placeholder="Phone number" keyboardType="phone-pad" />

        <Text style={styles.sectionTitle}>Backup caregiver</Text>
        <ProfileInput label="Backup caregiver name" value={profile.backupCaregiverName} onChangeText={(value) => updateProfile('backupCaregiverName', value)} placeholder="Backup caregiver" />
        <ProfileInput label="Backup caregiver phone" value={profile.backupCaregiverPhone} onChangeText={(value) => updateProfile('backupCaregiverPhone', value)} placeholder="Phone number" keyboardType="phone-pad" />
        <ActionButton label={saving ? 'Saving Profile' : 'Save Household Profile'} icon="save-outline" variant="primary" disabled={saving} onPress={() => void saveProfile()} />

        <Text style={styles.sectionTitle}>Home Assistant</Text>
        <View style={styles.connectionRow}>
          <Ionicons name={connectionUrl ? 'checkmark-circle' : 'cloud-offline-outline'} size={25} color={connectionUrl ? colors.green : colors.warning} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{connectionUrl ? 'Connection saved' : 'Not connected'}</Text>
            <Text style={styles.rowDetail} numberOfLines={1}>{connectionUrl ?? 'Add the server address and access token'}</Text>
          </View>
        </View>
        <ActionButton label={connectionUrl ? 'Edit Saved Connection' : 'Connect Home Assistant'} icon="link" onPress={() => router.push('/setup')} />
        {connectionUrl && <ActionButton label="Forget Saved Connection" icon="trash-outline" variant="quiet" onPress={forgetConnection} />}
        <ActionButton label="Run System Test" icon="pulse" variant="quiet" onPress={() => void runSystemTest()} />

        <Text style={styles.sectionTitle}>Notifications</Text>
        <PreferenceRow
          icon="notifications"
          title="Critical alerts"
          detail="Emergency and no-response notifications"
          value={preferences.criticalAlerts}
          onValueChange={(value) => updatePreference('criticalAlerts', value)}
        />
        <PreferenceRow
          icon="phone-portrait-outline"
          title="Critical vibration"
          detail="Vibrate for urgent caregiver alerts"
          value={preferences.vibration}
          onValueChange={(value) => updatePreference('vibration', value)}
        />
        <PreferenceRow
          icon="lock-closed-outline"
          title="Lock-screen details"
          detail="Show resident details before the phone is unlocked"
          value={preferences.lockScreenDetails}
          onValueChange={(value) => updatePreference('lockScreenDetails', value)}
        />

        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.infoRow}>
          <Ionicons name="camera-outline" size={23} color={colors.teal} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Camera access is intentional</Text>
            <Text style={styles.rowDetail}>The living room camera opens only after a caregiver selects it.</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={23} color={colors.green} />
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>Local safety continues</Text>
            <Text style={styles.rowDetail}>Home Assistant continues local alerts if this app is unavailable.</Text>
          </View>
        </View>

        <Text style={styles.version}>Soteria Guardian 0.1.0 · Not a medical device</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileInput({ label, value, onChangeText, placeholder, keyboardType = 'default' }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: 'default' | 'phone-pad' }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'phone-pad' ? 'none' : 'words'}
        style={styles.input}
      />
    </View>
  );
}

function PreferenceRow({ icon, title, detail, value, onValueChange }: { icon: keyof typeof Ionicons.glyphMap; title: string; detail: string; value: boolean; onValueChange: (value: boolean) => void }) {
  return (
    <View style={styles.preferenceRow}>
      <Ionicons name={icon} size={23} color={colors.mutedStrong} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <Switch
        accessibilityLabel={title}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceSoft, true: colors.blue }}
        thumbColor={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.lg, marginBottom: spacing.xs },
  field: { gap: spacing.xs },
  fieldLabel: { color: colors.mutedStrong, fontSize: 13, fontWeight: '800' },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: spacing.md, fontSize: 16 },
  connectionRow: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  preferenceRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoRow: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  rowDetail: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  version: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: spacing.lg },
});
