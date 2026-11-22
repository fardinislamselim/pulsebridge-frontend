const fs = require('fs');
const path = require('path');

function mirror(src, targets) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const srcChild = path.join(src, entry.name);
      for (const target of targets) {
        const targetChild = path.join(target, entry.name);
        if (!fs.existsSync(targetChild)) {
          fs.mkdirSync(targetChild, { recursive: true });
        }
      }
      mirror(srcChild, targets.map(t => path.join(t, entry.name)));
    }
  }
}

const baseApp = path.join(__dirname, 'src', 'app');
const t1 = path.join(__dirname, '.next', 'server', 'app');
const t2 = path.join(__dirname, '.next', 'types', 'app');

[t1, t2].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

mirror(baseApp, [t1, t2]);
console.log('Build directories pre-mirrored successfully.');
