import { createConsumer, CreateKafkaClient, createProducer } from "@repo/kafka";

const kafKaClient = CreateKafkaClient("order-service");

export const producer = createProducer(kafKaClient);
export const consumer = createConsumer(kafKaClient, "order-group");