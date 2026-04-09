import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        const payload = { id: 'dummy_id_because_route_does_not_use_user' };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

        console.log('Fetching...');
        const res = await axios.get('http://localhost:5000/api/documents?search=&region=&technology=', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Success:', res.data.length);
    } catch (err: any) {
        console.error('ERROR RESPONSE:', err.response?.data || err.message);
    }
};
run();
