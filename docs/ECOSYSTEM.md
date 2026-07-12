# Soteria Guardian Ecosystem

Soteria Guardian is a complete elderly-safety and caregiver-monitoring ecosystem centered on Home Assistant.

## Ecosystem layers

1. **Resident Safety** — wearable or fixed SOS controls, FP2 presence sensors, smart-light visual alerts, and secondary voice support.
2. **Home Monitoring** — Aqara Camera Hub G350, bedroom and living-room FP2 sensors, and optional environmental sensors.
3. **Automation and Intelligence** — Home Assistant on Intel NUC, local automations, routine monitoring, and optional AI event correlation.
4. **Caregiver Mobile** — Android and iOS app for device visibility, alerts, acknowledgment, history, and camera verification.
5. **Hardware Development** — TPU wrist holder, CAD, STL, BOM, testing, and future Soteria Guardian wearable hardware.
6. **Security and Privacy** — local-first processing, least privilege, secure credential storage, TLS, audit logging, and privacy controls.
7. **Reliability** — UPS support, device heartbeat and battery monitoring, redundant SOS controls, stale-data warnings, and periodic system testing.

## Architectural principle

The Aqara devices, cameras, smart lights, and other integrations feed Home Assistant. Home Assistant is the control plane. The Soteria Guardian mobile app is the caregiver visibility, acknowledgment, and administration plane.
