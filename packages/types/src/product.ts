import type {Product, Category} from '@repo/product-db'


export type ProductType = Product

export type ProductsType = ProductType[];
export type StripeProductType = {
    id: string;
    name: string;
    price: number;
}

export enum SortProductEnum {
    ASC = 'asc',
    DESC = 'desc',
    OLDEST = 'oldest'
}

export type CategoryType = Category