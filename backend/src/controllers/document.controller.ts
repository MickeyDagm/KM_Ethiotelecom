import { Request, Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

// Intelligent Fetch (Search) and Regional Navigation Matrix
export const getDocuments = async (req: Request, res: Response) => {
    try {
        const { search, region, technology, event } = req.query;

        let filter: any = { publishStatus: 'Published' };
        if (search) {
            filter.$text = { $search: search as string };
        }
        if (technology) {
            filter.technologyVersion = { $regex: new RegExp(technology as string, 'i') };
        }

        // In a real scenario we'd query ContextTag collection by name and match tag IDs
        // For prototype, we will just fetch tag IDs if region or event is provided
        if (region) {
            const ContextTag = mongoose.model('ContextTag');
            const tag = await ContextTag.findOne({ name: region, category: 'Region' });
            if (tag) {
                filter.tags = tag._id;
            }
        }

        const docs = await Document.find(filter)
            .populate('author', 'name role department')
            .populate('tags', 'name category')
            .sort({ createdAt: -1 });

        res.json(docs);
    } catch (error: any) {
        console.error('getDocuments Error:', error);
        res.status(500).json({ message: 'Server error fetching documents', error: error.message, stack: error.stack });
    }
};

export const getDocumentById = async (req: Request, res: Response) => {
    try {
        const doc = await Document.findById(req.params.id)
            .populate('author', 'name role department email')
            .populate('tags', 'name category')
            .populate('localPerformanceLayers.authorId', 'name role');

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Increment views for Contribution Analytics
        doc.views += 1;
        await doc.save();

        res.json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, type, technologyVersion, tags, publishStatus, associatedVendor } = req.body;

        // files from multer
        const files = req.files as Express.Multer.File[];
        const attachments = files ? files.map(file => ({
            filename: file.originalname,
            path: file.filename
        })) : [];

        const parsedTags = tags ? JSON.parse(tags) : [];

        const newDoc = new Document({
            title,
            content,
            author: req.user?._id,
            type,
            technologyVersion,
            publishStatus: publishStatus || 'Published',
            associatedVendor: associatedVendor || 'Internal',
            tags: parsedTags,
            attachments
        });

        await newDoc.save();
        res.status(201).json(newDoc);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating document', error: error.message });
    }
};

export const addLocalPerformanceLayer = async (req: AuthRequest, res: Response) => {
    try {
        const { note } = req.body;
        const doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        doc.localPerformanceLayers.push({
            note,
            authorId: req.user?._id as mongoose.Types.ObjectId,
            createdAt: new Date(),
        });

        await doc.save();
        res.json(doc);
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding performance layer', error: error.message });
    }
};

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        // Contribution Analytics Dashboard Logic
        // E.g., Top fetched docs
        const topDocs = await Document.find()
            .sort({ views: -1 })
            .limit(5)
            .select('title views type createdAt');

        res.json({ topDocs });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
};

export const checkDuplicate = async (req: Request, res: Response) => {
    try {
        const { title, type, technologyVersion } = req.query;
        if (!title || !type || !technologyVersion) {
            return res.status(400).json({ message: 'Missing required query parameters' });
        }
        
        const existing = await Document.findOne({
            title: title as string,
            type: type as string,
            technologyVersion: technologyVersion as string
        });
        
        res.json({ isDuplicate: !!existing });
    } catch (error: any) {
        res.status(500).json({ message: 'Error checking duplication', error: error.message });
    }
};
