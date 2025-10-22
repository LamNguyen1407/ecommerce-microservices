import Clerk from '@clerk/fastify'
import Fastify from 'fastify'
import { connectDB } from '@repo/order-db'
import { orderRoute } from './routes/order'
import { consumer, producer } from './utils/kafka'
import { runKafkaSubscriptions } from './utils/subscriptions'

const fastify = Fastify()

fastify.register(Clerk.clerkPlugin)
fastify.register(orderRoute);


const start = async () => {
    try{
        await connectDB();
        await producer.connect();
        await consumer.connect();
        await runKafkaSubscriptions();
        await fastify.listen({port: 8001});
        console.log('Order service listening on port 8001')
    }
    catch(err){
        console.log('Error starting server', err);
        process.exit(1)
    }
}

start();