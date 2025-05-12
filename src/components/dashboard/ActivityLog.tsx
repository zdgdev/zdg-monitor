import React from 'react';
import { ActivityLog as ActivityLogType } from '../../models/types';
import { Clock, MapPin } from 'lucide-react';

interface ActivityLogProps {
  logs: ActivityLogType[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  // Sort logs by timestamp (newest first)
  const sortedLogs = [...logs].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'TAKEOFF':
      case 'LANDING':
        return 'text-[var(--color-accent-blue)]';
      case 'BATTERY_WARNING':
      case 'SIGNAL_WARNING':
        return 'text-[var(--color-accent-yellow)]';
      case 'CONNECTION_LOST':
      case 'ERROR':
        return 'text-[var(--color-accent-red)]';
      case 'AREA_CHANGE':
      case 'ALTITUDE_CHANGE':
        return 'text-[var(--color-accent-green)]';
      default:
        return 'text-[var(--color-text-primary)]';
    }
  };

  return (
    <div className="w-full">
      <div className="terminal font-mono text-xs">
        <div className="max-h-[300px] overflow-y-auto">
          {sortedLogs.length > 0 ? (
            sortedLogs.map(log => (
              <div key={log.id} className="mb-2 pb-2 border-b border-[var(--color-bg-tertiary)] last:border-0">
                <div className="flex justify-between items-start">
                  <div className={`font-bold ${getActionColor(log.action)}`}>
                    {log.action}
                  </div>
                  <div className="flex items-center text-[var(--color-text-secondary)]">
                    <Clock size={10} className="mr-1" />
                    {formatTime(log.timestamp)}
                  </div>
                </div>
                
                <div className="mt-1">{log.details}</div>
                
                {log.position && (
                  <div className="mt-1 flex items-center text-[var(--color-text-secondary)]">
                    <MapPin size={10} className="mr-1" />
                    LAT: {log.position.lat.toFixed(4)} LON: {log.position.lng.toFixed(4)}
                  </div>
                )}
                
                <div className="mt-1 text-[var(--color-text-secondary)]">
                  Drone ID: {log.droneId}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-[var(--color-text-secondary)]">
              <p>No activity logs to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;