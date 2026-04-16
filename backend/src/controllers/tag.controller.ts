import { Request, Response } from 'express';
import ContextTag from '../models/ContextTag';

export const getTags = async (req: Request, res: Response) => {
    try {
        const tags = await ContextTag.find().sort({ category: 1, name: 1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching tags' });
    }
};
