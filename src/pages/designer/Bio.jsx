import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import {
    Link as LinkIcon,
    ExternalLink,
    MoreHorizontal,
    Share2,
    QrCode,
    Flag,
    User
} from "lucide-react";
import apiClient from "@/api/client.js";
import { iconOptions, socialPlatforms } from "@/components/profileEditor/Constants.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/assets/css/animation.css";
import ShareModal from "@/components/bioComponents/ShareModal.jsx";
import JoinModal from "@/components/bioComponents/JoinModal.jsx";
import { fontOptions } from "@/components/profileEditor/Constants.js";
import { getBackgroundStyle, getImageUrl } from "@/utils/themeHelpers";
import { config } from "@/config";


// fontlar eksik ekleyelim


export default function Bio() {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const [theme, setTheme] = useState({});
    const [socialLinks, setSocialLinks] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const hasSentView = useRef(false);

    // Robust settings parser
    const parseSettings = (settingsData) => {
        if (!settingsData) return {};

        try {
            let parsed = settingsData;

            // Handle multiple JSON encoding layers
            while (typeof parsed === 'string') {
                parsed = JSON.parse(parsed);
            }

            return parsed || {};
        } catch (error) {
            console.error('Settings parse error:', error);
            return {};
        }
    };



    // Get icon component
    const getIconComponent = (iconName) => {
        const iconEntry = iconOptions.find(icon => icon.name === iconName);
        return iconEntry ? iconEntry.icon : LinkIcon;
    };

    // Get link styles from settings
    const getLinkStyles = (link) => {
        const settings = parseSettings(link.settings);

        return {
            backgroundColor: settings.buttonColor || theme.buttonColor || "#3B82F6",
            color: settings.buttonTextColor || theme.textColor || "#FFFFFF",
            boxShadow: settings.buttonShadow || "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: settings.buttonBorder || "none",
            borderRadius: (() => {
                const style = settings.buttonStyle || theme.buttonStyle || 'rounded';
                switch (style) {
                    case 'pill': return '9999px';
                    case 'rounded': return '16px';
                    case 'square': return '8px';
                    default: return '12px';
                }
            })()
        };
    };

    // Get icon styles from settings
    const getIconStyles = (link) => {
        const settings = parseSettings(link.settings);

        const iconSize = settings.iconSize || 24;
        const hasBackground = settings.iconBackground === true || settings.iconBackground === 'true';

        return {
            width: `${iconSize + (hasBackground ? 16 : 0)}px`,
            height: `${iconSize + (hasBackground ? 16 : 0)}px`,
            backgroundColor: hasBackground ? ('#f5f5f5') : 'transparent',
            color: (settings.iconColor || settings.buttonTextColor || '#FFFFFF'),
            borderRadius: (() => {
                // If visualRadius exists, stick to it (for background)
                if (settings.visualRadius) return settings.visualRadius;

                if (!hasBackground) return '0';
                const style = settings.iconBackgroundStyle || 'rounded';
                switch (style) {
                    case 'pill': return '9999px';
                    case 'rounded': return '12px';
                    case 'square': return '6px';
                    default: return '50%';
                }
            })(),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: `${iconSize}px`,
            boxShadow: hasBackground ? '0 2px 6px rgba(0, 0, 0, 0.1)' : 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        };
    };

    // Fetch bio data
    useEffect(() => {
        const fetchBio = async () => {
            if (!username) return;

            setLoading(true);
            setError(null);

            try {
                const response = await apiClient.get(`/api/${username}`);
                const data = response.data;

                // Set profile
                setProfile(data.profile || null);
                setSocialLinks(data.actions || []);

                // Parse and set theme from profile settings
                let parsedTheme = {};
                if (data.profile && data.profile.settings) {
                    const profileSettings = parseSettings(data.profile.settings);
                    parsedTheme = profileSettings.theme || {};

                }
                setTheme(parsedTheme);

                // Process links with proper settings parsing
                const processedLinks = (data.links || []).map(link => ({
                    ...link,
                    parsedSettings: parseSettings(link.settings)
                }));
                setLinks(processedLinks);

            } catch (error) {
                console.error('Bio fetch error:', error);
                setError("Profil bulunamadı veya bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        fetchBio();
    }, [username]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.dropdown-container')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [dropdownOpen]);

    useEffect(() => {
        if (!username) return;

        const cookieKey = `shortier_${username}`;
        const alreadyViewed = Cookies.get(cookieKey);

        if (!alreadyViewed) {
            // Çerezi hemen ayarla
            Cookies.set(cookieKey, "1", { expires: 1 / 288 });
            apiClient.post(`/api/profile/${username}/visit`)
                .catch(err => {
                    console.error("Görüntülenme kaydı hatası:", err);
                });
        }
    }, [username]);

    // Event handlers
    const handleShare = () => {
        setShareOpen(true);
        setDropdownOpen(false);
    };

    const handleJoinClick = (e) => {
        e.preventDefault();
        setJoinModalOpen(true);
    };

    const handleQR = () => {
        console.log('QR kod göster');
        setDropdownOpen(false);
    };

    const handleReport = () => {
        console.log('Şikayet et');
        setDropdownOpen(false);
    };

    useEffect(() => {
        if (!theme.fontFamily) return;
        const fontObj = fontOptions.find(f => f.value === theme.fontFamily);
        if (fontObj) {
            const linkId = "dynamic-font-link";
            let linkTag = document.getElementById(linkId);
            if (!linkTag) {
                linkTag = document.createElement("link");
                linkTag.id = linkId;
                linkTag.rel = "stylesheet";
                document.head.appendChild(linkTag);
            }
            linkTag.href = fontObj.url;
        }
    }, [theme.fontFamily]);



    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h4 className="font-handwritten text-blue-600 text-xl">Shortier</h4>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-pink-100">
                <div className="text-center max-w-md bg-white rounded-3xl p-8 shadow-xl">
                    <div className="text-6xl mb-6">⚠️</div>
                    <div className="text-2xl font-bold text-red-600 mb-4">Hata Oluştu</div>
                    <div className="text-gray-600 leading-relaxed">{error}</div>
                </div>
            </div>
        );
    }

    // Profile not found
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center max-w-md bg-white rounded-3xl p-8 shadow-xl">
                    <div className="text-6xl mb-6">🔍</div>
                    <div className="text-2xl font-bold text-gray-700 mb-2">Profil Bulunamadı</div>
                    <div className="text-gray-500">Bu kullanıcı adı ile bir profil mevcut değil.</div>
                </div>
            </div>
        );
    }

    // Get theme styles
    const backgroundStyle = getBackgroundStyle(theme);
    const textColor = theme.textColor || "#1e293b";
    const fontFamily = theme.fontFamily || "inherit";

    const getBioCardStyle = () => {
        if (!theme.bioCardActive) return {};

        const hex = theme.bioCardColor || '#ffffff';
        const opacity = (theme.bioCardOpacity ?? 100) / 100;

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
            backdropFilter: 'blur(2px)',
            marginBottom: '24px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)'
        };
    };

    // Active links
    const activeLinks = links
        .filter(link => link.is_active)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    // socialLinks verisini normalize et
    const getNormalizedSocialLinks = (links) => {
        return (links || []).map(link => {
            // settings'i parse et
            let settings = {};
            if (link.settings) {
                try {
                    settings = typeof link.settings === "string" ? JSON.parse(link.settings) : link.settings;
                } catch {
                    settings = {};
                }
            }
            // platformu bul
            const platform = socialPlatforms.find(p => p.id === link.icon);
            return {
                ...link,
                iconObj: platform?.icon || ["fas", "link"],
                color: settings.color || platform?.color || "#2196f3",
                label: link.label || platform?.name || link.icon,
                original_url: link.original_url || link.url || "",
                is_active: link.is_active !== false,
                visible: settings.visible !== false,
            };
        });
    };

    // Sadece aktif ve görünür olanları al
    const visibleSocialLinks = getNormalizedSocialLinks(socialLinks)
        .filter(link => link.is_active && link.visible)
        .slice(0, 5);


    return (
        <div className="min-h-screen relative ">
            {/* Background overlay */}
            <div className="absolute inset-0 bg-black/3 pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-start md:items-center justify-center md:p-4 lg:pt-8 md:pt-4" >
                <div className="w-full max-w-lg mx-auto">
                    {/* Profile Card */}
                    <div
                        className="md:rounded-3xl shadow-custom p-8 text-center space-y-8 backdrop-blur-sm border border-white/20 relative overflow-hidden"
                        style={backgroundStyle}
                    >
                        {/* Decorative elements - Only for non-image */}
                        {theme?.backgroundType !== 'image' && (
                            <>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
                            </>
                        )}

                        {/* Profile Header */}
                        <div style={getBioCardStyle()} className={`transition-all duration-300 flex flex-col items-center ${theme.bioCardActive ? 'w-full max-w-lg mx-auto' : ''}`}>

                            {/* Navigation */}
                            <nav className="fixed top-0 right-0 z-50 p-4">
                                <div className="dropdown-container relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200/50"
                                    >
                                        <MoreHorizontal size={20} className="text-gray-700" />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden backdrop-blur-sm">
                                            <button
                                                onClick={handleShare}
                                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                                            >
                                                <Share2 size={16} />
                                                Paylaş
                                            </button>

                                            <hr className="border-gray-100" />
                                            <button
                                                onClick={handleReport}
                                                className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                                            >
                                                <Flag size={16} />
                                                Şikayet Et
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </nav>
                            <div className="relative mb-4">
                                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-xl ring-4 ring-white/30 mb-4 group">
                                    {profile.avatar_url || profile.photo ? (
                                        <img
                                            src={getImageUrl(profile.avatar_url || profile.photo)}
                                            alt={profile.display_name || profile.full_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                                            {(profile.display_name || profile.full_name || username)?.[0]?.toUpperCase() || <User size={32} />}
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-3xl font-bold mb-2 drop-shadow-sm"
                                    style={{ color: textColor, fontFamily: fontFamily }}>
                                    {profile.display_name || profile.full_name || username}
                                </h1>

                                <h4 className="text-lg  mb-2"
                                    style={{ color: textColor, fontFamily: fontFamily }}
                                >
                                    {profile.title}
                                </h4>

                                {profile.bio && (
                                    <p className="text-base opacity-90 leading-relaxed max-w-sm mx-auto px-2"
                                        style={{ color: textColor, fontFamily: fontFamily }}>
                                        {profile.bio}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}


                        {/* Modern Social Links Panel */}
                        {visibleSocialLinks.length > 0 && (
                            <div className="flex justify-center gap-3 flex-wrap mb-6 px-4">
                                {visibleSocialLinks.map((link, index) => {
                                    // Parse settings (already parsed in visibleSocialLinks but let's be safe or just use link.settings if safe)
                                    // visibleSocialLinks logic in Bio.jsx already does some parsing but let's re-use our robust logic if needed
                                    // or just access the properties.
                                    // Note: getNormalizedSocialLinks in Bio.jsx returns an object where settings is already an object.
                                    // Prepare settings
                                    const platform = socialPlatforms.find(p => p.id === link.icon);

                                    let settings = link.settings || {};
                                    if (typeof settings === 'string') {
                                        try {
                                            settings = JSON.parse(settings);
                                        } catch (e) {
                                            settings = {};
                                        }
                                    }
                                    // link.label, link.iconObj etc came from normalization, but for consistency let's re-derive slightly
                                    // to match ProfilePreview structure if we want exact same code style.

                                    // Re-finding platform to be safe or use link.iconObj

                                    // 1. Icon Selection
                                    let iconToRender = link.iconObj || ["fas", "link"];
                                    if (settings.customIcon) {
                                        const customOpt = iconOptions.find(i => i.name === settings.customIcon);
                                        if (customOpt) iconToRender = customOpt.icon;
                                    }

                                    // 2. Global Style Settings (Now Per-Link)
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
                                    // Decoupled logic: settings.color refers to Icon/Text. settings.backgroundColor refers to Background.

                                    const brandColor = link.color || "#2196f3"; // Platform default
                                    const userBgColor = settings.backgroundColor;
                                    const userIconColor = settings.color;
                                    const paddingVal = settings.padding ? `${settings.padding}px` : '0px';

                                    let bgStyle = {};
                                    let fgColor = '#ffffff';
                                    let borderStyle = 'none';

                                    if (style === 'solid') {
                                        // Background: User Custom -> Brand Color
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
                                        fgColor = userIconColor || brandColor;
                                    }

                                    // Visual Type Check
                                    const isImage = settings.visualType === 'image' && settings.customImageUrl;

                                    // 6. Construct URL safely
                                    const linkUrl = link.short_url
                                        ? `${config.REDIRECT_BASE_URL}${link.short_url.startsWith('/') ? '' : '/'}${link.short_url}`
                                        : (link.original_url || '#');

                                    return (
                                        <a
                                            key={link.id || index}
                                            href={linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={link.label}
                                            className={`${dims} ${radiusClass} flex items-center justify-center hover:bg-opacity-80 hover:-translate-y-1 transition-all`}
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
                                                    className={`w-full h-full object-contain ${radiusClass}`}
                                                />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={iconToRender}
                                                    style={{ color: fgColor }}
                                                    className="transition-transform duration-300 group-hover:scale-125"
                                                />
                                            )}
                                        </a>
                                    );
                                })}
                            </div>
                        )}

                        {/* Links */}
                        <div className="space-y-4 relative">
                            {activeLinks.length === 0 ? (
                                <div className="text-center py-12 opacity-70">
                                    <LinkIcon size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium mb-2">Henüz link eklenmemiş</p>
                                    <p className="text-sm opacity-75">Yakında harika linkler eklenecek!</p>
                                </div>
                            ) : (
                                activeLinks.map((link, index) => {
                                    const settings = parseSettings(link.settings);
                                    const visualType = settings.visualType || 'icon';
                                    const IconComponent = getIconComponent(link.icon);

                                    // Sadece görsel tipine göre icon özelliklerini ayarla
                                    const iconStyles = getIconStyles(link);

                                    const buttonColor = settings.buttonColor || theme.buttonColor || "#3B82F6";
                                    const textColor = settings.buttonTextColor || theme.textColor || "#FFFFFF";
                                    const buttonShadow = settings.buttonShadow || "0 4px 12px rgba(0, 0, 0, 0.1)";
                                    const buttonBorderWidth = settings.buttonBorderWidth ?? 0;
                                    const buttonBorderColor = settings.buttonBorderColor ?? '#e5e7eb';

                                    let borderRadius = '16px';
                                    const bStyle = settings.buttonStyle || theme.buttonStyle || 'rounded';
                                    if (bStyle === 'pill') borderRadius = '9999px';
                                    else if (bStyle === 'square') borderRadius = '8px';

                                    const linkActualStyle = {
                                        backgroundColor: buttonColor,
                                        color: textColor,
                                        boxShadow: buttonShadow,
                                        borderWidth: `${buttonBorderWidth}px`,
                                        borderColor: buttonBorderColor,
                                        borderStyle: 'solid',
                                        borderRadius: borderRadius
                                    };

                                    // Construct URL safely
                                    const linkUrl = link.short_url
                                        ? `${config.REDIRECT_BASE_URL}${link.short_url.startsWith('/') ? '' : '/'}${link.short_url}`
                                        : (link.original_url || '#');

                                    return (
                                        <a
                                            key={link.id || index}
                                            href={linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={link.label}
                                            className="group relative flex items-center w-full py-3 px-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-sm"
                                            style={linkActualStyle}
                                        >
                                            {/* Background glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]" />

                                            {/* Visual Element (Icon or Image) */}
                                            {visualType !== 'none' && (
                                                <div className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 mr-3">
                                                    {visualType === 'image' && settings.customImageUrl ? (
                                                        <img
                                                            src={getImageUrl(settings.customImageUrl)}
                                                            alt=""
                                                            className="w-10 h-10 object-cover border-2 border-white/20"
                                                            style={{ borderRadius: settings.visualRadius || '50%' }}
                                                        />
                                                    ) : (
                                                        <div style={iconStyles}>
                                                            <FontAwesomeIcon icon={IconComponent} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="relative z-10 flex-1 px-1 text-left overflow-hidden">
                                                <div className="font-medium truncate">
                                                    {link.label}
                                                </div>
                                                {link.description && (
                                                    <div className="text-xs opacity-80 truncate mt-1" title={link.description}>
                                                        {link.description}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Arrow */}
                                            <div className="relative z-10 flex-shrink-0 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0 opacity-70 group-hover:opacity-100">
                                                <ExternalLink size={20} />
                                            </div>
                                        </a>
                                    );
                                })
                            )}
                        </div>

                        {/* Join Button - conditionally hidden via hideJoinButton setting */}
                        {!theme?.hideJoinButton && (
                            <div className="mt-6">
                                <button
                                    onClick={handleJoinClick}
                                    className="group w-full cursor-pointer py-4 px-4 rounded-2xl text-xs sm:text-sm font-semibold text-white bg-black hover:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap"
                                >
                                    <span>
                                        @{username} ile <span className="font-handwritten text-sm sm:text-base">Shortier</span>'e katılın!
                                    </span>
                                    <ExternalLink
                                        size={16}
                                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                                    />
                                </button>
                            </div>
                        )}


                    </div>
                </div>
            </div>

            {/* Modals */}
            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                shareUrl={window.location.href}
                profile={profile}
                username={username}
            />

            <JoinModal
                open={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                username={username}
                profile={profile}
            />

        </div>
    );
}