import { useState } from "react";
import apiClient from "@/api/client"; // Axios instance (baseURL = backend API)

export default function CheckoutButton({ plan = "pro", label = "Satın Al" }) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await apiClient.post("/billing/checkout", { plan });
            const url = response.data.checkout_url;

            if (url) {
                window.open(url , '_blank') // Lemon Squeezy sayfasına yönlendir
            } else {
                alert("Checkout bağlantısı alınamadı.");
            }
        } catch (error) {
            console.error("Checkout hatası:", error);
            alert("Ödeme başlatılırken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        >
            {loading ? "Yönlendiriliyor..." : label}
        </button>
    );
}
