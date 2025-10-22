import { clerkMiddleware } from '@hono/clerk-auth'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import sessionRoute from './routes/session.route'
import { cors } from 'hono/cors'
import webhookRoute from './routes/webhooks.route'
import { consumer, producer } from './utils/kafka'
import { runKafkaSubscriptions } from './utils/subscriptions'


const app = new Hono()

app.use('*', clerkMiddleware())
app.use('*', cors({origin: ['http://localhost:3002']}))

// app.get('/test', shouldBeUser,  (c) => {
//   return c.json({message: `Payment service authenticated`, userId: c.get('userId')})
// })

// app.post('/create-stripe-product',async (c) => {

//   const res = await stripe.products.create({
//     id: '123',
//     name: "Test Product",
//     default_price_data: {
//       currency: 'usd',
//       unit_amount: 10 * 100,
//     }
//   })
//   return c.json(res)
// })

// app.get('/stripe-product-price',async (c) => {

//   const res = await stripe.prices.list({
//     product: '123',
//   })
//   return c.json(res)
// })

app.route("/sessions", sessionRoute)
app.route("/webhooks", webhookRoute)

const start = async () => {
  try{
    await producer.connect();
    await consumer.connect();
    await runKafkaSubscriptions()
    serve({
      fetch: app.fetch,
      port: 8002
    }, (info) => {
      console.log(`Server is running on http://localhost:${info.port}`)
    })
  }
  catch(err){
    console.error(err)
    process.exit(1)
  }
};

start();

