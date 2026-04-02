pipeline {
    agent any // Rodar no agente disponível

    environment {
        // Configuramos as variáveis de ambiente necessárias para os testes no CI
        AWS_ACCESS_KEY_ID = 'test'
        AWS_SECRET_ACCESS_KEY = 'test'
        AWS_REGION = 'us-east-1'
        SQS_ENDPOINT = 'http://localstack:4566' // URL dentro da rede do Docker
    }

    stages {
        stage('🚀 Preparação') {
            steps {
                echo 'Instalando dependências do projeto...'
                sh 'npm install'
                echo 'Instalando navegadores do Playwright...'
                sh 'npx playwright install chromium'
            }
        }

        stage('🧪 Testes Regressivos') {
            steps {
                echo 'Iniciando execução dos testes BDD (Gherkin)...'
                // Executa os testes e gera o relatório JUnit (que o Jenkins entende)
                sh 'npm test'
            }
        }
    }

    post {
        always {
            echo 'Gerando relatórios de teste...'
            // O Jenkins vai ler os resultados daqui para mostrar os gráficos de sucesso/falha
            junit 'reports/*.xml'
            
            // Salva o relatório HTML do Cucumber como um artefato permanente
            archiveArtifacts artifacts: 'reports/cucumber-report.html', fingerprint: true
        }
    }
}
