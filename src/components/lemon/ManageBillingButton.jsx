import { useState } from "react";
import apiClient from "@/api/client";
import {
    CreditCard,
    FileText,
    Package,
    Receipt,
    ArrowUpRight,
} from "lucide-react";

export default function BillingActions() {
    const [loading, setLoading] = useState(false);
    const [portalUrl, setPortalUrl] = useState(null);

    const openPortal = async () => {
        // Eğer zaten aldık ve cache'de duruyorsa tekrar API çağırma
        if (portalUrl) {
            window.open(portalUrl, "_blank", "noopener,noreferrer");
            return;
        }

        setLoading(true);
        try {
            const { data } = await apiClient.get("/billing/portal");
            if (data.url) {
                setPortalUrl(data.url);
                window.open(data.url, "_blank", "noopener,noreferrer");
            } else {
                alert("Portal linki alınamadı.");
            }
        } catch (err) {
            console.error(err);
            alert("Faturalandırma portalına ulaşılamadı.");
        } finally {
            setLoading(false);
        }
    };

    const ActionButton = ({ icon: Icon, title, desc }) => (
        <button
            onClick={openPortal}
            disabled={loading}
            className="group flex w-full items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-blue-500 text-white group-hover:bg-blue-800 transition-all">
                <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{title}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                </div>
                <p className="text-sm text-slate-500 leading-snug">{desc}</p>
            </div>
        </button>
    );

    return (
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-custom">
            <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">
                    Faturalandırma ve Abonelik
                </h2>
                <p className="text-sm text-slate-500 leading-snug">
                    Tüm işlemler güvenli ödeme ortağımız Lemon Squeezy üzerinden
                    yönetilir. Kart bilgilerin Shortier tarafında saklanmaz.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ActionButton
                    icon={CreditCard}
                    title="Ödeme Yöntemini Güncelle"
                    desc="Kayıtlı kartını değiştir veya yeni kart ekle."
                />

                <ActionButton
                    icon={Receipt}
                    title="Fatura Geçmişimi Gör"
                    desc="Kesilmiş faturalarına ve ödeme makbuzlarına ulaş."
                />

                <ActionButton
                    icon={Package}
                    title="Aboneliğimi Yönet / İptal Et"
                    desc="Aboneliğini iptal et, yenilemeyi durdur veya tekrar başlat."
                />

                <ActionButton
                    icon={FileText}
                    title="Fatura / Vergi Bilgilerimi Düzenle"
                    desc="Fatura adresini, şirket bilgilerini ve vergi numaranı güncelle."
                />

                <ActionButton
                    icon={ArrowUpRight}
                    title="Planımı Yükselt"
                    desc="Daha yüksek pakete geçerek limitlerini artır."
                />
            </div>

            {loading && (
                <p className="text-xs text-slate-400">
                    Portal açılıyor...
                </p>
            )}

        </div>
    );
}
