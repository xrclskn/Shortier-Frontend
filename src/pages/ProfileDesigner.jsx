import React, {useState, useEffect} from "react";
import NavDesigner from "@/components/designerComponents/NavDesigner.jsx";
import TabNavigation from "@/components/designerComponents/TabNavigation.jsx";
import ProfilePreview from "@/components/designerComponents/ProfilePreview.jsx";
import ThemePresets from "@/components/designerComponents/ThemePresets.jsx";
import BackgroundPanel from "@/components/designerComponents/BackgroundPanel.jsx";
import TypographyPanel from "@/components/designerComponents/TypographyPanel.jsx";
import LinkManager from "@/components/designerComponents/LinkManager.jsx";
import LinkEditor from "@/components/designerComponents/LinkEditor.jsx";
import ButtonStylePanel from "@/components/designerComponents/ButtonStylePanel.jsx";
import SocialLinksPanel from "@/components/designerComponents/SocialLinksPanel.jsx";
import {Link2, Palette, Phone, Settings, Square, Type, Users, Wallpaper} from "lucide-react";
import ProfileSettingsPanel from "@/components/designerComponents/ProfileSettingsPanel.jsx";
import {useProfileSave} from "@/context/ProfileSaveContext";
import {useAuth} from "@/context/AuthContext";
import {fontOptions, socialPlatforms} from "@/components/profileEditor/Constants.js";
import useBillingControl from "@/hooks/useBillingControl.jsx";


export default function ProfileDesigner() {
    const [activeTab, setActiveTab] = useState('design');
    const [viewMode, setViewMode] = useState('mobile');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [editingLink, setEditingLink] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const {saveProfile, fetchProfile} = useProfileSave();
    const { loading, info, error, isPro } = useBillingControl();
    const {user} = useAuth();


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
            buttonColor: '#6366F1',
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
            theme: newTheme // Tema objesini tamamen güncelle
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
        setEditingLink(null);
        setIsEditorOpen(true);
    };

    const handleSaveLink = (updatedLink) => {
        setProfileData(prev => {
            // id kontrolü
            const existingIndex = prev.links.findIndex(l => l.id === updatedLink.id);

            console.log(prev.links.id)

            if (existingIndex !== -1) {
                // Mevcut linki güncelle
                const newLinks = [...prev.links];
                newLinks[existingIndex] = {...updatedLink, order: prev.links[existingIndex].order, _changed: true};
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
                        {...updatedLink, id: Date.now(), order: maxOrder + 1, _changed: true}
                    ]
                };
            }
        });
    };


    const handleCloseEditor = () => {
        setIsEditorOpen(false);
        setEditingLink(null);
    };

    const handleSocialLinksUpdate = (newSocialLinks) => {
        setProfileData(prev => ({
            ...prev,
            socialLinks: mapSocialLinks(newSocialLinks)
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
                    label: link.name || link.label || link.title || "",
                    icon: link.icon || {iconName: link.platform || '', prefix: 'fas'}, // obje olarak gönder
                    settings: JSON.stringify({
                        prefix: link.icon?.prefix || link.settings?.prefix || "fas",
                        color: link.color || link.settings?.color || "#2196f3"
                    }),
                    order: link.order || 0,
                    is_active: link.settings?.visible !== false // DÜZELTİLDİ
                })),

            links: profileData.links
                .filter(link => link._changed)
                .map(link => ({
                    id: link.id || '',
                    original_url: link.original_url || link.url || "",
                    description: link.description || link.description || '',
                    short_url: link.short_url || "",
                    label: link.label || link.title || "",
                    icon: link.icon || "",
                    order: link.order || 0,
                    // Sadece settings varsa ekle
                    ...(link.settings && typeof link.settings === "object" ? {settings: link.settings} : {}),
                    is_active: link.is_active !== undefined ? link.is_active : 1
                }))
        };
        try {
            await saveProfile(apiPayload);
            const now = new Date().toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            setLastSaved(now);
        } catch (error) {
            // Hata yönetimi (örn. kullanıcıya hata mesajı göster)
            console.error("Profil kaydedilirken hata oluştu:", error);
        }
        setIsSaving(false);
    };

    const handlePreview = () => {
        alert('Önizleme açılıyor...');
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


    useEffect(() => {

        const getProfile = async () => {

            try {
                if (!user || !user.id) {
                    return;
                }

                const userId = user.id;

                const data = await fetchProfile(userId);

                if (!data) {
                    return;
                }

                const {profile, links, socialLinks} = data;


                let settings = {};
                if (profile && profile.settings) {
                    try {
                        settings = typeof profile.settings === "string" ? JSON.parse(profile.settings) : profile.settings;
                    } catch (e) {
                        settings = {};
                    }
                } else {
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
                console.error("getProfile fonksiyonunda hata:", error);
                console.error("Hata detayı:", error.message);
                console.error("Hata stack:", error.stack);
            }
        };

        getProfile();
    }, [user, fetchProfile]);

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


            <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e4e8f0] p-6">

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

                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabs={customTabs}
                    subsction={isPro}
                    loadingSubscription={loading}
                />

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