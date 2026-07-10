import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { aboutUsCmsJson } from '../src/constants/about-us-cms';
import { bookingProcessCmsJson } from '../src/constants/booking-process-cms';
import { DESTINATION_SEEDS } from '../src/constants/destination-seeds';

const prisma = new PrismaClient();

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

async function main() {
  console.log('Seeding lookup tables and mock data...');

  // 0. Seed demo + admin users
  console.log('Seeding users...');
  await prisma.user.upsert({
    where: { email: 'demo@jetbay.local' },
    update: { passwordHash: hashPassword('Demo123!'), role: 'USER' },
    create: {
      email: 'demo@jetbay.local',
      passwordHash: hashPassword('Demo123!'),
      firstName: 'Demo',
      lastName: 'User',
      phone: '+84900000000',
      accountType: 'INDIVIDUAL',
      role: 'USER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@jetbay.local' },
    update: { passwordHash: hashPassword('Admin123!'), role: 'ADMIN' },
    create: {
      email: 'admin@jetbay.local',
      passwordHash: hashPassword('Admin123!'),
      firstName: 'Admin',
      lastName: 'User',
      phone: '+84900000001',
      accountType: 'INDIVIDUAL',
      role: 'ADMIN',
    },
  });

  // 1. Seed Partner Programs
  console.log('Seeding Partner Programs...');
  const referral = await prisma.partnerProgram.upsert({
    where: { code: 'REFERRAL' },
    update: {},
    create: {
      code: 'REFERRAL',
      name: 'Referral Partner Program',
      benefits: { commissionRate: 0.03, dashboardAccess: 'BASIC' },
    },
  });

  const service = await prisma.partnerProgram.upsert({
    where: { code: 'SERVICE' },
    update: {},
    create: {
      code: 'SERVICE',
      name: 'Service Partner Program',
      benefits: { commissionRate: 0.05, dashboardAccess: 'FULL' },
    },
  });

  const official = await prisma.partnerProgram.upsert({
    where: { code: 'OFFICIAL' },
    update: {},
    create: {
      code: 'OFFICIAL',
      name: 'Official Airline Partner Program',
      benefits: { commissionRate: 0.07, dashboardAccess: 'FULL' },
    },
  });

  // 2. Seed Airports
  console.log('Seeding Airports...');
  const sgn = await prisma.airport.upsert({
    where: { iata: 'SGN' },
    update: {},
    create: { iata: 'SGN', icao: 'VVTS', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  });

  const han = await prisma.airport.upsert({
    where: { iata: 'HAN' },
    update: {},
    create: { iata: 'HAN', icao: 'VVNB', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  });

  const cxr = await prisma.airport.upsert({
    where: { iata: 'CXR' },
    update: {},
    create: { iata: 'CXR', icao: 'VVCR', name: 'Cam Ranh International Airport', city: 'Nha Trang', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  });

  // 3. Seed Aircraft Categories & Models
  console.log('Seeding Aircraft Categories & Models...');
  const light = await prisma.aircraftCategory.upsert({
    where: { code: 'LIGHT' },
    update: {},
    create: { code: 'LIGHT', label: 'Light Jet', maxPassengers: 8 },
  });

  const heavy = await prisma.aircraftCategory.upsert({
    where: { code: 'HEAVY' },
    update: {},
    create: { code: 'HEAVY', label: 'Heavy Jet', maxPassengers: 16 },
  });

  const midsize = await prisma.aircraftCategory.upsert({
    where: { code: 'MIDSIZE' },
    update: {},
    create: { code: 'MIDSIZE', label: 'Midsize Jet', maxPassengers: 10 },
  });

  const modelG650 = await prisma.aircraftModel.findFirst({ where: { manufacturer: 'Gulfstream', model: 'G650' } })
    ?? await prisma.aircraftModel.create({
      data: { manufacturer: 'Gulfstream', model: 'G650', categoryId: heavy.id, rangeKm: 12964, speedKmh: 956, sleepCapacity: 6 },
    });

  const modelCessna = await prisma.aircraftModel.findFirst({ where: { manufacturer: 'Cessna', model: 'Citation Latitude' } })
    ?? await prisma.aircraftModel.create({
      data: { manufacturer: 'Cessna', model: 'Citation Latitude', categoryId: light.id, rangeKm: 5000, speedKmh: 826, sleepCapacity: 0 },
    });

  const modelLearjet = await prisma.aircraftModel.findFirst({ where: { manufacturer: 'Bombardier', model: 'Learjet 60' } })
    ?? await prisma.aircraftModel.create({
      data: { manufacturer: 'Bombardier', model: 'Learjet 60', categoryId: midsize.id, rangeKm: 4500, speedKmh: 861, sleepCapacity: 0 },
    });

  // 3b. Seed Operators (for QuoteOffer admin workflow)
  console.log('Seeding Operators...');
  const operatorCount = await prisma.operator.count();
  if (operatorCount === 0) {
    await prisma.operator.createMany({
      data: [
        { name: 'JetBay Asia Ops', region: 'APAC', status: 'ACTIVE' },
        { name: 'Pacific Charter Group', region: 'APAC', status: 'ACTIVE' },
        { name: 'EuroJet Partners', region: 'EMEA', status: 'ACTIVE' },
      ],
    });
  }

  // European airports (jet-bay style routes)
  console.log('Seeding European Airports...');
  const ltn = await prisma.airport.upsert({
    where: { iata: 'LTN' },
    update: {},
    create: { iata: 'LTN', icao: 'EGGW', name: 'London Luton Airport', city: 'London', country: 'UK', timezone: 'Europe/London' },
  });
  const lbg = await prisma.airport.upsert({
    where: { iata: 'LBG' },
    update: {},
    create: { iata: 'LBG', icao: 'LFPB', name: 'Paris Le Bourget Airport', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  });
  const nce = await prisma.airport.upsert({
    where: { iata: 'NCE' },
    update: {},
    create: { iata: 'NCE', icao: 'LFMN', name: "Nice Cote d'Azur Airport", city: 'Nice', country: 'France', timezone: 'Europe/Paris' },
  });
  const gva = await prisma.airport.upsert({
    where: { iata: 'GVA' },
    update: {},
    create: { iata: 'GVA', icao: 'LSGG', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', timezone: 'Europe/Zurich' },
  });

  // US airports (jet-bay.com en-us fixed-price routes)
  console.log('Seeding US Airports...');
  const vny = await prisma.airport.upsert({
    where: { iata: 'VNY' },
    update: {},
    create: { iata: 'VNY', icao: 'KVNY', name: 'Van Nuys Airport', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  });
  const las = await prisma.airport.upsert({
    where: { iata: 'LAS' },
    update: {},
    create: { iata: 'LAS', icao: 'KLAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'USA', timezone: 'America/Los_Angeles' },
  });
  const teb = await prisma.airport.upsert({
    where: { iata: 'TEB' },
    update: {},
    create: { iata: 'TEB', icao: 'KTEB', name: 'Teterboro Airport', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  });
  const opf = await prisma.airport.upsert({
    where: { iata: 'OPF' },
    update: {},
    create: { iata: 'OPF', icao: 'KOPF', name: 'Miami-Opa Locka Executive Airport', city: 'Miami', country: 'USA', timezone: 'America/New_York' },
  });
  const iad = await prisma.airport.upsert({
    where: { iata: 'IAD' },
    update: {},
    create: { iata: 'IAD', icao: 'KIAD', name: 'Washington Dulles International Airport', city: 'Washington', country: 'USA', timezone: 'America/New_York' },
  });

  // 4. Seed Jet Card Plans
  console.log('Seeding Jet Card Plans...');
  for (const plan of [
    { name: '10 Hour Jet Card', hours: 10, validityYears: 1, minNoticeHours: 48, dailyMinHours: 1.0, price: 50000 },
    { name: '25 Hour Jet Card', hours: 25, validityYears: 2, minNoticeHours: 24, dailyMinHours: 1.5, price: 120000 },
    { name: '50 Hour Jet Card', hours: 50, validityYears: 2, minNoticeHours: 12, dailyMinHours: 1.5, price: 220000 },
  ]) {
    const existing = await prisma.jetCardPlan.findFirst({ where: { name: plan.name } });
    if (!existing) {
      await prisma.jetCardPlan.create({ data: plan });
    }
  }

  // 5. Seed Fixed Price Routes
  console.log('Seeding Fixed Price Routes...');
  const routeSeeds = [
    { slug: 'london-to-paris', from: ltn, to: lbg, region: 'Europe', options: [
      { categoryId: light.id, price: 13500, paxLimit: 8 },
      { categoryId: heavy.id, price: 27000, paxLimit: 16 },
    ]},
    { slug: 'paris-to-london', from: lbg, to: ltn, region: 'Europe', options: [
      { categoryId: light.id, price: 13500, paxLimit: 8 },
      { categoryId: heavy.id, price: 27000, paxLimit: 16 },
    ]},
    { slug: 'london-to-nice', from: ltn, to: nce, region: 'Europe', options: [
      { categoryId: light.id, price: 15000, paxLimit: 8 },
      { categoryId: heavy.id, price: 35000, paxLimit: 16 },
    ]},
    { slug: 'nice-to-london', from: nce, to: ltn, region: 'Europe', options: [
      { categoryId: light.id, price: 15000, paxLimit: 8 },
      { categoryId: heavy.id, price: 35000, paxLimit: 16 },
    ]},
    { slug: 'paris-to-nice', from: lbg, to: nce, region: 'Europe', options: [
      { categoryId: light.id, price: 13000, paxLimit: 8 },
      { categoryId: heavy.id, price: 33000, paxLimit: 16 },
    ]},
    { slug: 'nice-to-paris', from: nce, to: lbg, region: 'Europe', options: [
      { categoryId: light.id, price: 13000, paxLimit: 8 },
      { categoryId: heavy.id, price: 33000, paxLimit: 16 },
    ]},
    { slug: 'los-angeles-to-las-vegas', from: vny, to: las, region: 'US', options: [
      { categoryId: light.id, price: 12000, paxLimit: 8 },
      { categoryId: heavy.id, price: 21000, paxLimit: 16 },
    ]},
    { slug: 'las-vegas-to-los-angeles', from: las, to: vny, region: 'US', options: [
      { categoryId: light.id, price: 12000, paxLimit: 8 },
      { categoryId: heavy.id, price: 21000, paxLimit: 16 },
    ]},
    { slug: 'new-york-to-miami', from: teb, to: opf, region: 'US', options: [
      { categoryId: light.id, price: 17000, paxLimit: 8 },
      { categoryId: heavy.id, price: 35000, paxLimit: 16 },
    ]},
    { slug: 'miami-to-new-york', from: opf, to: teb, region: 'US', options: [
      { categoryId: light.id, price: 17000, paxLimit: 8 },
      { categoryId: heavy.id, price: 35000, paxLimit: 16 },
    ]},
    { slug: 'new-york-to-washington', from: teb, to: iad, region: 'US', options: [
      { categoryId: light.id, price: 12000, paxLimit: 8 },
      { categoryId: heavy.id, price: 19000, paxLimit: 16 },
    ]},
    { slug: 'washington-to-new-york', from: iad, to: teb, region: 'US', options: [
      { categoryId: light.id, price: 12000, paxLimit: 8 },
      { categoryId: heavy.id, price: 19000, paxLimit: 16 },
    ]},
  ];

  for (const r of routeSeeds) {
    await prisma.fixedPriceRoute.upsert({
      where: { slug: r.slug },
      update: {
        status: 'ACTIVE',
        fromAirportId: r.from.id,
        toAirportId: r.to.id,
        region: r.region,
      },
      create: {
        slug: r.slug,
        fromAirportId: r.from.id,
        toAirportId: r.to.id,
        region: r.region,
        status: 'ACTIVE',
        options: { create: r.options },
      },
    });
  }

  // 6. Seed Empty Leg Offers
  console.log('Seeding Empty Leg Offers...');
  await prisma.emptyLegOffer.upsert({
    where: { slug: 'paris-to-geneva-empty-leg' },
    update: {},
    create: {
      slug: 'paris-to-geneva-empty-leg',
      fromAirportId: lbg.id,
      toAirportId: gva.id,
      departAt: new Date('2026-12-05T09:00:00Z'),
      aircraftModelId: modelCessna.id,
      price: 4200,
      discountPct: 60,
      status: 'ACTIVE',
    },
  });
  await prisma.emptyLegOffer.upsert({
    where: { slug: 'nice-to-london-empty-leg' },
    update: {},
    create: {
      slug: 'nice-to-london-empty-leg',
      fromAirportId: nce.id,
      toAirportId: ltn.id,
      departAt: new Date('2026-12-07T15:00:00Z'),
      aircraftModelId: modelLearjet.id,
      price: 5800,
      discountPct: 55,
      status: 'ACTIVE',
    },
  });

  // 7. Seed Travel Credit packages + demo ledger
  console.log('Seeding Travel Credits...');
  const tcPackageSeeds = [
    { name: 'Starter', creditAmount: 1000, priceUsd: 1000, bonusPct: null as number | null, validityMonths: 12 },
    { name: 'Business', creditAmount: 5000, priceUsd: 4500, bonusPct: 10, validityMonths: 18 },
    { name: 'Enterprise', creditAmount: 15000, priceUsd: 12000, bonusPct: 20, validityMonths: 24 },
  ];
  for (const pkg of tcPackageSeeds) {
    const existing = await prisma.travelCreditPackage.findFirst({ where: { name: pkg.name } });
    if (!existing) {
      await prisma.travelCreditPackage.create({ data: { ...pkg, currency: 'USD', active: true } });
    }
  }

  const demoUser = await prisma.user.findUnique({ where: { email: 'demo@jetbay.local' } });
  if (demoUser) {
    const existingCredits = await prisma.travelCreditLedger.count({ where: { userId: demoUser.id } });
    if (existingCredits === 0) {
      await prisma.travelCreditLedger.createMany({
        data: [
          { userId: demoUser.id, creditsDelta: 1500, expiresAt: new Date('2027-12-31'), reason: 'PURCHASE' },
          { userId: demoUser.id, creditsDelta: 950, expiresAt: new Date('2028-06-30'), reason: 'PURCHASE' },
        ],
      });
    }

    const jetPlan = await prisma.jetCardPlan.findFirst({ where: { name: '25 Hour Jet Card' } });
    if (jetPlan) {
      const existingCard = await prisma.jetCardAccount.findFirst({ where: { userId: demoUser.id } });
      if (!existingCard) {
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 2);
        await prisma.jetCardAccount.create({
          data: {
            userId: demoUser.id,
            planId: jetPlan.id,
            expiresAt,
            remainingHours: 18.5,
          },
        });
      }
    }
  }

  // 8. Seed Content Categories & Articles
  console.log('Seeding Content Categories...');
  const newsCategory = await prisma.contentCategory.upsert({
    where: { slug: 'news' },
    update: {},
    create: { name: 'News & Announcements', slug: 'news' },
  });

  const blogCategory = await prisma.contentCategory.upsert({
    where: { slug: 'blogs' },
    update: {},
    create: { name: 'Travel Insights', slug: 'blogs' },
  });

  async function seedTranslation(
    entityType: string,
    entityId: number,
    data: { title: string; body: string; excerpt?: string; seoTitle?: string; seoDescription?: string },
  ) {
    await prisma.contentTranslation.upsert({
      where: { entityType_entityId_locale: { entityType, entityId, locale: 'en' } },
      update: data,
      create: { entityType, entityId, locale: 'en', ...data },
    });
  }

  console.log('Seeding Content Articles...');
  const privacyPage = await prisma.contentArticle.upsert({
    where: { slug: 'privacy-policy' },
    update: { isPublished: true, publishedAt: new Date('2026-01-01') },
    create: {
      type: 'LEGAL',
      slug: 'privacy-policy',
      isPublished: true,
      publishedAt: new Date('2026-01-01'),
      author: 'Compliance Team',
    },
  });
  await seedTranslation('ARTICLE', privacyPage.id, {
    title: 'Privacy Policy',
    body: 'This is the clean-room reconstructed privacy policy for JetBay platform.',
    seoTitle: 'Privacy Policy - JetBay',
    seoDescription: 'How JetBay handles your personal data.',
  });

  const newsArticle = await prisma.contentArticle.upsert({
    where: { slug: 'jetbay-expands-fleet' },
    update: { isPublished: true, publishedAt: new Date('2026-06-25'), type: 'NEWS' },
    create: {
      type: 'NEWS',
      slug: 'jetbay-expands-fleet',
      categoryId: newsCategory.id,
      isPublished: true,
      publishedAt: new Date('2026-06-25'),
      author: 'Public Relations',
    },
  });
  await seedTranslation('ARTICLE', newsArticle.id, {
    title: 'JetBay Expands Private Jet Fleet',
    excerpt: 'New aircraft added to serve growing demand across Asia and Europe.',
    body: 'JetBay announces fleet expansion with additional light and heavy jets available for charter.',
    seoTitle: 'Fleet Expansion News - JetBay',
    seoDescription: 'JetBay expands private jet fleet for global charter.',
  });

  const blogArticle = await prisma.contentArticle.upsert({
    where: { slug: 'pet-travel-tips' },
    update: { isPublished: true, publishedAt: new Date('2026-06-20') },
    create: {
      type: 'BLOG',
      slug: 'pet-travel-tips',
      categoryId: blogCategory.id,
      isPublished: true,
      publishedAt: new Date('2026-06-20'),
      author: 'Editorial Team',
    },
  });
  await seedTranslation('ARTICLE', blogArticle.id, {
    title: 'Tips for Flying with Pets on a Private Jet',
    excerpt: 'Everything you need to know about pet-friendly private aviation.',
    body: 'Private jets offer a stress-free way to travel with pets. Here are our top tips...',
    seoTitle: 'Pet Travel Tips - JetBay Blog',
    seoDescription: 'Guide to flying with pets on private jets.',
  });

  console.log('Seeding Videos...');
  const video = await prisma.video.upsert({
    where: { slug: 'inside-g650-cabin' },
    update: { isPublished: true },
    create: {
      slug: 'inside-g650-cabin',
      videoUrl: 'https://cdn.example.com/videos/g650-cabin.mp4',
      duration: 180,
      viewCount: 1450,
      isPublished: true,
      publishedAt: new Date('2026-05-15'),
    },
  });
  await seedTranslation('VIDEO', video.id, {
    title: 'A Peek Inside the Gulfstream G650 Cabin',
    body: 'Tour the luxurious G650 cabin interior.',
    seoDescription: 'G650 cabin tour video',
  });

  console.log('Seeding Destinations...');
  for (const d of DESTINATION_SEEDS) {
    const dest = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: {
        category: d.category,
        city: d.city,
        country: d.country,
        thumbnail: d.thumbnail,
        isPublished: true,
        publishedAt: new Date(),
      },
      create: {
        slug: d.slug,
        category: d.category,
        city: d.city,
        country: d.country,
        thumbnail: d.thumbnail,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    await seedTranslation('DESTINATION', dest.id, {
      title: d.title,
      excerpt: d.tagline,
      body: d.body,
      seoTitle: `${d.title} Private Jet Charter - JetBay`,
      seoDescription: `Fly to ${d.city} by private jet with JetBay.`,
    });
  }

  console.log('Seeding World Cup matches...');
  const wcCount = await prisma.worldCupMatch.count();
  if (wcCount === 0) {
    await prisma.worldCupMatch.createMany({
      data: [
        {
          homeTeam: 'Brazil',
          awayTeam: 'Argentina',
          hostCity: 'Miami',
          stadium: 'Hard Rock Stadium',
          stage: 'Group',
          matchDate: new Date('2026-06-15T20:00:00Z'),
        },
        {
          homeTeam: 'USA',
          awayTeam: 'Mexico',
          hostCity: 'Los Angeles',
          stadium: 'SoFi Stadium',
          stage: 'Group',
          matchDate: new Date('2026-06-20T18:00:00Z'),
        },
        {
          homeTeam: 'France',
          awayTeam: 'Germany',
          hostCity: 'New York',
          stadium: 'MetLife Stadium',
          stage: 'Knockout',
          matchDate: new Date('2026-07-19T20:00:00Z'),
        },
      ],
    });
  }

  const termsPage = await prisma.contentArticle.upsert({
    where: { slug: 'terms-of-service' },
    update: { isPublished: true, publishedAt: new Date('2026-01-01') },
    create: {
      type: 'LEGAL',
      slug: 'terms-of-service',
      isPublished: true,
      publishedAt: new Date('2026-01-01'),
      author: 'Compliance Team',
    },
  });
  await seedTranslation('ARTICLE', termsPage.id, {
    title: 'Terms of Service',
    body: 'These terms govern use of the JetBay private jet booking platform.',
    seoTitle: 'Terms of Service - JetBay',
    seoDescription: 'Platform terms and conditions.',
  });

  const aboutPage = await prisma.contentArticle.upsert({
    where: { slug: 'about-us' },
    update: { isPublished: true, publishedAt: new Date('2026-01-01') },
    create: {
      type: 'PAGE',
      slug: 'about-us',
      isPublished: true,
      publishedAt: new Date('2026-01-01'),
      author: 'JetBay Team',
    },
  });
  const aboutCmsBody = aboutUsCmsJson();
  await seedTranslation('ARTICLE', aboutPage.id, {
    title: 'About JetBay',
    excerpt:
      'JetBay is a global private jet booking platform headquartered in Singapore with 6 other offices worldwide.',
    body: aboutCmsBody,
    seoTitle: 'About Us - JetBay',
    seoDescription: 'Learn about JetBay private jet charter — global offices, awards, and 10,000+ aircraft.',
  });

  const bookingPage = await prisma.contentArticle.upsert({
    where: { slug: 'booking-process' },
    update: { isPublished: true, publishedAt: new Date('2026-01-01') },
    create: {
      type: 'PAGE',
      slug: 'booking-process',
      isPublished: true,
      publishedAt: new Date('2026-01-01'),
      author: 'Operations Team',
    },
  });
  await seedTranslation('ARTICLE', bookingPage.id, {
    title: 'How to Charter a Flight',
    excerpt: 'Simple, efficient, reliable — follow four steps to book your private jet charter.',
    body: bookingProcessCmsJson(),
    seoTitle: 'How Booking Works - JetBay',
    seoDescription: 'Step-by-step private jet booking guide with JetBay.',
  });

  console.log('Seed execution completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
