import { FastifyReply, FastifyRequest } from "fastify";
import Clerk from '@clerk/fastify'
import type {CustomJwtSessionClaims} from "@repo/types";

declare module 'fastify' {
    interface FastifyRequest {
        userId?: string
    }
}

export const shouldBeUser = (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    const {userId} = Clerk.getAuth(request)
    if(!userId){
        return reply.status(401).send({message: 'Unauthorized'})
    }

    request.userId = userId;
    done();
}


export const shouldBeAdmin = (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    const auth = Clerk.getAuth(request)
    if(!auth.userId){
        return reply.status(401).send({message: 'You are not logged in'})
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if(claims.metadata?.role !== "admin"){
        return reply.status(403).send({message: 'Forbidden'})
    }

    request.userId = auth.userId;
    done();
}