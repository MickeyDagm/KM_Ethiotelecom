import { Request, Response } from 'express';
import Document from '../models/Document';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';

// Intelligent Fetch (Search) and Regional Navigation Matrix
export const getDocuments = async (req: Request, res: Response) => {
    try {
        const { search, region, technology, event, type } = req.query;

        const filter: any = { publishStatus: 'Published' };
        const tagIds: mongoose.Types.ObjectId[] = [];

        // Filter by document type (this is where "Root Cause Analysis", etc. are stored)
        if (type) {
            filter.type = type as string;
        }

        // Filter by Event type (maps to document's type field)
        if (event) {
            // Map friendly names to actual document types
            const eventMapping: Record<string, string> = {
                'Root Cause Analysis': 'Root Cause Analysis',
                'New Tech Adoption': 'New Tech Adoption',
                'Weekly Presentations': 'Weekly Presentations',
            };
            const mappedType = eventMapping[event as string];
            if (mappedType) {
                filter.type = mappedType;
            }
        }

        // Collect tag IDs for filtering (Region and Technology)
        if (technology || region) {
            const ContextTag = mongoose.model('ContextTag');
            
            if (technology) {
                const tag = await ContextTag.findOne({ name: technology, category: 'Technology' });
                if (tag) tagIds.push(tag._id as mongoose.Types.ObjectId);
            }
            if (region) {
                const tag = await ContextTag.findOne({ name: region, category: 'Region' });
                if (tag) tagIds.push(tag._id as mongoose.Types.ObjectId);
            }

            if (tagIds.length > 0) {
                filter.tags = { $in: tagIds };
            }
        }

        // Text search with fallback to regex
        if (search) {
            const searchRegex = new RegExp(search as string, 'i');
            filter.$or = [
                { title: searchRegex },
                { content: searchRegex },
                { type: searchRegex },
                { technologyVersion: searchRegex }
            ];
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
        
        const populatedDoc = await Document.findById(newDoc._id)
            .populate('author', 'name role department')
            .populate('tags', 'name category');
        
        res.status(201).json(populatedDoc);
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
        const totalDocs = await Document.countDocuments({ publishStatus: 'Published' });
        
        const totalViews = await Document.aggregate([
            { $match: { publishStatus: 'Published' } },
            { $group: { _id: null, total: { $sum: '$views' } } }
        ]);

        const topDocs = await Document.find({ publishStatus: 'Published' })
            .sort({ views: -1 })
            .limit(5)
            .select('title views type createdAt');

        const rcaCount = await Document.countDocuments({ type: 'Root Cause Analysis', publishStatus: 'Published' });
        const weeklyCount = await Document.countDocuments({ type: 'Weekly Presentations', publishStatus: 'Published' });
        const newTechCount = await Document.countDocuments({ type: 'New Tech Adoption', publishStatus: 'Published' });

        res.json({ 
            topDocs,
            totalDocs,
            totalViews: totalViews[0]?.total || 0,
            rcaCount,
            weeklyCount,
            newTechCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
};

export const updateDocument = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, type, technologyVersion, tags, publishStatus, associatedVendor } = req.body;
        
        const doc = await Document.findById(req.params.id);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (title) doc.title = title;
        if (content) doc.content = content;
        if (type) doc.type = type;
        if (technologyVersion) doc.technologyVersion = technologyVersion;
        if (publishStatus) doc.publishStatus = publishStatus;
        if (associatedVendor) doc.associatedVendor = associatedVendor;
        if (tags) doc.tags = JSON.parse(tags);

        // Handle new file attachments
        const files = req.files as Express.Multer.File[];
        if (files && files.length > 0) {
            const newAttachments = files.map(file => ({
                filename: file.originalname,
                path: file.filename
            }));
            doc.attachments = [...doc.attachments, ...newAttachments];
        }

        await doc.save();
        
        const populatedDoc = await Document.findById(doc._id)
            .populate('author', 'name role department')
            .populate('tags', 'name category');
        
        res.json(populatedDoc);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating document', error: error.message });
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

export const downloadAttachment = async (req: Request, res: Response) => {
    try {
        const { id, attachmentIndex } = req.params;
        const doc = await Document.findById(id);
        
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const index = parseInt(attachmentIndex as string);
        if (isNaN(index) || index < 0 || index >= doc.attachments.length) {
            return res.status(400).json({ message: 'Invalid attachment index' });
        }

        const attachment = doc.attachments[index];
        const filePath = path.join(__dirname, '../../uploads', attachment.path);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${attachment.filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        res.download(filePath, attachment.filename);
    } catch (error: any) {
        res.status(500).json({ message: 'Error downloading file', error: error.message });
    }
};

export const previewAttachment = async (req: Request, res: Response) => {
    try {
        const { id, attachmentIndex } = req.params;
        const doc = await Document.findById(id);
        
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const index = parseInt(attachmentIndex as string);
        if (isNaN(index) || index < 0 || index >= doc.attachments.length) {
            return res.status(400).json({ message: 'Invalid attachment index' });
        }

        const attachment = doc.attachments[index];
        const filePath = path.join(__dirname, '../../uploads', attachment.path);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        const ext = path.extname(attachment.filename).toLowerCase();
        const contentTypes: Record<string, string> = {
            '.pdf': 'application/pdf',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.txt': 'text/plain',
        };

        res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
        res.sendFile(filePath);
    } catch (error: any) {
        res.status(500).json({ message: 'Error previewing file', error: error.message });
    }
};
