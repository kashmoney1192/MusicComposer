import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Music,
  Home,
  PlusCircle,
  Search,
  Menu,
  X,
  BookOpen,
  Smartphone,
  Tablet,
  Monitor,
  ChevronDown
} from 'lucide-react';
import { useDevice } from '../../contexts/DeviceContext';

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const { device, selectDevice, isMobile, isTablet, isLaptop } = useDevice();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, children, icon: Icon, className = "" }) => (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-primary-100 text-primary-900'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      } ${className}`}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold gradient-text"
            >
              <Music className="w-8 h-8 text-primary-600" />
              <span>MusicComposer</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/sight-reading" icon={BookOpen}>Sight Reading</NavLink>
            <NavLink to="/browse" icon={Search}>Browse</NavLink>
            <NavLink
              to="/compose"
              icon={PlusCircle}
              className="btn-primary ml-4"
            >
              Compose
            </NavLink>
          </div>

          {/* Device selector dropdown (right side) */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Change device type"
              >
                {isMobile && <Smartphone className="w-4 h-4" />}
                {isTablet && <Tablet className="w-4 h-4" />}
                {isLaptop && <Monitor className="w-4 h-4" />}
                <span className="hidden sm:inline capitalize">{device?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Device dropdown menu */}
              {isDeviceMenuOpen && (
                <>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {[
                      { id: 'mobile', name: 'Mobile', icon: Smartphone, desc: '320px - 480px' },
                      { id: 'tablet', name: 'Tablet', icon: Tablet, desc: '768px - 1024px' },
                      { id: 'laptop', name: 'Laptop', icon: Monitor, desc: '1024px+' },
                    ].map((d) => {
                      const Icon = d.icon;
                      return (
                        <button
                          key={d.id}
                          onClick={() => {
                            selectDevice({
                              id: d.id,
                              name: d.name,
                              description: d.desc,
                              icon: d.icon,
                            });
                            setIsDeviceMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                            device?.id === d.id
                              ? 'bg-blue-50 text-blue-600 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <div className="text-left">
                            <p className="font-medium">{d.name}</p>
                            <p className="text-xs text-gray-500">{d.desc}</p>
                          </div>
                          {device?.id === d.id && <span className="ml-auto text-blue-600">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDeviceMenuOpen(false)}
                  />
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              <NavLink to="/" icon={Home}>Home</NavLink>
              <NavLink to="/sight-reading" icon={BookOpen}>Sight Reading</NavLink>
              <NavLink to="/browse" icon={Search}>Browse</NavLink>
              <NavLink to="/compose" icon={PlusCircle}>Compose</NavLink>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;