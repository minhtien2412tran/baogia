import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const seeds = [
  {
    key: 'operator_flight_notify',
    locale: 'en',
    subject: '[JetVina] New charter booking {{bookingReference}} — check departure time inside',
    htmlBody:
      '<p>A new charter booking requires your review.</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Customer:</strong> {{customerName}} · {{customerEmail}}<br/><strong>Aircraft:</strong> {{aircraftLabel}}<br/><strong>Passengers:</strong> {{passengerCount}}<br/><strong>Itinerary (each leg · origin local time):</strong><br/>{{itineraryHtml}}<br/><strong>First departure (origin airport local):</strong> {{departureDateTime}}<br/><strong>Timezone IANA:</strong> {{departureTimezone}}<br/><strong>Current status:</strong> {{bookingStatus}}</p><p>Please review aircraft availability and respond through the approved JetVina operations channel.</p>',
    textBody:
      'A new charter booking requires your review.\n\nBooking: {{bookingReference}}\nCustomer: {{customerName}} · {{customerEmail}}\nAircraft: {{aircraftLabel}}\nPassengers: {{passengerCount}}\nItinerary (each leg · origin local time):\n{{itinerary}}\nFirst departure (origin airport local): {{departureDateTime}}\nTimezone IANA: {{departureTimezone}}\nCurrent status: {{bookingStatus}}',
  },
  {
    key: 'operator_flight_notify',
    locale: 'vi',
    subject: '[JetVina] Booking charter mới {{bookingReference}} — xem giờ khởi hành trong mail',
    htmlBody:
      '<p>Có booking charter mới cần hãng xem xét.</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Khách:</strong> {{customerName}} · {{customerEmail}}<br/><strong>Máy bay:</strong> {{aircraftLabel}}<br/><strong>Hành khách:</strong> {{passengerCount}}<br/><strong>Hành trình (từng chặng · giờ địa phương sân bay đi):</strong><br/>{{itineraryHtml}}<br/><strong>Khởi hành chặng 1 (giờ địa phương sân bay đi):</strong> {{departureDateTime}}<br/><strong>Múi giờ IANA:</strong> {{departureTimezone}}<br/><strong>Trạng thái:</strong> {{bookingStatus}}</p>',
    textBody:
      'Booking {{bookingReference}} — {{aircraftLabel}}.\n{{itinerary}}\nKhởi hành: {{departureDateTime}} ({{departureTimezone}})',
  },
  {
    key: 'admin_flight_notify',
    locale: 'en',
    subject: '[JetVina Admin] {{bookingReference}} · {{bookingStatus}} · {{operatorName}}',
    htmlBody:
      '<p>Admin / Sales notification</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Operator:</strong> {{operatorName}}<br/><strong>Aircraft:</strong> {{aircraftLabel}} · Pax {{passengerCount}}<br/><strong>Customer:</strong> {{customerName}} / {{customerEmail}}<br/><strong>Status:</strong> {{bookingStatus}} ({{event}})<br/><strong>Itinerary:</strong><br/>{{itineraryHtml}}<br/><strong>First departure (origin local):</strong> {{departureDateTime}}<br/><strong>Timezone IANA:</strong> {{departureTimezone}}</p>',
    textBody:
      'Admin: {{bookingReference}} operator={{operatorName}}\n{{itinerary}}\nFirst departure: {{departureDateTime}} ({{departureTimezone}})',
  },
  {
    key: 'admin_flight_notify',
    locale: 'vi',
    subject: '[JetVina Admin] {{bookingReference}} · {{bookingStatus}} · {{operatorName}}',
    htmlBody:
      '<p>Thông báo Sales / Admin</p><p><strong>Booking:</strong> {{bookingReference}}<br/><strong>Hãng:</strong> {{operatorName}}<br/><strong>Máy bay:</strong> {{aircraftLabel}} · Pax {{passengerCount}}<br/><strong>Khách:</strong> {{customerName}} / {{customerEmail}}<br/><strong>Trạng thái:</strong> {{bookingStatus}} ({{event}})<br/><strong>Hành trình:</strong><br/>{{itineraryHtml}}<br/><strong>Khởi hành chặng 1 (giờ địa phương):</strong> {{departureDateTime}}<br/><strong>Múi giờ IANA:</strong> {{departureTimezone}}</p>',
    textBody:
      'Admin: {{bookingReference}} hãng={{operatorName}}\n{{itinerary}}\nKhởi hành: {{departureDateTime}} ({{departureTimezone}})',
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
