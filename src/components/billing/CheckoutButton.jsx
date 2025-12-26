import { useState } from "react";
import apiClient from "@/api/client"; // Axios instance (baseURL = backend API)

export default function CheckoutButton({ plan = "pro", label = "Satın Al" }) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await apiClient.post("/api/billing/checkout", { plan });
            const url = response.data.checkout_url;

            if (url) {
                window.location.href = url; // Popup engelini aşmak için direkt yönlendirme
            } else {
                alert("Checkout bağlantısı oluşturulamadı.");
            }
        } catch (error) {
            console.error("Checkout hatası:", error);
            const msg = error.response?.data?.message || "Ödeme başlatılırken bir hata oluştu. Lütfen tekrar deneyin.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-6 py-3 bg-[#010101] text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-60"
        >
            {loading ? "Yönlendiriliyor..." : label}
        </button>
    );
}
