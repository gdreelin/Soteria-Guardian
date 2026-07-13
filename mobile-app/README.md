# Soteria Guardian Mobile App

Cross-platform caregiver application built with Expo, React Native, TypeScript, Expo Router, and secure device storage.

## MVP capabilities

- Secure Home Assistant URL and development-token onboarding
- Connection testing before credentials are saved
- Credentials stored through `expo-secure-store`
- Caregiver dashboard for room, movement, wearable battery, alert state, FP2 presence, and camera availability
- Pull-to-refresh Home Assistant state synchronization
- Emergency script trigger with explicit confirmation
- Accessible touch targets and screen-reader labels
- Clear offline and unavailable states

## Run locally

```bash
cd mobile-app
npm install
npx expo start
```

Open the project through Expo Go for development, or use the native Android/iOS build commands defined in `package.json`.

## Home Assistant setup

1. Copy `homeassistant/packages/soteria_guardian.yaml` into the Home Assistant packages directory.
2. Enable packages in `configuration.yaml` if they are not already enabled.
3. Replace the example FP2, Mini Switch battery, and camera entity IDs with the actual entities in the apartment.
4. Restart Home Assistant and confirm the Soteria Guardian helpers, sensors, and scripts appear.
5. Create a dedicated least-privileged Home Assistant user for development.
6. Generate a long-lived token for initial testing only.
7. Enter the HTTPS Home Assistant URL and token in the app setup screen.

## Security boundary

Long-lived tokens are supported only for the current development MVP. Production authentication must migrate to the Home Assistant OAuth/native-app flow. Never commit tokens, resident information, or private camera URLs.

## Safety boundary

Soteria Guardian is not a medical device, does not guarantee fall detection, and does not replace 911 or a professionally monitored medical-alert service.
