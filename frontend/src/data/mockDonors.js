// Extended donor dataset with AI matching fields
const getCenterCoords = () => {
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.lat && parsed.lng) {
          return { lat: parsed.lat, lng: parsed.lng };
        }
      }
    } catch (e) {}
  }
  return { lat: 19.076, lng: 72.877 }; // fallback center (Mumbai)
};

export const NEARBY_DONORS = [
  {
    id: 'ND-001',
    name: 'Rajesh Kumar',
    bloodGroup: 'O-',
    age: 29,
    weight: 74,
    distance: 0.8,
    eta: '3 min',
    lastDonation: '2026-03-15',
    daysSinceLastDonation: 114,
    responseRating: 4.9,
    availability: 'Available Now',
    availabilityStatus: 'available',
    aiScore: 97,
    matchPercent: 98,
    city: 'Mumbai',
    contact: '+91 98765 43210',
    verified: true,
    eligibility: 'eligible',
    totalDonations: 8,
    badges: ['Super Donor', 'Rapid Responder'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat - 0.004, lng: center.lng - 0.007 };
    },
  },
  {
    id: 'ND-002',
    name: 'Priya Patel',
    bloodGroup: 'A+',
    age: 25,
    weight: 58,
    distance: 1.4,
    eta: '5 min',
    lastDonation: '2026-04-10',
    daysSinceLastDonation: 88,
    responseRating: 4.7,
    availability: 'Available Now',
    availabilityStatus: 'available',
    aiScore: 91,
    matchPercent: 94,
    city: 'Mumbai',
    contact: '+91 91234 56789',
    verified: true,
    eligibility: 'eligible',
    totalDonations: 5,
    badges: ['Verified Donor'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat + 0.006, lng: center.lng + 0.004 };
    },
  },
  {
    id: 'ND-003',
    name: 'Anand Joshi',
    bloodGroup: 'B+',
    age: 34,
    weight: 81,
    distance: 2.1,
    eta: '8 min',
    lastDonation: '2026-01-20',
    daysSinceLastDonation: 168,
    responseRating: 4.5,
    availability: 'Available in 2 hrs',
    availabilityStatus: 'soon',
    aiScore: 85,
    matchPercent: 88,
    city: 'Mumbai',
    contact: '+91 94567 12345',
    verified: true,
    eligibility: 'eligible',
    totalDonations: 12,
    badges: ['Regular Donor', 'Hero'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat + 0.015, lng: center.lng - 0.019 };
    },
  },
  {
    id: 'ND-004',
    name: 'Sunita Rao',
    bloodGroup: 'O+',
    age: 27,
    weight: 62,
    distance: 2.8,
    eta: '10 min',
    lastDonation: '2026-05-02',
    daysSinceLastDonation: 66,
    responseRating: 4.8,
    availability: 'Available Now',
    availabilityStatus: 'available',
    aiScore: 93,
    matchPercent: 95,
    city: 'Mumbai',
    contact: '+91 99887 76655',
    verified: true,
    eligibility: 'eligible',
    totalDonations: 6,
    badges: ['Verified Donor', 'Fast Responder'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat - 0.010, lng: center.lng - 0.012 };
    },
  },
  {
    id: 'ND-005',
    name: 'Vikram Singh',
    bloodGroup: 'AB-',
    age: 31,
    weight: 79,
    distance: 3.5,
    eta: '13 min',
    lastDonation: '2026-06-18',
    daysSinceLastDonation: 19,
    responseRating: 4.6,
    availability: 'Temporarily Unavailable',
    availabilityStatus: 'unavailable',
    aiScore: 42,
    matchPercent: 45,
    city: 'Mumbai',
    contact: '+91 98989 89898',
    verified: true,
    eligibility: 'temporary_ineligible',
    totalDonations: 9,
    badges: ['Regular Donor'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat + 0.024, lng: center.lng + 0.013 };
    },
  },
  {
    id: 'ND-006',
    name: 'Meera Krishnan',
    bloodGroup: 'B-',
    age: 28,
    weight: 55,
    distance: 4.2,
    eta: '15 min',
    lastDonation: '2025-12-05',
    daysSinceLastDonation: 214,
    responseRating: 4.3,
    availability: 'Available Now',
    availabilityStatus: 'available',
    aiScore: 88,
    matchPercent: 90,
    city: 'Mumbai',
    contact: '+91 97532 10987',
    verified: true,
    eligibility: 'eligible',
    totalDonations: 3,
    badges: ['New Donor'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat - 0.021, lng: center.lng - 0.034 };
    },
  },
  {
    id: 'ND-007',
    name: 'Deepak Nair',
    bloodGroup: 'O+',
    age: 40,
    weight: 86,
    distance: 5.0,
    eta: '18 min',
    lastDonation: '2026-02-14',
    daysSinceLastDonation: 143,
    responseRating: 4.9,
    availability: 'Available Now',
    availabilityStatus: 'available',
    aiScore: 96,
    matchPercent: 97,
    city: 'Mumbai',
    contact: '+91 93456 78901',
    verified: true,
    eligibility: 'eligible',
    totalDonations: 18,
    badges: ['Lifetime Donor', 'Super Hero'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat - 0.036, lng: center.lng - 0.017 };
    },
  },
  {
    id: 'ND-008',
    name: 'Aisha Shaikh',
    bloodGroup: 'AB+',
    age: 23,
    weight: 52,
    distance: 5.7,
    eta: '20 min',
    lastDonation: '2026-06-01',
    daysSinceLastDonation: 36,
    responseRating: 4.4,
    availability: 'Available in 3 hrs',
    availabilityStatus: 'soon',
    aiScore: 72,
    matchPercent: 76,
    city: 'Mumbai',
    contact: '+91 91111 22222',
    verified: false,
    eligibility: 'eligible',
    totalDonations: 2,
    badges: ['New Donor'],
    get coordinates() {
      const center = getCenterCoords();
      return { lat: center.lat + 0.036, lng: center.lng + 0.022 };
    },
  },
];

export const getCompatibleBloodGroups = (requestedGroup) => {
  const compatibility = {
    'O+': ['O+', 'O-'],
    'O-': ['O-'],
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'B-': ['B-', 'O-'],
    'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-'],
  };
  return compatibility[requestedGroup] || [];
};
