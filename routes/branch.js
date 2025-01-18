import express from 'express';
import { createBranch, getBranchStats } from '../controllers/branch.js';
import { verifyRole } from '../controllers/auth.js';

const router = express.Router();

router.post('/create', verifyRole(['admin']), createBranch);
router.get('/stats/:branchId', verifyRole(['admin', 'manager']), getBranchStats);

export default router;
