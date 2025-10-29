import React, { useState } from 'react';
import { Square, Circle, RectangleHorizontal, Palette, Sparkles, Sun } from 'lucide-react';

const ButtonStylePanel = ({
                              theme,
                              onThemeUpdate
                          }) => {
    // Buton Stil Seçenekleri
    const buttonStyles = [
        {
            id: 'rounded',
            name: 'Yuvarlatılmış',
            icon: RectangleHorizontal,
            description: 'Köşeleri yumuşak',
            borderRadius: '0.5rem'
        },
        {
            id: 'square',
            name: 'Köşeli',
            icon: Square,
            description: 'Keskin köşeler',
            borderRadius: '0.25rem'
        },
        {
            id: 'pill',
            name: 'Yuvarlak',
            icon: Circle,
            description: 'Tamamen yuvarlak',
            borderRadius: '9999px'
        }
    ];

    // Popüler Buton Renkleri
    const popularButtonColors = [
        { color: '#6366F1', name: 'İndigo' },
        { color: '#8B5CF6', name: 'Mor' },
        { color: '#EC4899', name: 'Pembe' },
        { color: '#EF4444', name: 'Kırmızı' },
        { color: '#F59E0B', name: 'Turuncu' },
        { color: '#10B981', name: 'Yeşil' },
        { color: '#06B6D4', name: 'Cyan' },
        { color: '#3B82F6', name: 'Mavi' },
        { color: '#1F2937', name: 'Koyu Gri' },
        { color: '#6B7280', name: 'Gri' },
    ];

    // Gölge Seçenekleri
    const shadowOptions = [
        { id: 'none', name: 'Gölge Yok', value: 'none' },
        { id: 'sm', name: 'Küçük', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
        { id: 'md', name: 'Orta', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
        { id: 'lg', name: 'Büyük', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
        { id: 'xl', name: 'Ekstra Büyük', value: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
    ];

    const handleStyleChange = (styleId) => {
        onThemeUpdate({ buttonStyle: styleId });
    };

    const handleColorChange = (color) => {
        onThemeUpdate({ buttonColor: color });
    };

    const handleShadowChange = (shadow) => {
        onThemeUpdate({ buttonShadow: shadow });
    };

    const getCurrentStyle = () => {
        return buttonStyles.find(style => style.id === theme.buttonStyle) || buttonStyles[0];
    };

    const getBorderRadius = (styleId) => {
        const style = buttonStyles.find(s => s.id === styleId);
        return style ? style.borderRadius : '0.5rem';
    };

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Buton Stilleri</h3>
                    <p className="text-sm text-gray-500 mt-1">Tüm linkler için genel buton ayarları</p>
                </div>
                <Sparkles className="text-purple-500" size={24} />
            </div>

            {/* Buton Stili Seçimi */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Buton Stili
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {buttonStyles.map((style) => {
                        const Icon = style.icon;
                        const isSelected = theme.buttonStyle === style.id;

                        return (
                            <button
                                key={style.id}
                                onClick={() => handleStyleChange(style.id)}
                                className={`
                  relative p-4 rounded-lg border-2 transition-all hover:scale-105
                  ${isSelected
                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300'
                                }
                `}
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <Icon
                                        size={32}
                                        className={isSelected ? 'text-purple-600' : 'text-gray-600'}
                                    />
                                    <div className="text-center">
                                        <div className={`font-semibold text-sm ${isSelected ? 'text-purple-700' : 'text-gray-900'}`}>
                                            {style.name}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-0.5">
                                            {style.description}
                                        </div>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Varsayılan Buton Rengi */}
            <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <Palette size={16} />
                    <span>Varsayılan Buton Rengi</span>
                </label>

                <div className="flex items-center space-x-3 mb-4">
                    <input
                        type="color"
                        value={theme.buttonColor || '#6366F1'}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={theme.buttonColor || '#6366F1'}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="#6366F1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Linkler için özel renk seçilmemişse bu renk kullanılır
                        </p>
                    </div>
                </div>

                {/* Popüler Renkler */}
                <div>
                    <p className="text-xs text-gray-500 mb-2">Popüler Renkler</p>
                    <div className="grid grid-cols-5 gap-2">
                        {popularButtonColors.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => handleColorChange(item.color)}
                                className={`
                  relative h-12 rounded-lg transition-all hover:scale-105
                  ${theme.buttonColor === item.color
                                    ? 'ring-2 ring-offset-2 ring-purple-500 shadow-lg'
                                    : 'hover:shadow-md'
                                }
                `}
                                style={{ backgroundColor: item.color }}
                                title={item.name}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white drop-shadow-lg">
                    {item.name}
                  </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Gölge Ayarı */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Buton Gölgesi
                </label>
                <div className="grid grid-cols-5 gap-2">
                    {shadowOptions.map((shadow) => {
                        const isSelected = theme.buttonShadow === shadow.value;

                        return (
                            <button
                                key={shadow.id}
                                onClick={() => handleShadowChange(shadow.value)}
                                className={`
                  relative px-3 py-6 rounded-lg border-2 transition-all
                  ${isSelected
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }
                `}
                            >
                                <div
                                    className="w-full h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded"
                                    style={{ boxShadow: shadow.value }}
                                />
                                <p className={`text-xs font-medium mt-2 ${isSelected ? 'text-purple-700' : 'text-gray-600'}`}>
                                    {shadow.name}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>



            {/* Bilgi Notu */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Sun className="text-blue-600" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Önemli Not</h4>
                    <p className="text-sm text-blue-700">
                        Bu ayarlar tüm linkler için varsayılan stil oluşturur. Link düzenleme ekranında her link için özel renk belirleyebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ButtonStylePanel;