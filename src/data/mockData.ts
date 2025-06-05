import { DroneData, GeoFence, Alert, ActivityLog } from '../models/types';

// Mock drone data
export const mockDrones: DroneData[] = [
  {
    id: '01SUAV',
    name: 'DEPTEL 295',
    model: 'DJI Mavic 3',
    status: 'active',
    battery: 78,
    signal: 92,
    altitude: 120,
    speed: 15,
    position: { lat: -6.1751, lng: 106.8650 }, // Jakarta
    lastUpdated: new Date(),
    videoFeed: 'https://static.videezy.com/system/resources/previews/000/044/479/original/Flying8.mp4'
  },
  {
    id: 'UAV-3023PM02',
    name: 'Elang Hitam',
    model: 'Autel EVO II',
    status: 'warning',
    battery: 32,
    signal: 85,
    altitude: 85,
    speed: 12,
    position: { lat: -7.7956, lng: 110.3695 }, // Yogyakarta
    lastUpdated: new Date(),
    videoFeed: 'https://static.videezy.com/system/resources/previews/000/021/497/original/Drone-view-of-the-beach-and-the-sea.mp4'
  },
  {
    id: 'UAV-0SB94ZA81',
    name: 'UAV DID 3.11',
    model: 'Skydio 2',
    status: 'active',
    battery: 91,
    signal: 94,
    altitude: 150,
    speed: 18,
    position: { lat: -8.6705, lng: 115.2126 }, // Bali
    lastUpdated: new Date(),
    videoFeed: 'https://static.videezy.com/system/resources/previews/000/005/828/original/Drone_2.mp4'
  },
  {
    id: 'UAV-LS03210169',
    name: 'LAPAN LSU-03',
    model: 'Parrot Anafi',
    status: 'inactive',
    battery: 0,
    signal: 0,
    altitude: 0,
    speed: 0,
    position: { lat: -2.9901, lng: 104.7575 }, // Palembang
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    videoFeed: 'https://static.videezy.com/system/resources/previews/000/042/007/original/Aerial_Footage_Clouds_Mountains_Ocean_Drone_Palm_Trees.mp4'
  }
];

// Mock geofences
export const mockGeoFences: GeoFence[] = [
  {
    id: 'fence-01',
    name: 'Jakarta No-Fly Zone',
    type: 'restricted',
    coordinates: [
      [-6.1854, 106.8243],
      [-6.1954, 106.8443],
      [-6.1754, 106.8543],
      [-6.1654, 106.8343],
      [-6.1854, 106.8243]
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    color: '#F85149'
  },
  {
    id: 'fence-02',
    name: 'Yogyakarta Operational Area',
    type: 'operational',
    coordinates: [
      [-7.7856, 110.3595],
      [-7.7956, 110.3795],
      [-7.7756, 110.3895],
      [-7.7656, 110.3695],
      [-7.7856, 110.3595]
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    color: '#3FB950'
  },
  {
    id: 'fence-03',
    name: 'Bali Tourism Zone',
    type: 'custom',
    coordinates: [
      [-8.6605, 115.2026],
      [-8.6705, 115.2226],
      [-8.6505, 115.2326],
      [-8.6405, 115.2126],
      [-8.6605, 115.2026]
    ],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    color: '#58A6FF'
  }
];

// Mock alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-01',
    droneId: '01SUAV',
    type: 'warning',
    message: 'Approaching restricted area: Jakarta No-Fly Zone',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    acknowledged: false
  },
  {
    id: 'alert-02',
    droneId: 'drone-02',
    type: 'error',
    message: 'Critical battery level: 15% remaining',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    acknowledged: true
  },
  {
    id: 'alert-03',
    droneId: 'drone-0SB94ZA81',
    type: 'info',
    message: 'Surveillance operation completed',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    acknowledged: true
  },
  {
    id: 'alert-04',
    droneId: 'drone-0030210491',
    type: 'error',
    message: 'Connection lost with BR4N1',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    acknowledged: true
  }
];

// Mock activity logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-001',
    droneId: '01SUAV',
    action: 'TAKEOFF',
    details: 'Initiated from Jakarta Control Center',
    position: { lat: -6.1751, lng: 106.8650 },
    timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
  },
  {
    id: 'log-002',
    droneId: 'drone-02',
    action: 'BATTERY_WARNING',
    details: 'Battery level reached 32%',
    position: { lat: -7.7956, lng: 110.3695 },
    timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
  },
  {
    id: 'log-003',
    droneId: 'drone-0SB94ZA81',
    action: 'AREA_CHANGE',
    details: 'Entered Bali Tourism Zone',
    position: { lat: -8.6705, lng: 115.2126 },
    timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
  },
  {
    id: 'log-004',
    droneId: '01SUAV',
    action: 'ALTITUDE_CHANGE',
    details: 'Ascended to 120m',
    position: { lat: -6.1751, lng: 106.8650 },
    timestamp: new Date(Date.now() - 55 * 60 * 1000) // 55 minutes ago
  },
  {
    id: 'log-005',
    droneId: 'drone-0030210491',
    action: 'CONNECTION_LOST',
    details: 'Signal lost near Palembang',
    position: { lat: -2.9901, lng: 104.7575 },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
];

// Function to update drone positions randomly (for simulation)
export function getUpdatedDroneData(): DroneData[] {
  return mockDrones.map(drone => {
    // Don't update inactive drones
    if (drone.status === 'inactive') return drone;

    // Randomly update position slightly
    const latDelta = (Math.random() - 0.5) * 0.01;
    const lngDelta = (Math.random() - 0.5) * 0.01;
    
    // Randomly update battery (decrease slightly)
    const batteryDelta = Math.random() * 0.2;
    
    // Randomly update altitude and speed
    const altitudeDelta = (Math.random() - 0.5) * 5;
    const speedDelta = (Math.random() - 0.5) * 2;

    return {
      ...drone,
      position: {
        lat: drone.position.lat + latDelta,
        lng: drone.position.lng + lngDelta
      },
      battery: Math.max(0, Math.min(100, drone.battery - batteryDelta)),
      altitude: Math.max(0, drone.altitude + altitudeDelta),
      speed: Math.max(0, drone.speed + speedDelta),
      lastUpdated: new Date()
    };
  });
}

// Function to check if a drone is in a geofence
export function isDroneInGeofence(drone: DroneData, fence: GeoFence): boolean {
  // Simple implementation for demo - in real app would use proper point-in-polygon algorithm
  // This is a simplified check just for demonstration purposes
  const [minLat, maxLat, minLng, maxLng] = fence.coordinates.reduce(
    (acc, [lat, lng]) => {
      return [
        Math.min(acc[0], lat),
        Math.max(acc[1], lat),
        Math.min(acc[2], lng),
        Math.max(acc[3], lng)
      ];
    },
    [90, -90, 180, -180]
  );

  return (
    drone.position.lat >= minLat &&
    drone.position.lat <= maxLat &&
    drone.position.lng >= minLng &&
    drone.position.lng <= maxLng
  );
}

// Function to generate new alerts based on drone status
export function generateAlerts(drones: DroneData[], fences: GeoFence[]): Alert[] {
  const newAlerts: Alert[] = [];
  
  drones.forEach(drone => {
    // Low battery alert
    if (drone.battery < 20 && drone.status !== 'inactive') {
      newAlerts.push({
        id: `alert-battery-${drone.id}-${Date.now()}`,
        droneId: drone.id,
        type: 'warning',
        message: `Low battery alert: ${drone.name} at ${drone.battery.toFixed(0)}%`,
        timestamp: new Date(),
        acknowledged: false
      });
    }
    
    // Geofence alerts
    fences.forEach(fence => {
      if (isDroneInGeofence(drone, fence) && fence.type === 'restricted') {
        newAlerts.push({
          id: `alert-geofence-${drone.id}-${fence.id}-${Date.now()}`,
          droneId: drone.id,
          type: 'error',
          message: `Geofence violation: ${drone.name} entered ${fence.name}`,
          timestamp: new Date(),
          acknowledged: false
        });
      }
    });
  });
  
  return newAlerts;
}