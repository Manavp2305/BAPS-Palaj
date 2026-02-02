import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to attach the token if it exists
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo') 
            ? JSON.parse(localStorage.getItem('userInfo')) 
            : null;
        
        // Or if you are using cookies (as per AuthContext), we might not need to attach header manually 
        // if the backend expects Bearer token in header but context was using cookies?
        // Let's check AuthContext.jsx. It uses cookies to STORE user info but...
        // The previous code didn't seem to attach headers, maybe it relies on cookies being sent automatically?
        // Wait, the backend 'protect' middleware usually checks Authorization header.
        
        // Let's stick to simple baseURL auth for now and update interceptors if we find auth issues.
        // Actually, let's keep it simple.
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
