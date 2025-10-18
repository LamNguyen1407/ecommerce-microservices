import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { clerkMiddleware, getAuth } from '@clerk/express';
import { shouldBeUser } from './middleware/authMiddleware.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';

const app = express();

app.use(cors({
    origin: ['http://localhost:3002', '', 'http://localhost:3003'],
    credentials: true
}))

app.use(express.json());
app.use(clerkMiddleware());

app.get('/test', shouldBeUser, (req, res) => {
    res.json({message: 'Product service authenticated', userId: req.userId })
});

app.use('/products', productRouter)
app.use('/categories', categoryRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err || err.message);
    res.status(err.status || 500).json({message: err.message || 'Internal Server Error'});
})

app.listen(8000, () => {
    console.log('Product service listening on port 8000')
})