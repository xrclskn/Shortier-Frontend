import React, { useState } from 'react';
import {
    X, Save, Link2, Type, FileText, Palette,
    Instagram, Twitter, Youtube, Mail, Globe,
    Github, Linkedin, Facebook, Music, ShoppingBag,
    Phone, MapPin, Calendar, Camera, Heart,
    Star, Zap, Coffee, Book, Briefcase, MessageCircle,
    ExternalLink, Check, Square, Circle, RectangleHorizontal, LinkIcon
} from 'lucide-react';

import {iconOptions} from "@/components/profileEditor/Constants.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// Twitch ikonu için basit bir SVG component
const TwitchIcon = ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
);

const LinkEditor = ({
                        link,
                        isOpen = false,
                        onClose,
                        onSave
                    }) => {
    const [editedLink, setEditedLink] = useState({
        id: Date.now(),
        label: '',
        description: '',
        original_url: '',
        short_url: '',
        icon: 'external',
        // Burada ikon rengi seçili olarak gelen renk default olsun eğer veritabanında yoksa beyaz olsun default
        iconColor: '#6366F1',
        iconSize : 24,
        iconBackground: false,
        buttonColor: '#6366F1',
        buttonTextColor: '#FFFFFF',
        buttonStyle: 'rounded',
        buttonShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        is_active: true,
        order: 0,
        settings: {}
    });

    const [activeTab, setActiveTab] = useState('basic');

    // link prop'u değiştiğinde state'i güncelle
    // LinkEditor.jsx içinde useEffect
    React.useEffect(() => {
        if (link) {
            // Düzenleme modunda mevcut id'yi kullan
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
                iconSize: settings.iconSize || 24,
                iconColor: settings.iconColor || link.iconColor || '#FFFFFF',
                iconBackground: settings.iconBackground,
                iconBackgroundStyle: settings.iconBackgroundStyle || 'solid',
                buttonStyle: settings.buttonStyle || link.buttonStyle || 'rounded',
                buttonColor: settings.buttonColor || link.buttonColor || '#1F2937',
                buttonTextColor: settings.buttonTextColor || link.buttonTextColor || '#FFFFFF',
                buttonShadow: settings.buttonShadow || link.buttonShadow || '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                is_active: link.is_active !== undefined ? link.is_active : (link.visible !== undefined ? link.visible : true),
                order: link.order || 0,
                settings: settings
            });
        } else {
            // Yeni link eklerken id: Date.now()
            setEditedLink({
                id: Date.now(),
                label: '',
                description: '',
                original_url: '',
                short_url: '',
                icon: 'external',
                iconColor: '#6366F1',
                iconSize: 24,
                iconBackground: false,
                buttonColor: '#6366F1',
                buttonStyle: 'rounded',
                buttonTextColor: '#FFFFFF',
                buttonShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                is_active: true,
                order: 0,
                settings: {}
            });
        }
    }, [link]);


    // Popüler İkon Renkleri
    const popularColors = [
        '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
        '#F59E0B', '#10B981', '#06B6D4', '#3B82F6',
        '#6B7280', '#1F2937', '#FFFFFF'
    ];

    // Buton Stil Seçenekleri
    const buttonStyles = [
        { id: 'rounded', name: 'Yuvarlatılmış', borderRadius: '0.5rem' },
        { id: 'square', name: 'Köşeli', borderRadius: '0.25rem' },
        { id: 'pill', name: 'Yuvarlak', borderRadius: '9999px' }
    ];

    const iconBgStyles = [
        { id: 'rounded', name: 'Yuvarlatılmış', borderRadius: '0.5rem' },
        { id: 'square', name: 'Köşeli', borderRadius: '0.25rem' },
        { id: 'pill', name: 'Yuvarlak', borderRadius: '9999px' }
    ];

    // Form alanlarını güncelle
    const handleInputChange = (field, value) => {
        setEditedLink(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Kaydetme işlemi
    const handleSave = () => {
        if (!editedLink.label.trim()) {
            alert('Link başlığı zorunludur!');
            return;
        }
        if (!editedLink.original_url.trim()) {
            alert('Link URL\'si zorunludur!');
            return;
        }

        // URL formatını kontrol et
        let url = editedLink.original_url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const linkToSave = {
            ...editedLink,
            original_url: url,
            settings: {
                iconColor: editedLink.iconColor,
                iconBackground: editedLink.iconBackground,
                iconBackgroundStyle: editedLink.iconBackgroundStyle,
                iconSize: editedLink.iconSize,
                buttonColor: editedLink.buttonColor,
                buttonTextColor: editedLink.buttonTextColor,
                buttonStyle: editedLink.buttonStyle,
                buttonShadow: editedLink.buttonShadow
            }
        };

        onSave(linkToSave);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[400px] md:max-w-2xl max-h-[80vh] overflow-hidden">
                {/* Header */}
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

                <div className="overflow-y-auto max-h-[calc(70vh-120px)]">
                    {/* Tab Navigation */}
                    <div className="flex w-full border-b border-gray-200 md:px-6 overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'basic', name: 'Temel Bilgiler', icon: Type },
                            { id: 'icon', name: 'İkon Ayarları', icon: Palette },
                            { id: 'button', name: 'Buton Ayarları', icon: Square },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center min-w-[160px] px-4 py-3 truncate text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
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
                        {/* Temel Bilgiler Tab */}
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                {/* Başlık */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Başlığı *
                                    </label>
                                    <input
                                        type="text"
                                        value={editedLink.label}
                                        onChange={(e) => handleInputChange('label', e.target.value)}
                                        placeholder="Örn: Instagram Profilim"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link URL'si *
                                    </label>
                                    <input
                                        type="url"
                                        value={editedLink.original_url}
                                        onChange={(e) => handleInputChange('original_url', e.target.value)}
                                        placeholder="https://instagram.com/kullaniciadi"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Açıklama */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Açıklama (İsteğe Bağlı)
                                        </label>
                                        <span className={`text-xs ${
                                            (editedLink.description || '').length > 50 
                                                ? 'text-red-500' 
                                                : (editedLink.description || '').length > 40 
                                                    ? 'text-yellow-500' 
                                                    : 'text-gray-500'
                                        }`}>
                                            {(editedLink.description || '').length}/60
                                        </span>
                                    </div>
                                    <textarea
                                        value={editedLink.description || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 60) {
                                                handleInputChange('description', e.target.value);
                                            }
                                        }}
                                        placeholder="Link hakkında kısa bir açıklama..."
                                        rows={3}
                                        maxLength="60"
                                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none ${
                                            (editedLink.description || '').length > 50
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300'
                                        }`}
                                    />
                                    {(editedLink.description || '').length > 50 && (
                                        <p className="text-xs text-red-500 mt-1">
                                            Karakter sınırına yaklaşıyorsunuz ({60 - (editedLink.description || '').length} karakter kaldı)
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* İkon Ayarları Tab */}
                        {activeTab === 'icon' && (
                            <div className="space-y-6">
                                {/* İkon Seçimi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        İkon Seç
                                    </label>
                                    <div className="grid grid-cols-5 md:grid-cols-7 gap-3">
                                        {iconOptions.map(iconOption => (
                                            <button
                                                key={iconOption.name}
                                                onClick={() => {
                                                    handleInputChange('icon', iconOption.name);
                                                    handleInputChange('iconColor', iconOption.color || '#6366F1');
                                                }}
                                                className={`p-3 rounded-lg border-2 flex justify-center transition-all ${
                                                    editedLink.icon === iconOption.name
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                title={iconOption.label}
                                            >
                                                <FontAwesomeIcon
                                                    icon={iconOption.icon}
                                                    size="lg"
                                                    style={{ color: iconOption.color }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* İkon Rengi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        İkon Rengi
                                    </label>
                                    <div className="flex  items-start space-x-3">
                                        <div className="w-25">
                                            <input
                                                type="color"
                                                value={editedLink.iconColor}
                                                onChange={(e) => handleInputChange('iconColor', e.target.value)}
                                                className="w-12 h-12  border-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <label htmlFor="">{ editedLink.iconColor }</label>
                                        </div>
                                        <div className="grid w-full grid-cols-5 md:grid-cols-10 gap-2">
                                            {popularColors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => handleInputChange('iconColor', color)}
                                                    className={`w-10 h-10 rounded-lg border-2 ${
                                                        editedLink.iconColor === color ? 'border-blue-600' : 'border-gray-200'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        İkon Boyutu
                                    </label>
                                    <input
                                        type="range"
                                        min={16}
                                        max={64}
                                        value={editedLink.iconSize}
                                        onChange={e => handleInputChange('iconSize', Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="text-sm mt-2">Seçilen boyut: {editedLink.iconSize}px</div>
                                </div>

                                {/* İkon Arkaplan */}
                                <div>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={editedLink.iconBackground}
                                                onChange={(e) => handleInputChange('iconBackground', e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-11 h-6 rounded-full transition-colors ${
                                                editedLink.iconBackground ? 'bg-blue-600' : 'bg-gray-300'
                                            }`}>
                                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                    editedLink.iconBackground ? 'translate-x-5' : 'translate-x-0'
                                                }`} />
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            İkon Arkaplanı Olsun
                                        </span>
                                    </label>
                                </div>

                                {/* ikon arkaplanları için border radius belirlenebilsin istiyorum. */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        İkon Arkaplanı Stil
                                    </label>
                                    <div className="flex w-full space-x-3">
                                        {iconBgStyles.map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => handleInputChange('iconBackgroundStyle', style.id)}
                                                className={`p-2 rounded-lg text-center ${
                                                    editedLink.iconBackgroundStyle === style.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200'
                                                }`}
                                            >
                                                <div
                                                    className="w-15 h-15 bg-gray-200"
                                                    style={{ borderRadius: style.borderRadius }}
                                                />
                                                <span className="text-xs">{style.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Önizleme
                                    </label>
                                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                                        <div
                                            className={`p-3 flex items-center justify-center`}
                                            style={{
                                                backgroundColor: editedLink.iconBackground ? '#E0E7FF' : 'transparent',
                                                borderRadius: editedLink.iconBackground
                                                    ? (iconBgStyles.find(s => s.id === editedLink.iconBackgroundStyle)?.borderRadius || '0.5rem')
                                                    : '0'
                                            }}
                                        >
                                            {(() => {
                                                const IconComponent = iconOptions.find(opt => opt.id === editedLink.icon)?.icon || ExternalLink;
                                                return <IconComponent size={editedLink.iconSize} style={{ color: editedLink.iconColor }} />;
                                            })()}
                                        </div>
                                    </div>
                                </div>




                            </div>
                        )}

                        {/* Buton Ayarları Tab */}
                        {activeTab === 'button' && (
                            <div className="space-y-6">
                                {/* Buton Stili */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Buton Stili
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {buttonStyles.map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => handleInputChange('buttonStyle', style.id)}
                                                className={`p-4 border-2 rounded-lg transition-all ${
                                                    editedLink.buttonStyle === style.id
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <div
                                                        className="mx-auto mb-2 w-16 h-8 bg-gray-300"
                                                        style={{ borderRadius: style.borderRadius }}
                                                    />
                                                    <span className="text-sm font-medium">{style.name}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Buton Arkaplan Rengi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Buton Arkaplan Rengi
                                    </label>
                                    <div className="flex items-start space-x-1">
                                       <div>
                                           <input
                                               type="color"
                                               value={editedLink.buttonColor}
                                               onChange={(e) => handleInputChange('buttonColor', e.target.value)}
                                               className="w-16 h-16  border-gray-300 rounded-lg cursor-pointer"
                                           />
                                           <label htmlFor="">{editedLink.buttonColor}</label>
                                       </div>
                                        <div className="grid w-full grid-cols-5 md:grid-cols-10 gap-2">
                                            {popularColors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => handleInputChange('buttonColor', color)}
                                                    className={`w-10 h-10 rounded-lg border-2 ${
                                                        editedLink.buttonColor === color ? 'border-gray-400' : 'border-gray-200'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Buton Yazı Rengi */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Buton Yazı Rengi
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            value={editedLink.buttonTextColor}
                                            onChange={(e) => handleInputChange('buttonTextColor', e.target.value)}
                                            className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                                        />
                                        <div className="grid grid-cols-6 gap-2">
                                            {popularColors.map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => handleInputChange('buttonTextColor', color)}
                                                    className={`w-10 h-10 rounded-lg border-2 ${
                                                        editedLink.buttonTextColor === color ? 'border-gray-400' : 'border-gray-200'
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Önizleme */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Önizleme
                                    </label>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <button
                                            className="w-full px-6 py-3 flex items-center justify-center space-x-3 transition-all"
                                            style={{
                                                backgroundColor: editedLink.buttonColor,
                                                color: editedLink.buttonTextColor,
                                                borderRadius: buttonStyles.find(s => s.id === editedLink.buttonStyle)?.borderRadius,
                                                boxShadow: editedLink.buttonShadow
                                            }}
                                        >
                                            <span className="font-medium">{editedLink.label || 'Örnek Buton'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Save size={16} className="mr-2" />
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkEditor;

