import { X, Link as LinkIcon, House, User, Palette, BarChart3, LogOut, Link2, QrCode, UserCog, Crown, Power } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

export default function MobileSidebar({ open, onClose }) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            logout();
            onClose();
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex md:hidden pointer-events-none ${open ? "z-50" : "z-[-1]"}`}>
            {/* Sidebar kutusu */}
            <div
                className={`
          w-64 h-full bg-white shadow-xl p-4 flex flex-col relative
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          pointer-events-auto
        `}
            >
                {/* Kapat butonu */}
                <button
                    className="absolute top-3 right-3 p-1 border rounded-lg border-[#010101] text-[#010101] hover:bg-[#efefef]"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* LOGO */}
                <div className="flex items-center gap-2 mb-6 mt-2">
                    <div className="w-10 h-10 rounded-xl bg-[#efefef] flex items-center justify-center shadow">
                        <LinkIcon size={24} color="#010101" strokeWidth={2.5} />
                    </div>
                    <span className="font-medium font-handwritten text-xl tracking-wider text-[#010101] font-[cursive]">Shortier</span>
                </div>

                {/* MENÜ */}
                <nav className="flex flex-col gap-2 overflow-y-auto">
                    <NavLink to="/app" end className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium ${isActive ? 'bg-[#010101] text-white' : 'text-[#010101] hover:bg-[#efefef]'}`} onClick={onClose}>
                        <House className="w-5 h-5" />
                        Anasayfa
                    </NavLink>
                    <NavLink to="/app/short-urls" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium ${isActive ? 'bg-[#010101] text-white' : 'text-[#010101] hover:bg-[#efefef]'}`} onClick={onClose}>
                        <Link2 className="w-5 h-5" />
                        Link Kısalt
                    </NavLink>
                    <NavLink to="/app/biography" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium ${isActive ? 'bg-[#010101] text-white' : 'text-[#010101] hover:bg-[#efefef]'}`} onClick={onClose}>
                        <User className="w-5 h-5" />
                        Biyografi Tasarla
                    </NavLink>
                    <NavLink to="/app/qr-codes" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium ${isActive ? 'bg-[#010101] text-white' : 'text-[#010101] hover:bg-[#efefef]'}`} onClick={onClose}>
                        <QrCode className="w-5 h-5" />
                        QR Kodlarım
                    </NavLink>
                    <NavLink to="/app/analytics" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium ${isActive ? 'bg-[#010101] text-white' : 'text-[#010101] hover:bg-[#efefef]'}`} onClick={onClose}>
                        <BarChart3 className="w-5 h-5" />
                        İstatistikler
                    </NavLink>
                    <NavLink to="/app/account" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium ${isActive ? 'bg-[#010101] text-white' : 'text-[#010101] hover:bg-[#efefef]'}`} onClick={onClose}>
                        <UserCog className="w-5 h-5" />
                        Hesap Ayarları
                    </NavLink>
                    <NavLink to="/app/subscription" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded font-medium ${isActive ? 'bg-[#010101] text-white' : 'text-[#010101] hover:bg-[#efefef]'}`} onClick={onClose}>
                        <Crown className="w-5 h-5" />
                        Abonelik
                    </NavLink>
                </nav>

                {/* PROFİL ve ÇIKIŞ */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    {user && (
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src={user.avatar_url || user.photo || "https://ui-avatars.com/api/?name=" + (user.full_name || user.username)}
                                alt="Profil"
                                className="w-9 h-9 rounded-full border border-indigo-100 object-cover"
                            />
                            <div className="overflow-hidden">
                                <div className="text-[#010101] font-bold text-base truncate">{user.full_name || user.username}</div>
                                <div className="text-xs text-gray-500 truncate">{user.email}</div>
                            </div>
                        </div>
                    )}
                    <button
                        className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-[#efefef] text-[#010101] font-semibold transition"
                        onClick={handleLogout}
                    >
                        <Power className="w-5 h-5" /> Çıkış Yap
                    </button>
                </div>
            </div>
            {/* Overlay */}
            <div
                className={`
          flex-1 bg-black/30
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
                onClick={onClose}
            ></div>
        </div>
    );
}
