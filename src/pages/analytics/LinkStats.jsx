import React, { useState, useMemo, useEffect } from "react";
import {
    TrendingUp,
    Eye,
    MousePointer,
    Users,
    ArrowUp,
    ArrowLeft,
    Calendar,
    Globe,
    Smartphone,
    Share2,
    Download,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "@/api/client";
import StatsChart from "@/components/analytics/StatsChart.jsx";
import { toast } from "@/utils/toast";

export default function LinkStats() {
    const { type, id } = useParams(); // type: 'profile_link' | 'short_url'
    const navigate = useNavigate();
    const [selectedPeriod, setSelectedPeriod] = useState("24h");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [type, id, selectedPeriod]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(`/api/analytics/${type}/${id}`, {
                params: { period: selectedPeriod },
            });
            setStats(res.data);
        } catch (error) {
            console.error("Stats error:", error);
            toast.error("İstatistikler yüklenirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const periodOptions = [
        { id: "24h", label: "Son 24 Saat" },
        { id: "7days", label: "Son 7 Gün" },
        { id: "30days", label: "Son 30 Gün" },
        { id: "all", label: "Tüm Zamanlar" },
    ];

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        <span>Geri Dön</span>
                    </button>
                    <div className="flex space-x-2">
                        {periodOptions.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedPeriod(p.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPeriod === p.id
                                        ? "bg-black text-white shadow-lg"
                                        : "bg-white text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                    </div>
                ) : stats ? (
                    <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Toplam Tıklama"
                                value={stats.totals.clicks}
                                icon={MousePointer}
                                color="bg-blue-500"
                            />
                            <StatCard
                                title="Tekil Tıklama"
                                value={stats.totals.unique_clicks}
                                icon={Users}
                                color="bg-purple-500"
                            />
                            <StatCard
                                title="Dönüşüm Oranı"
                                value={`%${stats.totals.clicks > 0 ? ((stats.totals.unique_clicks / stats.totals.clicks) * 100).toFixed(1) : 0}`}
                                icon={TrendingUp}
                                color="bg-green-500"
                                subtext="Tekil / Toplam"
                            />
                        </div>

                        {/* Main Chart */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Tıklama Performansı</h3>
                            <div className="h-[300px]">
                                <StatsChart
                                    data={stats.chart.data || []}
                                    granularity={stats.chart.granularity}
                                    dataKey1="clicks"
                                    name1="Tıklama"
                                    color1="#000000"
                                />
                            </div>
                        </div>

                        {/* Breakdowns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Countries */}
                            <BreakdownCard
                                title="En Çok Tıklayan Ülkeler"
                                icon={Globe}
                                data={stats.breakdowns.country}
                                formatValue={(v) => `${v.visits} tık`}
                                formatLabel={(item) => (
                                    <span className="flex items-center">
                                        <span className="mr-2 text-lg">{getFlagEmoji(item.country_code)}</span>
                                        {item.country}
                                    </span>
                                )}
                            />

                            {/* Devices */}
                            <BreakdownCard
                                title="Cihaz Dağılımı"
                                icon={Smartphone}
                                data={stats.breakdowns.device}
                                formatValue={(v) => `${v.visits} tık`}
                                formatLabel={(item) => item.device}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-gray-500">Veri bulunamadı.</div>
                )}
            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h4 className="text-3xl font-bold text-gray-900 mt-1">{value}</h4>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
    </div>
);

const BreakdownCard = ({ title, icon: Icon, data, formatLabel, formatValue }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
                <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        <div className="space-y-4">
            {data && data.length > 0 ? (
                data.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-700">
                            {formatLabel(item)}
                        </div>
                        <div className="text-sm text-gray-500 font-semibold">
                            {formatValue(item)}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-400 text-sm">Veri yok</p>
            )}
        </div>
    </div>
);

function getFlagEmoji(countryCode) {
    if (!countryCode) return "🌍";
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}
