import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware";
import {OrderModel} from '@repo/order-db'
export const orderRoute = async (fastify: FastifyInstance) => {
    fastify.get('/user-orders', {preHandler: shouldBeUser}, async (request, reply) => {
        const orders = await OrderModel.find({userId: request.userId});
        return reply.send(orders);
    });
    fastify.get('/orders',{preHandler: shouldBeAdmin},async (request, reply) => {
        const orders = await OrderModel.find();
        return reply.send(orders);
    });
}