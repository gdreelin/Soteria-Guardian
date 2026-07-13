import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing } from '@/theme';
import { callScript, loadGuardianSnapshot, type GuardianSnapshot } from '@/services/homeAssistant';
import { loadCredentials } from '@/services/secureSettings';

const emptySnapshot: GuardianSnapshot = {
  currentRoom: 'Unknown',
  lastMovement: 'Unavailable',
  activeAlert: false,
  wearableBattery: 'Unavailable',
  bedroomPresence: false,
  livingRoomPresence: false,
  cameraAvailable: false,
};

export default function DashboardScreen() {
  const [snapshot, setSnapshot] = useState(emptySnapshot);
  const [refreshing, setRefreshing] = useState(false);
  const [connected, setConnected] = useState(false);

  const refresh = useCallback(async () => {
    const credentials = await loadCredentials();
    if (!credentials) {
      setConnected(false);
      return;
    }

    try {
      setRefreshing(true);
      setSnapshot(await loadGuardianSnapshot(credentials));
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function runEmergency() {
    const credentials = await loadCredentials();
    if (!credentials) {
      router.push('/setup');
      return;
    }

    Alert.alert('Trigger emergency alert?', 'This will run the configured Soteria Guardian emergency script in Home Assistant.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Trigger Alert',
        style: 'destructive',
        onPress: async () => {
          try {
            await callScript(credentials, 'emergency');
            await refresh();
          } catch (error) {
            Alert.alert('Emergency action failed', error instanceof Error ? error.message : 'Unable to run the script.');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.blue} />}
      >
        <View style={styles.hero}>
          <View>
            <Text style={styles.eyebrow}>SYSTEM STATUS</Text>
            <Text style={styles.heroTitle}>{connected ? 'Protected' : 'Setup Required'}</Text>
            <Text style={styles.heroSub}>{connected ? 'Home Assistant connection active' : 'Connect Home Assistant to begin monitoring'}</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: connected ? colors.green : colors.warning }]} />
        </View>

        {!connected && (
          <Pressable onPress={() => router.push('/setup')} style={styles.setupButton} accessibilityRole="button">
            <Text style={styles.setupButtonText}>Connect Home Assistant</Text>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Resident Status</Text>
          <Text style={styles.updated}>Pull to refresh</Text>
        </View>

        <View style={styles.grid}>
          <StatusCard label="Current Room" value={snapshot.currentRoom} accent={colors.blue} />
          <StatusCard label="Last Movement" value={snapshot.lastMovement} accent={colors.cyan} />
          <StatusCard label="Wearable Battery" value={snapshot.wearableBattery} accent={colors.green} />
          <StatusCard label="Active Alert" value={snapshot.activeAlert ? 'ACTIVE' : 'None'} accent={snapshot.activeAlert ? colors.red : colors.green} />
        </View>

        <Text style={styles.sectionTitle}>Device Visibility</Text>
        <View style={styles.deviceList}>
          <DeviceRow name="Bedroom FP2" state={snapshot.bedroomPresence ? 'Presence detected' : 'Clear'} online={connected} />
          <DeviceRow name="Living Room FP2" state={snapshot.livingRoomPresence ? 'Presence detected' : 'Clear'} online={connected} />
          <DeviceRow name="G350 Camera" state={snapshot.cameraAvailable ? 'Available' : 'Unavailable'} online={snapshot.cameraAvailable} />
          <DeviceRow name="Wearable SOS" state={snapshot.wearableBattery} online={connected} />
        </View>

        <Pressable
          onPress={runEmergency}
          style={({ pressed }) => [styles.emergencyButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Trigger Soteria Guardian emergency alert"
        >
          <Text style={styles.emergencyTitle}>EMERGENCY ASSIST</Text>
          <Text style={styles.emergencySub}>Press to initiate the configured caregiver alert workflow</Text>
        </Pressable>

        <Text style={styles.safety}>Soteria Guardian is not a medical device and does not replace 911 or professional monitoring.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <View style={[styles.card, { borderTopColor: accent }]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue} numberOfLines={2}>{value}</Text>
    </View>
  );
}

function DeviceRow({ name, state, online }: { name: string; state: string; online: boolean }) {
  return (
    <View style={styles.deviceRow}>
      <View style={[styles.deviceDot, { backgroundColor: online ? colors.green : colors.red }]} />
      <View style={styles.deviceText}>
        <Text style={styles.deviceName}>{name}</Text>
        <Text style={styles.deviceState}>{state}</Text>
      </View>
      <Text style={styles.deviceBadge}>{online ? 'ONLINE' : 'OFFLINE'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 44 },
  hero: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.lg },
  eyebrow: { color: colors.blue, fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  heroSub: { color: colors.muted, marginTop: 5, maxWidth: 270 },
  statusDot: { width: 18, height: 18, borderRadius: 9 },
  setupButton: { minHeight: 54, borderRadius: 14, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  setupButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: spacing.sm },
  updated: { color: colors.muted, fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: { width: '48%', minHeight: 118, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderTopWidth: 4, borderRadius: 14, padding: spacing.md },
  cardLabel: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  cardValue: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: spacing.sm },
  deviceList: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 14, overflow: 'hidden' },
  deviceRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  deviceDot: { width: 11, height: 11, borderRadius: 6, marginRight: spacing.md },
  deviceText: { flex: 1 },
  deviceName: { color: colors.text, fontWeight: '800', fontSize: 16 },
  deviceState: { color: colors.muted, marginTop: 3 },
  deviceBadge: { color: colors.muted, fontSize: 11, fontWeight: '900' },
  emergencyButton: { minHeight: 112, borderRadius: 18, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', padding: spacing.md, marginTop: spacing.sm },
  emergencyTitle: { color: '#fff', fontSize: 23, fontWeight: '900', letterSpacing: 0.7 },
  emergencySub: { color: '#ffecec', textAlign: 'center', marginTop: 7, maxWidth: 300 },
  safety: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.sm },
  pressed: { opacity: 0.82 },
});
