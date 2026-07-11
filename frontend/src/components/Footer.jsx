import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiTwitter, FiLinkedin, FiUsers, FiPlus, FiZap } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#0B0F19] text-white border-t border-gray-900 relative overflow-hidden text-left font-sans">
        {/* Background glow styling */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#E11D48]/5 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-12">
          {/* Top Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            
            {/* Brand/Platform Column */}
            <div className="lg:col-span-4 flex flex-col items-start">
              <Link to="/" className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#E11D48] flex items-center justify-center shadow-md">
                  <span className="text-xl">🩸</span>
                </div>
                <div>
                  <span className="font-extrabold text-white text-xl tracking-tight block leading-tight">
                    Blood<span className="text-[#E11D48]">Bridge</span>
                  </span>
                  <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase block mt-0.5">AI Emergency Platform</span>
                </div>
              </Link>

              <p className="text-gray-400 text-xs leading-relaxed mb-6 max-w-sm">
                Saving lives at the intersection of AI and emergency medicine. Connecting donors, hospitals, and blood banks in real time.
              </p>

              {/* Status Metrics Strip */}
              <div className="flex flex-wrap gap-5 mb-8">
                
                {/* Metric 1 */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#E11D48]/10 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                    <FiUsers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white block leading-none">12,400+</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Active Donors</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center flex-shrink-0">
                    <FiPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white block leading-none">1,200+</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Hospitals</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <FiZap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-white block leading-none">&lt;45s</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Avg. Response Time</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Platform Column */}
            <div className="lg:col-span-2 col-span-4 lg:pl-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Platform</h4>
              <ul className="space-y-3">
                {['How It Works', 'For Hospitals', 'For Donors', 'AI Matching'].map(item => (
                  <li key={item}>
                    <a href="#features" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="lg:col-span-2 col-span-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'API Reference', 'Blood Compatibility', 'Safety Guidelines'].map(item => (
                  <li key={item}>
                    <a href="#faq" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div className="lg:col-span-2 col-span-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Impact Report', 'Press Kit', 'Careers'].map(item => (
                  <li key={item}>
                    <a href="#workflow" className="text-gray-400 hover:text-white text-xs font-semibold transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="lg:col-span-2 col-span-4">
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Follow Us</h4>
              <div className="flex gap-2.5">
                {[
                  { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
                  { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                  { icon: FiMail, href: 'mailto:support@bloodbridge.ai', label: 'Email' }
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-slate-900 border border-gray-800 hover:border-[#E11D48] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#E11D48]/10 text-gray-400 hover:text-[#E11D48]"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Divider & Bottom Row */}
          <div className="border-t border-gray-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p className="text-gray-500 font-medium">
              &copy; {year} BloodBridge AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-500">
              <a href="#contact" className="hover:text-white transition-colors font-medium">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#contact" className="hover:text-white transition-colors font-medium">Terms of Service</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating help / support button fixed bottom right */}
      <button
        onClick={() => {
          const contactSec = document.getElementById('contact');
          if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#E11D48] hover:bg-crimson rounded-full shadow-lg hover:shadow-xl hover:shadow-rose-500/20 flex items-center justify-center text-white cursor-pointer z-50 transition-all duration-300 hover:scale-110 active:scale-95 group animate-[bounce_3s_infinite]"
        aria-label="Contact support team"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </>
  );
};

export default Footer;
