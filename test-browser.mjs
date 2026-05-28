import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

const errors = [];
const logs = [];

page.on('console', msg => {
  const text = msg.text();
  logs.push({type: msg.type(), text: text.substring(0, 500)});
  if (msg.type() === 'error') {
    errors.push(text.substring(0, 500));
  }
});

page.on('pageerror', error => {
  errors.push('PAGE ERROR: ' + error.message.substring(0, 500));
});

try {
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(3000);
} catch(e) {
  errors.push('Navigation error: ' + e.message);
}

const rootContent = await page.evaluate(() => {
  const root = document.getElementById('root');
  return root ? { childCount: root.childElementCount, innerHTML: root.innerHTML.substring(0, 500) } : 'NO ROOT';
});

await browser.close();

console.log('=== CONSOLE ERRORS ===');
console.log(JSON.stringify(errors.slice(0, 20), null, 2));
console.log('=== ALL LOGS ===');
console.log(JSON.stringify(logs.slice(0, 30), null, 2));
console.log('=== ROOT CONTENT ===');
console.log(JSON.stringify(rootContent, null, 2));
