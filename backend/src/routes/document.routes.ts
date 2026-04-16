import { Router } from 'express';
import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    addLocalPerformanceLayer,
    getAnalytics,
    checkDuplicate,
    downloadAttachment,
    previewAttachment,
} from '../controllers/document.controller';
import { authenticate, authorizeRole } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { UserRole } from '../models/User';

const router = Router();

router.get('/', authenticate, getDocuments);
router.get('/analytics', authenticate, getAnalytics);
router.get('/check-duplicate', authenticate, checkDuplicate);
router.get('/:id', authenticate, getDocumentById);
router.get('/:id/download/:attachmentIndex', downloadAttachment);
router.get('/:id/preview/:attachmentIndex', previewAttachment);

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

router.put(
    '/:id',
    authenticate,
    authorizeRole([
        UserRole.Admin,
        UserRole.Expert,
        UserRole.AdvancedSupport,
        UserRole.InternationalGateway,
    ]),
    upload.array('attachments', 5),
    updateDocument
);

router.post('/:id/local-layer', authenticate, addLocalPerformanceLayer);

export default router;
