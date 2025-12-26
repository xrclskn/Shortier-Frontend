import React from "react";
import apiClient from "@/api/client.js";

export default function ShortierReportExporter({ stats, user }) {
    const handleDownload = async () => {
        try {
            // İstek atarken responseType = 'blob' dememiz şart
            // yoksa axios binary pdf'i JSON sanıp bozuyor.
            const response = await apiClient.post(
                "/api/reports/insight",
                {
                    stats,
                    period: stats?.period,
                },
                {
                    responseType: "blob",
                    headers: {
                        Accept: "application/pdf",
                        "Content-Type": "application/json",
                    },
                }
            );

            // Blob'tan indirilebilir URL oluştur
            const blob = new Blob([response.data], {
                type: "application/pdf",
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            // Dosya adı hazırlama
            const safeName = (user?.name || "shortier-report")
                .replace(/[^a-zA-Z0-9]/g, "-")
                .toLowerCase();
            const periodName = stats?.period || "report";

            a.href = url;
            a.download = `shortier-insight-${periodName}-${safeName}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Temizlik
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Rapor indirilemedi:", err);
            // burada istersen toast koyarsın
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md active:scale-[0.99] transition"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16"
                />
            </svg>
            <span>Raporu İndir</span>
        </button>
    );
}
