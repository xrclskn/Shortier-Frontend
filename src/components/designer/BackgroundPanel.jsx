import React, { useState, useEffect } from 'react';
import { Palette, Image, Droplet, RefreshCw } from 'lucide-react';
import FileManagerModal from "@/components/common/FileManagerModal";
import { config } from '@/config';

const BackgroundPanel = ({
    theme,
    onThemeUpdate
}) => {
    const [activeTab, setActiveTab] = useState(theme.backgroundType || 'solid');
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

    useEffect(() => {
        if (theme?.backgroundType) {
            setActiveTab(theme.backgroundType);
        }
    }, [theme?.backgroundType]);


    // Popüler Renkler
    const popularColors = [
        '#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B',
        '#EF4444', '#6366F1', '#14B8A6', '#F97316', '#A855F7',
        '#F43F5E', '#3B82F6', '#22C55E', '#FBBF24', '#DEDEDE'
    ];

    // Popüler Gradient Kombinasyonları
    const popularGradients = [
        { start: '#8B5CF6', end: '#EC4899', name: 'Mor-Pembe' },
        { start: '#06B6D4', end: '#3B82F6', name: 'Turkuaz-Mavi' },
        { start: '#10B981', end: '#059669', name: 'Yeşil' },
        { start: '#F59E0B', end: '#EF4444', name: 'Turuncu-Kırmızı' },
        { start: '#6366F1', end: '#8B5CF6', name: 'İndigo-Mor' },
        { start: '#EC4899', end: '#F472B6', name: 'Pembe' },
        { start: '#14B8A6', end: '#06B6D4', name: 'Teal-Cyan' },
        { start: '#F97316', end: '#FB923C', name: 'Turuncu' }
    ];

    const handleBackgroundTypeChange = (type) => {
        setActiveTab(type);

        if (type === 'solid') {
            onThemeUpdate({
                backgroundType: 'solid',
                backgroundColor: theme.backgroundColor || '#F9FAFB'
            });
        } else if (type === 'gradient') {
            onThemeUpdate({
                backgroundType: 'gradient',
                gradientStart: theme.gradientStart || '#8B5CF6',
                gradientEnd: theme.gradientEnd || '#EC4899'
            });
        } else if (type === 'image') {
            onThemeUpdate({
                backgroundType: 'image',
                backgroundImage: theme.backgroundImage || null,
                backgroundOpacity: theme.backgroundOpacity || 0.5,
                backgroundOverlay: theme.backgroundOverlay || '#000000'
            });
        }
    };

    const handleSolidColorChange = (color) => {
        onThemeUpdate({
            backgroundColor: color,
            backgroundType: 'solid'
        });
    };

    const handleGradientChange = (startColor, endColor) => {
        onThemeUpdate({
            gradientStart: startColor,
            gradientEnd: endColor,
            backgroundType: 'gradient'
        });
    };

    const handleFileSelect = (url) => {
        onThemeUpdate({
            backgroundType: 'image',
            backgroundImage: url,
            backgroundOpacity: theme.backgroundOpacity || 0.5,
            backgroundOverlay: theme.backgroundOverlay || '#000000'
        });
    };

    const handleOpacityChange = (opacity) => {
        onThemeUpdate({
            backgroundOpacity: parseFloat(opacity)
        });
    };

    const handleOverlayChange = (color) => {
        onThemeUpdate({
            backgroundOverlay: color
        });
    };

    const handleRandomGradient = () => {
        const randomGradient = popularGradients[Math.floor(Math.random() * popularGradients.length)];
        handleGradientChange(randomGradient.start, randomGradient.end);
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Arka Plan</h3>
                    <p className="text-sm text-gray-500 mt-1">Profil arka planınızı özelleştirin</p>
                </div>
                <Palette className="text-[#010101]" size={24} />
            </div>

            {/* Arka Plan Tipi Seçimi */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => handleBackgroundTypeChange('solid')}
                    className={`
            flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md font-medium transition-all
            ${activeTab === 'solid'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }
          `}
                >
                    <Droplet size={18} />
                    <span>Düz Renk</span>
                </button>
                <button
                    onClick={() => handleBackgroundTypeChange('gradient')}
                    className={`
            flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md font-medium transition-all
            ${activeTab === 'gradient'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }
          `}
                >
                    <Palette size={18} />
                    <span>Gradient</span>
                </button>
                <button
                    onClick={() => handleBackgroundTypeChange('image')}
                    className={`
            flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md font-medium transition-all
            ${activeTab === 'image'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }
          `}
                >
                    <Image size={18} />
                    <span>Görsel</span>
                </button>
            </div>

            {/* Düz Renk Ayarları */}
            {activeTab === 'solid' && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Arka Plan Rengi
                        </label>

                        {/* Renk Seçici */}
                        <div className="flex items-center space-x-3 mb-4">
                            <input
                                type="color"
                                value={theme.backgroundColor || '#F9FAFB'}
                                onChange={(e) => handleSolidColorChange(e.target.value)}
                                className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                            />
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={theme.backgroundColor || '#F9FAFB'}
                                    onChange={(e) => handleSolidColorChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#010101]"
                                    placeholder="#F9FAFB"
                                />
                            </div>
                        </div>

                        {/* Popüler Renkler */}
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Popüler Renkler</p>
                            <div className="grid md:grid-cols-12 grid-cols-6 gap-2">
                                {popularColors.map((color, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSolidColorChange(color)}
                                        className={`
                      w-10 h-10 rounded-lg transition-all hover:scale-110
                      ${theme.backgroundColor === color
                                                ? 'ring-2 ring-offset-2 ring-[#010101] shadow-lg'
                                                : 'hover:shadow-md'
                                            }
                    `}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gradient Ayarları */}
            {activeTab === 'gradient' && (
                <div className="space-y-4">
                    {/* Başlangıç Rengi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Başlangıç Rengi
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={theme.gradientStart || '#8B5CF6'}
                                onChange={(e) => handleGradientChange(e.target.value, theme.gradientEnd)}
                                className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.gradientStart || '#8B5CF6'}
                                onChange={(e) => handleGradientChange(e.target.value, theme.gradientEnd)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#010101]"
                                placeholder="#8B5CF6"
                            />
                        </div>
                    </div>

                    {/* Bitiş Rengi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Bitiş Rengi
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={theme.gradientEnd || '#EC4899'}
                                onChange={(e) => handleGradientChange(theme.gradientStart, e.target.value)}
                                className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.gradientEnd || '#EC4899'}
                                onChange={(e) => handleGradientChange(theme.gradientStart, e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#010101]"
                                placeholder="#EC4899"
                            />
                        </div>
                    </div>

                    {/* Rastgele Gradient Butonu */}
                    <button
                        onClick={handleRandomGradient}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#010101] text-white rounded-lg hover:bg-gray-800 transition-all font-medium shadow-sm"
                    >
                        <RefreshCw size={18} />
                        <span>Rastgele Gradient</span>
                    </button>

                    {/* Popüler Gradientler */}
                    <div>
                        <p className="text-xs text-gray-500 mb-3">Popüler Gradient Kombinasyonları</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {popularGradients.map((gradient, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleGradientChange(gradient.start, gradient.end)}
                                    className={`
                    h-20 rounded-lg transition-all hover:scale-105 relative overflow-hidden
                    ${theme.gradientStart === gradient.start && theme.gradientEnd === gradient.end
                                            ? 'ring-2 ring-offset-2 ring-[#010101] shadow-lg'
                                            : 'hover:shadow-md'
                                        }
                  `}
                                    style={{
                                        background: `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`
                                    }}
                                    title={gradient.name}
                                >
                                    <div className="absolute inset-0 flex items-end p-2">
                                        <span className="text-xs text-white font-medium drop-shadow-lg">
                                            {gradient.name}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            )}

            {/* Görsel Ayarları */}
            {activeTab === 'image' && (
                <div className="space-y-6">
                    {/* Görsel Yükleme */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Arka Plan Görseli
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <div
                                onClick={() => setIsFileManagerOpen(true)}
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {theme.backgroundImage ? (
                                        <div className="relative group w-full h-full flex justify-center">
                                            <img
                                                src={theme.backgroundImage.startsWith('http') || theme.backgroundImage.startsWith('/storage')
                                                    ? (theme.backgroundImage.startsWith('/storage') ? config.API_BASE_URL + theme.backgroundImage : theme.backgroundImage)
                                                    : theme.backgroundImage
                                                }
                                                alt="Preview"
                                                className="h-32 object-cover rounded-lg mb-2 shadow-sm"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">Değiştir</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Image className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Galeri'den Seç veya Yükle</span></p>
                                            <p className="text-xs text-center text-gray-500">
                                                JPG, PNG, WEBP<br />
                                                <span className="text-[10px] text-gray-400">
                                                    Mobil için: 1080x1920px (9:16)<br />
                                                    Masaüstü için: 1920x1080px (16:9)
                                                </span>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500">
                        Yüklenecek görsel profilinizin arka planını tamamen kaplayacaktır.
                    </p>
                </div>
            )}

            {/* Bilgi Notu */}
            <div className="bg-[#efefef] border border-gray-300 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Palette className="text-[#010101]" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Tasarım İpucu</h4>
                    <p className="text-sm text-gray-700">
                        {activeTab === 'image'
                            ? 'Karmaşık görseller kullanıyorsanız, yazıların okunabilmesi için örtü opaklığını artırmayı veya koyu bir örtü rengi seçmeyi deneyin.'
                            : 'Arka plan rengini seçerken, yazı renginin okunabilir olmasına dikkat edin. Koyu arka plan için açık yazı, açık arka plan için koyu yazı kullanın.'
                        }
                    </p>
                </div>
            </div>
            <FileManagerModal
                isOpen={isFileManagerOpen}
                onClose={() => setIsFileManagerOpen(false)}
                onSelect={handleFileSelect}
                title="Arka Plan Görseli Seç"
            />
        </div>
    );
};


export default BackgroundPanel;