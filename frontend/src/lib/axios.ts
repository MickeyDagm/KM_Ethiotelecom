import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const baseURL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://localhost:5000/api';

const instance = axios.create({
    baseURL,
});

instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const { token } = useAuthStore.getState();

            // Only logout if we actually had a token
            if (token) {
                useAuthStore.getState().logout();
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
