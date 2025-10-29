// src/context/StatisticsContext.jsx
import { createContext, useContext } from "react";
import apiClient from "@/api/client.js";
import {useAuth} from "@/context/AuthContext.jsx";

const StatisticsContext = createContext();

export function StatisticsProvider({ children }) {

    const { user } = useAuth();
    const userId = user?.id;

    const getProfileId = async()=>{
        try {
            const response = await apiClient.get(`/profile/${userId}`);

            console.log(response.data);
            return response.data.profile.id;
        } catch (error) {
            console.error("Profil ID'si alınamadı:", error);
            throw error;
        }
    }

    // Parametreleri obje olarak al
    const fetchStatistics = async ({ period }) => {
        try {
            // Önce profile_id'yi al
            const profileId = await getProfileId();
            // Query parametrelerini oluştur
            let url = `/profile/statistics/${profileId}`;
            if (period) {
                url += `?period=${encodeURIComponent(period)}`;
            }
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error("İstatistik verisi çekilemedi:", error);
            throw error;
        }
    };

    return (
        <StatisticsContext.Provider value={{ fetchStatistics }}>
            {children}
        </StatisticsContext.Provider>
    );
}

export const useStatistics = () => useContext(StatisticsContext);
