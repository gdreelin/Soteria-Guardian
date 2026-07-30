import { Alert, Linking } from 'react-native';

export async function callConfiguredContact(label: string, phone: string) {
  if (!phone) {
    Alert.alert(`${label} phone number needed`, 'Add the phone number to the app environment before placing this call.');
    return;
  }

  await Linking.openURL(`tel:${phone}`);
}

export function confirmEmergencyCall() {
  Alert.alert('Call 911?', 'This opens the phone dialer. Soteria Guardian does not contact emergency services automatically.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Open Dialer', style: 'destructive', onPress: () => void Linking.openURL('tel:911') },
  ]);
}
