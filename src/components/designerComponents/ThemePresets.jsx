import React, { useState } from 'react';
import { Check, Sparkles, Sun, Moon, Sunset, Zap, Heart, Star } from 'lucide-react';

const ThemePresets = ({
                          currentTheme,
                          onThemeSelect
                      }) => {
    const [hoveredPreset, setHoveredPreset] = useState(null);

    // Hazır Tema Şablonları
    const themePresets = [
        {
            id: 'blue_dream',
            name: 'Mor Rüya',
            icon: Sparkles,
            theme: {
                backgroundColor: '#ffffff',
                backgroundType: 'gradient',
                gradientStart: '#8B5CF6',
                gradientEnd: '#EC4899',
                buttonStyle: 'rounded',
                buttonColor: '#6366F1',
                textColor: '#ffffff',
                fontFamily: 'Poppins'
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
                textColor: '#ffffff',
                fontFamily: 'Montserrat'
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
                textColor: '#ffffff',
                fontFamily: 'Roboto'
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
                textColor: '#ffffff',
                fontFamily: 'Raleway'
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
                buttonColor: '#6366F1',
                textColor: '#F3F4F6',
                fontFamily: 'Poppins'
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
                textColor: '#ffffff',
                fontFamily: 'Inter'
            }
        },
        {
            id: 'minimal_white',
            name: 'Minimal Beyaz',
            icon: Star,
            theme: {
                backgroundColor: '#F9FAFB',
                backgroundType: 'solid',
                gradientStart: '#F9FAFB',
                gradientEnd: '#F3F4F6',
                buttonStyle: 'square',
                buttonColor: '#1F2937',
                textColor: '#1F2937',
                fontFamily: 'Playfair Display'
            }
        },
        {
            id: 'golden_hour',
            name: 'Altın Saat',
            icon: Sun,
            theme: {
                backgroundColor: '#ffffff',
                backgroundType: 'gradient',
                gradientStart: '#FBBF24',
                gradientEnd: '#F59E0B',
                buttonStyle: 'rounded',
                buttonColor: '#D97706',
                textColor: '#ffffff',
                fontFamily: 'Dancing Script'
            }
        }
    ];

    const isCurrentTheme = (preset) => {
        if (!currentTheme) return false;
        return JSON.stringify(preset.theme) === JSON.stringify(currentTheme);
    };

    const getPreviewStyle = (preset) => {
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
            borderRadius: borderRadius
        };
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Hazır Temalar</h3>
                    <p className="text-sm text-gray-500 mt-1">Hızlıca başlamak için bir tema seçin</p>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                    <Sparkles size={16} />
                    <span>{themePresets.length} Tema</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {themePresets.map((preset) => {
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
                                ? 'ring-4 ring-blue-500 ring-offset-2 shadow-xl '
                                : 'hover:shadow-lg  shadow-md'
                            }
              `}
                        >
                            {/* Tema Önizleme Alanı */}
                            <div
                                className="h-40 p-4 flex flex-col justify-between relative"
                                style={getPreviewStyle(preset)}
                            >
                                {/* Seçili İşareti */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <Check className="text-blue-600" size={18} strokeWidth={3} />
                                    </div>
                                )}

                                {/* Mini Avatar */}
                                <div className="flex justify-center">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                    >
                                        <Icon
                                            size={20}
                                            style={{ color: preset.theme.textColor }}
                                        />
                                    </div>
                                </div>

                                {/* Mini Buton Örneği */}
                                <div className="space-y-2">
                                    <div
                                        className="h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                                        style={getButtonStyle(preset)}
                                    >
                                        Örnek Link
                                    </div>
                                    <div
                                        className="h-8 rounded flex items-center justify-center text-xs font-medium text-white opacity-70"
                                        style={getButtonStyle(preset)}
                                    >
                                        Örnek Link
                                    </div>
                                </div>
                            </div>

                            {/* Tema Adı */}
                            <div className={`
                bg-white p-3 border-t-2 transition-colors
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}
              `}>
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <p className={`
                      font-semibold text-sm
                      ${isSelected ? 'text-blue-700' : 'text-gray-900'}
                    `}>
                                            {preset.name}
                                        </p>

                                        {isSelected && (
                                            <p className="text-xs text-blue-600 mt-1">✓ Aktif Tema</p>
                                        )}
                                    </div>

                                    {!isSelected && hoveredPreset === preset.id && (
                                        <div className="text-blue-600">
                                            <Sparkles size={16} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Bilgi Notu */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Sparkles className="text-blue-600" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Tema İpucu</h4>
                    <p className="text-sm text-blue-700">
                        Bir tema seçtikten sonra, arka plan, renk ve yazı tipi ayarlarından tema özelleştirmeleri yapabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
};


export default ThemePresets;