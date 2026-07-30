import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { useGuardianSnapshot } from '@/hooks/useGuardianSnapshot';
import { recordActivity } from '@/services/activityHistory';
import { getCameraSource } from '@/services/homeAssistant';
import { loadCredentials } from '@/services/secureSettings';
import { colors, radius, spacing } from '@/theme';

type CameraSource = ReturnType<typeof getCameraSource>;

export default function CameraScreen() {
  const { snapshot, connectionState, refresh } = useGuardianSnapshot();
  const [source, setSource] = useState<CameraSource | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  async function loadCamera() {
    setImageFailed(false);
    const credentials = await loadCredentials();
    if (!credentials) return;
    setSource(getCameraSource(credentials));
    await recordActivity({ title: 'Camera opened', detail: 'Living room camera verification', kind: 'information' });
  }

  useEffect(() => {
    if (snapshot.cameraAvailable) void loadCamera();
  }, [snapshot.cameraAvailable]);

  const available = connectionState === 'connected' && snapshot.cameraAvailable && !imageFailed;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.privacyBand}>
          <Ionicons name="eye-outline" size={22} color={colors.teal} />
          <Text style={styles.privacyText}>Camera access is active for caregiver verification.</Text>
        </View>

        <View style={styles.cameraFrame}>
          {available && source ? (
            <Image source={source} style={styles.cameraImage} resizeMode="contain" onError={() => setImageFailed(true)} accessibilityLabel="Living room camera view" />
          ) : (
            <View style={styles.unavailable}>
              <Ionicons name="videocam-off-outline" size={54} color={colors.muted} />
              <Text style={styles.unavailableTitle}>Camera unavailable</Text>
              <Text style={styles.unavailableBody}>The living room camera view could not be loaded.</Text>
            </View>
          )}
        </View>

        <View style={styles.cameraDetails}>
          <View>
            <Text style={styles.cameraName}>Living Room</Text>
            <Text style={styles.cameraStatus}>{available ? 'Camera view available' : 'Needs attention'}</Text>
          </View>
          <View style={[styles.statusDot, !available && styles.statusDotOffline]} />
        </View>

        <ActionButton label="Refresh Camera" icon="refresh" variant="primary" onPress={() => { void refresh(); void loadCamera(); }} />
        <Text style={styles.auditNote}>This camera access is recorded in caregiver history.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', padding: spacing.md, gap: spacing.md, paddingBottom: spacing.xl },
  privacyBand: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  privacyText: { flex: 1, color: colors.mutedStrong, fontSize: 14, lineHeight: 20 },
  cameraFrame: { width: '100%', aspectRatio: 16 / 9, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.black, borderWidth: 1, borderColor: colors.border },
  cameraImage: { width: '100%', height: '100%' },
  unavailable: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  unavailableTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: spacing.sm },
  unavailableBody: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: spacing.xs },
  cameraDetails: { minHeight: 62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cameraName: { color: colors.text, fontSize: 18, fontWeight: '900' },
  cameraStatus: { color: colors.muted, fontSize: 13, marginTop: 3 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.green },
  statusDotOffline: { backgroundColor: colors.warning },
  auditNote: { color: colors.muted, fontSize: 12, textAlign: 'center' },
});
