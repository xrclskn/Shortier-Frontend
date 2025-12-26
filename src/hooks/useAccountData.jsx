// src/features/account/useAccountData.js
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client.js";

export default function useAccountData() {
    return useQuery({
        queryKey: ["account", "data"], // Tek ve sabit key
        queryFn: async () => {
            const { data } = await apiClient.get("/api/account/details");
            return data;
        },
        staleTime: 2 * 60 * 1000, // 2 dakika cache (değiştirebilirsin)
    });
}
