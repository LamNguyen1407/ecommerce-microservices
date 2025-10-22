import { createConsumer, CreateKafkaClient, createProducer } from "@repo/kafka";


const kafkaClient = CreateKafkaClient("payment-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "payment-group");