import React from "react";
import { X, Link as LinkIcon, Share2, Check, ExternalLink } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faWhatsapp,
    faLinkedin,
    faFacebook,
    faTelegram,
    faReddit,
    faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink } from "@fortawesome/free-solid-svg-icons";

export default function ShareModal({ open, onClose, shareUrl, profile, username }) {
    const [copied, setCopied] = React.useState(false);

    if (!open) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const shareText = "Shortier ile biyografimi oluşturdum, göz atmak ister misin?";

    const twitterShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const whatsappShare = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    const telegramShare = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    const redditShare = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
    const pinterestShare = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`;
    const emailShare = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

    // İkon, renk ve linkleri liste olarak yazıyoruz, kod temiz olsun
    const shareItems = [
        { href: twitterShare, icon: faTwitter, color: "bg-[#1da1f2]", label: "Twitter" },
        { href: whatsappShare, icon: faWhatsapp, color: "bg-[#25D366]", label: "WhatsApp" },
        { href: linkedinShare, icon: faLinkedin, color: "bg-[#0077b5]", label: "LinkedIn" },
        { href: facebookShare, icon: faFacebook, color: "bg-[#1877f3]", label: "Facebook" },
        { href: telegramShare, icon: faTelegram, color: "bg-[#229ed9]", label: "Telegram" },
        { href: redditShare, icon: faReddit, color: "bg-[#FF4500]", label: "Reddit" },
        { href: pinterestShare, icon: faPinterest, color: "bg-[#E60023]", label: "Pinterest" },
        { href: emailShare, icon: faEnvelope, color: "bg-gray-400", label: "Email" },
    ];

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-2xl p-6 shadow-xl w-[95vw] max-w-sm relative animate-in slide-in-from-top-6 fade-in-0 duration-200">
                {/* Kapat */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                    onClick={onClose}
                    aria-label="Kapat"
                >
                    <X size={22} />
                </button>

                {/* Profil Bilgileri */}
                {/* Profil Bilgileri */}
                <div className="mb-4 text-center">
                    <div className="font-semibold text-gray-800 text-lg">
                        {profile?.full_name || profile?.name || username}
                    </div>
                    <div className="text-sm text-gray-500">@{username}</div>
                </div>

                {/* Başlık */}
                <div className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#010101]">
                    <Share2 size={20} className="text-[#010101]" />
                    Profili Paylaş
                </div>

                {/* Link kutusu + Kopyala */}
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4 gap-2">
                    <LinkIcon size={18} className="text-gray-500" />
                    <input
                        value={shareUrl}
                        readOnly
                        className="bg-transparent flex-1 text-gray-800 text-sm outline-none"
                    />
                    <button
                        onClick={handleCopy}
                        className="ml-2 px-2 py-1 rounded text-[#010101] hover:bg-gray-200 transition text-xs font-medium flex items-center gap-1"
                    >
                        {copied ? (
                            <>
                                <Check size={14} /> Kopyalandı!
                            </>
                        ) : (
                            <>
                                <LinkIcon size={14} /> Kopyala
                            </>
                        )}
                    </button>
                </div>

                {/* Sosyal paylaşım butonları */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {shareItems.map((item, idx) => (
                        <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={item.label + " ile paylaş"}
                            className={`w-10 h-10 flex items-center justify-center rounded-full ${item.color} text-white hover:scale-110 transition`}
                        >
                            <FontAwesomeIcon icon={item.icon} size="lg" />
                        </a>
                    ))}
                </div>

                {/* Shortier'e Kayıt Ol Butonu */}
                <button
                    onClick={() => window.open(`/register?ref=${username}`, '_blank')}
                    className="w-full bg-[#010101] hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
                >
                    <span className="font-handwritten">Shortier</span>
                    <span>ile senin de profilin olsun</span>
                    <ExternalLink size={16} />
                </button>

                <div className="text-xs text-gray-500 text-center">
                    Sosyal medyada veya doğrudan link olarak paylaşabilirsin.
                </div>
            </div>
        </div>
    );
}