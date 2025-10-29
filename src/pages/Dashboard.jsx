import { useEffect, useState, useMemo } from "react";
import {
    MousePointer,
    Link2,
    BarChart3,
    User,
    Eye,
    ChartBar,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import StatsCard from "@/components/StatsCard";
import {
    getAuthUserData,
    getActiveLinks,
    getClicks,
    lastActivities,
} from "@/context/DashboardContext.jsx";

function Dashboard() {
    const [data, setData] = useState(null); // auth user
    const [links, setLinks] = useState([]); // aktif linkler
    const [clicks, setClicks] = useState(0); // 24h tıklama
    const [visits, setVisits] = useState(0); // 24h görüntülenme
    const [ctr, setCtr] = useState(0); // 24h CTR
    const [range, setRange] = useState({ from: null, to: null }); // opsiyonel
    const [activities, setActivities] = useState([]); // son aktiviteler (UI-shape)
    const [loading, setLoading] = useState(true);

    // Kullanıcı verisi
    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await getAuthUserData();
                setData(userData);
            } catch (err) {
                console.error("Kullanıcı verisi alınamadı:", err);
            }
        }
        fetchUser();
    }, []);


    // İstatistikler (tıklama / görüntülenme / ctr / range)
    useEffect(() => {
        async function fetchStats() {
            try {
                const stats = await getClicks();
                setClicks(stats.total_clicks ?? 0);
                setVisits(stats.profile_visits ?? 0);
                setCtr(stats.ctr ?? 0);
                setRange(stats.range ?? { from: null, to: null });
            } catch (err) {
                console.error("İstatistik verisi alınamadı:", err);
            }
        }
        fetchStats();
    }, []);

    // Aktif linkler
    useEffect(() => {
        async function fetchLinks() {
            try {
                const userLinks = await getActiveLinks();
                setLinks(userLinks || []);
            } catch (err) {
                console.error("Link verisi alınamadı:", err);
            }
        }
        fetchLinks();
    }, []);

    // Son aktiviteler
    useEffect(() => {
        async function fetchActivities() {
            try {
                // Backend'den ham aktiviteleri al
                const res = await lastActivities();
                // beklenen: { activities: [ {type, created_at, link_id?, ...}, ...], range: {...} }
                const raw = res?.activities || [];

                // frontend için güzel karta çevirelim
                const mapped = raw.map((item) => {
                    const isClick = item.type === "click";

                    return {
                        // ikon ve renkler
                        icon: isClick ? MousePointer : Eye,
                        c: isClick
                            ? "from-purple-500 to-purple-600"
                            : "from-blue-500 to-blue-600",

                        // başlık
                        t: isClick
                            ? "Link tıklaması"
                            : "Profil görüntülemesi",

                        // alt text / detay
                        s: isClick
                            ? (item.link_id
                                ? `Link ID #${item.link_id} tıklandı`
                                : "Bir link tıklandı")
                            : "Profil ziyaret edildi",

                        // sağ tarafta gösterilecek zaman
                        r: formatRelativeTime(item.created_at),

                        // sağ tarafın rengi
                        rc: "text-gray-500",
                    };
                });

                setActivities(mapped);
            } catch (err) {
                console.error("Aktivite verisi alınamadı:", err);
            }
        }
        fetchActivities();
    }, []);

    // tüm bağımsız fetchler bittikten sonra loading'i kapatalım
    // yaklaşım: data, links, clicks/visits, activities geldi mi?
    const isReady = useMemo(() => {
        // en azından user verisi ve stats çekilmiş olsun ki hero + kartlar dolsun
        return data !== null;
    }, [data]);

    useEffect(() => {
        if (isReady) {
            setLoading(false);
        }
    }, [isReady]);

    // username'e göre aksiyonlar
    const actions = useMemo(() => {
        const usernameUrl = data?.username ? `/${data.username.username}` : "#";


        return [
            {
                c1: "from-purple-500 to-purple-600",
                icon: User,
                title: "Profil Düzenle",
                link: "profile-designer",
                sub: "Bilgileri güncelle",
            },
            {
                c1: "from-blue-500 to-blue-600",
                icon: ChartBar,
                title: "Tıklama Analizi",
                link: "statistics",
                sub: "İstatistiklere göz at",
            },
            {
                c1: "from-pink-500 to-pink-600",
                icon: Eye,
                title: "Profili Görüntüle",
                link: usernameUrl,
                sub: "Profilini ziyaret et",
                target: "_blank",
            },
        ];
    }, [isReady]);

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            {loading ? (
                // LOADING STATE
                <div className="rounded-lg bg-gradient-to-br from-blue-400 to-indigo-800 p-8 shadow-custom animate-pulse">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center overflow-hidden justify-center border-3 mx-auto mb-4 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                            <div className="w-20 h-20 bg-white/30 animate-pulse rounded-2xl" />
                        </div>
                        <div className="h-8 bg-white/30 rounded w-64 mx-auto mb-2 animate-pulse" />
                        <div className="h-6 bg-white/20 rounded w-200 mb-2 mx-auto animate-pulse" />
                        <div className="h-4 bg-white/20 rounded w-100 mx-auto animate-pulse" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {actions.map((a, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-4 bg-white/40 border border-white/20"
                            >
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl bg-gradient-to-r ${a.c1} flex items-center justify-center opacity-50`}
                                    >
                                        <div className="w-5 h-5 bg-white/50 rounded animate-pulse" />
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="h-4 bg-white/50 rounded w-20 mb-1 animate-pulse" />
                                        <div className="h-3 bg-white/30 rounded w-16 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // LOADED STATE
                <div className="rounded-lg bg-gradient-to-br from-blue-400 to-indigo-800 p-6 shadow-custom">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center overflow-hidden justify-center border-3 mx-auto mb-4 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                            {data?.username.photo ? (
                                <img
                                    src={data?.username.photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-2">
                            Hoş geldin,{" "}
                            <span>{data?.user.name || "Kullanıcı"}</span> 👋
                        </h1>

                        <p className="text-white/90">
                            Biyografi sayfanı yönet ve performansını takip et.
                            Yeni linkler ekle, istatistikleri incele ve
                            profilini geliştir.
                        </p>

                        {range?.from && range?.to && (
                            <p className="text-[11px] mt-3 text-white/60 font-medium">
                                Veri aralığı: {range.from} → {range.to}
                            </p>
                        )}
                    </div>

                    {/* Quick Actions */}
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
                                            className={`w-10 h-10 rounded-xl bg-gradient-to-r ${a.c1} flex items-center justify-center shadow-lg`}
                                        >
                                            <Icon className="w-5 h-5 text-white" />
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
                    iconBg="bg-gradient-to-r from-blue-500 to-blue-600"
                    loading={loading}
                    icon={MousePointer}
                    value={clicks}
                    label="Toplam Tıklama / 24s"
                />
                <StatsCard
                    iconBg="bg-gradient-to-r from-purple-500 to-purple-600"
                    loading={loading}
                    icon={Link2}
                    value={links.length}
                    label="Aktif Link"
                />
                <StatsCard
                    iconBg="bg-gradient-to-r from-green-500 to-green-600"
                    icon={User}
                    loading={loading}
                    value={visits}
                    label="Profil Görüntüleme / 24s"
                />
                <StatsCard
                    iconBg="bg-gradient-to-r from-yellow-500 to-yellow-600"
                    icon={BarChart3}
                    loading={loading}
                    value={`${ctr}%`}
                    label="Tıklama Oranı / 24s"
                />
            </div>

            {/* Son Aktiviteler */}
            <div className="rounded-xl p-6 bg-white shadow-custom">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Son Aktiviteler (24saat)
                </h3>

                {activities.length === 0 ? (
                    <div className="text-gray-500 text-sm text-center py-8">
                        Son 24 saatte aktivite yok.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activities.map((activity, i) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl bg-gradient-to-r ${activity.c} flex items-center justify-center shadow-md`}
                                    >
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {activity.t}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {activity.s}
                                        </p>
                                    </div>

                                    <div
                                        className={`${activity.rc} font-semibold text-sm text-right whitespace-nowrap`}
                                    >
                                        {activity.r}
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

// yardımcı: "2025-10-27 15:12:04" -> "15:12" ya da "3 dk önce"
function formatRelativeTime(isoString) {
    if (!isoString) return "";

    // Güvenlik için Date parse
    const ts = new Date(isoString);
    if (Number.isNaN(ts.getTime())) {
        return isoString; // backend format bozuksa fallback
    }

    const now = new Date();
    const diffMs = now - ts;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);

    if (diffHr >= 24) {
        // 24 saati geçtiyse tarih+saat göster
        return ts.toLocaleString("tr-TR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    } else if (diffHr >= 1) {
        return `${diffHr} saat önce`;
    } else if (diffMin >= 1) {
        return `${diffMin} dk önce`;
    } else {
        return "az önce";
    }
}

export default Dashboard;
