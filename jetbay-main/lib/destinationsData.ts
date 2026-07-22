export interface City {
  name: string;
  image: string;
}

export interface Destination {
  slug: string;
  name: string;
  continent: string;
  featured?: boolean;
  shortDesc: string;
  fullDesc: string;
  heroImage: string;
  basicInfo: {
    capital: string;
    currency: string;
    languages: string;
    population: string;
    flagUrl?: string;
  };
  sections: {
    title: string;
    content: string;
    image?: string;
  }[];
  cities: City[];
}

export const DESTINATIONS_DATA: Destination[] = [
  {
    slug: 'philippines',
    name: 'Philippines',
    continent: 'Asia',
    featured: false,
    shortDesc: 'The Philippines, a 7,000-island archipelago, boasts stunning beaches, rich biodiversity, vibrant culture, and diverse adventures...',
    fullDesc: 'The Philippines, a 7,000-island archipelago, boasts stunning beaches, rich biodiversity, vibrant culture, and diverse adventures from Manila to Palawan.',
    heroImage: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1600',
    basicInfo: {
      capital: 'Manila',
      currency: 'Philippine Peso (PHP)',
      languages: 'Filipino, English',
      population: '113 million (approximate as of 2023)',
      flagUrl: 'https://flagcdn.com/w80/ph.png',
    },
    sections: [
      {
        title: 'The Philippines: A Tropical Mosaic of Culture and Nature',
        content: 'The Philippines, an archipelago consisting of over 7,000 islands, is a tropical paradise located in Southeast Asia. Known for its white-sand beaches, crystal-clear waters, and vibrant culture, the Philippines offers a diverse range of experiences for every type of traveler. Its unique blend of Spanish, American, and indigenous influences is reflected in its architecture, festivals, and cuisine, making it a fascinating destination with a rich history.'
      },
      {
        title: 'Private Jet Access Across the Archipelago',
        content: 'The Philippines is home to 88 airports, with major international hubs including Ninoy Aquino International Airport (Manila), Mactan-Cebu International Airport (Cebu), and Clark International Airport (Pampanga). These airports provide excellent connectivity both within the country and internationally. For private jet travelers, FBO services are available at Ninoy Aquino and Mactan-Cebu airports, ensuring a smooth and luxurious travel experience.',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200'
      },
      {
        title: 'Palawan: Pristine Shores and Marine Wonders',
        content: 'One of the most popular destinations in the Philippines is the island of Palawan, often referred to as the "Last Frontier" due to its pristine beaches, limestone cliffs, and rich biodiversity. El Nido and Coron are famous for their crystal-clear lagoons, towering limestone formations, and stunning coral reefs, making them perfect for snorkelling and diving enthusiasts. Palawan\'s natural beauty has earned it recognition as one of the best islands in the world.',
        image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1200'
      },
      {
        title: 'Celebrating Culture Through Festivals and Heritage',
        content: 'The Philippines is also known for its warm and welcoming people, who take pride in their rich cultural heritage. The country celebrates numerous festivals throughout the year, including Sinulog in Cebu and Ati-Atihan in Kalibo, which highlight its vibrant traditions and colorful history. Spanish colonial influence is evident in the architecture of churches, plazas, and fortifications found across the country, such as the San Agustin Church in Manila, a UNESCO World Heritage Site.',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200'
      },
      {
        title: 'A Culinary Journey Through Filipino Flavours',
        content: 'Filipino cuisine is an integral part of the country\'s culture, offering a unique blend of flavours that reflect its multicultural history. Popular dishes like adobo (marinated meat stew), sinigang (sour soup), and lechon (roast pig) are beloved by locals and visitors alike. The street food scene is also a highlight, with treats like balut (fertilized duck egg), isaw (grilled chicken intestines), and halo-halo (a mixed dessert) offering a taste of local flavours.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200'
      },
      {
        title: 'Natural Wonders Beyond the Beach',
        content: 'The Philippines\' natural beauty extends beyond its beaches. The Chocolate Hills in Bohol, the Mayon Volcano in Albay, and the Rice Terraces of Banaue offer breathtaking landscapes that showcase the country\'s diverse geography. Whether you\'re exploring the bustling cities, diving into vibrant marine life, or trekking through lush mountains, the Philippines promises a one-of-a-kind travel experience.'
      },
      {
        title: 'Why Private Jet Travelers Choose the Philippines',
        content: 'With its mix of adventure, cultural richness, and luxury-ready infrastructure, the Philippines is a top-tier destination for travelers seeking bespoke experiences in paradise.'
      },
      {
        title: 'Charter a Private Jet to the Philippines with Jetbay',
        content: 'Experience the luxury and convenience of Jetbay\'s private jet charter flights tailored to your needs. Discover our range of airplanes and transparent private jet prices today. Book with Jetbay and elevate your travel to new heights!'
      }
    ],
    cities: [
      {
        name: 'Manila',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800'
      },
      {
        name: 'Cebu City',
        image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=800'
      },
      {
        name: 'Davao City',
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800'
      }
    ]
  },
  {
    slug: 'japan',
    name: 'Japan',
    continent: 'Asia',
    featured: true,
    shortDesc: 'Discover Japan by private jet, where ancient traditions meet futuristic innovations. Explore historic landmarks and vibrant modern cities in ultimate comfort.',
    fullDesc: 'Discover Japan by private jet, where ancient traditions meet futuristic innovations. Explore historic landmarks, serene temples, and vibrant modern cities.',
    heroImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1600',
    basicInfo: {
      capital: 'Tokyo',
      currency: 'Japanese Yen (JPY)',
      languages: 'Japanese',
      population: '125 million',
      flagUrl: 'https://flagcdn.com/w80/jp.png'
    },
    sections: [
      {
        title: 'Land of the Rising Sun',
        content: 'Japan blends deep-rooted tradition with cutting-edge modernity. From Mount Fuji to Tokyo nightlife and Kyoto shrines, Japan offers unforgettable private travel.'
      }
    ],
    cities: [
      { name: 'Tokyo', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800' },
      { name: 'Kyoto', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800' },
      { name: 'Osaka', image: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=800' }
    ]
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    continent: 'Asia',
    featured: true,
    shortDesc: 'Singapore, a vibrant city-state with an ultra-modern skyline and rich culture, awaits private jet travellers with luxury, nature, and world-class dining.',
    fullDesc: 'Singapore offers private jet travellers seamless VIP airport arrivals, luxury shopping, Michelin-starred cuisine, and iconic skyline views.',
    heroImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600',
    basicInfo: {
      capital: 'Singapore',
      currency: 'Singapore Dollar (SGD)',
      languages: 'English, Malay, Mandarin, Tamil',
      population: '5.9 million',
      flagUrl: 'https://flagcdn.com/w80/sg.png'
    },
    sections: [
      {
        title: 'The Garden City',
        content: 'Singapore combines futuristic architecture like Marina Bay Sands and Supertree Grove with lush greenery and rich heritage precincts.'
      }
    ],
    cities: [
      { name: 'Marina Bay', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800' },
      { name: 'Sentosa', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800' }
    ]
  },
  {
    slug: 'bhutan',
    name: 'Bhutan',
    continent: 'Asia',
    featured: false,
    shortDesc: 'Bhutan, the "Land of the Thunder Dragon," is a Himalayan gem known for its breathtaking landscapes, vibrant Buddhist culture, and high Gross National Happiness.',
    fullDesc: 'Bhutan offers an exclusive sanctuary for spiritual seekers and nature enthusiasts visiting Paro and Thimphu by private air charter.',
    heroImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1600',
    basicInfo: {
      capital: 'Thimphu',
      currency: 'Bhutanese Ngultrum (BTN)',
      languages: 'Dzongkha',
      population: '780,000',
      flagUrl: 'https://flagcdn.com/w80/bt.png'
    },
    sections: [
      {
        title: 'The Kingdom of Happiness',
        content: 'Nestled deep in the Himalayas, Bhutan preserves its ancient fortresses (dzongs) and serene Buddhist lifestyle.'
      }
    ],
    cities: [
      { name: 'Paro', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=800' },
      { name: 'Thimphu', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=800' }
    ]
  },
  {
    slug: 'cambodia',
    name: 'Cambodia',
    continent: 'Asia',
    featured: false,
    shortDesc: 'Cambodia, rich in history, boasts ancient temples, vibrant culture, and stunning landscapes, from Angkor Wat to Phnom Penh\'s lively streets.',
    fullDesc: 'Fly directly into Siem Reap for private jet access to Angkor Wat, or explore coastal island resorts in southern Cambodia.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600',
    basicInfo: {
      capital: 'Phnom Penh',
      currency: 'Cambodian Riel (KHR) / USD',
      languages: 'Khmer',
      population: '16.9 million',
      flagUrl: 'https://flagcdn.com/w80/kh.png'
    },
    sections: [
      {
        title: 'Ancient Wonders & Warm Hospitality',
        content: 'Home to the magnificent Angkor Wat temple complex, Cambodia offers rich Khmer heritage and serene coastal islands.'
      }
    ],
    cities: [
      { name: 'Siem Reap', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800' },
      { name: 'Phnom Penh', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800' }
    ]
  },
  {
    slug: 'china',
    name: 'China',
    continent: 'Asia',
    featured: false,
    shortDesc: 'China, a vast nation of history and diverse cultures, offers private jet travellers a mix of ancient heritage & modern marvels across stunning landscapes.',
    fullDesc: 'From Beijing and Shanghai to Guilin\'s karst mountains, China provides endless cultural and economic destinations.',
    heroImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1600',
    basicInfo: {
      capital: 'Beijing',
      currency: 'Chinese Yuan (CNY)',
      languages: 'Mandarin',
      population: '1.4 billion',
      flagUrl: 'https://flagcdn.com/w80/cn.png'
    },
    sections: [
      {
        title: 'A Tapestry of History & Innovation',
        content: 'Experience China\'s iconic landmarks like the Great Wall, Forbidden City, and Shanghai\'s futuristic Bund.'
      }
    ],
    cities: [
      { name: 'Beijing', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800' },
      { name: 'Shanghai', image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?q=80&w=800' }
    ]
  },
  {
    slug: 'hong-kong',
    name: 'Hong Kong (China)',
    continent: 'Asia',
    featured: false,
    shortDesc: 'Hong Kong, a vibrant global city, offers private jet travellers a blend of towering skyline, rich culture, luxury shopping, and dining in a dynamic setting.',
    fullDesc: 'Direct FBO handling at Hong Kong International Airport makes it a seamless hub for business leaders and VIP travellers.',
    heroImage: 'https://images.unsplash.com/photo-1506970845246-18f21d533b20?q=80&w=1600',
    basicInfo: {
      capital: 'Hong Kong SAR',
      currency: 'Hong Kong Dollar (HKD)',
      languages: 'Chinese (Cantonese), English',
      population: '7.5 million',
      flagUrl: 'https://flagcdn.com/w80/hk.png'
    },
    sections: [
      {
        title: 'Asia\'s World City',
        content: 'Renowned for Victoria Harbour, Michelin-starred culinary arts, and luxury shopping centers.'
      }
    ],
    cities: [
      { name: 'Central', image: 'https://images.unsplash.com/photo-1506970845246-18f21d533b20?q=80&w=800' }
    ]
  },
  {
    slug: 'india',
    name: 'India',
    continent: 'Asia',
    featured: false,
    shortDesc: 'India is a vast and diverse country, known for its rich history, vibrant culture, and varied landscapes. From ancient temples to bustling megacities.',
    fullDesc: 'Visit the Taj Mahal in Agra, Rajasthan\'s royal palaces, or Goa\'s beaches with bespoke luxury charters.',
    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600',
    basicInfo: {
      capital: 'New Delhi',
      currency: 'Indian Rupee (INR)',
      languages: 'Hindi, English',
      population: '1.42 billion',
      flagUrl: 'https://flagcdn.com/w80/in.png'
    },
    sections: [
      {
        title: 'Incredible India',
        content: 'A land of royal heritage, vibrant festivals, spiritual landmarks, and majestic wildlife reserves.'
      }
    ],
    cities: [
      { name: 'New Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800' },
      { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800' }
    ]
  },
  {
    slug: 'indonesia',
    name: 'Indonesia',
    continent: 'Asia',
    featured: false,
    shortDesc: 'Indonesia, an archipelago of 17,000+ islands, offers private jet travellers rich culture, stunning beaches, and diverse landscapes—from Bali to Jakarta.',
    fullDesc: 'Private jet charters to Bali, Komodo, and Jakarta offer rapid, effortless island hopping across Indonesia.',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1600',
    basicInfo: {
      capital: 'Jakarta (Nusantara)',
      currency: 'Indonesian Rupiah (IDR)',
      languages: 'Indonesian',
      population: '275 million',
      flagUrl: 'https://flagcdn.com/w80/id.png'
    },
    sections: [
      {
        title: 'Emerald of the Equator',
        content: 'From luxury beach resorts in Bali to volcanic craters and ancient temples like Borobudur.'
      }
    ],
    cities: [
      { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800' },
      { name: 'Jakarta', image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?q=80&w=800' }
    ]
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    continent: 'Asia',
    featured: false,
    shortDesc: 'Explore Malaysia by private jet & experience Kuala Lumpur\'s iconic skyline, Langkawi\'s pristine beaches, & a luxurious blend of culture & nature.',
    fullDesc: 'Experience Subang Airport for fast private jet arrivals directly outside Kuala Lumpur city center.',
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1600',
    basicInfo: {
      capital: 'Kuala Lumpur',
      currency: 'Malaysian Ringgit (MYR)',
      languages: 'Malay, English',
      population: '33 million',
      flagUrl: 'https://flagcdn.com/w80/my.png'
    },
    sections: [
      {
        title: 'Truly Asia',
        content: 'Modern Petronas Towers in Kuala Lumpur paired with pristine tropical rainforests in Borneo and luxury resorts in Langkawi.'
      }
    ],
    cities: [
      { name: 'Kuala Lumpur', image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800' },
      { name: 'Langkawi', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800' }
    ]
  },
  {
    slug: 'maldives',
    name: 'Maldives',
    continent: 'Asia',
    featured: false,
    shortDesc: 'The Maldives: a tropical paradise of clear waters, overwater villas, coral reefs, and 1,000+ islands, perfect for relaxation and diving.',
    fullDesc: 'Velana International Airport in Velana provides private jet CIP lounge handling with instant seaplane transfers to private island resorts.',
    heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1600',
    basicInfo: {
      capital: 'Malé',
      currency: 'Maldivian Rufiyaa (MVR)',
      languages: 'Dhivehi, English',
      population: '520,000',
      flagUrl: 'https://flagcdn.com/w80/mv.png'
    },
    sections: [
      {
        title: 'Paradise on Earth',
        content: 'Luxury overwater bungalows, turquoise lagoons, and world-class marine life in absolute privacy.'
      }
    ],
    cities: [
      { name: 'Malé', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=800' }
    ]
  },
  {
    slug: 'south-korea',
    name: 'South Korea',
    continent: 'Asia',
    featured: false,
    shortDesc: 'South Korea blends tradition and modernity, from Seoul\'s high-tech energy to Gyeongju\'s serene temples, offering rich history, vibrant cities, and culture.',
    fullDesc: 'Gimpo and Incheon Business Aviation Centers ensure rapid clearance into Seoul.',
    heroImage: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=1600',
    basicInfo: {
      capital: 'Seoul',
      currency: 'South Korean Won (KRW)',
      languages: 'Korean',
      population: '51.7 million',
      flagUrl: 'https://flagcdn.com/w80/kr.png'
    },
    sections: [
      {
        title: 'Dynamic Korea',
        content: 'K-culture, luxury fashion, Michelin dining, and ancient royal palaces in Seoul and Jeju Island.'
      }
    ],
    cities: [
      { name: 'Seoul', image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?q=80&w=800' },
      { name: 'Busan', image: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?q=80&w=800' }
    ]
  }
];
