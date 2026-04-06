const express = require('express');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

// Inicializa o servidor Express (nosso mini-microserviço)
const app = express();
app.use(express.json());

// Configura o Cliente SQS para falar com a LocalStack
// Se estivéssemos na AWS real, o endpoint seria automático
const sqsClient = new SQSClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: process.env.SQS_ENDPOINT || 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

// Rota para criar um pedido (Simulando um fluxo de Microserviços/BFF)
app.post('/order', async (req, res) => {
  const { orderId, customerName, total } = req.body;

  console.log(`[OrderService] Recebendo pedido ${orderId} para ${customerName}`);

  // 1. Preparamos a mensagem para enviar ao SQS (Fluxo Assíncrono)
  // Em um sistema real, isso avisa outros serviços que um pedido foi criado
  const messageBody = JSON.stringify({
    event: 'ORDER_CREATED',
    orderId,
    customerName,
    total,
    timestamp: new Date().toISOString(),
  });

  try {
    // 2. Enviamos para a fila (SQS)
    const command = new SendMessageCommand({
      // No LocalStack, a URL da fila segue o padrão: endpoint/account_id/queue_name
      QueueUrl: `${process.env.SQS_ENDPOINT}/000000000000/${process.env.QUEUE_NAME || 'orders-queue'}`,
      MessageBody: messageBody,
    });

    await sqsClient.send(command);
    console.log(`[OrderService] Mensagem enviada para SQS para o pedido ${orderId}`);

    // 3. Respondemos ao cliente (Playwright vai validar isso aqui)
    res.status(201).json({
      message: 'Pedido criado com sucesso e enviado para processamento!',
      orderId,
    });
  } catch (error) {
    console.error('[OrderService] Erro ao enviar para SQS:', error);
    res.status(500).json({ error: 'Falha ao processar pedido' });
  }
});

// Porta onde o serviço vai rodar
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Mock Order Service rodando na porta ${PORT}`);
});
