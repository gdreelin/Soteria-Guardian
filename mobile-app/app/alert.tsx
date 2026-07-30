import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { useHouseholdProfile } from '@/hooks/useHouseholdProfile';
import { useGuardianSnapshot } from '@/hooks/useGuardianSnapshot';
import { recordActivity } from '@/services/activityHistory';
import { callConfiguredContact, confirmEmergencyCall } from '@/services/contactActions';
import { callScript } from '@/services/homeAssistant';
import { loadCredentials } from '@/services/secureSettings';
import { colors, spacing } from '@/theme';

export default function ActiveAlertScreen() {
  const { snapshot, connectionState, refresh } = useGuardianSnapshot();
  const profile = useHouseholdProfile();
  const [responding, setResponding] = useState(false);
  const elapsed = useElapsedTime(snapshot.alertStarted);
  const title = friendlyAlertTitle(snapshot.alertSource);

  async function runAlertAction(action: 'acknowledge' | 'notifyBackup') {
    const credentials = await loadCredentials();
    if (!credentials) {
      router.push('/setup');
      return;
    }

    try {
      await callScript(credentials, action);
      if (action === 'acknowledge') {
        setResponding(true);
        await recordActivity({ title: 'Alert acknowledged', detail: `${profile.primaryCaregiverName} is responding`, kind: 'attention' });
      } else {
        await recordActivity({ title: 'Backup caregiver notified', detail: title, kind: 'emergency' });
        Alert.alert(`${profile.backupCaregiverName} notified`, 'The backup escalation request was sent.');
      }
    } catch {
      Alert.alert('Action could not be completed', 'The home safety system did not accept the request.');
    }
  }

  function confirmResolution() {
    Alert.alert('Confirm resident is safe', `Have you personally confirmed that ${profile.residentName} is safe?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes, Confirmed',
        onPress: async () => {
          const credentials = await loadCredentials();
          if (!credentials) return;
          try {
            await callScript(credentials, 'resolve');
            await recordActivity({ title: 'Resident confirmed safe', detail: `${title} resolved by caregiver`, kind: 'safe' });
            await refresh();
            router.replace('/');
          } catch {
            Alert.alert('Alert remains active', 'The resolution could not be recorded. Try again.');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emergencyBand}>
          <Ionicons name="alert-circle" size={37} color={colors.white} />
          <View style={styles.emergencyText}>
            <Text style={styles.eyebrow}>EMERGENCY ACTIVE</Text>
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>

        <View style={styles.facts}>
          <AlertFact icon="location" label="Location" value={snapshot.currentRoom} />
          <AlertFact icon="time" label="Detected" value={formatDetected(snapshot.alertStarted)} />
          <AlertFact icon="hourglass" label="Elapsed" value={elapsed} />
          <AlertFact icon="chatbubble-ellipses" label="Resident response" value="No response received" warning />
        </View>

        <View style={[styles.responseBand, responding && styles.responseBandActive]}>
          <Ionicons name={responding ? 'person-circle' : 'notifications'} size={24} color={responding ? colors.blue : colors.warning} />
          <Text style={styles.responseText}>{responding ? 'You are recorded as responding' : 'Waiting for a caregiver to respond'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Respond now</Text>
        <ActionButton label={`Call ${profile.residentName}`} icon="call" variant="primary" onPress={() => void callConfiguredContact(profile.residentName, profile.residentPhone)} style={styles.actionButton} />
        <ActionButton label={responding ? 'You Are Responding' : 'I Am Responding'} icon="person" onPress={() => void runAlertAction('acknowledge')} disabled={responding} style={styles.actionButton} />
        <ActionButton label="View Living Room Camera" icon="camera" onPress={() => router.push('/camera')} disabled={!snapshot.cameraAvailable} style={styles.actionButton} />
        <ActionButton label={`Notify ${profile.backupCaregiverName}`} icon="people" onPress={() => void runAlertAction('notifyBackup')} style={styles.actionButton} />
        <ActionButton label={`Call ${profile.backupCaregiverName}`} icon="call-outline" onPress={() => void callConfiguredContact(profile.backupCaregiverName, profile.backupCaregiverPhone)} style={styles.actionButton} />
        <ActionButton label="Call 911" icon="call" variant="danger" onPress={confirmEmergencyCall} style={styles.actionButton} />

        <Text style={styles.sectionTitle}>Resolve alert</Text>
        <ActionButton label="Confirm Resident Is Safe" icon="checkmark-circle" variant="quiet" onPress={confirmResolution} style={styles.actionButton} />

        {connectionState === 'offline' && (
          <View style={styles.offlineNotice}>
            <Ionicons name="cloud-offline" size={20} color={colors.warning} />
            <Text style={styles.offlineText}>Connection lost. Call the resident or emergency services directly.</Text>
          </View>
        )}
        <Text style={styles.safety}>Acknowledging an alert does not resolve it. Emergency calls are placed through your phone.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function AlertFact({ icon, label, value, warning }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; warning?: boolean }) {
  return (
    <View style={styles.factRow}>
      <Ionicons name={icon} size={22} color={warning ? colors.warning : colors.mutedStrong} />
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={[styles.factValue, warning && styles.factWarning]}>{value}</Text>
    </View>
  );
}

function friendlyAlertTitle(source: string) {
  const normalized = source.toLowerCase();
  if (normalized.includes('fall')) return 'Possible Fall Detected';
  if (normalized.includes('button') || normalized.includes('switch')) return 'Emergency Button Pressed';
  return 'Safety Alert Active';
}

function formatDetected(timestamp: string | null) {
  if (!timestamp) return 'Time unavailable';
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function useElapsedTime(startedAt: string | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!startedAt) return 'Unknown';
  const seconds = Math.max(0, Math.floor((now - new Date(startedAt).getTime()) / 1000));
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min ${seconds % 60} sec`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  emergencyBand: { minHeight: 142, backgroundColor: colors.redDark, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  emergencyText: { flex: 1 },
  eyebrow: { color: colors.white, fontSize: 12, fontWeight: '900' },
  title: { color: colors.white, fontSize: 27, fontWeight: '900', marginTop: spacing.xs },
  facts: { paddingHorizontal: spacing.md },
  factRow: { minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  factLabel: { color: colors.muted, fontSize: 14, width: 116 },
  factValue: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '800', textAlign: 'right' },
  factWarning: { color: colors.warning },
  responseBand: { minHeight: 64, marginHorizontal: spacing.md, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.warning, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  responseBandActive: { borderColor: colors.blue },
  responseText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '800' },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '900', marginHorizontal: spacing.md, marginTop: spacing.sm },
  actionButton: { marginHorizontal: spacing.md },
  offlineNotice: { marginHorizontal: spacing.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.warning },
  offlineText: { flex: 1, color: colors.warning, lineHeight: 20 },
  safety: { color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginHorizontal: spacing.lg },
});
