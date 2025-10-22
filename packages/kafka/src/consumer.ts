import type { Kafka, Consumer } from "kafkajs";


export const createConsumer = (kafka: Kafka, groupId: string) => {
    const consumer: Consumer = kafka.consumer({groupId});

    const connect = async () => {
        await consumer.connect();
        console.log("Consumer connected: ", groupId);
    }

    const subscribe = async (topic: string, handler: (message: any) => Promise<void>) => {
        await consumer.subscribe({topic: topic, fromBeginning: true});

        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                try{
                    const value = message.value?.toString();

                    if(value){
                        await handler(JSON.parse(value));
                    }
                }
                catch(err){
                    console.error("Error processing message: ", err);
                }
        }
    });
    }


    const disconnect = async () => {    
        await consumer.disconnect();
    }

    return {
        connect,
        subscribe,
        disconnect
    }
}