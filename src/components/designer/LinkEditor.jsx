import React, { useState } from 'react';
import { toast } from '@/utils/toast';
import {
    X, Save, Link2, Type, FileText, Palette,
    Instagram, Twitter, Youtube, Mail, Globe,
    Github, Linkedin, Facebook, Music, ShoppingBag,
    Phone, MapPin, Calendar, Camera, Heart,
    Star, Zap, Coffee, Book, Briefcase, MessageCircle,
    ExternalLink, Check, Square, Circle, RectangleHorizontal, LinkIcon
} from 'lucide-react';

import { iconOptions } from "@/components/profileEditor/Constants.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileManagerModal from "@/components/common/FileManagerModal";
import { config } from '@/config';


// Twitch ikonu için basit bir SVG component
const TwitchIcon = ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
);

const LinkEditor = ({
    link,
    isOpen = false,
    onClose,
    onSave
}) => {
    const [editedLink, setEditedLink] = useState({
        label: '',
        description: '',
        original_url: '',
        short_url: '',
        visualType: 'icon', // 'icon', 'image', 'none'
        customImageUrl: '',
        icon: 'external',
        iconColor: '#FFFFFF',
        iconSize: 24,
        iconBackground: false,
        iconBackgroundStyle: 'solid',
        buttonColor: '#1F2937',
        buttonTextColor: '#FFFFFF',
        buttonStyle: 'rounded',
        buttonShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        buttonBorderWidth: 0,
        buttonBorderColor: '#e5e7eb',
        is_active: true,
        order: 0,
        settings: {}
    });

    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

    const [activeTab, setActiveTab] = useState('basic');

    // link prop'u değiştiğinde state'i güncelle
    React.useEffect(() => {
        if (link) {
            let settings = {};
            if (typeof link.settings === 'string') {
                try {
                    settings = JSON.parse(link.settings);
                } catch {
                    settings = {};
                }
            } else {
                settings = link.settings || {};
            }

            setEditedLink({
                ...link,
                label: link.label || link.title || '',
                original_url: link.original_url || link.url || '',
                description: link.description || '',
                visualType: settings.visualType || 'icon',
                customImageUrl: settings.customImageUrl || '',
                iconSize: settings.iconSize || 24,
                iconColor: settings.iconColor || link.iconColor,
                iconBackground: settings.iconBackground,
                iconBackgroundStyle: settings.iconBackgroundStyle || 'solid',
                visualRadius: settings.visualRadius || '0.5rem',
                buttonStyle: settings.buttonStyle || link.buttonStyle,
                buttonColor: settings.buttonColor || link.buttonColor,
                buttonTextColor: settings.buttonTextColor || link.buttonTextColor,
                buttonShadow: settings.buttonShadow || link.buttonShadow,
                buttonBorderWidth: settings.buttonBorderWidth ?? 0,
                buttonBorderColor: settings.buttonBorderColor || '#e5e7eb',
                is_active: link.is_active !== undefined ? link.is_active : (link.visible !== undefined ? link.visible : true),
                order: link.order || 0,
                settings: settings
            });
        } else {
            setEditedLink({
                label: '',
                description: '',
                original_url: '',
                short_url: '',
                visualType: 'icon',
                customImageUrl: '',
                icon: 'external',
                iconColor: undefined, // Inherit from theme
                iconSize: 24,
                iconBackground: false,
                visualRadius: '0.5rem',
                buttonColor: undefined, // Inherit from theme
                buttonStyle: undefined, // Inherit from theme
                buttonTextColor: undefined, // Inherit from theme
                buttonShadow: undefined, // Inherit from theme
                buttonBorderWidth: 0,
                buttonBorderColor: '#e5e7eb',
                is_active: true,
                order: 0,
                settings: {}
            });
        }
    }, [link]);

    const popularColors = [
        '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
        '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
        '#6B7280', '#1F2937', '#FFFFFF'
    ];

    const buttonStyles = [
        { id: 'rounded', name: 'Yuvarlatılmış', borderRadius: '0.5rem' },
        { id: 'square', name: 'Köşeli', borderRadius: '0.25rem' },
        { id: 'pill', name: 'Yuvarlak', borderRadius: '9999px' }
    ];

    // Using same logic for visual radius presets
    const visualRadiusStyles = [
        { id: 'rounded', name: 'Yuvarlatılmış', value: '0.5rem' },
        { id: 'square', name: 'Köşeli', value: '0px' },
        { id: 'pill', name: 'Yuvarlak', value: '9999px' }
    ];

    const iconBgStyles = [
        { id: 'rounded', name: 'Yuvarlatılmış', borderRadius: '0.5rem' },
        { id: 'square', name: 'Köşeli', borderRadius: '0.25rem' },
        { id: 'pill', name: 'Yuvarlak', borderRadius: '9999px' }
    ];

    const handleInputChange = (field, value) => {
        setEditedLink(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Görsel yükleme (Base64'e çevir)
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('customImageUrl', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (!editedLink.label.trim()) {
            toast.error('Link başlığı zorunludur!');
            return;
        }
        if (!editedLink.original_url.trim()) {
            toast.error('Link URL\'si zorunludur!');
            return;
        }

        let url = editedLink.original_url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const linkToSave = {
            ...editedLink,
            original_url: url,
            settings: {
                visualType: editedLink.visualType,
                customImageUrl: editedLink.customImageUrl,
                iconColor: editedLink.iconColor,
                iconBackground: editedLink.iconBackground,
                iconBackgroundStyle: editedLink.iconBackgroundStyle,
                iconSize: editedLink.iconSize,
                visualRadius: editedLink.visualRadius, // Save visual radius
                buttonColor: editedLink.buttonColor,
                buttonTextColor: editedLink.buttonTextColor,
                buttonStyle: editedLink.buttonStyle,
                buttonShadow: editedLink.buttonShadow,
                buttonBorderWidth: editedLink.buttonBorderWidth,
                buttonBorderColor: editedLink.buttonBorderColor
            }
        };

        onSave(linkToSave);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[400px] md:max-w-2xl max-h-[85vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {link ? 'Link Düzenle' : 'Yeni Link Ekle'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
                    <div className="flex w-full border-b border-gray-200 md:px-6 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'basic', name: 'Temel Bilgiler', icon: Type },
                            { id: 'visual', name: 'Görsel Ayarları', icon: Palette },
                            { id: 'button', name: 'Buton Tasarımı', icon: Square },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center min-w-[160px] px-4 py-3 truncate text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-[#010101] text-[#010101]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="flex items-center justify-center min-w-[40px] min-h-[40px]">
                                    <tab.icon size={24} className="mr-2" />
                                </span>
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {/* Temel Bilgiler */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Başlığı *</label>
                                    <input
                                        type="text"
                                        value={editedLink.label}
                                        onChange={(e) => handleInputChange('label', e.target.value)}
                                        placeholder="Örn: Instagram Profilim"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#010101] focus:border-[#010101]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Link URL'si *</label>
                                    <input
                                        type="url"
                                        value={editedLink.original_url}
                                        onChange={(e) => handleInputChange('original_url', e.target.value)}
                                        placeholder="https://instagram.com/kullaniciadi"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#010101] focus:border-[#010101]"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Açıklama (İsteğe Bağlı)</label>
                                        <span className={`text-xs ${(editedLink.description || '').length > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                                            {(editedLink.description || '').length}/60
                                        </span>
                                    </div>
                                    <textarea
                                        value={editedLink.description || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 60) handleInputChange('description', e.target.value);
                                        }}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#010101] focus:border-[#010101] resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Görsel Ayarları */}
                        {activeTab === 'visual' && (
                            <div className="space-y-6">
                                {/* Görsel Tipi Seçimi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Görsel Tipi</label>
                                    <div className="flex space-x-4">
                                        {[
                                            { id: 'icon', label: 'İkon Seç' },
                                            { id: 'image', label: 'Resim Yükle' },
                                            { id: 'none', label: 'Yok' }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => handleInputChange('visualType', type.id)}
                                                className={`px-4 py-2 rounded-lg border-2 transition-all ${editedLink.visualType === type.id
                                                    ? 'border-[#010101] bg-[#efefef] text-[#010101] font-medium'
                                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {editedLink.visualType === 'icon' && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">İkon Seç</label>
                                            <div className="grid grid-cols-5 md:grid-cols-7 gap-3">
                                                {iconOptions.map(iconOption => (
                                                    <button
                                                        key={iconOption.name}
                                                        onClick={() => {
                                                            handleInputChange('icon', iconOption.name);
                                                            handleInputChange('iconColor', iconOption.color || '#6366F1');
                                                        }}
                                                        className={`p-3 rounded-lg border-2 flex justify-center transition-all ${editedLink.icon === iconOption.name
                                                            ? 'border-[#010101] bg-[#efefef]'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <FontAwesomeIcon icon={iconOption.icon} size="lg" style={{ color: iconOption.color }} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">İkon Rengi</label>
                                            <div className="flex items-start space-x-3">
                                                <input
                                                    type="color"
                                                    value={editedLink.iconColor}
                                                    onChange={(e) => handleInputChange('iconColor', e.target.value)}
                                                    className="w-12 h-12 border-gray-300 rounded-lg cursor-pointer"
                                                />
                                                <div className="grid w-full grid-cols-5 md:grid-cols-10 gap-2">
                                                    {popularColors.map(color => (
                                                        <button
                                                            key={color}
                                                            onClick={() => handleInputChange('iconColor', color)}
                                                            className={`w-10 h-10 rounded-lg border-2 ${editedLink.iconColor === color ? 'border-blue-600' : 'border-gray-200'}`}
                                                            style={{ backgroundColor: color }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={editedLink.iconBackground}
                                                    onChange={(e) => handleInputChange('iconBackground', e.target.checked)}
                                                    className="w-4 h-4 text-[#010101] rounded border-gray-300 focus:ring-[#010101]"
                                                />
                                                <span className="text-sm font-medium text-gray-700">İkon Arkaplanı Olsun</span>
                                            </label>
                                        </div>
                                    </>
                                )}

                                {editedLink.visualType === 'image' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Görsel Yükle</label>
                                        <div className="flex items-center space-x-4">
                                            {editedLink.customImageUrl && (
                                                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={editedLink.customImageUrl.startsWith('/storage')
                                                            ? config.API_BASE_URL + editedLink.customImageUrl
                                                            : editedLink.customImageUrl
                                                        }
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        onClick={() => handleInputChange('customImageUrl', '')}
                                                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            )}
                                            <div
                                                onClick={() => setIsFileManagerOpen(true)}
                                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                            >
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Camera className="w-8 h-8 mb-4 text-gray-500" />
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Resim yüklemek için tıkla</span></p>
                                                    <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* Görsel Köşeleri Kontrolü */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Görsel Köşeleri</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {visualRadiusStyles.map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => handleInputChange('visualRadius', style.value)}
                                                className={`p-3 border-2 rounded-lg transition-all ${editedLink.visualRadius === style.value ? 'border-[#010101] bg-[#efefef]' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <div className="text-center">
                                                    <div className="mx-auto mb-2 w-8 h-8 bg-gray-300 border border-gray-400" style={{ borderRadius: style.value }} />
                                                    <span className="text-xs font-medium">{style.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Buton Ayarları */}
                        {activeTab === 'button' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Buton Stili</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {buttonStyles.map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => handleInputChange('buttonStyle', style.id)}
                                                className={`p-4 border-2 rounded-lg transition-all ${editedLink.buttonStyle === style.id ? 'border-[#010101] bg-[#efefef]' : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="text-center">
                                                    <div className="mx-auto mb-2 w-16 h-8 bg-gray-300" style={{ borderRadius: style.borderRadius }} />
                                                    <span className="text-sm font-medium">{style.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Arkaplan Rengi</label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            value={editedLink.buttonColor}
                                            onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                                            className="w-12 h-12 border-gray-300 rounded-lg cursor-pointer"
                                        />
                                        <div className="flex-1 overflow-x-auto scrollbar-hide py-1">
                                            <div className="flex gap-2">
                                                {popularColors.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleInputChange('buttonColor', color)}
                                                        className={`w-10 h-10 flex-shrink-0 rounded-lg border-2 ${editedLink.buttonColor === color ? 'border-gray-600' : 'border-gray-200'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Yazı Rengi</label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            value={editedLink.buttonTextColor}
                                            onChange={(e) => handleInputChange('buttonTextColor', e.target.value)}
                                            className="w-12 h-12 border-gray-300 rounded-lg cursor-pointer"
                                        />
                                        <div className="flex-1 overflow-x-auto scrollbar-hide py-1">
                                            <div className="flex gap-2">
                                                {popularColors.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => handleInputChange('buttonTextColor', color)}
                                                        className={`w-10 h-10 flex-shrink-0 rounded-lg border-2 ${editedLink.buttonTextColor === color ? 'border-gray-600' : 'border-gray-200'}`}
                                                        style={{ backgroundColor: color }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kenarlık Ayarları (YENİ) */}
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Kenarlık Ayarları</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-2">Kalınlık</label>
                                            <div className="flex gap-2">
                                                {[0, 1, 2, 4].map(width => (
                                                    <button
                                                        key={width}
                                                        onClick={() => handleInputChange('buttonBorderWidth', width)}
                                                        className={`flex-1 py-2 text-sm font-medium rounded-md border ${editedLink.buttonBorderWidth === width
                                                            ? 'bg-[#010101] text-white border-[#010101]'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {width}px
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-2">Renk</label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="color"
                                                    value={editedLink.buttonBorderColor}
                                                    onChange={(e) => handleInputChange('buttonBorderColor', e.target.value)}
                                                    className="w-full h-10 rounded cursor-pointer border-gray-300"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Canlı Önizleme */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Önizleme</label>
                                    <div className="p-6 bg-gray-100 rounded-xl flex justify-center">
                                        <button
                                            className="w-full max-w-sm px-6 py-4 flex items-center justify-between transition-all"
                                            style={{
                                                backgroundColor: editedLink.buttonColor,
                                                color: editedLink.buttonTextColor,
                                                borderRadius: buttonStyles.find(s => s.id === editedLink.buttonStyle)?.borderRadius,
                                                boxShadow: editedLink.buttonShadow,
                                                borderWidth: `${editedLink.buttonBorderWidth}px`,
                                                borderColor: editedLink.buttonBorderColor
                                            }}
                                        >
                                            <div className="flex items-center">
                                                {/* Sol ikon/görsel */}
                                                {(editedLink.visualType === 'icon' || editedLink.visualType === 'image') && (
                                                    <div className="mr-3">
                                                        {editedLink.visualType === 'icon' && (
                                                            <div
                                                                className={`flex items-center justify-center w-8 h-8 ${editedLink.iconBackground ? 'bg-white/20' : ''}`}
                                                                style={{
                                                                    color: editedLink.iconColor,
                                                                    borderRadius: editedLink.visualRadius // Apply user selected radius
                                                                }}
                                                            >
                                                                {(() => {
                                                                    const IconComponent = iconOptions.find(opt => opt.id === editedLink.icon)?.icon || ExternalLink;
                                                                    return <FontAwesomeIcon icon={IconComponent} />;
                                                                })()}
                                                            </div>
                                                        )}
                                                        {editedLink.visualType === 'image' && editedLink.customImageUrl && (() => {
                                                            const url = editedLink.customImageUrl;
                                                            const baseUrl = config.API_BASE_URL;
                                                            let src = url;

                                                            if (url.startsWith('http://localhost/storage')) {
                                                                src = url.replace('http://localhost', baseUrl.replace(/\/$/, ''));
                                                            } else if (url.startsWith('/storage')) {
                                                                src = `${baseUrl.replace(/\/$/, '')}${url}`;
                                                            }

                                                            return (
                                                                <img
                                                                    src={src}
                                                                    alt=""
                                                                    className="w-10 h-10 object-cover border-2 border-white/30"
                                                                    style={{ borderRadius: editedLink.visualRadius }} // Apply user selected radius
                                                                />
                                                            );
                                                        })()}
                                                    </div>
                                                )}
                                                <span className="font-medium text-lg">{editedLink.label || 'Link Başlığı'}</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                        İptal
                    </button>
                    <button onClick={handleSave} className="inline-flex items-center px-4 py-2 text-white bg-[#010101] border border-transparent rounded-md shadow-sm hover:bg-gray-800">
                        <Save size={16} className="mr-2" />
                        Kaydet
                    </button>
                </div>
            </div >
            <FileManagerModal
                isOpen={isFileManagerOpen}
                onClose={() => setIsFileManagerOpen(false)}
                onSelect={(url) => handleInputChange('customImageUrl', url)}
                title="Link Görseli Seç"
            />
        </div >
    );
};

export default LinkEditor;

