import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding lookup tables and mock data...');

  // 0. Seed demo user for bookings/auth
  console.log('Seeding Demo User...');
  await prisma.user.upsert({
    where: { email: 'demo@j-ta.local' },
    update: {},
    create: {
      email: 'demo@j-ta.local',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+84900000000',
      accountType: 'INDIVIDUAL',
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

  // 4. Seed Jet Card Plans
  console.log('Seeding Jet Card Plans...');
  for (const plan of [
    { name: 'Silver Card', hours: 10, validityYears: 1, minNoticeHours: 48, dailyMinHours: 1.0, price: 50000 },
    { name: 'Gold Card', hours: 25, validityYears: 2, minNoticeHours: 24, dailyMinHours: 1.5, price: 120000 },
    { name: 'Platinum Card', hours: 50, validityYears: 2, minNoticeHours: 12, dailyMinHours: 1.5, price: 220000 },
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
  ];

  for (const r of routeSeeds) {
    await prisma.fixedPriceRoute.upsert({
      where: { slug: r.slug },
      update: { status: 'ACTIVE' },
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

  // 7. Seed Travel Credits for demo user
  console.log('Seeding Travel Credits...');
  const demoUser = await prisma.user.findUnique({ where: { email: 'demo@j-ta.local' } });
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
    body: 'This is the clean-room reconstructed privacy policy for J-TA platform.',
    seoTitle: 'Privacy Policy - J-TA',
    seoDescription: 'How J-TA handles your personal data.',
  });

  const newsArticle = await prisma.contentArticle.upsert({
    where: { slug: 'jetbay-expands-fleet' },
    update: { isPublished: true, publishedAt: new Date('2026-06-25') },
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
    title: 'J-TA Expands Private Jet Fleet',
    excerpt: 'New aircraft added to serve growing demand across Asia and Europe.',
    body: 'J-TA announces fleet expansion with additional light and heavy jets available for charter.',
    seoTitle: 'Fleet Expansion News - J-TA',
    seoDescription: 'J-TA expands private jet fleet for global charter.',
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
    seoTitle: 'Pet Travel Tips - J-TA Blog',
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
  const destSeeds = [
    { slug: 'nassau', category: 'ISLAND', city: 'Nassau', country: 'The Bahamas', title: 'Nassau', tagline: 'Bahamas Classic' },
    { slug: 'providenciales', category: 'ISLAND', city: 'Providenciales', country: 'Turks and Caicos', title: 'Providenciales', tagline: 'Resort Island Escape' },
    { slug: 'st-barts', category: 'ISLAND', city: 'St. Barts', country: 'Saint Barthelemy', title: 'St. Barts', tagline: 'Iconic Boutique Island' },
  ];

  for (const d of destSeeds) {
    const dest = await prisma.destination.upsert({
      where: { slug: d.slug },
      update: { isPublished: true },
      create: {
        slug: d.slug,
        category: d.category,
        city: d.city,
        country: d.country,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
    await seedTranslation('DESTINATION', dest.id, {
      title: d.title,
      excerpt: d.tagline,
      body: `Private jet access to ${d.city}, ${d.country}.`,
      seoTitle: `${d.title} Private Jet Charter - J-TA`,
      seoDescription: `Fly to ${d.city} by private jet with J-TA.`,
    });
  }

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
