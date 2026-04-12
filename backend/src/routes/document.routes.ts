import { Router } from 'express';
import {
    getDocuments,
    getDocumentById,
    createDocument,
    addLocalPerformanceLayer,
    getAnalytics,
    checkDuplicate,
} from '../controllers/document.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { UserRole } from '../models/User';

const router = Router();

// Public routes for authenticated users
router.get('/', authenticate, getDocuments);
router.get('/analytics', authenticate, getAnalytics);
router.get('/check-duplicate', authenticate, checkDuplicate);
router.get('/:id', authenticate, getDocumentById);

// Restricted routes based on 3-Tier Expertise Hierarchy
// Only Admin, Expert, AdvancedSupport, InternationalGateway can create docs.
router.post(
    '/',
    authenticate,
    authorizeRole([
        UserRole.Admin,
        UserRole.Expert,
        UserRole.AdvancedSupport,
        UserRole.InternationalGateway,
    ]),
    upload.array('attachments', 5),
    createDocument
);

// All roles (including RegionalTechnician) can add local performance layers
router.post('/:id/local-layer', authenticate, addLocalPerformanceLayer);

export default router;
