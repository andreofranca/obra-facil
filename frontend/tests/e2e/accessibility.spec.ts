import { test, expect } from "@playwright/test";

test.describe("Acessibilidade e Navegação por Teclado", () => {
  test("deve conseguir focar interativamente nos elementos da página inicial", async ({ page }) => {
    await page.goto("/");
    
    // Aguarda o carregamento inicial da página
    await page.waitForLoadState("networkidle");

    // Foca no body para iniciar a navegação por tab
    await page.locator("body").focus();

    // Pressiona Tab e verifica se algum elemento interativo recebeu foco
    await page.keyboard.press("Tab");
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy(); // Algum elemento deve ter recebido foco
    expect(focusedElement).not.toBe("BODY"); // O foco deve ter saído do body
  });

  test("deve renderizar a página sem quebrar em mobile", async ({ page, isMobile }) => {
    // Se for mobile, checar se a viewport não tem rolagem horizontal indesejada
    if (isMobile) {
      await page.goto("/");
      const overflowX = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflowX).toBe(false);
    }
  });
});
