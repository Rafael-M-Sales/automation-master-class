# language: pt

Funcionalidade: Fluxo de Pedido e Reserva de Hotel
  Como um usuário do sistema
  Quero realizar uma reserva via API e validar o login no portal
  Para garantir que os fluxos síncronos e assíncronos estão funcionando

  Contexto: Acessar a aplicação
    Dado que eu tenha as credenciais de um usuário padrão

  @regressivo @api @ui @sqs
  Cenário: Realizar reserva de hotel e validar processamento assíncrono
    Quando eu enviar uma requisição para criar uma reserva no "Restful Booker"
    Então a API deve retornar o código de status 200 (Sucesso)
    E os dados da reserva devem estar corretos no retorno

    Quando eu realizar o login no portal "SauceDemo" com as mesmas credenciais
    Então eu devo visualizar a página de produtos com sucesso

    Quando eu enviar um sinal de novo pedido para o microserviço de ordens com o ID "ORD-123"
    Então eu devo validar que a mensagem do pedido "ORD-123" chegou na fila SQS "orders-queue"
