import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faQrcode, faTrash, faCopy, faChartBar, faPen } from "@fortawesome/free-solid-svg-icons";
import { MousePointer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/utils/toast";
import config from "@/config";

export default function ShortLinkCard({ id, title, shortCode, originalUrl, clickCount, isActive, onDelete, onToggle, onEdit }) {

    const navigate = useNavigate();
    const [toggling, setToggling] = useState(false);

    const handleDelete = () => {
        onDelete(id);
    };

    const handleToggle = async () => {
        if (toggling) return;
        setToggling(true);
        try {
            await onToggle(id, isActive);
        } finally {
            setToggling(false);
        }
    };

    const handleCopy = () => {
        const fullUrl = `${config.REDIRECT_BASE_URL}/${shortCode}`;
        navigator.clipboard.writeText(fullUrl);
        toast.info("Link kopyalandı!");
    }

    return (
        <div className={`rounded-xl p-4 sm:p-5 border transition-all duration-200 group ${isActive ? 'bg-white border-gray-200 hover:border-black ' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
            <div className="flex items-center justify-between gap-4">

                {/* Left Side: Icon & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">

                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                        <FontAwesomeIcon
                            fontSize={24}
                            icon={faGlobe}
                            className={isActive ? 'text-white' : 'text-gray-500'}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className={`font-bold text-base sm:text-lg truncate ${isActive ? 'text-gray-900' : 'text-gray-500 line-through'}`}>{title || shortCode}</h3>
                            {!isActive && <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Pasif</span>}
                        </div>

                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                            <span className="font-mono text-gray-900 bg-gray-100 px-1.5 rounded border border-gray-200">{config.SHORT_LINK_DOMAIN}/{shortCode}</span>
                            <span className="text-gray-300">•</span>
                            <a href={originalUrl} target="_blank" rel="noopener noreferrer" className="truncate hover:text-black hover:underline max-w-[150px] sm:max-w-[200px]" title={originalUrl}>{originalUrl}</a>
                        </div>


                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <MousePointer size={12} />
                                <span>{clickCount} tıklama</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                    {/* Status Toggle */}
                    <button
                        onClick={handleToggle}
                        disabled={toggling}
                        className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${isActive ? 'bg-black' : 'bg-gray-300'}`}
                        title={isActive ? 'Linki Gizle' : 'Linki Yayınla'}
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isActive ? 'left-6' : 'left-1'}`} />
                    </button>

                    <div className="w-px h-8 bg-gray-200 mx-1 hidden sm:block"></div>

                    <button
                        onClick={handleCopy}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Kopyala"
                    >
                        <FontAwesomeIcon icon={faCopy} className="text-lg" />
                    </button>

                    <button
                        onClick={() => onEdit({ id, title, originalUrl, shortCode })}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Düzenle"
                    >
                        <FontAwesomeIcon icon={faPen} className="text-lg" />
                    </button>

                    <button
                        onClick={() => navigate(`/app/qr-designer?url=${config.REDIRECT_BASE_URL}/${shortCode}&type=short_url&id=${id}`)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="QR Kod Oluştur"
                    >
                        <FontAwesomeIcon icon={faQrcode} className="text-lg" />
                    </button>

                    <button
                        onClick={() => navigate(`/app/analytics/short_url/${id}`)}
                        className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="İstatistikler"
                    >
                        <FontAwesomeIcon icon={faChartBar} className="text-lg" />
                    </button>

                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sil"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
}
