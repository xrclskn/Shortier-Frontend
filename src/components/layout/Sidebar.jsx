import { NavLink } from "react-router-dom";
import { User, Link2 as LinkIcon, BarChart2, Crown, House, UserCog, Power, QrCode } from "lucide-react";
import React from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import ProfileSwitcher from "./ProfileSwitcher";

const item = "flex items-center space-x-2 p-3 rounded-md transition";
const active = "text-white bg-[#010101] ";
const idle = "text-[#010101] hover:bg-[#efefef]";

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
                        <div className="w-full h-full bg-[#010101] rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-link-icon lucide-link">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-handwritten text-[#010101]">Shortier</h1>
                    </div>
                </div>

                {/* Profile Switcher */}
                <ProfileSwitcher className="mb-6 md:hidden" />

                <div className="space-y-2">
                    <SLink to="/" icon={House} label="Anasayfa" />
                    <SLink to="/short-urls" icon={LinkIcon} label="Link Kısalt" />
                    <SLink to="/biography" icon={User} label="Biyografi Tasarla" />
                    <SLink to="/qr-codes" icon={QrCode} label="QR Kodlarım" />
                    <SLink to="/analytics" icon={BarChart2} label="İstatistikler" />
                    <SLink to="/account" icon={UserCog} label="Hesap Ayarları" />
                    <SLink to="/subscription" icon={Crown} label="Abonelik" />

                </div>

            </div>

            {/* Quick Stats */}
            <div
                className="mt-8 absolute bottom-5 right-5 left-5 rounded-lg bg-[#efefef] hover:bg-gray-200 transition-all">
                <div className="text-[#010101] font-medium cursor-pointer">
                    <button type="button" onClick={handleLogout}
                        className="flex  p-4 items-center w-full space-x-2 cursor-pointer">
                        <Power className="w-5 h-5" />
                        <span>Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
