/**
 * Arquivo: visual_helper.js
 * Descrição: Utilitário para destacar visualmente elementos durante a automação.
 */

/**
 * Aplica uma borda vermelha ao elemento e faz uma pequena pausa para visualização.
 * @param {import('@playwright/test').Locator} locator - O elemento a ser destacado.
 * @param {number} duration - Tempo de pausa em milissegundos (padrão 500ms).
 */
async function highlightElement(locator, duration = 500) {
  try {
    // Aplicamos o estilo CSS diretamente no elemento via Playwright
    await locator.evaluate((el) => {
      el.style.border = '3px solid red';
      el.style.boxShadow = '0 0 10px red';
    });

    // Pausa para que o olho humano consiga acompanhar
    await new Promise(resolve => setTimeout(resolve, duration));

    // Removemos o destaque para não atrapalhar o próximo passo
    await locator.evaluate((el) => {
      el.style.border = '';
      el.style.boxShadow = '';
    });
  } catch (error) {
    // Se falhar (ex: elemento sumiu), apenas ignoramos para não travar o teste
    console.warn(`[AVISO] Não foi possível destacar o elemento: ${error.message}`);
  }
}

module.exports = { highlightElement };
