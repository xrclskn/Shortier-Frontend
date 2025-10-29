// src/pages/NotFound.jsx
import {Link} from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-custom">
            <h1 className="text-5xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl text-white font-semibold mb-2">Sayfa Bulunamadı</h2>
            <p className="text-gray-200 mb-4">
                Aradığınız sayfa sistemde bulunamadı.
            </p>
            <Link className="px-6 py-3 rounded-lg bg-white font-semibold text-blue-600" to="/">Anasayfaya Dön</Link>
        </div>
    );
}
