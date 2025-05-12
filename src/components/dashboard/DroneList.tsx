import React from 'react';
import { DroneData } from '../../models/types';
import { Cpu, Battery, AlertTriangle, Wifi } from 'lucide-react';

interface DroneListProps {
  drones: DroneData[];
  selectedDroneId: string;
  onSelectDrone: (id: string) => void;
}

const DroneList: React.FC<DroneListProps> = ({ drones, selectedDroneId, onSelectDrone }) => {
  return (
    <div className="w-full">
      <ul className="space-y-2">
        {drones.map(drone => (
          <li 
            key={drone.id}
            onClick={() => onSelectDrone(drone.id)}
            className={`
              ${selectedDroneId === drone.id ? 'bg-[var(--color-bg-tertiary)] border-[var(--color-accent-blue)]' : 'bg-[var(--color-bg-secondary)] border-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-tertiary)]'} 
              border rounded-md p-3 cursor-pointer transition-colors
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center mb-1">
                  <span className={`h-2 w-2 rounded-full mr-2 ${
                    drone.status === 'active' ? 'bg-[var(--color-accent-green)] status-active' : 
                    drone.status === 'warning' ? 'bg-[var(--color-accent-yellow)] status-active' : 
                    drone.status === 'error' ? 'bg-[var(--color-accent-red)] status-active' : 
                    'bg-[var(--color-text-secondary)]'
                  }`}></span>
                  <span className="font-medium text-sm">{drone.name}</span>
                </div>
                <div className="text-xs text-[var(--color-text-secondary)] mb-2">{drone.model}</div>
              </div>
              
              <div className="mono text-xs px-2 py-0.5 rounded bg-[var(--color-bg-tertiary)]">
                ID: {drone.id}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center">
                <Battery size={14} className="mr-1" />
                <span className={`${
                  drone.battery > 50 ? 'text-[var(--color-accent-green)]' : 
                  drone.battery > 20 ? 'text-[var(--color-accent-yellow)]' : 
                  'text-[var(--color-accent-red)]'
                }`}>
                  {drone.battery.toFixed(0)}%
                </span>
              </div>
              
              <div className="flex items-center">
                <Wifi size={14} className="mr-1" />
                <span className={`${
                  drone.signal > 70 ? 'text-[var(--color-accent-green)]' : 
                  drone.signal > 30 ? 'text-[var(--color-accent-yellow)]' : 
                  'text-[var(--color-accent-red)]'
                }`}>
                  {drone.signal.toFixed(0)}%
                </span>
              </div>
              
              <div className="flex items-center">
                <Cpu size={14} className="mr-1" />
                <span>{drone.status === 'inactive' ? 'OFF' : 'ON'}</span>
              </div>
            </div>
            
            {drone.status === 'warning' && (
              <div className="mt-2 text-xs flex items-center text-[var(--color-accent-yellow)]">
                <AlertTriangle size={12} className="mr-1" />
                <span>Low battery warning</span>
              </div>
            )}
            
            {drone.status === 'error' && (
              <div className="mt-2 text-xs flex items-center text-[var(--color-accent-red)]">
                <AlertTriangle size={12} className="mr-1" />
                <span>Connection lost</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DroneList;