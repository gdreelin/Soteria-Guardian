import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export type GuardianStatus = 'safe' | 'checking' | 'attention' | 'emergency' | 'offline' | 'setup';

type StatusHeroProps = {
  status: GuardianStatus;
  title: string;
  location: string;
  detail: string;
};

const statusDesign: Record<GuardianStatus, { color: string; icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  safe: { color: colors.green, icon: 'checkmark-circle', label: 'RESIDENT STATUS' },
  checking: { color: colors.blue, icon: 'time', label: 'WELLNESS CHECK' },
  attention: { color: colors.warning, icon: 'warning', label: 'ACTION NEEDED' },
  emergency: { color: colors.red, icon: 'alert-circle', label: 'EMERGENCY ACTIVE' },
  offline: { color: colors.muted, icon: 'cloud-offline', label: 'STATUS UNAVAILABLE' },
  setup: { color: colors.warning, icon: 'shield-outline', label: 'SETUP REQUIRED' },
};

export function StatusHero({ status, title, location, detail }: StatusHeroProps) {
  const design = statusDesign[status];

  return (
    <View style={[styles.container, { borderLeftColor: design.color }]}>
      <View style={styles.labelRow}>
        <Ionicons name={design.icon} size={19} color={design.color} />
        <Text style={[styles.label, { color: design.color }]}>{design.label}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={18} color={colors.mutedStrong} />
        <Text style={styles.location}>{location}</Text>
      </View>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 6,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  label: { fontSize: 12, fontWeight: '900' },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: spacing.sm },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md },
  location: { color: colors.mutedStrong, fontSize: 17, fontWeight: '700' },
  detail: { color: colors.muted, fontSize: 15, lineHeight: 22, marginTop: spacing.xs },
});
