import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { aboutUsCmsJson } from '../src/constants/about-us-cms';
import { bookingProcessCmsJson } from '../src/constants/booking-process-cms';
import { DESTINATION_SEEDS } from '../src/constants/destination-seeds';
import { GLOBAL_AIRPORT_SEEDS } from '../src/constants/airport-seeds';

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

  // 2. Seed Airports (global private-aviation hubs)
  console.log('Seeding Airports...');
  for (const a of GLOBAL_AIRPORT_SEEDS) {
    const { landingFee, parkingFee, overnightFee, handlingFee, latitude, longitude, ...rest } = a;
    await prisma.airport.upsert({
      where: { iata: a.iata },
      update: {
        icao: a.icao,
        name: a.name,
        city: a.city,
        country: a.country,
        countryCode: a.countryCode,
        countryName: a.countryName ?? a.country,
        continentCode: a.continentCode,
        continentName: a.continentName,
        timezone: a.timezone,
        status: 'ACTIVE',
        ...(latitude != null ? { latitude } : {}),
        ...(longitude != null ? { longitude } : {}),
        ...(landingFee != null ? { landingFee, feeUpdatedAt: new Date() } : {}),
        ...(parkingFee != null ? { parkingFee } : {}),
        ...(overnightFee != null ? { overnightFee } : {}),
        ...(handlingFee != null ? { handlingFee } : {}),
        feeCurrency: a.feeCurrency ?? 'USD',
      },
      create: {
        ...rest,
        countryName: a.countryName ?? a.country,
        status: 'ACTIVE',
        latitude,
        longitude,
        landingFee,
        parkingFee,
        overnightFee,
        handlingFee,
        feeCurrency: a.feeCurrency ?? 'USD',
        feeUpdatedAt: landingFee != null ? new Date() : undefined,
      },
    });
  }
  const sgn = await prisma.airport.findUniqueOrThrow({ where: { iata: 'SGN' } });
  const han = await prisma.airport.findUniqueOrThrow({ where: { iata: 'HAN' } });
  const can = await prisma.airport.findUniqueOrThrow({ where: { iata: 'CAN' } });
  const ltn = await prisma.airport.findUniqueOrThrow({ where: { iata: 'LTN' } });
  const lbg = await prisma.airport.findUniqueOrThrow({ where: { iata: 'LBG' } });
  const nce = await prisma.airport.findUniqueOrThrow({ where: { iata: 'NCE' } });
  const gva = await prisma.airport.findUniqueOrThrow({ where: { iata: 'GVA' } });
  const vny = await prisma.airport.findUniqueOrThrow({ where: { iata: 'VNY' } });
  const las = await prisma.airport.findUniqueOrThrow({ where: { iata: 'LAS' } });
  const teb = await prisma.airport.findUniqueOrThrow({ where: { iata: 'TEB' } });
  const opf = await prisma.airport.findUniqueOrThrow({ where: { iata: 'OPF' } });
  const iad = await prisma.airport.findUniqueOrThrow({ where: { iata: 'IAD' } });

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
  let asiaOps = await prisma.operator.findFirst({ where: { name: 'JetBay Asia Ops' } });
  if (asiaOps) {
    asiaOps = await prisma.operator.update({
      where: { id: asiaOps.id },
      data: {
        legalName: 'JetBay Asia Operations Pte Ltd',
        region: 'APAC',
        country: 'Singapore',
        contactEmail: 'ops@jetbay.local',
        paymentTerms: 'Net 7',
        cancellationPolicy: '50% within 48h',
        status: 'ACTIVE',
      },
    });
  } else {
    asiaOps = await prisma.operator.create({
      data: {
        name: 'JetBay Asia Ops',
        legalName: 'JetBay Asia Operations Pte Ltd',
        region: 'APAC',
        country: 'Singapore',
        contactEmail: 'ops@jetbay.local',
        paymentTerms: 'Net 7',
        cancellationPolicy: '50% within 48h',
        status: 'ACTIVE',
      },
    });
  }

  for (const name of ['Pacific Charter Group', 'EuroJet Partners']) {
    const region = name.includes('Euro') ? 'EMEA' : 'APAC';
    const existing = await prisma.operator.findFirst({ where: { name } });
    if (!existing) {
      await prisma.operator.create({ data: { name, region, status: 'ACTIVE' } });
    }
  }

  // 3c. Seed Aircraft instance parked at CAN (ops platform)
  console.log('Seeding Aircraft (ops)...');
  await prisma.aircraft.upsert({
    where: { registration: 'B-JBAY1' },
    update: {
      currentAirportId: can.id,
      baseAirportId: can.id,
      availabilityStatus: 'AVAILABLE',
      hourlyRate: 8500,
      hourlyRateCurrency: 'USD',
      minimumBillableHours: 2,
      locationUpdatedAt: new Date(),
      operatorId: asiaOps.id,
      aircraftModelId: modelG650.id,
    },
    create: {
      registration: 'B-JBAY1',
      aircraftModelId: modelG650.id,
      operatorId: asiaOps.id,
      baseAirportId: can.id,
      currentAirportId: can.id,
      availabilityStatus: 'AVAILABLE',
      operationalStatus: 'ACTIVE',
      availableFrom: new Date(),
      hourlyRate: 8500,
      hourlyRateCurrency: 'USD',
      minimumBillableHours: 2,
      locationUpdatedAt: new Date(),
    },
  });

  // 3d. Contract template mock
  const existingTemplate = await prisma.contractTemplate.findFirst({
    where: { name: 'Standard Operator Charter Agreement' },
  });
  if (!existingTemplate) {
    await prisma.contractTemplate.create({
      data: {
        name: 'Standard Operator Charter Agreement',
        operatorId: asiaOps.id,
        language: 'en',
        version: 1,
        placeholders: {
          fields: ['bookingCode', 'operator', 'aircraft', 'registration', 'route', 'amount', 'currency'],
        },
        status: 'ACTIVE',
      },
    });
  }

  // 3e. Role permissions
  console.log('Seeding role permissions...');
  const salesPerms = [
    'booking.view', 'booking.create', 'booking.update', 'booking.cancel', 'quote.view', 'quote.create',
    'pricing.estimate', 'pricing.view_cost', 'aircraft.view', 'aircraft.view_location',
    'airport.view', 'contract.view', 'contract.create', 'contract.submit_approval',
  ];
  for (const permission of salesPerms) {
    await prisma.rolePermission.upsert({
      where: { role_permission: { role: 'SALES', permission } },
      update: {},
      create: { role: 'SALES', permission },
    });
  }
  const approverPerms = [
    'contract.view', 'contract.approve', 'contract.reject', 'contract.request_changes',
    'contract.send_docusign', 'booking.view', 'quote.view',
  ];
  for (const permission of approverPerms) {
    await prisma.rolePermission.upsert({
      where: { role_permission: { role: 'CONTRACT_APPROVER', permission } },
      update: {},
      create: { role: 'CONTRACT_APPROVER', permission },
    });
  }

  const salesVn = await prisma.user.upsert({
    where: { email: 'sales.vn@jetbay.local' },
    update: { role: 'SALES', passwordHash: hashPassword('Sales123!') },
    create: {
      email: 'sales.vn@jetbay.local',
      passwordHash: hashPassword('Sales123!'),
      firstName: 'Sales',
      lastName: 'Vietnam',
      role: 'SALES',
    },
  });
  await prisma.userAirportScope.deleteMany({ where: { userId: salesVn.id } });
  await prisma.userAirportScope.create({
    data: { userId: salesVn.id, scopeType: 'COUNTRY', countryCode: 'VN' },
  });

  const salesNoCancel = await prisma.user.upsert({
    where: { email: 'sales.nocancel@jetbay.local' },
    update: { role: 'SALES', passwordHash: hashPassword('Sales123!') },
    create: {
      email: 'sales.nocancel@jetbay.local',
      passwordHash: hashPassword('Sales123!'),
      firstName: 'Sales',
      lastName: 'NoCancel',
      role: 'SALES',
    },
  });
  await prisma.userPermissionOverride.upsert({
    where: { userId_permission: { userId: salesNoCancel.id, permission: 'booking.cancel' } },
    update: { effect: 'DENY' },
    create: { userId: salesNoCancel.id, permission: 'booking.cancel', effect: 'DENY' },
  });
  void han;
  void sgn;

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
    body: 'This privacy policy describes how JetVina processes personal data.',
    seoTitle: 'Privacy Policy - JetVina',
    seoDescription: 'How JetVina handles your personal data.',
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
    title: 'JetVina Expands Private Jet Fleet',
    excerpt: 'New aircraft added to serve growing demand across Asia and Europe.',
    body: 'JetVina announces fleet expansion with additional light and heavy jets available for charter.',
    seoTitle: 'Fleet Expansion News - JetVina',
    seoDescription: 'JetVina expands private jet fleet for global charter.',
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
    seoTitle: 'Pet Travel Tips - JetVina Blog',
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
      seoTitle: `${d.title} Private Jet Charter - JetVina`,
      seoDescription: `Fly to ${d.city} by private jet with JetVina.`,
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
    body: 'These terms govern use of the JetVina private jet booking platform.',
    seoTitle: 'Terms of Service - JetVina',
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
      author: 'JetVina Team',
    },
  });
  const aboutCmsBody = aboutUsCmsJson();
  await seedTranslation('ARTICLE', aboutPage.id, {
    title: 'About JetVina',
    excerpt:
      'JetVina is a Vietnam-based private jet charter company with offices across Asia Pacific.',
    body: aboutCmsBody,
    seoTitle: 'About Us - JetVina',
    seoDescription: 'Learn about JetVina private jet charter across Vietnam and Asia Pacific.',
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
    seoTitle: 'How Booking Works - JetVina',
    seoDescription: 'Step-by-step private jet booking guide with JetVina.',
  });

  // Media review fixtures (test-only keys — never JetBay paths, never prod-approved JetVina)
  console.log('Seeding media review fixtures...');
  await prisma.mediaAsset.upsert({
    where: { storageKey: 'fixtures/media/unverified-staging.jpg' },
    update: {
      rightsStatus: 'UNVERIFIED',
      approvedForStaging: false,
      approvedForPublish: false,
      altText: 'Fixture UNVERIFIED aircraft exterior',
      usageContexts: ['AIRCRAFT_EXTERIOR', 'EMPTY_LEG'],
      width: 1600,
      height: 900,
      checksum: 'fixture-unverified-sha256',
      mimeType: 'image/jpeg',
      sourceType: 'JETVINA_MIRROR',
      sourceUrl: 'https://jetvina.com/wp-content/uploads/fixture-unverified.jpg',
    },
    create: {
      storageKey: 'fixtures/media/unverified-staging.jpg',
      originalFilename: 'unverified-staging.jpg',
      mimeType: 'image/jpeg',
      width: 1600,
      height: 900,
      fileSize: 1024,
      checksum: 'fixture-unverified-sha256',
      sourceType: 'JETVINA_MIRROR',
      sourceUrl: 'https://jetvina.com/wp-content/uploads/fixture-unverified.jpg',
      rightsStatus: 'UNVERIFIED',
      altText: 'Fixture UNVERIFIED aircraft exterior',
      usageContexts: ['AIRCRAFT_EXTERIOR', 'EMPTY_LEG'],
      approvedForStaging: false,
      approvedForPublish: false,
    },
  });
  await prisma.mediaAsset.upsert({
    where: { storageKey: 'fixtures/media/client-provided-plane.jpg' },
    update: {
      rightsStatus: 'CLIENT_PROVIDED',
      rightsEvidence: 'TEST_FIXTURE_ONLY — not real JetVina rights',
      approvedForStaging: true,
      approvedForPublish: false,
      altText: 'Fixture CLIENT_PROVIDED plane',
      usageContexts: ['AIRCRAFT_EXTERIOR'],
      width: 1600,
      height: 900,
      checksum: 'fixture-client-provided-sha256',
      mimeType: 'image/jpeg',
      sourceType: 'CLIENT_PROVIDED',
      focalPointX: 0.5,
      focalPointY: 0.4,
    },
    create: {
      storageKey: 'fixtures/media/client-provided-plane.jpg',
      originalFilename: 'client-provided-plane.jpg',
      mimeType: 'image/jpeg',
      width: 1600,
      height: 900,
      fileSize: 2048,
      checksum: 'fixture-client-provided-sha256',
      sourceType: 'CLIENT_PROVIDED',
      rightsStatus: 'CLIENT_PROVIDED',
      rightsEvidence: 'TEST_FIXTURE_ONLY — not real JetVina rights',
      altText: 'Fixture CLIENT_PROVIDED plane',
      usageContexts: ['AIRCRAFT_EXTERIOR'],
      approvedForStaging: true,
      approvedForPublish: false,
      focalPointX: 0.5,
      focalPointY: 0.4,
    },
  });

  const mediaReviewer = await prisma.user.upsert({
    where: { email: 'media.reviewer@jetbay.local' },
    update: { role: 'SALES', passwordHash: hashPassword('MediaReview123!') },
    create: {
      email: 'media.reviewer@jetbay.local',
      passwordHash: hashPassword('MediaReview123!'),
      firstName: 'Media',
      lastName: 'Reviewer',
      role: 'SALES',
    },
  });
  for (const permission of [
    'content_media.view',
    'content_media.review',
    'content_media.approve_staging',
  ]) {
    await prisma.userPermissionOverride.upsert({
      where: {
        userId_permission: { userId: mediaReviewer.id, permission },
      },
      update: { effect: 'ALLOW' },
      create: { userId: mediaReviewer.id, permission, effect: 'ALLOW' },
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
