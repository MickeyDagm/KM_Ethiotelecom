import { Router } from 'express';
import { check } from 'express-validator';
import { login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    login
);

router.get('/profile', authenticate, getProfile);

export default router;
