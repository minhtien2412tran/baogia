/** Global private-aviation airports — upserted by prisma seed */

export type AirportSeed = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
  isBaseAirport?: boolean;
  canParkAircraft?: boolean;
  landingFee?: number;
  parkingFee?: number;
};

export const GLOBAL_AIRPORT_SEEDS: AirportSeed[] = [
  // Vietnam
  { iata: 'SGN', icao: 'VVTS', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 10.8188, lng: 106.6519, isBaseAirport: true, landingFee: 450, parkingFee: 200 },
  { iata: 'HAN', icao: 'VVNB', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 21.2212, lng: 105.8072, isBaseAirport: true, landingFee: 420, parkingFee: 180 },
  { iata: 'CXR', icao: 'VVCR', name: 'Cam Ranh International Airport', city: 'Nha Trang', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 11.9982, lng: 109.2193, landingFee: 280 },
  { iata: 'DAD', icao: 'VVDN', name: 'Da Nang International Airport', city: 'Da Nang', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 16.0439, lng: 108.1994, landingFee: 300 },
  { iata: 'HUI', icao: 'VVPH', name: 'Phu Bai International Airport', city: 'Hue', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh', lat: 16.4015, lng: 107.7026, landingFee: 220 },
  // UK
  { iata: 'LTN', icao: 'EGGW', name: 'London Luton Airport', city: 'London', country: 'UK', timezone: 'Europe/London', lat: 51.8747, lng: -0.3683, isBaseAirport: true, landingFee: 900, parkingFee: 400 },
  { iata: 'FAB', icao: 'EGLF', name: 'Farnborough Airport', city: 'London', country: 'UK', timezone: 'Europe/London', lat: 51.2757, lng: -0.7764, landingFee: 1100 },
  { iata: 'LCY', icao: 'EGLC', name: 'London City Airport', city: 'London', country: 'UK', timezone: 'Europe/London', lat: 51.5053, lng: 0.0553, landingFee: 950 },
  // France
  { iata: 'LBG', icao: 'LFPB', name: 'Paris Le Bourget Airport', city: 'Paris', country: 'France', timezone: 'Europe/Paris', lat: 48.9694, lng: 2.4414, isBaseAirport: true, landingFee: 1000, parkingFee: 450 },
  { iata: 'NCE', icao: 'LFMN', name: "Nice Cote d'Azur Airport", city: 'Nice', country: 'France', timezone: 'Europe/Paris', lat: 43.6584, lng: 7.2159, landingFee: 750 },
  { iata: 'MRS', icao: 'LFML', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France', timezone: 'Europe/Paris', lat: 43.4393, lng: 5.2214, landingFee: 600 },
  { iata: 'TLS', icao: 'LFBO', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'France', timezone: 'Europe/Paris', lat: 43.6291, lng: 1.3638, landingFee: 550 },
  { iata: 'LYS', icao: 'LFLL', name: 'Lyon-Saint Exupery Airport', city: 'Lyon', country: 'France', timezone: 'Europe/Paris', lat: 45.7256, lng: 5.0811, landingFee: 580 },
  // Switzerland
  { iata: 'GVA', icao: 'LSGG', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', timezone: 'Europe/Zurich', lat: 46.2381, lng: 6.1089, landingFee: 850 },
  { iata: 'ZRH', icao: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich', lat: 47.4647, lng: 8.5492, landingFee: 900 },
  // USA — private jet hubs
  { iata: 'VNY', icao: 'KVNY', name: 'Van Nuys Airport', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', lat: 34.2098, lng: -118.4897, landingFee: 700 },
  { iata: 'LAS', icao: 'KLAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'USA', timezone: 'America/Los_Angeles', lat: 36.084, lng: -115.1537, landingFee: 650 },
  { iata: 'TEB', icao: 'KTEB', name: 'Teterboro Airport', city: 'New York', country: 'USA', timezone: 'America/New_York', lat: 40.8501, lng: -74.0608, landingFee: 1200 },
  { iata: 'OPF', icao: 'KOPF', name: 'Miami-Opa Locka Executive Airport', city: 'Miami', country: 'USA', timezone: 'America/New_York', lat: 25.907, lng: -80.2784, landingFee: 800 },
  { iata: 'IAD', icao: 'KIAD', name: 'Washington Dulles International Airport', city: 'Washington', country: 'USA', timezone: 'America/New_York', lat: 38.9531, lng: -77.4565, landingFee: 750 },
  { iata: 'PBI', icao: 'KPBI', name: 'Palm Beach International Airport', city: 'Palm Beach', country: 'USA', timezone: 'America/New_York', lat: 26.6832, lng: -80.0956, landingFee: 700 },
  { iata: 'DAL', icao: 'KDAL', name: 'Dallas Love Field', city: 'Dallas', country: 'USA', timezone: 'America/Chicago', lat: 32.8471, lng: -96.8518, landingFee: 650 },
  { iata: 'APA', icao: 'KAPA', name: 'Centennial Airport', city: 'Denver', country: 'USA', timezone: 'America/Denver', lat: 39.5701, lng: -104.8493, landingFee: 600 },
  { iata: 'SFO', icao: 'KSFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles', lat: 37.6213, lng: -122.379, landingFee: 900 },
  { iata: 'BOS', icao: 'KBOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'USA', timezone: 'America/New_York', lat: 42.3656, lng: -71.0096, landingFee: 850 },
  { iata: 'FLL', icao: 'KFLL', name: 'Fort Lauderdale International Airport', city: 'Fort Lauderdale', country: 'USA', timezone: 'America/New_York', lat: 26.0726, lng: -80.1527, landingFee: 720 },
  // Asia-Pacific hubs
  { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3644, lng: 103.9915, isBaseAirport: true, landingFee: 800, parkingFee: 350 },
  { iata: 'HKG', icao: 'VHHH', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.308, lng: 113.9185, landingFee: 900 },
  { iata: 'NRT', icao: 'RJAA', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', lat: 35.772, lng: 140.3929, landingFee: 950 },
  { iata: 'HND', icao: 'RJTT', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', lat: 35.5494, lng: 139.7798, landingFee: 1000 },
  { iata: 'BKK', icao: 'VTBS', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok', lat: 13.69, lng: 100.7501, landingFee: 500 },
  { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', lat: 25.2532, lng: 55.3657, landingFee: 850 },
  { iata: 'PVG', icao: 'ZSPD', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai', lat: 31.1443, lng: 121.8083, landingFee: 700 },
  { iata: 'PEK', icao: 'ZBAA', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai', lat: 40.0799, lng: 116.6031, landingFee: 720 },
  // Europe
  { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin', lat: 50.0379, lng: 8.5622, landingFee: 800 },
  { iata: 'MUC', icao: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Germany', timezone: 'Europe/Berlin', lat: 48.3538, lng: 11.7861, landingFee: 780 },
  { iata: 'MXP', icao: 'LIMC', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', timezone: 'Europe/Rome', lat: 45.6306, lng: 8.7281, landingFee: 700 },
  { iata: 'FCO', icao: 'LIRF', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', timezone: 'Europe/Rome', lat: 41.8003, lng: 12.2389, landingFee: 720 },
  { iata: 'MAD', icao: 'LEMD', name: 'Adolfo Suarez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid', lat: 40.4983, lng: -3.5676, landingFee: 680 },
  { iata: 'BCN', icao: 'LEBL', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid', lat: 41.2971, lng: 2.0785, landingFee: 690 },
];
