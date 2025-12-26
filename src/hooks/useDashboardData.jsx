import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/client";

export default function useDashboardData() {
    return useQuery({
        queryKey: ["dashboard", "data"],
        queryFn: async () => {
            const { data } = await apiClient.get("/api/dashboard/data");
            return data;
        },
        staleTime: 60 * 1000,
    });
}
