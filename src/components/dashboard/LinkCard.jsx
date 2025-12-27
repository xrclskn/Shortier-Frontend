import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTwitter, faLinkedin, faGithub, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { faEdit, faGlobe, faLink, faTrash, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { buttonColors, iconOptions } from "@/components/profileEditor/Constants.js";
import { MousePointer, ChartLine } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLinks } from "@/context/LinksContext.jsx";
import { toast } from "@/utils/toast";
import { useState } from "react";

export default function LinkCard({ id, iconBg, icon, color, title, url, clicks, growth, isActive }) {

    const { deleteLink, toggleLinkStatus } = useLinks();
    const navigate = useNavigate();
    const [toggling, setToggling] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Bu linki silmek istediğinize emin misiniz?")) return;
        const success = await deleteLink(id);
        if (success) {
            toast.success('Başarıyla Silindi');
        }
    };

    const handleToggle = async () => {
        if (toggling) return;
        setToggling(true);
        try {
            await toggleLinkStatus(id, isActive);
            // toast.success(isActive ? 'Link gizlendi' : 'Link görünür yapıldı');
        } finally {
            setToggling(false);
        }
    };

    return (
        <div className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 group ${isActive ? 'bg-white border-gray-100 hover:border-gray-300 ' : 'bg-gray-50 border-gray-200 opacity-80'}`}>
            <div className="flex items-center justify-between gap-4">

                {/* Left Side: Icon & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="text-gray-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                        <i className="fas fa-grip-vertical" />
                    </div>

                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-colors ${isActive ? (buttonColors.find(x => x.name === iconBg?.iconBg)?.bg || 'bg-gray-100') : 'bg-gray-200 grayscale'}`}>
                        <FontAwesomeIcon
                            fontSize={24}
                            icon={iconOptions.find(x => x.name === icon)?.icon || faLink}
                            className={`${isActive ? 'text-gray-700' : 'text-gray-500'}`}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className={`font-bold text-base sm:text-lg truncate ${isActive ? 'text-gray-900' : 'text-gray-500 line-through'}`}>{title || 'İsimsiz Link'}</h3>
                            {!isActive && <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">Pasif</span>}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 truncate hover:text-blue-500 transition-colors">
                            <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                        </p>

                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                                <MousePointer size={12} />
                                <span>{clicks} tıklama</span>
                            </div>
                            {growth && (
                                <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100">
                                    <ChartLine size={12} />
                                    <span>{growth}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                    {/* Status Toggle */}
                    <button
                        onClick={handleToggle}
                        disabled={toggling}
                        className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        title={isActive ? 'Linki Gizle' : 'Linki Yayınla'}
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isActive ? 'left-6' : 'left-1'}`} />
                    </button>

                    <div className="w-px h-8 bg-gray-200 mx-1 hidden sm:block"></div>

                    <button
                        onClick={() => navigate(`/app/qr-designer?url=${encodeURIComponent(url)}&type=profile_link&id=${id}`)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="QR Kod Oluştur"
                    >
                        <FontAwesomeIcon icon={faQrcode} className="text-lg" />
                    </button>

                    <NavLink to={`/app/analytics/profile_link/${id}`}>
                        <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="İstatistikler & Düzenle"
                        >
                            <FontAwesomeIcon icon={faEdit} className="text-lg" />
                        </button>
                    </NavLink>

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
