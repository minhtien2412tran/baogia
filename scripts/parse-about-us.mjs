import fs from 'fs';

const h = fs.readFileSync('scratch/pages/about-us.html', 'utf8');

function dec(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

const imgs = [...h.matchAll(/asserts\.jet-bay\.com([^?"']+)/g)]
  .map((m) => m[1])
  .filter((v, i, a) => a.indexOf(v) === i);

console.log('IMAGES (' + imgs.length + '):');
imgs.forEach((i) => console.log(i));

const h2 = [...h.matchAll(/<h2[^>]*>([^<]{3,120})</gi)].map((m) => dec(m[1]));
console.log('\nH2:', h2);

const h3 = [...h.matchAll(/<h3[^>]*>([^<]{3,100})</gi)].map((m) => dec(m[1]));
console.log('\nH3:', h3);

const ps = [...h.matchAll(/<p[^>]*>([^<]{30,400})</gi)].map((m) => dec(m[1])).slice(0, 20);
console.log('\nPARAS:');
ps.forEach((p, i) => console.log(i + 1, p));
