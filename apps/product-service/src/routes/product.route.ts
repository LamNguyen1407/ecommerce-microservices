import { Router } from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from "../controller/product.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const productRouter: Router = Router();

productRouter.post('/', shouldBeAdmin, createProduct)
productRouter.put('/:id',shouldBeAdmin, updateProduct)
productRouter.delete('/:id', shouldBeAdmin, deleteProduct)
productRouter.get('/', getProducts)
productRouter.get('/:id', getProduct)




export default productRouter;