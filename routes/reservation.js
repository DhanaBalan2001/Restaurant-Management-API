import express from 'express';
import { getAvailableTimeSlots, createReservation } from '../controllers/reservation.js';
import { verifyRole } from '../controllers/auth.js';

const router = express.Router();

router.get('/available-slots', getAvailableTimeSlots);
router.post('/create', verifyRole(['admin', 'manager']), createReservation);

export default router;
