import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../context/LocationContext';
import { FiMapPin, FiNavigation, FiChevronDown, FiCheck, FiLoader } from 'react-icons/fi';

const LocationPermissionModal = () => {
  const {
    showLocationModal,
    setShowLocationModal,
    permissionStatus,
    isLocating,
    cities,
    requestGeolocation,
    selectCityManually,
    userLocation,
  } = useLocation();

  const [step, setStep] = useState('ask'); // ask | manual | success
  const [selectedCity, setSelectedCity] = useState('');

  const handleAutoDetect = () => {
    requestGeolocation();
    setStep('locating');
  };

  const handleManual = () => setStep('manual');

  const handleConfirmManual = () => {
    if (selectedCity) {
      selectCityManually(selectedCity);
      setStep('success');
    }
  };

  // When location granted, show success briefly
  React.useEffect(() => {
    if (userLocation && step === 'locating') {
      setStep('success');
      const t = setTimeout(() => setShowLocationModal(false), 1800);
      return () => clearTimeout(t);
    }
  }, [userLocation, step, setShowLocationModal]);

  if (!showLocationModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="location-modal-bg"
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-[#030712]">
          {/* Mesh gradient */}
          <div className="absolute inset-0 opacity-60"
            style={{
              background: 'radial-gradient(ellipse at 20% 50%, rgba(215,38,56,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.25) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.15) 0%, transparent 50%)',
            }}
          />
          {/* Floating orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                width: 120 + i * 60,
                height: 120 + i * 60,
                left: `${10 + i * 15}%`,
                top: `${5 + i * 12}%`,
                background: i % 2 === 0 ? 'rgba(215,38,56,0.4)' : 'rgba(99,102,241,0.4)',
                filter: 'blur(40px)',
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Modal Card */}
        <motion.div
          key="location-modal-card"
          className="relative z-10 w-full max-w-md"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          <div className="glass-floating rounded-3xl p-8 text-white relative overflow-hidden">
            {/* Subtle inner glow top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <AnimatePresence mode="wait">
              {/* Step: Ask */}
              {step === 'ask' && (
                <motion.div
                  key="ask"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center"
                >
                  {/* Icon */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-bloodred to-crimson flex items-center justify-center text-4xl shadow-lg glow-red">
                      🩸
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-aiblue flex items-center justify-center"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FiMapPin className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  </div>

                  <h2 className="text-2xl font-extrabold text-white mb-2">Enable Location</h2>
                  <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                    BloodBridge AI uses your location to find nearby hospitals, donors, and emergency services in real time.
                  </p>

                  <div className="flex flex-col gap-3">
                    <motion.button
                      onClick={handleAutoDetect}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-bloodred to-crimson text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg glow-red"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiNavigation className="w-4 h-4" />
                      Allow Location Access
                    </motion.button>
                    <motion.button
                      onClick={handleManual}
                      className="w-full py-3.5 rounded-2xl border border-white/15 text-white/80 font-semibold text-sm hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Choose City Manually
                    </motion.button>
                  </div>

                  <p className="text-white/30 text-xs mt-4">Your location is stored only on this device</p>
                </motion.div>
              )}

              {/* Step: Locating */}
              {step === 'locating' && (
                <motion.div
                  key="locating"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-4"
                >
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-full border-2 border-bloodred/30 flex items-center justify-center">
                      <motion.div
                        className="w-14 h-14 rounded-full border-2 border-t-bloodred border-bloodred/20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <FiMapPin className="absolute w-5 h-5 text-bloodred" />
                    </div>
                    {[0, 1, 2].map(i => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-bloodred/30"
                        animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
                      />
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Detecting Location</h2>
                  <p className="text-white/50 text-sm">Finding your city for AI-powered emergency response…</p>
                </motion.div>
              )}

              {/* Step: Manual city select */}
              {step === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-aiblue/20 flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-aiblue" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Select Your City</h2>
                      <p className="text-white/50 text-xs">Choose for personalized AI matching</p>
                    </div>
                  </div>

                  <div className="relative mb-4">
                    <select
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3.5 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-bloodred/60 pr-10"
                    >
                      <option value="" className="bg-slate-900">— Select a city —</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id} className="bg-slate-900">
                          {city.name}, {city.state}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 w-4 h-4 pointer-events-none" />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('ask')}
                      className="flex-1 py-3 rounded-xl border border-white/15 text-white/60 text-sm font-semibold hover:bg-white/5 transition-colors"
                    >
                      Back
                    </button>
                    <motion.button
                      onClick={handleConfirmManual}
                      disabled={!selectedCity}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-bloodred to-crimson text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                      whileHover={selectedCity ? { scale: 1.02 } : {}}
                      whileTap={selectedCity ? { scale: 0.98 } : {}}
                    >
                      Confirm City
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-aigreen to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <FiCheck className="w-9 h-9 text-white" strokeWidth={3} />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white mb-1">Location Set!</h2>
                  <p className="text-white/50 text-sm">
                    {userLocation ? `${userLocation.name}, ${userLocation.state}` : 'Your city'} — AI is now active
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LocationPermissionModal;
