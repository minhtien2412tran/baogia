const fs = require('fs');
const h = fs.readFileSync(__dirname + '/jetbay-en-us.html', 'utf8');
// menu images
const menu = [...new Set([...h.matchAll(/jetbayImg\/menu\/[^"'\s?\\]+/g)].map(m => m[0]))];
console.log('menu imgs:', menu.slice(0, 30).join('\n'));
// quote widget icons
const quote = [...new Set([...h.matchAll(/asserts\.jet-bay\.com[^"'\s?\\]*(calendar|exchange|swap|plus|del|mdi)[^"'\s?\\]*/gi)].map(m => m[0].split('?')[0]))];
console.log('\nquote icons:', quote.slice(0, 20).join('\n'));
// video
const vid = [...new Set([...h.matchAll(/asserts\.jet-bay\.com[^"'\s?\\]*video[^"'\s?\\]*/gi)].map(m => m[0].split('?')[0]))];
console.log('\nvideos sample:', vid.slice(0, 15).join('\n'));
