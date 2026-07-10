import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      common: {
        appName: 'BloodBridge AI',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        dashboard: 'Dashboard',
        home: 'Home',
        features: 'Features',
        about: 'About',
        faq: 'FAQ',
        contact: 'Contact',
        submit: 'Submit',
        cancel: 'Cancel',
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        backToTop: 'Back to Top',
        allRightsReserved: 'All rights reserved.',
        emergency: 'EMERGENCY ALERT',
        bloodGroup: 'Blood Group',
        status: 'Status',
        action: 'Action',
        notifications: 'Notifications',
        welcome: 'Welcome back',
        howItWorks: 'How It Works',
        forHospitals: 'For Hospitals',
        forDonors: 'For Donors',
        impact: 'Impact',
        request: 'Request',
        roles: {
          hospital: 'Hospital',
          donor: 'Donor',
          admin: 'System Admin'
        }
      },
      languageSelect: {
        title: 'Choose Your Language',
        subtitle: 'Select your preferred language to customize your healthcare experience.',
        continue: 'Continue'
      },
      landing: {
      saas: {
        tag: 'SaaS Panel',
        title: 'Premium Panels Built for Hospitals & Donors',
        desc: 'Hospitals gain access to full donor availability timelines, live dispatcher maps, and predictive inventory warnings. Donors enjoy scheduling portals, medical eligibility tests, and digital badge metrics.',
        feat1: 'Live coordinates matching within 10km radius',
        feat2: 'One-click scheduling with partner clinics',
        feat3: 'Predictive replenishment queues powered by AI',
        cta: 'Explore Dashboard Panel',
        mockTitle: 'Metro Clinic Admin',
        mockCritical: 'Critical stock',
        mockActiveAlerts: 'Active Alerts',
        mockTotalDonors: 'Total Donors Match',
        mockSuccess: 'Match Success',
        mockWeeklyIncrease: '↑ 12% this week',
        mockStable: 'Highly stable',
        mockReplenishment: 'Replenishment Rate (Last 30 Days)'
      },
      process: {
        title: 'Simple 3-Step Process',
        subtitle: 'How BloodBridge AI streamlines donation routing in emergencies.',
        step1Title: 'Request is Made',
        step1Desc: 'Hospital fills out an emergency blood request through our secure cloud panel.',
        step2Title: 'AI Analyzes & Alerts',
        step2Desc: 'Geolocation algorithm matches nearby active, eligible donors, sending SMS and push notifications.',
        step3Title: 'Donation is Delivered',
        step3Desc: 'Donor accepts, travels, and donates, automatically updating local blood inventory registers.'
      },
      testimonials: {
        title: 'Trusted by the Medical Community',
        subtitle: 'Real testimonials from doctors, donors, and hospital administrators.',
        card1Desc: '"We had a case requiring rare AB- blood. BloodBridge AI notified 8 matching donors within 10 seconds. The donor arrived at our ICU in under 30 minutes. Incredible service!"',
        card1Role: 'ICU Chief, Metro Hospital',
        card2Desc: '"Signing up was incredibly simple. The SMS dispatch lists travel routing directions and hospital gate codes clearly. Being able to track my impact metrics keeps me motivated."',
        card2Role: 'O+ Active Donor, 8 Donations',
        card3Desc: '"Integrating BloodBridge AI resolved our inventory checking bottlenecks completely. Our blood reserve data syncs automatically, which has halved matching delays."',
        card3Role: 'Blood Bank Operations Lead'
      },
      future: {
        title: 'Future Scale & National Vision',
        subtitle: 'Our technology roadmap to integrate with state-level disaster response frameworks.',
        card1Title: 'Government Integration',
        card1Desc: 'Direct synchronization with national digital health ID grids for authenticated medical histories.',
        card2Title: 'Ambulance Dispatch',
        card2Desc: 'Live emergency matching directly triggered from on-road ambulances during critical transit.',
        card3Title: 'National Donor Registry',
        card3Desc: 'A unified cross-state alert grid enabling drone delivery logistics for ultra-rare blood types.'
      },

        hero: {
          titleLine1: 'Finding Blood Saves Lives.',
          titleLine2: 'BloodBridge AI Finds It Faster.',
          subtitle: 'Connecting donors, hospitals, and emergency requests in seconds using real-time spatial AI algorithms. Zero delays. Maximum impact.',
          ctaRegister: 'Register as Donor',
          ctaRequest: 'Request Blood',
          ctaDemo: 'Click Watch Demo',
          activeRequest: 'Emergency Request',
          matching: 'AI Matching active... 84 nearby donors notified',
          unitsNeeded: 'O- Negative needed at City Hospital'
        },
        stats: {
          donors: 'Registered Donors',
          hospitals: 'Connected Hospitals',
          requests: 'Emergency Requests',
          lives: 'Lives Saved',
          matchTime: 'Avg Match Time'
        },
        features: {
          title: 'Revolutionizing Blood Logistics with AI',
          subtitle: 'How our ecosystem ensures no request goes unanswered.',
          items: {
            ai: {
              title: 'Smart AI Matching',
              desc: 'Our predictive routing connects requests with matching eligible donors in milliseconds.'
            },
            alerts: {
              title: 'Emergency Alerts',
              desc: 'Instant push and SMS notifications broadcasted to high-priority donor circles.'
            },
            verified: {
              title: 'Verified Donors',
              desc: 'Rigorous donor profiling and medical log synchronization to ensure blood safety.'
            },
            dashboard: {
              title: 'Hospital Dashboard',
              desc: 'Real-time blood bank status, predictive stock metrics, and request trackers.'
            },
            tracking: {
              title: 'Real-Time Tracking',
              desc: 'Live donor dispatch maps show exactly when and where help is arriving.'
            },
            inventory: {
              title: 'Blood Inventory',
              desc: 'Live cloud analytics sync with hospital blood banks to check reserves instantly.'
            },
            rare: {
              title: 'Rare Blood Alerts',
              desc: 'Specialized queues and automated outreach for ultra-rare blood phenotypes.'
            },
            predictive: {
              title: 'Predictive Analytics',
              desc: 'AI forecasts seasonal demand surges, allowing preventive restocking campaigns.'
            }
          }
        },
        workflow: {
          title: 'The BloodBridge AI Matching Protocol',
          subtitle: 'From a hospital emergency to a confirmed donation in minutes.',
          steps: {
            step1: 'Hospital Request',
            step2: 'AI Analysis',
            step3: 'Location Filtering',
            step4: 'Medical Eligibility',
            step5: 'Availability Check',
            step6: 'Priority Ranking',
            step7: 'Best Donor Selector',
            step8: 'Live Notification',
            step9: 'Successful Donation'
          }
        },
        faq: {
          title: 'Frequently Asked Questions',
          subtitle: 'Learn more about how BloodBridge AI operates.',
          q1: 'How does the AI matching work?',
          a1: 'Our AI analyzes factors like distance, travel conditions, donor availability, and eligibility windows to select and rank the best potential donors to alert.',
          q2: 'Is BloodBridge AI free for hospitals?',
          a2: 'Yes, basic integration is completely free for registered public and charity healthcare institutions to ensure open emergency access.',
          q3: 'How are donor health records protected?',
          a3: 'We utilize state-of-the-art encryption standard compliant with HIPAA regulations to secure medical logs and location coordinates.',
          q4: 'Who is eligible to register as a donor?',
          a4: 'Anyone between 18-65 years, weighing over 45kg, in good general health, and who has not donated blood in the last 90 days.'
        },
        contact: {
          title: 'Contact Our Emergency Desk',
          subtitle: 'Reach out for system integrations or support questions.',
          name: 'Your Name',
          email: 'Your Email',
          message: 'How can we help you?',
          send: 'Send Emergency Inquiry',
          address: 'BloodBridge AI Headquarters, Sector 5, Tech City, IN',
          phone: '+1 (800) 555-BLOOD'
        }
      },
      auth: {
        signInTitle: 'Sign In to BloodBridge AI',
        signUpTitle: 'Create Healthcare Account',
        socialText: 'Or continue with Google',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        emailLabel: 'Email Address',
        passLabel: 'Password',
        nameLabel: 'Full Name',
        roleLabel: 'I am a...',
        registerButton: 'Create Account',
        loginButton: 'Sign In',
        securing: 'Securing connection...'
      },
      dashboard: {
        overview: 'Overview',
        requests: 'Blood Requests',
        inventory: 'Live Inventory',
        donorSearch: 'Search Donors',
        eligibility: 'Donor Eligibility',
        settings: 'Settings',
        alertHeading: 'Active Emergency Alerts',
        analyticsTitle: 'Match Rate Over Time',
        recentActivity: 'Recent Action Log',
        newRequestBtn: 'Create Emergency Request',
        donateBtn: 'Schedule Donation',
        verifyBtn: 'Verify Donor'
      }
    }
  },
  hi: {
    translation: {
      common: {
        appName: 'ब्लडब्रिज AI',
        login: 'लॉगिन',
        register: 'पंजीकरण',
        logout: 'लॉगआउट',
        dashboard: 'डैशबोर्ड',
        home: 'मुख्य पृष्ठ',
        features: 'विशेषताएं',
        about: 'हमारे बारे में',
        faq: 'सामान्य प्रश्न',
        contact: 'संपर्क',
        submit: 'जमा करें',
        cancel: 'रद्द करें',
        loading: 'लोड हो रहा है...',
        success: 'सफलता',
        error: 'त्रुटि',
        backToTop: 'ऊपर जाएं',
        allRightsReserved: 'सर्वाधिकार सुरक्षित।',
        emergency: 'आपातकालीन चेतावनी',
        bloodGroup: 'रक्त समूह',
        status: 'स्थिति',
        action: 'कार्रवाई',
        notifications: 'सूचनाएं',
        welcome: 'स्वागत है',
        howItWorks: 'यह कैसे काम करता है',
        forHospitals: 'अस्पतालों के लिए',
        forDonors: 'रक्तदाताओं के लिए',
        impact: 'प्रभाव',
        request: 'अनुरोध',
        roles: {
          hospital: 'अस्पताल',
          donor: 'रक्तदाता',
          admin: 'सिस्टम एडमिन'
        }
      },
      languageSelect: {
        title: 'अपनी भाषा चुनें',
        subtitle: 'अपनी स्वास्थ्य सेवा अनुभव को अनुकूलित करने के लिए अपनी पसंदीदा भाषा का चयन करें।',
        continue: 'आगे बढ़ें'
      },
      landing: {
      saas: {
        tag: 'SaaS पैनल',
        title: 'अस्पतालों और दाताओं के लिए बने प्रीमियम पैनल',
        desc: 'अस्पतालों को पूर्ण दाता उपलब्धता समयसीमा, लाइव डिस्पैचर मानचित्र और भविष्य कहनेवाला इन्वेंट्री चेतावनियों तक पहुंच मिलती है। दाता शेड्यूलिंग पोर्टल, चिकित्सा पात्रता परीक्षण और डिजिटल बैज मेट्रिक्स का आनंद लेते हैं।',
        feat1: '10 किमी के भीतर लाइव स्थान मिलान',
        feat2: 'साझेदार क्लीनिकों के साथ एक-क्लिक शेड्यूलिंग',
        feat3: 'AI द्वारा संचालित भविष्य कहनेवाला पुनर्भरण कतारें',
        cta: 'डैशबोर्ड पैनल देखें',
        mockTitle: 'मेट्रो क्लिनिक एडमिन',
        mockCritical: 'गंभीर स्टॉक',
        mockActiveAlerts: 'सक्रिय चेतावनियां',
        mockTotalDonors: 'कुल दाताओं का मिलान',
        mockSuccess: 'मिलान सफलता',
        mockWeeklyIncrease: '↑ इस सप्ताह 12%',
        mockStable: 'अत्यधिक स्थिर',
        mockReplenishment: 'पुनर्भरण दर (पिछले 30 दिन)'
      },
      process: {
        title: 'सरल 3-चरण प्रक्रिया',
        subtitle: 'ब्लडब्रिज AI आपातकालीन स्थितियों में रक्तदान को कैसे सरल बनाता है।',
        step1Title: 'अनुरोध किया जाता है',
        step1Desc: 'अस्पताल हमारे सुरक्षित क्लाउड पैनल के माध्यम से आपातकालीन रक्त अनुरोध भरता है।',
        step2Title: 'AI विश्लेषण और अलर्ट',
        step2Desc: 'जियोलोकेशन एल्गोरिदम आस-पास के सक्रिय, योग्य दाताओं का मिलान करता है, एसएमएस और पुश नोटिफिकेशन भेजता है।',
        step3Title: 'रक्तदान वितरित होता है',
        step3Desc: 'दाता स्वीकार करता है, यात्रा करता है और दान करता है, जिससे स्थानीय रक्त सूची रजिस्टर स्वचालित रूप से अपडेट हो जाते हैं।'
      },
      testimonials: {
        title: 'चिकित्सा समुदाय द्वारा विश्वसनीय',
        subtitle: 'डॉक्टरों, दाताओं और अस्पताल प्रशासकों के वास्तविक प्रशंसापत्र।',
        card1Desc: '"हमें दुर्लभ AB- रक्त की आवश्यकता थी। ब्लडब्रिज AI ने 10 सेकंड के भीतर 8 मिलान दाताओं को सूचित किया। दाता 30 मिनट से कम समय में हमारे आईसीयू में पहुंच गया। अविश्वसनीय सेवा!"',
        card1Role: 'आईसीयू प्रमुख, मेट्रो अस्पताल',
        card2Desc: '"साइन अप करना बेहद आसान था। एसएमएस डिस्पैच यात्रा मार्ग निर्देश और अस्पताल गेट कोड स्पष्ट रूप से सूचीबद्ध करता है। अपने प्रभाव मेट्रिक्स को ट्रैक करने में सक्षम होने से मुझे प्रेरणा मिलती है। "',
        card2Role: 'O+ सक्रिय दाता, 8 दान',
        card3Desc: '"ब्लडब्रिज AI को एकीकृत करने से हमारे इन्वेंट्री चेकिंग की बाधाएं पूरी तरह से दूर हो गईं। हमारा रक्त आरक्षित डेटा स्वचालित रूप से सिंक होता है, जिसने मिलान में होने वाली देरी को आधा कर दिया है।"',
        card3Role: 'रक्त बैंक संचालन प्रमुख'
      },
      future: {
        title: 'भविष्य का पैमाना और राष्ट्रीय दृष्टिकोण',
        subtitle: 'राज्य स्तरीय आपदा प्रतिक्रिया प्रणालियों के साथ एकीकृत करने का हमारा तकनीकी रोडमैप।',
        card1Title: 'सरकारी एकीकरण',
        card1Desc: 'प्रमाणित चिकित्सा इतिहास के लिए राष्ट्रीय डिजिटल स्वास्थ्य आईडी ग्रिड के साथ सीधा तालमेल।',
        card2Title: 'एम्बुलेंस डिस्पैच',
        card2Desc: 'महत्वपूर्ण पारगमन के दौरान ऑन-रोड एम्बुलेंस से सीधे लाइव आपातकालीन मिलान ट्रिगर होता है।',
        card3Title: 'राष्ट्रीय दाता रजिस्ट्री',
        card3Desc: 'एक एकीकृत क्रॉस-स्टेट अलर्ट ग्रिड जो दुर्लभ रक्त प्रकारों के लिए ड्रोन डिलीवरी लॉजिस्टिक्स को सक्षम बनाता है।'
      },

        hero: {
          titleLine1: 'रक्त खोजना जीवन बचाता है।',
          titleLine2: 'ब्लडब्रिज AI इसे तेज़ी से खोजता है।',
          subtitle: 'रीयल-टाइम स्पेसियल AI एल्गोरिदम का उपयोग करके सेकंडों में दाताओं, अस्पतालों और आपातकालीन अनुरोधों को जोड़ना। कोई देरी नहीं। अधिकतम प्रभाव।',
          ctaRegister: 'दाता के रूप में पंजीकरण करें',
          ctaRequest: 'रक्त का अनुरोध करें',
          ctaDemo: 'डेमो देखें',
          activeRequest: 'आपातकालीन अनुरोध',
          matching: 'AI मिलान सक्रिय... 84 आस-पास के दाताओं को सूचित किया गया',
          unitsNeeded: 'सिटी अस्पताल में O- नेगेटिव की आवश्यकता है'
        },
        stats: {
          donors: 'पंजीकृत रक्तदाता',
          hospitals: 'जुड़े हुए अस्पताल',
          requests: 'आपातकालीन अनुरोध',
          lives: 'बचाई गई जानें',
          matchTime: 'औसत मिलान समय'
        },
        features: {
          title: 'AI के साथ रक्त रसद में क्रांति',
          subtitle: 'हमारा पारिस्थितिकी तंत्र यह कैसे सुनिश्चित करता है कि कोई भी अनुरोध अनुत्तरित न रहे।',
          items: {
            ai: {
              title: 'स्मार्ट AI मिलान',
              desc: 'हमारा भविष्य कहनेवाला रूटिंग अनुरोधों को मिलीसेकंड में योग्य दाताओं से जोड़ता है।'
            },
            alerts: {
              title: 'आपातकालीन सूचनाएं',
              desc: 'उच्च-प्राथमिकता वाले दाता हलकों को तत्काल पुश और एसएमएस सूचनाएं भेजी जाती हैं।'
            },
            verified: {
              title: 'सत्यापित दाता',
              desc: 'रक्त सुरक्षा सुनिश्चित करने के लिए सख्त दाता प्रोफाइलिंग और मेडिकल लॉग सिंक्रोनाइज़ेशन।'
            },
            dashboard: {
              title: 'अस्पताल डैशबोर्ड',
              desc: 'वास्तविक समय में रक्त बैंक की स्थिति, भविष्य कहनेवाला स्टॉक मेट्रिक्स और अनुरोध ट्रैकर।'
            },
            tracking: {
              title: 'रीयल-टाइम ट्रैकिंग',
              desc: 'लाइव डोनर डिस्पैच मैप दिखाते हैं कि मदद कब और कहाँ पहुँच रही है।'
            },
            inventory: {
              title: 'रक्त सूची नियंत्रण',
              desc: 'रिजर्व की तुरंत जांच करने के लिए अस्पताल के रक्त बैंकों के साथ लाइव क्लाउड एनालिटिक्स सिंक।'
            },
            rare: {
              title: 'दुर्लभ रक्त चेतावनी',
              desc: 'अति-दुर्लभ रक्त फेनोटाइप के लिए विशेष कतारें और स्वचालित आउटरीच।'
            },
            predictive: {
              title: 'भविष्य कहनेवाला विश्लेषण',
              desc: 'AI मौसमी मांग में वृद्धि का पूर्वानुमान लगाता है, जिससे निवारक पुनर्रचना अभियान चलाया जा सके।'
            }
          }
        },
        workflow: {
          title: 'ब्लडब्रिज AI मिलान प्रोटोकॉल',
          subtitle: 'एक अस्पताल के आपातकाल से लेकर कुछ ही मिनटों में एक पुष्ट दान तक।',
          steps: {
            step1: 'अस्पताल अनुरोध',
            step2: 'AI विश्लेषण',
            step3: 'स्थान फ़िल्टरिंग',
            step4: 'चिकित्सीय पात्रता',
            step5: 'उपलब्धता जांच',
            step6: 'प्राथमिकता रैंकिंग',
            step7: 'सर्वश्रेष्ठ दाता चयन',
            step8: 'लाइव अधिसूचना',
            step9: 'सफल दान'
          }
        },
        faq: {
          title: 'अक्सर पूछे जाने वाले प्रश्न',
          subtitle: 'ब्लडब्रिज AI कैसे काम करता है, इसके बारे में अधिक जानें।',
          q1: 'AI मिलान कैसे काम करता है?',
          a1: 'हमारा AI दूरी, यात्रा की स्थिति, दाता की उपलब्धता और पात्रता अवधि जैसे कारकों का विश्लेषण करता है ताकि दाताओं को सतर्क किया जा सके।',
          q2: 'क्या अस्पतालों के लिए ब्लडब्रिज AI मुफ़्त है?',
          a2: 'हां, आपातकालीन स्वास्थ्य सुविधाओं तक खुली पहुंच सुनिश्चित करने के लिए पंजीकृत सार्वजनिक और धर्मार्थ संस्थानों के लिए बुनियादी एकीकरण पूरी तरह से मुफ़्त है।',
          q3: 'दाता के स्वास्थ्य रिकॉर्ड की सुरक्षा कैसे की जाती है?',
          a3: 'हम मेडिकल लॉग और स्थान निर्देशांक को सुरक्षित करने के लिए HIPAA नियमों के अनुरूप अत्याधुनिक एन्क्रिप्शन मानकों का उपयोग करते हैं।',
          q4: 'दाता के रूप में पंजीकरण करने के लिए कौन पात्र है?',
          a4: '18-65 वर्ष के बीच का कोई भी व्यक्ति, जिसका वजन 45 किलोग्राम से अधिक हो, सामान्य स्वास्थ्य अच्छा हो, और जिसने पिछले 90 दिनों में रक्तदान न किया हो।'
        },
        contact: {
          title: 'हमारे आपातकालीन डेस्क से संपर्क करें',
          subtitle: 'सिस्टम एकीकरण या सहायता प्रश्नों के लिए संपर्क करें।',
          name: 'आपका नाम',
          email: 'आपका ईमेल',
          message: 'हम आपकी क्या सहायता कर सकते हैं?',
          send: 'आपातकालीन पूछताछ भेजें',
          address: 'ब्लडब्रिज AI मुख्यालय, सेक्टर 5, टेक सिटी, भारत',
          phone: '+1 (800) 555-BLOOD'
        }
      },
      auth: {
        signInTitle: 'ब्लडब्रिज AI में साइन इन करें',
        signUpTitle: 'स्वास्थ्य सेवा खाता बनाएं',
        socialText: 'या Google के साथ जारी रखें',
        remember: 'मुझे याद रखें',
        forgot: 'पासवर्ड भूल गए?',
        noAccount: 'खाता नहीं है?',
        haveAccount: 'पहले से ही खाता है?',
        emailLabel: 'ईमेल पता',
        passLabel: 'पासवर्ड',
        nameLabel: 'पूरा नाम',
        roleLabel: 'मैं एक हूँ...',
        registerButton: 'खाता बनाएं',
        loginButton: 'साइन इन करें',
        securing: 'कनेक्शन सुरक्षित किया जा रहा है...'
      },
      dashboard: {
        overview: 'अवलोकन',
        requests: 'रक्त अनुरोध',
        inventory: 'लाइव स्टॉक सूची',
        donorSearch: 'दाता खोजें',
        eligibility: 'दाता पात्रता',
        settings: 'सेटिंग्स',
        alertHeading: 'सक्रिय आपातकालीन अलर्ट',
        analyticsTitle: 'समय के साथ मिलान दर',
        recentActivity: 'हालिया गतिविधि लॉग',
        newRequestBtn: 'आपातकालीन अनुरोध बनाएं',
        donateBtn: 'दान अनुसूची तय करें',
        verifyBtn: 'दाता सत्यापित करें'
      }
    }
  },
  gu: {
    translation: {
      common: {
        appName: 'બ્લડબ્રિજ AI',
        login: 'લોગિન',
        register: 'રજીસ્ટ્રેશન',
        logout: 'લોગઆઉટ',
        dashboard: 'ડેશબોર્ડ',
        home: 'મુખ્ય પૃષ્ઠ',
        features: 'સુવિધાઓ',
        about: 'અમારા વિશે',
        faq: 'પ્રશ્નોત્તરી',
        contact: 'સંપર્ક',
        submit: 'સબમિટ કરો',
        cancel: 'રદ કરો',
        loading: 'લોડ થઈ રહ્યું છે...',
        success: 'સફળતા',
        error: 'ભૂલ',
        backToTop: 'ઉપર જાઓ',
        allRightsReserved: 'સર્વાધિકાર સુરક્ષિત.',
        emergency: 'ઇમરજન્સી એલર્ટ',
        bloodGroup: 'બ્લડ ગ્રુપ',
        status: 'સ્થિતિ',
        action: 'પગલાં',
        notifications: 'સૂચનાઓ',
        welcome: 'સ્વાગત છે',
        howItWorks: 'તે કેવી રીતે કામ કરે છે',
        forHospitals: 'હોસ્પિટલો માટે',
        forDonors: 'રક્તદાતાઓ માટે',
        impact: 'અસર',
        request: 'વિનંતી',
        roles: {
          hospital: 'હોસ્પિટલ',
          donor: 'રક્તદાતા',
          admin: 'સિસ્ટમ એડમિન'
        }
      },
      languageSelect: {
        title: 'તમારી ભાષા પસંદ કરો',
        subtitle: 'તમારી આરોગ્ય સેવાઓનો શ્રેષ્ઠ અનુભવ મેળવવા માટે તમારી પસંદગીની ભાષા પસંદ કરો.',
        continue: 'આગળ વધો'
      },
      landing: {
      saas: {
        tag: 'SaaS પેનલ',
        title: 'હોસ્પિટલો અને રક્તદાતાઓ માટે પ્રીમિયમ પેનલ્સ',
        desc: 'હોસ્પિટલોને રક્તદાતાની ઉપલબ્ધતાની સમયરેખા, લાઇવ ડિસ્પેચ નકશા અને ઇન્વેન્ટરી ચેતવણીઓ મળે છે. રક્તદાતાઓ દાન શેડ્યૂલ કરવાના પોર્ટલ, યોગ્યતા પરીક્ષણો અને ડિજિટલ બેજ મેટ્રિક્સનો લાભ લઈ શકે છે।',
        feat1: '૧૦ કિમી ત્રિજ્યામાં લાઇવ લોકેશન મેચિંગ',
        feat2: 'ભાગીદાર ક્લિનિક્સ સાથે એક-ક્લિક શેડ્યૂલિંગ',
        feat3: 'AI દ્વારા સંચાવિત આગાહીયુક્ત પુનઃપ્રાપ્તિ કતારો',
        cta: 'ડેશબોર્ડ પેનલ શોધો',
        mockTitle: 'મેટ્રો ક્લિનિક એડમિન',
        mockCritical: 'કટોકટી સ્ટોક',
        mockActiveAlerts: 'સક્રિય ચેતવણીઓ',
        mockTotalDonors: 'કુલ દાતા મેચ',
        mockSuccess: 'મેચ સફળતા',
        mockWeeklyIncrease: '↑ આ અઠવાડિયે ૧૨%',
        mockStable: 'ખૂબ જ સ્થિર',
        mockReplenishment: 'પુનઃપ્રાપ્તિ દર (છેલ્લા ૩૦ દિવસ)'
      },
      process: {
        title: 'સરળ ૩-પગલાની પ્રક્રિયા',
        subtitle: 'બ્લડબ્રિજ AI કટોકટીમાં રક્તદાનના રૂટીંગને કેવી રીતે સરળ બનાવે છે।',
        step1Title: 'વિનંતી કરવામાં આવે છે',
        step1Desc: 'હોસ્પિટલ અમારી સુરક્ષિત ક્લાઉડ પેનલ દ્વારા કટોકટી રક્ત વિનંતી સબમિટ કરે છે।',
        step2Title: 'AI વિશ્લેષણ અને એલર્ટ',
        step2Desc: 'જીઓલોકેશન અલ્ગોરિધમ નજીકના સક્રિય, પાત્ર દાતાઓને શોધીને SMS અને પુશ નોટિફિકેશન મોકલે છે।',
        step3Title: 'દાન વિતરિત થાય છે',
        step3Desc: 'દાતા સ્વીકારે છે, મુસાફરી કરે છે અને દાન આપે છે, જે સ્થાનિક સ્ટોકને આપમેળે અપડેટ કરે છે।'
      },
      testimonials: {
        title: 'તબીબી સમુદાય દ્વારા વિશ્વસનીય',
        subtitle: 'ડોકટરો, દાતાઓ અને હોસ્પિટલ પ્રશાસકોના વાસ્તવિક અનુભવો।',
        card1Desc: '"અમને દુર્લભ AB- લોહીની જરૂર હતી. બ્લડબ્રિજ AI એ ૧૦ સેકન્ડમાં ૮ દાતાઓને જાણ કરી. દાતા ૩૦ મિનિટથી ઓછા સમયમાં ICU પહોંચી ગયા. અદ્ભુત સેવા!"',
        card1Role: 'ICU ચીફ, મેટ્રો હોસ્પિટલ',
        card2Desc: '"노ધણી ખૂબ જ સરળ હતી. SMS ડિસ્પેચ લિસ્ટમાં રૂટીંગ દિશાઓ અને હોસ્પિટલ ગેટ કોડ સ્પષ્ટ રીતે બતાવે છે. મારા પ્રભાવ મેટ્રિક્સ જોવાથી હું પ્રોત્સાહિત રહું છું।"',
        card2Role: 'O+ સક્રિય દાતા, ૮ દાન',
        card3Desc: '"બ્લડબ્રિજ AI ને જોડવાથી અમારી સ્ટોક તપાસવાની અડચણો દૂર થઈ ગઈ. અમારો રક્ત અનામત ડેટા આપમેળે સમન્વયિત થાય છે, જેનાથી મેચિંગ વિલંબ અડધો થઈ ગયો છે।"',
        card3Role: 'બ્લડ બેંક ઓપરેશન્સ લીડ'
      },
      future: {
        title: 'ભવિષ્યના સ્કેલ અને રાષ્ટ્રીય વિઝન',
        subtitle: 'રાજ્ય-સ્તરની આપત્તિ વ્યવસ્થાપન પ્રણાલીઓ સાથે જોડાણ માટેનો રોડમેપ।',
        card1Title: 'સરકારી એકીકરણ',
        card1Desc: 'તબીબી ઇતિહાસની ચકાસણી માટે રાષ્ટ્રીય ડિજિટલ હેલ્થ ID ગ્રીડ સાથે સીધું જોડાણ।',
        card2Title: 'એમ્બ્યુલન્સ ડિસ્પેચ',
        card2Desc: 'કટોકટીના પરિવહન દરમિયાન રસ્તા પરથી જ એમ્બ્યુલન્સ દ્વારા સીધું મેચિંગ સક્રિય થાય છે।',
        card3Title: 'રાષ્ટ્રીય રક્તદાતા રજિસ્ટ્રી',
        card3Desc: 'દુર્લભ રક્ત પ્રકારો માટે ડ્રોન ડિલિવરી લોજિસ્ટિક્સને સક્ષમ કરતી એકીકૃત ક્રોસ-સ્ટેટ એલર્ટ ગ્રીડ।'
      },

        hero: {
          titleLine1: 'રક્ત શોધવું જીવન બચાવે છે.',
          titleLine2: 'બ્લડબ્રિજ AI તેને ઝડપથી શોધે છે.',
          subtitle: 'રીયલ-ટાઇમ સ્પેસિયલ AI અલ્ગોરિધમ્સનો ઉપયોગ કરીને સેકન્ડોમાં રક્તદાતાઓ, હોસ્પિટલો અને કટોકટી વિનંતીઓને જોડવી. કોઈ વિલંબ નહીં. મહત્તમ પ્રભાવ.',
          ctaRegister: 'દાતા તરીકે નોંધણી કરો',
          ctaRequest: 'રક્તની વિનંતી કરો',
          ctaDemo: 'ડેમો જુઓ',
          activeRequest: 'ઇમરજન્સી વિનંતી',
          matching: 'AI મેચિંગ સક્રિય... 84 નજીકના દાતાઓને જાણ કરવામાં આવી',
          unitsNeeded: 'સિટી હોસ્પિટલમાં O- નેગેટિવની જરૂર છે'
        },
        stats: {
          donors: 'નોંધાયેલા રક્તદાતાઓ',
          hospitals: 'જોડાયેલી હોસ્પિટલો',
          requests: 'ઇમરજન્સી વિનંતીઓ',
          lives: 'બચેલા જીવ',
          matchTime: 'સરેરાશ મેચ સમય'
        },
        features: {
          title: 'AI સાથે રક્ત વ્યવસ્થાપનમાં ક્રાંતિ',
          subtitle: 'અમારી સિસ્ટમ કેવી રીતે સુનિશ્ચિત કરે છે કે કોઈપણ વિનંતી અધૂરી ન રહે.',
          items: {
            ai: {
              title: 'સ્માર્ટ AI મેચિંગ',
              desc: 'અમારું પ્રિડિક્ટિવ રાઉટિંગ વિનંતીઓને મિલિસેકન્ડમાં યોગ્ય દાતાઓ સાથે જોડે છે.'
            },
            alerts: {
              title: 'ઇમરજન્સી એલર્ટ્સ',
              desc: 'ઉચ્ચ-પ્રાથમિકતા ધરાવતા દાતા વર્તુળોને તાત્કાલિક પુશ અને એસએમએસ ચેતવણીઓ.'
            },
            verified: {
              title: 'ચકાસાયેલ દાતાઓ',
              desc: 'લોહીની સલામતી સુનિશ્ચિત કરવા માટે કડક દાતા પ્રોફાઇલિંગ અને મેડિકલ લોગ સિંક્રનાઇઝેશન.'
            },
            dashboard: {
              title: 'હોસ્પિટલ ડેશબોર્ડ',
              desc: 'રીયલ-ટાઇમ બ્લડ બેંક સ્ટેટસ, અંદાજિત સ્ટોક મેટ્રિક્સ અને રિકવેસ્ટ ટ્રેકર્સ.'
            },
            tracking: {
              title: 'રીયલ-ટાઇમ ટ્રેકિંગ',
              desc: 'લાઇવ ડોનર ડિસ્પેચ મેપ બતાવે છે કે મદદ ક્યારે અને ક્યાં પહોંચી રહી છે.'
            },
            inventory: {
              title: 'રક્ત ઇન્વેન્ટરી',
              desc: 'રિઝર્વની તાત્કાલિક તપાસ કરવા માટે હોસ્પિટલના બ્લડ બેંકો સાથે લાઇવ ક્લાઉડ એનાલિટિક્સ સમન્વય.'
            },
            rare: {
              title: 'દુર્લભ બ્લડ એલર્ટ',
              desc: 'અતિ-દુર્લભ રક્ત ફેનોટાઇપ માટે વિશેષ કતારો અને સ્વચાલિત આઉટરીચ.'
            },
            predictive: {
              title: 'અનુમાનિત વિશ્લેષણ',
              desc: 'AI મોસમી માંગના વધારાની આગાહી કરે છે, જેથી કટોકટી પહેલા સ્ટોક ભરી શકાય.'
            }
          }
        },
        workflow: {
          title: 'બ્લડબ્રિજ AI મેચિંગ પ્રોટોકોલ',
          subtitle: 'એક હોસ્પિટલ કટોકટીથી લઈને થોડી જ મિનિટોમાં ખાતરીપૂર્વકના દાન સુધી.',
          steps: {
            step1: 'હોસ્પિટલ વિનંતી',
            step2: 'AI વિશ્લેષણ',
            step3: 'સ્થાન ફિલ્ટરિંગ',
            step4: 'તબીબી યોગ્યતા',
            step5: 'ઉપલબ્ધતા તપાસ',
            step6: 'પ્રાથમિકતા રેન્કિંગ',
            step7: 'શ્રેષ્ઠ દાતા પસંદગી',
            step8: 'લાઇવ નોટિફિકેશન',
            step9: 'સફળ દાન'
          }
        },
        faq: {
          title: 'વારંવાર પૂછાતા પ્રશ્નો',
          subtitle: 'બ્લડબ્રિજ AI કેવી રીતે કાર્ય કરે છે તે વિશે વધુ જાણો.',
          q1: 'AI મેચિંગ કેવી રીતે કાર્ય કરે છે?',
          a1: 'અમારું AI અંતર, પ્રવાસની સ્થિતિ, દાતાની ઉપલબ્ધતા અને યોગ્યતા જેવા પરિબળોનું વિશ્લેષણ કરે છે જેથી શ્રેષ્ઠ સંભવિત દાતાઓને એલર્ટ મોકલી શકાય.',
          q2: 'શું બ્લડબ્રિજ AI હોસ્પિટલો માટે મફત છે?',
          a2: 'હા, ઇમરજન્સી હેલ્થકેર એક્સેસ સુનિશ્ચित કરવા માટે રજિસ્ટર્ડ સરકારી અને ચેરિટી હોસ્પિટલો માટે મૂળભૂત એકીકરણ તદ્દન મફત છે.',
          q3: 'દાતાના તબીબી રેકોર્ડ્સ કેવી રીતે સુરક્ષિત રાખવામાં આવે છે?',
          a3: 'અમે મેડિકલ લોગ્સ અને લોકેશનને સુરક્ષિત રાખવા માટે HIPAA નિયમો અનુસાર અદ્યતન એન્ક્રિપ્શનનો ઉપયોગ કરીએ છીએ.',
          q4: 'દાતા તરીકે નોંધણી કરવા માટે કોણ પાત્ર છે?',
          a4: '૧૮ થી ૬૫ વર્ષની વય ધરાવતી, ૪૫ કિલોથી વધુ વજન ધરાવતી, અને છેલ્લા ૯૦ દિવસમાં રક્તદાન ન કર્યું હોય તેવી કોઈપણ તંદુરસ્ત વ્યક્તિ.'
        },
        contact: {
          title: 'અમારા ઇમરજન્સી ડેસ્કનો સંપર્ક કરો',
          subtitle: 'સિસ્ટમ એકીકરણ અથવા સહાયતા પ્રશ્નો માટે સંપર્ક કરો.',
          name: 'તમારું નામ',
          email: 'તમારું ઇમેઇલ',
          message: 'અમે તમને કેવી રીતે મદદ કરી શકીએ?',
          send: 'ઇમરજન્સી પૂછપરછ મોકલો',
          address: 'બ્લડબ્રિજ AI હેડક્વાર્ટર, સેક્ટર ૫, ટેક સિટી, ભારત',
          phone: '+૧ (૮૦૦) ૫૫૫-BLOOD'
        }
      },
      auth: {
        signInTitle: 'બ્લડબ્રિજ AI માં લોગિન કરો',
        signUpTitle: 'હેલ્થકેર એકાઉન્ટ બનાવો',
        socialText: 'અથવા Google સાથે આગળ વધો',
        remember: 'મને યાદ રાખો',
        forgot: 'પાસવર્ડ ભૂલી ગયા છો?',
        noAccount: 'એકાઉન્ટ નથી?',
        haveAccount: 'પહેલેથી જ એકાઉન્ટ છે?',
        emailLabel: 'ઇમેઇલ સરનામું',
        passLabel: 'પાસવર્ડ',
        nameLabel: 'પૂરું નામ',
        roleLabel: 'હું એક...',
        registerButton: 'એકાઉન્ટ બનાવો',
        loginButton: 'લોગિન કરો',
        securing: 'કનેક્શન સુરક્ષિત કરી રહ્યું છે...'
      },
      dashboard: {
        overview: 'ઝાંખી',
        requests: 'રક્ત વિનંતીઓ',
        inventory: 'લાઇવ સ્ટોક',
        donorSearch: 'દાતા શોધો',
        eligibility: 'દાતા પાત્રતા',
        settings: 'સેટિંગ્સ',
        alertHeading: 'સક્રિય કટોકटी ચેતવણીઓ',
        analyticsTitle: 'સમય સાથે મેચ રેટ',
        recentActivity: 'તાજેતરની પ્રવૃત્તિ લોગ',
        newRequestBtn: 'ઇમરજન્सी વિનંતી બનાવો',
        donateBtn: 'દાન શેડ્યૂલ કરો',
        verifyBtn: 'દાતા ચકાસો'
      }
    }
  },
  mr: {
    translation: {
      common: {
        appName: 'ब्लडब्रिज AI',
        login: 'लॉगिन',
        register: 'नोंदणी',
        logout: 'लॉगआउट',
        dashboard: 'डॅशबोर्ड',
        home: 'मुख्य पृष्ठ',
        features: 'वैशिष्ट्ये',
        about: 'आमच्याबद्दल',
        faq: 'वारंवार विचारले जाणारे प्रश्न',
        contact: 'संपर्क',
        submit: 'सादर करा',
        cancel: 'रद्द करा',
        loading: 'लोड होत आहे...',
        success: 'यशस्वी',
        error: 'त्रुटी',
        backToTop: 'वर जा',
        allRightsReserved: 'सर्व हक्क राखीव.',
        emergency: 'आणीबाणी चेतावणी',
        bloodGroup: 'रक्त गट',
        status: 'स्थिती',
        action: 'कृती',
        notifications: 'सूचना',
        welcome: 'स्वागत आहे',
        howItWorks: 'हे कसे कार्य करते',
        forHospitals: 'रुग्णालयांसाठी',
        forDonors: 'रक्तदात्यांसाठी',
        impact: 'प्रभाव',
        request: 'विनंती',
        roles: {
          hospital: 'रुग्णालय',
          donor: 'रक्तदाता',
          admin: 'सिस्टम ॲडमिन'
        }
      },
      languageSelect: {
        title: 'तुमची भाषा निवडा',
        subtitle: 'तुमचा आरोग्य सेवा अनुभव सानुकूलित करण्यासाठी तुमची आवडती भाषा निवडा.',
        continue: 'पुढे जा'
      },
      landing: {
      saas: {
        tag: 'SaaS पॅनेल',
        title: 'रुग्णालये आणि रक्तदात्यांसाठी बनवलेले प्रीमियम पॅनेल्स',
        desc: 'रुग्णालयांना संपूर्ण रक्तदाता उपलब्धता टाइमलाइन, लाइव्ह डिस्पॅचर नकाशे आणि भविष्यसूचक इन्व्हेंटरी चेतावणी मिळतात. रक्तदाते शेड्युलिंग पोर्टल, वैद्यकीय पात्रता चाचण्या आणि डिजिटल बॅज मेट्रिक्सचा आनंद घेतात.',
        feat1: '10 किमीच्या आत लाइव्ह स्थान मॅचिंग',
        feat2: 'भागीदार क्लिनिकसह एक-क्लिक शेड्युलिंग',
        feat3: 'AI द्वारे समर्थित भविष्यसूचक साठा पुनर्भरण रांगा',
        cta: 'डॅशबोर्ड पॅनेल एक्सप्लोर करा',
        mockTitle: 'मेट्रो क्लिनिक ॲडमिन',
        mockCritical: 'गंभीर साठा',
        mockActiveAlerts: 'सक्रिय चेतावणी',
        mockTotalDonors: 'एकूण रक्तदाते मॅच',
        mockSuccess: 'मॅच यश',
        mockWeeklyIncrease: '↑ या आठवड्यात 12%',
        mockStable: 'अत्यंत स्थिर',
        mockReplenishment: 'साठा पुनर्भरण दर (गेले 30 दिवस)'
      },
      process: {
        title: 'सोपी 3-चरण प्रक्रिया',
        subtitle: 'ब्लडब्रिज AI आणीबाणीमध्ये रक्ताच्या विनंत्यांना कसे सुलभ करते.',
        step1Title: 'विनंती केली जाते',
        step1Desc: 'रुग्णालय आमच्या सुरक्षित क्लाउड पॅनेलद्वारे आणीबाणी रक्ताची विनंती सादर करते.',
        step2Title: 'AI विश्लेषण आणि अलर्ट',
        step2Desc: 'जिओलोकेशन अल्गोरिदम जवळील सक्रिय, पात्र दात्यांना शोधून एसएमएस आणि पुश सूचना पाठवतो.',
        step3Title: 'रक्तदान वितरित होते',
        step3Desc: 'दाता स्वीकारतो, प्रवास करतो आणि दान करतो, ज्यामुळे स्थानिक रक्त साठा नोंद आपोआप अपडेट होते.'
      },
      testimonials: {
        title: 'वैद्यकीय समुदायाद्वारे विश्वसनीय',
        subtitle: 'डॉक्टर, दाता आणि रुग्णालय प्रशासकांचे वास्तविक अनुभव.',
        card1Desc: '"आम्हाला दुर्मिळ AB- रक्ताची आवश्यकता होती. ब्लडब्रिज AI ने अवघ्या 10 सेकंदात 8 मॅच दात्यांना सूचित केले. दाता 30 मिनिटांपेक्षा कमी वेळात आमच्या आयसीयूमध्ये पोहोचला. आश्चर्यकारक सेवा!"',
        card1Role: 'आयसीयू प्रमुख, मेट्रो रुग्णालय',
        card2Desc: '"नोंदणी करणे अत्यंत सोपे होते. एसएमएस डिस्पॅचमध्ये प्रवासाचा मार्ग आणि हॉस्पिटल गेट कोड स्पष्ट दिसतो. माझे प्रभाव मेट्रिक्स पाहिल्याने मला प्रेरणा मिळते."',
        card2Role: 'O+ सक्रिय दाता, 8 दाने',
        card3Desc: '"ब्लडब्रिज AI जोडल्याने आमच्या साठा तपासणीच्या अडचणी पूर्णपणे दूर झाल्या. आमचा रक्त राखीव डेटा स्वयंचलितपणे सिंक होतो, ज्यामुळे मॅचिंगमधील विलंब अर्धा झाला आहे."',
        card3Role: 'ब्लड बँक ऑपरेशन्स प्रमुख',
      },
      future: {
        title: 'भविष्यातील प्रमाण आणि राष्ट्रीय दृष्टीकोन',
        subtitle: 'राज्यस्तरीय आपत्ती व्यवस्थापन यंत्रणेसोबत एकात्मिक होण्याचा आमचा तांत्रिक रोडमॅप.',
        card1Title: 'शासकीय एकात्मता',
        card1Desc: 'प्रमाणित वैद्यकीय इतिहासासाठी राष्ट्रीय डिजिटल आरोग्य आयडी ग्रिडसह थेट सिंक.',
        card2Title: 'रुग्णवाहिका डिस्पॅच',
        card2Desc: 'महत्त्वाच्या वाहतुकीदरम्यान रस्त्यावरील रुग्णवाहिकेवरून थेट लाइव्ह आपत्कालीन मॅचिंग ट्रिगर होते.',
        card3Title: 'राष्ट्रीय दाता नोंदणी',
        card3Desc: 'एक युनिफाइड क्रॉस-स्टेट अलर्ट ग्रिड जी दुर्मिळ रक्त प्रकारांसाठी ड्रोन वितरण सक्षम करते.'
      },

        hero: {
          titleLine1: 'रक्त शोधणे जीवन वाचवते.',
          titleLine2: 'ब्लडब्रिज AI ते वेगाने शोधते.',
          subtitle: 'रिअल-टाइम स्पेशल AI अल्गोरिदमचा वापर करून सेकंदात रक्तदाते, रुग्णालये आणि आणीबाणीच्या विनंत्यांना जोडणे. कोणताही विलंब नाही. कमाल प्रभाव.',
          ctaRegister: 'रक्तदाता म्हणून नोंदणी करा',
          ctaRequest: 'रक्ताची विनंती करा',
          ctaDemo: 'डेमो पहा',
          activeRequest: 'आणीबाणी विनंती',
          matching: 'AI मॅचिंग सक्रिय... ८४ जवळच्या रक्तदात्यांना सूचित केले',
          unitsNeeded: 'सिटी हॉस्पिटलमध्ये O- नेगेटिव्ह आवश्यक आहे'
        },
        stats: {
          donors: 'नोंदणीकृत रक्तदाते',
          hospitals: 'जोडलेली रुग्णालये',
          requests: 'आणीबाणी विनंत्या',
          lives: 'वाचवलेले प्राण',
          matchTime: 'सरासरी मॅच वेळ'
        },
        features: {
          title: 'AI सह रक्त पुरवठा साखळीत क्रांती',
          subtitle: 'आमची यंत्रणा हे कसे सुनिश्चित करते की कोणतीही विनंती अनुत्तरीत राहणार नाही.',
          items: {
            ai: {
              title: 'स्मार्ट AI मॅचिंग',
              desc: 'आमचे प्रेडिक्टिव्ह राउटिंग विनंत्यांना मिलिसेकंदात पात्र रक्तदात्यांशी जोडते.'
            },
            alerts: {
              title: 'आणीबाणीच्या सूचना',
              desc: 'उच्च-प्राधान्य दात्याच्या मंडळांना त्वरित पुश आणि एसएमएस सूचना पाठवल्या जातात.'
            },
            verified: {
              title: 'सत्यापित दाते',
              desc: 'रक्त सुरक्षिततेसाठी कठोर दाता प्रोफाइलिंग आणि वैद्यकीय लॉग सिंक्रोनाइझेशन.'
            },
            dashboard: {
              title: 'हॉस्पिटल डॅशबोर्ड',
              desc: 'रिअल-टाइम ब्लड बँक स्थिती, अंदाज स्टॉक मेट्रिक्स आणि विनंती ट्रॅकर्स.'
            },
            tracking: {
              title: 'रिअल-टाइम ट्रॅकिंग',
              desc: 'लाइव्ह डोनर डिस्पॅच नकाशे दाखवतात की मदत कधी आणि कुठे पोहोचत आहे.'
            },
            inventory: {
              title: 'रक्त साठा व्यवस्थापन',
              desc: 'राखीव साठा त्वरित तपासण्यासाठी हॉस्पिटलच्या ब्लड बँकांशी थेट क्लाउड विश्लेषण सिंक.'
            },
            rare: {
              title: 'दुर्लभ रक्त चेतावणी',
              desc: 'अति-दुर्लभ रक्त फेनोटाइपसाठी विशेष रांगा आणि स्वयंचलित पोहोच.'
            },
            predictive: {
              title: 'भविष्यसूचक विश्लेषण',
              desc: 'AI हंगामी मागणी वाढीचा अंदाज लावते, ज्यामुळे प्रतिबंधात्मक साठा मोहीम राबवता येते.'
            }
          }
        },
        workflow: {
          title: 'ब्लडब्रिज AI मॅचिंग प्रोटोकॉल',
          subtitle: 'हॉस्पिटलमधील आणीबाणीपासून अवघ्या काही मिनिटांत दान निश्चितीपर्यंत.',
          steps: {
            step1: 'रुग्णालय विनंती',
            step2: 'AI विश्लेषण',
            step3: 'स्थान गाळणे',
            step4: 'वैद्यकीय पात्रता',
            step5: 'उपलब्धता तपासणी',
            step6: 'प्राधान्य क्रमवारी',
            step7: 'सर्वोत्तम दाता निवड',
            step8: 'लाइव्ह सूचना',
            step9: 'यशस्वी रक्तदान'
          }
        },
        faq: {
          title: 'नेहमी विचारले जाणारे प्रश्न',
          subtitle: 'ब्लडब्रिज AI कसे कार्य करते याबद्दल अधिक जाणून घ्या.',
          q1: 'AI मॅचिंग कसे कार्य करते?',
          a1: 'आमचे AI अंतर, प्रवासाची परिस्थिती, दाताची उपलब्धता आणि पात्रता कालावधी यासारख्या घटकांचे विश्लेषण करून दात्यांना अलर्ट पाठवते.',
          q2: 'ब्लडब्रिज AI रुग्णालयांसाठी मोफत आहे का?',
          a2: 'होय, आणीबाणीच्या आरोग्य सेवांमध्ये प्रवेश सुलभ करण्यासाठी नोंदणीकृत सार्वजनिक आणि सेवाभावी रुग्णालयांसाठी मूलभूत एकत्रीकरण पूर्णपणे विनामूल्य आहे.',
          q3: 'दात्याच्या आरोग्याच्या नोंदी कशा सुरक्षित केल्या जातात?',
          a3: 'आम्ही वैद्यकीय नोंदी आणि स्थान सुरक्षित करण्यासाठी HIPAA नियमांनुसार अत्याधुनिक एन्क्रिप्शन वापरतो.',
          q4: 'रक्तदाता म्हणून नोंदणी करण्यासाठी कोण पात्र आहे?',
          a4: '१८ ते ६५ वर्षे वयोगटातील, ४५ किलोपेक्षा जास्त वजन असलेले आणि गेल्या ९० दिवसांत रक्तदान न केलेले कोणतेही निरोगी व्यक्ती.'
        },
        contact: {
          title: 'आमच्या आपत्कालीन डेस्कशी संपर्क साधा',
          subtitle: 'सिस्टम एकत्रीकरण किंवा इतर चौकशीसाठी संपर्क साधा.',
          name: 'तुमचे नाव',
          email: 'तुमचा ईमेल',
          message: 'आम्ही तुम्हाला कशी मदत करू शकतो?',
          send: 'आपत्कालीन चौकशी पाठवा',
          address: 'ब्लडब्रिज AI मुख्यालय, सेक्टर ५, टेक सिटी, भारत',
          phone: '+१ (८००) ५५५-BLOOD'
        }
      },
      auth: {
        signInTitle: 'ब्लडब्रिज AI मध्ये साइन इन करा',
        signUpTitle: 'आरोग्य सेवा खाते तयार करा',
        socialText: 'किंवा Google सह सुरू ठेवा',
        remember: 'माझी आठवण ठेवा',
        forgot: 'पासवर्ड विसरलात?',
        noAccount: 'खाते नाही का?',
        haveAccount: 'आधीच खाते आहे का?',
        emailLabel: 'ईमेल पत्ता',
        passLabel: 'पासवर्ड',
        nameLabel: 'पूर्ण नाव',
        roleLabel: 'मी एक...',
        registerButton: 'खाते तयार करा',
        loginButton: 'साइन इन करा',
        securing: 'कनेक्शन सुरक्षित केले जात आहे...'
      },
      dashboard: {
        overview: 'आढावा',
        requests: 'रक्ताच्या विनंत्या',
        inventory: 'लाइव्ह साठा',
        donorSearch: 'दाता शोधा',
        eligibility: 'दाता पात्रता',
        settings: 'सेटिंग्ज',
        alertHeading: 'सक्रिय आणीबाणी सूचना',
        analyticsTitle: 'मॅच रेट प्रगती',
        recentActivity: 'ताजी कृती नोंद',
        newRequestBtn: 'आणीबाणी विनंती तयार करा',
        donateBtn: 'रक्तदान नियोजित करा',
        verifyBtn: 'दाता सत्यापित करा'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
