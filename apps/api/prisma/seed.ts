import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding lookup tables and mock data...');

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

  const modelG650 = await prisma.aircraftModel.create({
    data: {
      manufacturer: 'Gulfstream',
      model: 'G650',
      categoryId: heavy.id,
      rangeKm: 12964,
      speedKmh: 956,
      sleepCapacity: 6,
    },
  });

  const modelCessna = await prisma.aircraftModel.create({
    data: {
      manufacturer: 'Cessna',
      model: 'Citation Latitude',
      categoryId: light.id,
      rangeKm: 5000,
      speedKmh: 826,
      sleepCapacity: 0,
    },
  });

  // 4. Seed Jet Card Plans
  console.log('Seeding Jet Card Plans...');
  await prisma.jetCardPlan.createMany({
    data: [
      { name: 'Silver Card', hours: 10, validityYears: 1, minNoticeHours: 48, dailyMinHours: 1.0, price: 50000 },
      { name: 'Gold Card', hours: 25, validityYears: 2, minNoticeHours: 24, dailyMinHours: 1.5, price: 120000 },
      { name: 'Platinum Card', hours: 50, validityYears: 2, minNoticeHours: 12, dailyMinHours: 1.5, price: 220000 },
    ],
  });

  // 5. Seed Content Categories & Articles
  console.log('Seeding Content Categories...');
  const newsCategory = await prisma.contentCategory.upsert({
    where: { slug: 'news' },
    update: {},
    create: { name: 'News & Announcements', slug: 'news' },
  });

  console.log('Seeding Content Articles...');
  await prisma.contentArticle.upsert({
    where: { slug: 'privacy-policy' },
    update: {},
    create: {
      type: 'LEGAL',
      slug: 'privacy-policy',
      isPublished: true,
      author: 'Compliance Team',
    },
  });

  await prisma.contentArticle.upsert({
    where: { slug: 'jetbay-expands-fleet' },
    update: {},
    create: {
      type: 'NEWS',
      slug: 'jetbay-expands-fleet',
      categoryId: newsCategory.id,
      isPublished: true,
      author: 'Public Relations',
    },
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
