const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const apiService = require('../../src/services/api_service');
const sqsService = require('../../src/services/sqs_service');
const LoginPage = require('../../src/pages/login_page');

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
