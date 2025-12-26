import React, {createContext, useContext} from "react";
import apiClient from "@/api/client";

const ProfileSaveContext = createContext();

export const useProfileSave = () => useContext(ProfileSaveContext);

export const ProfileSaveProvider = ({children}) => {
    // Profil verisini backend'e kaydeden fonksiyon
    const saveProfile = async (profileData) => {
        try {
            const response = await apiClient.post("/api/profile/save", profileData);
            return response.data;
        } catch (error) {
            // Hata yönetimi
            console.error(error);
            throw error;
        }
    };

    // Profil verisini backend'den çeken fonksiyon
    const fetchProfile = async (userId) => {
        try {
            const response = await apiClient.get(`/api/profile/get`);
            return response.data;
        } catch (error) {
            console.error("Profil verisi çekilemedi:", error);
            throw error;
        }
    };

    const deleteLink = async (linkId) => {
        try {
            const response = await apiClient.delete(`/api/profile/links/delete/${linkId}`);
            return response.data;

        } catch (error) {
            console.error("Link silinemedi:", error);
            throw error;
        }
    }

    // Burada profile/links/sort endpoint'ine istek atalım
    const sortedLinks = (links) => {

        try {
            const response = apiClient.put('/api/profile/links/sort', {links});
            return response.data;
        } catch (error) {
            console.error("Linkler sıralanamadı:", error);
            throw error;
        }

    }

    const linkVisibilityChange = async (linkId, visibility) => {
        try {
            const response = await apiClient.put(`/api/profile/links/visibility/${linkId}`, {visibility});
            return response.data;
        } catch (error) {
            console.error("Link görünürlüğü değiştirilemedi:", error);
            throw error;
        }

    }

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await apiClient.get(`/api/profile/check-username/${username}`);
            return response.data;
        } catch (error) {
            console.error("Kullanıcı adı kontrol edilemedi:", error);
            throw error;
        }
    };

    const deleteActionLink = async (actionLinkId) => {
        try {
            const response = await apiClient.delete(`/api/profile/delete/action/${actionLinkId}`);
            return response.data;
        } catch (error) {
            console.error("Aksiyon linki silinemedi:", error);
            throw error;
        }
    }


    return (
        <ProfileSaveContext.Provider value={{saveProfile, fetchProfile, deleteLink, sortedLinks, linkVisibilityChange, checkUsernameAvailability, deleteActionLink}}>
            {children}
        </ProfileSaveContext.Provider>
    );
};
