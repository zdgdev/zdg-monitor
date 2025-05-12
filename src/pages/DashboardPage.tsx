import React, { useState, useEffect, useCallback } from 'react';
import { Maximize2, Minimize2, Shield, Bell, Clock, List, Plus } from 'lucide-react';
import DroneMap from '../components/map/DroneMap';
import VideoFeed from '../components/drone/VideoFeed';
import DroneList from '../components/dashboard/DroneList';
import AlertList from '../components/dashboard/AlertList';
import ActivityLog from '../components/dashboard/ActivityLog';
import { 
  DroneData, 
  GeoFence, 
  Alert as AlertType, 
  ActivityLog as ActivityLogType 
} from '../models/types';
import { 
  mockDrones, 
  mockGeoFences, 
  mockAlerts, 
  mockActivityLogs, 
  getUpdatedDroneData,
  generateAlerts
} from '../data/mockData';

const DashboardPage: React.FC = () => {
  const [drones, setDrones] = useState<DroneData[]>(mockDrones);
  const [geoFences, setGeoFences] = useState<GeoFence[]>(mockGeoFences);
  const [alerts, setAlerts] = useState<AlertType[]>(mockAlerts);
  const [activityLogs, setActivityLogs] = useState<ActivityLogType[]>(mockActivityLogs);
  const [selectedDroneId, setSelectedDroneId] = useState<string>(drones[0]?.id || '');
  const [isVideoFullScreen, setIsVideoFullScreen] = useState(false);
  const [showNewGeoFenceModal, setShowNewGeoFenceModal] = useState(false);
  const [newGeoFenceName, setNewGeoFenceName] = useState('');
  const [newGeoFenceType, setNewGeoFenceType] = useState<'restricted' | 'operational' | 'custom'>('restricted');
  const [newGeoFenceCoordinates, setNewGeoFenceCoordinates] = useState<Array<[number, number]>>([]);

  // Selected drone data
  const selectedDrone = drones.find(d => d.id === selectedDroneId) || drones[0];

  // Update drone positions and generate alerts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedDrones = getUpdatedDroneData();
      setDrones(updatedDrones);
      
      // Generate new alerts
      const newAlerts = generateAlerts(updatedDrones, geoFences);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev]);
        
        // Also create activity logs for these alerts
        const newLogs = newAlerts.map(alert => ({
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          droneId: alert.droneId || '',
          action: alert.type === 'error' ? 'ERROR' : 'WARNING',
          details: alert.message,
          position: updatedDrones.find(d => d.id === alert.droneId)?.position,
          timestamp: new Date()
        }));
        
        setActivityLogs(prev => [...newLogs, ...prev]);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [drones, geoFences]);

  // Acknowledge an alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    
    // Add to activity log
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      const newLog: ActivityLogType = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        droneId: alert.droneId || selectedDroneId,
        action: 'ALERT_ACKNOWLEDGED',
        details: `Alert acknowledged: ${alert.message}`,
        timestamp: new Date()
      };
      
      setActivityLogs(prev => [newLog, ...prev]);
    }
  };

  // Handle adding a new geo-fence
  const handleAddGeoFence = useCallback((coordinates: Array<[number, number]>) => {
    setNewGeoFenceCoordinates(coordinates);
    setShowNewGeoFenceModal(true);
  }, []);

  // Create a new geo-fence
  const createGeoFence = () => {
    if (newGeoFenceName.trim() === '' || newGeoFenceCoordinates.length < 3) {
      return;
    }
    
    const colorMap = {
      restricted: '#F85149',
      operational: '#3FB950',
      custom: '#58A6FF'
    };
    
    const newFence: GeoFence = {
      id: `fence-${Date.now()}`,
      name: newGeoFenceName,
      type: newGeoFenceType,
      coordinates: newGeoFenceCoordinates,
      createdAt: new Date(),
      color: colorMap[newGeoFenceType]
    };
    
    setGeoFences(prev => [...prev, newFence]);
    
    // Add to activity log
    const newLog: ActivityLogType = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      droneId: selectedDroneId,
      action: 'GEO_FENCE_CREATED',
      details: `New ${newGeoFenceType} geo-fence created: ${newGeoFenceName}`,
      timestamp: new Date()
    };
    
    setActivityLogs(prev => [newLog, ...prev]);
    
    // Reset modal state
    setShowNewGeoFenceModal(false);
    setNewGeoFenceName('');
    setNewGeoFenceCoordinates([]);
  };

  return (
    <div className="w-full h-full">
      {/* New Geo-fence Modal */}
      {showNewGeoFenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-[var(--color-bg-secondary)] p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">New Geo-fence</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="geo-fence-name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Name
                </label>
                <input
                  id="geo-fence-name"
                  type="text"
                  value={newGeoFenceName}
                  onChange={(e) => setNewGeoFenceName(e.target.value)}
                  className="block w-full px-3 py-2 rounded-md bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-blue)] text-[var(--color-text-primary)]"
                  placeholder="Enter geo-fence name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Type
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setNewGeoFenceType('restricted')}
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      newGeoFenceType === 'restricted' 
                        ? 'bg-[var(--color-accent-red)]/10 border-[var(--color-accent-red)]' 
                        : 'bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)]'
                    }`}
                  >
                    Restricted
                  </button>
                  <button
                    onClick={() => setNewGeoFenceType('operational')}
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      newGeoFenceType === 'operational' 
                        ? 'bg-[var(--color-accent-green)]/10 border-[var(--color-accent-green)]' 
                        : 'bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)]'
                    }`}
                  >
                    Operational
                  </button>
                  <button
                    onClick={() => setNewGeoFenceType('custom')}
                    className={`flex-1 py-2 px-3 rounded-md border ${
                      newGeoFenceType === 'custom' 
                        ? 'bg-[var(--color-accent-blue)]/10 border-[var(--color-accent-blue)]' 
                        : 'bg-[var(--color-bg-tertiary)] border-[var(--color-bg-tertiary)]'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
                  Coordinates
                </label>
                <div className="terminal text-xs h-20 overflow-y-auto">
                  {newGeoFenceCoordinates.map((coord, idx) => (
                    <div key={idx}>{`[${idx}] Lat: ${coord[0].toFixed(4)}, Lng: ${coord[1].toFixed(4)}`}</div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => {
                    setShowNewGeoFenceModal(false);
                    setNewGeoFenceCoordinates([]);
                  }}
                  className="px-4 py-2 rounded-md border border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)]"
                >
                  Cancel
                </button>
                <button
                  onClick={createGeoFence}
                  className="px-4 py-2 rounded-md bg-[var(--color-accent-blue)] text-white hover:bg-[var(--color-accent-blue)]/80"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isVideoFullScreen ? (
        <div className="fixed inset-0 z-40 bg-black">
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => setIsVideoFullScreen(false)}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            >
              <Minimize2 size={20} />
            </button>
          </div>
          {selectedDrone && <VideoFeed drone={selectedDrone} isFullScreen={true} />}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-56px)]">
          {/* Left sidebar - Drone List */}
          <div className="col-span-12 md:col-span-2 h-full overflow-y-auto">
            <div className="panel h-full">
              <div className="panel-header">
                <h2 className="text-sm font-semibold">Drones</h2>
                <span className="text-xs bg-[var(--color-bg-tertiary)] rounded-full px-2">{drones.length}</span>
              </div>
              <div className="panel-body h-[calc(100%-40px)] overflow-y-auto">
                <DroneList 
                  drones={drones} 
                  selectedDroneId={selectedDroneId} 
                  onSelectDrone={setSelectedDroneId} 
                />
              </div>
            </div>
          </div>
          
          {/* Main content - Map and Video feed */}
          <div className="col-span-12 md:col-span-7 grid grid-rows-2 gap-4 h-full">
            {/* Video feed */}
            <div className="row-span-1 panel">
              <div className="panel-header">
                <h2 className="text-sm font-semibold">Live Feed: {selectedDrone?.name}</h2>
                <button
                  onClick={() => setIsVideoFullScreen(true)}
                  className="p-1 hover:bg-[var(--color-bg-secondary)] rounded"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
              <div className="h-[calc(100%-40px)]">
                {selectedDrone && (
                  <VideoFeed 
                    drone={selectedDrone} 
                    onToggleFullScreen={() => setIsVideoFullScreen(true)} 
                  />
                )}
              </div>
            </div>
            
            {/* Map */}
            <div className="row-span-1 panel">
              <div className="panel-header">
                <h2 className="text-sm font-semibold">Interactive Map</h2>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent-red)] mr-1"></span>
                    <span className="text-xs">Restricted</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-accent-green)] mr-1"></span>
                    <span className="text-xs">Operational</span>
                  </div>
                </div>
              </div>
              <div className="h-[calc(100%-40px)]">
                <DroneMap 
                  drones={drones} 
                  geoFences={geoFences} 
                  selectedDroneId={selectedDroneId}
                  onSelectDrone={setSelectedDroneId}
                  onAddGeoFence={handleAddGeoFence}
                />
              </div>
            </div>
          </div>
          
          {/* Right sidebar - Alerts and Activity Log */}
          <div className="col-span-12 md:col-span-3 grid grid-rows-2 gap-4 h-full">
            {/* Alerts panel */}
            <div className="row-span-1 panel">
              <div className="panel-header">
                <h2 className="text-sm font-semibold flex items-center">
                  <Bell size={14} className="mr-1" />
                  Alerts
                </h2>
                <span className="text-xs bg-[var(--color-bg-tertiary)] rounded-full px-2">
                  {alerts.filter(a => !a.acknowledged).length}
                </span>
              </div>
              <div className="panel-body h-[calc(100%-40px)] overflow-y-auto">
                <AlertList alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
              </div>
            </div>
            
            {/* Activity Log panel */}
            <div className="row-span-1 panel">
              <div className="panel-header">
                <h2 className="text-sm font-semibold flex items-center">
                  <Clock size={14} className="mr-1" />
                  Activity Log
                </h2>
                <span className="text-xs bg-[var(--color-bg-tertiary)] rounded-full px-2">
                  {activityLogs.length}
                </span>
              </div>
              <div className="panel-body h-[calc(100%-40px)] overflow-y-auto">
                <ActivityLog logs={activityLogs} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;