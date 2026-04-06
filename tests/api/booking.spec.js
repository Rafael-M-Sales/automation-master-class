// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Testes de API Diretos (Sem n8n/BDD)
 * Usando o framework Nativo do Playwright para maior velocidade e flexibilidade
 */
test.describe('API: Restful-Booker (Booking)', () => {
  const baseURL = 'https://restful-booker.herokuapp.com';

  test('Deve ser capaz de criar uma nova reserva com sucesso', async ({ request }) => {
    const bookingData = {
      firstname: "Playwright",
      lastname: "Expert",
      totalprice: 250,
      depositpaid: true,
      bookingdates: {
        checkin: "2026-04-10",
        checkout: "2026-04-15"
      },
      additionalneeds: "Netflix & Snacks"
    };

    const response = await request.post(`${baseURL}/booking`, {
      data: bookingData,
      headers: {
        'Accept': 'application/json'
      }
    });

    // Validamos o status code
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log(`[Suite API] Reserva criada com sucesso! ID: ${body.bookingid}`);

    // Validamos se o retorno bate com o que enviamos
    expect(body.booking.firstname).toBe("Playwright");
    expect(body.bookingid).toBeDefined();
  });

  test('Deve retornar erro ao tentar criar reserva sem "Accept: application/json"', async ({ request }) => {
    // Essa API (Booker) costuma retornar erro (418 ou 500) se o header Accept for omitido
    const response = await request.post(`${baseURL}/booking`, {
      data: {
        firstname: "Error",
        lastname: "Test"
      }
    });

    // Validamos que NÃO é sucesso (200)
    expect(response.status()).not.toBe(200);
    console.log(`[Suite API] Erro esperado (status: ${response.status()}) validado com sucesso.`);
  });
});
