import React, { useState } from 'react';
import { toast } from '@/utils/toast';
import {
    Plus,
    GripVertical,
    Eye,
    EyeOff,
    Edit2,
    Link2,
    X
} from 'lucide-react';
import { useProfileSave } from "@/context/ProfileSaveContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconOptions } from '@/components/profileEditor/Constants.js';

import { generateTempId } from "@/utils/idHelpers";

const LinkManager = ({
    links = [],
    onLinksUpdate,
    onEditLink,
    isPro = false,
    maxFreeLinks = 4,
}) => {
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    const { deleteLink, sortedLinks, linkVisibilityChange } = useProfileSave();

    // free kullanıcı limiti geçti mi?
    const limitReached = !isPro && links.length >= maxFreeLinks;

    // Yeni Link Ekle (detaylı editorle)
    const handleAddLink = () => {
        if (limitReached) return;

        const newLink = {
            id: generateTempId(),
            label: 'Yeni Link',
            description: '',
            original_url: 'https://',
            url: '',
            icon: '',
            iconColor: '#6B7280',
            buttonColor: '#6366F1',
            buttonTextColor: '#FFFFFF',
            buttonStyle: 'rounded',
            is_active: true,
            order: links.length + 1,
            settings: {},
            _changed: true,
            _isNew: true,
        };

        // Düzenleme modalını aç
        if (onEditLink) {
            onEditLink(newLink);
        } else {
            onLinksUpdate([...links, newLink]);
        }
    };

    // QuickAdd modal component
    const QuickAddModal = ({ open, onClose, onQuickAdd, iconOptions }) => {
        const [selected, setSelected] = useState(null);
        const [url, setUrl] = useState("");

        if (!open) return null;

        return (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                    <h4 className="text-lg font-semibold mb-4">Hızlı Link Ekle</h4>

                    {/* ikon grid */}
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {iconOptions.slice(0, 10).map(option => (
                            <button
                                key={option.name}
                                className={`flex flex-col items-center p-2 rounded-lg border ${selected === option.name
                                    ? "border-[#010101] bg-[#efefef]"
                                    : "border-transparent hover:bg-gray-100"
                                    }`}
                                onClick={() => setSelected(option.name)}
                            >
                                <span className="mb-1" style={{ color: option.color }}>
                                    <FontAwesomeIcon icon={option.icon} size="2x" />
                                </span>
                                <span className="text-xs text-slate-700">{option.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* URL inputu */}
                    {selected && (
                        <div className="mb-4">
                            <input
                                type="url"
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="https://profilin.com/username"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                            {url && (!url.startsWith("https://") || url.length < 12) && (
                                <div className="text-red-500 text-xs mt-2">
                                    Lütfen geçerli bir URL girin (https:// ile başlamalı ve en az 12 karakter olmalı).
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onClose}
                            className="px-3 py-2 rounded bg-gray-100 text-sm"
                        >
                            İptal
                        </button>

                        <button
                            disabled={
                                !selected ||
                                !url ||
                                !url.startsWith("https://") ||
                                url.length < 12
                            }
                            onClick={() => {
                                const option = iconOptions.find(opt => opt.name === selected);

                                onQuickAdd({
                                    id: generateTempId(),
                                    label: option.name,
                                    original_url: url,
                                    icon: option.name,
                                    is_active: true,
                                    order: 0,
                                    description: "",
                                    settings: {
                                        iconColor: option.color,
                                        iconBackground: true,
                                        iconSize: 28,
                                        buttonColor: option.color,
                                        buttonTextColor: "#FFFFFF",
                                    },
                                    _changed: true
                                });

                                setSelected(null);
                                setUrl("");
                                onClose();
                            }}
                            className="px-3 py-2 rounded bg-[#010101] text-white text-sm disabled:opacity-50 hover:bg-gray-800"
                        >
                            Ekle
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // QuickAdd sonucunu parent state'e yaz
    const handleQuickAdd = (newLink) => {
        if (limitReached) return;
        onLinksUpdate([
            ...links,
            { ...newLink, order: links.length + 1, _changed: true, _isNew: true, }
        ]);
    };

    // Link Sil
    const handleDeleteLink = async (linkId) => {
        if (!window.confirm('Bu linki silmek istediğinizden emin misiniz?')) return;

        const target = links.find(l => l.id === linkId);

        // 1) Eğer bu link daha kaydedilmemişse (_isNew true ise)
        if (target && target._isNew) {
            // sadece front'tan kaldır
            onLinksUpdate(links.filter(link => link.id !== linkId));
            return;
        }

        // 2) Kaydedilmiş link ise API'ye git
        try {
            await deleteLink(linkId);
            onLinksUpdate(links.filter(link => link.id !== linkId));
        } catch (error) {
            console.error("Link silinemedi:", error);
            toast.error("Link silinemedi. Lütfen tekrar deneyin.");
        }
    };

    // Görünürlük Değiştir
    const handleToggleVisibility = (linkId) => {
        // local state update
        onLinksUpdate(
            links.map(link =>
                link.id === linkId
                    ? { ...link, is_active: !link.is_active, _changed: true }
                    : link
            )
        );

        // backend update
        const link = links.find(l => l.id === linkId);
        if (link) {
            const newVisibility = !link.is_active;
            linkVisibilityChange(linkId, newVisibility).catch(error => {
                console.error("Link görünürlüğü değiştirilemedi:", error);
                toast.error("Link görünürlüğü değiştirilemedi. Lütfen tekrar deneyin.");
            });
        }
    };

    // Drag start
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    // Drag drop
    const handleDrop = async (dropIndex) => {
        if (draggedIndex === null) return;

        const newLinks = [...links];
        const draggedLink = newLinks[draggedIndex];

        newLinks.splice(draggedIndex, 1);
        newLinks.splice(dropIndex, 0, draggedLink);

        const updatedLinks = newLinks.map((link, idx) => ({
            ...link,
            order: idx + 1,
            _changed: true,
        }));

        setDraggedIndex(null);
        onLinksUpdate(updatedLinks);

        try {
            await sortedLinks(
                updatedLinks.map(link => ({
                    id: link.id,
                    order: link.order
                }))
            );
        } catch (error) {
            console.error("Sıralama güncellenemedi:", error);
        }
    };

    return (
        <div className="space-y-4">

            {/* Header + Butonlar */}
            <div className="flex flex-col gap-5 md:flex-row md:gap-0 md:items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Link Yönetimi</h3>
                    <p className="text-sm text-gray-500">
                        Linklerini sürükleyip sıralayabilir, düzenleyebilir veya gizleyebilirsin.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            if (!limitReached) setQuickAddOpen(true);
                        }}
                        disabled={limitReached}
                        className={
                            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm md:ml-2 " +
                            (limitReached
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "text-white bg-[#010101] hover:bg-gray-800")
                        }
                    >
                        <Plus size={16} className="mr-2" />
                        Hızlı Link Ekle
                    </button>

                    <button
                        onClick={handleAddLink}
                        disabled={limitReached}
                        className={
                            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md shadow-sm border " +
                            (limitReached
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-200"
                                : "text-white bg-[#010101] border-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500")
                        }
                    >
                        <Plus size={16} className="mr-2" />
                        Yeni Link Ekle
                    </button>
                </div>
            </div>

            {/* Limit uyarısı */}
            {limitReached && (
                <div className="rounded-md border border-amber-300 bg-amber-100 text-amber-800 text-sm p-4 leading-relaxed">
                    Ücretsiz planda en fazla {maxFreeLinks} link ekleyebilirsin. Daha fazla link eklemek için
                    abonelik satın alabilirsin.
                </div>
            )}

            {/* Quick Add Modal */}
            <QuickAddModal
                open={quickAddOpen}
                onClose={() => setQuickAddOpen(false)}
                onQuickAdd={handleQuickAdd}
                iconOptions={iconOptions}
            />

            {/* Link Listesi */}
            <div className="space-y-3">
                {links.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <Link2 size={48} className="mb-4 opacity-50" />
                        <p className="font-semibold text-slate-700">
                            Henüz link eklenmemiş
                        </p>
                        <p className="text-sm mt-1 text-slate-500">
                            İlk linkini eklemek için{" "}
                            <span className="font-medium text-[#010101]">"Yeni Link Ekle"</span>
                            {" "}butonuna tıkla.
                        </p>
                    </div>
                ) : (
                    links
                        .slice() // mutate etmemek için kopyala
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((link, index) => (
                            <div
                                key={link.id}
                                draggable
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={e => e.preventDefault()}
                                onDrop={() => handleDrop(index)}
                                className={`group bg-white border rounded-xl p-4 hover:border-[#010101] transition ${!link.is_active ? 'opacity-50' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    {/* soldaki kısım */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <GripVertical size={20} className="text-gray-300 mr-1" />

                                        <div className="flex items-center gap-2">
                                            <span
                                                className="inline-flex items-center justify-center h-8 w-8 rounded-full overflow-hidden"
                                                style={{
                                                    backgroundColor: '#E5E7EB',
                                                    color: '#000000'
                                                }}
                                            >
                                                {(() => {
                                                    let settings = {};
                                                    if (typeof link.settings === 'string') {
                                                        try { settings = JSON.parse(link.settings); } catch { settings = {}; }
                                                    } else {
                                                        settings = link.settings || {};
                                                    }

                                                    const visualType = settings.visualType || 'icon';

                                                    if (visualType === 'none') return null;

                                                    if (visualType === 'image' && settings.customImageUrl) {
                                                        const url = settings.customImageUrl;
                                                        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                                                        let src = url;

                                                        if (url.startsWith('http://localhost/storage')) {
                                                            src = url.replace('http://localhost', baseUrl.replace(/\/$/, ''));
                                                        } else if (url.startsWith('/storage')) {
                                                            src = `${baseUrl.replace(/\/$/, '')}${url}`;
                                                        }

                                                        return <img src={src} alt="" className="w-full h-full object-cover" />;
                                                    }

                                                    const iconOption = iconOptions.find(
                                                        option => option.name === (link.icon || 'faArrowUpRightFromSquare')
                                                    );
                                                    return iconOption
                                                        ? (
                                                            <FontAwesomeIcon
                                                                icon={iconOption.icon}
                                                                color={iconOption.color}
                                                                size="lg"
                                                            />
                                                        )
                                                        : null;
                                                })()}
                                            </span>

                                            <h4 className="font-medium text-gray-900 truncate max-w-[140px]">
                                                {link.label || link.title || 'Başlıksız Link'}
                                            </h4>

                                            {!link.is_active && (
                                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                                                    Gizli
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* sağdaki action butonları */}
                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                        {/* görünürlük */}
                                        <button
                                            onClick={() => handleToggleVisibility(link.id)}
                                            className={`p-2 rounded-lg transition-colors ${link.is_active
                                                ? 'text-[#010101] hover:bg-[#efefef]'
                                                : 'text-gray-400 hover:bg-gray-100'
                                                }`}
                                            title={link.is_active ? 'Gizle' : 'Göster'}
                                        >
                                            {link.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>

                                        <button
                                            onClick={() => onEditLink(link)}
                                            className="p-2 text-[#010101] hover:bg-[#efefef] rounded-lg transition-colors"
                                            title="Düzenle"
                                        >
                                            <Edit2 size={18} />
                                        </button>

                                        {/* sil */}
                                        <button
                                            onClick={() => handleDeleteLink(link.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Sil"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-2 ml-10">
                                    <p className="text-sm text-gray-500 truncate">
                                        {link.original_url || link.url}
                                    </p>
                                    {link.description && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            {link.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div>
    );
};

export default LinkManager;
