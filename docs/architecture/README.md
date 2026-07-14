# Soteria Guardian Architecture Documentation

This directory defines the baseline architecture for the Soteria Guardian privacy-first elder-safety platform.

## Architecture Set

- [System Architecture](SYSTEM-ARCHITECTURE.md)
- [Two-Room Hardware Deployment](TWO-ROOM-HARDWARE-DEPLOYMENT.md)
- [Privacy and Network Security](PRIVACY-AND-NETWORK-SECURITY.md)
- [Home Assistant Control Plane](HOME-ASSISTANT-CONTROL-PLANE.md)
- [Commissioning and Offline Acceptance](COMMISSIONING-AND-OFFLINE-ACCEPTANCE.md)
- [Architecture Decision Records](decisions/README.md)

## Baseline Deployment

The initial deployment covers one bedroom and one living room for a resident who is hard of hearing. Home Assistant runs on an Intel NUC and acts as the master control plane. Aqara devices are isolated on a dedicated UniFi VLAN with outbound internet access denied during normal operation.

## Governing Principles

1. Life-safety automations must continue operating without internet access.
2. Audio alerts are supplemental; visual and caregiver alerts are primary.
3. Home Assistant owns automation, state, health monitoring, and device abstraction.
4. The Soteria Guardian application owns the caregiver experience.
5. Vendor cloud services are limited to controlled commissioning and maintenance windows.
6. Camera footage remains local unless an explicitly approved design change states otherwise.
7. The system assists caregivers but is not a medical device or replacement for emergency services.
