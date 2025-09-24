import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { createAvailability, listMyAvailability, removeAvailability } from '../controllers/availability.controller.js';

const router = Router();

router.post('/', requireAuth, requireRole(['painter']), createAvailability);
router.get('/me', requireAuth, requireRole(['painter']), listMyAvailability);
router.delete('/:id', requireAuth, requireRole(['painter']), removeAvailability);

export default router;


