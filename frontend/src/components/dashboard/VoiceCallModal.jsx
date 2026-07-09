import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPhoneOff, FiMic, FiMicOff, FiVolume2, FiVolumeX, 
  FiGrid, FiUserPlus, FiPause, FiPlay, FiBookOpen, FiActivity 
} from 'react-icons/fi';

const VOICE_RESPONSES = [
  {
    keywords: ['o+', 'o positive', 'ओ पॉजिटिव', 'ओ प्लस', 'o+'],
    en: 'Hey! I scanned the area and found 12 active O-positive donors nearby. Deepak Nair is closest and can reach you in about 18 minutes. Would you like me to send him an emergency alert right now?',
    hi: 'सुनो दोस्त, मैंने अभी चेक किया और पास में बारह O-पॉजिटिव डोनर मिले हैं। सबसे पास दीपक नायर हैं जो सिर्फ अठारह मिनट में पहुँच सकते हैं। क्या मैं उन्हें अभी रिक्वेस्ट भेज दूँ?'
  },
  {
    keywords: ['o-', 'o negative', 'ओ नेगेटिव', 'ओ माइनस', 'o-'],
    en: 'Oh, O-Negative is a really rare blood group! We only have 3 active donors close by right now. I highly recommend sending out an emergency alert to everyone within 20 km. Should we do it?',
    hi: 'अरे भाई, O-नेगेटिव तो बहुत ही दुर्लभ ब्लड ग्रुप है! अभी हमारे पास सिर्फ तीन डोनर ही एक्टिव हैं। मैं तो कहूँगा कि बिना देरी किए बीस किमी के दायरे में सभी ओ-नेगेटिव डोनर्स को इमरजेंसी अलर्ट भेज देते हैं। क्या कहते हो, भेज दें?'
  },
  {
    keywords: ['hospital', 'hospitals', 'nearest hospital', 'अस्पताल', 'हॉस्पिटल', 'दवाखाना', 'hospital kahan hai'],
    en: 'Sure! Metro Critical Care Hospital is super close—just 1.2 km away, which is about a 4-minute drive. They have a full emergency unit and blood bank ready. Do you need GPS directions?',
    hi: 'हाँ बिल्कुल! मेट्रो क्रिटिकल केयर अस्पताल बिल्कुल पास में है—सिर्फ एक पॉइंट दो किलोमीटर दूर, गाड़ी से लगभग चार मिनट लगेंगे। वहाँ इमरजेंसी वार्ड और ब्लड बैंक दोनों तैयार हैं। रास्ता दिखाऊँ?'
  },
  {
    keywords: ['inventory', 'stock', 'depot', 'blood group inventory', 'खून', 'स्टॉक', 'इन्वेंटरी', 'kitna blood hai'],
    en: "Here's the current stock status: O+, A+, and B+ are looking good, but we are running low on AB+ with 19 units. O-negative has 5 units and AB-negative has 3 units, which is critically low. We need to restock those soon!",
    hi: 'अभी स्टॉक की हालत यह है: ओ-पॉजिटिव, ए-पॉजिटिव, और बी-पॉजिटिव तो ठीक-ठाक हैं, लेकिन एबी-पॉजिटिव उन्नीस यूनिट के साथ थोड़ा कम है। ओ-नेगेटिव में पांच यूनिट और एबी-नेगेटिव में केवल तीन यूनिट ही बची हैं। हमें इनका इंतजाम जल्दी करना होगा!'
  },
  {
    keywords: ['hello', 'hi', 'hey', 'kaise ho', 'kem cho', 'हेलो', 'हाय'],
    en: "Hey there, my friend! I am doing great, thank you. Welcome to BloodBridge emergency voice dispatch. How are you doing? How is the emergency situation over there?",
    hi: "हेलो दोस्त! मैं बिल्कुल ठीक हूँ, पूछने के लिए धन्यवाद। ब्लडब्रिज इमरजेंसी वॉइस डिस्पैच में आपका स्वागत है। आप कैसे हैं? वहाँ आपातकालीन स्थिति कैसी है?"
  },
  {
    keywords: ['thank you', 'thanks', 'shukriya', 'dhanyawad', 'aabhar', 'धन्यवाद', 'शुक्रिया'],
    en: "You're welcome, my friend! I'm always glad to help. Please stay safe and let me know if you need any other assistance.",
    hi: "आपका स्वागत है मेरे दोस्त! मुझे आपकी मदद करके बहुत खुशी हुई। सुरक्षित रहें और यदि कोई और जरूरत हो तो बताएं।"
  },
  {
    keywords: ['help', 'madad', 'tum kya karte ho', 'help me', 'मदद'],
    en: "I am your BloodBridge operations voice supervisor. I can call active donors, search for nearby hospitals, or check our current inventory stock. Just tell me what you need!",
    hi: "मैं आपका ब्लडब्रिज वॉइस सुपरवाइजर हूँ। मैं आपके लिए रक्तदाता ढूंढ सकता हूँ, नजदीकी अस्पताल का पता लगा सकता हूँ या स्टॉक चेक कर सकता हूँ। आप मुझे बताएं कि आपको क्या चाहिए।"
  },
  {
    keywords: ['ahmedabad', 'gujarat', 'अहमदाबाद', 'અમદાવાદ', 'ahmedabad hospitals', 'nearest hospital in ahmedabad'],
    en: "Ah, Ahmedabad! SVP Institute, SAL Hospital, and Zydus Hospital are fully active near you. We also have O-positive and O-negative donors on standby. Should I initiate an emergency callout?",
    hi: "अहमदाबाद में हमारा नेटवर्क पूरी तरह तैयार है! आपके पास एसवीपी, साल हॉस्पिटल, और जाइडस हॉस्पिटल सक्रिय हैं। शहर में ओ-पॉजिटिव और ओ-नेगेटिव डोनर्स भी स्टैंडबाय पर हैं। क्या मैं उन्हें अलर्ट करूँ?"
  }
];

const DEFAULT_RESPONSE = {
  en: "I'm listening closely, my friend. Tell me if you want to find an O-positive donor, locate a hospital, or check our current blood depot inventory.",
  hi: "मैं ध्यान से सुन रहा हूँ मेरे दोस्त। मुझे बताएं कि क्या आप ओ-पॉजिटिव डोनर ढूंढना चाहते हैं, अस्पताल का पता लगाना चाहते हैं, या स्टॉक चेक करना चाहते हैं।"
};

const VoiceCallModal = ({ hospitalName, number, onClose }) => {
  const [callState, setCallState] = useState('dialing'); // dialing | ringing | connected | ended
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [statusMessage, setStatusMessage] = useState('Calling...');
  const [toastMessage, setToastMessage] = useState('');
  const [userTranscript, setUserTranscript] = useState('');
  const [operatorSpeech, setOperatorSpeech] = useState('');

  const ringToneRef = useRef(null);
  const recognitionRef = useRef(null);
  const durationIntervalRef = useRef(null);

  const callStateRef = useRef(callState);
  const isMutedRef = useRef(isMuted);
  const isOnHoldRef = useRef(isOnHold);
  const isSpeakingRef = useRef(false);

  // Keep refs in sync with state updates
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    isOnHoldRef.current = isOnHold;
  }, [isOnHold]);

  // Trigger a brief screen toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Find a natural premium voice
  const getNaturalVoice = (lang, isHindi) => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    let selected = null;
    if (isHindi) {
      selected = voices.find(v => v.lang.startsWith('hi') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')));
      if (!selected) selected = voices.find(v => v.lang.startsWith('hi'));
    } else {
      selected = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Microsoft')));
      if (!selected) selected = voices.find(v => v.lang.startsWith('en'));
    }
    return selected;
  };

  // Play synthetic telephone ring tone using Web Audio API
  const startRingTone = () => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.value = 440;
      osc2.frequency.value = 480;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(0);
      osc2.start(0);
      
      let ringOn = true;
      const interval = setInterval(() => {
        if (ringOn) {
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + 1.6);
          gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8);
        }
        ringOn = !ringOn;
      }, 2000);
      
      ringToneRef.current = {
        stop: () => {
          clearInterval(interval);
          osc1.stop();
          osc2.stop();
          ctx.close();
        }
      };
    } catch (e) {
      console.log('Audio Context ringtone init failed:', e);
    }
  };

  // Initialize Web Speech Recognition
  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'hi-IN'; // Recognizes Hindi/English/Hinglish mixed speech fluently
    
    rec.onstart = () => {
      setIsListening(true);
      setStatusMessage('Listening (Speak Now)...');
    };
    
    rec.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setUserTranscript(speechToText);
      handleUserInput(speechToText);
    };
    
    rec.onerror = (e) => {
      console.log('Speech recognition error:', e.error);
      setIsListening(false);
      if (callStateRef.current === 'connected' && !isOnHoldRef.current && !isMutedRef.current) {
        setStatusMessage('Call Active');
      }
      
      // Auto-restart listening instantly
      if (callStateRef.current === 'connected' && !isMutedRef.current && !isOnHoldRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (callStateRef.current === 'connected' && !isMutedRef.current && !isOnHoldRef.current && !isSpeakingRef.current) {
            startListening();
          }
        }, 50);
      }
    };
    
    rec.onend = () => {
      setIsListening(false);
      if (callStateRef.current === 'connected' && !isOnHoldRef.current && !isMutedRef.current) {
        setStatusMessage('Call Active');
      }
      
      // Auto-restart listening instantly
      if (callStateRef.current === 'connected' && !isMutedRef.current && !isOnHoldRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (callStateRef.current === 'connected' && !isMutedRef.current && !isOnHoldRef.current && !isSpeakingRef.current) {
            startListening();
          }
        }, 50);
      }
    };
    
    recognitionRef.current = rec;
  };

  const startListening = () => {
    if (isMutedRef.current || isOnHoldRef.current) return;
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.log('Recognition start error:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition stop error:', e);
      }
    }
  };

  // Speaks AI message using browser speechSynthesis
  const speakOutput = (text, isHindi) => {
    if (!('speechSynthesis' in window) || !isSpeakerOn) return;
    
    // Set states synchronously to avoid microphone capture race conditions
    isSpeakingRef.current = true;
    stopListening();
    setStatusMessage('Operator Speaking...');
    setOperatorSpeech(text);
    setUserTranscript('');
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voice = getNaturalVoice(isHindi ? 'hi' : 'en', isHindi);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = isHindi ? 0.95 : 1.0; 
    utterance.pitch = 1.05; // Slightly adjusted for clear, friendly human tone
    
    utterance.onstart = () => {
      isSpeakingRef.current = true;
      stopListening();
      setStatusMessage('Operator Speaking...');
    };
    
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setStatusMessage('Call Active');
      // Automatically resume listening to create a continuous conversation
      if (callStateRef.current === 'connected' && !isMutedRef.current && !isOnHoldRef.current) {
        startListening();
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Process inputs
  const handleUserInput = (inputText) => {
    if (!inputText.trim()) return;
    
    // Detect Language - robust Hinglish & Hindi detection
    const lower = inputText.toLowerCase();
    const hindiRegex = /[\u0900-\u097F]/;
    const isHindiText = hindiRegex.test(inputText) || 
      [
        'chahiye', 'kaha', 'karon', 'bhejo', 'bhai', 'dost', 'hai', 'hain', 'madad', 'mil', 
        'donor', 'hospital', 'stock', 'aabhar', 'shukriya', 'dhanyawad', 'nathi', 'lohe',
        'aap', 'tum', 'mera', 'ho', 'kya', 'ko', 'se', 'batao', 'suno', 'bol', 'kaise', 
        'namaste', 'alvida', 'achha', 'theek', 'karo', 'kar', 'raha', 'rahi', 'he', 'ki', 
        'ka', 'ke', 'aur', 'ya', 'na', 'ne', 'par', 'bhi', 'hi', 'to', 'toh', 'apko', 'tumko'
      ].some(w => lower.includes(w));
    
    // Find Response
    let match = null;
    for (const r of VOICE_RESPONSES) {
      if (r.keywords.some(k => lower.includes(k))) {
        match = r;
        break;
      }
    }
    
    const replyText = match 
      ? (isHindiText ? match.hi : match.en) 
      : (isHindiText ? DEFAULT_RESPONSE.hi : DEFAULT_RESPONSE.en);
    
    speakOutput(replyText, isHindiText);
  };

  // Toggle Mute State
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    isMutedRef.current = nextMute;
    if (nextMute) {
      stopListening();
      setStatusMessage('Microphone Muted');
      triggerToast('Microphone Muted');
    } else {
      setStatusMessage('Call Active');
      triggerToast('Microphone Unmuted');
      if (callStateRef.current === 'connected' && !isOnHoldRef.current) {
        startListening();
      }
    }
  };

  // Toggle Speaker State
  const toggleSpeaker = () => {
    const nextSpeaker = !isSpeakerOn;
    setIsSpeakerOn(nextSpeaker);
    if (!nextSpeaker) {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      triggerToast('Speaker Muted');
    } else {
      triggerToast('Speaker Active');
      // Speak last greeting or reply to notify speaker is back
      speakOutput("Speaker is active.", false);
    }
  };

  // Toggle Hold State
  const toggleHold = () => {
    const nextHold = !isOnHold;
    setIsOnHold(nextHold);
    isOnHoldRef.current = nextHold;
    if (nextHold) {
      stopListening();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      setStatusMessage('Call On Hold');
      triggerToast('Call On Hold');
    } else {
      setStatusMessage('Call Active');
      triggerToast('Call Resumed');
      durationIntervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      startListening();
    }
  };

  // State transitions: Dialing -> Ringing -> Connected
  useEffect(() => {
    initSpeechRecognition();
    
    // Load voices
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }

    // Dialing phase
    const dialingTimeout = setTimeout(() => {
      setCallState('ringing');
      setStatusMessage('Ringing...');
      startRingTone();
      
      // Ringing phase
      const ringingTimeout = setTimeout(() => {
        if (ringToneRef.current) ringToneRef.current.stop();
        setCallState('connected');
        callStateRef.current = 'connected';
        setStatusMessage('Call Active');
        
        // Start duration counter
        durationIntervalRef.current = setInterval(() => {
          setDuration(prev => prev + 1);
        }, 1000);
        
        // Welcome Greeting spoken naturally
        const greeting = "Hello, this is BloodBridge emergency voice dispatch. How can I help you today?";
        speakOutput(greeting, false);
      }, 3000);
      
      return () => clearTimeout(ringingTimeout);
    }, 1500);

    return () => {
      clearTimeout(dialingTimeout);
      if (ringToneRef.current) ringToneRef.current.stop();
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      stopListening();
    };
  }, []);

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const txt = textInput;
    setTextInput('');
    handleUserInput(txt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      
      {/* Real-like Phone Calling Screen Card */}
      <motion.div
        className="relative z-10 w-full max-w-sm rounded-[42px] overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-white/10 text-white flex flex-col justify-between p-7"
        style={{ height: '620px' }}
        initial={{ scale: 0.9, opacity: 0, y: 35 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 35 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
      >
        {/* Toast Toast Notifications */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 border border-white/15 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase px-4 py-2 rounded-full shadow-lg z-50 whitespace-nowrap"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Section */}
        <div className="text-center pt-8">
          <p className="text-[11px] font-bold text-gray-400/90 tracking-widest uppercase">Emergency Voice Link</p>
          <h2 className="font-extrabold text-[22px] tracking-tight mt-2.5 truncate">{hospitalName || 'Emergency Support'}</h2>
          <p className="text-xs text-gray-400 font-bold tracking-wider mt-1">{number || '+91 22 9876 5432'}</p>
          
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/03 border border-white/05 text-[11px] font-bold tracking-wide">
            <span className={`w-2 h-2 rounded-full ${
              callState === 'connected' 
                ? (isOnHold ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse') 
                : 'bg-amber-500'
            }`} />
            <span>
              {callState === 'connected' 
                ? (isOnHold ? 'Call On Hold' : `Connected · ${formatDuration(duration)}`) 
                : statusMessage
              }
            </span>
          </div>
        </div>

        {/* Central Pulsing Calling Avatar (No text display logs!) */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="relative flex items-center justify-center">
            {callState === 'connected' && !isOnHold && (
              <>
                <motion.span 
                  className="absolute w-36 h-36 rounded-full bg-emerald-500/05 border border-emerald-500/10" 
                  animate={{ scale: [1, 1.4, 1] }} 
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.span 
                  className="absolute w-28 h-28 rounded-full bg-emerald-500/10" 
                  animate={{ scale: [1, 1.25, 1] }} 
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                />
              </>
            )}
            {callState === 'ringing' && (
              <span className="absolute w-28 h-28 rounded-full bg-amber-500/10 animate-ping" />
            )}
            
            <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${
              callState === 'connected' 
                ? (isOnHold ? 'from-amber-400 to-amber-600' : 'from-emerald-400 to-teal-600') 
                : 'from-slate-700 to-slate-800'
            } flex items-center justify-center text-[32px] font-black shadow-2xl relative z-10 select-none border border-white/10`}>
              {hospitalName ? hospitalName.charAt(0) : 'E'}
            </div>
          </div>
          
          {/* Micro-activity label (Listening/Speaking/Active status) */}
          <div className="h-6 mt-6 flex items-center justify-center">
            {callState === 'connected' && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                {isListening && <FiActivity className="w-3.5 h-3.5 animate-pulse" />}
                <span>{statusMessage}</span>
              </div>
            )}
          </div>

          {/* Live Captioning Feed */}
          {callState === 'connected' && (
            <div className="px-4 py-2 w-full text-center space-y-2 mt-4 select-none max-h-24 overflow-y-auto custom-scrollbar">
              {userTranscript && (
                <motion.p 
                  className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 p-2.5 rounded-2xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  " {userTranscript} "
                </motion.p>
              )}
              {operatorSpeech && !userTranscript && (
                <motion.p 
                  className="text-[11px] font-semibold text-gray-300 bg-white/05 border border-white/05 p-2.5 rounded-2xl leading-relaxed italic"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {operatorSpeech}
                </motion.p>
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Controls */}
        <div className="space-y-6 pb-6">
          {/* 2x3 Classic Phone Calling Grid */}
          {callState === 'connected' && (
            <div className="grid grid-cols-3 gap-y-5 gap-x-6 justify-items-center px-4">
              {/* Mute Control */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isMuted 
                      ? 'bg-white text-slate-900 border border-white' 
                      : 'bg-white/05 hover:bg-white/10 border border-white/10 text-white'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
                </button>
                <span className="text-[10px] text-gray-400 font-bold tracking-wide">Mute</span>
              </div>

              {/* Keypad Toggle Control */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setShowKeypad(prev => !prev)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    showKeypad 
                      ? 'bg-white text-slate-900 border border-white' 
                      : 'bg-white/05 hover:bg-white/10 border border-white/10 text-white'
                  }`}
                  title="Toggle Keypad Text Input"
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <span className="text-[10px] text-gray-400 font-bold tracking-wide">Keypad</span>
              </div>

              {/* Speaker Toggle Control */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={toggleSpeaker}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isSpeakerOn 
                      ? 'bg-white/05 hover:bg-white/10 border border-white/10 text-white' 
                      : 'bg-white text-slate-900 border border-white'
                  }`}
                  title={isSpeakerOn ? 'Mute speaker' : 'Unmute speaker'}
                >
                  {isSpeakerOn ? <FiVolume2 className="w-5 h-5" /> : <FiVolumeX className="w-5 h-5" />}
                </button>
                <span className="text-[10px] text-gray-400 font-bold tracking-wide">Speaker</span>
              </div>

              {/* Add Call (Simulated Feature) */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => triggerToast('Live network add-call pending')}
                  className="w-12 h-12 rounded-full bg-white/05 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                  title="Add Call"
                >
                  <FiUserPlus className="w-5 h-5" />
                </button>
                <span className="text-[10px] text-gray-400/50 font-bold tracking-wide">Add Call</span>
              </div>

              {/* Hold Call Control */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={toggleHold}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    isOnHold 
                      ? 'bg-white text-slate-900 border border-white' 
                      : 'bg-white/05 hover:bg-white/10 border border-white/10 text-white'
                  }`}
                  title={isOnHold ? 'Resume call' : 'Hold call'}
                >
                  {isOnHold ? <FiPlay className="w-5 h-5" /> : <FiPause className="w-5 h-5" />}
                </button>
                <span className="text-[10px] text-gray-400 font-bold tracking-wide">Hold</span>
              </div>

              {/* Contacts (Simulated) */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => triggerToast('Emergency contacts list active')}
                  className="w-12 h-12 rounded-full bg-white/05 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                  title="Contacts"
                >
                  <FiBookOpen className="w-5 h-5" />
                </button>
                <span className="text-[10px] text-gray-400/50 font-bold tracking-wide">Contacts</span>
              </div>
            </div>
          )}

          {/* Keypad Text Input Fallback (Toggled on/off) */}
          <AnimatePresence>
            {showKeypad && callState === 'connected' && (
              <motion.form
                onSubmit={handleTextSubmit}
                className="flex gap-2 bg-white/05 border border-white/10 rounded-2xl p-1.5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type message text..."
                  className="flex-1 bg-transparent border-none text-xs outline-none px-3.5 py-1 text-white placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  Send
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Hang Up Button Row */}
          <div className="flex justify-center pt-2">
            <button
              onClick={onClose}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 active:scale-95 flex items-center justify-center text-white shadow-xl shadow-red-950/30 transition-all cursor-pointer border border-red-400/20"
              title="Hang Up Call"
            >
              <FiPhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VoiceCallModal;
