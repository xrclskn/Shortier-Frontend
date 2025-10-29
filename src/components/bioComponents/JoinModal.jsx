import React, { useState } from 'react';
import { X } from 'lucide-react';

const JoinModal = ({ open, onClose, username, profile }) => {
    const [inputValue, setInputValue] = useState('');

    if (!open) return null;

    const handleClaimClick = () => {
        window.open(`/register?ref=${username}`, '_blank');
        onClose();
    };

    const handleSignUpClick = () => {
        window.open(`/register?ref=${username}`, '_blank');
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
                {/* Kapat Butonu */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Kapat"
                >
                    <X size={24} className="text-white" />
                </button>

                {/* Marka */}
                <div className="text-3xl font-bold text-white mb-6 font-handwritten">Shortier</div>

                {/* Başlık */}
                <h2 className="text-3xl font-bold text-white mb-2 leading-tight">
                    <span className="text-yellow-300">Yüzlerce </span> içerik üreticisinin güvendiği
                    tek <span className="text-yellow-300">link-in-bio</span> platformuna katıl.
                </h2>

                {/* Alt Başlık */}
                <p className="text-blue-100 mb-6 leading-relaxed">
                    Ürettiğin, derlediğin ve sattığın her şeyi IG, TikTok ve daha fazlasında tek bir linkle paylaş.
                </p>

                {/* URL Girişi */}
                <div className="bg-white rounded-2xl p-4 mb-6">
                    <div className="flex items-center text-gray-600">
                        <span className="text-gray-500">shortier.link/</span>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="kullaniciadi"
                            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                            aria-label="Kullanıcı adı"
                        />
                    </div>
                </div>

                {/* Talep Et Butonu */}
                <button
                    onClick={handleClaimClick}
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-6 rounded-2xl transition-colors mb-6"
                >
                    Shortier adresimi al
                </button>

                {/* Alt Linkler */}
                <div className="space-y-2 text-sm">
                    <div>
                        <a href="https://shortier.link/about-us" target={"_blank"} className="underline cursor-pointer hover:no-underline text-blue-100 hover:text-white">
                          Shortier hakkında daha fazla bilgi
                        </a>
                    </div>
                </div>

                {/* Ücretsiz Kayıt */}
                <button
                    onClick={handleSignUpClick}
                    className="mt-6 border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-blue-600 transition-colors"
                >
                    Ücretsiz kaydol
                </button>

                {/* Telefon maketi (sadece görsel) */}
                <div className="absolute -right-4 -bottom-4 w-32 h-48 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl shadow-lg transform rotate-12 hidden sm:block" aria-hidden="true">
                    <div className="p-4 text-white">
                        <div className="w-8 h-8 bg-white/20 rounded-full mb-2"></div>
                        <div className="text-xs font-bold mb-2">{profile?.full_name || 'Kullanıcı'}</div>
                        <div className="space-y-1">
                            <div className="h-2 bg-white/30 rounded"></div>
                            <div className="h-2 bg-white/30 rounded w-3/4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinModal;
