import React, { useState } from 'react';
import { Plus, X, ExternalLink, Users, Eye, EyeOff, Edit2, Phone, Settings, BarChart2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { socialPlatforms, iconOptions } from '@/components/profileEditor/Constants.js';
import { useProfileSave } from '@/context/ProfileSaveContext.jsx';
import ActionLinkModal from './ActionLinkModal';
import { getImageUrl } from "@/utils/themeHelpers";

const SocialLinksPanel = ({
    socialLinks = [],
    onSocialLinksUpdate,
    theme = {},
    onThemeUpdate
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState(null);
    const { deleteActionLink } = useProfileSave();
    const navigate = useNavigate();

    // Global Theme Settings Handlers
    const handleThemeChange = (key, value) => {
        if (onThemeUpdate) {
            onThemeUpdate({ [key]: value });
        }
    };

    // Open Modal for New Link
    const handleAddNew = () => {
        setEditingLink(null);
        setIsModalOpen(true);
    };

    // Open Modal for Edit
    const handleEdit = (link) => {
        setEditingLink(link);
        setIsModalOpen(true);
    };

    const lastSaveTime = React.useRef(0);

    // Save Link (New or Update)
    const handleSaveLink = (linkData) => {
        const now = Date.now();
        // Global throttle: ignore saves within 500ms of any previous save
        if (now - lastSaveTime.current < 500) {
            console.warn("Rapid save blocked");
            return;
        }
        lastSaveTime.current = now;

        if (editingLink) {
            // Update existing
            onSocialLinksUpdate(
                socialLinks.map(l => l.id === linkData.id ? { ...linkData, _changed: true } : l)
            );
        } else {
            // Add new
            // Duplicate check (stricter)
            const isDuplicate = socialLinks.some(l =>
                l._new &&
                l.original_url === linkData.original_url &&
                l.icon === linkData.icon
            );

            if (isDuplicate) {
                console.warn("Duplicate link content blocked");
                return;
            }

            const newLink = {
                ...linkData,
                id: now, // Use the captured 'now'
                order: socialLinks.length,
                is_active: true,
                _new: true
            };
            onSocialLinksUpdate([...socialLinks, newLink]);
        }
    };

    // Delete Link
    const handleDeleteLink = (linkId) => {
        if (!window.confirm('Bu aksiyon butonunu silmek istediğinizden emin misiniz?')) return;

        deleteActionLink(linkId).then(() => {
            console.log("Aksiyon linki silindi:", linkId);
        }).catch((error) => {
            console.error("Aksiyon linki silinemedi:", error);
        });

        onSocialLinksUpdate(socialLinks.filter(link => link.id !== linkId));
        if (editingLink && editingLink.id === linkId) {
            setIsModalOpen(false);
        }
    };

    // Toggle Visibility
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
                        is_active: link.settings?.visible ? false : true,
                        _changed: true
                    }
                    : link
            )
        );
    };

    const getActiveLinksCount = () => {
        return socialLinks.filter(link => link.is_active && link.settings?.visible).length;
    };

    return (
        <div className="space-y-6 p-2 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Aksiyon Butonları</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Profilinizde görünecek iletişim ikonlarını yönetin.
                    </p>
                </div>
                <div className="flex items-center space-x-2 bg-[#efefef] text-[#010101] px-3 py-2 rounded-lg text-sm font-medium">
                    <Users size={16} />
                    <span>{getActiveLinksCount()} Aktif</span>
                </div>
            </div>

            {/* Global Design Settings - REMOVED AS REQUESTED TO USE PER-LINK SETTINGS IN MODAL */}

            {/* List */}
            <div className="space-y-3">
                {socialLinks.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <Phone className="mx-auto text-gray-300 mb-3" size={40} />
                        <h4 className="font-semibold text-gray-900">Henüz aksiyon butonu eklenmemiş</h4>
                        <p className="text-gray-500 text-sm mt-1">İletişim kanallarınızı ekleyerek başlayın.</p>
                    </div>
                ) : (
                    socialLinks.map((link) => {
                        const platformData = socialPlatforms.find(p => p.id === link.icon);
                        // Fallback logic
                        const visualType = link.settings?.visualType || 'icon';
                        // User request: Default to black, avoid platform colors
                        const color = link.settings?.color || '#000000';
                        // Icon to show in LIST (just preview)
                        const listIcon = (() => {
                            if (visualType === 'image' && link.settings?.customImageUrl) {
                                return null;
                            }
                            if (link.settings?.customIcon) {
                                const customOpt = iconOptions.find(i => i.name === link.settings.customIcon);
                                return customOpt?.icon || platformData?.icon;
                            }
                            return platformData?.icon;
                        })();

                        const isVisible = link.settings?.visible !== false;

                        return (
                            <div
                                key={link.id}
                                className={`group bg-white border rounded-xl p-3 hover:border-[#010101] transition-all ${!isVisible ? 'opacity-60 bg-gray-50' : ''}`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        {/* List Preview Icon/Image */}
                                        <div
                                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100"
                                            style={{ backgroundColor: visualType === 'icon' ? (color + '15') : 'transparent' }}
                                        >
                                            {visualType === 'image' && link.settings?.customImageUrl ? (
                                                <img
                                                    src={getImageUrl(link.settings.customImageUrl)}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    alt=""
                                                />
                                            ) : (
                                                listIcon && (
                                                    <FontAwesomeIcon
                                                        icon={listIcon}
                                                        size="lg"
                                                        style={{ color: color }}
                                                    />
                                                )
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {link.label || (platformData?.name) || 'İsimsiz Link'}
                                            </h4>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {link.original_url || 'URL Yok'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {link.id && !String(link.id).startsWith('temp_') && (
                                            <button
                                                onClick={() => navigate(`/app/analytics/action/${link.id}`)}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="İstatistikler"
                                            >
                                                <BarChart2 size={18} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleToggleVisibility(link.id)}
                                            className={`p-2 rounded-lg transition-colors ${isVisible ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-gray-400'}`}
                                            title="Görünürlük"
                                        >
                                            {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(link)}
                                            className="p-2 text-[#010101] hover:bg-[#efefef] rounded-lg transition-colors"
                                            title="Düzenle"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteLink(link.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Add Button */}
            <button
                onClick={handleAddNew}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#010101] hover:text-[#010101] hover:bg-[#efefef] transition-all flex items-center justify-center gap-2"
            >
                <Plus size={20} />
                <span>Yeni Aksiyon Butonu Ekle</span>
            </button>

            {/* Modal */}
            <ActionLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLink}
                initialData={editingLink}
                onDelete={editingLink ? handleDeleteLink : undefined}
            />
        </div>
    );
};

export default SocialLinksPanel;
