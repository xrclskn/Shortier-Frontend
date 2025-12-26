import React, { useState, useEffect } from 'react';
import { toast } from '@/utils/toast';
import { X, Check, Search, Image as ImageIcon, Link as LinkIcon, AlertCircle, Trash2, ChevronDown } from 'lucide-react';
import { socialPlatforms, iconOptions } from '@/components/profileEditor/Constants.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileManagerModal from "@/components/common/FileManagerModal";
import { getImageUrl } from "@/utils/themeHelpers";

const ActionLinkModal = ({
    isOpen,
    onClose,
    onSave,
    initialData = null,
    onDelete
}) => {
    const [activeTab, setActiveTab] = useState('general'); // general, visual
    const [formData, setFormData] = useState({
        platform: 'custom',
        label: '',
        url: '',
        icon: '',
        visualType: 'icon', // 'icon', 'image'
        customImageUrl: '',
        customIcon: '',
        settings: {
            color: '#000000',
            visible: true
        }
    });

    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Reset or Load data
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Safety check for settings - can be a JSON string or object
                let parsedSettings = {};
                try {
                    if (typeof initialData.settings === 'string') {
                        parsedSettings = JSON.parse(initialData.settings);
                    } else if (typeof initialData.settings === 'object' && initialData.settings !== null) {
                        parsedSettings = initialData.settings;
                    }
                } catch (e) {
                    console.error("Error parsing settings:", e);
                }

                setFormData({
                    platform: initialData.platform || 'custom',
                    label: initialData.label || '',
                    url: initialData.original_url || '',
                    icon: initialData.icon || '',
                    visualType: parsedSettings.visualType || 'icon',
                    customImageUrl: parsedSettings.customImageUrl || '',
                    customIcon: parsedSettings.customIcon || '',
                    settings: {
                        color: parsedSettings.color || '#000000',
                        visible: parsedSettings.visible !== false,
                        viewSize: parsedSettings.viewSize || 'medium', // Default medium
                        backgroundColor: parsedSettings.backgroundColor || '#ffffff',
                        padding: parsedSettings.padding || '0',
                        viewStyle: parsedSettings.viewStyle || 'solid', // Added from user's snippet
                        viewRadius: parsedSettings.viewRadius || 'circle', // Added from user's snippet
                        ...parsedSettings
                    }
                });

                // Try to infer platform from the icon ID if it matches a known platform
                const matchedPlatform = socialPlatforms.find(p => p.id === initialData.icon);
                if (matchedPlatform) {
                    setFormData(prev => ({ ...prev, platform: matchedPlatform.id }));
                }

            } else {
                // New link defaults
                setFormData({
                    platform: 'instagram',
                    label: '',
                    url: '',
                    icon: 'instagram',
                    visualType: 'icon',
                    customImageUrl: '',
                    customIcon: '',
                    settings: {
                        color: socialPlatforms.find(p => p.id === 'instagram')?.color || '#E1306C',
                        visible: true
                    }
                });
            }
            setActiveTab('general');
        }
    }, [isOpen, initialData]);

    const handlePlatformSelect = (platformId) => {
        const platform = socialPlatforms.find(p => p.id === platformId);
        setFormData(prev => ({
            ...prev,
            platform: platformId,
            icon: platformId,
            label: platform?.name || '',
            settings: {
                ...prev.settings,
                color: platform?.color || '#000000'
            }
        }));
    };

    const handleSave = () => {
        // Validation
        if (!formData.url) {
            toast.error('Lütfen bir URL girin');
            return;
        }

        const platform = socialPlatforms.find(p => p.id === formData.platform);

        let finalUrl = formData.url.trim();
        if (platform) {
            if (platform.id === 'phone' && !finalUrl.startsWith('tel:')) {
                finalUrl = `tel:${finalUrl}`;
            } else if (platform.id === 'email' && !finalUrl.startsWith('mailto:')) {
                finalUrl = `mailto:${finalUrl}`;
            } else if (platform.id === 'whatsapp' && /^[0-9+]+$/.test(finalUrl.replace(/\s/g, ''))) {
                // If it looks like just a number (digits/plus), prepend wa.me
                finalUrl = `https://wa.me/${finalUrl.replace(/[^0-9]/g, '')}`;
            }
        }

        const LinkData = {
            ...initialData,
            label: formData.label || platform?.name || 'Link',
            original_url: finalUrl,
            icon: formData.icon, // This is the platform ID essentially
            settings: {
                ...formData.settings,
                visualType: formData.visualType,
                customImageUrl: formData.customImageUrl,
                customIcon: formData.customIcon,
            }
        };

        onSave(LinkData);
        onClose();
    };

    const handleImageSelect = (fileOrUrl) => {
        const url = typeof fileOrUrl === 'string' ? fileOrUrl : fileOrUrl.url;
        setFormData(prev => ({
            ...prev,
            visualType: 'image',
            customImageUrl: url
        }));
        setIsFileManagerOpen(false);
    };

    if (!isOpen) return null;

    // Filter icons for custom icon selector
    const filteredIcons = iconOptions.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <h3 className="text-lg font-bold text-gray-900">
                        {initialData ? 'Aksiyon Linkini Düzenle' : 'Yeni Aksiyon Linki'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general' ? 'border-[#010101] text-[#010101]' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Genel Ayarlar
                    </button>
                    <button
                        onClick={() => setActiveTab('visual')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'visual' ? 'border-[#010101] text-[#010101]' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Görünüm & İkon
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            {/* Platform Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-48 overflow-y-auto p-1">
                                    {socialPlatforms.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => handlePlatformSelect(p.id)}
                                            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all ${formData.platform === p.id
                                                ? 'border-[#010101] bg-[#efefef]'
                                                : 'border-transparent hover:bg-gray-50'
                                                }`}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
                                                style={{ backgroundColor: formData.platform === p.id ? p.color : '#f3f4f6' }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={p.icon}
                                                    className={formData.platform === p.id ? 'text-white' : 'text-gray-500'}
                                                />
                                            </div>
                                            <span className="text-[10px] text-gray-600 truncate w-full text-center">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* URL Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder={socialPlatforms.find(p => p.id === formData.platform)?.placeholder || "https://example.com/username"}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                {socialPlatforms.find(p => p.id === formData.platform)?.baseUrl && (
                                    <p className="text-xs text-gray-500 mt-1">Örnek: {socialPlatforms.find(p => p.id === formData.platform)?.baseUrl}</p>
                                )}
                            </div>

                            {/* Label Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Etiket (İsteğe Bağlı)</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    placeholder="Örn: Instagram Hesabım"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'visual' && (
                        <div className="space-y-6">
                            {/* Visual Type Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setFormData({ ...formData, visualType: 'icon' })}
                                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${formData.visualType === 'icon'
                                        ? 'border-[#010101] bg-[#efefef]'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#010101] text-white flex items-center justify-center">
                                        <div className="w-5 h-5 bg-current rounded-full" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900">İkon</div>
                                        <div className="text-xs text-gray-500">Platform ikonu veya özel ikon</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setFormData({ ...formData, visualType: 'image' })}
                                    className={`p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${formData.visualType === 'image'
                                        ? 'border-[#010101] bg-[#efefef]'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#010101] text-white flex items-center justify-center">
                                        <ImageIcon size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold text-gray-900">Özel Görsel</div>
                                        <div className="text-xs text-gray-500">Kendi görselinizi yükleyin</div>
                                    </div>
                                </button>
                            </div>

                            <hr className="border-gray-100" />

                            {/* NEW: Per-Link Style Controls */}
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Görünüm Ayarları</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Style */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stil</label>
                                        <div className="relative">
                                            <select
                                                value={formData.settings.viewStyle || 'solid'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, settings: { ...prev.settings, viewStyle: e.target.value } }))}
                                                className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all pr-10 cursor-pointer"
                                            >
                                                <option value="solid">Renkli</option>
                                                <option value="outline">Çizgili</option>
                                                <option value="transparent">Şeffaf</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Radius */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Köşeler</label>
                                        <div className="relative">
                                            <select
                                                value={formData.settings.viewRadius || 'circle'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, settings: { ...prev.settings, viewRadius: e.target.value } }))}
                                                className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all pr-10 cursor-pointer"
                                            >
                                                <option value="square">Kare</option>
                                                <option value="rounded">Oval</option>
                                                <option value="circle">Yuvarlak</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                    {/* Size */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Boyut</label>
                                        <div className="relative">
                                            <select
                                                value={formData.settings.viewSize || 'medium'}
                                                onChange={(e) => setFormData(prev => ({ ...prev, settings: { ...prev.settings, viewSize: e.target.value } }))}
                                                className="w-full appearance-none px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all pr-10 cursor-pointer"
                                            >
                                                <option value="small">Küçük</option>
                                                <option value="medium">Orta</option>
                                                <option value="large">Büyük</option>
                                            </select>
                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Content based on type */}
                            {formData.visualType === 'image' ? (
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Görsel Seçimi</label>

                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                            {formData.customImageUrl ? (
                                                <img
                                                    src={getImageUrl(formData.customImageUrl)}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => setIsFileManagerOpen(true)}
                                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Görsel Seç / Yükle
                                            </button>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Önerilen boyut: 120x120px. PNG, JPG veya WEBP.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700">İkon Seçimi</label>
                                        <div className="relative w-48">
                                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="İkon ara..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Default Platform Icon Option (First Item) */}
                                    <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto p-1">
                                        <button
                                            onClick={() => setFormData({ ...formData, customIcon: '' })} // Adding null checks in rendering is important
                                            className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-all ${!formData.customIcon ? 'border-[#010101] bg-[#efefef] ring-1 ring-[#010101]' : 'border-gray-100'
                                                }`}
                                            title="Varsayılan Platform İkonu"
                                        >
                                            <div style={{ color: formData.settings.color }}>
                                                {/* Use the platform icon */}
                                                <FontAwesomeIcon
                                                    icon={socialPlatforms.find(p => p.id === formData.platform)?.icon || ['fas', 'link']}
                                                    size="lg"
                                                />
                                            </div>
                                            <span className="text-[9px] text-gray-500 w-full truncate text-center">Varsayılan</span>
                                        </button>

                                        {filteredIcons.map(icon => (
                                            <button
                                                key={icon.name}
                                                onClick={() => setFormData({ ...formData, customIcon: icon.name })}
                                                className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-all ${formData.customIcon === icon.name ? 'border-[#010101] bg-[#efefef] ring-1 ring-[#010101]' : 'border-gray-100'
                                                    }`}
                                                title={icon.name}
                                            >
                                                <FontAwesomeIcon icon={icon.icon} className="text-gray-700" size="lg" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <hr className="border-gray-100" />

                            {/* COLORS & PADDING - ALWAYS VISIBLE */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Icon/Text Color - Only show if NOT image, OR if we decide image borders/text need color */}
                                    {formData.visualType !== 'image' && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">İkon Rengi</label>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={formData.settings.color || '#000000'}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        settings: { ...formData.settings, color: e.target.value }
                                                    })}
                                                    className="w-10 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer"
                                                />
                                                <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                                    {formData.settings.color || '#000000'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Background Color */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Arkaplan Rengi</label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={formData.settings.backgroundColor || '#ffffff'}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    settings: { ...formData.settings, backgroundColor: e.target.value }
                                                })}
                                                className="w-10 h-10 p-1 rounded-lg border border-gray-200 cursor-pointer"
                                            />
                                            <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                                {formData.settings.backgroundColor || '#ffffff'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Padding Control */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-sm font-medium text-gray-700">İç Boşluk (Padding)</label>
                                        <span className="text-xs text-gray-500">{formData.settings.padding || '0'}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        step="2"
                                        value={formData.settings.padding || '0'}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            settings: { ...formData.settings, padding: e.target.value }
                                        })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    {initialData ? (
                        <button
                            onClick={() => onDelete && onDelete(initialData.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50"
                        >
                            <Trash2 size={16} />
                            Sil
                        </button>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 text-sm font-bold text-white bg-[#010101] hover:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center gap-2"
                        >
                            <Check size={18} />
                            Kaydet
                        </button>
                    </div>
                </div>
            </div>

            <FileManagerModal
                isOpen={isFileManagerOpen}
                onClose={() => setIsFileManagerOpen(false)}
                onSelect={handleImageSelect}
            />
        </div>
    );
};

export default ActionLinkModal;
