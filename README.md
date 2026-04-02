# 🚀 Projeto Master Class: Automação Total (Playwright + BDD + SQS + Docker)

Bem-vindo ao seu primeiro projeto de automação de nível profissional! Este repositório foi criado para ser o seu guia passo a passo no mundo do **QA Automation (Qualidade de Software)** e **DevOps**.

---

## 🛠️ O que tem aqui dentro? (Tech Stack)

Este projeto não faz apenas "testes de clique". Ele simula um ecossistema corporativo real:

*   **Playwright (O Mestre da Automação)**: Nossa ferramenta para abrir o navegador, achar botões e também para falar com APIs (o "cérebro" das aplicações).
*   **Cucumber / BDD (Gherkin)**: Permite que escrevamos os testes em **Português**, de um jeito que qualquer pessoa do negócio consiga ler e entender.
*   **Docker & Docker Compose**: Cria "caixinhas" (containers) no seu computador para rodar o Jenkins e a LocalStack sem você precisar instalar nada pesado no Windows.
*   **LocalStack (AWS SQS)**: Simula o serviço de filas da Amazon (AWS) localmente. Usamos isso para testar o **Fluxo Assíncrono** (quando um sistema avisa o outro que algo aconteceu).
*   **Jenkins (CI/CD)**: Nosso "Robô de Fábrica". Ele é quem rodaria seus testes automaticamente toda vez que um desenvolvedor mudasse o código.

---

## 📋 Pré-requisitos

1.  **Node.js**: Instalado na sua máquina (onde o JavaScript roda).
2.  **Docker Desktop**: Aberto e rodando (Verificamos e você já tem! 🎉).

---

## 🚀 Passo a Passo para Rodar (O Guia do Iniciante)

### Passo 1: Subir a Infraestrutura (As "Caixinhas")
Abra o seu terminal na pasta do projeto e digite:
```powershell
npm run infra:up
```
Isso vai baixar e ligar o **LocalStack**, o **Jenkins** e o nosso **Microserviço de Pedidos**. 
> *Aguarde uns 2 minutos na primeira vez, o Docker está preparando tudo para você.*

### Passo 2: Instalar o Navegador
O Playwright precisa do navegador específico dele. Rode:
```powershell
npx playwright install chromium
```

### Passo 3: Rodar os Testes! 🧪
Agora é a hora da verdade! Para rodar o fluxo completo (API + UI + SQS), digite:
```powershell
npm test
```
O que vai acontecer:
1.  Ele vai criar uma reserva no site **Restful Booker** via API.
2.  Ele vai abrir o navegador (invisível) e logar no site **SauceDemo**.
3.  Ele vai mandar um pedido para o nosso microserviço e **esperar** o SQS confirmar que a mensagem chegou.

---

## 📁 Estrutura do Projeto (Onde encontrar o quê?)

*   `features/`: Onde ficam os arquivos `.feature` (os testes em português).
*   `features/step_definitions/`: Onde o código em JavaScript "atende" o que foi escrito no Gherkin.
*   `src/pages/`: Lógica das telas do site (Page Objects).
*   `src/services/`: Lógica para falar com a API e com o SQS (Fila).
*   `mocks/`: Nosso microserviço de mentirinha para testes.
*   `reports/`: Onde o relatório bonitão (HTML) vai aparecer depois que você rodar o teste.

---

## 📖 Comentários no Código

Eu coloquei **comentários explicativos** em quase todas as linhas dos arquivos `.js`. 
Sugiro que você abra o arquivo `features/step_definitions/steps.js` para ver como a "mágica" acontece!

---

### 🔥 Diferencial: Observabilidade
Ao final do teste, abra a pasta `reports/` e clique no arquivo `cucumber-report.html`. Você verá um relatório profissional com o tempo de cada passo e se houve sucesso ou falha.

---

**Dúvidas?** Basta me perguntar! Estou aqui para te tornar um mestre em automação. 🚀
