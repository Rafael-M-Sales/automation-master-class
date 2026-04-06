const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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
    // Se a variável HEADLESS for 'false', o navegador abre na tela
    headless: process.env.HEADLESS !== 'false', 
    slowMo: process.env.HEADLESS === 'false' ? 1000 : 100 // Fica mais lento se estivermos assistindo
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
  
  // 1. Definimos a estrutura de pastas por data e título
  const dataHoje = new Date().toISOString().split('T')[0]; // Formato AAAA-MM-DD
  const nomeCenario = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const baseDir = path.join(process.cwd(), 'reports', 'RESULTADOS', dataHoje, nomeCenario);

  // Criamos as pastas se não existirem
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // 2. Tiramos um screenshot final (Sucesso ou Falha) para registro
  const status = scenario.result.status.toLowerCase();
  const screenPath = path.join(baseDir, `resultado-${status}.png`);
  
  await this.page.screenshot({ path: screenPath, fullPage: true });
  console.log(`[RELATÓRIO] Evidência salva em: ${screenPath}`);

  // Se o teste falhar, logamos o aviso
  if (status === 'failed') {
    console.warn(`[ALERTA] O cenário "${scenario.pickle.name}" falhou.`);
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
