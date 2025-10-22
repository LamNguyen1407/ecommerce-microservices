import { createConsumer, CreateKafkaClient, createProducer } from "@repo/kafka";

const kafkaClient = CreateKafkaClient("product-service");

export const producer = createProducer(kafkaClient);
export const consumer = createConsumer(kafkaClient, "product-group");