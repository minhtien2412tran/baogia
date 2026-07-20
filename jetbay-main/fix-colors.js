const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');

const replacements = [
  // Primary Text Color -> Deep Navy Blue (#0B1F3A)
  { regex: /text-\[#050505\]/g, replace: 'text-[#0B1F3A]' },
  { regex: /text-\[#111827\]/g, replace: 'text-[#0B1F3A]' },
  { regex: /text-\[#0F172A\]/g, replace: 'text-[#0B1F3A]' },
  
  // Mint Greens to Warm Gold (#D4A64A) for accents or Industrial Blue (#123C72) for primaries
  // Primary CTA buttons usually were #40DACD -> Industrial Blue (#123C72)
  { regex: /bg-\[#40DACD\]/g, replace: 'bg-[#123C72]' },
  { regex: /hover:bg-\[#34c4b8\]/g, replace: 'hover:bg-[#0B1F3A]' },
  { regex: /hover:bg-\[#34C4B8\]/g, replace: 'hover:bg-[#0B1F3A]' },
  
  // Text accents
  { regex: /text-\[#40DACD\]/g, replace: 'text-[#123C72]' },
  { regex: /text-\[#13B2A6\]/g, replace: 'text-[#123C72]' },
  { regex: /text-\[#61D1C5\]/g, replace: 'text-[#123C72]' },
  
  // Other Mint buttons
  { regex: /bg-\[#61D1C5\]/g, replace: 'bg-[#123C72]' },
  { regex: /hover:bg-\[#52BDB1\]/g, replace: 'hover:bg-[#0B1F3A]' },
  
  // Other Mint backgrounds
  { regex: /bg-\[#E2F6F3\]/g, replace: 'bg-[#F5F7FA]' },
  { regex: /bg-\[#E6F8F7\]/g, replace: 'bg-[#F5F7FA]' },
  
  // Borders
  { regex: /border-\[#BDEBE4\]/g, replace: 'border-[#E9EDF2]' },
  
  // Logo Strip Background -> Industrial Blue
  { regex: /from-\[#699E96\]/g, replace: 'from-[#123C72]' },
  { regex: /via-\[#5FB2A6\]/g, replace: 'via-[#0B1F3A]' },
  { regex: /to-\[#699E96\]/g, replace: 'to-[#123C72]' },
  
  // Link underlines
  { regex: /decoration-\[#40DACD\]\/40/g, replace: 'decoration-[#123C72]/40' },
  { regex: /hover:decoration-\[#40DACD\]/g, replace: 'hover:decoration-[#123C72]' },
];

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    let filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    replacements.forEach(r => {
      content = content.replace(r.regex, r.replace);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated colors in ${file}`);
    }
  }
});
