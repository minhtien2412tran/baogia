export interface Airport {
  slug: string;
  title: string;
  name: string;
  code: string;
  region: string;
  image: string;
  heroImage: string;
}

export const AIRPORTS_DATA: Airport[] = [
  {
    slug: 'edmonton',
    title: 'Private Jet Charter from Edmonton (CYEG)',
    name: 'Edmonton International',
    code: 'CYEG',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?q=80&w=1600'
  },
  {
    slug: 'winnipeg',
    title: 'Private Jet Charter from Winnipeg Airport (CYWG)',
    name: 'Winnipeg Airport',
    code: 'CYWG',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1580214619429-231a473f32e9?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1580214619429-231a473f32e9?q=80&w=1600'
  },
  {
    slug: 'calgary',
    title: 'Private Jet Charter at Calgary International Airport',
    name: 'Calgary International',
    code: 'CYYC',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1601509312134-8c87930ed6de?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1601509312134-8c87930ed6de?q=80&w=1600'
  },
  {
    slug: 'teterboro',
    title: 'Private Jet Charter from Teterboro Airport (TEB)',
    name: 'Teterboro Airport',
    code: 'TEB',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1600'
  },
  {
    slug: 'dallas-love-field',
    title: 'Private Jet Charter from Dallas Love Field (KDAL)',
    name: 'Dallas Love Field',
    code: 'KDAL',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1533604107127-6f81a1795b86?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1533604107127-6f81a1795b86?q=80&w=1600'
  },
  {
    slug: 'dekalb-peachtree',
    title: 'Private Jet Charter at DeKalb-Peachtree Airport (KPDK)',
    name: 'DeKalb-Peachtree',
    code: 'KPDK',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1502021680532-838cfc650323?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1502021680532-838cfc650323?q=80&w=1600'
  },
  {
    slug: 'harry-reid',
    title: 'Private Jet Charter from Harry Reid International Airport',
    name: 'Harry Reid Airport',
    code: 'KLAS',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1600'
  },
  {
    slug: 'miami-opa-locka',
    title: 'Private Jet Charters from Miami-Opa Locka Executive Airport...',
    name: 'Miami-Opa Locka Airport',
    code: 'OPF',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=1600'
  },
  {
    slug: 'montreal-trudeau',
    title: 'Private Jet Charter from Montréal-Trudeau International...',
    name: 'Montréal-Trudeau',
    code: 'YUL',
    region: 'North America',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=800',
    heroImage: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1600'
  }
];
