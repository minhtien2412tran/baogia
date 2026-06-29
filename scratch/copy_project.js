const fs = require('fs');
const path = require('path');

const src = 'c:\\tien\\tien\\baogia';
const dest = 'C:\\tien\\code\\TA\\j-ta-platform';

const ignoreList = [
  'node_modules',
  '.next',
  'dist',
  '.git',
  '.pnpm-store',
  'test-results',
  'playwright-report'
];

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  
  fs.readdirSync(from).forEach(element => {
    if (ignoreList.includes(element)) {
      return;
    }
    
    const srcPath = path.join(from, element);
    const destPath = path.join(to, element);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

console.log(`Copying project from ${src} to ${dest}...`);
try {
  copyFolderSync(src, dest);
  console.log('Copy completed successfully.');
} catch (err) {
  console.error('Error during copy:', err);
}
