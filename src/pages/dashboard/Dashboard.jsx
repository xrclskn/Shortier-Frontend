import { MousePointer, Link2, BarChart3, User, Eye, ChartBar, Edit, Plus, Trash, RefreshCw, AlertTriangle } from "lucide-react";
import { NavLink } from "react-router-dom";
import StatsCard from "@/components/dashboard/StatsCard";
import useDashboardData from "@/hooks/useDashboardData";
import { getImageUrl } from "@/utils/themeHelpers";
import { config } from "@/config";
import { useAuth } from "@/context/AuthContext";

function formatRelativeTime(isoString) {
    if (!isoString) return "";
    const ts = new Date(isoString);
    if (Number.isNaN(ts.getTime())) return isoString;
    const now = new Date();
    const diffMs = now - ts;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr >= 24) {
        return ts.toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } else if (diffHr >= 1) {
        return `${diffHr} saat önce`;
    } else if (diffMin >= 1) {
        return `${diffMin} dk önce`;
    } else {
        return "az önce";
    }
}

export default function Dashboard() {
    const { data, isLoading, isError } = useDashboardData();
    const { user } = useAuth();

    // Daima tanımlı aktif link sayısı
    const totalActiveLinks =
        (data?.active_links_count?.action_links || 0) +
        (data?.active_links_count?.profile_links || 0);

    // Actions örneği (username ile uyumlu)
    const actions = [
        {
            c1: "bg-white",
            icon: User,
            title: "Profil Düzenle",
            link: "/app/biography",
            sub: "Bilgileri güncelle",
        },
        {
            c1: "bg-white",
            icon: ChartBar,
            title: "Tıklama Analizi",
            link: "/app/analytics",
            sub: "İstatistiklere göz at",
        },
        {
            c1: "bg-white",
            icon: Eye,
            title: "Profili Görüntüle",
            link: data?.username ? `${config.PROFILE_BASE_URL}/${data.username}` : "#",
            sub: "Profilini ziyaret et",
            target: "_blank",
        },
    ];

    if (isError) {
        return <div className="text-red-500 p-6">Bir hata oluştu, lütfen tekrar deneyin.</div>;
    }

    return (
        <div className="space-y-6">

            {/* Downgrade Warning Banner */}
            {user?.downgrade_grace?.in_grace && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-lg">Plan Limiti Aşıldı</h3>
                            <p className="text-white/90 text-sm mt-1">
                                Mevcut planınızın profil limitini <strong>{user.downgrade_grace.excess_profile_count}</strong> adet aşıyorsunuz.
                                <strong> {user.downgrade_grace.days_remaining} gün</strong> içinde plan yükseltmezseniz veya fazla profilleri silmezseniz,
                                en eski profilleriniz otomatik olarak silinecek.
                            </p>
                            <div className="mt-3 flex gap-3">
                                <NavLink
                                    to="/app/subscription"
                                    className="inline-flex items-center px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-white/90 transition-colors text-sm"
                                >
                                    🚀 Planı Yükselt
                                </NavLink>
                                <NavLink
                                    to="/app/profile/list"
                                    className="inline-flex items-center px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors text-sm"
                                >
                                    🗂️ Profilleri Yönet
                                </NavLink>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white/70 text-xs">Son Tarih</div>
                            <div className="text-white font-bold">
                                {new Date(user.downgrade_grace.until).toLocaleDateString('tr-TR')}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="rounded-lg bg-[#010101] p-6 shadow-custom animate-pulse">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                            <div className="w-10 h-10 bg-white/40 rounded-xl"></div>
                        </div>
                        <div className="h-8 w-48 mx-auto rounded bg-white/20 mb-3"></div>
                        <div className="h-4 w-64 mx-auto rounded bg-white/20 mb-2"></div>
                        <div className="h-4 w-52 mx-auto rounded bg-white/15"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="rounded-xl p-4 bg-white/30 border border-white/20"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/40"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 w-24 rounded bg-white/30"></div>
                                        <div className="h-3 w-20 rounded bg-white/20"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-lg bg-gradient-to-br from-[#010101] to-gray-600 p-6 shadow-custom">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center overflow-hidden justify-center border-4 border-white/20 mx-auto mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            {data?.photo ? (
                                <img
                                    src={getImageUrl(data.photo)}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Hoş geldin, <span>{data?.name || "Kullanıcı"}</span> 👋
                        </h1>
                        <p className="text-white/90">
                            Biyografi sayfanı yönet ve performansını takip et. Yeni linkler ekle, istatistikleri incele ve profilini geliştir.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {actions.map((a, i) => {
                            const Icon = a.icon;
                            return (
                                <NavLink
                                    to={a.link || "#"}
                                    target={a.target || "_self"}
                                    key={i}
                                    className="rounded-xl p-4 bg-white/40 border border-white/20 hover:bg-white/50 transition-all duration-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl ${a.c1} flex items-center justify-center shadow-lg`}
                                        >
                                            <Icon className="w-5 h-5 text-[#010101]" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-medium">
                                                {a.title}
                                            </p>
                                            <p className="text-white/70 text-sm">
                                                {a.sub}
                                            </p>
                                        </div>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    iconBg="bg-[#010101]"
                    loading={isLoading}
                    icon={MousePointer}
                    value={data?.total_clicks_24h ?? 0}
                    label="Toplam Tıklama / 24s"
                />
                <StatsCard
                    iconBg="bg-[#010101]"
                    loading={isLoading}
                    icon={Link2}
                    value={totalActiveLinks}
                    label="Aktif Link"
                />
                <StatsCard
                    iconBg="bg-[#010101]"
                    icon={User}
                    loading={isLoading}
                    value={data?.total_views_24h ?? 0}
                    label="Profil Görüntüleme / 24s"
                />
                <StatsCard
                    iconBg="bg-[#010101]"
                    icon={BarChart3}
                    loading={isLoading}
                    value={typeof data?.ctr_24h === "number" ? `${data.ctr_24h}%` : "-"}
                    label="Tıklama Oranı / 24s"
                />
            </div>

            {/* Son Aktiviteler */}
            <div className="rounded-xl p-6 bg-white shadow-custom">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Son Aktiviteler (24saat)
                </h3>
                {(!data?.last_activities || data.last_activities.length === 0) ? (
                    <div className="text-gray-500 text-sm text-center py-8">
                        Son 24 saatte aktivite yok.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.last_activities.map((item, i) => {
                            let Icon = Eye;
                            let c = "bg-[#efefef]";
                            let t = "Profil görüntülemesi";
                            let s = "Profil ziyaret edildi";

                            if (item.type === 'admin_activity') {
                                const sub = item.sub_type;
                                const details = item.details || {};
                                if (sub === 'profile_update') {
                                    Icon = Edit;
                                    t = "Profil Güncellendi";
                                    s = `Kullanıcı adı: ${details.username || '...'}`;
                                } else if (sub === 'link_create' || sub === 'social_link_create') {
                                    Icon = Plus;
                                    t = "Yeni Link Eklendi";
                                    s = details.label || "Link";
                                } else if (sub === 'link_update' || sub === 'social_link_update') {
                                    Icon = Edit;
                                    t = "Link Düzenlendi";
                                    s = details.label || "Link";
                                } else if (sub === 'link_delete') {
                                    Icon = Trash;
                                    t = "Link Silindi";
                                    s = details.label || "Link";
                                } else if (sub === 'link_reorder') {
                                    Icon = RefreshCw;
                                    t = "Sıralama Değişti";
                                    s = `${details.count || '?'} link yeniden sıralandı`;
                                } else {
                                    // Fallback for other admins
                                    Icon = Edit;
                                    t = "İşlem Yapıldı";
                                    s = sub;
                                }
                            } else if (item.type === 'click') {
                                Icon = MousePointer;
                                t = "Link tıklaması";
                                s = item.link_id
                                    ? `Link ID #${item.link_id} tıklandı`
                                    : "Bir link tıklandı";
                            }

                            const rc = "text-gray-500";
                            return (
                                <div
                                    key={i}
                                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl ${c} flex items-center justify-center shadow-md`}
                                    >
                                        <Icon className="w-4 h-4 text-[#010101]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {t}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {s}
                                        </p>
                                    </div>
                                    <div className={`${rc} font-semibold text-sm text-right whitespace-nowrap`}>
                                        {formatRelativeTime(item.created_at)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
