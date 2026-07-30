import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { useHouseholdProfile } from '@/hooks/useHouseholdProfile';
import { useGuardianSnapshot } from '@/hooks/useGuardianSnapshot';
import { callConfiguredContact } from '@/services/contactActions';
import { colors, radius, spacing } from '@/theme';

export default function AlertsScreen() {
  const { snapshot, connectionState, refreshing, refresh } = useGuardianSnapshot();
  const profile = useHouseholdProfile();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.blue} />}
      >
        {snapshot.activeAlert ? (
          <View style={styles.alertCard}>
            <View style={styles.alertHeading}>
              <Ionicons name="alert-circle" size={28} color={colors.red} />
              <View style={styles.alertHeadingText}>
                <Text style={styles.eyebrow}>ACTION REQUIRED</Text>
                <Text style={styles.alertTitle}>{friendlyAlertTitle(snapshot.alertSource)}</Text>
              </View>
            </View>
            <Text style={styles.alertDetail}>{snapshot.currentRoom} · {formatTime(snapshot.alertStarted)}</Text>
            <Text style={styles.alertDescription}>{profile.residentName} needs a caregiver response.</Text>
            <ActionButton label="Open Active Alert" icon="arrow-forward-circle" variant="danger" onPress={() => router.push('/alert')} />
          </View>
        ) : connectionState === 'connected' ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={52} color={colors.green} />
            <Text style={styles.emptyTitle}>No active alerts</Text>
            <Text style={styles.emptyBody}>There is nothing requiring a caregiver response right now.</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cloud-offline" size={48} color={colors.warning} />
            <Text style={styles.emptyTitle}>Alert status unavailable</Text>
            <Text style={styles.emptyBody}>Reconnect the home safety system before relying on this screen.</Text>
            <ActionButton label={connectionState === 'setup' ? 'Connect System' : 'Try Again'} icon="refresh" variant="primary" onPress={connectionState === 'setup' ? () => router.push('/setup') : () => void refresh()} />
          </View>
        )}

        <Text style={styles.sectionTitle}>Response status</Text>
        <View style={styles.responseRow}>
          <Ionicons name="person-circle-outline" size={27} color={colors.blue} />
          <View style={styles.responseText}>
            <Text style={styles.responseTitle}>{profile.primaryCaregiverName}</Text>
            <Text style={styles.responseDetail}>{snapshot.activeAlert ? 'Waiting for acknowledgment' : 'No response needed'}</Text>
          </View>
        </View>
        <View style={styles.careTeamActions}>
          <ActionButton label={`Call ${profile.primaryCaregiverName}`} icon="call-outline" onPress={() => void callConfiguredContact(profile.primaryCaregiverName, profile.primaryCaregiverPhone)} style={styles.careTeamButton} />
          <ActionButton label={`Call ${profile.backupCaregiverName}`} icon="call-outline" onPress={() => void callConfiguredContact(profile.backupCaregiverName, profile.backupCaregiverPhone)} style={styles.careTeamButton} />
        </View>
        <View style={styles.responseRow}>
          <Ionicons name="people-circle-outline" size={27} color={colors.mutedStrong} />
          <View style={styles.responseText}>
            <Text style={styles.responseTitle}>{profile.backupCaregiverName}</Text>
            <Text style={styles.responseDetail}>{snapshot.activeAlert ? 'Available for escalation' : 'Standing by'}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function friendlyAlertTitle(source: string) {
  const normalized = source.toLowerCase();
  if (normalized.includes('fall')) return 'Possible fall detected';
  if (normalized.includes('button') || normalized.includes('switch')) return 'Emergency button pressed';
  return 'Safety alert active';
}

function formatTime(timestamp: string | null) {
  if (!timestamp) return 'Time unavailable';
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  alertCard: { padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.red, borderRadius: radius.lg, backgroundColor: colors.surface },
  alertHeading: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  alertHeadingText: { flex: 1 },
  eyebrow: { color: colors.red, fontSize: 12, fontWeight: '900' },
  alertTitle: { color: colors.text, fontSize: 24, fontWeight: '900', marginTop: 3 },
  alertDetail: { color: colors.text, fontSize: 17, fontWeight: '800' },
  alertDescription: { color: colors.mutedStrong, fontSize: 15 },
  emptyState: { minHeight: 280, paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyTitle: { color: colors.text, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  emptyBody: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 320, marginBottom: spacing.sm },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: spacing.sm },
  responseRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  responseText: { flex: 1 },
  responseTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  responseDetail: { color: colors.muted, fontSize: 13, marginTop: 3 },
  careTeamActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  careTeamButton: { flexGrow: 1, flexBasis: '46%' },
});
