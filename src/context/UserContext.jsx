import React, { createContext, useContext, useState, useEffect } from "react";

import apiClient from "@/api/client.js";
import {useAuth} from "@/context/AuthContext.jsx";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
    const [username, setUsername] = useState("");
    const [photo, setPhoto] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const fetchUserProfile = async (userId) => {
        if (!userId) return;

        setIsLoading(true);
        try {
            const response = await apiClient.get(`/api/profile`);
            setUsername(response.data.profile.username);
            setPhoto(response.data.profile.photo);
        } catch (error) {
            //console.error("Profil bilgileri alınırken hata oluştu:", error);
            // Hata durumunda verileri temizle
            setUsername("");
            setPhoto("");
        } finally {
            setIsLoading(false);
        }
    };

    // User değiştiğinde profil bilgilerini getir
    useEffect(() => {
        if (user?.id) {
            fetchUserProfile(user.id);
        } else {
            // User yoksa verileri temizle
            setUsername("");
            setPhoto("");
            setIsLoading(false);
        }
    }, [user?.id]);

    // Logout sinyalini dinle
    useEffect(() => {
        const handleAuthLogout = () => {
            setUsername("");
            setPhoto("");
            setIsLoading(false);
        };

        window.addEventListener('auth:logout', handleAuthLogout);
        return () => window.removeEventListener('auth:logout', handleAuthLogout);
    }, []);


    return (
        <UserContext.Provider value={{
            username,
            photo,
            isLoading,
            fetchUserProfile
        }}>
            {children}
        </UserContext.Provider>
    );
}