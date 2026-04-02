/**
 * Arquivo: login_page.js
 * Padrão: Page Object Model (POM) - Separação da lógica de visualização da lógica do teste
 */
class LoginPage {
  constructor(page) {
    this.page = page;
    this.url = 'https://www.saucedemo.com/';

    // Seletores (Identificadores dos elementos na tela)
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
    this.productsTitle = '.title'; // Texto "Products" que aparece após logar
  }

  /**
   * Navega até a página de login
   */
  async navigate() {
    console.log(`[UI] Navegando para ${this.url}...`);
    await this.page.goto(this.url);
  }

  /**
   * Realiza o login completo
   */
  async login(user, pass) {
    console.log(`[UI] Realizando login com o usuário: ${user}`);
    await this.page.fill(this.usernameInput, user);
    await this.page.fill(this.passwordInput, pass);
    await this.page.click(this.loginButton);
  }

  /**
   * Verifica se o login foi bem sucedido
   */
  async isLoggedIn() {
    // Espera até que o título "Products" esteja visível
    const isVisible = await this.page.isVisible(this.productsTitle);
    return isVisible;
  }
}

module.exports = LoginPage;
