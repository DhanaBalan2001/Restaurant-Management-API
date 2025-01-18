import express from 'express';
import { 
    createMenu, 
    getAllMenus, 
    getMenuById, 
    updateMenu, 
    deleteMenu 
} from '../controllers/menu.js';
import { verifyRole } from '../controllers/auth.js';

const router = express.Router();

router.post('/', verifyRole(['admin', 'manager']), createMenu);
router.get('/', getAllMenus);
router.get('/:id', getMenuById);
router.put('/:id', verifyRole(['admin', 'manager']), updateMenu);
router.delete('/:id', verifyRole(['admin']), deleteMenu);

export default router;
