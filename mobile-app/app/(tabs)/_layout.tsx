import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { colors } from '@/theme';

const icons = {
  index: ['home', 'home-outline'],
  alerts: ['notifications', 'notifications-outline'],
  history: ['time', 'time-outline'],
  devices: ['hardware-chip', 'hardware-chip-outline'],
  settings: ['settings', 'settings-outline'],
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontSize: 18, fontWeight: '800' },
        sceneStyle: { backgroundColor: colors.background },
        tabBarStyle: {
          height: 70,
          paddingTop: 7,
          paddingBottom: 8,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
        tabBarIcon: ({ color, focused, size }) => {
          const pair = icons[route.name as keyof typeof icons] ?? icons.index;
          return <Ionicons name={pair[focused ? 0 : 1]} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false, tabBarAccessibilityLabel: 'Home' }} />
      <Tabs.Screen name="alerts" options={{ title: 'Alerts', tabBarAccessibilityLabel: 'Alerts' }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarAccessibilityLabel: 'History' }} />
      <Tabs.Screen name="devices" options={{ title: 'Devices', tabBarAccessibilityLabel: 'Devices' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarAccessibilityLabel: 'Settings' }} />
    </Tabs>
  );
}
