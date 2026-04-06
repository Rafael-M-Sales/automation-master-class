/**
 * Arquivo: checkout_page.js
 * Descrição: Representa o fluxo de fechamento de pedido no SauceDemo.
 */
const { highlightElement } = require('../support/visual_helper');

class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Seletores do Carrinho
    this.cartLink = '.shopping_cart_link';
    this.checkoutButton = '[data-test="checkout"]';

    // Formulário de Informações
    this.firstNameInput = '[data-test="firstName"]';
    this.lastNameInput = '[data-test="lastName"]';
    this.postalCodeInput = '[data-test="postalCode"]';
    this.continueButton = '[data-test="continue"]';

    // Revisão e Finalização
    this.finishButton = '[data-test="finish"]';
    this.subtotalLabel = '.summary_subtotal_label';
    this.successHeader = '.complete-header';
  }

  /**
   * Navega para a página do carrinho
   */
  async goToCart() {
    const item = this.page.locator(this.cartLink);
    await highlightElement(item);
    await item.click();
  }

  /**
   * Inicia o checkout a partir do carrinho
   */
  async startCheckout() {
    const item = this.page.locator(this.checkoutButton);
    await highlightElement(item);
    await item.click();
  }

  /**
   * Preenche o formulário de entrega e avança
   */
  async fillInformation(firstName, lastName, postalCode) {
    const fn = this.page.locator(this.firstNameInput);
    const ln = this.page.locator(this.lastNameInput);
    const pc = this.page.locator(this.postalCodeInput);
    const btn = this.page.locator(this.continueButton);

    await highlightElement(fn);
    await fn.fill(firstName);

    await highlightElement(ln);
    await ln.fill(lastName);

    await highlightElement(pc);
    await pc.fill(postalCode);

    await highlightElement(btn);
    await btn.click();
  }

  /**
   * Finaliza o pedido
   */
  async finishOrder() {
    const item = this.page.locator(this.finishButton);
    await highlightElement(item);
    await item.click();
  }

  /**
   * Captura o valor do subtotal de itens
   */
  async getSubtotal() {
    return await this.page.locator(this.subtotalLabel).innerText();
  }

  /**
   * Captura a mensagem de sucesso final
   */
  async getSuccessMessage() {
    return await this.page.locator(this.successHeader).innerText();
  }
}

module.exports = CheckoutPage;
