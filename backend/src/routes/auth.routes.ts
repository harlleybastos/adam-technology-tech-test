import { Router } from 'express';
import { login, register, loginDemo } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', loginDemo);

export default router;


