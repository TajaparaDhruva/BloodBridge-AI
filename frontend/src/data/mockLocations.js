// Mock Indian cities with coordinates and metadata
export const INDIAN_CITIES = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.877, timezone: 'IST' },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.704, lng: 77.102, timezone: 'IST' },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', lat: 12.971, lng: 77.594, timezone: 'IST' },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.486, timezone: 'IST' },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.083, lng: 80.270, timezone: 'IST' },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.572, lng: 88.363, timezone: 'IST' },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.520, lng: 73.857, timezone: 'IST' },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', lat: 23.022, lng: 72.571, timezone: 'IST' },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.913, lng: 75.787, timezone: 'IST' },
  { id: 'surat', name: 'Surat', state: 'Gujarat', lat: 21.170, lng: 72.831, timezone: 'IST' },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.846, lng: 80.946, timezone: 'IST' },
  { id: 'kanpur', name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.449, lng: 80.331, timezone: 'IST' },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', lat: 21.145, lng: 79.088, timezone: 'IST' },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', lat: 22.719, lng: 75.857, timezone: 'IST' },
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.259, lng: 77.412, timezone: 'IST' },
  { id: 'patna', name: 'Patna', state: 'Bihar', lat: 25.594, lng: 85.137, timezone: 'IST' },
  { id: 'vadodara', name: 'Vadodara', state: 'Gujarat', lat: 22.307, lng: 73.181, timezone: 'IST' },
  { id: 'ghaziabad', name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.669, lng: 77.453, timezone: 'IST' },
  { id: 'ludhiana', name: 'Ludhiana', state: 'Punjab', lat: 30.900, lng: 75.857, timezone: 'IST' },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.017, lng: 76.955, timezone: 'IST' },
];

// Reverse geocode simulation: given lat/lng find nearest city
export const reverseGeocode = (lat, lng) => {
  let nearest = INDIAN_CITIES[0];
  let minDist = Infinity;
  for (const city of INDIAN_CITIES) {
    const d = Math.sqrt(Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2));
    if (d < minDist) { minDist = d; nearest = city; }
  }
  return nearest;
};

export const WEATHER_MOCK = {
  mumbai: { temp: 32, condition: 'Partly Cloudy', humidity: 78, icon: '⛅' },
  delhi: { temp: 41, condition: 'Clear & Sunny', humidity: 25, icon: '☀️' },
  bangalore: { temp: 27, condition: 'Pleasant', humidity: 62, icon: '🌤️' },
  hyderabad: { temp: 36, condition: 'Hot & Clear', humidity: 40, icon: '☀️' },
  chennai: { temp: 34, condition: 'Humid', humidity: 82, icon: '🌥️' },
  kolkata: { temp: 33, condition: 'Overcast', humidity: 75, icon: '☁️' },
  pune: { temp: 29, condition: 'Breezy', humidity: 55, icon: '🌬️' },
  ahmedabad: { temp: 38, condition: 'Very Hot', humidity: 30, icon: '🌡️' },
  default: { temp: 31, condition: 'Clear', humidity: 55, icon: '☀️' },
};
