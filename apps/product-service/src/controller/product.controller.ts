import { Request, Response } from "express";
import {prisma, Prisma} from '@repo/product-db'
import { SortProductEnum } from "../type/product.type";
export const createProduct = async(req: Request, res: Response) => {
    const data: Prisma.ProductCreateInput = req.body;

    const {colors, images}  = data;

    if(!colors || !Array.isArray(colors) || colors.length === 0) {
        return res.status(400).json({error: "At least one color is required"});
    }

    if(!images || typeof images !== 'object' ) {
        return res.status(400).json({error: "At least one image is required"});
    }

    const missingColors = colors.filter(color => !(color in images));

    if(missingColors.length > 0) {
        return res.status(400).json({message: 'missing images for colors', missingColors})
    }
    const product = await prisma.product.create({data})
    res.status(201).json(product);
}
export const updateProduct = async(req: Request, res: Response) => {
    const {id}  = req.params;
    const data: Prisma.ProductUpdateInput = req.body;
    const updatedProduct = await prisma.product.update({
        where: {id: Number(id)},
        data
    })
    return res.json(200).json(updatedProduct);
}

export const deleteProduct = async(req: Request, res: Response) => {
    const {id}  = req.params;
    await prisma.product.delete({
        where: {id: Number(id)}
    })
    return res.status(200).json({message: 'Product deleted successfully'});
}


export const getProducts = async(req: Request, res: Response) => {
    const {sort, category, search, limit} = req.query;

    const orderBy = () => {
        switch(sort) {
            case SortProductEnum.ASC:
                return {price: Prisma.SortOrder.asc};
            case SortProductEnum.DESC:
                return {price: Prisma.SortOrder.desc};
            case SortProductEnum.OLDEST:
                return {createdAt: Prisma.SortOrder.asc};
            default:
                return {createdAt: Prisma.SortOrder.desc};
        }
    }

    const products = await prisma.product.findMany({
        where: {
            category: {
                slug: category as string
            },
            name: {
                contains: search as string,
                mode: 'insensitive' // case insensitive search
            }
        },
        orderBy: orderBy(),
        take: limit ? Number(limit) : undefined,
        
    });

    res.status(200).json(products);
}


export const getProduct = async(req: Request, res: Response) => {
    const {id} = req.params;
    const product = await prisma.product.findUnique({
        where: {
            id: Number(id)
        }
    })
    res.status(200).json(product);
}
