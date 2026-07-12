# Codex Build Brief — Soteria Guardian

## Mission
Build a production-quality Android and iOS caregiver application that integrates with Home Assistant to monitor an elderly resident in a two-room apartment.

## Initial environment
- Home Assistant running on Intel NUC
- Aqara Camera Hub G350 in the living room
- Aqara FP2 presence sensors in the bedroom and living room
- Aqara Wireless Mini Switch used as wearable and fixed SOS controls
- Amazon Echo in each room as secondary voice support
- Smart lights for visual alerts due to significant hearing loss

## MVP requirements
1. Secure Home Assistant onboarding and connection testing.
2. Dashboard for current room, last movement, device availability, wearable battery, and active alerts.
3. Large accessible SOS control.
4. Real-time Home Assistant WebSocket updates.
5. Critical caregiver push notifications.
6. Alert acknowledgment, escalation, and resolution.
7. Secure camera access without embedding credentials in URLs.
8. Large type, high contrast, screen-reader labels, and minimum 48dp targets.
9. Offline-safe behavior and stale-data warnings.
10. Emergency audit history.

## Security requirements
- Store credentials only in platform secure storage.
- Prefer Home Assistant OAuth/native authentication before production.
- Enforce TLS for remote connections.
- Never log tokens, private camera URLs, or resident routine data.
- Apply least privilege through a dedicated Home Assistant user.

## Safety constraints
- Soteria Guardian is not a medical device.
- Do not claim guaranteed fall detection.
- AI must not be the sole trigger for critical emergency actions.
- Do not automatically unlock doors or call emergency services in the MVP.
