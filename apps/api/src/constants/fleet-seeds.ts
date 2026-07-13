/** Extra operators, aircraft models & tail numbers — upserted by prisma seed */

export type OperatorSeed = {
  name: string;
  legalName?: string;
  region: string;
  country?: string;
  contactEmail?: string;
  paymentTerms?: string;
  cancellationPolicy?: string;
};

export type AircraftModelSeed = {
  manufacturer: string;
  model: string;
  categoryCode: 'LIGHT' | 'MIDSIZE' | 'HEAVY';
  rangeKm: number;
  speedKmh: number;
  sleepCapacity?: number;
};

export type AircraftInstanceSeed = {
  registration: string;
  manufacturer: string;
  model: string;
  operatorName: string;
  baseIata: string;
  currentIata?: string;
  hourlyRate: number;
  minimumBillableHours?: number;
};

export const OPERATOR_SEEDS: OperatorSeed[] = [
  {
    name: 'JetBay Asia Ops',
    legalName: 'JetBay Asia Operations Pte Ltd',
    region: 'APAC',
    country: 'Singapore',
    contactEmail: 'ops@jetbay.local',
    paymentTerms: 'Net 7',
    cancellationPolicy: '50% within 48h',
  },
  {
    name: 'JetVina Vietnam Ops',
    legalName: 'JetVina Aviation Vietnam Co., Ltd',
    region: 'APAC',
    country: 'Vietnam',
    contactEmail: 'ops@jetvina.local',
    paymentTerms: 'Net 7',
    cancellationPolicy: '50% within 48h',
  },
  {
    name: 'Pacific Charter Group',
    legalName: 'Pacific Charter Group Ltd',
    region: 'APAC',
    country: 'Hong Kong',
    contactEmail: 'dispatch@pacific-charter.local',
  },
  {
    name: 'EuroJet Partners',
    legalName: 'EuroJet Partners SAS',
    region: 'EMEA',
    country: 'France',
    contactEmail: 'ops@eurojet.local',
  },
  {
    name: 'Gulf Prestige Aviation',
    legalName: 'Gulf Prestige Aviation LLC',
    region: 'EMEA',
    country: 'United Arab Emirates',
    contactEmail: 'ops@gulfprestige.local',
    paymentTerms: 'Net 3',
  },
  {
    name: 'Sakura Private Jets',
    legalName: 'Sakura Private Jets KK',
    region: 'APAC',
    country: 'Japan',
    contactEmail: 'ops@sakura-jets.local',
  },
  {
    name: 'Americas Jet Partners',
    legalName: 'Americas Jet Partners Inc',
    region: 'AMER',
    country: 'United States',
    contactEmail: 'ops@americasjet.local',
  },
  {
    name: 'Alpine Charter Europe',
    legalName: 'Alpine Charter Europe GmbH',
    region: 'EMEA',
    country: 'Switzerland',
    contactEmail: 'ops@alpinecharter.local',
  },
];

export const AIRCRAFT_MODEL_SEEDS: AircraftModelSeed[] = [
  { manufacturer: 'Gulfstream', model: 'G650', categoryCode: 'HEAVY', rangeKm: 12964, speedKmh: 956, sleepCapacity: 6 },
  { manufacturer: 'Gulfstream', model: 'G280', categoryCode: 'MIDSIZE', rangeKm: 6667, speedKmh: 900, sleepCapacity: 0 },
  { manufacturer: 'Cessna', model: 'Citation Latitude', categoryCode: 'LIGHT', rangeKm: 5000, speedKmh: 826, sleepCapacity: 0 },
  { manufacturer: 'Cessna', model: 'Citation XLS+', categoryCode: 'LIGHT', rangeKm: 3445, speedKmh: 817, sleepCapacity: 0 },
  { manufacturer: 'Bombardier', model: 'Learjet 60', categoryCode: 'MIDSIZE', rangeKm: 4500, speedKmh: 861, sleepCapacity: 0 },
  { manufacturer: 'Bombardier', model: 'Challenger 350', categoryCode: 'MIDSIZE', rangeKm: 5926, speedKmh: 850, sleepCapacity: 0 },
  { manufacturer: 'Bombardier', model: 'Global 6000', categoryCode: 'HEAVY', rangeKm: 11112, speedKmh: 950, sleepCapacity: 8 },
  { manufacturer: 'Embraer', model: 'Phenom 300', categoryCode: 'LIGHT', rangeKm: 3650, speedKmh: 839, sleepCapacity: 0 },
  { manufacturer: 'Embraer', model: 'Praetor 600', categoryCode: 'MIDSIZE', rangeKm: 7408, speedKmh: 863, sleepCapacity: 0 },
  { manufacturer: 'Dassault', model: 'Falcon 7X', categoryCode: 'HEAVY', rangeKm: 11019, speedKmh: 900, sleepCapacity: 6 },
];

export const AIRCRAFT_INSTANCE_SEEDS: AircraftInstanceSeed[] = [
  { registration: 'B-JBAY1', manufacturer: 'Gulfstream', model: 'G650', operatorName: 'JetBay Asia Ops', baseIata: 'CAN', hourlyRate: 8500, minimumBillableHours: 2 },
  { registration: 'VN-JBA', manufacturer: 'Cessna', model: 'Citation Latitude', operatorName: 'JetVina Vietnam Ops', baseIata: 'SGN', hourlyRate: 4500, minimumBillableHours: 1 },
  { registration: 'VN-JBH', manufacturer: 'Bombardier', model: 'Learjet 60', operatorName: 'JetVina Vietnam Ops', baseIata: 'HAN', hourlyRate: 7500, minimumBillableHours: 1 },
  { registration: 'VN-JVD', manufacturer: 'Embraer', model: 'Phenom 300', operatorName: 'JetVina Vietnam Ops', baseIata: 'DAD', hourlyRate: 3800, minimumBillableHours: 1 },
  { registration: 'VN-JVP', manufacturer: 'Cessna', model: 'Citation XLS+', operatorName: 'JetVina Vietnam Ops', baseIata: 'PQC', hourlyRate: 3200, minimumBillableHours: 1 },
  { registration: '9V-JBP', manufacturer: 'Bombardier', model: 'Challenger 350', operatorName: 'Pacific Charter Group', baseIata: 'SIN', hourlyRate: 6200, minimumBillableHours: 2 },
  { registration: 'B-HKJP', manufacturer: 'Embraer', model: 'Praetor 600', operatorName: 'Pacific Charter Group', baseIata: 'HKG', hourlyRate: 6800, minimumBillableHours: 2 },
  { registration: 'JA-SKR1', manufacturer: 'Gulfstream', model: 'G280', operatorName: 'Sakura Private Jets', baseIata: 'HND', hourlyRate: 7200, minimumBillableHours: 2 },
  { registration: 'A6-GPX', manufacturer: 'Dassault', model: 'Falcon 7X', operatorName: 'Gulf Prestige Aviation', baseIata: 'DXB', hourlyRate: 9200, minimumBillableHours: 2 },
  { registration: 'A6-GPG', manufacturer: 'Bombardier', model: 'Global 6000', operatorName: 'Gulf Prestige Aviation', baseIata: 'AUH', hourlyRate: 11000, minimumBillableHours: 3 },
  { registration: 'F-EJPT', manufacturer: 'Dassault', model: 'Falcon 7X', operatorName: 'EuroJet Partners', baseIata: 'LBG', hourlyRate: 9500, minimumBillableHours: 2 },
  { registration: 'HB-ALP', manufacturer: 'Bombardier', model: 'Challenger 350', operatorName: 'Alpine Charter Europe', baseIata: 'GVA', hourlyRate: 6500, minimumBillableHours: 2 },
  { registration: 'N650AJ', manufacturer: 'Gulfstream', model: 'G650', operatorName: 'Americas Jet Partners', baseIata: 'TEB', hourlyRate: 9800, minimumBillableHours: 2 },
  { registration: 'N350AJ', manufacturer: 'Bombardier', model: 'Challenger 350', operatorName: 'Americas Jet Partners', baseIata: 'VNY', hourlyRate: 6400, minimumBillableHours: 2 },
  { registration: 'N300AJ', manufacturer: 'Embraer', model: 'Phenom 300', operatorName: 'Americas Jet Partners', baseIata: 'OPF', hourlyRate: 4100, minimumBillableHours: 1 },
  // +10 sample tails — bases near popular tourism routes
  { registration: 'F-CDG1', manufacturer: 'Dassault', model: 'Falcon 7X', operatorName: 'EuroJet Partners', baseIata: 'CDG', hourlyRate: 9400, minimumBillableHours: 2 },
  { registration: 'F-ORY1', manufacturer: 'Bombardier', model: 'Challenger 350', operatorName: 'EuroJet Partners', baseIata: 'ORY', hourlyRate: 6100, minimumBillableHours: 2 },
  { registration: 'HS-BKK1', manufacturer: 'Embraer', model: 'Phenom 300', operatorName: 'Pacific Charter Group', baseIata: 'BKK', hourlyRate: 3900, minimumBillableHours: 1 },
  { registration: 'PK-DPS1', manufacturer: 'Cessna', model: 'Citation Latitude', operatorName: 'Pacific Charter Group', baseIata: 'DPS', hourlyRate: 4300, minimumBillableHours: 1 },
  { registration: 'VN-SGN2', manufacturer: 'Bombardier', model: 'Challenger 350', operatorName: 'JetVina Vietnam Ops', baseIata: 'SGN', hourlyRate: 5800, minimumBillableHours: 1 },
  { registration: 'VN-HAN2', manufacturer: 'Embraer', model: 'Praetor 600', operatorName: 'JetVina Vietnam Ops', baseIata: 'HAN', hourlyRate: 7000, minimumBillableHours: 2 },
  { registration: 'JA-KIX1', manufacturer: 'Gulfstream', model: 'G280', operatorName: 'Sakura Private Jets', baseIata: 'KIX', hourlyRate: 7100, minimumBillableHours: 2 },
  { registration: 'B-TPE1', manufacturer: 'Embraer', model: 'Praetor 600', operatorName: 'Pacific Charter Group', baseIata: 'TPE', hourlyRate: 6900, minimumBillableHours: 2 },
  { registration: 'N-SFO1', manufacturer: 'Gulfstream', model: 'G650', operatorName: 'Americas Jet Partners', baseIata: 'SFO', hourlyRate: 9900, minimumBillableHours: 2 },
  { registration: '8Q-MLE1', manufacturer: 'Cessna', model: 'Citation XLS+', operatorName: 'Gulf Prestige Aviation', baseIata: 'MLE', hourlyRate: 3600, minimumBillableHours: 1 },
];
