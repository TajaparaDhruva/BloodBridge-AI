import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INDIAN_CITIES, reverseGeocode, WEATHER_MOCK } from '../data/mockLocations';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(() => {
    const saved = localStorage.getItem('user_location');
    return saved ? JSON.parse(saved) : null;
  });

  const [permissionStatus, setPermissionStatus] = useState('idle'); // idle | requesting | granted | denied | manual
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Derived weather data based on city
  const weather = userLocation
    ? (WEATHER_MOCK[userLocation.id] || WEATHER_MOCK.default)
    : WEATHER_MOCK.default;

  // Check if we need to show the location modal on mount
  // Only show after language has been selected (i.e. onboarding is complete)
  // (Auto-trigger removed as per request to disable automatic location prompt)

  const saveLocation = useCallback((cityObj) => {
    setUserLocation(cityObj);
    localStorage.setItem('user_location', JSON.stringify(cityObj));
    setShowLocationModal(false);
    setPermissionStatus('granted');
  }, []);

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPermissionStatus('denied');
      return;
    }
    setIsLocating(true);
    setPermissionStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const city = reverseGeocode(latitude, longitude);
        setIsLocating(false);
        saveLocation(city);
      },
      (error) => {
        console.warn('Geolocation denied:', error.message);
        setIsLocating(false);
        setPermissionStatus('denied');
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, [saveLocation]);

  const selectCityManually = useCallback((cityId) => {
    const city = INDIAN_CITIES.find(c => c.id === cityId);
    if (city) saveLocation(city);
  }, [saveLocation]);

  const resetLocation = useCallback(() => {
    setUserLocation(null);
    localStorage.removeItem('user_location');
    setPermissionStatus('idle');
    setShowLocationModal(true);
  }, []);

  return (
    <LocationContext.Provider value={{
      userLocation,
      permissionStatus,
      showLocationModal,
      setShowLocationModal,
      isLocating,
      weather,
      cities: INDIAN_CITIES,
      requestGeolocation,
      selectCityManually,
      saveLocation,
      resetLocation,
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
