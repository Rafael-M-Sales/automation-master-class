module.exports = {
  default: {
    format: [
      'summary',
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js'
    ],
    // Definimos o timeout maior para o SQS (como é assíncrono, pode demorar alguns segundos)
    timeout: 30000,
    parallel: 1,
    publishQuiet: true
  }
};
