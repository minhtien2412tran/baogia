const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    let filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Find <button className="...">
    content = content.replace(/<button className="([^"]+)"/g, (match, classNames) => {
      if (classNames.includes('bg-[#123C72]') || classNames.includes('bg-[#D4A64A]')) {
        let newClasses = classNames.replace(/text-\[#0B1F3A\]/g, 'text-white');
        newClasses = newClasses.replace(/text-[#0B1F3A]/g, 'text-white');
        newClasses = newClasses.replace(/text-gray-900/g, 'text-white');
        newClasses = newClasses.replace(/text-black/g, 'text-white');
        changed = true;
        return `<button className="${newClasses}"`;
      }
      return match;
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated buttons in ${file}`);
    }
  }
});
