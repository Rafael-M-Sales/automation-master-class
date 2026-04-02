#!/bin/bash
# Script para criar a fila SQS automaticamente na LocalStack
# Isso garante que quando o Docker subir, a infra já esteja pronta

echo "CRIANDO FILA SQS: orders-queue..."
awslocal sqs create-queue --queue-name orders-queue

echo "LISTANDO FILAS CRIADAS:"
awslocal sqs list-queues
