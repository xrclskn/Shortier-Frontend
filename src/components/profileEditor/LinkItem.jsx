// LinkItem.jsx
import { useState } from "react";
import { Move, Trash2, Palette, ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import {buttonColors, iconOptions} from "@/components/profileEditor/Constants.js";

export default function LinkItem({link, index, onUpdate, onUpdateMultiple, onRemove, onOpenIconModal, dragIndex, hoverIndex, onDragStart, onDragOver, onDrop, onDragEnd})
{
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'custom'

    const applyPresetColors = (preset) => {
        // Tüm değişiklikleri tek seferde uygula
        const updates = {
            color: preset.color,
            iconBg: preset.iconBg,
            iconColor: preset.iconColor,
            textColor: preset.textColor || "#ffffff"
        };

        // Çoklu güncelleme fonksiyonu varsa onu kullan, yoksa tek tek güncelle
        if (onUpdateMultiple) {
            onUpdateMultiple(link.id, updates);
        } else {
            // Fallback: tek tek güncelle
            Object.keys(updates).forEach(key => {
                onUpdate(link.id, key, updates[key]);
            });
        }

        // Debug için console log ekleyelim
        console.log("Applying preset:", preset.name, updates);
    };

    // Seçili preset'i kontrol etme fonksiyonu
    const isPresetSelected = (preset) => {
        const currentTextColor = link.textColor || "#ffffff";
        const presetTextColor = preset.textColor || "#ffffff";

        const isSelected = link.color === preset.color &&
            link.iconBg === preset.iconBg &&
            link.iconColor === preset.iconColor &&
            currentTextColor === presetTextColor;


        /*if (preset.name === "Instagram") {
            console.log("Checking preset:", preset.name, {
                colorMatch: link.color === preset.color,
                iconBgMatch: link.iconBg === preset.iconBg,
                iconColorMatch: link.iconColor === preset.iconColor,
                textColorMatch: currentTextColor === presetTextColor,
                isSelected,
                current: { color: link.color, iconBg: link.iconBg, iconColor: link.iconColor, textColor: currentTextColor },
                preset: { color: preset.color, iconBg: preset.iconBg, iconColor: preset.iconColor, textColor: presetTextColor }
            });
        }*/

        return isSelected;
    };

    const presetStyles = [
        { name: 'Instagram', color: '#E4405F', iconBg: '#ffffff', iconColor: '#E4405F', textColor: '#ffffff' },
        { name: 'Twitter', color: '#1DA1F2', iconBg: '#ffffff', iconColor: '#1DA1F2', textColor: '#ffffff' },
        { name: 'LinkedIn', color: '#0077B5', iconBg: '#ffffff', iconColor: '#0077B5', textColor: '#ffffff' },
        { name: 'GitHub', color: '#333333', iconBg: '#ffffff', iconColor: '#333333', textColor: '#ffffff' },
        { name: 'YouTube', color: '#FF0000', iconBg: '#ffffff', iconColor: '#FF0000', textColor: '#ffffff' },
        { name: 'TikTok', color: '#000000', iconBg: '#ffffff', iconColor: '#000000', textColor: '#ffffff' },
        { name: 'WhatsApp', color: '#25D366', iconBg: '#ffffff', iconColor: '#25D366', textColor: '#ffffff' },
        { name: 'Telegram', color: '#0088CC', iconBg: '#ffffff', iconColor: '#0088CC', textColor: '#ffffff' },
        { name: 'Discord', color: '#5865F2', iconBg: '#ffffff', iconColor: '#5865F2', textColor: '#ffffff' },
        { name: 'Spotify', color: '#1DB954', iconBg: '#000000', iconColor: '#1DB954', textColor: '#ffffff' },
        { name: 'Website', color: '#6366F1', iconBg: '#ffffff', iconColor: '#6366F1', textColor: '#ffffff' },
        { name: 'Email', color: '#EA4335', iconBg: '#ffffff', iconColor: '#EA4335', textColor: '#ffffff' },
    ];

    return (
        <div
            className={`bg-gray-50 rounded-xl border-2 transition-all duration-200 ${
                dragIndex === index ? "opacity-50 scale-95" : ""
            } ${hoverIndex === index ? "border-blue-400 shadow-md" : "border-transparent"} hover:shadow-sm`}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
        >
            {/* Üst Başlık ve Kontroller */}
            <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Move size={12} />
                        <span>Sürükle</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg p-1.5 transition-colors"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        title={showAdvanced ? "Basit görünüm" : "Gelişmiş ayarlar"}
                    >
                        <Palette size={14} />
                    </button>
                    <button
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                        onClick={() => onRemove(link.id)}
                        title="Bağlantıyı sil"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Ana İçerik */}
            <div className="px-4 pb-4 space-y-3">
                {/* İkon ve Başlık */}
                <div className="flex items-center gap-3">
                    <button
                        className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm"
                        onClick={() => onOpenIconModal(link.id)}
                        style={{
                            backgroundColor: link.iconBg,
                            borderColor: link.iconBg === '#ffffff' ? '#e5e7eb' : link.iconBg
                        }}
                        title="İkon değiştir"
                    >
                        <FontAwesomeIcon
                            icon={iconOptions.find(x => x.name === link.icon)?.icon || faLink}
                            className="w-5 h-5 transition-colors duration-200"
                            style={{ color: link.iconColor }}
                        />
                    </button>

                    <input
                        type="text"
                        placeholder="Bağlantı başlığı"
                        value={link.label}
                        onChange={e => onUpdate(link.id, "label", e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                {/* URL */}
                <input
                    type="url"
                    placeholder="https://ornek.com"
                    value={link.url}
                    onChange={e => onUpdate(link.id, "url", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />

                {/* Hızlı Stil Seçimi */}
                <div className="flex flex-wrap gap-2">
                    {presetStyles.slice(0, 6).map((preset, i) => (
                        <button
                            key={i}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 text-xs font-medium ${
                                isPresetSelected(preset)
                                    ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                            onClick={() => applyPresetColors(preset)}
                            title={preset.name}
                        >
                            <div
                                className="w-4 h-4 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: preset.color }}
                            />
                            <span className={isPresetSelected(preset) ? 'text-blue-700' : 'text-gray-700'}>
                                {preset.name}
                            </span>
                        </button>
                    ))}

                    <button
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all text-xs text-gray-500"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <Palette size={12} />
                        <span>Daha fazla</span>
                        <ChevronDown size={12} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Gelişmiş Ayarlar */}
                {showAdvanced && (
                    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
                        {/* Tab Seçimi */}
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                                    activeTab === 'presets'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('presets')}
                            >
                                Hazır Stiller
                            </button>
                            <button
                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                                    activeTab === 'custom'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                                onClick={() => setActiveTab('custom')}
                            >
                                Özel Renkler
                            </button>
                        </div>

                        {/* Hazır Stiller */}
                        {activeTab === 'presets' && (
                            <div className="grid grid-cols-2 gap-2">
                                {presetStyles.map((preset, i) => (
                                    <button
                                        key={i}
                                        className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                            isPresetSelected(preset)
                                                ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                        onClick={() => applyPresetColors(preset)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded-full border border-white shadow-sm"
                                                style={{ backgroundColor: preset.color }}
                                            />
                                            <div
                                                className="w-4 h-4 rounded border border-gray-200"
                                                style={{ backgroundColor: preset.iconBg }}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${
                                            isPresetSelected(preset) ? 'text-blue-700' : 'text-gray-700'
                                        }`}>
                                            {preset.name}
                                        </span>
                                        {isPresetSelected(preset) && (
                                            <div className="ml-auto">
                                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Özel Renkler */}
                        {activeTab === 'custom' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">Buton Rengi</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={link.color}
                                            onChange={e => onUpdate(link.id, "color", e.target.value)}
                                            className="w-10 h-10 border-0 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={link.color}
                                            onChange={e => onUpdate(link.id, "color", e.target.value)}
                                            className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded-lg"
                                            placeholder="#3b82f6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">Metin Rengi</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={link.textColor || "#ffffff"}
                                            onChange={e => onUpdate(link.id, "textColor", e.target.value)}
                                            className="w-10 h-10 border-0 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={link.textColor || "#ffffff"}
                                            onChange={e => onUpdate(link.id, "textColor", e.target.value)}
                                            className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded-lg"
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">İkon Arkaplan</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={link.iconBg}
                                            onChange={e => onUpdate(link.id, "iconBg", e.target.value)}
                                            className="w-10 h-10 border-0 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={link.iconBg}
                                            onChange={e => onUpdate(link.id, "iconBg", e.target.value)}
                                            className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded-lg"
                                            placeholder="#ffffff"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-2">İkon Rengi</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={link.iconColor}
                                            onChange={e => onUpdate(link.id, "iconColor", e.target.value)}
                                            className="w-10 h-10 border-0 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={link.iconColor}
                                            onChange={e => onUpdate(link.id, "iconColor", e.target.value)}
                                            className="flex-1 px-2 py-2 text-xs border border-gray-200 rounded-lg"
                                            placeholder="#3b82f6"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Önizleme */}
                        <div className="pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-600 mb-2">Önizleme:</div>
                            <div
                                className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-300"
                                style={{ backgroundColor: link.color }}
                            >
                                <div
                                    className="w-8 h-8 flex items-center justify-center rounded-lg"
                                    style={{ backgroundColor: link.iconBg }}
                                >
                                    <FontAwesomeIcon
                                        icon={iconOptions.find(x => x.name === link.icon)?.icon || faLink}
                                        className="w-4 h-4"
                                        style={{ color: link.iconColor }}
                                    />
                                </div>
                                <span
                                    className="font-medium"
                                    style={{ color: link.textColor || "#ffffff" }}
                                >
                                    {link.label || "Örnek Başlık"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}