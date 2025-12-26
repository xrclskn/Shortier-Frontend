import { useState } from "react";
import apiClient from "@/api/client"; // axios instance
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function EmailVerificationStatus() {
    const { user, refreshUser } = useAuth();
    // refreshUser: backend’den user bilgilerini tekrar çeken bir fonksiyonun varsa süper olur
    // yoksa sayfayı reload edebilirsin en basit haliyle

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const isVerified = Boolean(user?.email_verified_at);

    const sendVerification = async () => {
        try {
            setSending(true);
            await apiClient.post("/api/email/send-verification");
            setSent(true);
        } catch (err) {
            console.error(err);
            alert("Doğrulama e-postası gönderilemedi. Daha sonra tekrar dene.");
        } finally {
            setSending(false);
        }
    };

    if (isVerified) {
        // doğrulanmış durumda gösterilecek küçük yeşil badge
        return (
            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 border border-green-200">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                E-posta Doğrulandı
            </span>
        );
    }

    // doğrulanmamış durumda sarı uyarı + buton
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 border border-yellow-200">
                <AlertTriangle className="w-4 h-4 mr-1 text-yellow-600" />
                E-posta Doğrulanmadı
            </span>

            <button
                onClick={sendVerification}
                disabled={sending || sent}
                className={
                    "text-xs font-medium rounded-md px-3 py-2 border transition " +
                    (sent
                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-default"
                        : "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed")
                }
            >
                {sent
                    ? "E-posta Gönderildi ✔"
                    : (sending ? "Gönderiliyor..." : "Doğrulama Maili Gönder")}
            </button>
        </div>
    );
}
