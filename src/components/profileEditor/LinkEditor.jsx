// LinksEditor.jsx
import { useState } from "react";
import { Link2, Plus } from "lucide-react";
import LinkItem from "@/components/profileEditor/LinkItem.jsx";
import IconPickerModal from "@/components/profileEditor/IconPickerModal.jsx";


export default function LinksEditor({ links, setLinks }) {
    const [showIconModal, setShowIconModal] = useState(false);
    const [activeIconLink, setActiveIconLink] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);

    const addLink = () => {
        setLinks([...links, {
            id: Date.now(),
            url: "",
            label: "",
            icon: "website",
            color: "#6366F1",
            iconBg: "#ffffff",
            iconColor: "#6366F1",
            textColor: "#ffffff" // Yeni eklenen özellik
        }]);
    };

    const removeLink = (id) => setLinks(links.filter((l) => l.id !== id));

    const updateLink = (id, key, value) => {
        setLinks(prevLinks =>
            prevLinks.map((l) =>
                l.id === id ? { ...l, [key]: value } : l
            )
        );
    };

    // Çoklu güncelleme için yeni fonksiyon
    const updateLinkMultiple = (id, updates) => {
        setLinks(prevLinks =>
            prevLinks.map((l) =>
                l.id === id ? { ...l, ...updates } : l
            )
        );
    };

    const openIconModal = (linkId) => {
        setActiveIconLink(linkId);
        setShowIconModal(true);
    };

    const selectIcon = (iconName) => {
        if (activeIconLink) {
            updateLink(activeIconLink, "icon", iconName);
        }
        setShowIconModal(false);
        setActiveIconLink(null);
    };

    // Hızlı şablon ekleme
    const addQuickLink = (template) => {
        setLinks([...links, {
            id: Date.now(),
            url: template.url,
            label: template.label,
            icon: template.icon,
            color: template.color,
            iconBg: template.iconBg,
            iconColor: template.iconColor,
            textColor: template.textColor
        }]);
    };

    const quickTemplates = [
        { name: 'Instagram', url: 'https://instagram.com/', label: 'Instagram', icon: 'instagram', color: '#E4405F', iconBg: '#ffffff', iconColor: '#E4405F', textColor: '#ffffff' },
        { name: 'Twitter', url: 'https://twitter.com/', label: 'Twitter', icon: 'twitter', color: '#1DA1F2', iconBg: '#ffffff', iconColor: '#1DA1F2', textColor: '#ffffff' },
        { name: 'LinkedIn', url: 'https://linkedin.com/in/', label: 'LinkedIn', icon: 'linkedin', color: '#0077B5', iconBg: '#ffffff', iconColor: '#0077B5', textColor: '#ffffff' },
        { name: 'GitHub', url: 'https://github.com/', label: 'GitHub', icon: 'github', color: '#333333', iconBg: '#ffffff', iconColor: '#333333', textColor: '#ffffff' },
    ];

    // Sürükle-bırak fonksiyonları
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("text/plain", index);
        setIsDragging(true);
        setDragIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setHoverIndex(index);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

        if (dragIndex !== dropIndex) {
            const newLinks = [...links];
            const [movedItem] = newLinks.splice(dragIndex, 1);
            newLinks.splice(dropIndex, 0, movedItem);
            setLinks(newLinks);
        }

        setIsDragging(false);
        setDragIndex(null);
        setHoverIndex(null);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        setHoverIndex(null);
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Link2 className="w-4 h-4 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Bağlantılar</h2>
                    </div>
                    <span className="text-sm text-gray-500">{links.length} bağlantı</span>
                </div>

                {/* Hızlı Şablonlar */}
                {links.length === 0 && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-sm font-medium text-blue-900 mb-3">Hızlı başlangıç şablonları:</div>
                        <div className="flex flex-wrap gap-2">
                            {quickTemplates.map((template, i) => (
                                <button
                                    key={i}
                                    className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-blue-100 border border-blue-200 rounded-lg text-sm transition-colors"
                                    onClick={() => addQuickLink(template)}
                                >
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: template.color }}
                                    />
                                    <span className="text-gray-700">{template.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {links.map((link, index) => (
                        <LinkItem
                            key={link.id}
                            link={link}
                            index={index}
                            onUpdate={updateLink}
                            onUpdateMultiple={updateLinkMultiple}
                            onRemove={removeLink}
                            onOpenIconModal={openIconModal}
                            dragIndex={dragIndex}
                            hoverIndex={hoverIndex}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                        />
                    ))}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            className="flex-1 flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium rounded-xl px-6 py-4 justify-center transition-colors border border-blue-100 hover:border-blue-200"
                            onClick={addLink}
                        >
                            <Plus size={20} />
                            <span>Yeni Bağlantı Ekle</span>
                        </button>

                        {/* Hızlı Ekleme Dropdown */}
                        {links.length > 0 && (
                            <div className="relative">
                                <select
                                    className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 pr-8 text-gray-600 cursor-pointer transition-colors"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            const template = quickTemplates[parseInt(e.target.value)];
                                            addQuickLink(template);
                                            e.target.value = "";
                                        }
                                    }}
                                >
                                    <option value="">Hızlı ekle</option>
                                    {quickTemplates.map((template, i) => (
                                        <option key={i} value={i}>{template.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <IconPickerModal
                isOpen={showIconModal}
                onClose={() => setShowIconModal(false)}
                onSelectIcon={selectIcon}
            />
        </>
    );
}