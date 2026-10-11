const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.js'));
for (const f of files) {
  try {
    const s = fs.readFileSync(f, 'utf8');
    const titles = s.match(/(?:title|name)["']?\s*:\s*["'][^"']{3,60}["']/gi);
    const urls = s.match(/https?:\/\/[a-zA-Z0-9.\-_]+\.[a-zA-Z]{2,4}[^\s"'<>)]*/gi);
    if (titles || urls) {
      console.log(`=== ${f} ===`);
      if (titles) console.log('Titles:', [...new Set(titles)].slice(0, 8));
      if (urls) console.log('URLs:', [...new Set(urls)].slice(0, 8));
    }
  } catch (e) {
    console.error(f, e.message);
  }
}
