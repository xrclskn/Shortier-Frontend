import { useEffect, useMemo, useState } from "react";

export default function StatsChart({ stats, loading }) {
    // API verisi
    const chartRows = stats?.chart?.data ?? [];

    // Granularity
    const granularity = stats?.chart?.granularity ?? "day";

    // Label güvenliği
    const formatLabel = (row) => {
        if (row.day) return row.day;      // Backend günlük/saatlik label
        if (row.label) return row.label;  // Haftalık/aylık label
        if (granularity === "hour") return (row.date ?? "").slice(11, 16);
        if (granularity === "month") return row.date ?? "";
        return row.date ?? "";
    };

    // chartData oluştur
    const chartData = useMemo(() => {
        if (!chartRows.length) return [];
        return chartRows.map((r) => ({
            day: formatLabel(r),
            views: Number(r.views || 0),
            clicks: Number(r.clicks || 0),
        }));
    }, [chartRows, granularity]);

    // maxValue hesapla
    const maxValue = useMemo(() => {
        if (!chartData.length) return 1;
        return Math.max(...chartData.flatMap((d) => [d.views, d.clicks]));
    }, [chartData]);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-500">
                Veriler yükleniyor…
            </div>
        );
    }

    if (!chartData.length) {
        return (
            <div className="h-64 flex items-center justify-center text-gray-400">
                Henüz görüntülenecek veri yok
            </div>
        );
    }

    return (
        <div className="flex justify-between items-stretch h-90 md:h-64 space-x-3">
            {chartData.map((data, idx) => {
                const uniqueKey = data.date ?? data.key ?? `${data.day}-${idx}`; // <- benzersiz
                const viewHeight = Math.max((data.views / maxValue) * 100, 5);
                const clickHeight = Math.max((data.clicks / maxValue) * 100, 3);

                return (
                    <div key={uniqueKey} className="flex-1 flex flex-col items-center space-y-3">
                        <div className="w-full h-full flex items-end justify-center space-x-2">
                            <div
                                className="w-1/2 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-xl hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer relative group shadow-sm"
                                style={{ height: `${viewHeight}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-xl">
                                    <div className="font-bold">{data.views.toLocaleString()}</div>
                                    <div className="text-gray-300">görüntülenme</div>
                                </div>
                            </div>

                            <div
                                className="w-1/2 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-xl hover:from-purple-600 hover:to-purple-500 transition-all cursor-pointer relative group shadow-sm"
                                style={{ height: `${clickHeight}%` }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10 shadow-xl">
                                    <div className="font-bold">{data.clicks.toLocaleString()}</div>
                                    <div className="text-gray-300">tıklama</div>
                                </div>
                            </div>
                        </div>

                        <span className="text-sm text-gray-600 font-semibold">{data.day}</span>
                    </div>
                );
            })}
        </div>
    );
}
