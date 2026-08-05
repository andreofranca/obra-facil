import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('deve permitir o login do Cliente Demo', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'cliente@demo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');

    // Should redirect to meus-pedidos
    await expect(page).toHaveURL(/\/meus-pedidos/);
    
    // Should see a welcome message or some client-specific content
    await expect(page.getByText('Meus Pedidos')).toBeVisible();
    await expect(page.getByText('Noah Oliveira')).toBeVisible();
  });

  test('deve permitir o login do Profissional Demo', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'profissional@demo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or meus-pedidos (wait, the code currently redirects to /meus-pedidos)
    await expect(page).toHaveURL(/\/profissional\/pedidos/);
    
    // Should see professional name
    await expect(page.getByText('Suélen Costa')).toBeVisible();
  });
});
