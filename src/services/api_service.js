const axios = require('axios');

/**
 * Serviço para interagir com APIs REST (HTTP)
 * Responsável pelos testes de Caixa Branca e Caixa Preta (BFF/BFB)
 */
class APIService {
  constructor() {
    this.api = axios.create({
      baseURL: 'https://restful-booker.herokuapp.com',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });

    this.mock_service = axios.create({
      baseURL: 'http://localhost:3000', // Nosso Mock Service no Docker
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Cria uma reserva no site público de teste (Restful Booker)
   */
  async createBooking(bookingData) {
    console.log('[API] Criando reserva no Restful Booker...');
    try {
      const response = await this.api.post('/booking', bookingData);
      return response;
    } catch (error) {
      console.error('[API] Erro ao criar reserva:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Envia uma ordem para o nosso microserviço mockado (que fala com SQS)
   */
  async createOrder(orderData) {
    console.log(`[API] Enviando ordem "${orderData.orderId}" para o Mock Order Service...`);
    try {
      const response = await this.mock_service.post('/order', orderData);
      return response;
    } catch (error) {
      console.error('[API] Erro ao enviar ordem:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new APIService();
