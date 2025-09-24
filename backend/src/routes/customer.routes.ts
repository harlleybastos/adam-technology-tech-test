import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { getMyBookings } from '../controllers/booking.controller.js';

const router = Router();

router.get('/bookings', requireAuth, requireRole(['customer']), getMyBookings);

export default router;


