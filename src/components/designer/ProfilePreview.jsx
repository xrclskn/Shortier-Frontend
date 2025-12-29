import React, { useEffect, useState } from 'react';
import {
    Instagram,
    Twitter,
    Youtube,
    Mail,
    ExternalLink,
    Smartphone,
    Tablet,
    Monitor,
    Facebook,
    Linkedin,
    Music,
    MessageCircle,
    Github,
    Globe,
    Phone,
    MapPin, ShoppingBag, Camera, Calendar, Heart, Star, Zap, Coffee, Book, Briefcase, Square, Circle,
    RectangleHorizontal
} from 'lucide-react';
import { iconOptions, socialPlatforms } from "@/components/profileEditor/Constants.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getBackgroundStyle, getImageUrl } from "@/utils/themeHelpers";



const ProfilePreview = ({
    profileData = {
        username: 'kullaniciadi',
        displayName: 'Kullanıcı Adı',
        bio: 'Kısa bir biyografi yazısı buraya gelecek. Kendinizi tanıtın! 🚀',
        avatarUrl: null,
        theme: {
            backgroundColor: '#ffffff',
            backgroundType: 'solid',
            gradientStart: '#dad5e5',
            gradientEnd: '#284069',
            buttonStyle: 'rounded',
            buttonColor: '#1F2937',
            textColor: '#1F2937',
            fontFamily: 'Inter'
        },
        links: [],
        socialLinks: []
    },
    viewMode = 'mobile',
    onViewModeChange
}) => {

    // Tema verilerini güvenli şekilde al
    const safeTheme = {
        backgroundColor: profileData?.theme?.backgroundColor || '#ffffff',
        backgroundType: profileData?.theme?.backgroundType || 'solid',
        backgroundImage: profileData?.theme?.backgroundImage,
        gradientStart: profileData?.theme?.gradientStart || '#dad5e5',
        gradientEnd: profileData?.theme?.gradientEnd || '#284069',
        buttonStyle: profileData?.theme?.buttonStyle || 'rounded',
        buttonColor: profileData?.theme?.buttonColor || '#1F2937',
        textColor: profileData?.theme?.textColor || '#1F2937',
        fontFamily: profileData?.theme?.fontFamily || 'Inter',
        bioCardActive: profileData?.theme?.bioCardActive,
        bioCardColor: profileData?.theme?.bioCardColor,
        bioCardOpacity: profileData?.theme?.bioCardOpacity,
    };

    const getBioCardStyle = () => {
        if (!safeTheme.bioCardActive) return {};

        const hex = safeTheme.bioCardColor || '#ffffff';
        const opacity = (safeTheme.bioCardOpacity ?? 100) / 100;

        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }

        return {
            backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
            padding: '24px',
            borderRadius: '16px',
            backdropFilter: 'blur(4px)',
            marginBottom: '24px',
        };
    };

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Profil verisi değiştiğinde loading başlat, kısa bir gecikme ile animasyon göster
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 800); // 800ms animasyon için
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center bg-white h-[90vh]">
                <div className="flex items-center justify-center h-24">
                    <svg
                        className="animate-spin h-8 w-8 text-[#010101]"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                </div>
            </div>
        );
    }

    // Helper function moved to imports

    const getButtonStyle = () => {
        const { buttonStyle, buttonColor } = safeTheme;

        let borderRadius = '0.5rem';
        if (buttonStyle === 'square') borderRadius = '0.25rem';
        if (buttonStyle === 'pill') borderRadius = '9999px';

        return {
            backgroundColor: buttonColor,
            borderRadius: borderRadius,
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            color: '#ffffff'
        };
    };

    const getIconComponent = (iconName) => {
        const found = iconOptions.find(opt => opt.name === iconName?.toLowerCase());
        return found?.icon || ExternalLink;
    };

    const getSocialIcon = (platform) => {
        const found = iconOptions.find(opt => opt.name === platform?.toLowerCase());
        return found?.icon || ExternalLink;
    };

    const containerWidth = viewMode === 'mobile' ? 'max-w-[380px] w-full' : 'max-w-[600px] w-full';
    const containerHeight = viewMode === 'mobile' ? 'h-[667px]' : 'h-[800px]';

    // getImageUrl moved to imports

    // Güvenli profil verileri
    const safeProfileData = {
        username: profileData?.username || 'kullaniciadi',
        title: profileData?.title || 'ünvan',
        displayName: profileData?.displayName || 'Kullanıcı Adı',
        bio: profileData?.bio || '',
        avatarUrl: getImageUrl(profileData?.avatarUrl),
        links: profileData?.links || [],
        socialLinks: profileData?.socialLinks || []
    };

    return (
        <div className="bg-white rounded-lg p-4 shadow-custom md:p-6">
            {/* Önizleme Başlığı */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Canlı Önizleme</h3>
                <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow-sm">
                    <button
                        onClick={() => onViewModeChange && onViewModeChange('mobile')}
                        className={`p-2 rounded transition-colors ${viewMode === 'mobile'
                            ? 'bg-[#efefef] text-[#010101]'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        title="Mobil Görünüm"
                    >
                        <Smartphone size={18} />
                    </button>
                    <button
                        onClick={() => onViewModeChange && onViewModeChange('desktop')}
                        className={`p-2 rounded transition-colors ${viewMode === 'desktop'
                            ? 'bg-[#efefef] text-[#010101]'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            }`}
                        title="Tablet Görünümü"
                    >
                        <Tablet size={18} />
                    </button>
                </div>
            </div>

            {/* Telefon Frame */}

            <div className="flex justify-center">
                <div
                    className={`${containerWidth} ${containerHeight} bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800 relative transition-all duration-300`}>
                    {/* Telefon Çentiği (Mobile için) */}
                    {viewMode === 'mobile' && (
                        <div
                            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl z-10"></div>
                    )}

                    {/* Profil İçeriği */}
                    <div
                        className="h-full overflow-y-scroll [&::-webkit-scrollbar]:w-2"
                        style={getBackgroundStyle(safeTheme)}
                    >
                        <div className="px-6 py-12 space-y-6">
                            <div style={getBioCardStyle()} className={`transition-all duration-300 ${safeTheme.bioCardActive ? 'mx-auto w-full max-w-sm' : ''}`}>
                                {/* Avatar */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        {safeProfileData.avatarUrl ? (
                                            <img
                                                src={safeProfileData.avatarUrl}
                                                alt={safeProfileData.displayName}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                        ) : (
                                            <div
                                                className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center">
                                                <span className="text-white text-3xl font-bold">
                                                    {safeProfileData.displayName ? safeProfileData.displayName.charAt(0).toUpperCase() : 'U'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Kullanıcı Bilgileri */}
                                <div className="text-center space-y-2">
                                    <h1
                                        className="text-2xl font-bold"
                                        style={{
                                            color: safeTheme.textColor,
                                            fontFamily: safeTheme.fontFamily
                                        }}
                                    >
                                        {safeProfileData.displayName}
                                    </h1>

                                    <h5 style={{
                                        color: safeTheme.textColor,
                                        fontFamily: safeTheme.fontFamily
                                    }}>
                                        {safeProfileData.title}
                                    </h5>

                                    <p
                                        className="text-sm opacity-80"
                                        style={{
                                            color: safeTheme.textColor,
                                            fontFamily: safeTheme.fontFamily
                                        }}
                                    >
                                        @{safeProfileData.username}
                                    </p>
                                    {safeProfileData.bio && (
                                        <p
                                            className="text-sm max-w-sm mx-auto opacity-90 leading-relaxed"
                                            style={{
                                                color: safeTheme.textColor,
                                                fontFamily: safeTheme.fontFamily
                                            }}
                                        >
                                            {safeProfileData.bio}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Sosyal Medya İkonları */}
                            {safeProfileData.socialLinks && safeProfileData.socialLinks.length > 0 && (
                                <div className="flex justify-center gap-3 flex-wrap px-4">
                                    {safeProfileData.socialLinks
                                        .filter(social => social.is_active !== false && (social.settings?.visible !== false))
                                        .map((social, index) => {
                                            // Robust settings parsing
                                            let settings = social.settings || {};
                                            if (typeof settings === 'string') {
                                                try {
                                                    settings = JSON.parse(settings);
                                                } catch (e) {
                                                    settings = {};
                                                }
                                            }
                                            const platform = socialPlatforms.find(p => p.id === social.icon); // id matches icon name often

                                            // 1. Icon Selection
                                            let iconToRender = platform?.icon || ["fas", "link"];
                                            if (settings.customIcon) {
                                                const customOpt = iconOptions.find(i => i.name === settings.customIcon);
                                                if (customOpt) iconToRender = customOpt.icon;
                                            }

                                            // 2. Global Style Settings (Now Per-Link)
                                            // Fallback to defaults if not set
                                            const size = settings.viewSize || 'medium';
                                            const style = settings.viewStyle || 'solid';
                                            const radius = settings.viewRadius || 'circle';

                                            // 3. Size Dimensions
                                            let dims = 'w-10 h-10 text-lg';
                                            if (size === 'small') dims = 'w-8 h-8 text-sm';
                                            if (size === 'large') dims = 'w-12 h-12 text-xl';

                                            // 4. Border Radius
                                            let radiusClass = 'rounded-full';
                                            if (radius === 'square') radiusClass = 'rounded-none';
                                            if (radius === 'rounded') radiusClass = 'rounded-xl';

                                            // 5. Colors & Background
                                            // Decoupled logic: settings.color is Icon/Text. settings.backgroundColor is Background.
                                            // Fallback for background is platform brand color.
                                            // Fallback for icon is white (for solid) or brand color (for others).

                                            const brandColor = platform?.color || "#2196f3";
                                            const userBgColor = settings.backgroundColor;
                                            const userIconColor = settings.color;
                                            const paddingVal = settings.padding ? `${settings.padding}px` : '0px';

                                            let bgStyle = {};
                                            let fgColor = '#ffffff';
                                            let borderStyle = 'none';

                                            if (style === 'solid') {
                                                // Background: User Custom -> Platform Brand -> Web Default
                                                bgStyle = { backgroundColor: userBgColor || brandColor };
                                                // Foreground: User Custom -> White
                                                fgColor = userIconColor || '#ffffff';
                                            } else if (style === 'outline') {
                                                bgStyle = { backgroundColor: userBgColor || 'transparent' };
                                                // Border/Foreground: User Custom -> Brand Color
                                                const outlineColor = userIconColor || brandColor;
                                                borderStyle = `2px solid ${outlineColor}`;
                                                fgColor = outlineColor;
                                            } else if (style === 'transparent') {
                                                bgStyle = { backgroundColor: 'transparent' };
                                                // Foreground: User Custom -> Brand Color
                                                fgColor = userIconColor || brandColor;
                                            }

                                            // Visual Type Check
                                            const isImage = settings.visualType === 'image' && settings.customImageUrl;

                                            return (
                                                <a
                                                    key={social.id || index}
                                                    href={social.original_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`${dims} ${radiusClass} flex items-center justify-center hover:bg-opacity-80 transition-all hover:scale-110`}
                                                    style={{
                                                        ...bgStyle,
                                                        border: borderStyle,
                                                        padding: paddingVal
                                                    }}
                                                >
                                                    {isImage ? (
                                                        <img
                                                            src={getImageUrl(settings.customImageUrl)}
                                                            alt=""
                                                            className={`w-full h-full object-cover ${radiusClass}`}
                                                        />
                                                    ) : (
                                                        <FontAwesomeIcon
                                                            icon={iconToRender}
                                                            style={{ color: fgColor }}
                                                            className="w-full h-full"
                                                        />
                                                    )}
                                                </a>
                                            );
                                        })}
                                </div>
                            )}

                            {/* Linkler */}
                            <div className="space-y-3 pb-8">
                                {safeProfileData.links
                                    .filter(link => link.is_active)
                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                    .map((link, index) => {
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

                                        const visualType = settings.visualType || 'icon';
                                        const customImageUrl = settings.customImageUrl || '';
                                        const iconOption = iconOptions.find(opt => opt.name === (settings.icon || link.icon || '').toLowerCase());
                                        const iconSize = settings.iconSize ?? link.iconSize ?? safeTheme.iconSize ?? 24;
                                        const iconColor = settings.iconColor ?? link.iconColor ?? safeTheme.iconColor ?? iconOption?.color ?? '#ffffff';
                                        const iconBackground = settings.iconBackground ?? link.iconBackground ?? safeTheme.iconBackground ?? false;
                                        const visualRadius = settings.visualRadius || '0.5rem'; // Default visual radius

                                        const buttonStyle = settings.buttonStyle ?? link.buttonStyle ?? safeTheme.buttonStyle ?? 'rounded';
                                        const buttonColor = settings.buttonColor ?? link.buttonColor ?? safeTheme.buttonColor ?? '#1F2937';
                                        const textColor = settings.buttonTextColor ?? link.buttonTextColor ?? safeTheme.buttonTextColor ?? '#ffffff';
                                        const buttonShadow = settings.buttonShadow ?? link.buttonShadow ?? '0 4px 6px -1px rgb(0 0 0 / 0.1)';
                                        const buttonBorderWidth = settings.buttonBorderWidth ?? 0;
                                        const buttonBorderColor = settings.buttonBorderColor ?? '#e5e7eb';

                                        const linkStyle = {
                                            backgroundColor: buttonColor,
                                            borderRadius: buttonStyle === 'square' ? '8px' :
                                                buttonStyle === 'pill' ? '9999px' : '16px',
                                            color: textColor,
                                            boxShadow: buttonShadow,
                                            borderWidth: `${buttonBorderWidth}px`,
                                            borderColor: buttonBorderColor,
                                            borderStyle: 'solid'
                                        };

                                        return (
                                            <div key={link.id || index} className="space-y-1">
                                                <a
                                                    href={link.url || link.original_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between px-5 py-4 font-medium hover:scale-105 transition-transform hover:shadow-xl group"
                                                    style={linkStyle}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        {visualType !== 'none' && (
                                                            <div className="flex-shrink-0">
                                                                {visualType === 'image' && customImageUrl ? (
                                                                    <img
                                                                        src={getImageUrl(customImageUrl)}
                                                                        alt=""
                                                                        className="w-10 h-10 object-cover border-2 border-white/20"
                                                                        style={{ borderRadius: visualRadius }}
                                                                    />
                                                                ) : (
                                                                    <FontAwesomeIcon
                                                                        icon={iconOption?.icon || ['fas', 'link']}
                                                                        size="lg"
                                                                        style={{
                                                                            color: iconColor,
                                                                            backgroundColor: iconBackground ? '#ffffff' : 'transparent',
                                                                            borderRadius: visualRadius,
                                                                            padding: iconBackground ? '6px 4px' : '0',
                                                                            width: '1.5rem',
                                                                            height: '1.5rem',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    />
                                                                )}
                                                            </div>
                                                        )}

                                                        <div style={{ color: textColor }}>
                                                            <div>
                                                                {link.title || link.label || 'Link'}
                                                            </div>
                                                            {link.description && (
                                                                <div className="text-xs opacity-75">
                                                                    {link.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <FontAwesomeIcon
                                                        icon={iconOptions.find(opt => opt.name === 'external')?.icon}
                                                        size="sm"
                                                        className="opacity-70 group-hover:opacity-100 transition-opacity"
                                                        style={{ color: textColor }}
                                                    />
                                                </a>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Önizleme Bilgisi */}
            <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                    {viewMode === 'mobile' ? 'Mobil görünüm' : 'Masaüstü görünüm'} • Yaptığınız değişiklikler burada
                    anlık olarak görünür
                </p>
            </div>
        </div>
    );
};

export default ProfilePreview;
