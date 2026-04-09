import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Document from './src/models/Document';
import './src/models/User';
import './src/models/ContextTag';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected');

        const docs = await Document.find({})
            .populate('author', 'name role department')
            .populate('tags', 'name category')
            .sort({ createdAt: -1 });

        console.log('Query success! Length:', docs.length);
    } catch (err: any) {
        console.error('QUERY CATCH ERROR:', err);
    } finally {
        mongoose.connection.close();
    }
};

run();
