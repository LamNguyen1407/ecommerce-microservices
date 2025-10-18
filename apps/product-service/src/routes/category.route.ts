import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controller/category.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const categoryRouter: Router = Router();

categoryRouter.post('/', shouldBeAdmin, createCategory)
categoryRouter.put('/:id',shouldBeAdmin, updateCategory)
categoryRouter.delete('/:id',shouldBeAdmin, deleteCategory)
categoryRouter.get('/', getCategories)


export default categoryRouter;