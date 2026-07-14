# Privacy and Network Security

## Objective

The Soteria Guardian network must prevent untrusted IoT devices from reaching sensitive networks or initiating unrestricted outbound internet connections. Normal operation is local-first and cloud-independent.

## Network Zones

| Zone | Example contents | Trust level |
|---|---|---|
| Management | Administrative workstation and secured management services | High |
| Server | Intel NUC running Home Assistant | High |
| Soteria IoT VLAN | G350, FP2 sensors, lights, future safety devices | Untrusted |
| Home/User | Personal computers, phones, and normal household devices | Medium |
| Guest | Visitor devices | Untrusted |

The exact VLAN ID and subnet are deployment-specific. Documentation and automation must use logical names rather than assuming a fixed VLAN number.

## Default Firewall Posture

| Source | Destination | Action | Purpose |
|---|---|---|---|
| Soteria IoT VLAN | Internet | Deny and log | Prevent vendor cloud and unknown outbound connections |
| Soteria IoT VLAN | Other internal VLANs | Deny | Prevent lateral movement |
| Soteria IoT VLAN | Home Assistant | Allow only required local traffic | Device state and control |
| Home Assistant | Soteria IoT VLAN | Allow only required local traffic | Integration and commands |
| Management workstation | Soteria IoT VLAN | Allow required administration | Controlled commissioning and support |
| Soteria IoT VLAN | Approved local DNS | Allow | Name resolution when required |
| Soteria IoT VLAN | Approved local NTP | Allow | Reliable timestamps |
| Any other path | Any | Deny | Least privilege |

## Commissioning Mode

A temporary internet-access rule may be enabled only for:

- Initial provisioning
- Required firmware updates
- FP2 room and zone configuration
- Enabling supported local interfaces
- Adding devices that cannot be commissioned locally

Commissioning Mode must be time-limited, documented, and disabled after testing.

## Operational Mode

During normal operation:

- Aqara and other IoT devices cannot access the internet.
- No cloud recording is enabled.
- No facial-recognition profiles are enrolled.
- No inbound port forwarding is configured.
- UPnP is disabled.
- Home Assistant is not exposed directly on TCP 8123.
- Remote administration uses an approved VPN or authenticated gateway.

## Device-Specific Controls

### Aqara Camera Hub G350

- Local microSD recording only.
- RTSP or another verified local stream is preferred for dashboard integration.
- Disable cloud video features.
- Disable face enrollment and cloud-dependent AI features.
- Use a strong, unique device or integration credential where supported.
- Review blocked outbound attempts during acceptance testing.

### Aqara FP2

- Place each sensor on the isolated VLAN.
- Complete room mapping and zone setup during Commissioning Mode.
- Integrate locally with Home Assistant where supported.
- Confirm presence and safety automations after internet access is blocked.

### Zigbee Mini Switches

The switches do not connect directly to IP networks. Their risk is mediated through the selected Zigbee coordinator or hub. Pair only authorized devices and remove unused or unknown child devices.

## Logging and Detection

The UDM Pro or supporting security platform should retain enough information to identify:

- Blocked outbound connection attempts
- Unexpected DNS queries
- New or unknown clients
- Device IP changes
- Repeated authentication failures
- Loss of contact with Home Assistant
- Loss of contact with critical sensors

Home Assistant should generate a system-health alert when a required device becomes unavailable beyond an approved threshold.

## Data Protection

- Store only information required for safety and operations.
- Define retention periods for video and alert history.
- Restrict camera access by caregiver role.
- Audit alert acknowledgment, escalation, and resolution.
- Never place secrets, tokens, passwords, or camera URLs containing credentials in the repository.
- Use a secrets manager or Home Assistant secrets storage.

## Security Acceptance Criteria

The deployment passes network security acceptance only when:

1. Critical automations operate with WAN access disconnected.
2. The G350 and FP2 sensors cannot reach the public internet in Operational Mode.
3. The IoT VLAN cannot initiate connections to trusted user networks.
4. Home Assistant can still receive device events and issue required local commands.
5. No public port forwarding exists for the system.
6. Blocked outbound attempts are visible to the administrator.
