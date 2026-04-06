// @ts-check
const { test, expect } = require('@playwright/test');
const LoginPage = require('../../src/pages/login_page');
const InventoryPage = require('../../src/pages/inventory_page');

/**
 * Suite de Testes de UI: Integridade da Vitrine
 * Este teste valida todos os elementos da página de produtos.
 */
test.describe('UI: SauceDemo Inventory (Página de Produtos)', () => {
  
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Deve exibir exatamente 6 itens no inventário', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('Cada item deve conter nome, descrição e preço válido', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const items = await inventoryPage.getAllItems();
    
    // Verificamos o conteúdo de cada um dos 6 cards
    for (let i = 0; i < 6; i++) {
      const item = items.nth(i);
      
      const name = await item.locator('.inventory_item_name').innerText();
      const desc = await item.locator('.inventory_item_desc').innerText();
      const price = await item.locator('.inventory_item_price').innerText();

      expect(name.length).toBeGreaterThan(0);
      expect(desc.length).toBeGreaterThan(0);
      expect(price).toMatch(/\$\d+\.\d+/); // Valida formato $XX.XX
      
      console.log(`[UI Validation] Item ${i+1}: ${name} - OK`);
    }
  });

  test('Deve atualizar o carrinho ao adicionar produtos', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    
    // Adiciona o primeiro e o segundo item
    await inventoryPage.addItemToCart(0);
    expect(await inventoryPage.getCartCount()).toBe('1');
    
    await inventoryPage.addItemToCart(1);
    expect(await inventoryPage.getCartCount()).toBe('2');
    
    console.log('[UI Validation] Contador do carrinho atualizado com sucesso!');
  });

  test('Deve exibir o filtro de ordenação e o ícone do carrinho', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(page.locator(inventoryPage.filterDropdown)).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });
});
