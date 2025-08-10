import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import WeatherCard from './WeatherCard';
import NodeCard from './NodeCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const socket = apiService.connectToRealtime((newData) => {
      if (newData.nodes || newData.alerts) {
        setDashboardData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            nodes: newData.nodes || prev.nodes,
            alerts: newData.alerts || prev.alerts,
          };
        });
      }
    });

    return () => {
      if (socket) socket.close();
    };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!dashboardData) return null;

  return (
    <div className="p-4 space-y-4">
      <WeatherCard weather={dashboardData.weather} />
      <NodeCard status={dashboardData.nodes} />
    </div>
  );
};

export default DashboardScreen;
