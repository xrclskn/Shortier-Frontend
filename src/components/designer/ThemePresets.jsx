import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Sun, Moon, Sunset, Zap, Heart, Star, Palette, Image as ImageIcon, Loader2 } from 'lucide-react';
import apiClient from "@/api/client";
import { config } from '@/config';

const ThemePresets = ({
    currentTheme,
    onThemeSelect
}) => {
    const [hoveredPreset, setHoveredPreset] = useState(null);
    const [sharedBackgrounds, setSharedBackgrounds] = useState([]);
    const [loadingShared, setLoadingShared] = useState(true);

    // Fetch shared backgrounds on mount
    useEffect(() => {
        const fetchSharedBackgrounds = async () => {
            try {
                const res = await apiClient.get('/api/media/shared');
                setSharedBackgrounds(res.data);
            } catch (error) {
                console.error('Shared backgrounds yüklenemedi:', error);
            } finally {
                setLoadingShared(false);
            }
        };
        fetchSharedBackgrounds();
    }, []);

    // Comprehensive static theme presets
    const staticPresets = [
        {
            id: 'minimal_black',
            name: 'Minimal Siyah',
            icon: Moon,
            theme: {
                // Background
                backgroundColor: '#0a0a0a',
                backgroundType: 'solid',
                gradientStart: '#0a0a0a',
                gradientEnd: '#1a1a1a',
                // Buttons
                buttonStyle: 'rounded',
                buttonColor: '#ffffff',
                buttonTextColor: '#000000',
                // Typography
                textColor: '#ffffff',
                fontFamily: 'Inter',
                // Bio Card
                bioCardActive: false,
                bioCardColor: '#1a1a1a',
                bioCardOpacity: 80
            }
        },
        {
            id: 'classic_white',
            name: 'Klasik Beyaz',
            icon: Star,
            theme: {
                backgroundColor: '#ffffff',
                backgroundType: 'solid',
                gradientStart: '#ffffff',
                gradientEnd: '#f5f5f5',
                buttonStyle: 'rounded',
                buttonColor: '#1F2937',
                buttonTextColor: '#ffffff',
                textColor: '#1F2937',
                fontFamily: 'Inter',
                bioCardActive: false,
                bioCardColor: '#f5f5f5',
                bioCardOpacity: 90
            }
        },
        {
            id: 'elegant_gray',
            name: 'Elegant Gri',
            icon: Palette,
            theme: {
                backgroundColor: '#f8f9fa',
                backgroundType: 'gradient',
                gradientStart: '#e9ecef',
                gradientEnd: '#f8f9fa',
                buttonStyle: 'pill',
                buttonColor: '#212529',
                buttonTextColor: '#ffffff',
                textColor: '#212529',
                fontFamily: 'Montserrat',
                bioCardActive: true,
                bioCardColor: '#ffffff',
                bioCardOpacity: 80
            }
        },
        {
            id: 'ocean_breeze',
            name: 'Okyanus Esintisi',
            icon: Sun,
            theme: {
                backgroundColor: '#ffffff',
                backgroundType: 'gradient',
                gradientStart: '#0EA5E9',
                gradientEnd: '#06B6D4',
                buttonStyle: 'rounded',
                buttonColor: '#0284C7',
                buttonTextColor: '#ffffff',
                textColor: '#ffffff',
                fontFamily: 'Montserrat',
                bioCardActive: true,
                bioCardColor: '#0369a1',
                bioCardOpacity: 30
            }
        },
        {
            id: 'sunset_glow',
            name: 'Gün Batımı',
            icon: Sunset,
            theme: {
                backgroundColor: '#ffffff',
                backgroundType: 'gradient',
                gradientStart: '#F97316',
                gradientEnd: '#EF4444',
                buttonStyle: 'pill',
                buttonColor: '#DC2626',
                buttonTextColor: '#ffffff',
                textColor: '#ffffff',
                fontFamily: 'Roboto',
                bioCardActive: true,
                bioCardColor: '#7f1d1d',
                bioCardOpacity: 40
            }
        },
        {
            id: 'forest_green',
            name: 'Orman Yeşili',
            icon: Zap,
            theme: {
                backgroundColor: '#ffffff',
                backgroundType: 'gradient',
                gradientStart: '#10B981',
                gradientEnd: '#059669',
                buttonStyle: 'rounded',
                buttonColor: '#047857',
                buttonTextColor: '#ffffff',
                textColor: '#ffffff',
                fontFamily: 'Raleway',
                bioCardActive: true,
                bioCardColor: '#064e3b',
                bioCardOpacity: 40
            }
        },
        {
            id: 'midnight_dark',
            name: 'Gece Karanlığı',
            icon: Moon,
            theme: {
                backgroundColor: '#1F2937',
                backgroundType: 'solid',
                gradientStart: '#1F2937',
                gradientEnd: '#111827',
                buttonStyle: 'rounded',
                buttonColor: '#374151',
                buttonTextColor: '#F3F4F6',
                textColor: '#F3F4F6',
                fontFamily: 'Poppins',
                bioCardActive: true,
                bioCardColor: '#111827',
                bioCardOpacity: 70
            }
        },
        {
            id: 'romantic_pink',
            name: 'Romantik Pembe',
            icon: Heart,
            theme: {
                backgroundColor: '#ffffff',
                backgroundType: 'gradient',
                gradientStart: '#EC4899',
                gradientEnd: '#F472B6',
                buttonStyle: 'pill',
                buttonColor: '#DB2777',
                buttonTextColor: '#ffffff',
                textColor: '#ffffff',
                fontFamily: 'Playfair Display',
                bioCardActive: true,
                bioCardColor: '#831843',
                bioCardOpacity: 35
            }
        }
    ];

    // Generate dynamic presets from shared backgrounds
    const generateImagePresets = () => {
        return sharedBackgrounds.slice(0, 8).map((bg, index) => {
            const name = bg.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

            return {
                id: `shared_${index}`,
                name: capitalizedName || `Görsel ${index + 1}`,
                icon: ImageIcon,
                isImagePreset: true,
                imageUrl: config.API_BASE_URL + bg.url,
                theme: {
                    // Background
                    backgroundColor: '#1F2937',
                    backgroundType: 'image',
                    backgroundImage: bg.url,
                    gradientStart: '#1F2937',
                    gradientEnd: '#111827',
                    // Buttons - glassmorphism style
                    buttonStyle: 'rounded',
                    buttonColor: 'rgba(255,255,255,0.15)',
                    buttonTextColor: '#ffffff',
                    // Typography
                    textColor: '#ffffff',
                    fontFamily: 'Inter',
                    // Bio Card - semi-transparent for readability
                    bioCardActive: true,
                    bioCardColor: '#000000',
                    bioCardOpacity: 40
                }
            };
        });
    };

    const imagePresets = generateImagePresets();
    const allPresets = [...staticPresets, ...imagePresets];

    // Theme comparison
    const isCurrentTheme = (preset) => {
        if (!currentTheme) return false;

        if (preset.theme.backgroundType === 'image') {
            return currentTheme.backgroundType === 'image' &&
                currentTheme.backgroundImage === preset.theme.backgroundImage;
        }

        return (
            preset.theme.backgroundType === currentTheme.backgroundType &&
            preset.theme.buttonColor === currentTheme.buttonColor &&
            preset.theme.buttonStyle === currentTheme.buttonStyle &&
            preset.theme.textColor === currentTheme.textColor &&
            (preset.theme.backgroundType === 'solid'
                ? preset.theme.backgroundColor === currentTheme.backgroundColor
                : preset.theme.gradientStart === currentTheme.gradientStart &&
                preset.theme.gradientEnd === currentTheme.gradientEnd)
        );
    };

    const getPreviewStyle = (preset) => {
        if (preset.isImagePreset) {
            return {
                backgroundImage: `url(${preset.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        }
        if (preset.theme.backgroundType === 'gradient') {
            return {
                background: `linear-gradient(135deg, ${preset.theme.gradientStart} 0%, ${preset.theme.gradientEnd} 100%)`
            };
        }
        return {
            backgroundColor: preset.theme.backgroundColor
        };
    };

    const getButtonStyle = (preset) => {
        let borderRadius = '0.5rem';
        if (preset.theme.buttonStyle === 'square') borderRadius = '0.25rem';
        if (preset.theme.buttonStyle === 'pill') borderRadius = '9999px';

        return {
            backgroundColor: preset.theme.buttonColor,
            borderRadius: borderRadius,
            color: preset.theme.buttonTextColor || '#ffffff'
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Hazır Temalar</h3>
                    <p className="text-sm text-gray-500 mt-1">Hızlıca başlamak için bir tema seçin</p>
                </div>
                <div className="flex items-center space-x-2 bg-[#efefef] text-[#010101] px-3 py-2 rounded-lg text-sm font-medium">
                    <Sparkles size={16} />
                    <span>{allPresets.length} Tema</span>
                </div>
            </div>

            {/* Static Presets */}
            <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Renk Temaları</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {staticPresets.map((preset) => {
                        const Icon = preset.icon;
                        const isSelected = isCurrentTheme(preset);

                        return (
                            <button
                                key={preset.id}
                                onClick={() => onThemeSelect(preset.theme)}
                                onMouseEnter={() => setHoveredPreset(preset.id)}
                                onMouseLeave={() => setHoveredPreset(null)}
                                className={`
                                    relative group rounded-xl overflow-hidden transition-all duration-200
                                    ${isSelected
                                        ? 'ring-4 ring-[#010101] ring-offset-2 shadow-xl'
                                        : 'hover:shadow-lg shadow-md'
                                    }
                                `}
                            >
                                <div
                                    className="h-32 p-3 flex flex-col justify-between relative"
                                    style={getPreviewStyle(preset)}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                            <Check className="text-[#010101]" size={14} strokeWidth={3} />
                                        </div>
                                    )}

                                    {/* Bio card preview */}
                                    {preset.theme.bioCardActive && (
                                        <div
                                            className="absolute inset-2 rounded-lg pointer-events-none"
                                            style={{
                                                backgroundColor: preset.theme.bioCardColor,
                                                opacity: (preset.theme.bioCardOpacity || 50) / 100
                                            }}
                                        />
                                    )}

                                    <div className="flex justify-center relative z-10">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                        >
                                            <Icon size={18} style={{ color: preset.theme.textColor }} />
                                        </div>
                                    </div>
                                    <div
                                        className="h-6 rounded flex items-center justify-center text-[10px] font-medium relative z-10"
                                        style={getButtonStyle(preset)}
                                    >
                                        Örnek Link
                                    </div>
                                </div>
                                <div className={`bg-white p-2 border-t-2 ${isSelected ? 'border-[#010101] bg-[#efefef]' : 'border-gray-100'}`}>
                                    <p className="font-semibold text-xs text-gray-900 text-center">{preset.name}</p>
                                    <p className="text-[10px] text-gray-500 text-center mt-0.5">{preset.theme.fontFamily}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Image Presets from Shared Folder */}
            {(loadingShared || imagePresets.length > 0) && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <ImageIcon size={16} />
                        Görsel Arkaplanlar
                    </h4>
                    {loadingShared ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : imagePresets.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            Henüz ortak görsel bulunmuyor
                        </p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {imagePresets.map((preset) => {
                                const isSelected = isCurrentTheme(preset);

                                return (
                                    <button
                                        key={preset.id}
                                        onClick={() => onThemeSelect(preset.theme)}
                                        onMouseEnter={() => setHoveredPreset(preset.id)}
                                        onMouseLeave={() => setHoveredPreset(null)}
                                        className={`
                                            relative group rounded-xl overflow-hidden transition-all duration-200 aspect-[3/4]
                                            ${isSelected
                                                ? 'ring-4 ring-[#010101] ring-offset-2 shadow-xl'
                                                : 'hover:shadow-lg shadow-md'
                                            }
                                        `}
                                    >
                                        <div
                                            className="absolute inset-0"
                                            style={getPreviewStyle(preset)}
                                        />

                                        {/* Bio card overlay preview */}
                                        <div
                                            className="absolute inset-2 rounded-lg"
                                            style={{
                                                backgroundColor: preset.theme.bioCardColor,
                                                opacity: (preset.theme.bioCardOpacity || 40) / 100
                                            }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                <Check className="text-[#010101]" size={14} strokeWidth={3} />
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 right-0 p-2">
                                            <div
                                                className="h-6 rounded flex items-center justify-center text-[10px] font-medium mb-2"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    backdropFilter: 'blur(4px)',
                                                    color: '#ffffff'
                                                }}
                                            >
                                                Örnek Link
                                            </div>
                                            <p className="text-white text-xs font-medium text-center truncate">
                                                {preset.name}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Info Note */}
            <div className="bg-[#efefef] border border-gray-300 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Sparkles className="text-[#010101]" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Tema Özellikleri</h4>
                    <p className="text-sm text-gray-700">
                        Her tema arka plan, buton stilleri, yazı renkleri, font ve bio kartı ayarlarını içerir. Tema seçtikten sonra ince ayar yapabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThemePresets;