import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Map, Database, Save } from 'lucide-react';
import Layout from '../components/layout/Layout';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      enableSound: true,
      enableDesktop: true,
      lowBatteryThreshold: 20,
      signalLossThreshold: 30,
    },
    map: {
      defaultZoom: 5,
      defaultCenter: [-2.5489, 118.0149],
      refreshRate: 5,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 3,
      requireTwoFactor: false,
    },
    system: {
      dataRetentionDays: 30,
      autoBackup: true,
      backupInterval: 24,
    }
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <SettingsIcon className="mr-2" />
            System Settings
          </h1>
          <p className="text-[var(--color-text-secondary)]">Configure system parameters and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="text-sm font-semibold flex items-center">
                <Bell size={16} className="mr-2" />
                Notification Settings
              </h2>
            </div>
            <div className="panel-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Enable Sound Alerts</label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.enableSound}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableSound: e.target.checked
                      }
                    })}
                    className="form-checkbox"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Enable Desktop Notifications</label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.enableDesktop}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        enableDesktop: e.target.checked
                      }
                    })}
                    className="form-checkbox"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Low Battery Threshold (%)</label>
                  <input
                    type="number"
                    value={settings.notifications.lowBatteryThreshold}
                    onChange={(e) => setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        lowBatteryThreshold: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="text-sm font-semibold flex items-center">
                <Shield size={16} className="mr-2" />
                Security Settings
              </h2>
            </div>
            <div className="panel-body">
              <div className="space-y-4">
                <div>
                  <label className="text-sm block mb-1">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        sessionTimeout: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        maxLoginAttempts: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] rounded px-3 py-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Require Two-Factor Auth</label>
                  <input
                    type="checkbox"
                    checked={settings.security.requireTwoFactor}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: {
                        ...settings.security,
                        requireTwoFactor: e.target.checked
                      }
                    })}
                    className="form-checkbox"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Map Settings */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="text-sm font-semibold flex items-center">
                <Map size={16} className="mr-2" />
                Map Settings
              </h2>
            </div>
            <div className="panel-body">
              <div className="space-y-4">
                <div>
                  <label className="text-sm block mb-1">Default Zoom Level</label>
                  <input
                    type="number"
                    value={settings.map.defaultZoom}
                    onChange={(e) => setSettings({
                      ...settings,
                      map: {
                        ...settings.map,
                        defaultZoom: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Refresh Rate (seconds)</label>
                  <input
                    type="number"
                    value={settings.map.refreshRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      map: {
                        ...settings.map,
                        refreshRate: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="panel">
            <div className="panel-header">
              <h2 className="text-sm font-semibold flex items-center">
                <Database size={16} className="mr-2" />
                System Settings
              </h2>
            </div>
            <div className="panel-body">
              <div className="space-y-4">
                <div>
                  <label className="text-sm block mb-1">Data Retention (days)</label>
                  <input
                    type="number"
                    value={settings.system.dataRetentionDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: {
                        ...settings.system,
                        dataRetentionDays: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] rounded px-3 py-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm">Enable Auto Backup</label>
                  <input
                    type="checkbox"
                    checked={settings.system.autoBackup}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: {
                        ...settings.system,
                        autoBackup: e.target.checked
                      }
                    })}
                    className="form-checkbox"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Backup Interval (hours)</label>
                  <input
                    type="number"
                    value={settings.system.backupInterval}
                    onChange={(e) => setSettings({
                      ...settings,
                      system: {
                        ...settings.system,
                        backupInterval: parseInt(e.target.value)
                      }
                    })}
                    className="w-full bg-[var(--color-bg-tertiary)] border border-[var(--color-bg-tertiary)] rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-[var(--color-accent-blue)] text-white rounded-md hover:bg-[var(--color-accent-blue)]/80"
          >
            <Save size={16} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;