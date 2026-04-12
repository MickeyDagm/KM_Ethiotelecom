import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';
import './ContextTag';

export interface IDocument extends MongooseDocument {
    title: string;
    content: string; // HTML or rich text
    author: mongoose.Types.ObjectId; // References Expert Directory
    type: string; // e.g., 'RCA', 'Maintenance Procedure', 'Weekly Presentation', 'Vendor Manual'
    technologyVersion: string; // For Duplicate Prevention Gate
    publishStatus: 'Draft' | 'Published';
    associatedVendor: 'Huawei' | 'ZTE' | 'Ericsson' | 'Internal';
    tags: mongoose.Types.ObjectId[]; // Contextual Registry tags (Region, Hardware State)
    views: number; // For Contribution Analytics
    attachments: { filename: string; path: string }[];
    localPerformanceLayers: { note: string; authorId: mongoose.Types.ObjectId; createdAt: Date }[]; // For RegionalTechnician to add notes
    createdAt: Date;
    updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, required: true },
        technologyVersion: { type: String, required: true }, // Mandatory checklist property
        publishStatus: { type: String, enum: ['Draft', 'Published'], default: 'Published' },
        associatedVendor: { type: String, enum: ['Huawei', 'ZTE', 'Ericsson', 'Internal'], required: true, default: 'Internal' },
        tags: [{ type: Schema.Types.ObjectId, ref: 'ContextTag' }],
        views: { type: Number, default: 0 },
        attachments: [
            {
                filename: String,
                path: String,
            },
        ],
        localPerformanceLayers: [
            {
                note: String,
                authorId: { type: Schema.Types.ObjectId, ref: 'User' },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

// Indexes for Intelligent Fetch
documentSchema.index({ title: 'text', content: 'text', type: 'text' });

export default mongoose.model<IDocument>('Document', documentSchema);
