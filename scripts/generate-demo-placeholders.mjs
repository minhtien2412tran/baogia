/**
 * Generates original royalty-free SVG demo images for public UI.
 * No third-party photos — safe to ship while CLIENT assets are pending.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'apps/web/public/placeholders/demo');
fs.mkdirSync(dir, { recursive: true });

function svg(w, h, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Demo placeholder">
${body}
</svg>
`;
}

const files = {
  'aircraft-01.svg': svg(
    1600,
    900,
    `  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e3a5f"/><stop offset="55%" stop-color="#0d1520"/><stop offset="100%" stop-color="#070a0e"/></linearGradient>
    <linearGradient id="fus" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#d8dde6"/><stop offset="100%" stop-color="#9aa3b2"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0c078"/><stop offset="100%" stop-color="#a8843a"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#sky)"/>
  <circle cx="1280" cy="160" r="70" fill="#f0e6c8" opacity="0.35"/>
  <path d="M0 620 Q400 540 800 580 T1600 540 V900 H0Z" fill="#0a1018" opacity="0.85"/>
  <ellipse cx="820" cy="470" rx="420" ry="18" fill="#000" opacity="0.25"/>
  <g transform="translate(420,360)">
    <path d="M40 80 L520 60 L760 72 L780 88 L760 104 L520 118 L40 100 Z" fill="url(#fus)"/>
    <path d="M180 70 L280 10 L320 18 L240 78 Z" fill="#b8c0cc"/>
    <path d="M180 110 L300 170 L340 160 L250 105 Z" fill="#b8c0cc"/>
    <path d="M700 55 L780 20 L800 28 L740 78 Z" fill="#aeb6c2"/>
    <rect x="120" y="74" width="28" height="18" rx="3" fill="#2a3544" opacity="0.7"/>
    <rect x="170" y="72" width="28" height="18" rx="3" fill="#2a3544" opacity="0.7"/>
    <rect x="220" y="70" width="28" height="18" rx="3" fill="#2a3544" opacity="0.7"/>
    <path d="M40 88 L0 95 L40 100 Z" fill="url(#gold)"/>
  </g>
  <text x="80" y="860" fill="#c9a45c" font-family="Georgia, serif" font-size="28" opacity="0.55">DEMO · royalty-free illustration</text>`,
  ),

  'aircraft-02.svg': svg(
    1600,
    900,
    `  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#152033"/><stop offset="100%" stop-color="#0a0d12"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <path d="M100 700 L1500 520" stroke="#3a4658" stroke-width="2" stroke-dasharray="14 10" opacity="0.6"/>
  <g transform="translate(500,300) scale(1.1)">
    <path d="M20 120 C80 40 220 20 420 50 C620 80 780 90 860 100 C820 120 620 150 400 160 C200 168 60 150 20 120Z" fill="#c5ccd8"/>
    <path d="M260 55 L360 -20 L400 -10 L320 70Z" fill="#9ea8b8"/>
    <path d="M280 145 L400 230 L440 215 L330 140Z" fill="#9ea8b8"/>
    <ellipse cx="120" cy="105" rx="36" ry="14" fill="#1a2433" opacity="0.5"/>
  </g>
  <rect x="60" y="60" width="220" height="8" rx="4" fill="#c9a45c" opacity="0.5"/>
  <text x="80" y="860" fill="#8a93a3" font-family="Georgia, serif" font-size="26" opacity="0.5">DEMO aircraft</text>`,
  ),

  'aircraft-03.svg': svg(
    1200,
    800,
    `  <defs>
    <radialGradient id="r" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#243044"/><stop offset="100%" stop-color="#0b0e14"/></radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#r)"/>
  <path d="M200 420 L980 300" fill="none" stroke="#c9a45c" stroke-width="1.5" opacity="0.35"/>
  <circle cx="200" cy="420" r="6" fill="#c9a45c" opacity="0.6"/>
  <circle cx="980" cy="300" r="6" fill="#c9a45c" opacity="0.6"/>
  <g transform="translate(280,280)">
    <path d="M0 90 L480 50 L620 62 L600 95 L470 120 L0 110Z" fill="#d0d5de"/>
    <path d="M140 55 L220 0 L250 10 L180 70Z" fill="#a8b0be"/>
    <path d="M150 115 L250 175 L280 160 L190 110Z" fill="#a8b0be"/>
  </g>
  <text x="48" y="760" fill="#6b7382" font-family="Georgia, serif" font-size="22">DEMO · not a real aircraft photo</text>`,
  ),

  'destination-01.svg': svg(
    1200,
    800,
    `  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a7fb5"/><stop offset="50%" stop-color="#87b8d8"/><stop offset="100%" stop-color="#d4e8f0"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a8f9e"/><stop offset="100%" stop-color="#1a5f6a"/></linearGradient>
    <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8d4a8"/><stop offset="100%" stop-color="#c9a45c"/></linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky)"/>
  <circle cx="980" cy="140" r="56" fill="#ffe6a8" opacity="0.85"/>
  <path d="M0 420 Q300 380 600 430 T1200 400 V560 H0Z" fill="url(#sea)"/>
  <path d="M0 540 Q400 500 800 560 T1200 520 V800 H0Z" fill="url(#sand)"/>
  <ellipse cx="220" cy="520" rx="90" ry="28" fill="#1a6b5c" opacity="0.55"/>
  <path d="M220 520 L210 420 L230 420 Z" fill="#5a4030"/>
  <path d="M220 430 Q160 400 150 440 Q190 450 220 430 Q280 400 290 440 Q250 450 220 430Z" fill="#2d7a4f"/>
  <text x="48" y="760" fill="#5a4030" font-family="Georgia, serif" font-size="22" opacity="0.55">DEMO destination</text>`,
  ),

  'destination-02.svg': svg(
    1200,
    800,
    `  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2740"/><stop offset="100%" stop-color="#6b8cae"/></linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky)"/>
  <path d="M0 520 L220 280 L380 480 L560 200 L760 460 L940 260 L1200 500 V800 H0Z" fill="#e8eef5"/>
  <path d="M220 280 L260 320 L200 330 Z" fill="#fff" opacity="0.7"/>
  <path d="M560 200 L600 250 L530 255 Z" fill="#fff" opacity="0.75"/>
  <path d="M940 260 L970 300 L910 305 Z" fill="#fff" opacity="0.7"/>
  <rect x="0" y="620" width="1200" height="180" fill="#2a3344"/>
  <text x="48" y="760" fill="#aeb6c4" font-family="Georgia, serif" font-size="22" opacity="0.6">DEMO alpine</text>`,
  ),

  'destination-03.svg': svg(
    1200,
    800,
    `  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1c2a1a"/><stop offset="40%" stop-color="#3d5a36"/><stop offset="100%" stop-color="#8a9e5a"/></linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <ellipse cx="600" cy="520" rx="420" ry="80" fill="#6b8a48" opacity="0.4"/>
  <circle cx="200" cy="480" r="14" fill="#c9a45c" opacity="0.35"/>
  <circle cx="340" cy="500" r="10" fill="#c9a45c" opacity="0.3"/>
  <circle cx="480" cy="470" r="12" fill="#c9a45c" opacity="0.35"/>
  <circle cx="700" cy="490" r="11" fill="#c9a45c" opacity="0.3"/>
  <circle cx="860" cy="460" r="13" fill="#c9a45c" opacity="0.35"/>
  <path d="M100 600 Q600 540 1100 600" fill="none" stroke="#d4c4a0" stroke-width="18" opacity="0.35"/>
  <text x="48" y="760" fill="#d4e0c8" font-family="Georgia, serif" font-size="22" opacity="0.55">DEMO golf / leisure</text>`,
  ),

  'cabin-01.svg': svg(
    1600,
    900,
    `  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a221c"/><stop offset="100%" stop-color="#12100e"/></linearGradient>
    <linearGradient id="seat" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a3528"/><stop offset="100%" stop-color="#2a1c14"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#wall)"/>
  <ellipse cx="800" cy="120" rx="520" ry="80" fill="#1a1612"/>
  <rect x="180" y="280" width="280" height="360" rx="28" fill="url(#seat)"/>
  <rect x="520" y="280" width="280" height="360" rx="28" fill="url(#seat)"/>
  <rect x="860" y="280" width="280" height="360" rx="28" fill="url(#seat)"/>
  <rect x="1200" y="280" width="220" height="360" rx="28" fill="url(#seat)"/>
  <rect x="200" y="300" width="240" height="40" rx="8" fill="#c9a45c" opacity="0.25"/>
  <rect x="540" y="300" width="240" height="40" rx="8" fill="#c9a45c" opacity="0.25"/>
  <rect x="880" y="300" width="240" height="40" rx="8" fill="#c9a45c" opacity="0.25"/>
  <ellipse cx="800" cy="820" rx="600" ry="40" fill="#0a0806" opacity="0.5"/>
  <text x="80" y="860" fill="#c9a45c" font-family="Georgia, serif" font-size="26" opacity="0.45">DEMO cabin</text>`,
  ),

  'news-01.svg': svg(
    1600,
    900,
    `  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a2030"/><stop offset="100%" stop-color="#0c1018"/></linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#g)"/>
  <rect x="120" y="120" width="1360" height="660" rx="20" fill="#151b26" stroke="#2a3344" stroke-width="2"/>
  <rect x="120" y="120" width="1360" height="90" fill="#1e2633"/>
  <circle cx="180" cy="165" r="14" fill="#c9a45c" opacity="0.5"/>
  <rect x="220" y="152" width="280" height="26" rx="6" fill="#2a3344"/>
  <rect x="200" y="280" width="700" height="36" rx="6" fill="#2a3344"/>
  <rect x="200" y="340" width="900" height="22" rx="4" fill="#222a36"/>
  <rect x="200" y="380" width="820" height="22" rx="4" fill="#222a36"/>
  <rect x="200" y="420" width="760" height="22" rx="4" fill="#222a36"/>
  <rect x="1050" y="280" width="360" height="240" rx="12" fill="#243044"/>
  <path d="M1120 420 L1200 360 L1280 400 L1380 320" fill="none" stroke="#c9a45c" stroke-width="3" opacity="0.4"/>
  <text x="80" y="860" fill="#6b7382" font-family="Georgia, serif" font-size="24" opacity="0.5">DEMO news</text>`,
  ),

  'news-02.svg': svg(
    1200,
    800,
    `  <rect width="1200" height="800" fill="#12161c"/>
  <rect x="80" y="80" width="1040" height="640" rx="16" fill="#1a2030"/>
  <rect x="120" y="140" width="420" height="280" rx="12" fill="#243044"/>
  <circle cx="330" cy="260" r="40" fill="none" stroke="#c9a45c" stroke-width="2" opacity="0.4"/>
  <polygon points="320,240 360,260 320,280" fill="#c9a45c" opacity="0.45"/>
  <rect x="580" y="150" width="480" height="28" rx="6" fill="#2a3344"/>
  <rect x="580" y="210" width="440" height="16" rx="4" fill="#222a36"/>
  <rect x="580" y="250" width="400" height="16" rx="4" fill="#222a36"/>
  <rect x="580" y="290" width="360" height="16" rx="4" fill="#222a36"/>
  <text x="48" y="760" fill="#6b7382" font-family="Georgia, serif" font-size="20" opacity="0.5">DEMO article</text>`,
  ),

  'service-01.svg': svg(
    1200,
    900,
    `  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2433"/><stop offset="100%" stop-color="#0a0c10"/></linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#g)"/>
  <rect x="100" y="100" width="1000" height="700" rx="28" fill="none" stroke="#2a3340" stroke-width="2"/>
  <circle cx="600" cy="400" r="90" fill="none" stroke="#c9a45c" stroke-width="2" opacity="0.45"/>
  <path d="M560 400 L590 430 L660 360" fill="none" stroke="#c9a45c" stroke-width="4" opacity="0.55"/>
  <rect x="360" y="560" width="480" height="18" rx="9" fill="#2a3340"/>
  <rect x="420" y="600" width="360" height="12" rx="6" fill="#222a36"/>
  <text x="48" y="860" fill="#6b7382" font-family="Georgia, serif" font-size="22" opacity="0.5">DEMO service</text>`,
  ),

  'service-02.svg': svg(
    1200,
    900,
    `  <rect width="1200" height="900" fill="#10141a"/>
  <path d="M200 650 Q400 200 600 450 T1000 280" fill="none" stroke="#3a4454" stroke-width="3"/>
  <circle cx="200" cy="650" r="10" fill="#c9a45c" opacity="0.5"/>
  <circle cx="600" cy="450" r="10" fill="#c9a45c" opacity="0.5"/>
  <circle cx="1000" cy="280" r="10" fill="#c9a45c" opacity="0.5"/>
  <rect x="140" y="720" width="200" height="14" rx="7" fill="#2a3340"/>
  <rect x="500" y="720" width="200" height="14" rx="7" fill="#2a3340"/>
  <rect x="860" y="720" width="200" height="14" rx="7" fill="#2a3340"/>
  <text x="48" y="860" fill="#6b7382" font-family="Georgia, serif" font-size="22" opacity="0.5">DEMO workflow</text>`,
  ),

  'membership-01.svg': svg(
    800,
    400,
    `  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a2030"/><stop offset="100%" stop-color="#0e1218"/></linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#g)"/>
  <rect x="40" y="40" width="720" height="320" rx="16" fill="none" stroke="#c9a45c" stroke-width="1.5" opacity="0.35"/>
  <circle cx="400" cy="170" r="48" fill="none" stroke="#c9a45c" stroke-width="2" opacity="0.5"/>
  <text x="400" y="178" text-anchor="middle" fill="#c9a45c" font-family="Georgia, serif" font-size="28" opacity="0.7">JV</text>
  <rect x="260" y="250" width="280" height="16" rx="8" fill="#2a3340"/>
  <text x="400" y="320" text-anchor="middle" fill="#6b7382" font-family="Georgia, serif" font-size="16" opacity="0.5">DEMO partner</text>`,
  ),

  'hero-01.svg': svg(
    1920,
    1080,
    `  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0%" stop-color="#0b1a2e"/><stop offset="45%" stop-color="#152438"/><stop offset="100%" stop-color="#0a0c10"/></linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#c9a45c" stop-opacity="0"/><stop offset="50%" stop-color="#c9a45c" stop-opacity="0.35"/><stop offset="100%" stop-color="#c9a45c" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sky)"/>
  <circle cx="1500" cy="220" r="90" fill="#f5e6c0" opacity="0.12"/>
  <path d="M0 780 Q480 680 960 740 T1920 700 V1080 H0Z" fill="#06080c"/>
  <path d="M200 620 C600 480 1000 520 1600 400" fill="none" stroke="url(#gold)" stroke-width="2"/>
  <g transform="translate(720,440) scale(1.35)">
    <path d="M0 60 L380 30 L560 42 L540 70 L370 90 L0 75Z" fill="#c8ced8" opacity="0.85"/>
    <path d="M120 35 L200 -20 L230 -10 L160 50Z" fill="#9aa3b2" opacity="0.9"/>
    <path d="M130 80 L220 140 L250 125 L170 75Z" fill="#9aa3b2" opacity="0.9"/>
  </g>
  <text x="80" y="1020" fill="#c9a45c" font-family="Georgia, serif" font-size="32" opacity="0.4">DEMO hero · original illustration · no third-party photo</text>`,
  ),

  'map-01.svg': svg(
    800,
    500,
    `  <rect width="800" height="500" fill="#121820"/>
  <rect x="40" y="40" width="720" height="420" rx="12" fill="#1a2230"/>
  <path d="M120 280 Q200 180 320 220 T520 160 T680 240" fill="none" stroke="#3a4658" stroke-width="2"/>
  <circle cx="180" cy="240" r="8" fill="#c9a45c" opacity="0.7"/>
  <circle cx="320" cy="220" r="8" fill="#c9a45c" opacity="0.7"/>
  <circle cx="520" cy="160" r="8" fill="#c9a45c" opacity="0.7"/>
  <circle cx="680" cy="240" r="8" fill="#c9a45c" opacity="0.7"/>
  <text x="400" y="420" text-anchor="middle" fill="#6b7382" font-family="Georgia, serif" font-size="18" opacity="0.5">DEMO map</text>`,
  ),
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), content);
}

console.log(`Wrote ${Object.keys(files).length} demo SVGs → ${dir}`);
