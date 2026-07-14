# Soteria Guardian System Architecture

## Purpose

Soteria Guardian is a privacy-first elder-safety platform that combines local smart-home devices, deterministic emergency workflows, caregiver notifications, visual accessibility alerts, and a dedicated dashboard.

The initial deployment is intentionally small: one bedroom and one living room.

## Control Hierarchy

```text
Soteria Guardian Application
        |
        | HTTPS / WebSocket through a controlled service layer
        v
Home Assistant on Intel NUC
        |
        +-- Automations and scripts
        +-- State and event processing
        +-- Device health monitoring
        +-- Caregiver notifications
        +-- Audit and event history
        |
        +-- Aqara Camera Hub G350
        |       +-- Living-room camera
        |       +-- Local microSD recording
        |       +-- Zigbee child devices
        |
        +-- Bedroom Aqara FP2
        +-- Living-room Aqara FP2
        +-- Visual alert lighting
        +-- Future tactile alert equipment
```

## Architectural Roles

### Home Assistant

Home Assistant is the master control plane. It owns:

- Device integrations
- Entity state
- Local automations
- Emergency scripts
- Alert lifecycle state
- Device-health monitoring
- Event history
- Dashboard data

### Soteria Guardian Application

The application is the caregiver and administrator plane. It should:

- Display system and room status
- Present critical alerts
- Allow acknowledgment and escalation
- Show device health and battery state
- Provide controlled system commands
- Display camera verification when authorized
- Maintain role-based caregiver workflows

The application should not communicate directly with vendor hardware. It should use a controlled Soteria service layer backed by Home Assistant.

### Aqara Hardware

Aqara supplies selected edge devices, but Aqara Home is not the permanent operating interface.

- The G350 provides living-room video, local storage, and a Zigbee hub.
- FP2 sensors provide room presence, zones, inactivity data, and fall-assistance signals.
- Wireless Mini Switches provide fixed emergency call controls.

## Safety Model

The platform uses layered detection rather than trusting one sensor.

1. Resident presses a panic button, or a sensor reports a suspected safety event.
2. Home Assistant creates an alert with room, source, severity, and timestamp.
3. Visual alerts activate because the resident is hard of hearing.
4. The caregiver receives a critical notification.
5. The alert remains active until acknowledged and resolved.
6. Every action is logged.

A suspected fall must not automatically dispatch emergency services without a verified escalation policy. Consumer fall detection can produce missed events and false positives.

## Accessibility Model

Audio is supplemental. Primary resident-facing alerts are:

- Bright lighting changes
- Repeating visual patterns
- Future strobe or illuminated annunciator
- Future bed-shaker or vibration receiver

Primary caregiver alerts are:

- Mobile critical notifications
- Active-alert dashboard
- Escalation status
- Camera verification in the living room

## Core Nonfunctional Requirements

- Critical local automations continue when WAN access is unavailable.
- Aqara devices are isolated on a dedicated VLAN.
- Outbound internet is denied during normal operation.
- Camera recordings remain local by default.
- No facial-recognition enrollment is permitted in the baseline deployment.
- Home Assistant port 8123 is not directly exposed to the public internet.
- Every critical action is auditable.
- The application never embeds a permanent Home Assistant administrator token.

## Safety Notice

Soteria Guardian is not a medical device, does not guarantee fall detection, and does not replace 911 or a professionally monitored medical-alert service.
