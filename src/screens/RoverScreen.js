import React from 'react';
import { Battery, Wifi, Camera, MapPin, AlertTriangle, CheckCircle, Clock, Zap, Activity, Map, Eye } from 'lucide-react';

const StatusBadge = ({ status, type = 'status' }) => {
  const getStatusColor = () => {
    if (type === 'zone') {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-800';
        case 'in-progress': return 'bg-yellow-100 text-yellow-800';
        case 'pending': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

const RoverScreen = ({ data }) => {
  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center">
            <span className="text-green-800 font-bold text-sm">🌱</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">AGRI-ORAS</h1>
            <p className="text-white text-sm opacity-90">Field Monitor</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-red-500 rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-white text-xs font-bold">2</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          <button className="flex-1 flex flex-col items-center py-3 text-green-600 border-b-2 border-green-600">
            <Activity size={18} />
            <span className="text-xs mt-1">Overview</span>
          </button>
          <button className="flex-1 flex flex-col items-center py-3 text-gray-500">
            <Map size={18} />
            <span className="text-xs mt-1">Mapping</span>
          </button>
          <button className="flex-1 flex flex-col items-center py-3 text-gray-500">
            <Camera size={18} />
            <span className="text-xs mt-1">Photos</span>
          </button>
          <button className="flex-1 flex flex-col items-center py-3 text-gray-500">
            <Eye size={18} />
            <span className="text-xs mt-1">System</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        {/* Rover Status Card */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">Rover Status</h2>
            <StatusBadge status={data.status} />
          </div>

          {/* Battery & Signal */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Battery className={`w-4 h-4 ${data.battery > 20 ? 'text-green-500' : 'text-red-500'}`} />
                <span className="text-sm text-gray-600">Battery</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-2 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${data.battery > 20 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${data.battery}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{data.battery}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Signal</span>
              </div>
              <span className="text-sm font-medium">{data.signal}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">Distance</p>
              <p className="font-semibold text-gray-800">{data.totalDistance} km</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <p className="text-xs text-gray-600">Uptime</p>
              <p className="font-semibold text-gray-800">6h 23m</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 text-center">
            Last update: 2 min ago • Temp: 34.2°C
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <Camera className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Photos Today</p>
            <p className="text-lg font-bold text-gray-800">{data.photosToday}</p>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm text-center">
            <BarChart3 className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <p className="text-xs text-gray-600">Data Points</p>
            <p className="text-lg font-bold text-gray-800">{data.dataPoints}</p>
          </div>
        </div>

        {/* System Alert */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">System Alert</h3>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
              1 warning
            </span>
          </div>

          <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-gray-800">{data.systemIssues[0].message}</p>
              <p className="text-xs text-gray-500 mt-1">{data.systemIssues[0].time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoverScreen;
