const fs = require('fs');
const path = require('path');

const webPages = [
  { p: 'apps/web/src/app/[locale]/page.tsx', t: 'Home Page' },
  { p: 'apps/web/src/app/[locale]/about-us/page.tsx', t: 'About Us' },
  { p: 'apps/web/src/app/[locale]/booking-process/page.tsx', t: 'Booking Process' },
  { p: 'apps/web/src/app/[locale]/private-jet-charter/page.tsx', t: 'Private Jet Charter' },
  { p: 'apps/web/src/app/[locale]/fixed-price-charter/page.tsx', t: 'Fixed Price Charter Index' },
  { p: 'apps/web/src/app/[locale]/fixed-price-charter/[slug]/page.tsx', t: 'Fixed Price Route Detail' },
  { p: 'apps/web/src/app/[locale]/empty-leg/page.tsx', t: 'Empty Leg Index' },
  { p: 'apps/web/src/app/[locale]/empty-leg-recommendation/[slug]/page.tsx', t: 'Empty Leg Detail' },
  { p: 'apps/web/src/app/[locale]/group-air-charter/page.tsx', t: 'Group Air Charter' },
  { p: 'apps/web/src/app/[locale]/corporate-air-charter/page.tsx', t: 'Corporate Air Charter' },
  { p: 'apps/web/src/app/[locale]/event-air-charter/page.tsx', t: 'Event Air Charter' },
  { p: 'apps/web/src/app/[locale]/pet-travel/page.tsx', t: 'Pet Travel' },
  { p: 'apps/web/src/app/[locale]/air-ambulance/page.tsx', t: 'Air Ambulance' },
  { p: 'apps/web/src/app/[locale]/jet-card/page.tsx', t: 'Jet Card Membership' },
  { p: 'apps/web/src/app/[locale]/travel-credit/page.tsx', t: 'Travel Credit Program' },
  { p: 'apps/web/src/app/[locale]/global-partnership-program/page.tsx', t: 'Global Partnership Program' },
  { p: 'apps/web/src/app/[locale]/jetbay-private-jet-app/page.tsx', t: 'J-TA Mobile App' },
  { p: 'apps/web/src/app/[locale]/destination/page.tsx', t: 'Destinations' },
  { p: 'apps/web/src/app/[locale]/island-destinations/page.tsx', t: 'Island Destinations' },
  { p: 'apps/web/src/app/[locale]/news/page.tsx', t: 'News Hub' },
  { p: 'apps/web/src/app/[locale]/news/[slug]/page.tsx', t: 'News Article Detail' },
  { p: 'apps/web/src/app/[locale]/blogs/page.tsx', t: 'Blogs Hub' },
  { p: 'apps/web/src/app/[locale]/blogs/[slug]/page.tsx', t: 'Blog Post Detail' },
  { p: 'apps/web/src/app/[locale]/video-centre/page.tsx', t: 'Video Centre' },
  { p: 'apps/web/src/app/[locale]/world-cup-2026-private-jet-booking/page.tsx', t: 'World Cup 2026 Charter Booking' },
  { p: 'apps/web/src/app/[locale]/world-cup-final-2026-private-jet-charter/page.tsx', t: 'World Cup 2026 Final Fixed Packages' },
  { p: 'apps/web/src/app/[locale]/article/[slug]/page.tsx', t: 'Legal & Policy Articles' },
];

const adminPages = [
  { p: 'apps/admin/src/app/dashboard/page.tsx', t: 'Admin Overview Dashboard' },
  { p: 'apps/admin/src/app/dashboard/users/page.tsx', t: 'Manage Users' },
  { p: 'apps/admin/src/app/dashboard/quotes/page.tsx', t: 'Manage Quote Requests' },
  { p: 'apps/admin/src/app/dashboard/bookings/page.tsx', t: 'Manage Bookings' },
  { p: 'apps/admin/src/app/dashboard/aircraft/page.tsx', t: 'Manage Aircraft Fleet' },
  { p: 'apps/admin/src/app/dashboard/airports/page.tsx', t: 'Manage Airports' },
  { p: 'apps/admin/src/app/dashboard/fixed-price/page.tsx', t: 'Manage Fixed Price Routes' },
  { p: 'apps/admin/src/app/dashboard/empty-legs/page.tsx', t: 'Manage Empty Leg Offers' },
  { p: 'apps/admin/src/app/dashboard/jet-card/page.tsx', t: 'Manage Jet Cards' },
  { p: 'apps/admin/src/app/dashboard/travel-credits/page.tsx', t: 'Manage Travel Credits' },
  { p: 'apps/admin/src/app/dashboard/partners/page.tsx', t: 'Manage Partners & Applications' },
  { p: 'apps/admin/src/app/dashboard/content/page.tsx', t: 'Manage Content (CMS)' },
  { p: 'apps/admin/src/app/dashboard/media/page.tsx', t: 'Manage Media Library' },
  { p: 'apps/admin/src/app/dashboard/settings/page.tsx', t: 'System Settings' },
  { p: 'apps/admin/src/app/dashboard/audit-logs/page.tsx', t: 'Audit Logs' },
];

function generate(pages, isWeb) {
  pages.forEach((page) => {
    const filePath = path.join(__dirname, '..', page.p);
    const dir = path.dirname(filePath);
    
    // Create folder structure
    fs.mkdirSync(dir, { recursive: true });
    
    // Generate page code template
    const code = `// J-TA Clean-room Clone UI Route
import React from 'react';

export default function Page(props: any) {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#f6efe2',
      background: '#071018',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '30px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)'
      }}>
        <h1 style={{ color: '#f1d99a', marginBottom: '8px' }}>${page.t}</h1>
        <p style={{ color: '#b7b0a5', fontSize: '15px' }}>
          This is a clean-room UI skeleton page for the J-TA ${isWeb ? 'Public Web' : 'Admin Dashboard'} route:
        </p>
        <code style={{
          display: 'block',
          padding: '12px',
          background: '#000',
          borderRadius: '8px',
          color: '#8ab4ff',
          fontSize: '13px'
        }}>${page.p}</code>
      </div>
    </div>
  );
}
`;
    
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`Generated: ${page.p}`);
  });
}

console.log('Generating public web pages...');
generate(webPages, true);

console.log('Generating admin pages...');
generate(adminPages, false);

console.log('Route generation completed.');
