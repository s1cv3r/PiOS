import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { Battery, Wifi, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const StatusIndicator = ({ online }) => (
  <div className={`w-2 h-2 rounded-full inline-block mr-2 ${online ? 'bg-green-500' : 'bg-red-500'}`} />
);

const BatteryIndicator = ({ level }) => {
  return (
    <div className="flex items-center gap-2 font-medium">
      <div className={`w-6 h-3 border rounded-sm relative bg-white ${level > 60 ? 'border-green-600' : level > 30 ? 'border-yellow-500' : 'border-red-500'}`}>
        <div
          className={`h-full rounded-sm transition-all duration-300 ${level > 60 ? 'bg-green-600' : level > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className={level > 30 ? 'text-gray-700' : 'text-red-500'}>{level}%</span>
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange }) => (
  <div
    className={`relative w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
      checked ? 'bg-green-600' : 'bg-gray-300'
    }`}
    onClick={onChange}
  >
    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
      checked ? 'left-6' : 'left-0.5'
    }`} />
  </div>
);

const SettingItem = ({ title, description, children }) => (
  <div className="flex justify-between items-start p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    <div className="flex-1 mr-3">
      <div className="font-medium text-gray-800 text-sm mb-0.5">{title}</div>
      <div className="text-xs text-gray-600">{description}</div>
    </div>
    <div className="flex-shrink-0 mt-0.5">
      {children}
    </div>
  </div>
);

const SettingsSection = ({ title, children }) => (
  <div className="bg-white rounded-lg mb-3 shadow-sm overflow-hidden border border-gray-200">
    <div className="px-3 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-sm">
      {title}
    </div>
    {children}
  </div>
);

const SettingsScreen = () => {
  const [settings, setSettings] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        const [settingsData, devicesData] = await Promise.all([
          apiService.getSettings(),
          apiService.getDeviceStatus()
        ]);

        setSettings(settingsData);
        setDeviceStatus(devicesData);
      } catch (err) {
        setError('Failed to fetch settings data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, []);

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('');
    try {
      await apiService.saveSettings(settings);
      setSaveStatus('Settings saved successfully!');
    } catch (err) {
      setSaveStatus('Failed to save settings.');
      console.error(err);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleExportData = async () => {
    try {
      const blob = await apiService.exportData('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'agri-oras-data.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!settings || !deviceStatus) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
            🌱
          </div>
          <div>
            <div className="text-xl font-bold tracking-wide">AGRI-ORAS</div>
            <div className="text-sm opacity-90">Field Monitor Settings</div>
          </div>
        </div>
        <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
          2
        </div>
      </div>

      <div className="p-4">
        {/* Save Status Message */}
        {saveStatus && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            saveStatus.includes('Failed')
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            {saveStatus}
          </div>
        )}

        {/* Device Status */}
        <SettingsSection title="Device Status">
          <SettingItem
            title="Main Node"
            description={
              <div className="text-xs">
                <div className="flex items-center mb-1">
                  <StatusIndicator online={deviceStatus.mainNode.online} />
                  Connected • Zone A
                </div>
                <div>Last update: {deviceStatus.mainNode.lastUpdate}</div>
              </div>
            }
          >
            <BatteryIndicator level={deviceStatus.mainNode.battery} />
          </SettingItem>

          <SettingItem
            title="Weather Node"
            description={
              <div className="text-xs">
                <div className="flex items-center mb-1">
                  <StatusIndicator online={deviceStatus.weatherNode.online} />
                  Online • {deviceStatus.weatherNode.temp}
                </div>
                <div>Last update: {deviceStatus.weatherNode.lastUpdate}</div>
              </div>
            }
          >
            <BatteryIndicator level={deviceStatus.weatherNode.battery} />
          </SettingItem>

          <SettingItem
            title="Rover"
            description={
              <div className="text-xs">
                <div className="flex items-center mb-1">
                  <StatusIndicator online={deviceStatus.rover.online} />
                  Active • {deviceStatus.rover.distance}
                </div>
                <div>Uptime: {deviceStatus.rover.uptime}</div>
              </div>
            }
          >
            <BatteryIndicator level={deviceStatus.rover.battery} />
          </SettingItem>
        </SettingsSection>

        {/* Device Settings */}
        <SettingsSection title="Device Settings">
          <SettingItem
            title="Auto Data Sync"
            description="Automatically sync data when devices are in range"
          >
            <ToggleSwitch
              checked={settings.autoSync}
              onChange={() => handleSettingsChange('autoSync', !settings.autoSync)}
            />
          </SettingItem>

          <SettingItem
            title="Data Collection Interval"
            description="How often to collect sensor data from field devices"
          >
            <select
              className="px-2 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer text-xs focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={settings.dataInterval}
              onChange={(e) => handleSettingsChange('dataInterval', e.target.value)}
            >
              <option>Every 1 min</option>
              <option>Every 5 min</option>
              <option>Every 10 min</option>
              <option>Every 15 min</option>
              <option>Every 30 min</option>
              <option>Every hour</option>
            </select>
          </SettingItem>
        </SettingsSection>

        <SettingsSection title="Data Management">
          <SettingItem title="Export Data" description="Download all collected data in CSV format.">
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 bg-yellow-400 text-gray-800 rounded-md font-medium text-xs hover:bg-yellow-500 transition-colors"
            >
              Export Now
            </button>
          </SettingItem>
        </SettingsSection>

        {/* Save Button */}
        <div className="sticky bottom-20 z-10">
          <button
            className={`w-full px-4 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${
              isSaving
                ? 'bg-green-700 text-white cursor-not-allowed transform scale-95'
                : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:-translate-y-1 hover:shadow-xl active:transform active:scale-95'
            }`}
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </span>
            ) : (
              '💾 Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
