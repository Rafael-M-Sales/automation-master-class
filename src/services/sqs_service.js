const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require('@aws-sdk/client-sqs');

/**
 * Serviço para interagir com o Amazon SQS (ou LocalStack)
 * Responsável por validar fluxos assíncronos
 */
class SQSService {
  constructor() {
    this.client = new SQSClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566', // LocalStack
      credentials: {
        accessKey_Id: 'test',
        secretAccessKey: 'test',
      },
    });
  }

  /**
   * Tenta encontrar uma mensagem específica na fila
   * @param {string} queueName Nome da fila
   * @param {string} filterText Texto que deve conter na mensagem (ex: orderId)
   * @param {number} retries Número de tentativas (polling)
   */
  async waitForMessage(queueName, filterText, retries = 5) {
    const queueUrl = `http://localhost:4566/000000000000/${queueName}`;
    
    console.log(`[SQS] Procurando por "${filterText}" na fila "${queueName}"...`);

    for (let i = 0; i < retries; i++) {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5, // Long polling
      });

      const response = await this.client.send(command);

      if (response.Messages) {
        for (const msg of response.Messages) {
          if (msg.Body.includes(filterText)) {
            console.log(`[SQS] Mensagem encontrada!`);
            
            // Opcional: Deletar a mensagem da fila para não sujar outros testes
            await this.client.send(new DeleteMessageCommand({
              QueueUrl: queueUrl,
              ReceiptHandle: msg.ReceiptHandle
            }));

            return JSON.parse(msg.Body);
          }
        }
      }

      console.log(`[SQS] Tentativa ${i + 1}/${retries}: Mensagem não encontrada, tentando novamente...`);
      await new Promise(res => setTimeout(res, 2000)); // Espera 2 segundos antes de tentar de novo
    }

    throw new Error(`[SQS] Mensagem com o texto "${filterText}" não foi encontrada após ${retries} tentativas.`);
  }
}

module.exports = new SQSService();
