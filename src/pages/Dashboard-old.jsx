import React from "react";
import StatsCard from "@/components/StatsCard";
import {Plus, UserCog, Palette, User, Instagram, MousePointer, Link2, BarChart3, Eye} from "lucide-react";
import { useUser } from "@/context/UserContext";
import {NavLink} from "react-router-dom";

export default function DashboardOld() {
    const { username, photo, isLoading } = useUser();

    // actions içinde profili görüntüle butonu ekliycez ama bu butonun linki username'e göre değişecek
    const actions = [
        { c1: "from-blue-500 to-blue-600", icon: Plus, title: "Yeni Link", link:"profile", sub: "Link ekle", target: "_blank" },
        { c1: "from-purple-500 to-purple-600", icon: UserCog, title: "Profil Düzenle", link:"profile" , sub: "Bilgileri güncelle", target:"_blank" },
        { c1: "from-pink-500 to-pink-600", icon: Eye, title: "Profili Görüntüle", link: username ? `/${username}` : "#", sub: "Profilini ziyaret et", target:"_blank" },
    ];

    const activities = [
        { c: "from-pink-500 to-pink-600", icon: Instagram, t: "Instagram linki tıklandı", s: "2 dakika önce", r: "+1", rc: "text-green-400" },
        { c: "from-green-500 to-green-600", icon: Plus, t: "Yeni link eklendi", s: "1 saat önce", r: "Yeni", rc: "text-blue-400" },
        { c: "from-purple-500 to-purple-600", icon: Palette, t: "Tema değiştirildi", s: "3 saat önce", r: "Güncellendi", rc: "text-purple-400" },
    ];

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            {isLoading ? (
                /* Loading State */
                <div className="rounded-lg bg-gradient-to-br from-blue-400 to-indigo-800 p-6 shadow-custom animate-pulse">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center overflow-hidden justify-center border-3 mx-auto mb-4 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                            <div className="w-20 h-20 bg-gray-300/50 animate-pulse rounded-2xl"></div>
                        </div>
                        <div className="h-8 bg-white/30 rounded w-64 mx-auto mb-2 animate-pulse"></div>
                        <div className="h-4 bg-white/20 rounded w-80 mx-auto animate-pulse"></div>
                    </div>

                    {/* Loading Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {actions.map((a, i) => (
                            <div
                                key={i}
                                className="rounded-xl p-4 bg-white/40 border border-white/20"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${a.c1} flex items-center justify-center opacity-50`}>
                                        <div className="w-5 h-5 bg-white/50 rounded animate-pulse"></div>
                                    </div>
                                    <div className="text-left flex-1">
                                        <div className="h-4 bg-white/50 rounded w-20 mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-white/30 rounded w-16 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Loaded State */
                <div className="rounded-lg bg-gradient-to-br from-blue-400 to-indigo-800 p-6 shadow-custom">
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-[#667eea] to-[#764ba2] flex items-center overflow-hidden justify-center border-3 mx-auto mb-4 shadow-[0_0_30px_rgba(0,0,0,0.2)]">
                            {photo ? (
                                <img src={photo} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Hoş geldin, <span className="">@{username || "Kullanıcı"}</span> 👋
                        </h1>
                        <p className="text-white/90">
                            Biyografi sayfanı yönet ve performansını takip et. Yeni linkler ekle, istatistikleri incele ve profilinizi geliştir.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {actions.map((a, i) => {
                            const Icon = a.icon;
                            return (
                                <NavLink to={a.link || "#"}
                                    target={a.target || "_self"}
                                    key={i}
                                    className="rounded-xl p-4 bg-white/40 border border-white/20 hover:bg-white/50 transition-all duration-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${a.c1} flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-white font-medium">{a.title}</p>
                                            <p className="text-white/70 text-sm">{a.sub}</p>
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
                    icon={MousePointer}
                    delta="+12%"
                    value="1234"
                    label="Toplam Tıklama"
                />
                <StatsCard
                    iconBg="bg-gradient-to-r from-purple-500 to-purple-600"
                    icon={Link2}
                    delta="+2"
                    value="8"
                    label="Aktif Link"
                />
                <StatsCard
                    iconBg="bg-gradient-to-r from-green-500 to-green-600"
                    icon={User}
                    delta="+8%"
                    value="567"
                    label="Profil Görüntüleme"
                />
                <StatsCard
                    iconBg="bg-gradient-to-r from-yellow-500 to-yellow-600"
                    icon={BarChart3}
                    value="4.2%"
                    label="Tıklama Oranı"
                />
            </div>

            {/* Son Aktiviteler */}
            <div className="rounded-xl p-6 bg-white shadow-custom">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h3>
                <div className="space-y-4">
                    {activities.map((activity, i) => {
                        const Icon = activity.icon;
                        return (
                            <div
                                key={i}
                                className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${activity.c} flex items-center justify-center shadow-md`}>
                                    <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{activity.t}</p>
                                    <p className="text-sm text-gray-500">{activity.s}</p>
                                </div>
                                <div className={`${activity.rc} font-semibold text-sm`}>
                                    {activity.r}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}