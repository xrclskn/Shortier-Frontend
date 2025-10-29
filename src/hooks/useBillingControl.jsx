import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/client";

/**
 * Kullanıcının abonelik bilgisini getirir.
 *
 * Dönen değerler:
 * - loading: boolean (veri hala çekiliyor mu)
 * - error: string | null
 * - info: {
 *     is_subscribed: boolean,
 *     status: string | null,
 *     subscription_id: string | null,
 *     current_plan: string | null,
 *     started_at: string | null (ISO),
 *     renews_at: string | null (ISO),
 *     ends_at: string | null (ISO),
 *     card_brand: string | null,
 *     card_last_four: string | null,
 *   } | null
 *
 * - isPro: boolean (UI'da kısayol olarak kullanırsın)
 * - formatDate: fn(isoString) -> "20 Eki 2025 14:36" gibi TR formatlı tarih
 * - refresh: fn() -> veriyi yeniden çeker (ileride portal değiştikten sonra çağırırsın)
 */

export default function useBillingControl() {
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await apiClient.get("/billing/subscription");
            setInfo(data);
        } catch (err) {
            console.error("[useSubscription] /billing/subscription error:", err);
            setError("Abonelik bilgisi alınamadı.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const { data } = await apiClient.get("/billing/subscription");
                if (!alive) return;
                setInfo(data);
            } catch (err) {
                console.error("[useSubscription] init error:", err);
                if (!alive) return;
                setError("Abonelik bilgisi alınamadı.");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    // küçük yardımcı tarih formatlayıcı
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

    // UI için sugar: premium mu?
    const isPro = !!(info && info.is_subscribed);

    return {
        loading,
        error,
        info,
        isPro,
        formatDate,
        refresh: fetchData,
    };
}
