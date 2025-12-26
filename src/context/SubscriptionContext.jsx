import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/api/client";

// Context'in kendisi
const SubscriptionContext = createContext(null);

// Provider component
export function SubscriptionProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let alive = true;

        async function fetchSubscription() {
            try {
                const { data } = await apiClient.get("/api/billing/subscription");
                if (!alive) return;
                setInfo(data);
            } catch (err) {
                console.error("[Subscription] fetch error:", err);
                if (!alive) return;
                setError("Abonelik bilgisi alınamadı.");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        }


        return () => {
            alive = false;
        };
    }, []);

    // Küçük yardımcı: tarih formatlayıcıyı da buradan paylaşabiliriz
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

    // Bütün veriyi context'e veriyoruz
    const value = {
        loading,
        info,
        error,
        formatDate,
        // İleride refresh ihtiyacı olursa buraya reload fonksiyonu da ekleriz.
    };

    return (
        <SubscriptionContext.Provider value={value}>
            {children}
        </SubscriptionContext.Provider>
    );
}

// Hook: returns null if used outside provider (safe fallback)
export function useSubscriptionContext() {
    const ctx = useContext(SubscriptionContext);
    return ctx || { info: null, loading: true, error: null, formatDate: () => "-" };
}
