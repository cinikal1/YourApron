const https = require('https'), fs = require('fs');
const key = process.argv[2];
if (!key) { console.error('Usage: node generate-fonts.js YOUR_API_KEY'); process.exit(1); }
const TOP_PICKS = ['Bebas Neue','Oswald','Barlow Condensed','Montserrat','Dancing Script','Raleway','Playfair Display','Lora','Josefin Sans','Pacifico'];
https.get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`, res => {
  let raw = '';
  res.on('data', c => raw += c);
  res.on('end', () => {
    const data = JSON.parse(raw);
    if (data.error) { console.error('API error:', data.error.message); process.exit(1); }
    const fonts = data.items.map((f,i) => ({ name: f.family, cat: f.category, popularity: i, featured: TOP_PICKS.includes(f.family) }));
    fs.writeFileSync('fonts-data.js', `// Auto-generated — ${fonts.length} fonts\nconst FONTS = ${JSON.stringify(fonts, null, 2)};\n`);
    console.log(`✓ ${fonts.length} fonts written to fonts-data.js`);
  });
}).on('error', e => { console.error(e.message); process.exit(1); });
