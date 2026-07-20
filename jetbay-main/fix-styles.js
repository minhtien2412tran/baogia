const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

const h2Regex = /<h2 className="([^"]+)"/g;

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    let filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    content = content.replace(h2Regex, (match, classNames) => {
      if (classNames.includes('text-[32px]')) {
        let newClasses = classNames;
        // Standardize heading styles
        newClasses = newClasses.replace(/md:text-\[[^\]]+\]/g, '');
        newClasses = newClasses.replace(/lg:text-\[[^\]]+\]/g, '');
        newClasses = newClasses.replace(/text-\[32px\]/g, 'text-[32px] md:text-[38px] lg:text-[42px]');
        
        newClasses = newClasses.replace(/text-\[#[A-Fa-f0-9]+\]/g, 'text-[#050505]');
        newClasses = newClasses.replace(/tracking-tight/g, 'tracking-[-0.02em]');
        if (!newClasses.includes('leading-')) {
            newClasses += ' leading-[1.15]';
        }
        // remove extra spaces
        newClasses = newClasses.replace(/\s+/g, ' ').trim();
        changed = true;
        return `<h2 className="${newClasses}"`;
      }
      return match;
    });
    
    // standardize paragraphs
    content = content.replace(/<p className="([^"]+)"/g, (match, classNames) => {
        if (classNames.includes('text-gray-500') || classNames.includes('text-[#475569]')) {
             let newClasses = classNames.replace(/text-gray-500/g, 'text-[#4A4A4A]');
             newClasses = newClasses.replace(/text-\[#475569\]/g, 'text-[#4A4A4A]');
             newClasses = newClasses.replace(/text-\[16px\]/g, 'text-[16.5px]');
             changed = true;
             return `<p className="${newClasses}"`;
        }
        return match;
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
