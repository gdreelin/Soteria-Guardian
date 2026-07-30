export const entities = {
  currentRoom: 'input_text.soteria_guardian_current_room',
  lastMovement: 'input_text.soteria_guardian_last_movement',
  activeAlert: 'input_boolean.soteria_guardian_active_alert',
  alertSource: 'input_text.soteria_guardian_alert_source',
  alertStarted: 'input_datetime.soteria_guardian_alert_started',
  wearableBattery: 'sensor.soteria_guardian_wearable_battery',
  livingRoomCamera: 'camera.soteria_guardian_living_room',
  bedroomPresence: 'binary_sensor.soteria_guardian_bedroom_presence',
  livingRoomPresence: 'binary_sensor.soteria_guardian_living_room_presence',
} as const;

export const scripts = {
  emergency: 'soteria_guardian_emergency',
  acknowledge: 'soteria_guardian_acknowledge',
  resolve: 'soteria_guardian_resolve',
  wellnessCheck: 'soteria_guardian_wellness_check',
  notifyBackup: 'soteria_guardian_notify_backup',
  systemTest: 'soteria_guardian_system_test',
} as const;
