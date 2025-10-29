import { NavLink } from "react-router-dom";
import {House, User, Link2 as LinkIcon, Palette, Globe, Lock, Crown, UserCog, Power, BarChart3} from "lucide-react";
import React from "react";
import {useAuth} from "@/context/AuthContext.jsx";

const item = "flex items-center space-x-2 p-3 rounded-md transition";
const active = "text-blue-800 bg-blue-100 ";
const idle = "text-black hover:text-white hover:bg-blue-600";

function SLink({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `nav-item ${item} ${isActive ? active : idle}`
            }
        >
            <div className=" flex items-center justify-center">
                <Icon className="w-5 h-5 " />
            </div>
            <span className="font-normal text-md">{label}</span>
        </NavLink>
    );
}

export default function Sidebar() {

    const { logout } = useAuth();

    const handleLogout = () => {
        // Tıklayınca bi alert ile onay alalım sonra çıkış yapsın
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            logout();
        }
    };

    return (
        <nav className="rounded-lg p-6 sticky top-6 shadow-custom bg-white min-h-[90vh] mb-6">

            <div>
                <div className="flex items-center space-x-1 mb-6 ">
                    <div className="w-10 h-10 rounded-xl p-0.5">
                        <div className="w-full h-full bg-[#4361ee] rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                 stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                 className="lucide lucide-link-icon lucide-link">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-handwritten text-[#4361ee]">Shortier</h1>
                    </div>
                </div>

                <div className="space-y-2">
                    <SLink to="/" icon={House} label="Dashboard"/>
                    <SLink to="/profile-designer" icon={User} label="Profil"/>
                    <div className="relative inline-block group w-full">
                        <a
                            role="button"
                            aria-disabled="true"
                            tabIndex={-1}
                            className="nav-item flex items-center justify-between p-3 rounded-md transition  text-black bg-gray-50 opacity-80 cursor-not-allowed pointer-events-none"
                            data-discover="true"
                            title="Yakında gelecek"
                        >
                            <div className="flex items-center">
                                <div className="flex items-center justify-center mr-3">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                </div>
                                <span className="font-normal text-sm text-gray-500">Kişisel Website Oluşturucu</span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Lock className="h-4 w-4 text-gray-500" />
                            </div>
                        </a>

                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-max opacity-0 transform translate-y-2 transition-all duration-150 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0">
                            <div className="bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-lg">
                                Çok yakında!
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-3 h-3 rotate-45 bg-gray-800" />
                        </div>
                    </div>

                    {/*<SLink to="/profile" icon={User} label="Profil" />*/}
                    <SLink to="/account" icon={UserCog} label="Hesap Ayarları"/>
                    <SLink to="/analytics" icon={BarChart3} label="İstatistikler"/>
                    <SLink to="/subscription" icon={Crown} label="Abonelik"/>



                </div>

            </div>

            {/* Quick Stats */}
            <div
                className="mt-8 absolute bottom-5 right-5 left-5 rounded-lg bg-blue-50 hover:bg-blue-100  transition-all">
                <div className="text-blue-600 font-medium  cursor-pointer">
                    <button type="button" onClick={handleLogout}
                            className="flex  p-4 items-center w-full space-x-2 cursor-pointer">
                        <Power className="w-5 h-5"/>
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
