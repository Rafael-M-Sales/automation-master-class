// @ts-check
const { test, expect } = require('@playwright/test');
const sqsService = require('../../src/services/sqs_service');

/**
 * Testes de Integração Assíncrona
 * Validando se o Mock Service realmente entrega mensagens no SQS
 */
test.describe('Integração: Mock Order Service -> AWS SQS (LocalStack)', () => {
  const mockServiceURL = 'http://localhost:3000';
  const orderId = `TEST-ORDER-${Date.now()}`;

  test('Deve enviar uma ordem e confirmar o recebimento via SQS', async ({ request }) => {
    // 1. Enviamos a ordem para o microserviço Mock
    console.log(`[Playwright Test] Enviando pedido ${orderId}...`);
    const response = await request.post(`${mockServiceURL}/order`, {
      data: {
        orderId: orderId,
        customerName: "Playwright Automated Test",
        total: 1250.75
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.orderId).toBe(orderId);

    // 2. Usamos nosso serviço de SQS para validar que a mensagem chegou na "Nuvem Local"
    console.log(`[Playwright Test] Aguardando mensagem no SQS: orders-queue...`);
    const message = await sqsService.waitForMessage('orders-queue', orderId);

    // 3. Asserções finais da mensagem SQS
    expect(message.orderId).toBe(orderId);
    expect(message.event).toBe('ORDER_CREATED');
    expect(message.customerName).toBe("Playwright Automated Test");
  });
});
