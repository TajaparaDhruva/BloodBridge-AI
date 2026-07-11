import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { getHospitalsByCity } from '../data/mockHospitals';
import { useTheme } from '../context/ThemeContext';
import { FiSearch, FiSliders, FiNavigation, FiPhone, FiAlertCircle, FiClock, FiStar } from 'react-icons/fi';

const NearbyHospitals = ({ onCall }) => {
  const { userLocation } = useLocation();
  const { theme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const [selectedType, setSelectedType] = useState('all'); // all | private | government
  const [onlyEmergency, setOnlyEmergency] = useState(false);
  const [onlyBloodBank, setOnlyBloodBank] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const cityId = userLocation?.id || 'mumbai';
  const hospitals = useMemo(() => getHospitalsByCity(cityId), [cityId]);

  // Map references
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const centerLat = userLocation?.lat || 19.076;
  const centerLng = userLocation?.lng || 72.877;

  // Filters logic
  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          h.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDist = h.distance <= maxDistance;
      const matchType = selectedType === 'all' || h.type === selectedType;
      const matchEmergency = !onlyEmergency || h.emergencyAvailable;
      const matchBlood = !onlyBloodBank || h.bloodBankAvailable;
      return matchSearch && matchDist && matchType && matchEmergency && matchBlood;
    });
  }, [hospitals, searchQuery, maxDistance, selectedType, onlyEmergency, onlyBloodBank]);

  // 1. Initialize Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const tileUrl = 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const map = window.L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });

    window.L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    const markerGroup = window.L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    layerGroupRef.current = markerGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLng, theme]);

  // 2. Sync Markers with Filtered Hospitals
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group || !window.L) return;

    group.clearLayers();

    // User Position center base
    const baseIcon = window.L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-bloodred/25 animate-ping"></div>
          <div class="w-4 h-4 rounded-full bg-bloodred border border-white"></div>
        </div>
      `,
      className: 'custom-map-base',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    window.L.marker([centerLat, centerLng], { icon: baseIcon }).addTo(group);

    // Hospital markers
    filteredHospitals.forEach(h => {
      const isSelected = selectedHospital?.id === h.id;
      const hHtml = `
        <div class="w-8 h-8 rounded-full flex items-center justify-center border shadow-lg transition-transform ${
          isSelected 
            ? 'bg-bloodred border-white text-white scale-125' 
            : 'bg-slate-900 border-blue-500 text-blue-400'
        }">
          🏥
        </div>
      `;
      const hIcon = window.L.divIcon({
        html: hHtml,
        className: 'custom-map-marker-hosp',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = window.L.marker([h.coordinates.lat, h.coordinates.lng], { icon: hIcon });
      marker.on('click', () => setSelectedHospital(h));
      group.addLayer(marker);
    });

  }, [filteredHospitals, selectedHospital, centerLat, centerLng]);

  // 3. Pan to selected hospital coordinate
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedHospital) return;
    map.flyTo([selectedHospital.coordinates.lat, selectedHospital.coordinates.lng], 14, {
      animate: true,
      duration: 1.5
    });
  }, [selectedHospital]);

  const handleDirections = (h) => {
    alert(`Generating dynamic AI routing instructions to ${h.name}...\nAddress: ${h.address}\nETA: ${h.eta}`);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-bloodred">🏥</span> Nearby Hospital Discovery
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Locate critical trauma centers and emergency blood repositories in <span className="font-bold text-bloodred">{userLocation?.name || 'your city'}</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Filters + List + Map Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Filters Panel (Left column) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <h3 className="font-bold text-sm text-gray-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FiSliders className="w-4 h-4 text-bloodred" /> Intelligent Search & Filters
            </h3>

            {/* Search */}
            <div className="relative">
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search hospital name or address..."
                className="w-full bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 pl-10 text-xs text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-bloodred/50"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Distance Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500 dark:text-gray-400">Max Search Radius</span>
                <span className="text-bloodred">{maxDistance} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={maxDistance}
                onChange={e => setMaxDistance(parseInt(e.target.value))}
                className="w-full accent-bloodred cursor-pointer"
              />
            </div>

            {/* Hospital Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400">Hospital Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['all', 'private', 'government'].map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`py-2 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border transition-all ${
                      selectedType === type
                        ? 'bg-bloodred border-bloodred text-white shadow-sm'
                        : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-55 dark:hover:bg-white/5'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox filters */}
            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyEmergency}
                  onChange={e => setOnlyEmergency(e.target.checked)}
                  className="rounded text-bloodred focus:ring-bloodred border-gray-300 w-4.5 h-4.5 accent-bloodred"
                />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Only Emergency Availability (🔴)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyBloodBank}
                  onChange={e => setOnlyBloodBank(e.target.checked)}
                  className="rounded text-bloodred focus:ring-bloodred border-gray-300 w-4.5 h-4.5 accent-bloodred"
                />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Only With Blood Bank (🩸)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Hospitals List & Leaflet Map (Right columns) */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* List Section */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <AnimatePresence mode="wait">
              {filteredHospitals.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-3xl p-8 text-center text-gray-400"
                >
                  <FiAlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <h4 className="font-bold text-gray-800 dark:text-white">No Hospitals Match Criteria</h4>
                  <p className="text-xs text-gray-400 mt-1">Try relaxing filters or widening search radius.</p>
                </motion.div>
              ) : (
                filteredHospitals.map(h => (
                  <motion.div
                    key={h.id}
                    layoutId={h.id}
                    onClick={() => setSelectedHospital(h)}
                    className={`glass-card rounded-3xl p-5 border-l-4 cursor-pointer transition-all ${
                      selectedHospital?.id === h.id
                        ? 'border-l-bloodred bg-bloodred/5 dark:bg-bloodred/10 scale-[1.01]'
                        : 'border-l-transparent hover:border-l-gray-300 dark:hover:border-l-gray-700'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase tracking-wider ${
                          h.type === 'government'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                        }`}>
                          {h.type}
                        </span>
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white mt-1.5">{h.name}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-lg">
                        <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{h.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{h.address}</p>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <FiNavigation className="w-3.5 h-3.5 text-bloodred" />
                        <span className="text-gray-800 dark:text-gray-200">{h.distance} km away</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiClock className="w-3.5 h-3.5 text-aiblue" />
                        <span className="text-gray-800 dark:text-gray-200">ETA: {h.eta}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {h.bloodGroups.map(bg => (
                        <span key={bg} className="px-1.5 py-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200/50 dark:border-white/5 text-[9px] font-extrabold rounded-md text-gray-600 dark:text-gray-400">
                          {bg}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
                      <div className="flex gap-2">
                        {h.emergencyAvailable && (
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            🔴 Emergency
                          </span>
                        )}
                        {h.bloodBankAvailable && (
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            🩸 Blood Bank
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDirections(h); }}
                          className="p-2 rounded-xl bg-bloodred hover:bg-bloodred-dark text-white shadow transition-colors cursor-pointer"
                          title="Get Directions"
                        >
                          <FiNavigation className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Leaflet Map Preview Container */}
          <div className="glass-card rounded-3xl overflow-hidden min-h-[300px] flex flex-col relative bg-slate-900 border border-white/5 shadow-2xl">
            {/* Map Container Element */}
            <div ref={mapContainerRef} className="flex-1 w-full h-full relative" style={{ zIndex: 1, minHeight: 280 }} />

            {/* Selected Hospital Preview details */}
            <div className="p-4 border-t border-white/5 bg-slate-950/90 text-white z-10 relative">
              {selectedHospital ? (
                <div>
                  <h5 className="font-bold text-xs">{selectedHospital.name}</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">{selectedHospital.address}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-bloodred uppercase">
                      ETA: {selectedHospital.eta} ({selectedHospital.distance} km)
                    </span>
                    <button
                      onClick={() => handleDirections(selectedHospital)}
                      className="px-3 py-1 bg-bloodred hover:bg-bloodred-dark text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <FiNavigation className="w-3 h-3" /> Navigation Route
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[10px] text-gray-500 py-2">
                  Select a hospital card or marker to query details
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default NearbyHospitals;
