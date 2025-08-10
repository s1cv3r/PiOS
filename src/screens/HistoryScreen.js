import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { BarChart3, Calendar, Download, Filter, ChevronDown, Thermometer, Droplets, MapPin, Sprout } from 'lucide-react';
import ChartContainer from './ChartContainer';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ timeRange: '7days', dataType: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('records');

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getHistoryData(filters);
        setHistoryData(data);
      } catch (err) {
        setError('Failed to fetch history data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getChartData = () => {
    if (!historyData || !historyData.records) return [];
    return historyData.records.map(record => ({
      timestamp: record.timestamp,
      time: record.time,
      temperature: record.temperature,
      humidity: record.humidity,
      zone: record.zone,
      rain: record.rain === 'Yes' ? 1 : 0
    }));
  };

  const aggregateData = (key) => {
    if (!historyData || !historyData.records) return [];
    const counts = historyData.records.reduce((acc, record) => {
      const recordKey = record[key];
      if(recordKey) {
        acc[recordKey] = (acc[recordKey] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!historyData) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
            <span className="text-green-800 font-bold text-sm">🌾</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">AGRI-ORAS</h1>
            <p className="text-white text-sm opacity-90">Field Monitor</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 py-2 space-y-2">
        {/* Summary Statistics */}
        <div className="bg-white rounded p-2 shadow-sm">
          <h2 className="text-gray-800 font-semibold text-sm mb-2">Data Summary</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{historyData.summary.totalDataPoints}</div>
              <div className="text-xs text-gray-600">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{historyData.summary.avgTemperature}</div>
              <div className="text-xs text-gray-600">Avg Temperature</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{historyData.summary.avgHumidity}</div>
              <div className="text-xs text-gray-600">Avg Humidity</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{historyData.summary.soilGoodPercentage}</div>
              <div className="text-xs text-gray-600">Soil Health Good</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded p-2 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-gray-800 font-medium text-xs">Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 text-gray-600"
            >
              <Filter className="w-3 h-3" />
              <ChevronDown className={`w-3 h-3 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="space-y-1">
              <div className="space-y-1">
                <select
                  name="timeRange"
                  value={filters.timeRange}
                  onChange={handleFilterChange}
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                >
                  <option value="24hours">Last 24 Hours</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
                <select
                  name="dataType"
                  value={filters.dataType}
                  onChange={handleFilterChange}
                  className="w-full p-1 border border-gray-300 rounded text-xs"
                >
                  <option value="all">All Data</option>
                  <option value="weather">Weather Only</option>
                  <option value="soil">Soil Only</option>
                  <option value="crop">Crop Status</option>
                  <option value="zone">By Zone</option>
                </select>
              </div>
              <button className="w-full bg-yellow-400 text-gray-800 py-1 rounded font-medium flex items-center justify-center space-x-1 text-xs">
                <Download className="w-3 h-3" />
                <span>Export Data</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded shadow-sm">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-2 px-2 text-xs font-medium ${
                activeTab === 'records'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
            >
              Records
            </button>
            <button
              onClick={() => setActiveTab('graphs')}
              className={`flex-1 py-2 px-2 text-xs font-medium ${
                activeTab === 'graphs'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <BarChart3 className="w-3 h-3" />
                <span>Graphs</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('tables')}
              className={`flex-1 py-2 px-2 text-xs font-medium ${
                activeTab === 'tables'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                <Sprout className="w-3 h-3" />
                <span>Analytics</span>
              </div>
            </button>
          </div>
        </div>

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className="bg-white rounded shadow-sm">
            <div className="p-2 border-b border-gray-100">
              <h3 className="text-gray-800 font-medium text-xs">Recent Records</h3>
              <p className="text-xs text-gray-600">Last updated: just now</p>
            </div>

            <div className="divide-y divide-gray-100">
              {historyData.records.map((record) => (
                <div key={record.id} className="p-2 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-800">{record.timestamp}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-2 h-2 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">{record.zone}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Thermometer className="w-2 h-2 text-red-500" />
                        <span className="text-gray-600">Temperature:</span>
                      </div>
                      <span className="font-medium">{record.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-2 h-2 text-blue-500" />
                        <span className="text-gray-600">Humidity:</span>
                      </div>
                      <span className="font-medium">{record.humidity}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'graphs' && (
          <div className="space-y-3">
            <ChartContainer
              title="Temperature Trends"
              data={getChartData()}
              type="line"
              xAxisKey="time"
              dataKeys={['temperature']}
              height={200}
            />

            <ChartContainer
              title="Humidity Levels"
              data={getChartData()}
              type="line"
              xAxisKey="time"
              dataKeys={['humidity']}
              height={200}
            />

            <ChartContainer
              title="Rain Detection"
              data={getChartData()}
              type="area"
              xAxisKey="time"
              dataKeys={['rain']}
              height={200}
            />
          </div>
        )}

        {activeTab === 'tables' && (
          <div className="space-y-3">
            <ChartContainer
              title="Soil Health Distribution"
              data={aggregateData('soilStatus')}
              type="pie"
              xAxisKey="name"
              dataKeys={['value']}
              height={250}
            />

            <ChartContainer
              title="Crop Status Distribution"
              data={aggregateData('cropStatus')}
              type="pie"
              xAxisKey="name"
              dataKeys={['value']}
              height={250}
            />

            <ChartContainer
              title="Data by Zone"
              data={aggregateData('zone')}
              type="bar"
              xAxisKey="name"
              dataKeys={['value']}
              height={250}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
