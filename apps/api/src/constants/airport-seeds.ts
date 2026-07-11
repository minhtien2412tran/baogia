/** Global private-aviation airports — upserted by prisma seed */

export type AirportSeed = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
};

export const GLOBAL_AIRPORT_SEEDS: AirportSeed[] = [
  // Vietnam
  { iata: 'SGN', icao: 'VVTS', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  { iata: 'HAN', icao: 'VVNB', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  { iata: 'CXR', icao: 'VVCR', name: 'Cam Ranh International Airport', city: 'Nha Trang', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  { iata: 'DAD', icao: 'VVDN', name: 'Da Nang International Airport', city: 'Da Nang', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  { iata: 'HUI', icao: 'VVPH', name: 'Phu Bai International Airport', city: 'Hue', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  // UK
  { iata: 'LTN', icao: 'EGGW', name: 'London Luton Airport', city: 'London', country: 'UK', timezone: 'Europe/London' },
  { iata: 'FAB', icao: 'EGLF', name: 'Farnborough Airport', city: 'London', country: 'UK', timezone: 'Europe/London' },
  { iata: 'LCY', icao: 'EGLC', name: 'London City Airport', city: 'London', country: 'UK', timezone: 'Europe/London' },
  // France
  { iata: 'LBG', icao: 'LFPB', name: 'Paris Le Bourget Airport', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { iata: 'NCE', icao: 'LFMN', name: "Nice Cote d'Azur Airport", city: 'Nice', country: 'France', timezone: 'Europe/Paris' },
  { iata: 'MRS', icao: 'LFML', name: 'Marseille Provence Airport', city: 'Marseille', country: 'France', timezone: 'Europe/Paris' },
  { iata: 'TLS', icao: 'LFBO', name: 'Toulouse-Blagnac Airport', city: 'Toulouse', country: 'France', timezone: 'Europe/Paris' },
  { iata: 'LYS', icao: 'LFLL', name: 'Lyon-Saint Exupery Airport', city: 'Lyon', country: 'France', timezone: 'Europe/Paris' },
  // Switzerland
  { iata: 'GVA', icao: 'LSGG', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', timezone: 'Europe/Zurich' },
  { iata: 'ZRH', icao: 'LSZH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich' },
  // USA — private jet hubs
  { iata: 'VNY', icao: 'KVNY', name: 'Van Nuys Airport', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { iata: 'LAS', icao: 'KLAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'USA', timezone: 'America/Los_Angeles' },
  { iata: 'TEB', icao: 'KTEB', name: 'Teterboro Airport', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { iata: 'OPF', icao: 'KOPF', name: 'Miami-Opa Locka Executive Airport', city: 'Miami', country: 'USA', timezone: 'America/New_York' },
  { iata: 'IAD', icao: 'KIAD', name: 'Washington Dulles International Airport', city: 'Washington', country: 'USA', timezone: 'America/New_York' },
  { iata: 'PBI', icao: 'KPBI', name: 'Palm Beach International Airport', city: 'Palm Beach', country: 'USA', timezone: 'America/New_York' },
  { iata: 'DAL', icao: 'KDAL', name: 'Dallas Love Field', city: 'Dallas', country: 'USA', timezone: 'America/Chicago' },
  { iata: 'APA', icao: 'KAPA', name: 'Centennial Airport', city: 'Denver', country: 'USA', timezone: 'America/Denver' },
  { iata: 'SFO', icao: 'KSFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA', timezone: 'America/Los_Angeles' },
  { iata: 'BOS', icao: 'KBOS', name: 'Boston Logan International Airport', city: 'Boston', country: 'USA', timezone: 'America/New_York' },
  { iata: 'FLL', icao: 'KFLL', name: 'Fort Lauderdale International Airport', city: 'Fort Lauderdale', country: 'USA', timezone: 'America/New_York' },
  // Asia-Pacific hubs
  { iata: 'SIN', icao: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { iata: 'HKG', icao: 'VHHH', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { iata: 'NRT', icao: 'RJAA', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { iata: 'HND', icao: 'RJTT', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { iata: 'BKK', icao: 'VTBS', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { iata: 'DXB', icao: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { iata: 'PVG', icao: 'ZSPD', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { iata: 'PEK', icao: 'ZBAA', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China', timezone: 'Asia/Shanghai' },
  // Europe
  { iata: 'FRA', icao: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin' },
  { iata: 'MUC', icao: 'EDDM', name: 'Munich Airport', city: 'Munich', country: 'Germany', timezone: 'Europe/Berlin' },
  { iata: 'MXP', icao: 'LIMC', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', timezone: 'Europe/Rome' },
  { iata: 'FCO', icao: 'LIRF', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { iata: 'MAD', icao: 'LEMD', name: 'Adolfo Suarez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { iata: 'BCN', icao: 'LEBL', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', timezone: 'Europe/Madrid' },
];
