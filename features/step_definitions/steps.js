const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const apiService = require('../../src/services/api_service');
const sqsService = require('../../src/services/sqs_service');
const LoginPage = require('../../src/pages/login_page');
const InventoryPage = require('../../src/pages/inventory_page');
const CheckoutPage = require('../../src/pages/checkout_page');

// --- DADO ---
Given('que eu tenha as credenciais de um usuário padrão', async function () {
  this.userName = 'standard_user';
  this.password = 'secret_sauce';
});

// --- QUANDO (API Restful Booker) ---
When('eu enviar uma requisição para criar uma reserva no "Restful Booker"', async function () {
  const bookingData = {
    firstname: "Antigravity",
    lastname: "MasterClass",
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: "2026-04-02",
      checkout: "2026-04-03"
    },
    additionalneeds: "Breakfast"
  };

  this.response = await apiService.createBooking(bookingData);
});

Then('a API deve retornar o código de status 200 \\(Sucesso\\)', async function () {
  expect(this.response.status).toBe(200);
});

Then('os dados da reserva devem estar corretos no retorno', async function () {
  const data = this.response.data;
  expect(data.booking.firstname).toBe("Antigravity");
  expect(data.bookingid).toBeDefined();
  
  // Guardamos o ID para usar em outros testes se necessário
  this.bookingId = data.bookingid;
  console.log(`[PASS] Reserva criada com ID: ${this.bookingId}`);
});

// --- QUANDO (UI SauceDemo) ---
When('eu realizar o login no portal "SauceDemo" com as mesmas credenciais', async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.navigate();
  await loginPage.login(this.userName, this.password);
});

Then('eu devo visualizar a página de produtos com sucesso', async function () {
  const loginPage = new LoginPage(this.page);
  const success = await loginPage.isLoggedIn();
  expect(success).toBeTruthy();
  console.log(`[PASS] Login realizado com sucesso no SauceDemo!`);
});

Then('a vitrine deve exibir 6 produtos com preços e nomes válidos', async function () {
  const inventoryPage = new InventoryPage(this.page);
  this.itemPrices = []; // Inicializamos a lista de preços
  
  // Validamos a quantidade total
  const count = await inventoryPage.getItemCount();
  expect(count).toBe(6);
  
  // Validamos os detalhes de cada item
  const items = await inventoryPage.getAllItems();
  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    const name = await item.locator(inventoryPage.itemName).innerText();
    const priceText = await item.locator(inventoryPage.itemPrice).innerText();

    expect(name.length).toBeGreaterThan(0);
    expect(priceText).toMatch(/\$\d+\.\d+/);
    
    // Extraímos o valor numérico (removendo o $) e guardamos na lista
    const priceValue = parseFloat(priceText.replace('$', ''));
    this.itemPrices.push(priceValue);
    
    console.log(`[PASS] Item ${i+1} validado: ${name} (${priceText})`);
  }
});

When('eu adicionar todos os produtos da vitrine ao carrinho', async function () {
  const inventoryPage = new InventoryPage(this.page);
  const count = await inventoryPage.getItemCount();
  
  for (let i = 0; i < count; i++) {
    // Clicamos sempre no primeiro botão disponível, pois a lista diminui conforme itens são adicionados
    await inventoryPage.addItemToCart(0); 
    console.log(`[PASS] Produto ${i+1} adicionado ao carrinho.`);
  }
});

Then('o contador do carrinho deve exibir {string}', async function (expectedCount) {
  const inventoryPage = new InventoryPage(this.page);
  const count = await inventoryPage.getCartCount();
  expect(count).toBe(expectedCount);
  console.log(`[PASS] Contador do carrinho validado: ${count}`);
});

When('eu realizar o checkout do pedido com meus dados', async function () {
  const checkoutPage = new CheckoutPage(this.page);
  
  await checkoutPage.goToCart();
  await checkoutPage.startCheckout();
  await checkoutPage.fillInformation('Antigravity', 'User', '12345');
  // Paramos aqui para validar o subtotal na tela de revisão
  console.log(`[PASS] Chegamos à tela de revisão do pedido.`);
});

Then('o valor subtotal do checkout deve corresponder à soma dos preços dos produtos', async function () {
  const checkoutPage = new CheckoutPage(this.page);
  
  // Capturamos o subtotal da tela (Ex: "Item total: $129.94")
  const subtotalText = await checkoutPage.getSubtotal();
  const displayedSubtotal = parseFloat(subtotalText.replace('Item total: $', ''));
  
  // Calculamos a soma dos preços que guardamos na vitrine
  const calculatedSum = this.itemPrices.reduce((acc, curr) => acc + curr, 0);
  
  console.log(`[MATH] Soma Calculada: ${calculatedSum.toFixed(2)} | Subtotal Exibido: ${displayedSubtotal.toFixed(2)}`);
  
  // Validação com margem de erro mínima para floats
  expect(Math.abs(calculatedSum - displayedSubtotal)).toBeLessThan(0.01);
  console.log(`[PASS] O valor matemático do subtotal está correto!`);
});

Then('eu devo visualizar a mensagem de confirmação {string}', async function (expectedMessage) {
  const checkoutPage = new CheckoutPage(this.page);
  
  // Finalizamos o pedido agora
  await checkoutPage.finishOrder();
  
  const actualMessage = await checkoutPage.getSuccessMessage();
  expect(actualMessage).toBe(expectedMessage);
  console.log(`[PASS] Pedido finalizado e confirmação recebida: ${actualMessage}`);
});

// --- QUANDO (Microserviço Mock + SQS) ---
When('eu enviar um sinal de novo pedido para o microserviço de ordens com o ID {string}', async function (orderId) {
  const orderData = {
    orderId: orderId,
    customerName: "Antigravity User",
    total: 999.50
  };

  this.orderResponse = await apiService.createOrder(orderData);
  expect(this.orderResponse.status).toBe(201);
});

Then('eu devo validar que a mensagem do pedido {string} chegou na fila SQS {string}', async function (orderId, queueName) {
  // Chamamos o serviço de SQS que vai "ouvir" a fila até encontrar a mensagem
  const message = await sqsService.waitForMessage(queueName, orderId);
  
  // Validamos se o conteúdo da mensagem está correto
  expect(message.orderId).toBe(orderId);
  expect(message.event).toBe('ORDER_CREATED');
  console.log(`[PASS] Mensagem do pedido ${orderId} validada com sucesso no SQS!`);
});
