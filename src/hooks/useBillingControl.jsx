import { useState, useEffect, useCallback } from "react";
import apiClient from "@/api/client";

/**
 * Kullanıcının abonelik ve ödeme işlemlerini yönetir.
 * - Abonelik bilgisi getirir
 * - Checkout başlatır
 * - Portal (abonelik yönetim ekranı) açar
 */

export default function useBillingControl() {
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    // Abonelik verisini getir
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get("/api/billing/subscription");
            setInfo(data);
        } catch (err) {
            setError("Abonelik bilgisi alınamadı.");
            console.error("[useBillingControl] /billing/subscription error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const { data } = await apiClient.get("/api/billing/subscription");
                if (!alive) return;
                setInfo(data);
            } catch (err) {
                if (!alive) return;
                setError("Abonelik bilgisi alınamadı.");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [fetchData]);

    // Abonelik checkout başlat (örn. yeni paket satın al)
    const startCheckout = useCallback(async (planId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.post("/api/billing/checkout", { plan_id: planId });
            // Beklenen: {url: "..."}
            if (data?.url) {
                window.location.href = data.url;
            }
            return data;
        } catch (err) {
            setError("Checkout işlemi başlatılamadı.");
            console.error("[useBillingControl] /billing/checkout error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Portalı aç (abonelik yönetim ekranı)
    const openPortal = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get("/api/billing/portal");
            // Beklenen: {url: "..."}
            if (data?.url) {
                window.open(data.url, "_blank", "noopener,noreferrer");
            }
            return data;
        } catch (err) {
            setError("Portal bağlantısı alınamadı.");
            console.error("[useBillingControl] /billing/portal error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
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

    const isPro = !!(info && info.is_subscribed);

    return {
        loading,
        error,
        info,
        isPro,
        formatDate,
        refresh: fetchData,
        startCheckout,
        openPortal,
    };
}
