/**
 * Arquivo: inventory_page.js
 * Descrição: Representa a página de inventário de produtos após o login.
 */
const { highlightElement } = require('../support/visual_helper');

class InventoryPage {
  constructor(page) {
    this.page = page;
    this.inventoryItems = '.inventory_item';
    this.itemName = '.inventory_item_name';
    this.itemDescription = '.inventory_item_desc';
    this.itemPrice = '.inventory_item_price';
    this.addToCartButtons = 'button[data-test^="add-to-cart"]';
    this.removeButtons = 'button[data-test^="remove"]';
    this.cartBadge = '.shopping_cart_badge';
    this.filterDropdown = '.product_sort_container';
  }

  /**
   * Retorna todos os cards de produtos
   */
  async getAllItems() {
    return this.page.locator(this.inventoryItems);
  }

  /**
   * Retorna a quantidade de produtos visíveis
   */
  async getItemCount() {
    return await this.page.locator(this.inventoryItems).count();
  }

  /**
   * Adiciona um produto ao carrinho pelo índice
   */
  async addItemToCart(index = 0) {
    const selector = this.addToCartButtons;
    const item = this.page.locator(selector).nth(index);
    
    await highlightElement(item);
    await item.click();
  }

  /**
   * Retorna o texto do contador do carrinho
   */
  async getCartCount() {
    return await this.page.locator(this.cartBadge).innerText();
  }
}

module.exports = InventoryPage;
