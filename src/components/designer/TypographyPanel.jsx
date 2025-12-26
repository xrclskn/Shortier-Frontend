import React, { useState } from 'react';
import { Type, ChevronDown, Lock } from 'lucide-react';
import { fontOptions } from "@/components/profileEditor/Constants.js";

const TypographyPanel = ({
    theme,
    onThemeUpdate,
    isPro = false, // <-- dışarıdan geliyor
}) => {
    const [showFontDropdown, setShowFontDropdown] = useState(false);

    const popularTextColors = [
        { color: '#FFFFFF', name: 'Beyaz', forDark: true },
        { color: '#F3F4F6', name: 'Açık Gri', forDark: true },
        { color: '#1F2937', name: 'Koyu Gri', forDark: false },
        { color: '#111827', name: 'Siyah', forDark: false },
        { color: '#8B5CF6', name: 'Mor', forDark: false },
        { color: '#EC4899', name: 'Pembe', forDark: false },
        { color: '#3B82F6', name: 'Mavi', forDark: false },
        { color: '#10B981', name: 'Yeşil', forDark: false },
    ];

    function getCurrentFont(fontValue) {
        return fontOptions.find(font => font.value === fontValue) || fontOptions[0];
    }

    const currentFontObj = getCurrentFont(theme.fontFamily);

    const handleFontChange = (fontValue, locked) => {
        if (locked) return; // kilitliyse seçtirmiyoruz

        onThemeUpdate({ fontFamily: fontValue });

        // seçilen fontun linkini head'e inject et
        const fontObj = fontOptions.find(f => f.value === fontValue);
        if (fontObj) {
            const linkId = "dynamic-font-link";
            let linkTag = document.getElementById(linkId);
            if (!linkTag) {
                linkTag = document.createElement("link");
                linkTag.id = linkId;
                linkTag.rel = "stylesheet";
                document.head.appendChild(linkTag);
            }
            linkTag.href = fontObj.url;
        }
    };

    const handleTextColorChange = (color) => {
        onThemeUpdate({ textColor: color });
    };

    const isLightBackground = () => {
        if (theme.backgroundType === 'solid') {
            const color = theme.backgroundColor || '#ffffff';
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 155;
        }
        return false;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Tipografi</h3>
                    <p className="text-sm text-gray-500 mt-1">Yazı tipi ve renk ayarları</p>
                </div>
                <Type className="text-[#010101]" size={24} />
            </div>

            {/* FONT AİLESİ */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Font Ailesi
                </label>

                <div className="relative">
                    {/* Seçili font butonu */}
                    <button
                        onClick={() => setShowFontDropdown(!showFontDropdown)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors focus:outline-none focus:border-[#010101]"
                    >
                        <div className="flex items-center space-x-3">
                            <span
                                className="text-2xl font-medium"
                                style={{ fontFamily: currentFontObj.value }}
                            >
                                {currentFontObj.preview}
                            </span>

                            <div className="text-left">
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                    {currentFontObj.label}


                                    {currentFontObj.proOnly && isPro && (
                                        <span
                                            className={
                                                "text-[10px] leading-none font-semibold rounded px-1.5 py-0.5 border " +
                                                "text-emerald-700 bg-emerald-50 border-emerald-200"
                                            }
                                        >
                                            Pro
                                        </span>
                                    )}
                                </div>

                                <div className="text-xs text-gray-500">
                                    {currentFontObj.category}
                                </div>
                            </div>
                        </div>

                        <ChevronDown
                            size={20}
                            className={`text-gray-400 transition-transform ${showFontDropdown ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown listesi */}
                    {showFontDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                            {fontOptions.map((font, index) => {
                                const locked = font.proOnly && !isPro;
                                const isActive = theme.fontFamily === font.value;

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleFontChange(font.value, locked)}
                                        disabled={locked}
                                        className={`
                                            w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
                                            ${isActive ? 'bg-[#efefef] border-l-4 border-[#010101]' : 'border-l-4 border-transparent'}
                                            ${locked
                                                ? 'opacity-40 cursor-not-allowed hover:bg-white'
                                                : 'hover:bg-[#efefef] cursor-pointer'
                                            }
                                        `}
                                    >
                                        <span
                                            className="text-2xl font-medium"
                                            style={{ fontFamily: font.value }}
                                        >
                                            {font.preview}
                                        </span>

                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                {font.label}

                                                {/* burada badge her zaman gösteriliyor çünkü burası satış alanı */}
                                                {font.proOnly && (
                                                    <span
                                                        className={
                                                            "inline-flex items-center gap-1 text-[10px] leading-none font-semibold rounded px-1.5 py-0.5 border " +
                                                            (locked
                                                                ? "text-violet-700 bg-violet-50 border-violet-200"
                                                                : "text-emerald-700 bg-emerald-50 border-emerald-200"
                                                            )
                                                        }
                                                    >
                                                        <Lock
                                                            size={10}
                                                            className={
                                                                locked
                                                                    ? "text-violet-700"
                                                                    : "text-emerald-700"
                                                            }
                                                        />
                                                        Pro
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500">{font.category}</div>
                                        </div>

                                        {isActive && (
                                            <div className="w-2 h-2 bg-[#010101] rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Font Önizleme */}
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-6 hidden">
                    <p className="text-xs text-gray-600 mb-3">Font Önizleme</p>
                    <div
                        className="space-y-2"
                        style={{ fontFamily: theme.fontFamily, color: "black" }}
                    >
                        <p className="text-3xl font-bold">Başlık Örneği</p>
                        <p className="text-lg">Alt başlık örneği</p>
                        <p className="text-sm">
                            Normal metin örneği. Bu font profilinizde nasıl görünecek.
                        </p>
                    </div>
                </div>
            </div>

            {/* Yazı Rengi */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Yazı Rengi
                </label>

                <div className="flex items-center space-x-3 mb-4">
                    <input
                        type="color"
                        value={theme.textColor || '#1F2937'}
                        onChange={(e) => handleTextColorChange(e.target.value)}
                        className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={theme.textColor || '#1F2937'}
                            onChange={(e) => handleTextColorChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#010101]"
                            placeholder="#1F2937"
                        />
                    </div>
                </div>

                <div>
                    <p className="text-xs text-gray-500 mb-2">Popüler Renkler</p>
                    <div className="grid grid-cols-4 gap-3">
                        {popularTextColors.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleTextColorChange(item.color)}
                                className={`
                                    group relative h-20 rounded-lg transition-all hover:scale-105 overflow-hidden
                                    ${theme.textColor === item.color
                                        ? 'ring-2 ring-offset-2 ring-[#010101] shadow-lg'
                                        : 'hover:shadow-md border-2 border-gray-200'
                                    }
                                `}
                                style={{ backgroundColor: item.color }}
                                title={item.name}
                            >
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Type
                                        size={24}
                                        className={item.forDark ? 'text-gray-800' : 'text-white'}
                                    />
                                    <span
                                        className={`text-xs font-medium mt-1 ${item.forDark ? 'text-gray-800' : 'text-white'}`}
                                    >
                                        {item.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Okunabilirlik Uyarısı */}
            {isLightBackground()
                && (theme.textColor === '#FFFFFF' || theme.textColor === '#F3F4F6') && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                                <Type className="text-amber-600" size={16} />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-amber-900 text-sm mb-1">Okunabilirlik Uyarısı</h4>
                            <p className="text-sm text-amber-700">
                                Açık arka plan üzerinde açık renkli yazı kullanıyorsunuz. Daha iyi okunabilirlik için koyu bir renk seçmeyi düşünün.
                            </p>
                        </div>
                    </div>
                )}

            {/* Bilgi Notu */}
            <div className="bg-[#efefef] border border-gray-300 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Type className="text-[#010101]" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Font İpucu</h4>
                    <p className="text-sm text-gray-700">
                        Serif fontlar daha klasik, Sans Serif fontlar modern görünüm sağlar. Handwriting fontlar kişisel bir dokunuş katar.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TypographyPanel;
