import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/client";

/**
 * Kullanıcının abonelik (subscription) bilgisini getirir.
 * React Query ile cache mekanizması eklenerek gereksiz istekler önlenmiştir.
 */
export default function useSubscription() {
    const queryClient = useQueryClient();

    const { data: info, isLoading: loading, error } = useQuery({
        queryKey: ['subscription'],
        queryFn: async () => {
            const { data } = await apiClient.get("/api/billing/subscription");
            return data;
        },
        staleTime: 5 * 60 * 1000, // 5 dakika boyunca taze kabul et (arkaplanda yenilemez)
        refetchOnWindowFocus: false, // Pencere odağında yenileme yapma
        retry: 1
    });

    function formatDate(iso) {
        if (!iso) return "-";
        try {
            const d = new Date(iso);
            return d.toLocaleString("tr-TR", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return iso;
        }
    }

    // Refresh fonksiyonu: Cache'i invalidate ederek zorla yenileme yapar
    const refresh = () => {
        return queryClient.invalidateQueries({ queryKey: ['subscription'] });
    };

    // Pro abone mi?
    const isPro = !!(info && info.is_subscribed);

    return {
        loading,
        info,
        error,
        isPro,
        formatDate,
        refresh,
    };
}
