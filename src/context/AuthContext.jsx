import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from "@/api/client.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // CSRF token al
    const getCsrfToken = async () => {
        try {
            await apiClient.get('/sanctum/csrf-cookie');
        } catch (err) {
            console.error('CSRF token alınamadı:', err);
        }
    };

    const [profiles, setProfiles] = useState([]);
    const [activeProfileId, setActiveProfileId] = useState(() => {
        return localStorage.getItem('activeProfileId') || null;
    });

    // İlk yüklemede token kontrolü ve kullanıcıyı çek
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) getUser();
        else setLoading(false);
        // eslint-disable-next-line
    }, []);

    // Kullanıcı bilgisini ve Profilleri getir
    const getUser = async () => {
        try {
            // 1. Kullanıcıyı Çek
            const userRes = await apiClient.get('/api/user');
            setUser(userRes.data);

            // 2. Profilleri Çek
            const profileRes = await apiClient.get('/api/profile/list');
            const profileList = profileRes.data || [];

            setProfiles(profileList);

            // 3. Aktif Profil Belirle (Varsa localStorage, yoksa ilk profil)
            // Eğer cached ID listede yoksa sıfırla
            let currentId = activeProfileId;
            if (!currentId || !profileList.find(p => p.id == currentId)) {
                if (profileList.length > 0) {
                    currentId = profileList[0].id;
                    localStorage.setItem('activeProfileId', currentId);
                    setActiveProfileId(currentId);
                } else {
                    // Hiç profil yoksa (Yeni user)
                    localStorage.removeItem('activeProfileId');
                    setActiveProfileId(null);
                }
            }

        } catch (e) {
            console.error("Auth init error:", e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError('');
        try {
            await getCsrfToken();
            const response = await apiClient.post('/api/login', credentials);
            localStorage.setItem('token', response.data.access_token);
            await getUser();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Giriş yapılamadı.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError('');
        try {
            await getCsrfToken();
            const response = await apiClient.post('/api/register', userData);
            localStorage.setItem('token', response.data.access_token);
            await getUser();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Kayıt olunamadı.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/api/logout');
        } catch (e) {
            console.error("Logout failed", e);
        }
        localStorage.removeItem('token');
        localStorage.removeItem('activeProfileId');
        setUser(null);
        setProfiles([]);
        setActiveProfileId(null);
    };

    const clearError = () => setError('');

    const switchProfile = (id) => {
        const target = profiles.find(p => p.id === id);
        if (target) {
            setActiveProfileId(id);
            localStorage.setItem('activeProfileId', id);
            // Sayfa yenileme gerekebilir veya componentler activeProfilId'yi dinlemeli
            window.location.reload(); // En temiz yöntem şimdilik: Full reload to refresh all widgets
        }
    };

    const refreshProfiles = async () => {
        try {
            const profileRes = await apiClient.get('/api/profile/list');
            setProfiles(profileRes.data || []);
        } catch (e) { console.error("Profile refresh failed", e); }
    };

    // Sağlanacak değerler
    const value = {
        user,
        profiles,
        activeProfileId,
        activeProfile: profiles.find(p => p.id == activeProfileId),
        switchProfile,
        refreshProfiles,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
