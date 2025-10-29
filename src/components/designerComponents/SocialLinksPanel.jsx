import React, { useState } from 'react';
import { Plus, X, ExternalLink, Users, Eye, EyeOff } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { socialPlatforms } from '@/components/profileEditor/Constants.js';
import { useProfileSave } from '@/context/ProfileSaveContext.jsx';

const SocialLinksPanel = ({
    socialLinks = [],
    onSocialLinksUpdate
}) => {
    const [showAddMenu, setShowAddMenu] = useState(false);
    const { deleteActionLink } = useProfileSave();

    // Action link ekleme
    const handleAddActionLink = (platform) => {
        const newActionLink = {
            id: Date.now(), // Geçici ID - backend'de gerçek ID alınacak
            label: platform.name,
            original_url: platform.baseUrl,
            short_url: '', // Backend tarafından generate edilecek
            icon: platform.id, // Sadece icon adı
            settings: {
                color: platform.color,
                visible: true
            },
            order: socialLinks.length,
            is_active: true,
            _new: true // Yeni eklenen item olduğunu belirtmek için
        };

        onSocialLinksUpdate([...socialLinks, newActionLink]);
        setShowAddMenu(false);
    };

    // Action link silme
    const handleRemoveActionLink = (linkId) => {

        //  deleteActionLink bunu kullanarak istek atcaz

        deleteActionLink(linkId).then(() => {
            console.log("Aksiyon linki silindi:", linkId);
        }).catch((error) => {
            console.error("Aksiyon linki silinirken hata oluştu:", error);
        });

        onSocialLinksUpdate(socialLinks.filter(link => link.id !== linkId));
    };

    // URL güncelleme
    const handleUpdateUrl = (linkId, newUrl) => {
        onSocialLinksUpdate(
            socialLinks.map(link =>
                link.id === linkId
                    ? { ...link, original_url: newUrl }
                    : link
            )
        );
    };

    // Label güncelleme
    const handleUpdateLabel = (linkId, newLabel) => {
        onSocialLinksUpdate(
            socialLinks.map(link =>
                link.id === linkId
                    ? { ...link, label: newLabel }
                    : link
            )
        );
    };

    // Görünürlük toggle
    const handleToggleVisibility = (linkId) => {
        onSocialLinksUpdate(
            socialLinks.map(link =>
                link.id === linkId
                    ? {
                        ...link,
                        settings: {
                            ...link.settings,
                            visible: !link.settings?.visible
                        },
                        // is_active da güncellenmeli
                        is_active: link.settings?.visible // eski değer
                            ? false // eğer görünürse kapatınca pasif olmalı
                            : true // görünmezse açınca aktif olmalı
                    }
                    : link
            )
        );
    };


    // Renk güncelleme
    const handleUpdateColor = (linkId, newColor) => {
        onSocialLinksUpdate(
            socialLinks.map(link =>
                link.id === linkId
                    ? {
                        ...link,
                        settings: {
                            ...link.settings,
                            color: newColor
                        }
                    }
                    : link
            )
        );
    };

    // Platform verilerini getir
    const getPlatformData = (iconName) => {
        return socialPlatforms.find(p => p.id === iconName);
    };

    // Eklenmiş platformları filtrele
    const getAvailablePlatforms = () => {
        const usedPlatforms = socialLinks.map(link => link.icon);
        return socialPlatforms.filter(platform => !usedPlatforms.includes(platform.id));
    };

    // Aktif linklerin sayısını hesapla
    const getActiveLinksCount = () => {
        return socialLinks.filter(link => link.is_active && link.settings?.visible).length;
    };

    return (
        <div className="space-y-6 p-2 md:p-6">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Aksiyon butonları</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Profilinizde isminizin altında görünecek iletişim butonları tel, e-mail, konum vs.
                    </p>
                </div>
                <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                    <Users size={16} />
                    <span>{getActiveLinksCount()} Aktif</span>
                </div>
            </div>

            {/* Bilgi Notu */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Users className="text-amber-600" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-amber-900 text-sm mb-1">Aksiyon butonları İpucu</h4>
                    <p className="text-sm text-amber-700">
                        Aksiyon butonu ikonları profilinizin üst kısmında, isminizin altında görünür.
                        Her platform için özel renk seçebilir ve görünürlüğünü kontrol edebilirsiniz.
                    </p>
                </div>
            </div>

            {/* Action Link Ekle Butonu */}
            <div className="relative">
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                >
                    <Plus size={20} />
                    <span>İletişim seçeneği ekle</span>
                </button>

                {/* Platform Seçim Menüsü */}
                {showAddMenu && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
                        <div className="p-3">
                            <div className="grid grid-cols-2 gap-2">
                                {getAvailablePlatforms().map((platform) => (
                                    <button
                                        key={platform.id}
                                        onClick={() => handleAddActionLink(platform)}
                                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                    >
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: platform.color + '20' }}
                                        >
                                            <FontAwesomeIcon
                                                icon={platform.icon}
                                                size="lg"
                                                style={{ color: platform.color }}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{platform.name}</div>
                                            <div className="text-xs text-gray-500">{platform.baseUrl}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {getAvailablePlatforms().length === 0 && (
                                <div className="text-center py-4 text-gray-500">
                                    <Users className="mx-auto mb-2 text-gray-400" size={32} />
                                    <p className="text-sm">Tüm platformlar eklendi</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Links Listesi */}
            {socialLinks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Users className="mx-auto text-gray-400 mb-3" size={48} />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Aksiyon butonu eklenmemiş
                    </h4>
                    <p className="text-sm text-gray-500 mb-4">
                        İlk aksiyon butonunuzu ekleyerek başlayın
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {socialLinks.map((link) => {
                        const platformData = socialPlatforms.find(p => p.id === link.icon);
                        const color = link.settings?.color || platformData?.color || '#6366F1';
                        const icon = platformData ? platformData.icon : null;
                        const isVisible = link.settings?.visible !== false;
                        const isActive = link.is_active !== false;

                        return (
                            <div
                                key={link.id}
                                className={`
                                    bg-white border-2 rounded-lg p-2 md:p-4 transition-all
                                    ${isVisible && isActive
                                    ? 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                    : 'border-gray-200 bg-gray-50 opacity-60'
                                }
                                `}
                            >
                                <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-center space-x-4">
                                    {/* Platform İkonu */}
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: color + '20' }}
                                    >
                                        {icon && (
                                            <FontAwesomeIcon
                                                icon={icon}
                                                size="lg"
                                                style={{ color: color }}
                                            />
                                        )}
                                    </div>

                                    {/* Platform Bilgileri */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2 mb-2">
                                            {/* Label Input */}
                                            <div>
                                                {!isVisible && (
                                                    <span className="inline-flex items-center px-2 py-0.5 mr-2  rounded text-xs font-medium bg-gray-200 text-gray-700">
                                                        Gizli
                                                    </span>
                                                )}
                                                <input
                                                    type="text"
                                                    value={link.label || ''}
                                                    onChange={(e) => handleUpdateLabel(link.id, e.target.value)}
                                                    placeholder="Label"
                                                    className="font-semibold text-gray-900 bg-transparent border-none p-0 focus:outline-none focus:ring-0"
                                                />

                                            </div>

                                        </div>

                                        {/* URL Input */}
                                        <input
                                            type="url"
                                            value={link.original_url || ''}
                                            onChange={(e) => handleUpdateUrl(link.id, e.target.value)}
                                            placeholder={`${link.label || 'Link'} URL'nizi girin`}
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />

                                        {/* Short URL Display (Read-only) */}
                                        {link.short_url && (
                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">Kısa URL: </span>
                                                <span className="text-xs text-blue-600 font-mono">{link.short_url}</span>
                                            </div>
                                        )}

                                        {/* Renk Seçici */}
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="text-xs text-gray-500">Renk:</span>
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => handleUpdateColor(link.id, e.target.value)}
                                                className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                                            />
                                            <span className="text-xs text-gray-500 font-mono">{color}</span>
                                        </div>
                                    </div>

                                    {/* Aksiyonlar */}
                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                        {/* Görünürlük Toggle */}
                                        <button
                                            onClick={() => handleToggleVisibility(link.id)}
                                            className={`
                                                p-2 rounded-lg transition-colors
                                                ${isVisible
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-100'
                                            }
                                            `}
                                            title={isVisible ? 'Gizle' : 'Göster'}
                                        >
                                            {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>

                                        {/* Test Linki */}
                                        {link.original_url && (
                                            <a
                                                href={link.original_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Linki Test Et"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                        )}

                                        {/* Sil */}
                                        <button
                                            onClick={() => handleRemoveActionLink(link.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SocialLinksPanel;

