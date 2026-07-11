import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FiCheckCircle, FiArrowRight, FiArrowLeft, FiUser, FiMail, FiPhone, FiBriefcase, 
  FiMessageSquare, FiMapPin, FiCalendar, FiClock, FiShield, 
  FiZap, FiPieChart, FiMonitor, FiLock, FiStar, FiGrid 
} from 'react-icons/fi';

const HIGHLIGHTS = [
  { icon: FiZap, title: 'Live AI Donor Matching', desc: 'See how our neural network finds donors in <45s.' },
  { icon: FiMonitor, title: 'Dashboard Walkthrough', desc: 'Experience the real-time hospital command center.' },
  { icon: FiPieChart, title: 'Analytics & Reporting', desc: 'Understand blood inventory trends and predictions.' },
  { icon: FiGrid, title: 'Subscription Plans', desc: 'Find the right tier for your hospital\'s scale.' },
];

const TRUST_INDICATORS = [
  { icon: FiClock, text: '30-Minute Personalized Demo' },
  { icon: FiStar, text: 'Free Consultation' },
  { icon: FiShield, text: 'No Setup Required' },
  { icon: FiLock, text: 'Secure & Confidential' },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

const HOSPITAL_TYPES = [
  'Government Hospital',
  'Private Hospital',
  'Multi-Specialty Clinic',
  'Blood Bank',
  'Other'
];

const ScheduleDemo = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    contactName: '',
    email: '',
    mobile: '',
    hospitalType: '',
    cityState: '',
    beds: '',
    demoDate: '',
    demoTime: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-offwhite dark:bg-[#0F172A] font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-bloodred/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/4"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="booking-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10"
              >
                {/* ── Left Column: Value Prop ───────────────────────────────── */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <Link to="/hospital-partnership" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-6 group">
                      <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Back to Hospital Partnership
                    </Link>
                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                      Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloodred to-rose-500">BloodBridge AI</span>
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      Book a personalized 1-on-1 walkthrough with our product experts and see how we can transform your emergency blood supply chain.
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">What we'll cover</h3>
                    <div className="grid grid-cols-1 gap-5">
                      {HIGHLIGHTS.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-sm">
                          <div className="w-8 h-8 rounded-xl bg-bloodred/10 dark:bg-bloodred/20 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-4 h-4 text-bloodred dark:text-rose-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-[15px] mb-1">{item.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="grid grid-cols-2 gap-4">
                      {TRUST_INDICATORS.map((indicator, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <indicator.icon className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{indicator.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Right Column: The Form ────────────────────────────────── */}
                <div className="lg:col-span-7">
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-slate-700/60 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Request Demo Access</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        
                        {/* Hospital Name */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Hospital / Organization Name *</label>
                          <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              name="hospitalName"
                              value={formData.hospitalName}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all text-sm"
                              placeholder="e.g. Apollo City Hospital"
                            />
                          </div>
                        </div>

                        {/* Contact Name */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Contact Person *</label>
                          <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              name="contactName"
                              value={formData.contactName}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all text-sm"
                              placeholder="Dr. John Doe"
                            />
                          </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mobile Number *</label>
                          <div className="relative">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="tel"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all text-sm"
                              placeholder="+91 9876543210"
                            />
                          </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Work Email Address *</label>
                          <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all text-sm"
                              placeholder="director@hospital.com"
                            />
                          </div>
                        </div>

                        {/* Hospital Type */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Hospital Type *</label>
                          <div className="relative">
                            <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                              name="hospitalType"
                              value={formData.hospitalType}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all appearance-none cursor-pointer text-sm"
                            >
                              <option value="" disabled className="text-slate-400">Select Type</option>
                              {HOSPITAL_TYPES.map(type => <option key={type} value={type} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{type}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* City & State */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">City & State *</label>
                          <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              name="cityState"
                              value={formData.cityState}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all text-sm"
                              placeholder="e.g. Mumbai, MH"
                            />
                          </div>
                        </div>

                        {/* Preferred Date */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Preferred Date *</label>
                          <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                              type="date"
                              name="demoDate"
                              min={minDate}
                              value={formData.demoDate}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all cursor-pointer text-sm"
                            />
                          </div>
                        </div>

                        {/* Preferred Time */}
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Preferred Time *</label>
                          <div className="relative">
                            <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                              name="demoTime"
                              value={formData.demoTime}
                              onChange={handleChange}
                              required
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all appearance-none cursor-pointer text-sm"
                            >
                              <option value="" disabled className="text-slate-400">Select Time</option>
                              {TIME_SLOTS.map(time => <option key={time} value={time} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">{time}</option>)}
                            </select>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Requirements / Message (Optional)</label>
                          <div className="relative">
                            <FiMessageSquare className="absolute left-4 top-4 text-slate-400" />
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows="3"
                              className="w-full pl-11 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-bloodred outline-none text-slate-900 dark:text-white transition-all resize-none text-sm"
                              placeholder="Any specific features you want to focus on?"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white text-[14px] font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></div>
                          ) : (
                            <>
                              Confirm Demo Booking
                              <FiArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </button>
                        <p className="text-center text-xs text-slate-500 mt-4">
                          By booking a demo, you agree to our Terms of Service and Privacy Policy.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/40 dark:border-slate-700/60 p-10 md:p-14 rounded-[3rem] shadow-2xl">
                  
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <FiCheckCircle className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                    Demo Scheduled Successfully!
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                    Thank you, <span className="font-bold text-slate-900 dark:text-white">{formData.contactName}</span>. A BloodBridge AI representative will contact you shortly to confirm your demo.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 mb-10 border border-slate-100 dark:border-slate-700/50 text-left">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                      <FiCalendar className="text-bloodred" /> Your Demo Details
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">HOSPITAL</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{formData.hospitalName}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">DATE</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{new Date(formData.demoDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">TIME</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{formData.demoTime}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-1">CONTACT EMAIL</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg truncate">{formData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => navigate('/')}
                      className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[15px] font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Return to Home
                    </button>
                    <button 
                      onClick={() => navigate('/hospital-partnership')}
                      className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-[15px] font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Explore Features
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ScheduleDemo;
