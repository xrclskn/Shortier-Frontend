// src/hooks/useStatistics.js
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client.js";

export default function useStatistics(period) {
    return useQuery({
        queryKey: ["statistics", period],
        queryFn: async () => {
            const p = period || "24h";
            const { data } = await apiClient.get(`/api/profile/statistics?period=${encodeURIComponent(p)}`);
            return data;
        },
        staleTime: 60 * 1000,
    });
}