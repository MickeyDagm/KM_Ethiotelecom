import mongoose, { Document, Schema } from 'mongoose';

export enum TagCategory {
    Region = 'Region',
    Technology = 'Technology',
    HardwareState = 'HardwareState',
    Event = 'Event',
}

export interface IContextTag extends Document {
    name: string; // e.g., 'Addis Ababa', 'Somali', 'Huawei', 'ZTE', 'Backbone', '4G/5G'
    category: TagCategory;
}

const contextTagSchema = new Schema<IContextTag>({
    name: { type: String, required: true },
    category: {
        type: String,
        enum: Object.values(TagCategory),
        required: true,
    },
});

export default mongoose.model<IContextTag>('ContextTag', contextTagSchema);
