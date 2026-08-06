# Soteria Guardian — Home Assistant Emergency Automation Bundle

This package provides a modular Home Assistant emergency workflow using:

- Aqara wireless switch for manual panic activation
- Aqara fall-detection entity
- Wyze RGB bulbs for red/blue visual alerts
- Home Assistant Companion App notifications
- Optional Alexa announcements
- Ring Alarm status visibility only during initial testing

## Safety boundary

This package does **not** automatically trigger Ring professional monitoring, police, fire, EMS, or 911.

During development, keep Ring Alarm actions disabled and place the Ring system in test mode before conducting any test that could activate a siren or monitored alarm.

## Package contents

### Configuration

- `packages/soteria_helpers.yaml`
- `packages/soteria_light_groups.yaml`

### Scripts

- `scripts/soteria_police_lights.yaml`
- `scripts/soteria_fall_question_lights.yaml`
- `scripts/soteria_announce_fall_question.yaml`
- `scripts/soteria_announce_emergency.yaml`

### Automations

- `automations/01_aqara_button_handler.yaml`
- `automations/02_fall_detected.yaml`
- `automations/03_fall_no_response.yaml`
- `automations/04_caregiver_notification_actions.yaml`
- `automations/05_emergency_reset.yaml`
- `automations/06_device_unavailable_alert.yaml`

## Before installation

Replace all placeholder entity IDs containing:

- `REPLACE_`
- `caregiver_phone`
- `living_room_echo`
- `bedroom_echo`
- Example Wyze light names
- Example Aqara fall-sensor names

## Recommended directory structure

```text
/config/
├── configuration.yaml
├── automations/
│   ├── 01_aqara_button_handler.yaml
│   ├── 02_fall_detected.yaml
│   ├── 03_fall_no_response.yaml
│   ├── 04_caregiver_notification_actions.yaml
│   ├── 05_emergency_reset.yaml
│   └── 06_device_unavailable_alert.yaml
├── scripts/
│   ├── soteria_police_lights.yaml
│   ├── soteria_fall_question_lights.yaml
│   ├── soteria_announce_fall_question.yaml
│   └── soteria_announce_emergency.yaml
└── packages/
    ├── soteria_helpers.yaml
    └── soteria_light_groups.yaml
```

## configuration.yaml includes

Add or confirm the following:

```yaml
homeassistant:
  packages: !include_dir_named packages

automation: !include_dir_merge_list automations
script: !include_dir_merge_named scripts
```

Do not keep duplicate `automation:` or `script:` keys elsewhere in `configuration.yaml`.

## Aqara button trigger

The supplied button automation uses placeholder device triggers.

The exact trigger format depends on whether the Aqara switch is connected through ZHA, Zigbee2MQTT, Matter, or an Aqara hub integration.

The safest method is:

1. Open Home Assistant.
2. Go to **Settings → Automations & Scenes**.
3. Create a temporary automation.
4. Select the Aqara switch as the device trigger.
5. Select single, double, and hold actions.
6. View the automation in YAML.
7. Copy those trigger blocks into `01_aqara_button_handler.yaml`.
8. Preserve the trigger IDs: `single`, `double`, and `hold`.

## Testing sequence

1. Confirm each Wyze bulb can display red and blue.
2. Turn on `input_boolean.soteria_emergency_active`.
3. Run `script.soteria_police_light_alert`.
4. Turn off the emergency boolean and verify flashing stops.
5. Test the Aqara button.
6. Test caregiver notifications.
7. Test fall detection with a simulated sensor event.
8. Test the resident-safe response.
9. Test no-response escalation.
10. Test system reset.

## Important accessibility behavior

During a fall-confirmation window:

- Single press means: **I am okay**
- Double press means: **I need help**
- Hold means: **I need help**

Outside a fall-confirmation window, any configured button action activates the emergency workflow.
