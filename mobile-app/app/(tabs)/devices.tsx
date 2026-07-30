import Ionicons from '@expo/vector-icons/Ionicons';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useHouseholdProfile } from '@/hooks/useHouseholdProfile';
import { useGuardianSnapshot } from '@/hooks/useGuardianSnapshot';
import { colors, radius, spacing } from '@/theme';

type DeviceItem = {
  name: string;
  location: string;
  detail: string;
  available: boolean;
  icon: keyof typeof Ionicons.glyphMap;
};

export default function DevicesScreen() {
  const { snapshot, connectionState, refreshing, refresh } = useGuardianSnapshot();
  const profile = useHouseholdProfile();
  const devices: DeviceItem[] = [
    { name: 'Home safety system', location: profile.homeLabel, detail: connectionState === 'connected' ? 'Connected now' : 'Connection lost', available: connectionState === 'connected', icon: 'server-outline' },
    { name: 'Living room safety sensor', location: 'Living Room', detail: snapshot.livingRoomPresence ? 'Presence detected' : 'No presence detected', available: snapshot.livingRoomSensorAvailable, icon: 'radio-outline' },
    { name: 'Bedroom safety sensor', location: 'Bedroom', detail: snapshot.bedroomPresence ? 'Presence detected' : 'No presence detected', available: snapshot.bedroomSensorAvailable, icon: 'radio-outline' },
    { name: 'Living room camera', location: 'Living Room', detail: snapshot.cameraAvailable ? 'Available when requested' : 'Camera unavailable', available: snapshot.cameraAvailable, icon: 'camera-outline' },
    { name: 'Wearable safety button', location: profile.residentName, detail: snapshot.wearableAvailable ? `Battery ${snapshot.wearableBattery}` : 'Battery status unavailable', available: snapshot.wearableAvailable, icon: 'watch-outline' },
  ];
  const needsAttention = devices.filter((device) => !device.available).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.blue} />}
      >
        <View style={styles.summary}>
          <Ionicons name={needsAttention ? 'warning' : 'checkmark-circle'} size={28} color={needsAttention ? colors.warning : colors.green} />
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>{needsAttention ? `${needsAttention} ${needsAttention === 1 ? 'device needs' : 'devices need'} attention` : 'All systems operational'}</Text>
            <Text style={styles.summaryDetail}>Last checked just now</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Safety equipment</Text>
        {devices.map((device) => <DeviceRow key={device.name} device={device} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

function DeviceRow({ device }: { device: DeviceItem }) {
  return (
    <View style={styles.deviceRow}>
      <View style={styles.deviceIcon}><Ionicons name={device.icon} size={23} color={colors.mutedStrong} /></View>
      <View style={styles.deviceText}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceDetail}>{device.location} · {device.available ? device.detail : 'Needs attention'}</Text>
      </View>
      <View style={styles.deviceState}>
        <Ionicons name={device.available ? 'checkmark-circle' : 'warning'} size={19} color={device.available ? colors.green : colors.warning} />
        <Text style={[styles.deviceStateText, !device.available && styles.deviceWarning]}>{device.available ? 'Working' : 'Check'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xl },
  summary: { minHeight: 92, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryText: { flex: 1 },
  summaryTitle: { color: colors.text, fontSize: 18, fontWeight: '900' },
  summaryDetail: { color: colors.muted, fontSize: 13, marginTop: 4 },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: spacing.md },
  deviceRow: { minHeight: 80, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  deviceIcon: { width: 42, height: 42, borderRadius: 10, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center' },
  deviceText: { flex: 1 },
  deviceName: { color: colors.text, fontSize: 15, fontWeight: '800' },
  deviceDetail: { color: colors.muted, fontSize: 12, marginTop: 4 },
  deviceState: { alignItems: 'center', gap: 2, minWidth: 50 },
  deviceStateText: { color: colors.green, fontSize: 11, fontWeight: '800' },
  deviceWarning: { color: colors.warning },
});
