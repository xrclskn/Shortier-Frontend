import { Menu } from "lucide-react";

export default function HamburgerButton({ onClick }) {
    return (
        <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg bg-white shadow border border-slate-200 hover:bg-blue-50 transition"
            onClick={onClick}
            aria-label="Menüyü Aç"
            type="button"
        >
            <Menu className="w-7 h-7 text-blue-600" />
        </button>
    );
}
