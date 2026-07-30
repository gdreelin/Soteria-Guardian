import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';

type ActionButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'quiet';
  disabled?: boolean;
  style?: ViewStyle;
};

export function ActionButton({ label, icon, onPress, variant = 'secondary', disabled, style }: ActionButtonProps) {
  const palette = buttonPalettes[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.background, borderColor: palette.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Ionicons name={icon} size={22} color={palette.text} />
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

const buttonPalettes = {
  primary: { background: colors.blue, border: colors.blue, text: colors.white },
  secondary: { background: colors.surfaceAlt, border: colors.border, text: colors.text },
  danger: { background: colors.red, border: colors.red, text: colors.white },
  quiet: { background: 'transparent', border: colors.border, text: colors.mutedStrong },
};

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  label: { fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
