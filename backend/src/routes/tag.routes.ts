import { Router } from 'express';
import { getTags } from '../controllers/tag.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getTags);

export default router;
