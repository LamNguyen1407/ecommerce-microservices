import { Hono } from "hono";
import stripe from "../utils/stripe";
import { shouldBeUser } from "../middleware/authMiddleware";
import { CartItemsType } from "@repo/types";
import { getStripeProductPrice } from "../utils/stripeProduct";

const sessionRoute = new Hono();

sessionRoute.post('/create-checkout-session', shouldBeUser, async (c) => {
  const {cart}: {cart: CartItemsType} = await c.req.json();
  const userId = c.get("userId");

  const lineItems = await Promise.all(
    cart.map(async(item) => {
      const unitAmount = await getStripeProductPrice(item.id);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: unitAmount as number,
        },
        quantity: item.quantity,
        }
    })

  )
  try{
    const session = await stripe.checkout.sessions.create({
    ui_mode: 'custom',
    line_items: lineItems,
    client_reference_id: userId,
    mode: 'payment',
    return_url: `${process.env.NEXT_PUBLIC_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return c.json({checkoutSessionClientSecret: session.client_secret});
  }
  catch(err){
    console.log(err);
    return c.json({err});
  }
});

sessionRoute.get('/:session_id', async (c) => {
  const {session_id} = c.req.param();
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items'],
  });

  // console.log('Retrieved session:', session);

  return c.json({
    status: session.status,
    paymentStatus: session.payment_status,
  });

});

export default sessionRoute;