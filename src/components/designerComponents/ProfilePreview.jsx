import React, {useEffect, useState} from 'react';
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
                                    buttonColor: '#8B5CF6',
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
        gradientStart: profileData?.theme?.gradientStart || '#dad5e5',
        gradientEnd: profileData?.theme?.gradientEnd || '#284069',
        buttonStyle: profileData?.theme?.buttonStyle || 'rounded',
        buttonColor: profileData?.theme?.buttonColor || '#8B5CF6',
        textColor: profileData?.theme?.textColor || '#1F2937',
        fontFamily: profileData?.theme?.fontFamily || 'Inter'
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
                        className="animate-spin h-8 w-8 text-blue-500"
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

    const getBackgroundStyle = () => {
        const {backgroundColor, backgroundType, gradientStart, gradientEnd} = safeTheme;

        if (backgroundType === 'gradient') {
            return {
                background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`
            };
        }

        return {
            backgroundColor: backgroundColor
        };
    };

    const getButtonStyle = () => {
        const {buttonStyle, buttonColor} = safeTheme;

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

    const containerWidth = viewMode === 'mobile' ? 'max-w-[335px] w-full' : 'max-w-[600px] w-full';
    const containerHeight = viewMode === 'mobile' ? 'h-[667px]' : 'h-[800px]';

    // Güvenli profil verileri
    const safeProfileData = {
        username: profileData?.username || 'kullaniciadi',
        title: profileData?.title || 'ünvan',
        displayName: profileData?.displayName || 'Kullanıcı Adı',
        bio: profileData?.bio || '',
        avatarUrl: profileData?.avatarUrl || null,
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
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'mobile'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Mobil Görünüm"
                    >
                        <Smartphone size={18}/>
                    </button>
                    <button
                        onClick={() => onViewModeChange && onViewModeChange('desktop')}
                        className={`p-2 rounded transition-colors ${
                            viewMode === 'desktop'
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Tablet Görünümü"
                    >
                        <Tablet size={18}/>
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
                        style={getBackgroundStyle()}
                    >
                        <div className="px-6 py-12 space-y-6">
                            {/* Avatar */}
                            <div className="flex justify-center">
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
                                                {safeProfileData.displayName.charAt(0).toUpperCase()}
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

                            {/* Sosyal Medya İkonları */}
                            {safeProfileData.socialLinks && safeProfileData.socialLinks.length > 0 && (
                                <div className="flex justify-center gap-3">
                                    {safeProfileData.socialLinks
                                        .filter(social => social.is_active !== false && (social.settings?.visible !== false))
                                        .map((social, index) => {
                                            // platform id'den icon objesini bul
                                            const platform = socialPlatforms.find(p => p.id === social.icon);
                                            const iconObj = platform?.icon || ["fas", "link"];
                                            const color = social.settings?.color || platform?.color || "#2196f3";
                                            return (
                                                <a
                                                    key={social.id || index}
                                                    href={social.original_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center hover:bg-opacity-30 transition-all"
                                                >
                                                    <FontAwesomeIcon icon={iconObj} size="lg" style={{color}} />
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

                                        // Doğru ikon objesini bul
                                        const iconOption = iconOptions.find(opt => opt.name === (settings.icon || link.icon || '').toLowerCase());
                                        const iconSize = settings.iconSize ?? link.iconSize ?? safeTheme.iconSize ?? 24;
                                        const iconColor = settings.iconColor ?? link.iconColor ?? safeTheme.iconColor ?? iconOption?.color ?? '#ffffff';
                                        const iconBackground = settings.iconBackground ?? link.iconBackground ?? safeTheme.iconBackground ?? false;
                                        const iconBackgroundStyle = settings.iconBackgroundStyle ?? link.iconBackgroundStyle ?? safeTheme.iconBackgroundStyle ?? false;
                                        const buttonStyle = settings.buttonStyle ?? link.buttonStyle ?? safeTheme.buttonStyle ?? 'rounded';
                                        const buttonColor = settings.buttonColor ?? link.buttonColor ?? safeTheme.buttonColor ?? '#6366F1';
                                        const textColor = settings.buttonTextColor ?? link.buttonTextColor ?? '#ffffff';

                                        const linkStyle = {
                                            backgroundColor: buttonColor,
                                            borderRadius: buttonStyle === 'square' ? '0.25rem' :
                                                buttonStyle === 'pill' ? '9999px' : '0.5rem',
                                            color: textColor,
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
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
                                                        <FontAwesomeIcon
                                                            icon={iconOption?.icon}
                                                            size="lg"
                                                            style={{
                                                                color: iconColor,
                                                                backgroundColor: iconBackground ? '#ffffff' : 'transparent',
                                                                borderRadius: iconBackgroundStyle === 'pill' ? '9999px' :
                                                                    iconBackgroundStyle === 'square' ? '0.25rem' : '0.5rem',
                                                                padding: iconBackground ? '6px 4px' : '0'
                                                            }}
                                                        />
                                                        <div style={{color: textColor}}>
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
                                                        style={{color: textColor}}
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
