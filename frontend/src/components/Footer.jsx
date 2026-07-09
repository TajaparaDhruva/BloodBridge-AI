import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiMail, FiGlobe, FiTwitter, FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Platform',
      links: [
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'For Hospitals', href: '#hospitals' },
        { label: 'For Donors', href: '#donors' },
        { label: 'AI Matching', href: '#ai' },
        { label: 'Emergency Map', href: '/dashboard' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Blood Compatibility', href: '#' },
        { label: 'Safety Guidelines', href: '#' },
        { label: 'Research Papers', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Impact Report', href: '#' },
        { label: 'Press Kit', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-slate dark:bg-darkbg border-t border-white/05 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-bloodred/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-aiblue/5 blur-3xl" />
      </div>

      <div className="container-bb relative z-10 pt-16 pb-8">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bloodred-light to-bloodred-dark flex items-center justify-center shadow-md">
                <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2.5C12 2.5 5.5 9.5 5.5 14.5C5.5 18.0899 8.41015 21 12 21C15.5899 21 18.5 18.0899 18.5 14.5C18.5 9.5 12 2.5 12 2.5Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9 14.5C10.2 13 11.4 13 12.2 14.5C13 16 14.2 16 15.4 14.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-white text-xl tracking-tight">
                  Blood<span className="text-bloodred-light">Bridge</span>
                </span>
                <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">AI Emergency Platform</p>
              </div>
            </Link>

            <p className="text-white/50 text-[14px] leading-relaxed mb-6 max-w-xs">
              Saving lives at the intersection of AI and emergency medicine. Connecting donors, hospitals, and blood banks in real time.
            </p>

            {/* Live Stats Strip */}
            <div className="flex gap-4 mb-6">
              {[
                { label: 'Lives Saved', value: '12,400+' },
                { label: 'Hospitals', value: '1,200+' },
                { label: 'Match Time', value: '<45s' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-extrabold text-white text-lg leading-none">{s.value}</p>
                  <p className="text-white/35 text-[10px] font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex gap-2">
              {[
                { icon: FiTwitter, href: '#', label: 'Twitter' },
                { icon: FiGithub, href: '#', label: 'GitHub' },
                { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
                { icon: FiMail, href: 'mailto:team@bloodbridge.ai', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/05 hover:bg-white/10 border border-white/08 hover:border-white/15 flex items-center justify-center transition-all"
                >
                  <Icon className="w-4 h-4 text-white/50 hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-white/80 font-bold text-[12px] uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/45 hover:text-white text-[13px] font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/06 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-[12px]">
            © {year} BloodBridge AI. All rights reserved.
          </p>
          <p className="text-white/25 text-[12px] flex items-center gap-1.5">
            Built with <FiHeart className="w-3 h-3 text-bloodred animate-heartbeat" /> for humanity
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance'].map(t => (
              <a key={t} href="#" className="text-white/30 hover:text-white/60 text-[11px] transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
