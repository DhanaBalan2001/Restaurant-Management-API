import express from 'express';
import { 
  generateDailySalesReport, 
  generateMonthlyReport, 
  getPeakHoursAnalysis,
  getMenuPerformanceMetrics 
} from '../controllers/report.js';
import { verifyRole } from '../controllers/auth.js';

const router = express.Router();

router.get('/daily', verifyRole(['admin', 'manager']), generateDailySalesReport);
router.get('/monthly', verifyRole(['admin', 'manager']), generateMonthlyReport);
router.get('/peak-hours', verifyRole(['admin', 'manager']), getPeakHoursAnalysis);
router.get('/menu-metrics', verifyRole(['admin', 'manager']), getMenuPerformanceMetrics);

export default router;
