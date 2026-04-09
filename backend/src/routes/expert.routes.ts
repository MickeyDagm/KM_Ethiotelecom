import { Router } from 'express';
import { getExperts, getExpertById } from '../controllers/expert.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getExperts);
router.get('/:id', authenticate, getExpertById);

export default router;
