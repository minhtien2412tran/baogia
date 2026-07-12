/** Global private-aviation airports — upserted by prisma seed (CR Wave 1: continent + coords) */

export type AirportSeed = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  continentCode: string; // AS EU NA SA AF OC
  timezone: string;
  latitude: number;
  longitude: number;
  landingFee?: number;
  parkingFee?: number;
  overnightFee?: number;
  handlingFee?: number;
};

export const GLOBAL_AIRPORT_SEEDS: AirportSeed[] = [
  // Vietnam — AS
  { iata: 'SGN', icao: 'VVTS', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', countryCode: 'VN', continentCode: 'AS', timezone: 'Asia/Ho_Chi_Minh', latitude: 10.8188, longitude: 106.6519, landingFee: 850, parkingFee: 200, overnightFee: 350, handlingFee: 400 },
  { iata: 'HAN', icao: 'VVNB', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', countryCode: 'VN', continentCode: 'AS', timezone: 'Asia/Ho_Chi_Minh', latitude: 21.2212, longitude: 105.8072, landingFee: 800, parkingFee: 180, overnightFee: 320, handlingFee: 380 },
  { iata: 'CXR', icao: 'VVCR', name: 'Cam Ranh International Airport', city: 'Nha Trang', country: 'Vietnam', countryCode: 'VN', continentCode: 'AS', timezone: 'Asia/Ho_Chi_Minh', latitude: 11.9982, longitude: 109.2193 },
  { iata: 'DAD', icao: 'VVDN', name: 'Da Nang International Airport', city: 'Da Nang', country: 'Vietnam', countryCode: 'VN', continentCode: 'AS', timezone: 'Asia/Ho_Chi_Minh', latitude: 16.0439, longitude: 108.199 },
  { iata: 'HUI', icao: 'VVPH', name: 'Phu Bai International Airport', city: 'Hue', country: 'Vietnam', countryCode: 'VN', continentCode: 'AS', timezone: 'Asia/Ho_Chi_Minh', latitude: 16.4015, longitude: 107.7026 },
  // UK — EU
  { iata: 'LTN', icao: 'EGGW', name: 'London Luton Airport', city: 'London', country: 'UK', countryCode: 'GB', continentCode: 'EU', timezone: 'Europe/London', latitude: 51.8747, longitude: -0.3683 },
  { iata: 'FAB', icao: 'EGLF', name: 'Farnborough Airport', city: 'London', country: 'UK', countryCode: 'GB', continentCode: 'EU', timezone: 'Europe/London', latitude: 51.2758, longitude: -0.7764 },
  { iata: 'LCY', icao: 'EGLC', name: 'London City Airport', city: 'London', country: 'UK', countryCode: 'GB', continentCode: 'EU', timezone: 'Europe/London', latitude: 51.5053, longitude: 0.0553 },
  // France — EU
  { iata: 'LBG', icao: 'LFPB', name: 'Paris Le Bourget Airport', city: 'Paris', country: 'France', countryCode: 'FR', continentCode: 'EU', timezone: 'Europe/Paris', latitude: 48.9694, longitude: 2.4414 },
  { iata: 'NCE', icao: 'LFMN', name: "Nice Cote d'Azur Airport", city: 'Nice', country: 'France', countryCode: 'FR', continentCode: 'EU', timezone: 'Europe/Paris', latitude: 43.6584, longitude: 7.2159 },
  { iata: 'MRS', icao: 'LFML', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France', countryCode: 'FR', continentCode: 'EU', timezone: 'Europe/Paris', latitude: 43.4393, longitude: 5.2214 },
  { iata: 'TLS', icao: 'LFBO', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'France', countryCode: 'FR', continentCode: 'EU', timezone: 'Europe/Paris', latitude: 43.6291, longitude: 1.3638 },
  { iata: 'LYS', icao: 'LFLL', name: 'Lyon-Saint Exupery Airport', city: 'Lyon', country: 'France', countryCode: 'FR', continentCode: 'EU', timezone: 'Europe/Paris', latitude: 45.7256, longitude: 5.0811 },
  // Switzerland — EU
  { iata: 'GVA', icao: 'LSGG', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', countryCode: 'CH', continentCode: 'EU', timezone: 'Europe/Zurich', latitude: 46.2381, longitude: 6.1089 },
  { iata: 'ZRH', icao: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', countryCode: 'CH', continentCode: 'EU', timezone: 'Europe/Zurich', latitude: 47.4647, longitude: 8.5492 },
  // USA — NA
  { iata: 'VNY', icao: 'KVNY', name: 'Van Nuys Airport', city: 'Los Angeles', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/Los_Angeles', latitude: 34.2098, longitude: -118.4899 },
  { iata: 'LAS', icao: 'KLAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/Los_Angeles', latitude: 36.084, longitude: -115.1537 },
  { iata: 'TEB', icao: 'KTEB', name: 'Teterboro Airport', city: 'New York', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/New_York', latitude: 40.8501, longitude: -74.0608 },
  { iata: 'OPF', icao: 'KOPF', name: 'Miami-Opa Locka Executive Airport', city: 'Miami', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/New_York', latitude: 25.907, longitude: -80.2784 },
  { iata: 'IAD', icao: 'KIAD', name: 'Washington Dulles International Airport', city: 'Washington', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/New_York', latitude: 38.9531, longitude: -77.4565 },
  { iata: 'PBI', icao: 'KPBI', name: 'Palm Beach International Airport', city: 'Palm Beach', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/New_York', latitude: 26.6832, longitude: -80.0956 },
  { iata: 'DAL', icao: 'KDAL', name: 'Dallas Love Field', city: 'Dallas', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/Chicago', latitude: 32.8471, longitude: -96.8518 },
  { iata: 'APA', icao: 'KAPA', name: 'Centennial Airport', city: 'Denver', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/Denver', latitude: 39.5701, longitude: -104.849 },
  { iata: 'SFO', icao: 'KSFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/Los_Angeles', latitude: 37.6213, longitude: -122.379 },
  { iata: 'BOS', icao: 'KBOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/New_York', latitude: 42.3656, longitude: -71.0096 },
  { iata: 'FLL', icao: 'KFLL', name: 'Fort Lauderdale International Airport', city: 'Fort Lauderdale', country: 'USA', countryCode: 'US', continentCode: 'NA', timezone: 'America/New_York', latitude: 26.0726, longitude: -80.1527 },
  // Asia-Pacific — AS / OC
  { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', countryCode: 'SG', continentCode: 'AS', timezone: 'Asia/Singapore', latitude: 1.3644, longitude: 103.9915 },
  { iata: 'HKG', icao: 'VHHH', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', countryCode: 'HK', continentCode: 'AS', timezone: 'Asia/Hong_Kong', latitude: 22.308, longitude: 113.9185 },
  { iata: 'NRT', icao: 'RJAA', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP', continentCode: 'AS', timezone: 'Asia/Tokyo', latitude: 35.772, longitude: 140.3929 },
  { iata: 'HND', icao: 'RJTT', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JP', continentCode: 'AS', timezone: 'Asia/Tokyo', latitude: 35.5494, longitude: 139.7798 },
  { iata: 'BKK', icao: 'VTBS', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', countryCode: 'TH', continentCode: 'AS', timezone: 'Asia/Bangkok', latitude: 13.69, longitude: 100.7501 },
  { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', countryCode: 'AE', continentCode: 'AS', timezone: 'Asia/Dubai', latitude: 25.2532, longitude: 55.3657 },
  { iata: 'PVG', icao: 'ZSPD', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', countryCode: 'CN', continentCode: 'AS', timezone: 'Asia/Shanghai', latitude: 31.1443, longitude: 121.8083 },
  { iata: 'PEK', icao: 'ZBAA', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', countryCode: 'CN', continentCode: 'AS', timezone: 'Asia/Shanghai', latitude: 40.0799, longitude: 116.6031 },
  { iata: 'CAN', icao: 'ZGGG', name: 'Guangzhou Baiyun International Airport', city: 'Guangzhou', country: 'China', countryCode: 'CN', continentCode: 'AS', timezone: 'Asia/Shanghai', latitude: 23.3924, longitude: 113.2988, landingFee: 900, parkingFee: 220, overnightFee: 400, handlingFee: 450 },
  // Europe
  { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DE', continentCode: 'EU', timezone: 'Europe/Berlin', latitude: 50.0379, longitude: 8.5622 },
  { iata: 'MUC', icao: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Germany', countryCode: 'DE', continentCode: 'EU', timezone: 'Europe/Berlin', latitude: 48.3538, longitude: 11.7861 },
  { iata: 'MXP', icao: 'LIMC', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', countryCode: 'IT', continentCode: 'EU', timezone: 'Europe/Rome', latitude: 45.63, longitude: 8.7231 },
  { iata: 'FCO', icao: 'LIRF', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', countryCode: 'IT', continentCode: 'EU', timezone: 'Europe/Rome', latitude: 41.8003, longitude: 12.2389 },
  { iata: 'MAD', icao: 'LEMD', name: 'Adolfo Suarez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', countryCode: 'ES', continentCode: 'EU', timezone: 'Europe/Madrid', latitude: 40.4983, longitude: -3.5676 },
  { iata: 'BCN', icao: 'LEBL', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', countryCode: 'ES', continentCode: 'EU', timezone: 'Europe/Madrid', latitude: 41.2971, longitude: 2.0785 },
];
