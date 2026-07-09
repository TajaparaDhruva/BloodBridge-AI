import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiActivity } from 'react-icons/fi';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill the progress indicator
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 80);

    const redirectTimeout = setTimeout(() => {
      navigate('/language-select');
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-[#FAF9F6] dark:bg-[#0F172A] flex flex-col items-center justify-center z-50 transition-colors duration-500 overflow-hidden">
      
      {/* Decorative radial gradients */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-bloodred/5 dark:bg-bloodred/2 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-crimson/5 dark:bg-crimson/2 blur-[80px] pointer-events-none"></div>

      <div className="flex flex-col items-center text-center max-w-sm px-6 relative">
        {/* Pulsing blood droplet / pulse icon */}
        <div className="relative mb-8">
          {/* Inner ring */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-bloodred to-crimson flex items-center justify-center text-white shadow-2xl relative z-10 animate-heartbeat">
            <FiActivity className="w-12 h-12" />
          </div>
          {/* Pulsing outer rings */}
          <div className="absolute inset-0 rounded-full bg-bloodred/20 dark:bg-bloodred/10 animate-ping opacity-75 scale-125 z-0"></div>
          <div className="absolute inset-0 rounded-full bg-crimson/10 dark:bg-crimson/5 animate-ping opacity-40 scale-150 delay-700 z-0"></div>
        </div>

        {/* Text and Branding */}
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-bloodred via-crimson to-gray-800 dark:to-gray-100 bg-clip-text text-transparent mb-3">
          BloodBridge AI
        </h1>
        <p className="text-sm font-semibold text-bloodred tracking-widest uppercase mb-12">
          Smart Emergency Blood Matching
        </p>

        {/* Premium Loading Progress Bar */}
        <div className="w-48 h-1 bg-gray-200/80 dark:bg-gray-800 rounded-full overflow-hidden mb-4 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-bloodred to-crimson rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Securing emergency gateway connection...
        </p>
      </div>

    </div>
  );
};

export default SplashScreen;
