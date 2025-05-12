// Drone Types
export interface DroneData {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'inactive' | 'warning' | 'error';
  battery: number;
  signal: number;
  altitude: number;
  speed: number;
  position: {
    lat: number;
    lng: number;
  };
  lastUpdated: Date;
  videoFeed: string;
  operatorId?: string;
}

// GeoFence Types
export interface GeoFence {
  id: string;
  name: string;
  type: 'restricted' | 'operational' | 'custom';
  coordinates: Array<[number, number]>;
  createdAt: Date;
  color: string;
}

// Alert Types
export interface Alert {
  id: string;
  droneId?: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  droneId: string;
  action: string;
  details: string;
  position?: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
}

// User Type
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
}