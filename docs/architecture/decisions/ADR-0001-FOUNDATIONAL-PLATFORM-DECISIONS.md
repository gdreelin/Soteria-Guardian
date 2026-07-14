# ADR-0001: Foundational Platform Decisions

- **Status:** Accepted
- **Date:** 2026-07-14
- **Scope:** Initial one-bedroom and living-room deployment

## Context

Soteria Guardian requires a simple caregiver experience, strong privacy controls, accessible alerts for a resident who is hard of hearing, and reliable local operation when vendor cloud services or the public internet are unavailable.

## Decisions

### 1. Home Assistant is the master control plane

Home Assistant on an Intel NUC owns device integrations, local automation, state, system health, event processing, and the stable control contract exposed to Soteria services.

### 2. Soteria Guardian is the primary user experience

The independent Soteria Guardian application and dashboard replace Aqara Home for normal caregiver and administrative operation. The application does not directly control vendor hardware.

### 3. Critical functions are local-first

Panic alerts, visual alerts, local event creation, and core dashboard state must continue when WAN access is unavailable.

### 4. The Soteria IoT VLAN uses default-deny outbound access

Aqara and other untrusted IoT devices are isolated on a dedicated UDM Pro VLAN. Internet access is blocked during normal operation and enabled only through a controlled commissioning or maintenance window.

### 5. Aqara Home is limited to commissioning

Aqara Home may be used temporarily when required for provisioning, firmware updates, room mapping, sensor calibration, or enabling local interfaces. It is not the permanent operating interface.

### 6. Privacy takes precedence over convenience

The bedroom has no camera in the baseline deployment. The living-room camera records locally. Cloud recording, public port forwarding, and facial-recognition enrollment are prohibited unless a future reviewed decision explicitly changes the baseline.

### 7. Audio is supplemental

Because the resident is hard of hearing, visual alerts and caregiver notifications are primary. Audio announcements and hub sounds are supplementary and cannot be required for successful emergency communication.

### 8. Fall detection is assistive, not authoritative

A suspected-fall signal can create an urgent alert and start a caregiver workflow. It cannot be treated as conclusive evidence or automatically trigger an irreversible emergency action without an approved escalation policy.

### 9. Hardware is abstracted behind stable Soteria entities and scripts

Vendor-specific entities are wrapped by templates, helpers, and approved scripts. This permits future replacement of Aqara hardware without requiring the application to change its command model.

## Consequences

### Positive

- Reduced vendor lock-in
- Stronger privacy and network containment
- Better resilience during internet outages
- A simpler caregiver interface
- Accessible alerting aligned to the resident's needs
- Easier hardware replacement and future expansion
- Auditable emergency workflows

### Tradeoffs

- Initial commissioning may still require temporary vendor-cloud access.
- Some vendor features may become unavailable after outbound access is blocked.
- Local integrations must be tested carefully after firmware changes.
- Home Assistant and network availability become critical infrastructure and require UPS protection, monitoring, backup, and maintenance.

## Reconsideration Triggers

Revisit these decisions when:

- Matter camera support becomes mature enough to replace current local streaming methods.
- A fully local alternative provides equivalent camera, radar, and panic-button functionality.
- The deployment expands beyond the capacity or coverage of the G350 hub.
- Regulatory, medical-device, or professional monitoring requirements apply.
- A dedicated Soteria hardware gateway replaces the Intel NUC architecture.
