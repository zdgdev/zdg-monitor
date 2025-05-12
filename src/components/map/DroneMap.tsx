import React, { useState, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  useMap, 
  ZoomControl,
  CircleMarker
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { DroneData, GeoFence } from '../../models/types';
import { AlertTriangle, Shield } from 'lucide-react';

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = Icon.extend({
  options: {
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  }
});

// Drone icon
const droneIcon = new DefaultIcon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/6134/6134918.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

interface DroneMapProps {
  drones: DroneData[];
  geoFences: GeoFence[];
  selectedDroneId?: string;
  onSelectDrone: (droneId: string) => void;
  onAddGeoFence?: (coordinates: Array<[number, number]>) => void;
}

// Center the map on a specific drone when it's selected
const MapFlyTo: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [map, position]);
  
  return null;
};

const DroneMap: React.FC<DroneMapProps> = ({ 
  drones, 
  geoFences, 
  selectedDroneId, 
  onSelectDrone,
  onAddGeoFence
}) => {
  const [center, setCenter] = useState<[number, number]>([-2.5489, 118.0149]); // Indonesia center
  const [zoom, setZoom] = useState(5);
  const [drawMode, setDrawMode] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Array<[number, number]>>([]);
  const mapRef = useRef<any>(null);

  // Set center when a drone is selected
  useEffect(() => {
    if (selectedDroneId) {
      const selectedDrone = drones.find(d => d.id === selectedDroneId);
      if (selectedDrone) {
        setCenter([selectedDrone.position.lat, selectedDrone.position.lng]);
        setZoom(12);
      }
    }
  }, [selectedDroneId, drones]);

  const handleMapClick = (e: any) => {
    if (drawMode) {
      setDrawnPoints([...drawnPoints, [e.latlng.lat, e.latlng.lng]]);
    }
  };

  const completeDrawing = () => {
    if (drawnPoints.length >= 3 && onAddGeoFence) {
      // Close the polygon
      const closedPolygon = [...drawnPoints, drawnPoints[0]];
      onAddGeoFence(closedPolygon);
      setDrawnPoints([]);
    }
    setDrawMode(false);
  };

  const cancelDrawing = () => {
    setDrawnPoints([]);
    setDrawMode(false);
  };

  // Find selected drone for flyto
  const selectedDrone = drones.find(d => d.id === selectedDroneId);
  const selectedPosition = selectedDrone 
    ? [selectedDrone.position.lat, selectedDrone.position.lng] as [number, number]
    : center;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {drawMode && (
        <div className="absolute top-4 left-4 z-[1000] bg-[var(--color-bg-secondary)] p-3 rounded-md shadow-lg border border-[var(--color-bg-tertiary)]">
          <div className="text-sm mb-2">
            <span className="font-medium text-[var(--color-accent-blue)]">Drawing Mode Active</span>
            <p className="text-xs text-[var(--color-text-secondary)]">Click on the map to add points ({drawnPoints.length} points)</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={completeDrawing}
              disabled={drawnPoints.length < 3}
              className="px-3 py-1 bg-[var(--color-accent-green)] text-white rounded-md text-xs disabled:opacity-50"
            >
              Complete
            </button>
            <button 
              onClick={cancelDrawing}
              className="px-3 py-1 bg-[var(--color-accent-red)] text-white rounded-md text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="custom-map"
        ref={mapRef}
        whenReady={(map) => {
          map.target.on('click', handleMapClick);
        }}
      >
        <ZoomControl position="bottomright" />
        
        {/* TileLayer (map) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* GeoFences */}
        {geoFences.map(fence => (
          <Polygon
            key={fence.id}
            positions={fence.coordinates}
            pathOptions={{
              color: fence.color,
              fillColor: fence.color,
              fillOpacity: 0.2,
              weight: 2
            }}
          >
            <Popup>
              <div className="font-mono text-sm">
                <div className="font-bold">{fence.name}</div>
                <div className="text-xs">{fence.type.toUpperCase()}</div>
                <div className="text-xs mt-1">Created: {fence.createdAt.toLocaleDateString()}</div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Drawing in progress */}
        {drawMode && drawnPoints.length > 0 && (
          <>
            <Polygon
              positions={drawnPoints}
              pathOptions={{
                color: '#58A6FF',
                fillColor: '#58A6FF',
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '5, 5'
              }}
            />
            {drawnPoints.map((point, index) => (
              <CircleMarker
                key={`point-${index}`}
                center={point}
                radius={5}
                pathOptions={{
                  color: '#58A6FF',
                  fillColor: '#58A6FF',
                  fillOpacity: 1
                }}
              />
            ))}
          </>
        )}

        {/* Drone Markers */}
        {drones.map(drone => (
          <Marker
            key={drone.id}
            position={[drone.position.lat, drone.position.lng]}
            icon={droneIcon}
            eventHandlers={{
              click: () => {
                onSelectDrone(drone.id);
              }
            }}
          >
            <Popup>
              <div className="font-mono text-sm">
                <div className="font-bold">{drone.name}</div>
                <div className="flex items-center">
                  Status: 
                  <span className={`ml-1 ${
                    drone.status === 'active' ? 'text-green-500' : 
                    drone.status === 'warning' ? 'text-yellow-500' : 
                    drone.status === 'error' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {drone.status.toUpperCase()}
                  </span>
                </div>
                <div>Battery: {drone.battery.toFixed(0)}%</div>
                <div>Alt: {drone.altitude.toFixed(0)}m | Spd: {drone.speed.toFixed(0)}km/h</div>
                <div className="text-xs mt-1">
                  Last update: {drone.lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Fly to selected drone */}
        {selectedDroneId && (
          <MapFlyTo position={selectedPosition} />
        )}
      </MapContainer>

      {/* Map controls */}
      <div className="absolute bottom-4 left-4 z-[400] flex flex-col space-y-2">
        <button
          onClick={() => setDrawMode(!drawMode)}
          className={`p-2 rounded-md ${drawMode ? 'bg-[var(--color-accent-blue)] text-white' : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]'} shadow-lg`}
          title="Draw Geo-fence"
        >
          <Shield size={20} />
        </button>
        
        <button 
          onClick={() => {
            setCenter([-2.5489, 118.0149]);
            setZoom(5);
          }}
          className="p-2 rounded-md bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-lg"
          title="Reset View"
        >
          <AlertTriangle size={20} />
        </button>
      </div>
    </div>
  );
};

export default DroneMap;