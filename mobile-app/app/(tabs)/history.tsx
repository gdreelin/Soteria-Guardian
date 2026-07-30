import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { loadActivities, type GuardianActivity } from '@/services/activityHistory';
import { colors, spacing } from '@/theme';

export default function HistoryScreen() {
  const [activities, setActivities] = useState<GuardianActivity[]>([]);

  useFocusEffect(useCallback(() => {
    void loadActivities().then(setActivities);
  }, []));

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {activities.length ? (
          activities.map((activity) => <ActivityRow key={activity.id} activity={activity} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>No caregiver activity yet</Text>
            <Text style={styles.emptyBody}>Wellness checks, camera access, acknowledgments, and resolutions will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityRow({ activity }: { activity: GuardianActivity }) {
  const design = activityDesign[activity.kind];
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { backgroundColor: design.background }]}>
        <Ionicons name={design.icon} size={21} color={design.color} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{activity.title}</Text>
        <Text style={styles.rowDetail}>{activity.detail}</Text>
      </View>
      <Text style={styles.rowTime}>{new Date(activity.occurredAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
    </View>
  );
}

const activityDesign = {
  safe: { icon: 'checkmark' as const, color: colors.green, background: colors.surfaceAlt },
  attention: { icon: 'warning' as const, color: colors.warning, background: colors.surfaceAlt },
  emergency: { icon: 'alert' as const, color: colors.red, background: colors.surfaceAlt },
  information: { icon: 'information' as const, color: colors.blue, background: colors.surfaceAlt },
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: spacing.md, paddingBottom: spacing.xl },
  emptyState: { minHeight: 420, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg },
  emptyTitle: { color: colors.text, fontSize: 22, fontWeight: '900', textAlign: 'center' },
  emptyBody: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 330 },
  row: { minHeight: 82, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rowText: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  rowDetail: { color: colors.muted, fontSize: 13, marginTop: 4 },
  rowTime: { color: colors.muted, fontSize: 12 },
});
