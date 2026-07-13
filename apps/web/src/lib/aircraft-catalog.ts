export type AircraftSpec = { label: string; value: string };

export type AircraftEntry = {
  name: string;
  description: string;
  image: string;
  specs: AircraftSpec[];
};

/** Demo placeholders — never JetBay CDN (blocked) or JetVina promo art. */
const DEMO = [
  '/placeholders/demo/aircraft-01.svg',
  '/placeholders/demo/aircraft-02.svg',
  '/placeholders/demo/aircraft-03.svg',
] as const;

function demoImage(i: number): string {
  return DEMO[i % DEMO.length]!;
}

/** Popular jets — specs from jet-bay.com private-jet-charter JSON-LD */
export const AIRCRAFT_FLEET: AircraftEntry[] = [
  {
    name: 'Phenom 300',
    description:
      'Best-selling light jet. Class-leading speed and BMW-designed interior for premier regional jet charter.',
    image: demoImage(0),
    specs: [
      { label: 'Passengers', value: '7' },
      { label: 'Range', value: '1,971 nm' },
      { label: 'Cruising Speed', value: '453 kts' },
      { label: 'Cabin Height', value: '4.9 ft' },
    ],
  },
  {
    name: 'Citation XLS',
    description:
      'Popular midsize jet. Features a spacious stand-up cabin and agile runway access for seamless private jet charter.',
    image: demoImage(1),
    specs: [
      { label: 'Passengers', value: '8' },
      { label: 'Range', value: '1,858 nm' },
      { label: 'Cruising Speed', value: '441 kts' },
      { label: 'Cabin Height', value: '5.7 ft' },
    ],
  },
  {
    name: 'Challenger 350',
    description:
      'Top super-midsize jet. Wide flat-floor cabin and coast-to-coast range for a seamless premium private flight.',
    image: demoImage(2),
    specs: [
      { label: 'Passengers', value: '10' },
      { label: 'Range', value: '3,200 nm' },
      { label: 'Cruising Speed', value: '470 kts' },
      { label: 'Cabin Height', value: '6 ft' },
    ],
  },
  {
    name: 'Citation Latitude',
    description:
      'Top midsize business jet. Boasts a flat-floor, stand-up cabin for transcontinental travel with a quiet luxury aesthetic.',
    image: demoImage(0),
    specs: [
      { label: 'Passengers', value: '9' },
      { label: 'Range', value: '2,700 nm' },
      { label: 'Cruising Speed', value: '446 kts' },
      { label: 'Cabin Height', value: '6 ft' },
    ],
  },
  {
    name: 'Gulfstream G650ER',
    description:
      'Flagship ultra-long-range jet. Unmatched range and cabin comfort for intercontinental private travel.',
    image: demoImage(1),
    specs: [
      { label: 'Passengers', value: '19' },
      { label: 'Range', value: '7,500 nm' },
      { label: 'Cruising Speed', value: '516 kts' },
      { label: 'Cabin Height', value: '6.3 ft' },
    ],
  },
  {
    name: 'Global 6000',
    description:
      'Ultra-long-range business jet with a spacious cabin and exceptional range for global missions.',
    image: demoImage(2),
    specs: [
      { label: 'Passengers', value: '17' },
      { label: 'Range', value: '6,000 nm' },
      { label: 'Cruising Speed', value: '488 kts' },
      { label: 'Cabin Height', value: '6.2 ft' },
    ],
  },
  {
    name: 'Praetor 600',
    description:
      'Super-midsize jet with transatlantic range and a refined cabin for executive travel.',
    image: demoImage(0),
    specs: [
      { label: 'Passengers', value: '12' },
      { label: 'Range', value: '4,018 nm' },
      { label: 'Cruising Speed', value: '466 kts' },
      { label: 'Cabin Height', value: '6 ft' },
    ],
  },
];
