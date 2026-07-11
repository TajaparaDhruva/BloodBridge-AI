import fs from 'fs';
import translate from 'translate';
translate.engine = 'google';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  const raw = fs.readFileSync('extracted_strings.json', 'utf8');
  let strings = JSON.parse(raw);
  // filter long strings
  strings = strings.filter(s => s.length < 300);

  const langs = ['hi', 'gu', 'mr'];
  
  for (const lang of langs) {
    const dict = {};
    const chunkSize = 20;
    
    for (let i = 0; i < strings.length; i += chunkSize) {
      const chunk = strings.slice(i, i + chunkSize);
      const text = chunk.join(' ||| ');
      
      try {
        const res = await translate(text, { to: lang });
        const translated = res.split('|||').map(s => s.trim());
        
        chunk.forEach((orig, idx) => {
          if (translated[idx]) {
            dict[orig] = translated[idx];
          }
        });
        console.log(\[\] Translated chunk \ to \\);
      } catch (err) {
        console.error('Error on chunk', i, err.message);
      }
      await sleep(1000); // prevent rate limiting
    }
    
    fs.writeFileSync(\scratch/dict_\.json\, JSON.stringify(dict, null, 2));
    console.log(\Finished \\);
  }
}
run();

