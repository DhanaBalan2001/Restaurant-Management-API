import express from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus, 
    getUserOrders 
} from '../controllers/order.js';
import { verifyRole } from '../controllers/auth.js';

const router = express.Router();

router.post('/', verifyRole(['client']), createOrder);
router.get('/', verifyRole(['admin', 'manager','staff']), getAllOrders);
router.get('/user', verifyRole(['admin','manager','staff']), getUserOrders);
router.get('/:id', verifyRole(['admin', 'staff','client']), getOrderById);
router.put('/:id/status', verifyRole(['admin', 'staff']), updateOrderStatus);

export default router;
