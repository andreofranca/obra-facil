import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function takeScreenshots() {
  console.log('Starting browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  const baseUrl = 'http://localhost:3000';

  console.log('Taking screenshot of Home...');
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '01-home.png'), fullPage: true });

  console.log('Taking screenshot of Marketplace...');
  await page.goto(`${baseUrl}/profissionais`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '02-marketplace.png'), fullPage: true });

  console.log('Taking screenshot of Professional Profile...');
  await page.goto(`${baseUrl}/profissionais`, { waitUntil: 'networkidle' });
  const viewProfileButtons = await page.$$('a:has-text("Ver perfil")');
  if (viewProfileButtons.length > 0) {
    const href = await viewProfileButtons[0].getAttribute('href');
    if (href) {
      await page.goto(`${baseUrl}${href}`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(outDir, '03-perfil.png'), fullPage: true });
    }
  }

  // Login as Cliente
  console.log('Logging in as Cliente...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'cliente@pmo.com');
  await page.fill('input[name="password"]', 'senha123');
  await page.click('button:has-text("Entrar")');
  await page.waitForURL('**/meus-pedidos');
  console.log('Taking screenshot of Dashboard Cliente...');
  await page.waitForTimeout(2000); // wait for skeleton loaders
  await page.screenshot({ path: path.join(outDir, '04-dashboard-cliente.png'), fullPage: true });

  // Logout
  await context.clearCookies();
  await page.goto(`${baseUrl}/`);

  // Login as Profissional
  console.log('Logging in as Profissional...');
  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'profissional@pmo.com');
  await page.fill('input[name="password"]', 'senha123');
  await page.click('button:has-text("Entrar")');
  await page.waitForURL('**/profissional/pedidos');
  console.log('Taking screenshot of Dashboard Profissional...');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, '05-dashboard-profissional.png'), fullPage: true });

  await browser.close();
  console.log('All screenshots taken and saved to /screenshots.');
}

takeScreenshots().catch(console.error);
