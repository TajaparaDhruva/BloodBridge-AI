import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { getHospitalsByCity } from '../data/mockHospitals';
import { NEARBY_DONORS } from '../data/mockDonors';
import { useTheme } from '../context/ThemeContext';
import { FiLayers, FiCompass, FiPlus, FiMinus, FiMapPin, FiActivity, FiUsers, FiSliders, FiHeart } from 'react-icons/fi';

const EmergencyMap = () => {
  const { userLocation } = useLocation();
  const { theme } = useTheme();
  
  const [activeLayers, setActiveLayers] = useState({
    hospitals: true,
    donors: true,
    requests: true,
    user: true
  });
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [mapStyle, setMapStyle] = useState('google-road');

  const cityId = userLocation?.id || 'mumbai';
  const hospitals = useMemo(() => getHospitalsByCity(cityId), [cityId]);

  // Leaflet references
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const tileLayerRef = useRef(null);

  const centerLat = userLocation?.lat || 19.076;
  const centerLng = userLocation?.lng || 72.877;

  // Initialize Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Destroy old instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Create map instance centered on user location
    const map = window.L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: 13,
      zoomControl: false, // Custom zoom buttons in overlay UI
      attributionControl: false
    });

    // Create a group for markers
    const markerGroup = window.L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    layerGroupRef.current = markerGroup;
    tileLayerRef.current = null;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [centerLat, centerLng]);

  // Sync Tile Layer based on mapStyle or theme
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    let url = 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    let options = {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    };

    if (mapStyle === 'google-satellite') {
      url = 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'google-terrain') {
      url = 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
    } else if (mapStyle === 'dark-tactical') {
      url = theme === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      options = { maxZoom: 19 };
    }

    const tileLayer = window.L.tileLayer(url, options).addTo(map);
    tileLayerRef.current = tileLayer;
  }, [mapStyle, theme]);

  // Redraw markers when activeLayers, hospitals, donors list changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group || !window.L) return;

    // Clear old markers
    group.clearLayers();

    // 1. Render User Base Point
    if (activeLayers.user) {
      const userHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-ping"></div>
          <div class="w-4.5 h-4.5 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center">
            <span class="w-1.5 h-1.5 bg-white rounded-full"></span>
          </div>
        </div>
      `;
      const userIcon = window.L.divIcon({
        html: userHtml,
        className: 'custom-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const userMarker = window.L.marker([centerLat, centerLng], { icon: userIcon });
      userMarker.bindTooltip("Command Base Hub", { permanent: false, direction: 'top' });
      userMarker.on('click', () => {
        setSelectedEntity({
          name: `${userLocation?.name || 'Local Station'} Operations Base`,
          lat: centerLat,
          lng: centerLng,
          mapType: 'User Base Hub',
          details: 'Global routing coordinator center.'
        });
      });
      group.addLayer(userMarker);
    }

    // 2. Render Hospitals
    if (activeLayers.hospitals) {
      hospitals.forEach(h => {
        const hospitalHtml = `
          <div class="w-8 h-8 rounded-full bg-slate-900/90 border border-blue-500 flex items-center justify-center shadow-lg text-xs hover:scale-110 transition-transform">
            🏥
          </div>
        `;
        const hospitalIcon = window.L.divIcon({
          html: hospitalHtml,
          className: 'custom-map-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = window.L.marker([h.coordinates.lat, h.coordinates.lng], { icon: hospitalIcon });
        marker.on('click', () => setSelectedEntity({ ...h, mapType: 'hospital' }));
        group.addLayer(marker);
      });
    }

    // 3. Render Donors
    if (activeLayers.donors) {
      NEARBY_DONORS.forEach(d => {
        const donorHtml = `
          <div class="w-8 h-8 rounded-full bg-slate-900/90 border border-emerald-500 flex items-center justify-center shadow-lg text-xs hover:scale-110 transition-transform">
            🩸
          </div>
        `;
        const donorIcon = window.L.divIcon({
          html: donorHtml,
          className: 'custom-map-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = window.L.marker([d.coordinates.lat, d.coordinates.lng], { icon: donorIcon });
        marker.on('click', () => setSelectedEntity({ ...d, mapType: 'donor' }));
        group.addLayer(marker);
      });
    }

    // 4. Render Emergency Requests
    if (activeLayers.requests) {
      const emergencyRequests = [
        { id: 'REQ-EMERG-1', name: 'Critical Request O-', coordinates: { lat: centerLat + 0.008, lng: centerLng - 0.012 }, patient: 'Rajiv Sharma', urgency: 'emergency' },
        { id: 'REQ-EMERG-2', name: 'Trauma Request AB-', coordinates: { lat: centerLat - 0.015, lng: centerLng + 0.018 }, patient: 'Sunita Mehra', urgency: 'emergency' }
      ];

      emergencyRequests.forEach(r => {
        const reqHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 bg-rose-500/25 border border-rose-500 rounded-full animate-pulse"></div>
            <div class="w-8 h-8 rounded-full bg-rose-600 border border-white flex items-center justify-center text-xs shadow-lg relative z-10">
              🚨
            </div>
          </div>
        `;
        const reqIcon = window.L.divIcon({
          html: reqHtml,
          className: 'custom-map-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = window.L.marker([r.coordinates.lat, r.coordinates.lng], { icon: reqIcon });
        marker.on('click', () => setSelectedEntity({
          id: r.id,
          name: r.name,
          patientName: r.patient,
          urgency: r.urgency,
          coordinates: r.coordinates,
          mapType: 'request'
        }));
        group.addLayer(marker);
      });
    }

  }, [activeLayers, hospitals, centerLat, centerLng, userLocation]);

  const toggleLayer = (layer) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleZoom = (direction) => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (direction === 'in') map.zoomIn();
    else map.zoomOut();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-slate-950 text-white select-none">
      
      {/* Leaflet Map Target DOM element */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />

      {/* ================= MAP CONTROLS OVERLAYS ================= */}

      {/* Top Floating Info Bar */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-30">
        <div className="glass-card rounded-2xl p-4 pointer-events-auto border border-white/10 bg-slate-900/90 flex items-center gap-3 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-bloodred/20 flex items-center justify-center text-bloodred animate-pulse">
            <FiCompass className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Tactical Operations Hub</h4>
            <p className="text-[10px] text-gray-500">Live coordinates active inside: <span className="font-bold text-white">{userLocation?.name || 'Mumbai'}</span></p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-3 pointer-events-auto border border-white/10 bg-slate-900/90 shadow-lg">
          <motion.div
            className="w-8 h-8 flex items-center justify-center text-indigo-400 text-lg"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            🧭
          </motion.div>
        </div>
      </div>

      {/* Right Zoom Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-30">
        <button
          onClick={() => handleZoom('in')}
          className="w-10 h-10 rounded-xl bg-slate-900/95 border border-white/10 text-white flex items-center justify-center hover:bg-slate-800 hover:border-white/20 transition-all font-bold shadow-md cursor-pointer"
        >
          <FiPlus className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="w-10 h-10 rounded-xl bg-slate-900/95 border border-white/10 text-white flex items-center justify-center hover:bg-slate-800 hover:border-white/20 transition-all font-bold shadow-md cursor-pointer"
        >
          <FiMinus className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Left Layers Dashboard */}
      <div className="absolute bottom-20 lg:bottom-6 left-6 z-30 w-64">
        <div className="glass-card rounded-3xl p-5 border border-white/10 bg-slate-900/90 space-y-4 shadow-lg">
          <h5 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <FiLayers className="w-4 h-4 text-indigo-400" /> Active Operations Layers
          </h5>

          <div className="space-y-2">
            {[
              { id: 'hospitals', label: '🏥 Medical Centers', checked: activeLayers.hospitals, color: 'border-blue-500/20' },
              { id: 'donors', label: 'Live Donor Base', checked: activeLayers.donors, color: 'border-emerald-500/20' },
              { id: 'requests', label: '🚨 Emergency Dispatches', checked: activeLayers.requests, color: 'border-rose-500/20' },
              { id: 'user', label: '📍 Command Base Point', checked: activeLayers.user, color: 'border-gray-500/20' }
            ].map(layer => (
              <label
                key={layer.id}
                className={`flex items-center justify-between p-2 rounded-xl border bg-slate-950/60 cursor-pointer hover:bg-slate-950 transition-all ${layer.color}`}
              >
                <span className="text-[11px] font-bold text-gray-300">{layer.label}</span>
                <input
                  type="checkbox"
                  checked={layer.checked}
                  onChange={() => toggleLayer(layer.id)}
                  className="rounded text-indigo-500 focus:ring-indigo-500 border-white/15 w-4 h-4 accent-indigo-500"
                />
              </label>
            ))}
          </div>

          <div className="border-t border-white/10 pt-3 space-y-1.5">
            <h5 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              🗺️ Map Basemap Style
            </h5>
            <select
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
              className="w-full text-[11px] font-bold bg-slate-950 border border-white/10 rounded-xl p-2.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-gray-300"
            >
              <option value="google-road">🗺️ Google Road Map</option>
              <option value="google-satellite">🛰️ Google Satellite</option>
              <option value="google-terrain">⛰️ Google Terrain</option>
              <option value="dark-tactical">🏙️ Dark Tactical Grid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Center Details Panel */}
      <AnimatePresence>
        {selectedEntity && (
          <motion.div
            className="absolute bottom-20 lg:bottom-6 right-6 left-6 lg:left-auto z-40 lg:w-96"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div className="glass-card rounded-3xl p-5 border border-white/15 bg-slate-950/90 text-white shadow-2xl relative">
              <button
                onClick={() => setSelectedEntity(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>

              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">
                  {selectedEntity.mapType === 'hospital' ? '🏥' : selectedEntity.mapType === 'donor' ? '🩸' : '🚨'}
                </span>
                <div className="flex-1">
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-indigo-400 px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded-md inline-block mb-1.5">
                    {selectedEntity.mapType} Profile
                  </span>
                  <h4 className="font-extrabold text-sm text-white">{selectedEntity.name}</h4>
                  
                  {selectedEntity.mapType === 'hospital' && (
                    <div className="text-[11px] text-gray-400 space-y-1 mt-2">
                      <p>📍 Address: {selectedEntity.address}</p>
                      <p>📞 Emergency Line: {selectedEntity.contact}</p>
                      <p className="text-indigo-400 font-bold mt-1">🔴 ETA: {selectedEntity.eta} ({selectedEntity.distance} km)</p>
                    </div>
                  )}

                  {selectedEntity.mapType === 'donor' && (
                    <div className="text-[11px] text-gray-400 space-y-1 mt-2">
                      <p>🩸 Compatibility group: {selectedEntity.bloodGroup}</p>
                      <p>✨ Matching rating score: {selectedEntity.aiScore}% Match</p>
                      <p className="text-emerald-400 font-bold mt-1">⏱️ Dispatch Time: {selectedEntity.eta} ({selectedEntity.distance} km)</p>
                    </div>
                  )}

                  {selectedEntity.mapType === 'request' && (
                    <div className="text-[11px] text-gray-400 space-y-1 mt-2">
                      <p className="text-rose-500 font-extrabold">🚨 URGENT: Match priority check-in active</p>
                      <p>👤 Patient Name: {selectedEntity.patientName}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
                    <button
                      onClick={() => alert(`Initiating priority dispatch interface for ${selectedEntity.name}...`)}
                      className="flex-1 py-2 rounded-xl bg-bloodred hover:bg-bloodred-dark text-white font-bold text-[10px] uppercase tracking-wider transition-colors text-center cursor-pointer"
                    >
                      Priority Dispatch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EmergencyMap;
