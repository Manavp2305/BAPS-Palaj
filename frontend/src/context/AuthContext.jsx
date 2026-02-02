import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = Cookies.get('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            Cookies.set('userInfo', JSON.stringify(data), { expires: 30 }); // 30 days
            toast.success('Login Successful');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login Failed');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('userInfo');
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
