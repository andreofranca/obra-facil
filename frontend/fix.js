const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      content = content.replace(/import\s*\{\s*Header.*\}\s*from\s*['"`]@\/components\/layout['"`];?\r?\n?/g, '');
      content = content.replace(/import\s*\{\s*Footer.*\}\s*from\s*['"`]@\/components\/layout['"`];?\r?\n?/g, '');
      content = content.replace(/<Header\s*\/>\r?\n?/g, '');
      content = content.replace(/<Footer\s*\/>\r?\n?/g, '');
      
      content = content.replace(/bg-neutral-surface/g, 'bg-slate-800/50 backdrop-blur-xl');
      content = content.replace(/border-neutral-border/g, 'border-slate-700/50');
      content = content.replace(/text-neutral-text/g, 'text-white');
      content = content.replace(/text-neutral-muted/g, 'text-slate-400');
      content = content.replace(/shadow-soft/g, 'shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]');
      content = content.replace(/bg-neutral-background/g, 'bg-transparent');
      content = content.replace(/bg-white/g, 'bg-slate-800/50 backdrop-blur-xl');
      content = content.replace(/text-neutral-dark/g, 'text-white');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('src/app/(authenticated)');
console.log('Headers and Footers removed and basic styles updated');
