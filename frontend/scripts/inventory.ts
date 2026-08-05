import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

function walkDir(dir: string, fileList: string[] = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      walkDir(path.join(dir, file), fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = walkDir(SRC_DIR);
const elements: Array<{file: string, line: number, content: string}> = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.match(/<(Button|button|Link|a )/)) {
      elements.push({
        file: file.replace(process.cwd(), ''),
        line: index + 1,
        content: line.trim()
      });
    }
  });
});

let md = '# FUNCTIONAL INVENTORY\n\n';
md += '| Componente / Tela | Elemento | Status Atual |\n';
md += '| --- | --- | --- |\n';

elements.forEach(el => {
  md += `| ${el.file}:${el.line} | \`${el.content}\` | Não classificado |\n`;
});

fs.writeFileSync('FUNCTIONAL_INVENTORY.md', md);
console.log('Inventory generated!');
