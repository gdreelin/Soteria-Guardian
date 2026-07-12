<p align="center">
  <img src="images/soteria-guardian-logo-dark.jpg" alt="Soteria Guardian logo" width="500">
</p>

# Soteria Guardian

**Protecting Independence. Preserving Peace of Mind.**

Soteria Guardian is an open, modular, Home Assistant-first platform for elderly safety, wellness monitoring, emergency response, and caregiver support.

## Platform Vision

Soteria Guardian is designed as a complete ecosystem—not a collection of isolated automations.

```text
Resident
   │
   ├── Wearable SOS
   ├── Aqara FP2 Presence Sensors
   ├── Aqara Camera Hub G350
   ├── Amazon Echo
   └── Visual Smart-Light Alerts
            │
            ▼
      Home Assistant Core
            │
            ▼
      Soteria Guardian App
            │
            ▼
     Family and Caregivers
```

## Core Modules

- **Core Platform** — identity, permissions, configuration, platform health, and auditing.
- **Resident** — accessibility needs, routines, presence, wellness, and consent preferences.
- **Caregiver** — dashboards, notifications, acknowledgment, escalation, and reports.
- **Home Assistant** — device discovery, state synchronization, scripts, services, and events.
- **Emergency** — SOS activation, delivery, acknowledgment, escalation, resolution, and testing.
- **Wellness** — inactivity detection, routine analysis, trends, and daily summaries.
- **Cameras** — availability, privacy controls, snapshots, live view, and verification.
- **Wearables** — Aqara Mini Switch support and future Soteria Guardian wearable hardware.
- **Reports** — alert history, reliability reports, system tests, and caregiver summaries.
- **Integrations** — Aqara, Amazon Echo, smart lighting, notifications, and future vendors.
- **Hardware** — CAD, STL, bills of materials, enclosure design, and device testing.
- **Administration** — entity mapping, schedules, thresholds, diagnostics, and escalation rules.
- **AI** — optional event correlation and summaries under deterministic safety controls.

## Current Device Ecosystem

- Aqara Camera Hub G350
- Aqara FP2 presence sensors
- Aqara Wireless Mini Switch wearable/fixed SOS controls
- Amazon Echo devices as a secondary voice layer
- Smart lighting for visual alerts
- Home Assistant running on an Intel NUC

## Repository Structure

```text
Soteria-Guardian/
├── mobile-app/
├── homeassistant/
├── firmware/
├── hardware/
├── docs/
├── images/
├── branding/
└── .github/
```

## Release Roadmap

- **v0.1.0 — Foundation:** repository, architecture, Home Assistant connection, and entity mapping.
- **v0.2.0 — Dashboard:** real-time device visibility and resident status.
- **v0.3.0 — Emergency:** alert lifecycle, push notifications, acknowledgment, and escalation.
- **v0.4.0 — Wellness:** routine monitoring, inactivity rules, and summaries.
- **v0.5.0 — Wearable:** custom enclosure and expanded wearable support.
- **v1.0.0 — Public Release:** tested, documented, accessible, and deployment-ready platform.

## Guiding Principle

No single camera, sensor, wearable, or voice assistant is treated as the only safety mechanism. Soteria Guardian uses layered detection, verification, notification, acknowledgment, and escalation.

## Security and Privacy

- Local-first design
- Least-privileged Home Assistant access
- Secure platform credential storage
- TLS-only remote access
- Explicit unavailable and stale-data states
- Audit trails for critical alert actions
- Privacy-conscious camera use

## Safety Notice

Soteria Guardian is not a medical device, does not guarantee fall detection, and is not a replacement for 911 or a professionally monitored medical-alert service.

## License

MIT License. See [LICENSE](LICENSE).
