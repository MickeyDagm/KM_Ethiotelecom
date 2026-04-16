import api from './axios';

export const login = async (credentials: any) => {
    const res = await api.post('/auth/login', credentials);
    console.log("user details on login: ", res.data)
    return res.data;
};

export const getProfile = async () => {
    const res = await api.get('/auth/profile');
    return res.data;
};

export const getDocuments = async (params: any) => {
    const res = await api.get('/documents', { params });
    return res.data;
};

export const getDocumentById = async (id: string) => {
    const res = await api.get(`/documents/${id}`);
    return res.data;
};

export const createDocument = async (formData: FormData) => {
    const res = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const updateDocument = async (id: string, formData: FormData) => {
    const res = await api.put(`/documents/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const addPerformanceLayer = async (id: string, note: string) => {
    const res = await api.post(`/documents/${id}/local-layer`, { note });
    return res.data;
};

export const getAnalytics = async () => {
    const res = await api.get('/documents/analytics');
    return res.data;
};

export const getExperts = async () => {
    const res = await api.get('/experts');
    return res.data;
};

export const getExpertById = async (id: string) => {
    const res = await api.get(`/experts/${id}`);
    return res.data;
};

export const getTags = async () => {
    const res = await api.get('/tags');
    return res.data;
};

export const checkDuplicate = async (title: string, type: string, technologyVersion: string) => {
    const res = await api.get('/documents/check-duplicate', {
        params: { title, type, technologyVersion }
    });
    return res.data;
};
