import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import DashboardScreen from './screens/DashboardScreen';
import RoverScreen from './screens/RoverScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import { Gauge, Map, BarChart3, Settings } from 'lucide-react';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState(0);

  const BottomNavigation = () => {
    const tabs = [
      { id: 0, label: 'Dashboard', icon: Gauge },
      { id: 1, label: 'Rover', icon: Map },
      { id: 2, label: 'History', icon: BarChart3 },
      { id: 3, label: 'Settings', icon: Settings }
    ];

    return (
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 0:
        return <DashboardScreen />;
      case 1:
        return <RoverScreen />;
      case 2:
        return <HistoryScreen />;
      case 3:
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50">
      {renderScreen()}
      <BottomNavigation />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
