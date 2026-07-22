export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  timeAgo: string;
}

export const FEATURED_VIDEO: VideoItem = {
  id: 'v-featured',
  title: 'Company Profile Video: Connecting the World through Charter Innovation',
  thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800',
  duration: '0:48',
  views: 561,
  timeAgo: '1 year ago'
};

export const NEWEST_VIDEOS: VideoItem[] = [
  {
    id: 'v-new-1',
    title: 'Celebrating 5 Years of Jetbay: Global Growth and Big Wins',
    thumbnail: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=400',
    duration: '0:42',
    views: 298,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-new-2',
    title: 'Celebrating Chinese New Year with Jetbay and Our Global Aviation Partners',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400',
    duration: '2:20',
    views: 137,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-new-3',
    title: 'VIP Networking Event At Bombardier Singapore Service Centre',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=400',
    duration: '1:37',
    views: 92529,
    timeAgo: '1 year ago'
  }
];

export const INTERVIEWS_VIDEOS: VideoItem[] = [
  {
    id: 'v-int-1',
    title: 'How Her Lifelong Passion for Aviation Continues After Retirement',
    thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=600',
    duration: '14:24',
    views: 676,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-int-2',
    title: 'How WingsOverAsia Took Flight: A Journey of Passion and Purpose',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600',
    duration: '13:09',
    views: 15810,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-int-3',
    title: 'Nilesh Pattanayak Reveals Bombardier\'s Innovations and His...',
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600',
    duration: '12:07',
    views: 849,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-int-4',
    title: 'Inside Thailand\'s Private Jet Industry with Natthapatr Sibunruang, MJets...',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=600',
    duration: '11:52',
    views: 624,
    timeAgo: '1 year ago'
  }
];

export const FACILITIES_VIDEOS: VideoItem[] = [
  {
    id: 'v-fac-1',
    title: 'Private Jets & A Salad Wall?! | Air 7 Asia Private Aviation Facility Tour',
    thumbnail: 'https://images.unsplash.com/photo-1588691501718-d7b10c5da84a?q=80&w=600',
    duration: '1:56',
    views: 116,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-fac-2',
    title: 'Exclusive Tour of Asia\'s 1st Integrated Private Aviation Service Provider',
    thumbnail: 'https://images.unsplash.com/photo-1583307567705-89467610fa78?q=80&w=600',
    duration: '3:04',
    views: 321,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-fac-3',
    title: 'Exclusive Inside Look at MJets\'s Award-Winning Private Jet Terminal',
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600',
    duration: '0:52',
    views: 1653,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-fac-4',
    title: 'Inside the Largest OEM Business Aviation Maintenance Facility in Asia...',
    thumbnail: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=600',
    duration: '1:48',
    views: 967,
    timeAgo: '2 years ago'
  }
];

export const QUICK_FIRE_VIDEOS: VideoItem[] = [
  {
    id: 'v-qf-1',
    title: 'Shortest Flight Ever?! Here\'s What Private Jet Pilots Actually Do',
    thumbnail: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600',
    duration: '1:44',
    views: 57,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-qf-2',
    title: 'Air 7 Asia\'s Director of Customer Service on Prepping a Private Jet fo...',
    thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=600',
    duration: '3:00',
    views: 108,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-qf-3',
    title: 'Major Rasaletchumi\'s Journey in Aviation',
    thumbnail: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=600',
    duration: '7:21',
    views: 562,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-qf-4',
    title: 'WingsOverAsia Founder on Aircraft Ownership and Cost of Flying Privat...',
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600',
    duration: '1:55',
    views: 64242,
    timeAgo: '2 years ago'
  }
];

export const EVENT_VIDEOS_1: VideoItem[] = [
  {
    id: 'v-ev-1',
    title: 'What\'s Next for Business Aviation? Highlights from EBACE 2025 in...',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600',
    duration: '1:36',
    views: 1217,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-ev-2',
    title: 'Yachting in Style at the 2025 Singapore Yachting Festival',
    thumbnail: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=600',
    duration: '1:09',
    views: 143,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-ev-3',
    title: 'BAAFEX 2025: The Biggest Moments You Can\'t Miss At The Business...',
    thumbnail: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=600',
    duration: '2:18',
    views: 274,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-ev-4',
    title: 'An Exclusive Event Recap: A Fun-filled Night of Laughter, Connection...',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=600',
    duration: '0:47',
    views: 88,
    timeAgo: '1 year ago'
  }
];

export const EVENT_VIDEOS_2: VideoItem[] = [
  {
    id: 'v-ev-5',
    title: 'VIP Networking Event At Bombardier Singapore Service Centre',
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600',
    duration: '1:37',
    views: 92697,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-ev-6',
    title: 'Exploring the Bali Airshow 2024 | Into the Future of Aviation with Jetbay',
    thumbnail: 'https://images.unsplash.com/photo-1582236205574-32dc23a9d701?q=80&w=600',
    duration: '1:12',
    views: 425,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-ev-7',
    title: 'Golf in the Skies | An Aviation Golf Tournament Recap',
    thumbnail: 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?q=80&w=600',
    duration: '1:04',
    views: 148,
    timeAgo: '1 year ago'
  },
  {
    id: 'v-ev-8',
    title: 'Exploring the Selangor Airshow 2024 | Into the Future of Aviation with...',
    thumbnail: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=600',
    duration: '1:44',
    views: 345,
    timeAgo: '1 year ago'
  }
];
