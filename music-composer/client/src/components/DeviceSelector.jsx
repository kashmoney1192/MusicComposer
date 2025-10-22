import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

/**
 * DeviceSelector Component - Initial popup to select device type
 * Optimizes the app layout based on device screen size
 */
const DeviceSelector = ({ onDeviceSelected }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);

  const devices = [
    {
      id: 'mobile',
      name: 'Mobile',
      description: 'Phone (320px - 480px)',
      icon: Smartphone,
      width: '100%',
      maxWidth: '480px',
    },
    {
      id: 'tablet',
      name: 'Tablet',
      description: 'iPad/Tablet (768px - 1024px)',
      icon: Tablet,
      width: '100%',
      maxWidth: '1024px',
    },
    {
      id: 'laptop',
      name: 'Laptop',
      description: 'Desktop/Laptop (1024px+)',
      icon: Monitor,
      width: '100%',
      maxWidth: 'none',
    },
  ];

  const handleDeviceSelect = (deviceId) => {
    setSelectedDevice(deviceId);
    const device = devices.find(d => d.id === deviceId);
    onDeviceSelected(device);
  };

  // Auto-detect device based on actual window width
  const handleAutoDetect = () => {
    const width = window.innerWidth;
    let deviceId;

    if (width < 768) {
      deviceId = 'mobile';
    } else if (width < 1024) {
      deviceId = 'tablet';
    } else {
      deviceId = 'laptop';
    }

    const device = devices.find(d => d.id === deviceId);
    onDeviceSelected(device);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Music Composer</h1>
          <p className="text-gray-600 text-lg">
            Select your device type to optimize the interface for your screen
          </p>
        </div>

        {/* Device Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {devices.map((device) => {
            const Icon = device.icon;
            const isSelected = selectedDevice === device.id;

            return (
              <button
                key={device.id}
                onClick={() => handleDeviceSelect(device.id)}
                className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <Icon
                  className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                    isSelected ? 'text-blue-600' : 'text-gray-600'
                  }`}
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {device.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {device.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-600">or</span>
          </div>
        </div>

        {/* Auto-Detect Button */}
        <button
          onClick={handleAutoDetect}
          className="w-full mb-6 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        >
          Auto-Detect My Device
        </button>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (selectedDevice) {
                const device = devices.find(d => d.id === selectedDevice);
                onDeviceSelected(device);
              }
            }}
            disabled={!selectedDevice}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
              selectedDevice
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>

        {/* Info Text */}
        <p className="text-center text-xs text-gray-500 mt-4">
          You can change this setting anytime in the settings menu
        </p>
      </div>
    </div>
  );
};

export default DeviceSelector;
