import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Alert } from '../../models/types';

interface AlertListProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
}

const AlertList: React.FC<AlertListProps> = ({ alerts, onAcknowledge }) => {
  // Sort alerts by timestamp (newest first) and not acknowledged first
  const sortedAlerts = [...alerts].sort((a, b) => {
    // Unacknowledged alerts first
    if (a.acknowledged !== b.acknowledged) {
      return a.acknowledged ? 1 : -1;
    }
    // Then by timestamp (newest first)
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="w-full">
      <ul className="space-y-2">
        {sortedAlerts.length > 0 ? (
          sortedAlerts.map(alert => (
            <li 
              key={alert.id}
              className={`
                ${alert.acknowledged ? 'bg-[var(--color-bg-secondary)] opacity-70' : 'bg-[var(--color-bg-secondary)]'} 
                border ${alert.acknowledged ? 'border-[var(--color-bg-tertiary)]' : 
                  alert.type === 'error' ? 'border-[var(--color-accent-red)]' : 
                  alert.type === 'warning' ? 'border-[var(--color-accent-yellow)]' : 
                  'border-[var(--color-accent-blue)]'} 
                rounded-md p-3
              `}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {alert.type === 'error' && <AlertTriangle size={18} className="text-[var(--color-accent-red)]" />}
                  {alert.type === 'warning' && <AlertTriangle size={18} className="text-[var(--color-accent-yellow)]" />}
                  {alert.type === 'info' && <Info size={18} className="text-[var(--color-accent-blue)]" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{alert.message}</span>
                    <span className="text-xs text-[var(--color-text-secondary)] ml-2">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  
                  {alert.droneId && (
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Drone ID: {alert.droneId}
                    </div>
                  )}
                  
                  {!alert.acknowledged && onAcknowledge && (
                    <button 
                      onClick={() => onAcknowledge(alert.id)}
                      className="mt-2 flex items-center text-xs text-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)]/80"
                    >
                      <CheckCircle2 size={12} className="mr-1" />
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="text-center p-4 text-[var(--color-text-secondary)]">
            <p className="text-sm">No alerts to display</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default AlertList;