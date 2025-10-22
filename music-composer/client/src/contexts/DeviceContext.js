import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * DeviceContext - Manages device type and responsive layout settings
 */
const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [device, setDevice] = useState(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('selectedDevice');
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  });

  const [hasSelectedDevice, setHasSelectedDevice] = useState(!!device);

  useEffect(() => {
    if (device) {
      localStorage.setItem('selectedDevice', JSON.stringify(device));
    }
  }, [device]);

  const selectDevice = (deviceInfo) => {
    setDevice(deviceInfo);
    setHasSelectedDevice(true);
  };

  const resetDevice = () => {
    setDevice(null);
    setHasSelectedDevice(false);
    localStorage.removeItem('selectedDevice');
  };

  // Get responsive values based on device
  const getResponsiveValue = (mobileVal, tabletVal, laptopVal) => {
    if (!device) return laptopVal;

    switch (device.id) {
      case 'mobile':
        return mobileVal;
      case 'tablet':
        return tabletVal;
      case 'laptop':
      default:
        return laptopVal;
    }
  };

  const getResponsiveClass = (mobileClass, tabletClass, laptopClass) => {
    if (!device) return laptopClass;

    switch (device.id) {
      case 'mobile':
        return mobileClass;
      case 'tablet':
        return tabletClass;
      case 'laptop':
      default:
        return laptopClass;
    }
  };

  const value = {
    device,
    hasSelectedDevice,
    selectDevice,
    resetDevice,
    getResponsiveValue,
    getResponsiveClass,
    // Convenience methods
    isMobile: device?.id === 'mobile',
    isTablet: device?.id === 'tablet',
    isLaptop: device?.id === 'laptop',
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within DeviceProvider');
  }
  return context;
};
