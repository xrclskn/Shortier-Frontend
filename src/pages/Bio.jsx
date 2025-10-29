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

    // Get background style based on theme
    const getBackgroundStyle = (theme) => {
        if (theme.backgroundType === "gradient") {
            return {
                background: `linear-gradient(135deg, ${theme.gradientStart || "#667eea"}, ${theme.gradientEnd || "#764ba2"})`
            };
        } else if (theme.backgroundType === "solid") {
            return {
                backgroundColor: theme.backgroundColor || "#f8fafc"
            };
        }
        return { backgroundColor: "#f8fafc" };
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
                const response = await apiClient.get(`/${username}`);
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
            Cookies.set(cookieKey, "1", { expires: 1/288 });
            apiClient.post(`/profile/${username}/visit`)
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
                            <button
                                onClick={handleQR}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
                            >
                                <QrCode size={16} />
                                QR Kod
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

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex items-start md:items-center justify-center md:p-4 lg:pt-8 md:pt-4" >
                <div className="w-full max-w-lg mx-auto">
                    {/* Profile Card */}
                    <div
                        className="md:rounded-3xl shadow-custom p-8 text-center space-y-8 backdrop-blur-sm border border-white/20 relative overflow-hidden"
                        style={backgroundStyle}
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

                        {/* Profile Header */}
                        <div className="relative mb-4">
                            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden shadow-xl ring-4 ring-white/30 mb-4 group">
                                {profile.avatar_url || profile.photo ? (
                                    <img
                                        src={profile.avatar_url || profile.photo}
                                        alt={profile.display_name || profile.full_name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                                        {(profile.display_name || profile.full_name || username)?.[0]?.toUpperCase() || <User size={32} />}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold mb-3 drop-shadow-sm"
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

                        {/* Social Links */}


                        {/* Modern Social Links Panel */}
                        {visibleSocialLinks.length > 0 && (
                            <div className="flex justify-center gap-3 mb-6">
                                {visibleSocialLinks.map(link => (
                                    <a
                                        key={link.id}
                                        href={'http://shortierv2.local' + (link.short_url || link.original_url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={link.label}
                                        className="w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center hover:bg-opacity-30 hover:-translate-y-1 transition-all"
                                    >
                                        <FontAwesomeIcon
                                            icon={link.iconObj}
                                            size="xl"
                                            style={{color: link.color}}
                                            className="transition-transform duration-300 group-hover:scale-125 group-hover:-translate-y-1"
                                        />
                                    </a>
                                ))}
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
                                    const IconComponent = getIconComponent(link.icon);
                                    const linkStyles = getLinkStyles(link);
                                    const iconStyles = getIconStyles(link);

                                    return (
                                        <a
                                            key={link.id || index}
                                            href={`http://shortierv2.local${link.short_url || link.original_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={link.label}
                                            className="group relative flex items-center w-full py-3 px-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-sm border border-white/20"
                                            style={linkStyles}
                                        >
                                            {/* Background glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]" />

                                            {/* Icon var mı? */}

                                            {link.icon && (
                                                <div
                                                    className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                                                    style={iconStyles}
                                                >
                                                    <FontAwesomeIcon icon={IconComponent} />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="relative z-10 flex-1 px-4 text-left overflow-hidden">
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

                        {/* Join Button */}
                        <div className="mt-6">
                            <button
                                onClick={handleJoinClick}
                                className="group w-full cursor-pointer py-4 px-4 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex items-center justify-center gap-3"
                            >
                            <span>
                                @{username} ile <span className="font-handwritten">Shortier</span>'e katılın!
                            </span>
                                <ExternalLink
                                    size={18}
                                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0"
                                />
                            </button>
                        </div>


                    </div>


                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <div className="text-sm text-gray-500 flex items-center justify-center gap-2">
                            <span>Made with</span>
                            <span className="text-red-500 animate-pulse text-lg">♥</span>
                            <span>by <span className="font-semibold text-blue-600">Shortier</span></span>
                        </div>
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