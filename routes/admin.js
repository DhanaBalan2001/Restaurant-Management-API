import express from 'express';
import { getAllUsers, getAnalytics } from '../controllers/admin.js';
import { verifyRole } from '../controllers/auth.js';

const router = express.Router();

router.get('/users', verifyRole(['admin']), getAllUsers);
router.get('/analytics', verifyRole(['admin', 'manager']), getAnalytics);

export default router;
