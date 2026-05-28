
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

const logs = [];
page.on('console', msg => logs.push({type: msg.type(), text: msg.text().substring(0, 200)}));
page.on('pageerror', error => logs.push({type: 'pageerror', text: error.message.substring(0, 200)}));

await page.goto('http://localhost:3001/admin/login', { waitUntil: 'networkidle' });
await page.fill('input[type="password"]', 'mellimelos2025');
await page.click('button:has-text("Ingresar")');
await page.waitForURL('**/admin', { timeout: 5000 });

await page.goto('http://localhost:3001/admin/productos', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

const nuevoBtn = await page.locator('button:has-text("Nuevo producto")');
const count = await nuevoBtn.count();
console.log('Found ' + count + ' buttons');

if (count > 0) {
  const isVisible = await nuevoBtn.isVisible();
  const isEnabled = await nuevoBtn.isEnabled();
  console.log('Visible: ' + isVisible + ', Enabled: ' + isEnabled);

  try {
    await nuevoBtn.click();
    await page.waitForTimeout(1000);
    const modal = await page.locator('text=Nombre').count();
    console.log('Modal fields: ' + modal);
    const formVisible = await page.isVisible('text=Cancelar');
    console.log('Form visible: ' + formVisible);
  } catch(e) {
    console.log('Click error: ' + e.message);
  }
}

console.log('---LOGS---');
logs.forEach(l => console.log('[' + l.type + '] ' + l.text));

await browser.close();
