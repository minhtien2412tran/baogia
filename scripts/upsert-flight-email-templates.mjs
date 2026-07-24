#!/usr/bin/env node
/**
 * Upsert operator/admin flight email templates from seeds (SoT body).
 * Usage on VPS: node scripts/upsert-flight-email-templates.mjs
 * Or locally with DATABASE_URL pointing at prod (prefer VPS).
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VPS = process.env.JETBAY_VPS_HOST || '103.200.20.100';

const remote = `
cd /var/www/jetbay-be
node --input-type=module <<'NODE'
import { PrismaClient } from '@prisma/client';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
// seeds compiled into dist — load via dynamic import of built constants if present
const prisma = new PrismaClient();
const seeds = [
  {
    key: 'operator_flight_notify',
    locale: 'en',
    subject: '[JetVina] New charter booking {{bookingReference}} — {{itinerary}}',
    htmlBody: '<p>A new charter booking requires your review.</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Customer:</strong> {{customerName}} · {{customerEmail}}<br/><strong>Aircraft:</strong> {{aircraftLabel}}<br/><strong>Passengers:</strong> {{passengerCount}}<br/><strong>Itinerary:</strong> {{itinerary}}<br/><strong>Departure:</strong> {{departureDateTime}}<br/><strong>Current status:</strong> {{bookingStatus}}</p><p>Please review aircraft availability and respond through the approved JetVina operations channel.</p>',
    textBody: 'A new charter booking requires your review.\\n\\nBooking: {{bookingReference}}\\nCustomer: {{customerName}} · {{customerEmail}}\\nAircraft: {{aircraftLabel}}\\nPassengers: {{passengerCount}}\\nItinerary: {{itinerary}}\\nDeparture: {{departureDateTime}}\\nCurrent status: {{bookingStatus}}',
  },
  {
    key: 'operator_flight_notify',
    locale: 'vi',
    subject: '[JetVina] Booking charter mới {{bookingReference}} — {{itinerary}}',
    htmlBody: '<p>Có booking charter mới cần hãng xem xét.</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Khách:</strong> {{customerName}} · {{customerEmail}}<br/><strong>Máy bay:</strong> {{aircraftLabel}}<br/><strong>Hành khách:</strong> {{passengerCount}}<br/><strong>Hành trình:</strong> {{itinerary}}<br/><strong>Khởi hành:</strong> {{departureDateTime}}<br/><strong>Trạng thái:</strong> {{bookingStatus}}</p>',
    textBody: 'Booking {{bookingReference}} — {{aircraftLabel}}. {{itinerary}} · {{departureDateTime}}',
  },
  {
    key: 'admin_flight_notify',
    locale: 'en',
    subject: '[JetVina Admin] {{bookingReference}} · {{bookingStatus}} · {{operatorName}}',
    htmlBody: '<p>Admin / Sales notification</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Operator:</strong> {{operatorName}}<br/><strong>Aircraft:</strong> {{aircraftLabel}} · Pax {{passengerCount}}<br/><strong>Customer:</strong> {{customerName}} / {{customerEmail}}<br/><strong>Status:</strong> {{bookingStatus}} ({{event}})<br/><strong>Itinerary:</strong> {{itinerary}} · {{departureDateTime}}</p>',
    textBody: 'Admin: {{bookingReference}} operator={{operatorName}} status={{bookingStatus}} {{itinerary}}',
  },
  {
    key: 'admin_flight_notify',
    locale: 'vi',
    subject: '[JetVina Admin] {{bookingReference}} · {{bookingStatus}} · {{operatorName}}',
    htmlBody: '<p>Thông báo Sales / Admin</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Hãng:</strong> {{operatorName}}<br/><strong>Máy bay:</strong> {{aircraftLabel}} · Pax {{passengerCount}}<br/><strong>Khách:</strong> {{customerName}} / {{customerEmail}}<br/><strong>Trạng thái:</strong> {{bookingStatus}} ({{event}})<br/><strong>Hành trình:</strong> {{itinerary}} · {{departureDateTime}}</p>',
    textBody: 'Admin: {{bookingReference}} hãng={{operatorName}} {{bookingStatus}} {{itinerary}}',
  },
];
for (const s of seeds) {
  await prisma.emailTemplate.upsert({
    where: { key_locale: { key: s.key, locale: s.locale } },
    create: s,
    update: { subject: s.subject, htmlBody: s.htmlBody, textBody: s.textBody },
  });
  console.log('UPSERT', s.key, s.locale);
}
await prisma.$disconnect();
console.log('DONE');
NODE
`;

const r = spawnSync('ssh', ['-o', 'BatchMode=yes', `root@${VPS}`, 'bash', '-lc', remote], {
  encoding: 'utf8',
  maxBuffer: 2 * 1024 * 1024,
});
console.log(r.stdout || '');
if (r.status !== 0) {
  console.error(r.stderr || '');
  process.exit(r.status || 1);
}
