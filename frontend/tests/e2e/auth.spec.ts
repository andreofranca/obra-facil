import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('deve permitir o login do Cliente Demo', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'cliente@pmo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');

    // Should redirect to meus-pedidos
    await expect(page).toHaveURL(/\/meus-pedidos/);
    
    // Should see Application Shell components like Dashboard navigation
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Logout', { exact: false }).or(page.getByText('Sair'))).toBeVisible();
  });

  test('deve permitir o login do Profissional Demo', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'profissional@pmo.com');
    await page.fill('input[type="password"]', 'senha123');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard or profissional/pedidos
    await expect(page).toHaveURL(/\/profissional\/pedidos/);
    
    // Should see Application Shell components
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Meu Perfil')).toBeVisible();
  });
});
