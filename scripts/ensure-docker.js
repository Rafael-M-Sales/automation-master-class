const { execSync, spawn } = require('child_process');
const path = require('path');

// Caminho padrão do Docker Desktop no Windows
const DOCKER_PATH = 'C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe';

/**
 * Verifica se o Docker está respondendo a comandos.
 */
function isDockerRunning() {
    try {
        execSync('docker version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Inicia o Docker Desktop e aguarda ele estar pronto.
 */
async function ensureDocker() {
    console.log('🔍 Verificando se o Docker Desktop está rodando...');

    if (isDockerRunning()) {
        console.log('✅ Docker já está em execução! 🚀');
        return;
    }

    console.log('⚠️  Docker não encontrado. Tentando abrir o Docker Desktop automaticamente...');

    try {
        // Inicia o processo de forma independente
        const dockerProcess = spawn(DOCKER_PATH, {
            detached: true,
            stdio: 'ignore'
        });
        dockerProcess.unref(); // Deixa o processo rodar em background sem travar o script

        console.log('⏳ Docker Desktop solicitado. Aguardando a inicialização do daemon (isso pode levar alguns segundos)...');

        let attempts = 0;
        const maxAttempts = 30; // 30 tentativas x 2 segundos = 60 segundos
        const waitTime = 2000;

        while (attempts < maxAttempts) {
            attempts++;
            if (isDockerRunning()) {
                console.log('🚀 Docker Desktop está pronto! Iniciando nossa infraestrutura...');
                return;
            }
            process.stdout.write('.'); // Barra de progresso visual
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }

        console.error('\n❌ O Docker Desktop demorou muito para iniciar ou não pôde ser aberto.');
        console.error('Por favor, abra o Docker Desktop manualmente e tente novamente.');
        process.exit(1);

    } catch (error) {
        console.error('❌ Erro crítico ao tentar abrir o Docker Desktop:', error.message);
        console.error('Verifique se o Docker Desktop está instalado em: ' + DOCKER_PATH);
        process.exit(1);
    }
}

// Executa a função principal
ensureDocker();
