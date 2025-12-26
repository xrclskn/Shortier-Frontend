import { X, Link as LinkIcon, House, User, Palette, BarChart3, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function MobileSidebar({ open, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex md:hidden pointer-events-none">
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
                <nav className="flex flex-col gap-2">
                    <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#efefef] font-medium text-[#010101]" onClick={onClose}>
                        <House className="w-5 h-5" />
                        Dashboard
                    </NavLink>
                    <NavLink to="/profile-designer" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#efefef] font-medium text-[#010101]" onClick={onClose}>
                        <User className="w-5 h-5" />
                        Profil
                    </NavLink>
                    <NavLink to="/account" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#efefef] font-medium text-[#010101]" onClick={onClose}>
                        <Palette className="w-5 h-5" />
                        Hesap Ayarları
                    </NavLink>
                    <NavLink to="/analytics" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#efefef] font-medium text-[#010101]" onClick={onClose}>
                        <BarChart3 className="w-5 h-5" />
                        İstatistikler
                    </NavLink>
                </nav>

                {/* PROFİL ve ÇIKIŞ */}
                <div className="mt-auto pt-10 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="Profil"
                            className="w-9 h-9 rounded-full border border-indigo-100"
                        />
                        <div>
                            <div className="text-[#010101] font-bold text-base">Ahmet</div>
                            <div className="text-xs text-gray-500">ahmet@shortier.com</div>
                        </div>
                    </div>
                    <button
                        className="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-[#efefef] text-[#010101] font-semibold transition"
                        onClick={() => alert("Çıkış yapılıyor...")}
                    >
                        <LogOut className="w-5 h-5" /> Çıkış Yap
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
