import React, { useState, useRef, useEffect } from 'react';
import {
    Search,
    X,
    Check,
    Palette,
    Grid,
    List,
    Star,
    Heart,
    Sparkles,
    Upload,
    Download,
    Wand2,
    RotateCcw,
    ChevronDown,
    Filter,
    // Social Media Icons
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Linkedin,
    Github,
    // Business Icons
    Globe,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    User,
    Users,
    Building,
    // Content Icons
    Music,
    Video,
    Camera,
    Mic,
    Film,
    Image,
    Book,
    FileText,
    // Lifestyle Icons
    Coffee,
    ShoppingBag,
    Gamepad2,
    Headphones,
    Utensils,
    Plane,
    Car,
    Home,
    // Tech Icons
    Smartphone,
    Monitor,
    Laptop,
    Wifi,
    Code,
    Database,
    // Other Icons
    Link,
    ExternalLink,
    Download as DownloadIcon,
    Share2,
    Eye,
    Settings,
    Calendar,
    Clock,
    MessageCircle,
    Send,
    Bell
} from 'lucide-react';

const IconSelector = ({
                          isOpen = false,
                          onClose,
                          selectedIcon = 'Globe',
                          selectedIconColor = '#6366F1',
                          selectedIconBg = '#F3F4F6',
                          onIconSelect,
                          onColorChange,
                          mode = 'modal', // 'modal', 'dropdown', 'inline'
                          customIcons = [],
                          allowCustomColors = true,
                          allowBackgroundColors = true,
                          showColorPresets = true,
                          className = ''
                      }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [tempIcon, setTempIcon] = useState(selectedIcon);
    const [tempIconColor, setTempIconColor] = useState(selectedIconColor);
    const [tempIconBg, setTempIconBg] = useState(selectedIconBg);
    const modalRef = useRef(null);

    // Icon categories with organized icons
    const iconCategories = {
        social: {
            label: 'Social Media',
            icons: [
                { name: 'Instagram', icon: Instagram, color: '#E4405F', keywords: ['instagram', 'social', 'photo'] },
                { name: 'Twitter', icon: Twitter, color: '#1DA1F2', keywords: ['twitter', 'social', 'tweet'] },
                { name: 'Facebook', icon: Facebook, color: '#1877F2', keywords: ['facebook', 'social'] },
                { name: 'YouTube', icon: Youtube, color: '#FF0000', keywords: ['youtube', 'video', 'social'] },
                { name: 'LinkedIn', icon: Linkedin, color: '#0077B5', keywords: ['linkedin', 'professional', 'business'] },
                { name: 'GitHub', icon: Github, color: '#181717', keywords: ['github', 'code', 'developer'] },
            ]
        },
        business: {
            label: 'Business & Contact',
            icons: [
                { name: 'Website', icon: Globe, color: '#6366F1', keywords: ['website', 'web', 'url', 'link'] },
                { name: 'Email', icon: Mail, color: '#EA4335', keywords: ['email', 'mail', 'contact'] },
                { name: 'Phone', icon: Phone, color: '#10B981', keywords: ['phone', 'call', 'contact'] },
                { name: 'Location', icon: MapPin, color: '#F59E0B', keywords: ['location', 'address', 'map'] },
                { name: 'Portfolio', icon: Briefcase, color: '#8B5CF6', keywords: ['portfolio', 'work', 'business'] },
                { name: 'Profile', icon: User, color: '#6B7280', keywords: ['profile', 'user', 'about'] },
                { name: 'Team', icon: Users, color: '#059669', keywords: ['team', 'group', 'people'] },
                { name: 'Company', icon: Building, color: '#DC2626', keywords: ['company', 'business', 'office'] },
            ]
        },
        content: {
            label: 'Content & Media',
            icons: [
                { name: 'Music', icon: Music, color: '#EF4444', keywords: ['music', 'audio', 'song'] },
                { name: 'Video', icon: Video, color: '#F97316', keywords: ['video', 'media', 'film'] },
                { name: 'Camera', icon: Camera, color: '#8B5CF6', keywords: ['camera', 'photo', 'photography'] },
                { name: 'Podcast', icon: Mic, color: '#059669', keywords: ['podcast', 'mic', 'audio'] },
                { name: 'Film', icon: Film, color: '#DC2626', keywords: ['film', 'movie', 'cinema'] },
                { name: 'Gallery', icon: Image, color: '#0891B2', keywords: ['gallery', 'images', 'photos'] },
                { name: 'Blog', icon: Book, color: '#7C3AED', keywords: ['blog', 'writing', 'articles'] },
                { name: 'Documents', icon: FileText, color: '#374151', keywords: ['documents', 'files', 'text'] },
            ]
        },
        lifestyle: {
            label: 'Lifestyle & Hobbies',
            icons: [
                { name: 'Coffee', icon: Coffee, color: '#92400E', keywords: ['coffee', 'cafe', 'drink'] },
                { name: 'Shopping', icon: ShoppingBag, color: '#EC4899', keywords: ['shopping', 'store', 'buy'] },
                { name: 'Gaming', icon: Gamepad2, color: '#7C3AED', keywords: ['gaming', 'games', 'play'] },
                { name: 'Music Player', icon: Headphones, color: '#059669', keywords: ['headphones', 'music', 'audio'] },
                { name: 'Food', icon: Utensils, color: '#DC2626', keywords: ['food', 'restaurant', 'cooking'] },
                { name: 'Travel', icon: Plane, color: '#0891B2', keywords: ['travel', 'flight', 'vacation'] },
                { name: 'Car', icon: Car, color: '#374151', keywords: ['car', 'vehicle', 'drive'] },
                { name: 'Home', icon: Home, color: '#059669', keywords: ['home', 'house', 'personal'] },
            ]
        },
        tech: {
            label: 'Technology',
            icons: [
                { name: 'Mobile App', icon: Smartphone, color: '#6366F1', keywords: ['mobile', 'app', 'phone'] },
                { name: 'Desktop', icon: Monitor, color: '#374151', keywords: ['desktop', 'computer', 'screen'] },
                { name: 'Laptop', icon: Laptop, color: '#6B7280', keywords: ['laptop', 'computer', 'portable'] },
                { name: 'WiFi', icon: Wifi, color: '#059669', keywords: ['wifi', 'internet', 'connection'] },
                { name: 'Code', icon: Code, color: '#7C3AED', keywords: ['code', 'programming', 'developer'] },
                { name: 'Database', icon: Database, color: '#DC2626', keywords: ['database', 'data', 'storage'] },
            ]
        },
        other: {
            label: 'Other',
            icons: [
                { name: 'Link', icon: Link, color: '#6366F1', keywords: ['link', 'url', 'connection'] },
                { name: 'External', icon: ExternalLink, color: '#059669', keywords: ['external', 'open', 'new'] },
                { name: 'Download', icon: DownloadIcon, color: '#0891B2', keywords: ['download', 'save', 'file'] },
                { name: 'Share', icon: Share2, color: '#EC4899', keywords: ['share', 'social', 'send'] },
                { name: 'View', icon: Eye, color: '#6B7280', keywords: ['view', 'see', 'look'] },
                { name: 'Settings', icon: Settings, color: '#374151', keywords: ['settings', 'config', 'options'] },
                { name: 'Calendar', icon: Calendar, color: '#DC2626', keywords: ['calendar', 'date', 'schedule'] },
                { name: 'Clock', icon: Clock, color: '#F59E0B', keywords: ['clock', 'time', 'schedule'] },
                { name: 'Message', icon: MessageCircle, color: '#059669', keywords: ['message', 'chat', 'talk'] },
                { name: 'Send', icon: Send, color: '#0891B2', keywords: ['send', 'submit', 'arrow'] },
                { name: 'Notification', icon: Bell, color: '#EF4444', keywords: ['notification', 'alert', 'bell'] },
                { name: 'Star', icon: Star, color: '#FBBF24', keywords: ['star', 'favorite', 'rating'] },
                { name: 'Heart', icon: Heart, color: '#EC4899', keywords: ['heart', 'love', 'like'] },
                { name: 'Magic', icon: Sparkles, color: '#8B5CF6', keywords: ['magic', 'sparkles', 'special'] },
            ]
        }
    };

    // Color presets
    const colorPresets = [
        '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B',
        '#10B981', '#059669', '#0891B2', '#1DA1F2', '#7C3AED',
        '#DC2626', '#EA4335', '#F97316', '#92400E', '#374151',
        '#6B7280', '#1F2937', '#111827', '#000000', '#FFFFFF'
    ];

    const backgroundPresets = [
        '#F3F4F6', '#FEF2F2', '#FEF3C7', '#D1FAE5', '#DBEAFE',
        '#EDE9FE', '#FCE7F3', '#E0E7FF', '#F0F9FF', '#ECFDF5',
        '#FFFFFF', '#F9FAFB', '#F5F5F5', '#E5E5E5', 'transparent'
    ];

    // Flatten all icons for search
    const allIcons = Object.values(iconCategories).flatMap(category =>
        category.icons.map(icon => ({ ...icon, category: category.label }))
    );

    // Add custom icons
    const combinedIcons = [...allIcons, ...customIcons];

    // Filter icons based on search and category
    const filteredIcons = combinedIcons.filter(icon => {
        const matchesSearch = !searchTerm ||
            icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            icon.keywords?.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = activeCategory === 'all' ||
            icon.category === iconCategories[activeCategory]?.label;

        return matchesSearch && matchesCategory;
    });

    // Handle click outside modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleCancel();
            }
        };

        if (isOpen && mode === 'modal') {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, mode]);

    // Handle icon selection
    const handleIconClick = (iconName) => {
        setTempIcon(iconName);

        // Auto-apply color if it's a preset icon
        const iconData = allIcons.find(icon => icon.name === iconName);
        if (iconData && iconData.color) {
            setTempIconColor(iconData.color);
        }
    };

    // Apply changes
    const handleApply = () => {
        onIconSelect({
            icon: tempIcon,
            iconColor: tempIconColor,
            iconBg: tempIconBg
        });
        onClose();
    };

    // Cancel changes
    const handleCancel = () => {
        setTempIcon(selectedIcon);
        setTempIconColor(selectedIconColor);
        setTempIconBg(selectedIconBg);
        setSearchTerm('');
        setActiveCategory('all');
        onClose();
    };

    // Reset to defaults
    const handleReset = () => {
        setTempIcon('Globe');
        setTempIconColor('#6366F1');
        setTempIconBg('#F3F4F6');
    };

    // Get icon component
    const getIconComponent = (iconName) => {
        const iconData = allIcons.find(icon => icon.name === iconName);
        return iconData?.icon || Globe;
    };

    // Render icon item
    const renderIconItem = (iconData, index) => {
        const Icon = iconData.icon;
        const isSelected = tempIcon === iconData.name;

        if (viewMode === 'list') {
            return (
                <button
                    key={iconData.name}
                    onClick={() => handleIconClick(iconData.name)}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                            backgroundColor: isSelected ? tempIconBg : '#F3F4F6',
                            color: isSelected ? tempIconColor : iconData.color
                        }}
                    >
                        <Icon size={20} />
                    </div>
                    <div className="text-left">
                        <div className="font-medium text-gray-900">{iconData.name}</div>
                        <div className="text-sm text-gray-500">{iconData.category}</div>
                    </div>
                    {isSelected && (
                        <Check size={16} className="text-blue-500 ml-auto" />
                    )}
                </button>
            );
        }

        return (
            <button
                key={iconData.name}
                onClick={() => handleIconClick(iconData.name)}
                className={`relative p-3 rounded-lg border-2 transition-all duration-200 group ${
                    isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                title={iconData.name}
            >
                <div
                    className="w-8 h-8 mx-auto rounded flex items-center justify-center"
                    style={{
                        backgroundColor: isSelected ? tempIconBg : '#F3F4F6',
                        color: isSelected ? tempIconColor : iconData.color
                    }}
                >
                    <Icon size={18} />
                </div>

                {isSelected && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                    </div>
                )}

                <div className="mt-2 text-xs font-medium text-gray-700 truncate">
                    {iconData.name}
                </div>
            </button>
        );
    };

    // Modal content
    const modalContent = (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Select Icon</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                        title={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                    >
                        {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search icons..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    All
                </button>
                {Object.entries(iconCategories).map(([key, category]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(key)}
                        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            activeCategory === key
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Icons Grid/List */}
            <div className={`max-h-80 overflow-y-auto ${
                viewMode === 'grid'
                    ? 'grid grid-cols-6 sm:grid-cols-8 gap-2'
                    : 'space-y-2'
            }`}>
                {filteredIcons.length === 0 ? (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">No icons found</p>
                        <p className="text-sm">Try a different search term</p>
                    </div>
                ) : (
                    filteredIcons.map(renderIconItem)
                )}
            </div>

            {/* Color Customization */}
            {allowCustomColors && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Palette size={16} className="text-gray-600" />
                        <h4 className="font-medium text-gray-700">Color Customization</h4>
                    </div>

                    {/* Icon Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Icon Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={tempIconColor}
                                onChange={(e) => setTempIconColor(e.target.value)}
                                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={tempIconColor}
                                onChange={(e) => setTempIconColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                                placeholder="#6366F1"
                            />
                        </div>

                        {showColorPresets && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {colorPresets.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setTempIconColor(color)}
                                        className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                                            tempIconColor === color ? 'border-gray-900' : 'border-gray-300'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Background Color */}
                    {allowBackgroundColors && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Background Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={tempIconBg === 'transparent' ? '#F3F4F6' : tempIconBg}
                                    onChange={(e) => setTempIconBg(e.target.value)}
                                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={tempIconBg}
                                    onChange={(e) => setTempIconBg(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                                    placeholder="#F3F4F6"
                                />
                            </div>

                            {showColorPresets && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {backgroundPresets.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setTempIconBg(color)}
                                            className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                                                tempIconBg === color ? 'border-gray-900' : 'border-gray-300'
                                            } ${color === 'transparent' ? 'bg-gray-100' : ''}`}
                                            style={{
                                                backgroundColor: color === 'transparent' ? 'transparent' : color,
                                                backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                                                backgroundSize: color === 'transparent' ? '8px 8px' : 'auto',
                                                backgroundPosition: color === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Preview */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">Preview:</span>
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center border border-gray-200"
                            style={{
                                backgroundColor: tempIconBg === 'transparent' ? 'transparent' : tempIconBg,
                                color: tempIconColor
                            }}
                        >
                            {React.createElement(getIconComponent(tempIcon), { size: 24 })}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <RotateCcw size={16} />
                    Reset
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );

    // Don't render if not open
    if (!isOpen) return null;

    // Modal mode
    if (mode === 'modal') {
        return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div
                    ref={modalRef}
                    className={`bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden ${className}`}
                >
                    <div className="p-6 overflow-y-auto max-h-full">
                        {modalContent}
                    </div>
                </div>
            </div>
        );
    }

    // Dropdown mode
    if (mode === 'dropdown') {
        return (
            <div className={`absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 w-96 ${className}`}>
                <div className="p-4 max-h-96 overflow-y-auto">
                    {modalContent}
                </div>
            </div>
        );
    }

    // Inline mode
    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
            {modalContent}
        </div>
    );
};

export default IconSelector;