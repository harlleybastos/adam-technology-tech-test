import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createBookingRequest, getMyBookings } from '../controllers/booking.controller.js';

const router = Router();

router.post('/booking-request', requireAuth, createBookingRequest);
router.get('/bookings/me', requireAuth, getMyBookings);

export default router;


