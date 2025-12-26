import React from "react";
import useSubscription from "@/hooks/useSubscription";
import BillingActions from "@/components/billing/ManageBillingButton.jsx";
import CheckoutButton from "@/components/billing/CheckoutButton.jsx";
import { Info } from "lucide-react";

export default function SubscriptionStatusCard() {
    const { loading, info, isPro, formatDate, error, refresh } = useSubscription();



    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-custom">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-custom animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
        );
    }

    // abone DEĞİLSE
    if (!info?.is_subscribed) {
        return (
            <div className="space-y-4">
                <div className="rounded-xl bg-white p-6 shadow-custom">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-2xl font-semibold text-slate-900">
                                Aktif aboneliğin bulunmuyor
                            </p>
                            <p className="text-md text-slate-600 leading-snug mt-2">
                                Shortier’ın gelişmiş istatistikleri, sınırsız link
                                özellikleri ve otomatik e-posta raporlarını
                                kullanmak için bir plana geçebilirsin.
                            </p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-gray-200 px-6 py-1 text-[20px] font-medium text-slate-700">
                            free
                        </span>
                    </div>

                    <div className="flex items-center bg-[#efefef] p-4 rounded-lg border-2 border-gray-300 mt-4">
                        <span className="text-3xl mr-4 bg-white text-[#010101] p-2 rounded-full shadow-sm">
                            <Info />
                        </span>
                        <p className="text-[#010101]">
                            Shortier'da bir plan satın almak bir bardak kahveden
                            daha ucuzdur. Yalnızca 0.99$/ay ödeyerek tüm premium
                            özelliklere erişebilirsin.
                        </p>
                    </div>

                    <div className="mt-4">
                        <CheckoutButton plan="pro" label="Hemen abone ol" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 hidden">
                    <div className="flex items-center gap-3 p-6 border border-slate-200 rounded-xl bg-white shadow-custom">
                        <span className="text-2xl">∞</span>
                        <span className="text-md text-slate-700">Sınırsız link oluşturma</span>
                    </div>

                    <div className="flex items-center gap-3 p-6 border border-slate-200 rounded-xl bg-white shadow-custom">
                        <span className="text-2xl">📊</span>
                        <span className="text-md text-slate-700">Gelişmiş istatistikler</span>
                    </div>

                    <div className="flex items-center gap-3 p-6 border border-slate-200 rounded-xl bg-white shadow-custom">
                        <span className="text-2xl">🎨</span>
                        <span className="text-md text-slate-700">Özel tasarım seçenekleri</span>
                    </div>

                    <div className="flex items-center gap-3 p-6 border border-slate-200 rounded-xl bg-white shadow-custom">
                        <span className="text-2xl">⚙️</span>
                        <span className="text-md text-slate-700">API erişimi</span>
                    </div>

                    <div className="flex items-center gap-3 p-6 border border-slate-200 rounded-xl bg-white shadow-custom">
                        <span className="text-2xl">🎯</span>
                        <span className="text-md text-slate-700">Öncelikli destek</span>
                    </div>

                    <div className="flex items-center gap-3 p-6 border border-slate-200 rounded-xl bg-white shadow-custom">
                        <span className="text-2xl">👥</span>
                        <span className="text-md text-slate-700">Ekip işbirliği</span>
                    </div>
                </div>
            </div>
        );
    }

    // abone İSE
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200 p-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Plan Bilgileri
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-slate-500">Plan</div>
                                <div className="text-slate-900 font-semibold">
                                    {info.current_plan || "Bilinmiyor"}
                                </div>

                                <div className="text-slate-500">Abonelik ID</div>
                                <div className="text-slate-900 font-mono text-[13px] break-all">
                                    {info.subscription_id || "—"}
                                </div>

                                <div className="text-slate-500">Durum</div>
                                <div className="text-slate-900 font-medium">
                                    {info.status === "active"
                                        ? "Aktif"
                                        : info.status || "—"}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-slate-200 p-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Tarihler
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-slate-500">Başlangıç</div>
                                <div className="text-slate-900 font-medium">
                                    {formatDate(info.started_at)}
                                </div>

                                <div className="text-slate-500">Sonraki Yenileme</div>
                                <div className="text-slate-900 font-medium">
                                    {formatDate(info.renews_at)}
                                </div>

                                {info.ends_at && (
                                    <>
                                        <div className="text-slate-500">Bitiş</div>
                                        <div className="text-slate-900 font-medium">
                                            {formatDate(info.ends_at)}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200 p-4">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Ödeme Yöntemi
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-y-3 text-sm">
                                <div className="text-slate-500">Kart</div>
                                <div className="text-slate-900 font-medium">
                                    {info.card_brand
                                        ? `${info.card_brand} ••••${info.card_last_four}`
                                        : "Kayıtlı kart yok"}
                                </div>

                                <div className="text-slate-500">Durum</div>
                                <div
                                    className={
                                        "font-medium " +
                                        (info.status === "active"
                                            ? "text-emerald-600"
                                            : "text-slate-700")
                                    }
                                >
                                    {info.status === "active"
                                        ? "Ödeme aktif"
                                        : info.status || "—"}
                                </div>

                                <div className="text-slate-500">Tahsilat Tarihi</div>
                                <div className="text-slate-900 font-medium">
                                    {formatDate(info.renews_at)}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start rounded-xl border border-slate-200 p-5">
                            <span
                                className={
                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                                    (info.status === "active"
                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                        : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20")
                                }
                            >
                                {info.status === "active"
                                    ? "Aktif"
                                    : info.status || "—"}
                            </span>

                            <div className="mt-2 text-[13px] text-slate-500">
                                Yenileme:{" "}
                                <span className="font-medium text-slate-900">
                                    {formatDate(info.renews_at)}
                                </span>
                            </div>

                            <div className="text-[13px] text-slate-500">
                                Kart:{" "}
                                <span className="font-medium text-slate-900">
                                    {info.card_brand
                                        ? `${info.card_brand} ••••${info.card_last_four}`
                                        : "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BillingActions />
        </div>
    );
}
