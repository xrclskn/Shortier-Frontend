import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useLinks } from "@/context/LinksContext.jsx";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from "chart.js";
import { ExternalLink, Loader2, Instagram, Link2, Youtube, Twitter } from "lucide-react";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ICON_MAP = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    link: Link2,
};

export default function LinkDetail() {
    const { id } = useParams();
    const { getLinkById, updateLink } = useLinks();
    const [linkData, setLinkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dummy chart verisi
    const chartData = {
        labels: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran"],
        datasets: [
            {
                label: "Tıklamalar",
                data: [15, 28, 17, 35, 42, 25],
                borderColor: "rgba(59, 130, 246, 1)",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                fill: true,
                tension: 0.4,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: false },
        },
        scales: {
            x: { title: { display: true, text: "Aylar" } },
            y: { title: { display: true, text: "Tıklama" }, beginAtZero: true },
        },
    };

    useEffect(() => {
        const fetchLinkData = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getLinkById(id);
                setLinkData(data);
            } catch (err) {
                setError("Link verisi alınırken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };
        fetchLinkData();
    }, [id]);

    // Switch toggle
    const handleToggleActive = async () => {
        if (!linkData) return;
        try {
            const updatedData = { ...linkData, is_active: linkData.is_active === 1 ? 0 : 1 };
            await updateLink(linkData.id, updatedData);
            setLinkData(updatedData);
        } catch (err) {
            setError("Link durumu güncellenirken bir hata oluştu.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Loader2 className="animate-spin mr-2" /> Yükleniyor...
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-6 bg-red-50 rounded-lg text-red-700 border border-red-200">
                {error}
            </div>
        );
    }
    if (!linkData) {
        return (
            <div className="p-6 bg-gray-50 rounded-lg text-gray-700">
                Veri bulunamadı.
            </div>
        );
    }

    // settings parse
    let settings = {};
    try {
        settings = typeof linkData.settings === "string" ? JSON.parse(linkData.settings) : (linkData.settings || {});
    } catch (e) {
        settings = {};
    }
    const iconBg = settings.iconBg || "#fff";
    const iconColor = settings.iconColor || "#333";
    const borderColor = settings.color || "#1e40af";
    const IconComp = ICON_MAP[linkData.icon] || Link2;

    return (
        <div className="w-full p-0 sm:p-10 bg-white shadow rounded-2xl relative">
            {/* Üst sağ köşe: Tüm Linklere Dön */}
            <div className="absolute right-6 top-6">
                <RouterLink
                    to="/links"
                    className="inline-flex px-5 py-3 rounded-lg bg-blue-600 text-white border items-center text-sm gap-1 "
                >
                    <span><FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon> Geri Dön</span>
                </RouterLink>
            </div>

            {/* Başlık & icon */}
            <div className="flex items-center gap-4 mb-6">
                <span
                    className="rounded-lg w-16 h-16 flex items-center justify-center text-4xl shadow border-2"
                    style={{ background: iconBg, color: iconColor, borderColor }}
                >
                    <IconComp size={36} />
                </span>
                <div>
                    <h2 className="text-2xl font-semibold text-blue-600">{linkData.label}</h2>
                    <a
                        href={linkData.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-500 hover:underline text-xs"
                    >
                        Orijinal Linki Aç <ExternalLink size={14} />
                    </a>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                        Kısa URL: <span className="font-mono bg-gray-100 px-2 rounded">{linkData.short_url}</span>
                    </div>
                </div>
            </div>

            {/* Info alanları */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Oluşturulma Tarihi</div>
                    <div className="font-mono text-sm text-gray-800">
                        {new Date(linkData.created_at).toLocaleString("tr-TR")}
                    </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Güncellenme</div>
                    <div className="font-mono text-sm text-gray-800">
                        {new Date(linkData.updated_at).toLocaleString("tr-TR")}
                    </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-xs text-gray-500 mb-1">Durum</div>
                    {/* Switch toggle */}
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={linkData.is_active === 1}
                            onChange={handleToggleActive}
                        />
                        <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all duration-300 relative">
                            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow peer-checked:translate-x-5 transition-all duration-300"></div>
                        </div>
                        <span className={`ml-2 text-xs font-bold ${linkData.is_active === 1 ? "text-green-600" : "text-gray-400"}`}>
                            {linkData.is_active === 1 ? "Aktif" : "Pasif"}
                        </span>
                    </label>
                </div>
            </div>

            {/* Grafik */}
            <div className="p-2 sm:p-6">
                <h3 className="text-lg font-bold text-blue-600 mb-4">Tıklama Grafiği</h3>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}
