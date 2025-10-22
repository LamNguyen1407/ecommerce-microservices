import { OrderModel } from "@repo/order-db";
import { OrderType } from "@repo/types";

export const createOrder = async (order: OrderType) => {
    const newOrder = new OrderModel(order)

    try {
        await newOrder.save();
    }
    catch(err){
        console.log('Error creating order', err);
    }
}