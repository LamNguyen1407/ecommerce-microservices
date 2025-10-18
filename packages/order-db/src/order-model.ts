import mongoose, { model } from 'mongoose';

export const OrderStatusEnum = {
    SUCCESS: 'success',
    FAILED: 'failed',
};

const OrderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    email: {type: String, required: true},
    amount: {type: Number, required: true},
    status: {type: String, required: true, enum: Object.values(OrderStatusEnum)},
    products: {
        type: [
            {
                name: {type: String, required: true},
                price: {type: Number, required: true},
                quantity: {type: Number, required: true},
            }
        ],
        required: true,
    },
    shippingAddress: {
        type: {
            street: {type: String, required: true},
            city: {type: String, required: true},
            state: {type: String, required: true},
            country: {type: String, required: true},
            zip: {type: String, required: true},
        },
        required: true,
    },
}, {timestamps: true})

export type OrderSchemaType = mongoose.InferSchemaType<typeof OrderSchema>;

export const OrderModel = model<OrderSchemaType>('Order', OrderSchema);

