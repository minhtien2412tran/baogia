const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'pages');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const url = 'https://www.jet-bay.com/en-us/video-centre';
const out = path.join(dir, 'video-centre.html');
// skip if exists
if (!fs.existsSync(out) || fs.statSync(out).size < 10000) {
  require('child_process').execSync(`curl.exe -sL -A "Mozilla/5.0" "${url}" --max-time 25 -o "${out}"`);
}
const h = fs.readFileSync(out, 'utf8');
const urls = [...new Set([...h.matchAll(/asserts\.jet-bay\.com[^"'\s<>\\?]+/g)].map(x => x[0].split('?')[0]))];
console.log(urls.filter(u => /video|thumb|cover|videoImg/i.test(u)).slice(0, 25).join('\n'));
