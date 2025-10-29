import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Axios instance oluştur
    const api = axios.create({
        baseURL: 'http://shortierv2.local',
        withCredentials: true,
    });

    // CSRF token al
    const getCsrfToken = async () => {
        try {
            await api.get('/sanctum/csrf-cookie');
        } catch (error) {
            console.error('CSRF token alınamadı:', error);
        }
    };

    // Token'ı axios isteklerine ekle/kaldır
    const setAuthToken = (token) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete api.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    };

    // Kullanıcı bilgilerini getir
    const getUser = async () => {
        try {
            const response = await api.get('/api/user');
            setUser(response.data);
        } catch (error) {
            console.error('Kullanıcı bilgileri alınamadı:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Uygulama başladığında token kontrol et
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            getUser();
        } else {
            setLoading(false);
        }
    }, []);

    // Giriş işlemi
    const login = async (credentials) => {
        try {
            setError('');
            setLoading(true);

            // CSRF token al
            await getCsrfToken();

            // Login isteği
            const response = await api.post('/api/login', credentials);
            const { access_token, user: userData } = response.data;

            // Token ve user bilgilerini kaydet
            setAuthToken(access_token);
            setUser(userData);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Giriş başarısız';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Kayıt işlemi
    const register = async (userData) => {
        try {
            setError('');
            setLoading(true);

            // CSRF token al
            await getCsrfToken();

            // Register isteği
            const response = await api.post('/api/register', userData);
            const { access_token, user: newUser } = response.data;

            // Token ve user bilgilerini kaydet
            setAuthToken(access_token);
            setUser(newUser);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.errors
                ? Object.values(error.response.data.errors).flat().join(' ')
                : 'Kayıt başarısız';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    // Çıkış işlemi
    const logout = async () => {
        try {
            // Backend'e logout isteği gönder
            await api.post('/api/logout');
        } catch (error) {
            console.error('Çıkış yapılırken hata oluştu:', error);
        } finally {
            // Her durumda local state'i temizle
            setAuthToken(null);
            setUser(null);
            setError('');
            localStorage.clear();
            sessionStorage.clear();

            // Diğer context'lere temizlik sinyali gönder
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
    };

    // Hata temizleme fonksiyonu
    const clearError = () => {
        setError('');
    };


    const value = {
        user,
        login,
        register,
        logout,
        error,
        clearError,
        loading,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};