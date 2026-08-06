const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src', 'components', 'hud'),
  path.join(__dirname, 'src', 'components')
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace text-[8px], text-[9px], text-[10px] with text-xs
  content = content.replace(/text-\[8px\]/g, 'text-xs');
  content = content.replace(/text-\[9px\]/g, 'text-xs');
  content = content.replace(/text-\[10px\]/g, 'text-xs');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'world' && file !== 'exec') { // only focusing on hud and main components
        walkDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

directories.forEach(walkDir);
console.log("Text replacement complete.");
