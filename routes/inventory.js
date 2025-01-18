import express from 'express';
import {
    createInventory,
    getAllInventory,
    checkLowStock,
    updateInventory,
    deleteInventory
} from '../controllers/inventory.js';
import { verifyRole } from '../controllers/auth.js';

const router = express.Router();

router.post('/', verifyRole(['admin', 'manager']), createInventory);
router.get('/', verifyRole(['admin', 'manager']), getAllInventory);
router.get('/low-stock', verifyRole(['admin', 'manager']), checkLowStock);
router.put('/update/:id', verifyRole(['admin', 'manager']), updateInventory);
router.delete('/:id', verifyRole(['admin']), deleteInventory);

export default router;