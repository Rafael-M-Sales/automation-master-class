const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

// Definimos o tempo limite global para 30 segundos (evita o erro de timeout de 5s)
setDefaultTimeout(30000);

// Variáveis globais para o navegador
let browser;

/**
 * Executa uma vez antes de TODOS os testes iniciarem
 */
BeforeAll(async function () {
  console.log('--- INICIANDO SUÍTE DE TESTES ---');
  browser = await chromium.launch({ 
    headless: true, // Muda para false se quiser ver o navegador abrindo
    slowMo: 100 // Atraso de 0.1s em cada ação para facilitar a visão (opcional)
  });
});

/**
 * Executa antes de CADA cenário do Gherkin
 */
Before(async function () {
  console.log('\n>>> Iniciando novo cenário...');
  // Criamos um novo contexto (abas limpas) para cada teste
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
});

/**
 * Executa após CADA cenário do Gherkin
 */
After(async function (scenario) {
  console.log('<<< Finalizando cenário.');
  
  // Se o teste falhar, podemos tirar um screenshot automático aqui! (Opcional)
  if (scenario.result.status === 'FAILED') {
    const screenPath = `./reports/fail-${scenario.pickle.name.replace(/ /g, '_')}.png`;
    await this.page.screenshot({ path: screenPath });
    console.warn(`[DEBUG] Teste falhou! Screenshot salva em: ${screenPath}`);
  }

  // Fechar a aba e o contexto após o teste
  await this.page.close();
  await this.context.close();
});

/**
 * Executa após TODOS os testes finalizarem
 */
AfterAll(async function () {
  console.log('\n--- SUÍTE DE TESTES FINALIZADA ---');
  await browser.close();
});
