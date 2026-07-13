import fs from 'node:fs';

const f = 'apps/api/prisma/seed.ts';
let s = fs.readFileSync(f, 'utf8');
const pairs = [
  [
    'This is the clean-room reconstructed privacy policy for JetBay platform.',
    'This privacy policy describes how JetVina processes personal data.',
  ],
  ['Privacy Policy - JetBay', 'Privacy Policy - JetVina'],
  ['How JetBay handles your personal data.', 'How JetVina handles your personal data.'],
  ['JetBay Expands Private Jet Fleet', 'JetVina Expands Private Jet Fleet'],
  [
    'JetBay announces fleet expansion with additional light and heavy jets available for charter.',
    'JetVina announces fleet expansion with additional light and heavy jets available for charter.',
  ],
  ['Fleet Expansion News - JetBay', 'Fleet Expansion News - JetVina'],
  ['JetBay expands private jet fleet for global charter.', 'JetVina expands private jet fleet for global charter.'],
  ['Pet Travel Tips - JetBay Blog', 'Pet Travel Tips - JetVina Blog'],
  ['Private Jet Charter - JetBay', 'Private Jet Charter - JetVina'],
  ['by private jet with JetBay.', 'by private jet with JetVina.'],
  [
    'These terms govern use of the JetBay private jet booking platform.',
    'These terms govern use of the JetVina private jet booking platform.',
  ],
  ['Terms of Service - JetBay', 'Terms of Service - JetVina'],
  ["author: 'JetBay Team'", "author: 'JetVina Team'"],
  ['About JetBay', 'About JetVina'],
  [
    'JetBay is a global private jet booking platform headquartered in Singapore with 6 other offices worldwide.',
    'JetVina is a Vietnam-based private jet charter company with offices across Asia Pacific.',
  ],
  ['About Us - JetBay', 'About Us - JetVina'],
  [
    'Learn about JetBay private jet charter — global offices, awards, and 10,000+ aircraft.',
    'Learn about JetVina private jet charter across Vietnam and Asia Pacific.',
  ],
  ['How Booking Works - JetBay', 'How Booking Works - JetVina'],
  ['Step-by-step private jet booking guide with JetBay.', 'Step-by-step private jet booking guide with JetVina.'],
];

for (const [a, b] of pairs) {
  if (!s.includes(a)) console.warn('missing:', a.slice(0, 60));
  s = s.split(a).join(b);
}
fs.writeFileSync(f, s);
console.log('seed public strings updated');
