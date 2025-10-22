import stripe from "./stripe"
import type {StripeProductType} from "@repo/types"

export const createStripeProduct = async (item : StripeProductType) => {
    try{
        const res = await stripe.products.create({
            id: item.id,
            name: item.name,
            default_price_data: {
                currency: 'usd',
                unit_amount: item.price * 100,
            }
        })
    }
    catch(err) {
        console.log('Error creating Stripe product', err);
        return err;
    }
}

export const getStripeProductPrice = async (productId: number) => {
    try{
        const res = await stripe.prices.list({product: productId.toString()});
        return res.data[0]?.unit_amount;
    }
    catch(err) {
        console.log('Error getting Stripe product price', err);
        return err;
    }
}

export const deleteStripeProduct = async (productId: number) => {
    try{
        const res = await stripe.products.del(productId.toString());
        return res;
    }
    catch(err) {
        console.log('Error deleting Stripe product', err);
        return err;
    }
}