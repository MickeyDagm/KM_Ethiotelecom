import User from './src/models/User';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI || '');
    const user = await User.findOne({ email: 'admin@ethiotelecom.et' });
    if (user) {
        const token = jwt.sign(
            { _id: user._id, role: user.role, department: user.department },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );
        console.log('TOKEN=' + token);
    }
    await mongoose.connection.close();
};
run();
