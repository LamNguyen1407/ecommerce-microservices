import { Hono } from "hono";
import Stripe from "stripe";
import stripe from "../utils/stripe";
import { producer } from "../utils/kafka";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
const webhookRoute = new Hono();

webhookRoute.post('/stripe', async (c) => {
    const body = await c.req.text();
    const sig = c.req.header('stripe-signature');

    let event: Stripe.Event;

    try{
        event = stripe.webhooks.constructEvent(body, sig!, webhookSecret)
    }
    catch(err) {
        console.log('Error verifying Stripe webhook signature', err);
        return c.json({error: 'Webhook signature verification failed'}, 400);
    }

    switch(event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;

            // console.log(session);
           
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);


            //TODO CREATE ORDER
            producer.send('payment.successful', {
                value: {
                    userId: session.client_reference_id,
                    email: session.customer_details?.email,
                    shippingAddress: session.customer_details?.address,
                    amount: session.amount_total,
                    status: session.payment_status === "paid" ? "success" : "failed",
                    products: lineItems.data.map((item) => ({
                        name: item.description,
                        quantity: item.quantity,
                        price: item.price?.unit_amount,
                    }))
                }
            })
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }

    return c.json({received: true});
})

export default webhookRoute;