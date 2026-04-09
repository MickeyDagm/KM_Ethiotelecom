import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import Document from '../models/Document';

// 3-Tier Expertise Hierarchy Expert Directory
export const getExperts = async (req: Request, res: Response) => {
    try {
        const experts = await User.find({
            role: { $in: [UserRole.Expert, UserRole.AdvancedSupport, UserRole.InternationalGateway] },
        }).select('-passwordHash');

        // Attach document count or recent docs for each expert
        const expertData = await Promise.all(
            experts.map(async (expert) => {
                const authoredDocsCount = await Document.countDocuments({ author: expert._id });
                return {
                    ...expert.toObject(),
                    contributions: authoredDocsCount,
                };
            })
        );

        res.json(expertData);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching experts' });
    }
};

export const getExpertById = async (req: Request, res: Response) => {
    try {
        const expert = await User.findById(req.params.id).select('-passwordHash');
        if (!expert) {
            return res.status(404).json({ message: 'Expert not found' });
        }

        const authoredDocs = await Document.find({ author: expert._id })
            .select('title type createdAt views tags')
            .populate('tags', 'name category')
            .sort({ createdAt: -1 });

        res.json({
            expert,
            authoredDocs,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching expert details' });
    }
};
