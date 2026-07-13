export const entities = {
  currentRoom: 'input_text.soteria_guardian_current_room',
  lastMovement: 'input_text.soteria_guardian_last_movement',
  activeAlert: 'input_boolean.soteria_guardian_active_alert',
  wearableBattery: 'sensor.soteria_guardian_wearable_battery',
  livingRoomCamera: 'camera.soteria_guardian_living_room',
  bedroomPresence: 'binary_sensor.soteria_guardian_bedroom_presence',
  livingRoomPresence: 'binary_sensor.soteria_guardian_living_room_presence',
} as const;

export const scripts = {
  emergency: 'soteria_guardian_emergency',
  acknowledge: 'soteria_guardian_acknowledge',
  resolve: 'soteria_guardian_resolve',
  systemTest: 'soteria_guardian_system_test',
} as const;
