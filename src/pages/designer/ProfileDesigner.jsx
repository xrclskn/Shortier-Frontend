import React, { useState, useEffect, useRef } from "react";
import { toast } from '@/utils/toast';
import NavDesigner from "@/components/designer/NavDesigner.jsx";
import TabNavigation from "@/components/designer/TabNavigation.jsx";
import ProfilePreview from "@/components/designer/ProfilePreview.jsx";
import ThemePresets from "@/components/designer/ThemePresets.jsx";
import BackgroundPanel from "@/components/designer/BackgroundPanel.jsx";
import TypographyPanel from "@/components/designer/TypographyPanel.jsx";
import LinkManager from "@/components/designer/LinkManager.jsx";
import LinkEditor from "@/components/designer/LinkEditor.jsx";
import ButtonStylePanel from "@/components/designer/ButtonStylePanel.jsx";
import SocialLinksPanel from "@/components/designer/SocialLinksPanel.jsx";
import { Link2, Palette, Phone, Settings, Square, Type, Users, Wallpaper } from "lucide-react";
import ProfileSettingsPanel from "@/components/designer/ProfileSettingsPanel.jsx";
import { useProfileSave } from "@/context/ProfileSaveContext";
import { useAuth } from "@/context/AuthContext";
import { fontOptions, socialPlatforms } from "@/components/profileEditor/Constants.js";
import useSubscription from "@/hooks/useSubscription.jsx";
import useProfile from "@/hooks/useProfile.jsx";
import { generateTempId, isTempId } from "@/utils/idHelpers";


export default function ProfileDesigner() {
    const [activeTab, setActiveTab] = useState('design');
    const [viewMode, setViewMode] = useState('mobile');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [editingLink, setEditingLink] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const { saveProfile, fetchProfile } = useProfileSave();
    const { loading, info, error, isPro } = useSubscription();
    const { user } = useAuth();

    const customTabs = [
        {
            id: 'design',
            label: 'Temalar',
            icon: Palette,
            description: 'Hazır tema şablonları',
            proOnly: true, // tema özelleştirme premium olsun diyorsan
        },
        {
            id: 'background',
            label: 'Arka Plan',
            icon: Wallpaper,
            description: 'Renk ve gradient',
            proOnly: false, // arka plan gradient falan premium olabilir
        },
        {
            id: 'typography',
            label: 'Yazı Tipi',
            icon: Type,
            description: 'Font ayarları',
            proOnly: false, // özel fontlar premium mesela
        },
        // { id: 'buttons', label: 'Butonlar', icon: Square, description: 'Buton stilleri', proOnly: true },

        {
            id: 'social',
            label: 'İletişim',
            icon: Phone,
            description: 'İletişim butonları',
            proOnly: false, // iletişim butonları free olabilir
        },
        {
            id: 'links',
            label: 'Linkler',
            icon: Link2,
            description: 'Link yönetimi',
            proOnly: false, // link ekleme free olmalı ama limitli
        },
        {
            id: 'profile',
            label: 'Ayarlar',
            icon: Settings,
            description: 'Profil ayarları',
            proOnly: false,
        },
    ];


    const [profileData, setProfileData] = useState({
        username: 'your-username',
        displayName: 'Your name',
        title: 'Your title',
        bio: 'your profile description',
        avatarUrl: "",
        theme: {
            backgroundColor: '#ffffff',
            backgroundType: 'gradient',
            gradientStart: '#efefef',
            gradientEnd: '#dedede',
            buttonStyle: 'rounded',
            buttonColor: '#1F2937',
            textColor: '#020202',
            fontFamily: 'Montserrat'
        },
        links: [],
        socialLinks: []
    });


    const updateProfile = (updates) => {
        setProfileData(prev => ({
            ...prev,
            ...updates
        }));
    };

    const handleThemeSelect = (newTheme) => {
        setProfileData(prev => ({
            ...prev,
            theme: {
                ...prev.theme, // Keep existing theme settings
                ...newTheme   // Override with new theme values
            }
        }));
    };

    const updateTheme = (themeUpdates) => {
        setProfileData(prev => ({
            ...prev,
            theme: {
                ...prev.theme,
                ...themeUpdates
            }
        }));
    };

    const handleLinksUpdate = (newLinks) => {
        setProfileData(prev => ({
            ...prev,
            links: newLinks
        }));
    };

    const handleEditLink = (link) => {
        setEditingLink(link);
        setIsEditorOpen(true);
    };

    const handleAddNewLink = () => {
        const tempId = generateTempId();
        setEditingLink({
            id: tempId,
            label: '',
            description: '',
            original_url: '',
            is_active: true
        });
        setIsEditorOpen(true);
    };

    const handleSaveLink = (updatedLink) => {
        setProfileData(prev => {
            // Find by ID OR matching temp_id (in case background save updated the main list but modal has old ID)
            const existingIndex = prev.links.findIndex(l =>
                l.id === updatedLink.id ||
                (l.temp_id && l.temp_id === updatedLink.id)
            );

            if (existingIndex !== -1) {
                // Mevcut linki güncelle
                const newLinks = [...prev.links];
                // Preserve the real ID if we found it via temp_id match
                const existingLink = newLinks[existingIndex];

                newLinks[existingIndex] = {
                    ...updatedLink,
                    id: existingLink.id, // Ensure we keep the real ID if we matched by temp_id
                    temp_id: existingLink.temp_id || updatedLink.temp_id, // Keep temp_id for future references
                    order: existingLink.order,
                    _changed: true
                };
                return {
                    ...prev,
                    links: newLinks
                };
            } else {
                // Yeni link ekle
                const maxOrder = prev.links.length > 0
                    ? Math.max(...prev.links.map(l => l.order || 0))
                    : 0;
                return {
                    ...prev,
                    links: [
                        ...prev.links,
                        { ...updatedLink, order: maxOrder + 1, _changed: true }
                    ]
                };
            }
        });

        // Close editor immediately (optimistic update)
        setIsEditorOpen(false);
        setEditingLink(null);
    };


    const handleCloseEditor = () => {
        setIsEditorOpen(false);
        setEditingLink(null);
    };

    const handleSocialLinksUpdate = (newSocialLinks) => {
        // Safety: Deduplicate _new items that are identical (same icon + url)
        // This prevents race conditions from double-adding the same link
        const uniqueLinks = [];
        const seenNew = new Set();

        for (const link of newSocialLinks) {
            if (link._new) {
                const signature = `${link.icon}|${link.original_url}`;
                if (seenNew.has(signature)) {
                    console.warn("Deduplicated link in ProfileDesigner:", signature);
                    continue;
                }
                seenNew.add(signature);
            }
            uniqueLinks.push(link);
        }

        setProfileData(prev => ({
            ...prev,
            socialLinks: mapSocialLinks(uniqueLinks)
        }));
    };


    const handleSave = async () => {
        setIsSaving(true);
        // API'ye gönderilecek veriyi backend'e uygun şekilde dönüştür
        const apiPayload = {
            username: profileData.username,
            displayName: profileData.displayName,
            title: profileData.title,
            bio: profileData.bio,
            avatarUrl: profileData.avatarUrl,
            settings: {
                theme: profileData.theme,
            },

            // socialLinks: profileData.socialLinks,
            socialLinks: profileData.socialLinks
                .map(link => ({
                    id: link.id || '',
                    original_url: link.original_url || "",
                    short_url: link.short_url || null, // Include short_url to prevent regeneration
                    label: link.name || link.label || link.title || "",
                    icon: link.icon || { iconName: link.platform || '', prefix: 'fas' }, // obje olarak gönder
                    settings: {
                        ...link.settings,
                        // Ensure legacy/default fields exist if missing
                        prefix: link.icon?.prefix || link.settings?.prefix || "fas",
                        color: link.color || link.settings?.color || "#2196f3"
                    },
                    order: link.order || 0,
                    is_active: link.settings?.visible !== false // DÜZELTİLDİ
                })),

            links: profileData.links
                .filter(link => link._changed)
                .map(link => ({
                    // Send null for temp IDs (backend will create new record)
                    id: isTempId(link.id) ? null : link.id,
                    temp_id: isTempId(link.id) ? link.id : null,
                    original_url: link.original_url || link.url || "",
                    description: link.description || '',
                    short_url: link.short_url || null, // Send null instead of empty string to trigger generation or preserve
                    label: link.label || link.title || "",
                    icon: link.icon || "",
                    order: link.order || 0,
                    ...(link.settings && typeof link.settings === "object" ? { settings: link.settings } : {}),
                    is_active: link.is_active !== undefined ? link.is_active : 1
                }))
        };
        try {
            const response = await saveProfile(apiPayload);

            // Map temp IDs to server IDs from backend response
            setProfileData(prev => {
                const savedLinks = response.links || [];
                const idMapping = response.id_mapping || {};

                return {
                    ...prev,
                    _changed: false,
                    // SYNC FIX: Replace local social links with server response to get real IDs.
                    // This prevents sending temp IDs again (which causes duplicates).
                    socialLinks: response.actionLinks ? mapSocialLinks(response.actionLinks) : (prev.socialLinks || []).map(l => ({ ...l, _changed: false })),

                    links: (prev.links || []).map(link => {
                        // 1. Check direct mapping first (Reliable)
                        if (isTempId(link.id) && idMapping[link.id]) {
                            // HERE: Preserving temp_id allows handleSaveLink to find this link later
                            // even if the user is currently editing it with the old temp_id
                            return { ...link, id: idMapping[link.id], temp_id: link.id, _changed: false };
                        }

                        // 2. Fallback to existing logic if direct mapping missing (Legacy support)
                        if (isTempId(link.id)) {
                            const serverLink = savedLinks.find(sl =>
                                sl.original_url === link.original_url ||
                                sl.label === link.label
                            );

                            if (serverLink) {
                                return { ...link, id: serverLink.id, _changed: false };
                            }
                        }

                        return { ...link, _changed: false };
                    })
                };
            });

            const now = new Date().toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            toast.success("Profil başarıyla kaydedildi ✅");
            setLastSaved(now);
        } catch (error) {
            toast.error("Kaydetme sırasında bir hata oluştu 😞");
            console.error("Profil kaydedilirken hata oluştu:", error);
        } finally {
            setIsSaving(false);
        }

    };

    const handlePreview = () => {
        toast.info('Önizleme açılıyor...');
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            // State'i geri al
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            // State'i ileri al
        }
    };

    useEffect(() => {
        // aktif sekme pro-only ise ve kullanıcı pro değilse, uygun bir free sekmeye yönlendir
        const currentTab = customTabs.find(t => t.id === activeTab);

        if (currentTab?.proOnly && !isPro) {
            const firstFreeTab = customTabs.find(t => !t.proOnly);
            if (firstFreeTab) {
                setActiveTab(firstFreeTab.id);
            }
        }
    }, [activeTab, isPro]);



    const renderTabContent = () => {
        switch (activeTab) {
            case 'design':
                return (
                    <div>
                        <ThemePresets
                            currentTheme={profileData.theme}
                            onThemeSelect={handleThemeSelect}
                        />
                    </div>
                );
            case 'links':
                return (
                    <div>
                        <LinkManager
                            links={profileData.links}
                            onLinksUpdate={handleLinksUpdate}
                            onEditLink={handleEditLink}
                            isPro={isPro}
                            maxFreeLinks={info?.limits?.bio_links ?? 5}
                        />
                    </div>
                );
            case 'background':
                return (
                    <div>
                        <BackgroundPanel
                            theme={profileData.theme}
                            onThemeUpdate={updateTheme}
                        />
                    </div>
                );
            case 'typography':
                return (
                    <div>
                        <TypographyPanel
                            theme={profileData.theme}
                            onThemeUpdate={updateTheme}
                            isPro={isPro}
                        />
                    </div>
                );
            case 'buttons':  // YENİ CASE
                return (
                    <div>
                        <ButtonStylePanel
                            theme={profileData.theme}
                            onThemeUpdate={updateTheme}
                        />
                    </div>
                );
            case 'social':  // YENİ CASE
                return (
                    <div>
                        <SocialLinksPanel
                            socialLinks={profileData.socialLinks}
                            onSocialLinksUpdate={handleSocialLinksUpdate}
                            theme={profileData.theme}
                            onThemeUpdate={updateTheme}
                        />
                    </div>
                );
            case 'profile':  // YENİ CASE
                return (
                    <div>
                        <ProfileSettingsPanel
                            profileData={profileData}
                            onProfileUpdate={updateProfile}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    function mapSocialLinks(apiLinks) {
        return apiLinks.map(link => {
            const iconName = link.icon;
            const platform = socialPlatforms.find(p => p.id === iconName);
            // settings.visible, is_active değerine göre ayarlanıyor
            let settings = link.settings ? (typeof link.settings === "string" ? JSON.parse(link.settings) : link.settings) : {};
            settings = {
                ...settings,
                color: settings.color || platform?.color || '#2196f3',
                visible: link.is_active !== false // is_active false ise görünmez
            };
            return {
                id: link.id,
                label: link.label || platform?.name || iconName,
                original_url: link.original_url || link.url || '',
                short_url: link.short_url || '',
                icon: iconName,
                settings,
                order: link.order ?? 0,
                is_active: link.is_active !== undefined ? link.is_active : true,
                _new: link._new || false
            };
        });
    }


    const { profileData: fetchedProfile, loading: profileLoading } = useProfile();

    useEffect(() => {
        if (!fetchedProfile) return;

        try {
            const { profile, links, socialLinks } = fetchedProfile;

            let settings = {};
            if (profile && profile.settings) {
                try {
                    settings = typeof profile.settings === "string" ? JSON.parse(profile.settings) : profile.settings;
                } catch (e) {
                    settings = {};
                }
            }

            const newProfileData = {
                username: profile?.username || "",
                displayName: profile?.full_name || profile?.display_name || "",
                title: profile?.title,
                bio: profile?.bio || "",
                avatarUrl: profile?.avatar_url || profile?.photo || "",
                theme: settings.theme || {
                    backgroundColor: '#ffffff',
                    backgroundType: 'solid',
                    gradientStart: '#efefef',
                    gradientEnd: '#dedede',
                    buttonStyle: 'rounded',
                    buttonColor: '#6366F1',
                    textColor: '#020202',
                    fontFamily: 'Inter'
                },
                socialLinks: socialLinks ? mapSocialLinks(socialLinks) : [],
                links: links || [],
                updatedAt: profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : null
            };

            setProfileData(newProfileData);

        } catch (error) {
            console.error("Profile data parsing error:", error);
        }
    }, [fetchedProfile]);

    useEffect(() => {
        const fontObj = fontOptions.find(f => f.value === profileData.theme.fontFamily);
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
    }, [profileData.theme.fontFamily]);


    return (


        <div className="min-h-screen bg-[#eeefe6] p-6 text-[#010101]">

            {/* <Toast /> removed as it is now handled globally */}

            <NavDesigner
                onSave={handleSave}
                onPreview={handlePreview}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                isSaving={isSaving}
                profile={profileData}
                lastSaved={lastSaved}
            />

            {loading ? (
                <div className="flex space-x-4 bg-white rounded-xl p-1.5 px-6 shadow-custom border border-gray-200 animate-pulse">
                    {/* Skeleton tablar: 3-4 adet gösteriyoruz, istediğin kadar çoğaltabilirsin */}
                    <div className="w-32 h-12 bg-gray-100 rounded-lg" />
                    <div className="w-32 h-12 bg-gray-100 rounded-lg" />
                    <div className="w-32 h-12 bg-gray-100 rounded-lg" />
                    <div className="w-32 h-12 bg-gray-100 rounded-lg" />
                    <div className="w-32 h-12 bg-gray-100 rounded-lg" />
                </div>
            ) : (
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={customTabs}
                    subscription={isPro}
                    loadingSubscription={loading}
                />
            )}


            <div className=" mx-auto ">
                <div className="mt-4">
                    <div className="md:flex justify-content-between gap-6">

                        <div className="md:w-2/3 p-6 bg-white rounded-lg  shadow-custom ">
                            {renderTabContent()}
                        </div>


                        <div className="w-1/3 lg:sticky shadow-sm lg:top-24 h-fit hidden md:block">
                            <ProfilePreview
                                profileData={profileData}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <LinkEditor
                link={editingLink}
                isOpen={isEditorOpen}
                onClose={handleCloseEditor}
                onSave={handleSaveLink}
            />

        </div>
    );

}