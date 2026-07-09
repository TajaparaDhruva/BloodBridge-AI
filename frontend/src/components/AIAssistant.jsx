import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiZap } from 'react-icons/fi';

const AI_RESPONSES = {
  'o+ donor': {
    type: 'result',
    en: 'Hey! I just scanned the area and found 12 O+ donors nearby. Deepak Nair (97% match) is closest and can reach in about 18 minutes. Do you want me to ping him for you?',
    hi: 'अरे सुनो! मैंने अभी चेक किया और पास में 12 O+ डोनर मिले हैं। सबसे बेस्ट मैच दीपक नायर (97% मैच) हैं जो सिर्फ 18 मिनट में पहुँच सकते हैं। क्या मैं उन्हें इमरजेंसी मैसेज भेज दूँ?',
    gu: 'અરે મિત્ર! મેં હમણાં જ તપાસ કરી અને નજીકમાં 12 O+ દાતાઓ મળ્યા છે. સૌથી નજીક દીપક નાયર (97% મેચ) છે જે ફક્ત 18 મિનિટમાં પહોંચી શકે છે. શું હું તેમને ઈમરજન્સી મેસેજ મોકલી દઉં?',
    mr: 'अरे मित्रा! मी आताच चेक केले आणि जवळ 12 O+ डोनर्स सापडले आहेत. सर्वात जवळ दीपक नायर (97% मॅच) आहे जो फक्त 18 मिनिटांत पोहोचू शकतो. मी त्याला इमर्जन्सी मेसेज पाठवू का?'
  },
  'donor': {
    type: 'result',
    en: 'Hey! I just scanned the area and found 12 O+ donors nearby. Deepak Nair (97% match) is closest and can reach in about 18 minutes. Do you want me to ping him for you?',
    hi: 'अरे सुनो! मैंने अभी चेक किया और पास में 12 O+ डोनर मिले हैं। सबसे बेस्ट मैच दीपक नायर (97% मैच) हैं जो सिर्फ 18 मिनट में पहुँच सकते हैं। क्या मैं उन्हें इमरजेंसी मैसेज भेज दूँ?',
    gu: 'અરે મિત્ર! મેં હમણાં જ તપાસ કરી અને નજીકમાં 12 O+ દાતાઓ મળ્યા છે. સૌથી નજીક દીપક નાયર (97% મેચ) છે જે ફક્ત 18 મિનિટમાં પહોંચી શકે છે. શું હું તેમને ઈમરજન્સી મેસેજ મોકલી દઉં?',
    mr: 'अरे मित्रा! मी आताच चेक केले आणि जवळ 12 O+ डोनर्स सापडले आहेत. सर्वात जवळ दीपक नायर (97% मॅच) आहे जो फक्त 18 मिनिटांत पोहोचू शकतो. मी त्याला इमर्जन्सी मेसेज पाठवू का?'
  },
  'o-': {
    type: 'warning',
    en: 'Oh, O-Negative is a really rare blood group! We only have 3 donors close by right now. I highly recommend sending out an emergency alert to everyone within 20 km. Should we do it?',
    hi: 'अरे भाई, O-Negative तो बहुत ही दुर्लभ ब्लड ग्रुप है! अभी हमारे पास सिर्फ 3 डोनर ही एक्टिव हैं। मैं तो कहूँगा कि बिना देरी किए 20 किमी के दायरे में सभी O- डोनर्स को इमरजेंसी अलर्ट भेज देते हैं। क्या कहते हो, भेज दें?',
    gu: 'અરે ભાઈ, O-Negative તો બહુ જ રેર બ્લડ ગ્રુપ છે! અત્યારે નજીકમાં ફક્ત 3 દાતા જ ઉપલબ્ધ છે. હું સલાહ આપીશ કે 20 કિમીની અંદરના બધા O- દાતાઓને ઈમરજન્સી એલર્ટ મોકલી દઈએ. શું કરવું છે, મોકલી દઉં?',
    mr: 'अरे भावा, O-Negative तर खूपच दुर्मिळ ब्लड ग्रुप आहे! आपल्याकडे सध्या फक्त 3 डोनर्स उपलब्ध आहेत. मी म्हणेन की लगेच 20 किमीच्या आतील सर्व O- डोनर्सना इमर्जन्सी अलर्ट पाठवूया. काय करायचं, पाठवू का?'
  },
  'hospital': {
    type: 'result',
    en: 'Sure! Metro Critical Care Hospital is super close—just 1.2 km away, which is about a 4-minute drive. They have a full emergency unit and blood bank ready. Need directions?',
    hi: 'हाँ बिल्कुल! मेट्रो क्रिटिकल केयर अस्पताल बिल्कुल पास में है—सिर्फ 1.2 किमी दूर, गाड़ी से लगभग 4 मिनट लगेंगे। वहाँ इमरजेंसी वार्ड और ब्लड बैंक दोनों तैयार हैं। रास्ता दिखाऊँ?',
    gu: 'હા ચોક્કસ! મેટ્રો ક્રિટિકલ કેર હોસ્પિટલ એકદમ નજીક છે—ફક્ત 1.2 કિમી દૂર, ગાડીથી 4 મિનિટ લાગશે. ત્યાં ઈમરજન્સી અને બ્લડ બેંક બંને ચાલુ છે. રસ્તો બતાવું?',
    mr: 'हो नक्कीच! मेट्रो क्रिटिकल केअर हॉस्पिटल अगदी जवळ आहे—फक्त 1.2 किमी अंतरावर, गाडीने साधारण 4 मिनिटे लागतील. तिथे इमर्जन्सी आणि ब्लड बँक दोन्ही उपलब्ध आहे. मार्ग दाखवू का?'
  },
  'track': {
    type: 'track',
    en: "Don't worry, I'm tracking request REQ-101. The match is in progress, we've already reached out to 24 donors, and we should get a match in about 2 minutes. I've also turned on live GPS tracking for the dispatched donor!",
    hi: 'चिंता मत करो यार, मैं रिक्वेस्ट REQ-101 को ट्रैक कर रहा हूँ। अभी मैचिंग चल रही है और 24 डोनर्स से कांटेक्ट किया गया है। बस 2 मिनट में मैच मिल जाएगा। मैंने डोनर की लाइव जीपीएस ट्रैकिंग भी ऑन कर दी है!',
    gu: 'ચિંતા ન કર ભાઈ, હું રિકવેસ્ટ REQ-101 ને ટ્રેક કરી રહ્યો છું. મેચિંગ ચાલુ છે અને 24 દાતાઓનો સંપર્ક કરાયો છે. 2 મિનિટમાં મેચ મળી જશે. મેં દાતાનું લાઈવ જીપીએસ ટ્રેકિંગ પણ ચાલુ કરી દીધું છે!',
    mr: 'काळजी करू नकोस मित्रा, मी रिक्वेस्ट REQ-101 ट्रॅक करतोय. मॅचिंग सुरू आहे आणि 24 डोनर्सशी संपर्क साधला आहे. 2 मिनिटांत डोनर मिळेल. मी डोनरचे लाईव्ह जीपीएस ट्रॅकिंग देखील सुरू केले आहे!'
  },
  'how': {
    type: 'info',
    en: 'So, basically, I use smart mapping to scan for compatible donors near you. I look at their blood type, if they are eligible to donate, how close they are, and how fast they usually respond. Usually takes about 2 minutes to find a match!',
    hi: 'देखो भाई, मैं बहुत आसान तरीके से काम करता हूँ। आपके आसपास के डोनर्स को ढूंढने के लिए मैं दूरी, ब्लड ग्रुप मैच, और वे कितनी जल्दी जवाब देते हैं, ये सब देखता हूँ। आमतौर पर 2-3 मिनट में मैच मिल जाता है!',
    gu: 'જો ભાઈ, હું એકદમ સરળ રીતે કામ કરું છું. તમારા લોકેશનની આજુબાજુ યોગ્ય દાતા શોધવા માટે હું અંતર, બ્લડ ગ્રુપ અને તેમનો જૂનો રિસ્પોન્સ ચેક કરું છું. સામાન્ય રીતે 2 મિનિટમાં મેચ મળી જાય છે!',
    mr: 'बघ भावा, मी एकदम सोप्या पद्धतीने काम करतो. तुमच्या जवळचा सुसंगत डोनर शोधण्यासाठी मी अंतर, ब्लड ग्रुप मॅच आणि त्यांचा प्रतिसाद देण्याचा वेग चेक करतो. साधारण 2 मिनिटात मॅच मिळतो!'
  },
  'blood group': {
    type: 'result',
    en: "Here's the current stock status: O+, A+, and B+ are looking good, but we are running a bit low on AB+ (19 units) and O- (5 units), A- (8 units), AB- (3 units) are critically low. We need to restock those soon!",
    hi: 'अभी स्टॉक की हालत ये है: O+, A+, और B+ तो ठीक-ठाक हैं, लेकिन AB+ (19 यूनिट) थोड़ा कम है। और O- (5 यूनिट), A- (8 यूनिट), AB- (3 यूनिट) तो बिल्कुल खत्म होने वाले हैं। हमें इनका इंतजाम जल्दी करना होगा!',
    gu: 'અત્યારે સ્ટોકની સ્થિતિ આવી છે: O+, A+ અને B+ તો બરાબર છે, પણ AB+ (19 યુનિટ) થોડું ઓછું છે. O- (5 યુનિટ), A- (8 યુનિટ), AB- (3 યુનિટ) નો સ્ટોક તો સાવ ઓછો છે. આપણે જલ્દી વ્યવસ્થા કરવી પડશે!',
    mr: 'सध्या आपल्याकडे साठा असा आहे: O+, A+, आणि B+ ठीक आहेत, पण AB+ (19 युनिट्स) कमी आहे. आणि O- (5 युनिट्स), A- (8 युनिट्स), AB- (3 युनिट्स) चा साठा तर अत्यंत गंभीर पातळीवर आहे. आपल्याला याची लवकर सोय करावी लागेल!'
  },
  'inventory': {
    type: 'result',
    en: "Here's the current stock status: O+, A+, and B+ are looking good, but we are running a bit low on AB+ (19 units) and O- (5 units), A- (8 units), AB- (3 units) are critically low. We need to restock those soon!",
    hi: 'अभी स्टॉक की हालत ये है: O+, A+, और B+ तो ठीक-ठाक हैं, लेकिन AB+ (19 यूनिट) थोड़ा कम है। और O- (5 यूनिट), A- (8 यूनिट), AB- (3 यूनिट) तो बिल्कुल खत्म होने वाले हैं। हमें इनका इंतजाम जल्दी करना होगा!',
    gu: 'અત્યારે સ્ટોકની સ્થિતિ આવી છે: O+, A+ અને B+ તો બરાબર છે, પણ AB+ (19 યુનિટ) થોડું ઓછું છે. O- (5 યુનિટ), A- (8 યુનિટ), AB- (3 યુનિટ) નો સ્ટોક તો સાવ ઓછો છે. આપણે જલ્દી વ્યવસ્થા કરવી પડશે!',
    mr: 'सध्या आपल्याकडे साठा असा आहे: O+, A+, आणि B+ ठीक आहेत, पण AB+ (19 युनिट्स) कमी आहे. आणि O- (5 युनिट्स), A- (8 युनिट्स), AB- (3 युनिट्स) चा साठा तर अत्यंत गंभीर पातळीवर आहे. आपल्याला याची लवकर सोय करावी लागेल!'
  },
  'emergency': {
    type: 'emergency',
    en: "Emergency mode is on! I'm broadcasting alerts to all eligible donors within 10 km and letting the 3 nearest hospitals know. The closest donor should be there in 4 minutes. Stay strong!",
    hi: 'इमरजेंसी चालू कर दी गई है! 10 किमी के अंदर सभी योग्य डोनर्स को मैसेज भेज दिया है और 3 पास के अस्पतालों को भी अलर्ट कर दिया है। सबसे पास वाला डोनर 4 मिनट में पहुँच जाएगा। हौसला रखो!',
    gu: 'ઈમરજન્સી મોડ ચાલુ કરી દીધો છે! 10 કિમીની અંદરના બધા યોગ્ય દાતાઓને મેસેજ મોકલી દીધો છે અને 3 નજીકની હોસ્પિટલોને પણ એલર્ટ કરી દીધી છે. સૌથી નજીકનો દાતા 4 મિનિટમાં પહોંચી જશે. હિંમત રાખજે!',
    mr: 'इमर्जन्सी प्रोटोकॉल सुरू केला आहे! 10 किमीच्या आतील सर्व पात्र डोनर्सना मेसेज पाठवला आहे आणि जवळच्या 3 रुग्णालयांना अलर्ट केले आहे. सर्वात जवळचा डोनर 4 मिनिटांत पोहोचेल. धीर धर!'
  },
  'default': {
    type: 'info',
    en: "Hey there! I'm your BloodBridge AI friend. I can help you search for donors, find hospitals, track dispatches, or check inventory levels. Ask me anything, like 'find O+ donor' or 'track request'!",
    hi: "हेलो दोस्त! मैं आपका ब्लडब्रिज एआई मित्र हूँ। मैं डोनर्स ढूंढने, अस्पताल का पता लगाने, या स्टॉक चेक करने में आपकी मदद कर सकता हूँ। मुझसे बेझिझक कुछ भी पूछो, जैसे 'O+ डोनर ढूंढो' या 'हॉस्पिटल कहाँ है'!",
    gu: "કેમ છો દોસ્ત! હું તમારો બ્લડબ્રિજ AI મિત્ર છું. હું રક્તદાતા શોધવામાં, હોસ્પિટલ શોધવામાં કે સ્ટોક ચેક કરવામાં તમારી મદદ કરી શકું છું. મને ગમે તે પૂછો, જેમ કે 'O+ દાતા શોધો' કે 'હોસ્પિટલ ક્યાં છે'!",
    mr: "नमस्कार मित्रा! मी तुझा ब्लडब्रिज एआय मित्र आहे. मी तुला डोनर्स शोधायला, रुग्णालय शोधायला किंवा साठा तपासण्यास मदत करू शकतो. मला काहीही विचार, जसे 'O+ डोनर शोधा' किंवा 'रुग्णालय कुठे आहे'!"
  }
};

const detectLanguage = (text) => {
  const lower = text.toLowerCase();
  
  // 1. Check for Gujarati characters in script
  if (/[\u0A80-\u0AFF]/.test(text)) {
    return 'gu';
  }
  
  // 2. Check for Hindi / Marathi (Devnagari) script
  if (/[\u0900-\u097F]/.test(text)) {
    if (lower.includes('जवळचे') || lower.includes('का') || lower.includes('दाते') || lower.includes('रुग्णालय') || lower.includes('रक्तदाता') || lower.includes('दात्याशी')) {
      return 'mr';
    }
    return 'hi';
  }

  // 3. Check for Romanized Gujarati (Gujlish)
  const gujaratiKeywords = ['mane', 'joiye', 'che', 'chhe', 'nathi', 'kem', 'cho', 'tame', 'mara', 'jovu', 'apne', 'maru', 'hath', 'bhai', 'pela', 'nu', 'joiye che', 'joiyye', 'joiyechhe', 'lohe', 'location'];
  const words = lower.split(/\s+/);
  const isGujarati = words.some(word => gujaratiKeywords.includes(word));
  if (isGujarati) {
    return 'gu';
  }

  // 4. Check for Romanized Marathi
  const marathiKeywords = ['pahije', 'havay', 'kuthe', 'aahe', 'kasa', 'aamhi', 'tumhi', 'mahit', 'madhe'];
  const isMarathi = words.some(word => marathiKeywords.includes(word));
  if (isMarathi) {
    return 'mr';
  }

  // 5. Check for Romanized Hindi (Hinglish)
  const hindiKeywords = ['mujhe', 'chahiye', 'kaha', 'kahan', 'hai', 'milega', 'batao', 'kaise', 'karo', 'bhejo', 'salah', 'door', 'sirf', 'hoon', 'hai', 'dhundo', 'check', 'hoga', 'hai', 'hain', 'dost'];
  const isHindi = words.some(word => hindiKeywords.includes(word));
  if (isHindi) {
    return 'hi';
  }

  return 'en';
};

const getAIResponse = (message, lang = 'en') => {
  const lower = message.toLowerCase();
  let matchingKey = 'default';

  for (const key of Object.keys(AI_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) {
      matchingKey = key;
      break;
    }
  }

  const responseObj = AI_RESPONSES[matchingKey];
  return {
    text: responseObj[lang] || responseObj['en'],
    type: responseObj.type
  };
};

const SUGGESTIONS = [
  'Find O+ donor near me',
  'Show nearby hospitals',
  'Track my request',
  'Blood group inventory',
  'How does AI matching work?',
];

const typeColors = {
  result: 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800/30',
  warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30',
  emergency: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30',
  info: 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10',
  track: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30',
};

const AIAssistant = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "👋 Hi! I'm BloodBridge AI. How can I help with your emergency healthcare needs today?", type: 'info', time: 'now' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: msg, time: 'now' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const lang = detectLanguage(msg);

    setTimeout(() => {
      const aiResp = getAIResponse(msg, lang);
      setIsTyping(false);
      
      const newMsgId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: newMsgId,
        role: 'ai',
        text: '',
        type: aiResp.type,
        time: 'now',
      }]);

      let index = 0;
      const fullText = aiResp.text;
      let currentText = '';

      const typingInterval = setInterval(() => {
        if (index < fullText.length) {
          currentText += fullText.charAt(index);
          setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: currentText } : m));
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 15);
    }, 1000 + Math.random() * 800);
  };

  return (
    <>
      {/* ===== Toggle Button ===== */}
      <motion.button
        className="fixed bottom-24 right-5 z-50 lg:bottom-6 lg:right-6 w-13 h-13 rounded-2xl bg-gradient-to-br from-aiblue to-aipurple shadow-lg glow-blue flex items-center justify-center text-white"
        style={{ width: 52, height: 52 }}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        animate={open ? {} : { y: [0, -4, 0] }}
        transition={open ? {} : { duration: 2, repeat: Infinity }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <FiX className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <FiMessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl border-2 border-aiblue/50 animate-pulse-ring-slow" />
        )}
      </motion.button>

      {/* ===== Chat Window ===== */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-44 right-5 z-50 lg:bottom-24 lg:right-6 w-80 sm:w-96"
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="glass-floating rounded-3xl overflow-hidden flex flex-col shadow-2xl" style={{ maxHeight: 480 }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-aiblue/10 to-aipurple/10 border-b border-white/10 dark:border-white/5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-aiblue to-aipurple flex items-center justify-center text-sm">
                  <FiZap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">BloodBridge AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-aigreen animate-pulse" />
                    <span className="text-[10px] text-aigreen font-semibold">Online · AI Active</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed border ${
                      msg.role === 'user'
                        ? 'bg-bloodred text-white border-bloodred/30 rounded-br-sm'
                        : `${typeColors[msg.type] || typeColors.info} text-gray-700 dark:text-gray-200 rounded-bl-sm`
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-gray-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Suggestions */}
              <div className="px-3 py-2 flex gap-1.5 overflow-x-auto">
                {SUGGESTIONS.slice(0, 3).map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="shrink-0 text-[10px] font-semibold px-2.5 py-1.5 rounded-xl bg-gray-100/80 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-bloodred/10 hover:text-bloodred transition-colors whitespace-nowrap"
                  >
                    {s.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-3 pb-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask BloodBridge AI..."
                  className="flex-1 bg-gray-100/80 dark:bg-white/5 rounded-xl px-3.5 py-2.5 text-xs text-gray-800 dark:text-white placeholder-gray-400 outline-none border border-gray-100 dark:border-white/10 focus:border-aiblue/40"
                />
                <motion.button
                  onClick={() => sendMessage()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-aiblue to-aipurple text-white flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSend className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
