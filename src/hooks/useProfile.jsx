import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";
import { useAuth } from "@/context/AuthContext";

export default function useProfile(userId) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    // Use passed userId or fallback to auth user id
    const targetId = userId || user?.id;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['profile', targetId],
        queryFn: async () => {
            if (!targetId) return null;
            const response = await apiClient.get(`/api/profile/get`);
            return response.data;
        },
        enabled: !!targetId, // Only fetch if we have an ID
        staleTime: 2 * 60 * 1000, // 2 minutes stale time
        refetchOnWindowFocus: false
    });

    const invalidateProfile = () => {
        queryClient.invalidateQueries({ queryKey: ['profile', targetId] });
    };

    return {
        profileData: data,
        loading: isLoading,
        error,
        refetch,
        invalidateProfile
    };
}
