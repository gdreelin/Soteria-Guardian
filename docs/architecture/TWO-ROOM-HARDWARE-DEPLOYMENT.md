# Two-Room Hardware Deployment

## Deployment Scope

The initial Soteria Guardian deployment covers:

- One bedroom
- One living room
- One resident who is hard of hearing
- One Intel NUC running Home Assistant
- One dedicated UniFi VLAN on a UDM Pro

## Baseline Bill of Materials

| Component | Quantity | Location | Role |
|---|---:|---|---|
| Aqara Camera Hub G350 | 1 | Living room | Camera verification, local recording, Zigbee hub |
| Aqara Presence Sensor FP2 | 2 | Bedroom and living room | Presence, zones, inactivity, and fall-assistance signals |
| Aqara Wireless Mini Switch | 2 minimum | Bedside and favorite living-room seat | Emergency call control |
| Additional Mini Switch | 1 optional | Entry or secondary reachable location | Redundant emergency control |
| High-endurance microSD card | 1 | G350 | Local video retention |
| Intel NUC | 1 | Secure equipment location | Home Assistant master control plane |
| RGB smart lights | Existing or as required | Bedroom and living room | Primary visual emergency alerts |
| UPS | 1 | Network and NUC equipment | Short-duration power resilience |
| Future bed-shaker or vibration receiver | 1 optional | Bedroom | Tactile alerting during sleep |

## Room Design

### Bedroom

- One FP2 mounted and calibrated for the usable bedroom area.
- One Mini Switch mounted within reach from the bed.
- No camera in the baseline design.
- RGB lighting provides emergency and acknowledgment patterns.
- A future bed-shaker can provide tactile alerts.

### Living Room

- One G350 positioned for useful common-area verification without viewing private areas.
- One FP2 calibrated for the seating and walking zones.
- One Mini Switch mounted near the resident's primary chair or couch.
- RGB lighting provides high-visibility emergency indication.

## Device Communication

```text
Mini Switches -- Zigbee --> G350
G350 ----------- LAN -----> Home Assistant
FP2 Sensors ----- Wi-Fi ---> Home Assistant local integration
RGB Lights ------ LAN -----> Home Assistant
```

The FP2 sensors are Wi-Fi devices and do not use the G350 Zigbee radio.

## Placement Requirements

### G350

- Place in the living room only.
- Avoid aiming toward the bedroom or private changing areas.
- Use local microSD recording.
- Disable cloud recording and facial-recognition enrollment.
- Do not use port forwarding or UPnP.

### FP2

- Install according to the selected detection mode and manufacturer placement guidance.
- Validate every defined zone after furniture placement.
- Do not assume a sensor reports every fall.
- Keep the USB power cable secured and protected from accidental removal.

### Mini Switches

- Place where the resident can reach them from likely emergency positions.
- Use a consistent mounting method and clear visual label.
- Configure one simple emergency action instead of requiring memorized click patterns.
- Monitor battery state and test each button on a recurring schedule.

## Emergency Lighting Pattern

The baseline visual alert pattern should be unmistakable but should also consider photosensitive seizure risks.

Recommended initial pattern:

1. Turn both room lights on at full brightness.
2. Alternate red and blue only if medically appropriate for the resident.
3. Otherwise use a slower full-brightness pulse or repeated white-light pattern.
4. Continue until the alert is acknowledged or the configured timeout is reached.
5. Provide a distinct steady-light pattern when caregiver acknowledgment is received.

## Expansion Path

Future expansion may include:

- Bathroom safety coverage
- Door and window sensors
- Leak sensors
- Smoke and carbon-monoxide integrations
- Bed or chair occupancy sensors
- Dedicated local Zigbee coordinator
- Local NVR or Frigate
- Cellular backup notification path
- Dedicated Soteria visual and tactile annunciator
