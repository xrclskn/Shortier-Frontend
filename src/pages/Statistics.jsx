import React, { useState, useMemo, useEffect } from "react";
import {
    TrendingUp,
    Eye,
    MousePointer,
    Users,
    Link2,
    BarChart3,
    MapPin,
    ArrowUp,
    ArrowLeft,
    Download,
    Share2,
    RefreshCw,
    Lock,
    Smartphone,
    Monitor,
    Globe,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

import { useStatistics } from "@/context/StatisticsContext.jsx";
import useSubscription from "@/hooks/useSubscription.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import StatsChart from "@/components/statisticsComponents/StatsChart.jsx";
import ShortierReportExporter from "@/components/statisticsComponents/ShortierReportExporter.jsx";

export default function Statistics() {
    // ---- state ----
    const [selectedPeriod, setSelectedPeriod] = useState("24h");
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // ---- context/hooks ----
    const { fetchStatistics } = useStatistics();
    const { info } = useSubscription();
    const { user } = useAuth(); // <-- buradan aldık

    const isSubscribed = !!info?.is_subscribed;

    // ---- data fetch ----
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchStatistics({ period: selectedPeriod });
                setStats(data);
            } catch (err) {
                console.error("İstatistik verisi yüklenemedi:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [selectedPeriod, fetchStatistics]);

    // ---- helpers ----
    const calculateCTR = () => {
        const clicks = stats?.totals?.clicks || 0;
        const visits = stats?.totals?.visits || 0;
        if (visits <= 0) return "0.0";
        const ratio = (clicks / visits) * 100;
        return ratio.toFixed(1);
    };

    const chartGranularity = stats?.chart?.granularity;
    const chartRows = stats?.chart?.data ?? [];

    const formatLabel = (row) => {
        if (row.day) return row.day;
        if (row.label) return row.label;

        if (chartGranularity === "hour") {
            // "YYYY-MM-DD HH:00" -> "HH:00"
            return (row.date ?? "").slice(11, 16) || "";
        }
        if (chartGranularity === "month") {
            return row.date ?? "";
        }
        if (chartGranularity === "week") {
            return row.key ? `W${String(row.key).slice(-2)}` : "W";
        }
        return row.date ?? "";
    };

    const chartData = useMemo(() => {
        if (!chartRows.length) return [];
        return chartRows.map((r) => ({
            day: formatLabel(r),
            views: Number(r.views || 0),
            clicks: Number(r.clicks || 0),
            date: r.date ?? r.key ?? undefined,
        }));
    }, [chartRows, chartGranularity]);

    // max scale (gerekirse ileride grafiğe paslanır)
    useMemo(() => {
        if (!chartData.length) return 1;
        return Math.max(
            ...chartData.flatMap((d) => [d.views ?? 0, d.clicks ?? 0])
        );
    }, [chartData]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            const data = await fetchStatistics({ period: selectedPeriod });
            setStats(data);
        } catch (err) {
            console.error("Veri yenilenemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    // cihaz dağılımı
    const formatDeviceData = () => {
        const list = stats?.breakdowns?.device || [];
        const total = stats?.totals?.visits || 0;

        return list.map((row) => {
            const v = row.visits || 0;
            return {
                name: row.device || "Diğer",
                visits: v,
                percentage: total > 0 ? ((v / total) * 100).toFixed(0) : "0",
            };
        });
    };

    // ülke-bayrak
    const getCountryFlag = (countryName) => {
        const flags = {
            "United States": "🇺🇸",
            Turkey: "🇹🇷",
            Germany: "🇩🇪",
            "United Kingdom": "🇬🇧",
            France: "🇫🇷",
            Canada: "🇨🇦",
            Japan: "🇯🇵",
            China: "🇨🇳",
            Russia: "🇷🇺",
            India: "🇮🇳",
        };
        return flags[countryName] || "🌍";
    };

    // lokasyon dağılımı
    const formatLocationData = () => {
        const list = stats?.breakdowns?.country || [];
        const total = stats?.totals?.visits || 0;

        // aynı ülke birden çok varsa merge
        const map = {};
        list.forEach((c) => {
            const name = c.country || "Bilinmeyen";
            map[name] = (map[name] || 0) + (c.visits || 0);
        });

        return Object.entries(map).map(([name, visits]) => ({
            country: name,
            visits,
            percentage: total > 0 ? ((visits / total) * 100).toFixed(0) : "0",
            flag: getCountryFlag(name),
        }));
    };

    // link listesi (tüm linkler)
    const formatAllLinks = () => {
        const totalClicks = stats?.totals?.clicks || 0;
        const list = stats?.all_links || [];

        return list.map((link, index) => {
            const linkClicks = link.clicks || 0;
            const rate = totalClicks > 0 ? (linkClicks / totalClicks) * 100 : 0;
            return {
                name: (link.title || `Link ${link.id || index}`).toUpperCase(),
                clicks: linkClicks,
                rate,
                color: [
                    "bg-pink-500",
                    "bg-red-500",
                    "bg-blue-400",
                    "bg-blue-700",
                    "bg-indigo-500",
                ][index % 5],
            };
        });
    };

    // popüler linkler (top_links)
    const formatTopLinks = () => {
        const totalClicks = stats?.totals?.clicks || 0;
        const list = stats?.top_links || [];

        return list.map((link, index) => {
            const linkClicks = link.clicks || 0;
            const rate = totalClicks > 0 ? (linkClicks / totalClicks) * 100 : 0;
            return {
                name: (link.title || `Link ${link.id || index}`).toUpperCase(),
                clicks: linkClicks,
                rate,
                color: [
                    "bg-pink-500",
                    "bg-red-500",
                    "bg-blue-400",
                    "bg-blue-700",
                    "bg-indigo-500",
                ][index % 5],
            };
        });
    };

    // PDF EXPORT
    const handleDownloadPDF = () => {
        if (!stats) {
            alert("Rapor oluşturmak için veri bulunamadı.");
            return;
        }

        const doc = new jsPDF({
            orientation: "p",
            unit: "pt",
            format: "a4",
        });

        // basic layout vars
        const marginX = 40;
        let y = 50;

        const writeLine = (
            text,
            {
                size = 12,
                bold = false,
                color = "#000000",
                gap = 18,
            } = {}
        ) => {
            doc.setFont("helvetica", bold ? "bold" : "normal");
            doc.setFontSize(size);
            doc.setTextColor(color);
            doc.text(text, marginX, y, { maxWidth: 520 });
            y += gap;
        };

        // header
        writeLine("Shortier İstatistik Raporu", {
            size: 20,
            bold: true,
            color: "#1f2937",
            gap: 28,
        });

        // kullanıcı bilgisi buraya geldi
        writeLine(
            `Kullanıcı: ${user?.name || "-"} (${user?.email || "-"})`,
            {
                size: 11,
                color: "#4b5563",
                gap: 16,
            }
        );

        writeLine(
            `Oluşturulma: ${new Date().toLocaleString("tr-TR")}`,
            {
                size: 11,
                color: "#4b5563",
                gap: 16,
            }
        );

        const humanPeriod =
            selectedPeriod === "24h"
                ? "Son 24 Saat"
                : selectedPeriod === "7days"
                    ? "Son 7 Gün"
                    : selectedPeriod === "30days"
                        ? "Son 30 Gün"
                        : "Tüm Zamanlar";

        writeLine(`Dönem: ${humanPeriod}`, {
            size: 11,
            color: "#4b5563",
            gap: 20,
        });

        if (stats.range?.start && stats.range?.end) {
            const startStr = new Date(
                stats.range.start
            ).toLocaleDateString("tr-TR");
            const endStr = new Date(
                stats.range.end
            ).toLocaleDateString("tr-TR");

            writeLine(`Aralık: ${startStr} - ${endStr}`, {
                size: 11,
                color: "#4b5563",
                gap: 24,
            });
        } else {
            y += 10;
        }

        // genel metrikler
        writeLine("Genel Metrikler", {
            size: 14,
            bold: true,
            color: "#111827",
            gap: 22,
        });

        const totalVisits = stats?.totals?.visits || 0;
        const totalClicks = stats?.totals?.clicks || 0;
        const uniqueVisitors = stats?.totals?.unique_visitors || 0;
        const ctr = calculateCTR();

        writeLine(
            `Toplam Görüntülenme: ${totalVisits.toLocaleString("tr-TR")}`,
            { size: 12, gap: 16 }
        );
        writeLine(
            `Toplam Tıklama: ${totalClicks.toLocaleString("tr-TR")}`,
            { size: 12, gap: 16 }
        );
        writeLine(
            `Tekil Ziyaretçi: ${uniqueVisitors.toLocaleString("tr-TR")}`,
            { size: 12, gap: 16 }
        );
        writeLine(`Tıklama Oranı (CTR): ${ctr}%`, {
            size: 12,
            gap: 24,
        });

        y += 10;

        // En Popüler Linkler tablosu
        const topLinksData = formatTopLinks();
        writeLine("En Popüler Linkler", {
            size: 14,
            bold: true,
            color: "#111827",
            gap: 22,
        });

        if (!topLinksData.length) {
            writeLine("Veri yok.", {
                size: 12,
                color: "#6b7280",
                gap: 24,
            });
        } else {
            doc.autoTable({
                startY: y,
                head: [["#", "Link", "Tıklama", "Pay (%)"]],
                styles: {
                    font: "helvetica",
                    fontSize: 10,
                },
                headStyles: {
                    fillColor: [37, 99, 235], // mavi
                    textColor: 255,
                    fontStyle: "bold",
                },
                body: topLinksData.slice(0, 10).map((row, idx) => [
                    idx + 1,
                    row.name,
                    row.clicks || 0,
                    `${row.rate.toFixed(0)}%`,
                ]),
                theme: "striped",
                striped: true,
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 240 },
                    2: { cellWidth: 80, halign: "right" },
                    3: { cellWidth: 80, halign: "right" },
                },
                margin: { left: marginX, right: marginX },
            });

            y = doc.lastAutoTable.finalY + 30;
        }

        // Cihaz Dağılımı
        const deviceRows = formatDeviceData();
        writeLine("Cihaz Dağılımı", {
            size: 14,
            bold: true,
            color: "#111827",
            gap: 22,
        });

        if (!deviceRows.length) {
            writeLine("Veri yok.", {
                size: 12,
                color: "#6b7280",
                gap: 24,
            });
        } else {
            doc.autoTable({
                startY: y,
                head: [["Cihaz", "Ziyaret", "Oran"]],
                styles: {
                    font: "helvetica",
                    fontSize: 10,
                },
                headStyles: {
                    fillColor: [16, 185, 129], // yeşil
                    textColor: 255,
                    fontStyle: "bold",
                },
                body: deviceRows.map((d) => [
                    d.name,
                    d.visits,
                    `%${d.percentage}`,
                ]),
                theme: "striped",
                striped: true,
                columnStyles: {
                    0: { cellWidth: 200 },
                    1: { cellWidth: 100, halign: "right" },
                    2: { cellWidth: 100, halign: "right" },
                },
                margin: { left: marginX, right: marginX },
            });

            y = doc.lastAutoTable.finalY + 30;
        }

        // Lokasyon Dağılımı
        const locationRows = formatLocationData();
        writeLine("Konum Dağılımı", {
            size: 14,
            bold: true,
            color: "#111827",
            gap: 22,
        });

        if (!locationRows.length) {
            writeLine("Veri yok.", {
                size: 12,
                color: "#6b7280",
                gap: 24,
            });
        } else {
            doc.autoTable({
                startY: y,
                head: [["Ülke", "Ziyaret", "Oran"]],
                styles: {
                    font: "helvetica",
                    fontSize: 10,
                },
                headStyles: {
                    fillColor: [99, 102, 241], // indigo
                    textColor: 255,
                    fontStyle: "bold",
                },
                body: locationRows.slice(0, 10).map((c) => [
                    `${c.flag} ${c.country}`,
                    c.visits,
                    `%${c.percentage}`,
                ]),
                theme: "striped",
                striped: true,
                columnStyles: {
                    0: { cellWidth: 220 },
                    1: { cellWidth: 100, halign: "right" },
                    2: { cellWidth: 100, halign: "right" },
                },
                margin: { left: marginX, right: marginX },
            });

            y = doc.lastAutoTable.finalY + 30;
        }

        doc.save("shortier-rapor.pdf");
    };

    // ---- UI ----
    // periyot butonları
    const renderPeriodButtons = () => {
        return (
            <div className="flex items-center space-x-2 bg-white rounded-xl p-1.5 shadow-custom border border-gray-200">
                {["24h", "7days", "30days", "all"].map((period) => {
                    const locked = !isSubscribed && period !== "24h";
                    const label =
                        period === "24h"
                            ? "Son 24 Saat"
                            : period === "7days"
                                ? "Son 7 Gün"
                                : period === "30days"
                                    ? "Son 30 Gün"
                                    : "Tüm Zamanlar";
                    const isActive = selectedPeriod === period && !locked;

                    return (
                        <div
                            key={period}
                            className={`relative ${locked ? "group" : ""}`}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    if (!locked) setSelectedPeriod(period);
                                }}
                                disabled={locked}
                                aria-disabled={locked}
                                tabIndex={locked ? -1 : 0}
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center ${
                                    isActive
                                        ? "bg-blue-500 text-white shadow-custom"
                                        : locked
                                            ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-80"
                                            : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <span>{label}</span>
                                {locked && (
                                    <Lock className="ml-2 h-4 w-4 text-gray-400" />
                                )}
                            </button>

                            {locked && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max opacity-0 translate-y-2 transition-all duration-150 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 z-20">
                                    <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-lg">
                                        Bu dönem yalnızca Pro aboneler için
                                        kullanılabilir
                                    </div>
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-3 h-3 rotate-45 bg-gray-900" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // sekme butonları
    const renderTabs = () => {
        const tabs = [
            {
                id: "overview",
                label: "Genel Bakış",
                icon: BarChart3,
                proOnly: false,
            },
            {
                id: "performance",
                label: "Performans",
                icon: TrendingUp,
                proOnly: true,
            },
            {
                id: "audience",
                label: "Kitle Analizi",
                icon: Users,
                proOnly: true,
            },
        ];

        return (
            <div className="flex items-center space-x-2 bg-white rounded-xl p-1.5 shadow-custom border border-gray-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const locked = tab.proOnly && !isSubscribed;
                    const isActive = activeTab === tab.id && !locked;

                    return (
                        <div
                            key={tab.id}
                            className={`relative ${locked ? "group" : ""}`}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    if (!locked) setActiveTab(tab.id);
                                }}
                                disabled={locked}
                                aria-disabled={locked}
                                tabIndex={locked ? -1 : 0}
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all
                                ${
                                    isActive
                                        ? "bg-blue-500 text-white shadow-custom"
                                        : locked
                                            ? "text-gray-400 bg-gray-50 cursor-not-allowed opacity-80"
                                            : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <Icon
                                    size={18}
                                    className={
                                        locked ? "text-gray-400" : undefined
                                    }
                                />
                                <span>{tab.label}</span>
                                {locked && (
                                    <Lock className="ml-1 h-4 w-4 text-gray-400" />
                                )}
                            </button>

                            {locked && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-max opacity-0 translate-y-2 transition-all duration-150 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 z-20">
                                    <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-lg text-center whitespace-nowrap">
                                        Bu sekme sadece Pro kullanıcılar için
                                    </div>
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-3 h-3 rotate-45 bg-gray-900" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    // === UI BLOCKS ===

    // kart grid (overview tab)
    const OverviewCards = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Toplam Görüntülenme */}
            <StatCard
                iconBg="from-blue-500 to-blue-600"
                Icon={Eye}
                trend="+12%"
                trendBg="bg-green-50"
                trendText="text-green-500"
                value={
                    loading
                        ? null
                        : (stats?.totals?.visits || 0).toLocaleString()
                }
                label="Toplam Görüntülenme"
                subLabel="Önceki döneme göre artış"
            />

            {/* Toplam Tıklama */}
            <StatCard
                iconBg="from-purple-500 to-purple-600"
                Icon={MousePointer}
                trend="+8%"
                trendBg="bg-green-50"
                trendText="text-green-500"
                value={
                    loading
                        ? null
                        : (stats?.totals?.clicks || 0).toLocaleString()
                }
                label="Toplam Tıklama"
                subLabel="Aktif kullanıcı etkileşimi"
            />

            {/* CTR */}
            <StatCard
                iconBg="from-green-500 to-green-600"
                Icon={TrendingUp}
                trend="+15%"
                trendBg="bg-green-50"
                trendText="text-green-500"
                value={loading ? null : `${calculateCTR()}%`}
                label="Tıklama Oranı (CTR)"
                subLabel="Dönüşüm performansı"
            />

            {/* Tekil Ziyaretçi */}
            <StatCard
                iconBg="from-orange-500 to-orange-600"
                Icon={Users}
                trend="Yeni"
                trendBg="bg-blue-50"
                trendText="text-blue-500"
                value={
                    loading
                        ? null
                        : (
                            stats?.totals?.unique_visitors || 0
                        ).toLocaleString()
                }
                label="Tekil Ziyaretçi"
                subLabel="Benzersiz kullanıcı sayısı"
            />
        </div>
    );

    const StatCard = ({
                          iconBg,
                          Icon,
                          trend,
                          trendBg,
                          trendText,
                          value,
                          label,
                          subLabel,
                      }) => (
        <div className="bg-white rounded-2xl p-6 shadow-custom hover:shadow-xl transition-all border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`w-12 h-12 bg-gradient-to-br ${iconBg} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                    <Icon className="text-white" size={20} />
                </div>

                <div
                    className={`flex items-center space-x-1 text-sm font-bold ${trendText} ${trendBg} px-3 py-1.5 rounded-full`}
                >
                    <ArrowUp size={16} />
                    <span>{trend}</span>
                </div>
            </div>

            <div className="space-y-2">
                {value === null ? (
                    <div className="flex items-center space-x-2 h-10">
                        <Spinner />
                    </div>
                ) : (
                    <h3 className="text-4xl font-bold text-gray-900">
                        {value}
                    </h3>
                )}

                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-xs text-gray-400">{subLabel}</p>
            </div>
        </div>
    );

    const Spinner = () => (
        <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );

    // All Links + Top Links listeleri
    const LinksSection = () => (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* All Links */}
            <div className="xl:col-span-3 bg-white rounded-2xl p-8 shadow-custom border border-gray-100">
                <SectionHeader
                    title="Tüm Linkler"
                    desc="Zaman içindeki performans"
                />

                <ScrollableList loading={loading}>
                    {formatAllLinks().length > 0 ? (
                        formatAllLinks().map((link, index) => (
                            <LinkRow
                                key={index}
                                index={index}
                                link={link}
                            />
                        ))
                    ) : (
                        <EmptyLinks />
                    )}
                </ScrollableList>
            </div>

            {/* Top Links */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-8 shadow-custom border border-gray-100">
                <SectionHeader
                    title="En Popüler Linkler"
                    desc="Tıklama sıralaması"
                />

                <ScrollableList loading={loading}>
                    {formatTopLinks().length > 0 ? (
                        formatTopLinks().map((link, index) => (
                            <LinkRow
                                key={index}
                                index={index}
                                link={link}
                            />
                        ))
                    ) : (
                        <EmptyLinks />
                    )}
                </ScrollableList>
            </div>
        </div>
    );

    const SectionHeader = ({ title, desc }) => (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </div>
        </div>
    );

    const ScrollableList = ({ loading, children }) => (
        <div className="overflow-y-auto max-h-[400px]">
            <div className="space-y-3">
                {loading ? (
                    <>
                        {[1, 2, 3].map((i) => (
                            <SkeletonRow key={i} />
                        ))}
                        <div className="flex justify-center py-4">
                            <svg
                                className="animate-spin h-6 w-6 text-blue-400"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        </div>
                    </>
                ) : (
                    children
                )}
            </div>
        </div>
    );

    const SkeletonRow = () => (
        <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 animate-pulse flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <span className="w-8 h-6 bg-gray-200 rounded" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
                <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
                    <div className="w-16 h-3 bg-gray-100 rounded" />
                </div>
            </div>
            <span className="w-12 h-6 bg-gray-200 rounded" />
        </div>
    );

    const LinkRow = ({ index, link }) => (
        <div className="p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-300 w-8">
                        {index + 1}
                    </span>
                    <div
                        className={`w-3 h-3 rounded-full ${link.color} shadow-custom`}
                    ></div>
                    <div>
                        <p className="font-bold text-gray-900">{link.name}</p>
                        <p className="text-sm font-semibold text-blue-600">
                            {(link.clicks || 0).toLocaleString()} tıklama
                        </p>
                    </div>
                </div>
                <span className="text-sm font-bold px-3 py-1 rounded-full text-blue-600 bg-blue-50">
                    {link.rate.toFixed(0)}%
                </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                    className={`h-2 rounded-full ${link.color}`}
                    style={{ width: `${link.rate}%` }}
                ></div>
            </div>
        </div>
    );

    const EmptyLinks = () => (
        <div className="text-center py-8 text-gray-500">
            <Link2 size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Henüz link verisi bulunmuyor</p>
        </div>
    );

    // performance tab ana blok
    const PerformanceTab = () => (
        <div className="space-y-6">
            {/* Chart Section */}
            <div className="bg-white rounded-2xl p-8 shadow-custom border border-gray-100">
                <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Görüntülenme Trendi
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Haftalık performans karşılaştırması
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <LegendDot colorClass="bg-blue-500" label="Görüntülenme" />
                        <LegendDot colorClass="bg-purple-500" label="Tıklama" />
                    </div>
                </div>

                <StatsChart stats={stats} loading={loading} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Device Stats */}
                <DeviceCard />

                {/* Location Stats */}
                <LocationCard />
            </div>
        </div>
    );

    const LegendDot = ({ colorClass, label }) => (
        <div className="flex items-center space-x-2">
            <div
                className={`w-4 h-4 ${colorClass} rounded-full shadow-custom`}
            ></div>
            <span className="text-sm text-gray-600 font-medium">{label}</span>
        </div>
    );

    const DeviceCard = () => {
        const devices = formatDeviceData();
        return (
            <div className="bg-white rounded-2xl p-8 shadow-custom border border-gray-100">
                <CardHeader
                    iconBg="bg-blue-100"
                    Icon={Smartphone}
                    iconColor="text-blue-600"
                    title="Cihaz Dağılımı"
                    desc="Platform bazlı analiz"
                />

                <div className="space-y-6">
                    {devices.length > 0 ? (
                        devices.map((device, index) => (
                            <DeviceRow device={device} key={index} />
                        ))
                    ) : (
                        <EmptyDevice />
                    )}
                </div>
            </div>
        );
    };

    const CardHeader = ({ iconBg, Icon, iconColor, title, desc }) => (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
                <div
                    className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}
                >
                    <Icon className={iconColor} size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h2>
                    <p className="text-sm text-gray-500">{desc}</p>
                </div>
            </div>
        </div>
    );

    const DeviceRow = ({ device }) => (
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    {device.name === "Desktop" && (
                        <Monitor className="text-blue-500" size={20} />
                    )}
                    {device.name === "Mobile" && (
                        <Smartphone className="text-purple-500" size={20} />
                    )}
                    {device.name === "Tablet" && (
                        <Monitor className="text-green-500" size={20} />
                    )}
                    <span className="text-base font-semibold text-gray-700">
                        {device.name}
                    </span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                    {device.percentage}%
                </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full shadow-custom"
                    style={{
                        width: `${device.percentage}%`,
                    }}
                ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                {device.visits} ziyaret
            </p>
        </div>
    );

    const EmptyDevice = () => (
        <div className="text-center py-8 text-gray-500">
            <Monitor size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Cihaz verisi bulunmuyor</p>
        </div>
    );

    const LocationCard = () => {
        const locations = formatLocationData();
        return (
            <div className="bg-white rounded-2xl p-8 shadow-custom border border-gray-100">
                <CardHeader
                    iconBg="bg-green-100"
                    Icon={MapPin}
                    iconColor="text-green-600"
                    title="Popüler Konumlar"
                    desc="Coğrafi dağılım"
                />

                <div className="space-y-4">
                    {locations.length > 0 ? (
                        locations.map((location, index) => (
                            <LocationRow
                                location={location}
                                key={index}
                            />
                        ))
                    ) : (
                        <EmptyLocation />
                    )}
                </div>
            </div>
        );
    };

    const LocationRow = ({ location }) => (
        <div className="p-4 rounded-xl hover:bg-gray-50 transition-all border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">{location.flag}</span>
                    <div>
                        <p className="font-bold text-gray-900">
                            {location.country}
                        </p>
                        <p className="text-xs text-gray-500">
                            {location.visits.toLocaleString()} ziyaret
                        </p>
                    </div>
                </div>
                <span className="text-xl font-bold text-gray-900">
                    {location.percentage}%
                </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full shadow-custom"
                    style={{
                        width: `${location.percentage}%`,
                    }}
                ></div>
            </div>
        </div>
    );

    const EmptyLocation = () => (
        <div className="text-center py-8 text-gray-500">
            <Globe size={48} className="mx-auto mb-4 text-gray-300" />
            <p>Lokasyon verisi bulunmuyor</p>
        </div>
    );

    // audience tab
    const AudienceTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-custom border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Users className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Ziyaretçi Analizi
                            </h2>
                            <p className="text-sm text-gray-500">
                                Yeni vs Geri dönen kullanıcılar
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AudienceStatBox
                        bgFrom="from-blue-50"
                        bgTo="to-blue-100"
                        color="text-blue-600"
                        title="Tekil Ziyaretçi"
                        value={
                            stats?.totals?.unique_visitors
                                ? stats.totals.unique_visitors
                                : 0
                        }
                        hint="Benzersiz kullanıcılar"
                    />

                    <AudienceStatBox
                        bgFrom="from-green-50"
                        bgTo="to-green-100"
                        color="text-green-600"
                        title="Geri Dönen"
                        value={
                            stats?.totals?.returning_visits
                                ? stats.totals.returning_visits
                                : 0
                        }
                        hint="Tekrar ziyaret eden"
                    />

                    <AudienceStatBox
                        bgFrom="from-purple-50"
                        bgTo="to-purple-100"
                        color="text-purple-600"
                        title="Yeni Ziyaretçi"
                        value={
                            stats?.totals?.visits
                                ? (stats.totals.visits || 0) -
                                (stats.totals.returning_visits || 0)
                                : 0
                        }
                        hint="İlk kez ziyaret eden"
                    />
                </div>
            </div>
        </div>
    );

    const AudienceStatBox = ({
                                 bgFrom,
                                 bgTo,
                                 color,
                                 title,
                                 value,
                                 hint,
                             }) => (
        <div
            className={`text-center p-6 bg-gradient-to-br ${bgFrom} ${bgTo} rounded-xl`}
        >
            <div
                className={`text-3xl font-bold ${color} mb-2`}
            >
                {value}
            </div>
            <div
                className={`text-sm font-medium ${color.replace(
                    "600",
                    "700"
                )}`}
            >
                {title}
            </div>
            <div
                className={`text-xs mt-1 ${color.replace(
                    "600",
                    "500"
                )}`}
            >
                {hint}
            </div>
        </div>
    );

    // ---- render ----
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e4e8f0]">
            <main className="mx-auto px-6 py-8 space-y-6">
                {/* Top Navigation Bar */}
                <nav className="bg-white rounded-lg border-gray-200 sticky top-0 z-50 shadow-custom border">
                    <div className="mx-auto px-6 py-4">
                        <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
                            {/* Logo / brand */}
                            <h1 className="text-3xl font-bold font-handwritten text-blue-600">
                                Shortier
                            </h1>

                            {/* range info */}
                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Detaylı performans analizi
                                        {stats?.range?.start &&
                                            stats?.range?.end && (
                                                <span className="ml-2 text-blue-600">
                                                    (
                                                    {new Date(
                                                        stats.range.start
                                                    ).toLocaleDateString(
                                                        "tr-TR"
                                                    )}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        stats.range.end
                                                    ).toLocaleDateString(
                                                        "tr-TR"
                                                    )}
                                                    )
                                                </span>
                                            )}
                                    </p>
                                </div>
                            </div>

                            {/* actions */}
                            <div className="flex md:items-center space-x-3">
                                <button
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
                                >
                                    <RefreshCw
                                        size={18}
                                        className={
                                            loading ? "animate-spin" : ""
                                        }
                                    />
                                    <span className="text-sm font-medium">
                                        Yenile
                                    </span>
                                </button>

                                {/* Pro kontrolü */}
                                {isSubscribed ? (
                                    <ShortierReportExporter stats={stats} user={user} />
                                ) : (
                                    <NavLink
                                        to="/pricing"
                                        title="Bu özellik yalnızca Pro kullanıcılar için"
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 rounded-lg transition-all"
                                        aria-disabled={true}
                                    >
                                        <Lock size={18} />
                                        <span className="text-sm font-medium">Rapor İndir</span>
                                    </NavLink>
                                )}

                                <button className="flex hidden items-center space-x-2 px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-all">
                                    <Share2 size={18} />
                                    <span className="text-sm font-medium">
                                        Paylaş
                                    </span>
                                </button>

                                <NavLink
                                    to="/"
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-all font-medium"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Geri</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Period Selector & Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    {renderPeriodButtons()}
                    {renderTabs()}
                </div>

                {/* Tabs content */}
                {activeTab === "overview" && (
                    <>
                        <OverviewCards />
                        <LinksSection />
                    </>
                )}

                {activeTab === "performance" && <PerformanceTab />}

                {activeTab === "audience" && <AudienceTab />}
            </main>
        </div>
    );
}
