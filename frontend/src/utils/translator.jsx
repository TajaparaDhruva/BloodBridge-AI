import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import i18n from '../i18n/i18n';

// Custom translations that are not present in standard i18n keys
const manualOverrides = {
  en: {
    // Navbar
    'How It Works': 'How It Works',
    'For Hospitals': 'For Hospitals',
    'For Donors': 'For Donors',
    'Impact': 'Impact',
    'About Us': 'About Us',
    'Get Started': 'Get Started',
    'Sign In': 'Sign In',
    'Sign Out': 'Sign Out',
    'Dashboard': 'Dashboard',
    'Go to Dashboard': 'Go to Dashboard',

    // Hero / Landing
    'LIVE SYSTEM ACTIVE': 'LIVE SYSTEM ACTIVE',
    'Watch Demo': 'Watch Demo',
    'Simple 3-Step Process': 'Simple 3-Step Process',
    'How BloodBridge AI streamlines donation routing in emergencies.': 'How BloodBridge AI streamlines donation routing in emergencies.',
    'Future Scale & National Vision': 'Future Scale & National Vision',
    'Our technology roadmap to integrate with state-level disaster response frameworks.': 'Our technology roadmap to integrate with state-level disaster response frameworks.',

    // Dashboard Tabs
    'Overview': 'Overview',
    'Requests': 'Requests',
    'Donors': 'Donors',
    'Hospitals': 'Hospitals',
    'Inventory': 'Inventory',
    'Live Map': 'Live Map',
    
    // Dashboard Header / Sidebar / Overview
    'Operations Control': 'Operations Control',
    'Emergency Dispatches': 'Emergency Dispatches',
    'Donor Registry': 'Donor Registry',
    'Network Hospitals': 'Network Hospitals',
    'System Inventory': 'System Inventory',
    'Live Emergency Map': 'Live Emergency Map',
    'Active Request Registry': 'Active Request Registry',
    'operations dispatch records': 'operations dispatch records',
    'Total Requests': 'Total Requests',
    'Urgent': 'Urgent',
    'Normal': 'Normal',
    'Information': 'Information',
    'Create Emergency Request': 'Create Emergency Request',
    'Search network (Ctrl+K)': 'Search network (Ctrl+K)',
    'Toggle AI Assistant (Ctrl+J)': 'Toggle AI Assistant (Ctrl+J)',
    'Request': 'Request',
    'Blood Depots Inventory': 'Blood Depots Inventory',
    'Real-time depletion indicators': 'Real-time depletion indicators',
    'units available': 'units available',
    'Critical Restock Needed': 'Critical Restock Needed',
    'Inventory Stability Optimal': 'Inventory Stability Optimal',
    'Depots for': 'Depots for',
    'are reporting below safety margins (less than 5 units). Manual outreach coordinates or automated AI notifications have been dispatched.': 'are reporting below safety margins (less than 5 units). Manual outreach coordinates or automated AI notifications have been dispatched.',
    'Positive groups': 'Positive groups',
    'remain stable. Depletion forecasts show adequate buffer levels matching hospital admission trends for the next 72 hours.': 'remain stable. Depletion forecasts show adequate buffer levels matching hospital admission trends for the next 72 hours.',

    // Mock names & hospitals
    'Lilavati Hospital': 'Lilavati Hospital',
    'Fortis Hiranandani Hospital': 'Fortis Hiranandani Hospital',
    'Kokilaben Dhirubhai Ambani Hospital': 'Kokilaben Dhirubhai Ambani Hospital',
    'Metro Critical Care Hospital': 'Metro Critical Care Hospital',
    'Apollo Speciality Center': 'Apollo Speciality Center',
    'Ranveer Singh': 'Ranveer Singh',
    'Alia Bhatt': 'Alia Bhatt',
    'Preeti Zinta': 'Preeti Zinta',
    'Deepika Padukone': 'Deepika Padukone',
    'Rohan Joshi': 'Rohan Joshi',
    'Just now': 'Just now',
    '2 mins ago': '2 mins ago',
    '3 mins ago': '3 mins ago',
    '4 mins ago': '4 mins ago',
    'Calculating...': 'Calculating...',
    'eligible donors': 'eligible donors',
    'Contacted': 'Contacted',
    'AI Match time': 'AI Match time',
    'unit required': 'unit required',
    'units required': 'units required',
    'Matching': 'Matching',
    'ATTENTION': 'ATTENTION',
    'CRITICAL': 'CRITICAL',
    'IN PROGRESS': 'IN PROGRESS',
    'NEW': 'NEW',

    // Role switcher & login
    'Welcome Back': 'Welcome Back',
    'Secure access · Emergency Network': 'Secure access · Emergency Network',
    'System Live': 'System Live',
    'User Identifier': 'User Identifier',
    'Authentication Key': 'Authentication Key',
    'Recovery?': 'Recovery?',
    'Keep me signed in on this device': 'Keep me signed in on this device',
    'Initialize Login': 'Initialize Login',
    'Processing Real-Time Logistics': 'Processing Real-Time Logistics',
    'Neural Match Active': 'Neural Match Active',
    'Try a Demo': 'Try a Demo',
    'By signing in you agree to our': 'By signing in you agree to our',
    'Terms': 'Terms',
    'Privacy': 'Privacy',
    'BLOODBRIDGE AI • PRECISION HEMATOLOGY CORE': 'BLOODBRIDGE AI • PRECISION HEMATOLOGY CORE',
    'Hospital': 'Hospital',
    'Donor': 'Donor',
    'Admin': 'Admin',
    'Enter hospital email or ID': 'Enter hospital email or ID',
    'Enter registered email address': 'Enter registered email address'
  },
  gu: {
    // Navbar
    'How It Works': 'કેવી રીતે કામ કરે છે',
    'For Hospitals': 'હોસ્પિટલો માટે',
    'For Donors': 'દાતાઓ માટે',
    'Impact': 'અસર',
    'About Us': 'અમારા વિશે',
    'Get Started': 'શરૂ કરો',
    'Sign In': 'લોગિન કરો',
    'Sign Out': 'લોગઆઉટ',
    'Dashboard': 'ડેશબોર્ડ',
    'Go to Dashboard': 'ડેશબોર્ડ પર જાઓ',

    // Hero / Landing
    'LIVE SYSTEM ACTIVE': 'લાઇવ સિસ્ટમ સક્રિય',
    'Watch Demo': 'ડેમો જુઓ',
    'Simple 3-Step Process': 'સરળ ૩-પગલાંની પ્રક્રિયા',
    'How BloodBridge AI streamlines donation routing in emergencies.': 'ઇમરજન્સીમાં બ્લડબ્રિજ AI કેવી રીતે રક્તદાનનું આયોજન સરળ બનાવે છે.',
    'Future Scale & National Vision': 'ભવિષ્યનું માપદંડ અને રાષ્ટ્રીય દ્રષ્ટિકોણ',
    'Our technology roadmap to integrate with state-level disaster response frameworks.': 'રાજ્ય-સ્તરની આપત્તિ પ્રતિભાવ પ્રણાલીઓ સાથે સંકલન માટેનો અમારો રોડમેપ.',

    // Dashboard Tabs
    'Overview': 'ઝાંખી',
    'Requests': 'વિનંતીઓ',
    'Donors': 'દાતાઓ',
    'Hospitals': 'હોસ્પિટલો',
    'Inventory': 'સ્ટોક',
    'Live Map': 'લાઇવ નકશો',

    // Dashboard Header / Sidebar / Overview
    'Operations Control': 'કામગીરી નિયંત્રણ',
    'Emergency Dispatches': 'કટોકટી રવાનગી',
    'Donor Registry': 'દાતા રજિસ્ટ્રી',
    'Network Hospitals': 'નેટવર્ક હોસ્પિટલો',
    'System Inventory': 'સિસ્ટમ સ્ટોક',
    'Live Emergency Map': 'લાઇવ ઇમરજન્સી નકશો',
    'Active Request Registry': 'સક્રિય વિનંતી રજિસ્ટ્રી',
    'operations dispatch records': 'કામગીરી રવાનગી રેકોર્ડ્સ',
    'Total Requests': 'કુલ વિનંતીઓ',
    'Urgent': 'તાકીદનું',
    'Normal': 'સામાન્ય',
    'Information': 'માહિતી',
    'Create Emergency Request': 'ઇમરજન્સી વિનંતી બનાવો',
    'Search network (Ctrl+K)': 'શોધ કરો (Ctrl+K)',
    'Toggle AI Assistant (Ctrl+J)': 'AI સહાયક ચાલુ કરો (Ctrl+J)',
    'Request': 'વિનંતી',
    'Blood Depots Inventory': 'રક્ત સ્ટોક ઇન્વેન્ટરી',
    'Real-time depletion indicators': 'વાસ્તવિક સમયના સ્ટોક નિર્દેશકો',
    'units available': 'યુનિટ ઉપલબ્ધ',
    'Critical Restock Needed': 'તાકીદે ફરીથી સ્ટોક કરવાની જરૂર છે',
    'Inventory Stability Optimal': 'સ્ટોક સ્થિરતા શ્રેષ્ઠ',
    'Depots for': 'સ્ટોક ડેપો',
    'are reporting below safety margins (less than 5 units). Manual outreach coordinates or automated AI notifications have been dispatched.': 'સલામती મર્યાદાથી નીચે અહેવાલ આપી રહ્યા છે (૫ યુનિટથી ઓછા). મેન્યુઅલ સંપર્ક અથવા સ્વચાલિત AI નોટિફિકેશન મોકલવામાં આવ્યા છે.',
    'Positive groups': 'પોઝિટિવ બ્લડ ગ્રુપ',
    'remain stable. Depletion forecasts show adequate buffer levels matching hospital admission trends for the next 72 hours.': 'સ્થિર રહે છે. ઘટાડાની આગાહી દર્શાવે છે કે આગામી ૭૨ કલાક માટે હોસ્પિટલના વલણો સાથે મેળ ખાતા પૂરતા બફર સ્તરો છે.',

    // Mock names & hospitals
    'Lilavati Hospital': 'લીલાવતી હોસ્પિટલ',
    'Fortis Hiranandani Hospital': 'ફોર્ટિસ હિરાનંદાની હોસ્પિટલ',
    'Kokilaben Dhirubhai Ambani Hospital': 'કોકિલાબેન ધીરુભાઈ અંબાણી હોસ્પિટલ',
    'Metro Critical Care Hospital': 'મેટ્રો ક્રિટિકલ કેર હોસ્પિટલ',
    'Apollo Speciality Center': 'એપોલો સ્પેશિયાલિટી સેન્ટર',
    'Ranveer Singh': 'રણવીર સિંહ',
    'Alia Bhatt': 'આલિયા ભટ્ટ',
    'Preeti Zinta': 'પ્ર્રીતિ ઝિન્ટા',
    'Deepika Padukone': 'દીપિકા પાદુકોણ',
    'Rohan Joshi': 'રોહન જોશી',
    'Just now': 'હમણાં જ',
    '2 mins ago': '૨ મિનિટ પહેલા',
    '3 mins ago': '૩ મિનિટ પહેલા',
    '4 mins ago': '૪ મિનિટ પહેલા',
    'Calculating...': 'ગણતરી ચાલુ છે...',
    'eligible donors': 'પાત્ર દાતાઓ',
    'Contacted': 'સંપર્ક કર્યો',
    'AI Match time': 'AI મેચ સમય',
    'unit required': 'યુનિટ જરૂરી',
    'units required': 'યુનિટ જરૂરી',
    'Matching': 'મેચિંગ ચાલુ',
    'ATTENTION': 'ધ્યાન આપો',
    'CRITICAL': 'ગંભીર',
    'IN PROGRESS': 'ચાલુ છે',
    'NEW': 'નવું',

    // Role switcher & login
    'Welcome Back': 'સ્વાગત છે',
    'Secure access · Emergency Network': 'સુરક્ષિત પ્રવેશ · ઇમરજન્સી નેટવર્ક',
    'System Live': 'સિસ્ટમ લાઇવ છે',
    'User Identifier': 'વપરાશકર્તા ઓળખ (ઇમેઇલ)',
    'Authentication Key': 'પાસવર્ડ / ઓથ કી',
    'Recovery?': 'રીકવરી?',
    'Keep me signed in on this device': 'આ ઉપકરણ પર સાઇન ઇન રહો',
    'Initialize Login': 'લોગિન કરો',
    'Processing Real-Time Logistics': 'રીયલ-ટાઇમ લોજિસ્ટિક્સ પ્રોસેસિંગ',
    'Neural Match Active': 'ન્યુરલ મેચ સક્રિય',
    'Try a Demo': 'ડેમો જુઓ',
    'By signing in you agree to our': 'સાઇન ઇન કરવાથી તમે સંમત થાઓ છો અમારા',
    'Terms': 'નિયમો',
    'Privacy': 'ગોપનીયતા',
    'BLOODBRIDGE AI • PRECISION HEMATOLOGY CORE': 'બ્લડબ્રિજ AI • પ્રિસિઝન હેમેટોલોજી કોર',
    'Hospital': 'હોસ્પિટલ',
    'Donor': 'દાતા',
    'Admin': 'એડમિન',
    'Enter hospital email or ID': 'હોસ્પિટલ ઇમેઇલ અથવા આઈડી દાખલ કરો',
    'Enter registered email address': 'નોંધાયેલ ઇમેઇલ સરનામું દાખલ કરો'
  },
  hi: {
    // Navbar
    'How It Works': 'यह कैसे काम करता है',
    'For Hospitals': 'अस्पतालों के लिए',
    'For Donors': 'दाताओं के लिए',
    'Impact': 'प्रभाव',
    'About Us': 'हमारे बारे में',
    'Get Started': 'शुरू करें',
    'Sign In': 'लॉगिन',
    'Sign Out': 'लॉगआउट',
    'Dashboard': 'डैशबोर्ड',
    'Go to Dashboard': 'डैशबोर्ड पर जाएं',

    // Hero / Landing
    'LIVE SYSTEM ACTIVE': 'सक्रिय लाइव सिस्टम',
    'Watch Demo': 'डेमो देखें',
    'Simple 3-Step Process': 'सरल 3-चरण प्रक्रिया',
    'How BloodBridge AI streamlines donation routing in emergencies.': 'आपातकालीन स्थिति में ब्लडब्रिज AI कैसे रक्तदान को सुव्यवस्थित करता है।',
    'Future Scale & National Vision': 'भविष्य का पैमाना और राष्ट्रीय दृष्टिकोण',
    'Our technology roadmap to integrate with state-level disaster response frameworks.': 'राज्य-स्तरीय आपदा प्रतिक्रिया ढांचे के साथ एकीकृत करने के लिए हमारा रोडमैप।',

    // Dashboard Tabs
    'Overview': 'अवलोकन',
    'Requests': 'अनुरोध',
    'Donors': 'दाता',
    'Hospitals': 'अस्पताल',
    'Inventory': 'सूची',
    'Live Map': 'लाइव नक्शा',

    // Dashboard Header / Sidebar / Overview
    'Operations Control': 'संचालन नियंत्रण',
    'Emergency Dispatches': 'आपातकालीन प्रेषण',
    'Donor Registry': 'दाता रजिस्ट्री',
    'Network Hospitals': 'नेटवर्क अस्पताल',
    'System Inventory': 'प्रणाली सूची',
    'Live Emergency Map': 'लाइव आपातकालीन मानचित्र',
    'Active Request Registry': 'सक्रिय अनुरोध रजिस्ट्री',
    'operations dispatch records': 'संचालन प्रेषण रिकॉर्ड',
    'Total Requests': 'कुल अनुरोध',
    'Urgent': 'आवश्यक',
    'Normal': 'सामान्य',
    'Information': 'सूचना',
    'Create Emergency Request': 'आपातकालीन अनुरोध बनाएं',
    'Search network (Ctrl+K)': 'खोजें (Ctrl+K)',
    'Toggle AI Assistant (Ctrl+J)': 'AI सहायक टॉगल करें (Ctrl+J)',
    'Request': 'अनुरोध',
    'Blood Depots Inventory': 'रक्त डिपो सूची',
    'Real-time depletion indicators': 'वास्तविक समय कमी संकेत',
    'units available': 'यूनिट उपलब्ध',
    'Critical Restock Needed': 'महत्वपूर्ण पुनः स्टॉक आवश्यक',
    'Inventory Stability Optimal': 'सूची स्थिरता इष्टतम',
    'Depots for': 'डिपो के लिए',
    'are reporting below safety margins (less than 5 units). Manual outreach coordinates or automated AI notifications have been dispatched.': 'सुरक्षा मार्जिन से नीचे रिपोर्ट कर रहे हैं (5 यूनिट से कम)। मैन्युअल आउटरीच या स्वचालित एआई सूचनाएं भेजी गई हैं।',
    'Positive groups': 'सकारात्मक समूह',
    'remain stable. Depletion forecasts show adequate buffer levels matching hospital admission trends for the next 72 hours.': 'स्थिर बने हुए हैं। कमी के पूर्वानुमान अगले 72 घंटों के लिए अस्पताल में प्रवेश के रुझान से मेल खाते पर्याप्त बफर स्तर दिखाते हैं।',

    // Mock names & hospitals
    'Lilavati Hospital': 'लीलावती अस्पताल',
    'Fortis Hiranandani Hospital': 'फोर्टिस हिरानंदानी अस्पताल',
    'Kokilaben Dhirubhai Ambani Hospital': 'कोकिलाबेन धीरूभाई अंबानी अस्पताल',
    'Metro Critical Care Hospital': 'मेट्रो क्रिटिकल केयर अस्पताल',
    'Apollo Speciality Center': 'अपोलो विशेषता केंद्र',
    'Ranveer Singh': 'रणवीर सिंह',
    'Alia Bhatt': 'आलिया भट्ट',
    'Preeti Zinta': 'प्रीति जिंटा',
    'Deepika Padukone': 'दीपिका पादुकोण',
    'Rohan Joshi': 'रोहन जोशी',
    'Just now': 'अभी-अभी',
    '2 mins ago': '2 मिनट पहले',
    '3 mins ago': '3 मिनट पहले',
    '4 mins ago': '4 मिनट पहले',
    'Calculating...': 'गणना की जा रही है...',
    'eligible donors': 'योग्य दाता',
    'Contacted': 'संपर्क किया',
    'AI Match time': 'एआई मिलान समय',
    'unit required': 'यूनिट आवश्यक',
    'units required': 'यूनिट आवश्यक',
    'Matching': 'मिलान जारी',
    'ATTENTION': 'ध्यान दें',
    'CRITICAL': 'गंभीर',
    'IN PROGRESS': 'प्रगति पर',
    'NEW': 'नया',

    // Role switcher & login
    'Welcome Back': 'स्वागत है',
    'Secure access · Emergency Network': 'सुरक्षित पहुंच · आपातकालीन नेटवर्क',
    'System Live': 'सिस्टम लाइव',
    'User Identifier': 'उपयोगकर्ता पहचानकर्ता',
    'Authentication Key': 'प्रमाणीकरण कुंजी',
    'Recovery?': 'रिकवरी?',
    'Keep me signed in on this device': 'मुझे इस डिवाइस पर साइन इन रखें',
    'Initialize Login': 'साइन इन करें',
    'Processing Real-Time Logistics': 'वास्तविक समय रसद प्रसंस्करण',
    'Neural Match Active': 'तंत्रिका मिलान सक्रिय',
    'Try a Demo': 'डेमो आज़माएं',
    'By signing in you agree to our': 'साइन इन करने पर आप सहमत होते हैं हमारे',
    'Terms': 'नियमों',
    'Privacy': 'गोपनीयता',
    'BLOODBRIDGE AI • PRECISION HEMATOLOGY CORE': 'ब्लडब्रिज AI • सटीक रुधिर विज्ञान कोर',
    'Hospital': 'अस्पताल',
    'Donor': 'दाता',
    'Admin': 'एडमिन',
    'Enter hospital email or ID': 'अस्पताल का ईमेल या आईडी दर्ज करें',
    'Enter registered email address': 'पंजीकृत ईमेल पता दर्ज करें'
  },
  mr: {
    // Navbar
    'How It Works': 'हे कसे कार्य करते',
    'For Hospitals': 'रुग्णालयांसाठी',
    'For Donors': 'दात्यांसाठी',
    'Impact': 'प्रभाव',
    'About Us': 'आमच्याबद्दल',
    'Get Started': 'सुरू करा',
    'Sign In': 'लॉगिन',
    'Sign Out': 'लॉगआउट',
    'Dashboard': 'डॅशबोर्ड',
    'Go to Dashboard': 'डॅशबोर्डवर जा',

    // Hero / Landing
    'LIVE SYSTEM ACTIVE': 'थेट प्रणाली सक्रिय',
    'Watch Demo': 'डेमो पहा',
    'Simple 3-Step Process': 'सोपी ३-चरण प्रक्रिया',
    'How BloodBridge AI streamlines donation routing in emergencies.': 'आणीबाणीच्या परिस्थितीत ब्लडब्रिज AI रक्तदान कसे सुलभ करते.',
    'Future Scale & National Vision': 'भविष्यातील प्रमाण आणि राष्ट्रीय दृष्टीकोन',
    'Our technology roadmap to integrate with state-level disaster response frameworks.': 'राज्य-स्तरीय आपत्ती प्रतिसाद फ्रेमवर्कसह समाकलित करण्यासाठी आमचा रोडमॅप.',

    // Dashboard Tabs
    'Overview': 'आढावा',
    'Requests': 'विनंत्या',
    'Donors': 'दाते',
    'Hospitals': 'रुग्णालये',
    'Inventory': 'सूची',
    'Live Map': 'थेट नकाशा',

    // Dashboard Header / Sidebar / Overview
    'Operations Control': 'ऑपरेशन्स नियंत्रण',
    'Emergency Dispatches': 'आणीबाणी पाठवणे',
    'Donor Registry': 'दाता नोंदणी',
    'Network Hospitals': 'नेटवर्क रुग्णालये',
    'System Inventory': 'प्रणाली सूची',
    'Live Emergency Map': 'थेट आणीबाणी नकाशा',
    'Active Request Registry': 'सक्रिय विनंती नोंदणी',
    'operations dispatch records': 'ऑपरेशन्स पाठवलेले रेकॉर्ड',
    'Total Requests': 'एकूण विनंत्या',
    'Urgent': 'तातडीचे',
    'Normal': 'सामान्य',
    'Information': 'माहिती',
    'Create Emergency Request': 'आणीबाणी विनंती तयार करा',
    'Search network (Ctrl+K)': 'शोधा (Ctrl+K)',
    'Toggle AI Assistant (Ctrl+J)': 'AI सहाय्यक टॉगल करा (Ctrl+J)',
    'Request': 'विनंती',
    'Blood Depots Inventory': 'रक्त साठा सूची',
    'Real-time depletion indicators': 'रिअल-टाइम कमतरता निर्देशक',
    'units available': 'युनिट उपलब्ध',
    'Critical Restock Needed': 'तातडीने पुन्हा साठा करणे आवश्यक',
    'Inventory Stability Optimal': 'साठा स्थिरता सर्वोत्तम',
    'Depots for': 'डेपोसाठी',
    'are reporting below safety margins (less than 5 units). Manual outreach coordinates or automated AI notifications have been dispatched.': 'सुरक्षिततेच्या मर्यादेपेक्षा कमी नोंदवत आहेत (५ युनिटपेक्षा कमी). मॅन्युअल संपर्क किंवा स्वयंचलित AI सूचना पाठवल्या आहेत.',
    'Positive groups': 'सकारात्मक गट',
    'remain stable. Depletion forecasts show adequate buffer levels matching hospital admission trends for the next 72 hours.': 'स्थिर राहिले आहेत. पुढील ७२ तासांसाठी रुग्णालयातील प्रवाहांशी जुळणारे पुरेसे बफर स्तर वर्तवले आहेत.',

    // Mock names & hospitals
    'Lilavati Hospital': 'लीलावती रुग्णालय',
    'Fortis Hiranandani Hospital': 'फोर्टिस हिरानंदानी रुग्णालय',
    'Kokilaben Dhirubhai Ambani Hospital': 'कोकिळाबेन धीरूभाई अंबानी रुग्णालय',
    'Metro Critical Care Hospital': 'मेट्रो क्रिटिकल केअर रुग्णालय',
    'Apollo Speciality Center': 'अपोलो स्पेशालिटी सेंटर',
    'Ranveer Singh': 'रणवीर सिंग',
    'Alia Bhatt': 'आलिया भट',
    'Preeti Zinta': 'प्रिती झिंटा',
    'Deepika Padukone': 'दीपिका पडुकोण',
    'Rohan Joshi': 'रोहन जोशी',
    'Just now': 'आत्ताच',
    '2 mins ago': '२ मिनिटांपूर्वी',
    '3 mins ago': '३ मिनिटांपूर्वी',
    '4 mins ago': '४ मिनिटांपूर्वी',
    'Calculating...': 'गणना करत आहे...',
    'eligible donors': 'पात्र दाते',
    'Contacted': 'संपर्क साधला',
    'AI Match time': 'AI मॅच वेळ',
    'unit required': 'युनिट आवश्यक',
    'units required': 'युनिट आवश्यक',
    'Matching': 'जुळणी सुरू',
    'ATTENTION': 'लक्ष द्या',
    'CRITICAL': 'गंभीर',
    'IN PROGRESS': 'प्रगतीपथावर',
    'NEW': 'नवीन',

    // Role switcher & login
    'Welcome Back': 'स्वागत आहे',
    'Secure access · Emergency Network': 'सुरक्षित प्रवेश · आणीबाणी नेटवर्क',
    'System Live': 'प्रणाली थेट',
    'User Identifier': 'वापरकर्ता ओळख (ईमेल)',
    'Authentication Key': 'प्रमाणीकरण की (पासवर्ड)',
    'Recovery?': 'रिकव्हरी?',
    'Keep me signed in on this device': 'या डिव्हाइसवर साइन इन रहा',
    'Initialize Login': 'लॉगिन करा',
    'Processing Real-Time Logistics': 'थेट रसद प्रक्रिया सुरू',
    'Neural Match Active': 'न्यूरल मॅच सक्रिय',
    'Try a Demo': 'डेमो पहा',
    'By signing in you agree to our': 'साइन इन करून आपण सहमत आहात आमच्या',
    'Terms': 'नियमांशी',
    'Privacy': 'गोपनीयता',
    'BLOODBRIDGE AI • PRECISION HEMATOLOGY CORE': 'ब्लडब्रिज AI • अचूक रक्तशास्त्र कोर',
    'Hospital': 'रुग्णालय',
    'Donor': 'दाता',
    'Admin': 'ॲडमिन',
    'Enter hospital email or ID': 'रुग्णालय ईमेल किंवा आयडी प्रविष्ट करा',
    'Enter registered email address': 'नोंदणीकृत ईमेल पत्ता प्रविष्ट करा'
  }
};

// Global cache for dictionary
let reverseDictionary = null;

const buildDictionary = () => {
  if (reverseDictionary) return reverseDictionary;

  const dict = { en: {}, gu: {}, hi: {}, mr: {} };
  const resources = i18n.options.resources || {};

  const recurse = (enObj, path = []) => {
    for (const key in enObj) {
      const val = enObj[key];
      if (typeof val === 'string') {
        const enVal = val.trim();
        for (const lang of ['gu', 'hi', 'mr', 'en']) {
          let target = resources[lang]?.translation;
          for (const p of [...path, key]) {
            target = target?.[p];
          }
          if (typeof target === 'string') {
            dict[lang][enVal] = target.trim();
          }
        }
      } else if (typeof val === 'object' && val !== null) {
        recurse(val, [...path, key]);
      }
    }
  };

  if (resources.en && resources.en.translation) {
    recurse(resources.en.translation);
  }

  // Merge overrides
  for (const lang of ['en', 'gu', 'hi', 'mr']) {
    dict[lang] = { ...dict[lang], ...manualOverrides[lang] };
  }

  reverseDictionary = dict;
  return dict;
};

export const translateText = (text, currentLang) => {
  if (typeof text !== 'string') return text;
  if (!currentLang || currentLang === 'en') return text;
  
  const dict = buildDictionary();
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Direct lookup
  let translation = dict[currentLang]?.[trimmed];

  // Case-insensitive lookup fallback
  if (!translation) {
    const lower = trimmed.toLowerCase();
    const matchKey = Object.keys(dict[currentLang] || {}).find(k => k.toLowerCase() === lower);
    if (matchKey) {
      translation = dict[currentLang][matchKey];
    }
  }

  if (translation) {
    // Preserve leading/trailing spaces
    const leadingSpace = text.startsWith(' ') ? ' ' : '';
    const trailingSpace = text.endsWith(' ') ? ' ' : '';
    return leadingSpace + translation + trailingSpace;
  }

  // Fallback: Smart Substring Replacement (for mixed dynamic text like "5 units available")
  let modifiedText = text;
  let translatedAny = false;
  
  if (dict[currentLang]) {
    const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Sort keys by length descending to match longest phrases first
    const keys = Object.keys(dict[currentLang]).sort((a, b) => b.length - a.length);
    
    for (const key of keys) {
      if (key.length >= 2 && modifiedText.toLowerCase().includes(key.toLowerCase())) {
        try {
          const regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, 'gi');
          if (regex.test(modifiedText)) {
            // Reset lastIndex because test() advances it
            regex.lastIndex = 0;
            modifiedText = modifiedText.replace(regex, dict[currentLang][key]);
            translatedAny = true;
          }
        } catch (e) {
          // Ignore regex errors
        }
      }
    }
  }

  return translatedAny ? modifiedText : text;
};

export const AutoTranslate = ({ children }) => {
  return <>{children}</>;
};
