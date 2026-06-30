const fs = require('fs');
const h = fs.readFileSync(__dirname + '/jetbay-en-us.html', 'utf8');
const media = [...new Set([...h.matchAll(/v4\/alt\/media\/[^"'\s?\\]+/g)].map((m) => m[0]))];
console.log(media.join('\n'));
