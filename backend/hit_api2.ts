import axios from 'axios';

const run = async () => {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@ethiotelecom.et',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Login success, fetching documents...');

        const res = await axios.get('http://localhost:5000/api/documents?search=&region=&technology=', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Documents success! Length:', res.data.length);
    } catch (err: any) {
        console.error('ERROR RESPONSE:', err.response?.data || err.message);
    }
};
run();
