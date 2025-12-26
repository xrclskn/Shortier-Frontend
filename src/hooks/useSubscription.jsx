import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/client";

/**
 * Kullanıcının abonelik (subscription) bilgisini getirir.
 *
 * Returns:
 * - loading: boolean
 * - error: string | null
 * - info: {...}
 * - isPro: boolean
 * - formatDate: function
 * - refresh: function (manuel güncelle)
 */
export default function useSubscription() {
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    // Veriyi fetch et
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get("/api/billing/subscription");
            setInfo(data);
        } catch (err) {
            setError("Abonelik bilgisi alınamadı.");
            console.error("Subscription fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    // Pro abone mi?
    const isPro = !!(info && info.is_subscribed);

    return {
        loading,
        info,
        error,
        isPro,
        formatDate,
        refresh: fetchData,
    };
}
