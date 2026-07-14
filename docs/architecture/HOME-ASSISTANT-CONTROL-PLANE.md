# Home Assistant Control Plane

## Role

Home Assistant on the Intel NUC is the master control plane for Soteria Guardian. It normalizes physical devices into stable entities, processes local events, runs emergency automations, tracks system health, and supplies data to the Soteria Guardian application.

## Design Boundary

The Soteria application should not call arbitrary Home Assistant services or control vendor devices directly.

Preferred pattern:

```text
Soteria App -> Soteria Service Layer -> Approved Home Assistant Scripts -> Devices
```

The service layer may begin as a local prototype and later become a dedicated API gateway. It should protect Home Assistant credentials, enforce caregiver roles, validate commands, rate-limit requests, and create audit records.

## Approved Control Contract

The application should call a small set of stable scripts rather than vendor-specific entities.

Suggested scripts:

- `script.soteria_arm`
- `script.soteria_disarm`
- `script.soteria_acknowledge_alert`
- `script.soteria_resolve_alert`
- `script.soteria_mark_false_alarm`
- `script.soteria_activate_visual_alert`
- `script.soteria_stop_visual_alert`
- `script.soteria_start_system_test`
- `script.soteria_enter_maintenance_mode`
- `script.soteria_exit_maintenance_mode`

## Suggested Entity Model

| Logical function | Suggested entity |
|---|---|
| Bedroom presence | `binary_sensor.soteria_bedroom_presence` |
| Living-room presence | `binary_sensor.soteria_living_room_presence` |
| Bedroom suspected fall | `binary_sensor.soteria_bedroom_fall` |
| Living-room suspected fall | `binary_sensor.soteria_living_room_fall` |
| Bedroom panic event | `event.soteria_bedroom_panic` |
| Living-room panic event | `event.soteria_living_room_panic` |
| Active alert | `input_boolean.soteria_alert_active` |
| Alert severity | `input_select.soteria_alert_severity` |
| Alert room | `input_select.soteria_alert_room` |
| Alert acknowledged | `input_boolean.soteria_alert_acknowledged` |
| System mode | `input_select.soteria_system_mode` |
| Overall health | `sensor.soteria_system_health` |
| Living-room camera | `camera.soteria_living_room` |

Actual device entities should be wrapped with template entities or helpers so hardware can be replaced without changing the application contract.

## Alert Lifecycle

```text
created -> delivered -> acknowledged -> escalated -> resolved -> archived
```

Every alert record should include:

- Unique alert identifier
- Trigger type
- Source entity
- Room
- Severity
- Creation time
- Delivery time
- Acknowledgment time and caregiver
- Escalation actions
- Resolution time and disposition

## Event Processing

### Panic Button

1. Receive button event.
2. Create a critical alert with the correct room.
3. Activate visual alerts.
4. Notify caregivers.
5. Display the active alert on the dashboard.
6. Continue until acknowledged and resolved.

### Suspected Fall

1. Receive the sensor signal.
2. Create an urgent suspected-fall alert.
3. Activate accessible visual alerts.
4. Notify caregivers.
5. Make living-room camera verification available when relevant.
6. Escalate according to a configurable policy.

A suspected fall alone is not sufficient evidence for automatic emergency dispatch in the baseline system.

## Dashboard Requirements

The large Home Assistant dashboard should display:

- Overall system state
- Active alert and elapsed time
- Bedroom and living-room presence
- Last meaningful movement
- Panic-button readiness and battery state
- FP2 and camera availability
- Local recording status
- VLAN/WAN privacy status where measurable
- Caregiver acknowledgment status
- System test and maintenance controls

Emergency state should override the normal dashboard and present large, high-contrast response actions.

## Application Connectivity

Home Assistant provides REST and WebSocket interfaces. The application service layer should use:

- REST or approved service calls for commands
- WebSocket subscriptions for real-time state and event updates
- Short-lived authorization rather than embedded long-lived administrator tokens

## Availability and Health

Home Assistant should monitor:

- Required entity availability
- Sensor last-update time
- Zigbee button battery levels
- Camera stream availability
- Local storage capacity
- NUC and network health
- Automation failures
- Notification delivery failures

A degraded component should create a maintenance alert before it becomes a safety failure.
