import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { StatusHero, type GuardianStatus } from '@/components/StatusHero';
import { useHouseholdProfile } from '@/hooks/useHouseholdProfile';
import { useGuardianSnapshot } from '@/hooks/useGuardianSnapshot';
import { recordActivity } from '@/services/activityHistory';
import { callConfiguredContact } from '@/services/contactActions';
import { callScript } from '@/services/homeAssistant';
import { loadCredentials } from '@/services/secureSettings';
import type { HouseholdProfile } from '@/services/householdProfile';
import { colors, spacing } from '@/theme';

export default function HomeScreen() {
  const { snapshot, connectionState, refreshing, refresh } = useGuardianSnapshot();
  const profile = useHouseholdProfile();
  const openedAlert = useRef(false);

  useEffect(() => {
    if (snapshot.activeAlert && !openedAlert.current) {
      openedAlert.current = true;
      router.push('/alert');
    }
  }, [snapshot.activeAlert]);

  const status = getStatus(connectionState, snapshot.activeAlert);
  const statusCopy = getStatusCopy(status, snapshot.currentRoom, snapshot.lastMovement, profile);

  async function startWellnessCheck() {
    const credentials = await loadCredentials();
    if (!credentials) {
      router.push('/setup');
      return;
    }

    Alert.alert('Start wellness check?', `${profile.residentName} will be asked to press the safety button to confirm they are okay.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start Check',
        onPress: async () => {
          try {
            await callScript(credentials, 'wellnessCheck');
            await recordActivity({ title: 'Wellness check started', detail: `Waiting for ${profile.residentName} to respond`, kind: 'information' });
            Alert.alert('Wellness check started', `${profile.residentName} has been asked to confirm they are okay.`);
          } catch {
            Alert.alert('Check could not start', 'The home safety system did not accept the request.');
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
        <View style={styles.header}>
          <View style={styles.brandMark}><Ionicons name="shield-checkmark" size={24} color={colors.teal} /></View>
          <View style={styles.headerText}>
            <Text style={styles.brand}>Soteria Guardian</Text>
            <Text style={styles.homeLabel}>{profile.homeLabel}</Text>
          </View>
          <View style={[styles.livePill, connectionState !== 'connected' && styles.livePillOffline]}>
            <View style={[styles.liveDot, connectionState !== 'connected' && styles.liveDotOffline]} />
            <Text style={styles.liveText}>{connectionState === 'connected' ? 'LIVE' : connectionState === 'setup' ? 'SETUP' : 'OFFLINE'}</Text>
          </View>
        </View>

        <StatusHero status={status} title={statusCopy.title} location={statusCopy.location} detail={statusCopy.detail} />

        {status === 'setup' && <ActionButton label="Connect Home Safety System" icon="link" variant="primary" onPress={() => router.push('/setup')} />}
        {status === 'offline' && <ActionButton label="Try Again" icon="refresh" variant="primary" onPress={() => void refresh()} />}
        {status === 'emergency' && <ActionButton label="Open Active Alert" icon="alert-circle" variant="danger" onPress={() => router.push('/alert')} />}

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionGrid}>
          <ActionButton label={`Call ${profile.residentName}`} icon="call" onPress={() => void callConfiguredContact(profile.residentName, profile.residentPhone)} style={styles.halfAction} />
          <ActionButton label="Wellness Check" icon="heart" onPress={() => void startWellnessCheck()} style={styles.halfAction} />
          <ActionButton label="View Camera" icon="camera" onPress={() => router.push('/camera')} disabled={!snapshot.cameraAvailable} style={styles.fullAction} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Room status</Text>
          <Text style={styles.updated}>{formatUpdated(snapshot.lastUpdated)}</Text>
        </View>
        <View style={styles.roomList}>
          <RoomRow room="Living Room" occupied={snapshot.livingRoomPresence} available={snapshot.livingRoomSensorAvailable} />
          <RoomRow room="Bedroom" occupied={snapshot.bedroomPresence} available={snapshot.bedroomSensorAvailable} />
        </View>

        <View style={styles.healthBand}>
          <Ionicons
            name={connectionState === 'connected' ? 'checkmark-circle' : 'warning'}
            size={23}
            color={connectionState === 'connected' ? colors.green : colors.warning}
          />
          <View style={styles.healthText}>
            <Text style={styles.healthTitle}>{connectionState === 'connected' ? 'Home safety system is working' : 'Home safety system needs attention'}</Text>
            <Text style={styles.healthDetail}>{connectionState === 'connected' ? 'Sensors and caregiver connection are available' : 'Open Devices for details'}</Text>
          </View>
        </View>

        <Text style={styles.safety}>Soteria Guardian does not replace 911 or professional monitoring.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function RoomRow({ room, occupied, available }: { room: string; occupied: boolean; available: boolean }) {
  const state = available ? (occupied ? 'Occupied' : 'No presence detected') : 'Status unavailable';
  return (
    <View style={styles.roomRow}>
      <Ionicons name={room === 'Bedroom' ? 'bed-outline' : 'home-outline'} size={22} color={colors.mutedStrong} />
      <Text style={styles.roomName}>{room}</Text>
      <Text style={[styles.roomState, !available && styles.roomWarning]}>{state}</Text>
    </View>
  );
}

function getStatus(connection: string, activeAlert: boolean): GuardianStatus {
  if (connection === 'setup') return 'setup';
  if (connection !== 'connected') return 'offline';
  if (activeAlert) return 'emergency';
  return 'safe';
}

function getStatusCopy(status: GuardianStatus, room: string, movement: string, profile: HouseholdProfile) {
  if (status === 'setup') return { title: 'Connect to begin', location: profile.homeLabel, detail: 'Resident status will appear after the home safety system is connected.' };
  if (status === 'offline') return { title: 'Status unavailable', location: profile.homeLabel, detail: 'The current safety status cannot be confirmed. Check the connection now.' };
  if (status === 'emergency') return { title: 'Emergency active', location: room, detail: 'Open the active alert and confirm who is responding.' };
  return { title: `${profile.residentName} is safe`, location: room, detail: `Last movement: ${movement}` };
}

function formatUpdated(timestamp: string | null) {
  if (!timestamp) return 'Not available';
  return `Updated ${new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  header: { minHeight: 62, flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  headerText: { flex: 1, marginLeft: spacing.sm },
  brand: { color: colors.text, fontSize: 17, fontWeight: '900' },
  homeLabel: { color: colors.muted, fontSize: 13, marginTop: 2 },
  livePill: { minWidth: 66, height: 30, paddingHorizontal: spacing.sm, flexDirection: 'row', gap: spacing.xs, alignItems: 'center', justifyContent: 'center', borderRadius: 15, backgroundColor: colors.surfaceAlt },
  livePillOffline: { backgroundColor: colors.surfaceSoft },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green },
  liveDotOffline: { backgroundColor: colors.warning },
  liveText: { color: colors.mutedStrong, fontSize: 11, fontWeight: '900' },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900' },
  updated: { color: colors.muted, fontSize: 12 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  halfAction: { flexGrow: 1, flexBasis: '46%' },
  fullAction: { flexBasis: '100%' },
  roomList: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  roomRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  roomName: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '800' },
  roomState: { color: colors.green, fontSize: 14, fontWeight: '700', textAlign: 'right', maxWidth: '48%' },
  roomWarning: { color: colors.warning },
  healthBand: { minHeight: 74, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  healthText: { flex: 1 },
  healthTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  healthDetail: { color: colors.muted, fontSize: 13, marginTop: 3 },
  safety: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.sm },
});
