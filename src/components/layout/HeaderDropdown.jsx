import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import useDashboardData from "@/hooks/useDashboardData"; // Yeni!
import { getImageUrl } from "@/utils/themeHelpers";

export default function HeaderDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Dashboard query (hem header, hem dashboard sayfası kullanabilir)
    const { data, isLoading } = useDashboardData();

    // Dropdown dışına tıklama
    useEffect(() => {
        const close = (e) => {
            if (open && ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        window.addEventListener("mousedown", close);
        return () => window.removeEventListener("mousedown", close);
    }, [open]);

    // Çıkış yap fonksiyonu
    const handleLogout = async () => {
        setOpen(false);
        await logout();
        navigate("/login");
    };

    // Profil fotoğrafı, isim veya initial render
    const renderAvatar = () => {
        if (isLoading) {
            return (
                <div className="w-8 h-8 rounded-2xl bg-white/30 animate-pulse"></div>
            );
        }
        if (data?.photo) {
            return (
                <img
                    src={getImageUrl(data.photo)}
                    alt="Profile"
                    className="w-8 h-8 rounded-2xl object-cover border-2 border-white/20"
                />
            );
        }
        if (data?.name) {
            return (
                <div className="w-8 h-8 rounded-2xl bg-[#efefef] flex items-center justify-center border-2 border-white/20">
                    <span className="text-[#010101] font-semibold text-sm">
                        {data.name.charAt(0).toUpperCase()}
                    </span>
                </div>
            );
        }
        // Hiçbir şey yoksa default icon
        return (
            <div className="w-8 h-8 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/20">
                <User className="w-4 h-4 text-white" />
            </div>
        );
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center space-x-3 rounded-lg p-3 text-white bg-[#010101] hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
                {renderAvatar()}

                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                            {renderAvatar()}
                            <div>
                                <p className="font-medium text-gray-900 text-sm">
                                    @{data?.name?.split(' ')[0] || "Kullanıcı"}
                                </p>
                                <p className="text-xs text-gray-500">Kullanıcı Hesabı</p>
                            </div>
                        </div>
                    </div>
                    {/* Menu Items */}
                    <div className="py-1">
                        <button
                            onClick={() => {
                                setOpen(false);
                                navigate("/profile-designer");
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2"
                        >
                            <User className="w-4 h-4" />
                            <span>Profilim</span>
                        </button>
                        <button
                            onClick={() => {
                                setOpen(false);
                                navigate("/settings");
                            }}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Ayarlar</span>
                        </button>
                    </div>
                    {/* Logout Button */}
                    <div className="border-t border-gray-100 pt-1">
                        <button
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center space-x-2"
                            onClick={handleLogout}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
