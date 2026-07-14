# Commissioning and Offline Acceptance

## Purpose

This procedure establishes a repeatable method for installing Aqara devices, limiting vendor-cloud exposure, transferring operational control to Home Assistant, and proving that critical Soteria Guardian functions continue without internet access.

## Operating Modes

### Commissioning Mode

Temporary and controlled. Internet access may be enabled only for required provisioning, firmware updates, room mapping, and local-interface configuration.

### Operational Mode

Normal system state. Aqara and other IoT devices have outbound internet access denied. Home Assistant and local safety functions remain available.

### Maintenance Mode

Time-limited administrative state for approved updates, troubleshooting, or device replacement. Maintenance activity must be logged and followed by regression testing.

## Commissioning Procedure

1. Record device model, serial number, MAC address, assigned room, and intended function.
2. Place the device on the dedicated Soteria IoT VLAN.
3. Confirm that the device cannot access trusted household or management networks.
4. Temporarily enable the minimum required outbound access.
5. Provision the G350 and FP2 sensors.
6. Install approved firmware updates.
7. Configure FP2 room maps, zones, presence behavior, and fall-assistance settings.
8. Pair Mini Switches and assign each button to a physical room.
9. Enable and validate supported local interfaces.
10. Configure local microSD recording on the G350.
11. Disable cloud recording, face enrollment, and unneeded cloud features.
12. Add or expose the devices to Home Assistant using the selected local integration.
13. Create stable Soteria template entities and scripts.
14. Disable Commissioning Mode and restore default-deny outbound rules.
15. Review firewall logs for blocked outbound attempts.
16. Run the complete acceptance test.

## Functional Acceptance Tests

| Test | Expected result |
|---|---|
| Bedroom panic button | Correct room alert, visual pattern, caregiver notification, audit entry |
| Living-room panic button | Correct room alert, visual pattern, caregiver notification, audit entry |
| Bedroom FP2 presence | State changes accurately within the calibrated area |
| Living-room FP2 presence | State changes accurately within the calibrated area |
| Suspected-fall workflow | Urgent alert created without automatic emergency dispatch |
| Visual alert | Both rooms receive the approved accessible pattern |
| Caregiver acknowledgment | Alert state changes and resident receives acknowledgment indication |
| Camera verification | Authorized dashboard can access local living-room video |
| Device offline | Maintenance alert is created after the configured threshold |
| Button battery warning | Low-battery maintenance alert is generated |

## Offline Acceptance Test

The system does not pass acceptance until the following test succeeds:

1. Confirm the system is healthy in Operational Mode.
2. Physically disconnect WAN service or block the Soteria VLAN from the internet.
3. Verify Home Assistant remains available locally.
4. Press each panic button.
5. Trigger each safe test event supported by the FP2 configuration.
6. Verify visual alerts operate.
7. Verify local camera access remains available.
8. Verify local alert history is recorded.
9. Verify the dashboard clearly indicates WAN unavailability without reporting the safety system as failed.
10. Restore WAN service and confirm the system returns to its normal state.

## Security Acceptance Tests

- Soteria IoT clients cannot initiate connections to trusted user VLANs.
- Soteria IoT clients cannot reach the public internet in Operational Mode.
- Home Assistant can communicate only over explicitly approved local paths.
- No public port forwarding exists for the G350, FP2 sensors, or Home Assistant.
- UPnP is disabled.
- Camera recordings remain local.
- No secrets or tokens are stored in source control.
- Blocked outbound attempts are visible in network logs.

## Accessibility Acceptance Tests

- The resident can see the emergency visual pattern from the bed.
- The resident can see the emergency visual pattern from the primary living-room seat.
- Each panic button is reachable without standing.
- Button labels and mounts are visually clear.
- Acknowledgment produces a distinct visual state.
- Audio is not required to understand that an alert is active.

## Failure Criteria

The deployment fails acceptance if:

- Any critical alert requires the Aqara cloud.
- A panic button stops working when WAN access is removed.
- A sensor cannot communicate locally with Home Assistant after commissioning.
- The camera requires public port forwarding.
- Visual alerts are unavailable or ambiguous.
- Device-health failures are not surfaced.
- A suspected fall automatically triggers irreversible emergency action without an approved escalation policy.

## Evidence Package

Retain the following for each deployment:

- Device inventory
- Network diagram
- Firewall-rule export or screenshots
- Home Assistant entity map
- Automation and script versions
- Test results and timestamps
- Known limitations
- Resident accessibility profile
- Maintenance and firmware history
