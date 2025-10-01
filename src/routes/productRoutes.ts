import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/', getProducts);               // GET /api/products - Público
router.get('/:id', getProduct);             // GET /api/products/:id - Público
router.post('/', authMiddleware, createProduct);  // POST /api/products - Protegido
router.put('/:id', authMiddleware, updateProduct); // PUT /api/products/:id - Protegido
router.delete('/:id', authMiddleware, deleteProduct); // DELETE /api/products/:id - Protegido

export default router;