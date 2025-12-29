import React, { useState, useRef, useEffect } from 'react';
import { User, AtSign, FileText, Camera, Upload, X, Check, AlertCircle, Lock } from 'lucide-react';
import { useSubscriptionContext } from '@/context/SubscriptionContext.jsx';
import { useProfileSave } from "@/context/ProfileSaveContext.jsx";
import FileManagerModal from '@/components/common/FileManagerModal.jsx';
import { getImageUrl } from '@/utils/themeHelpers';
import { config } from '@/config';

const ProfileSettingsPanel = ({
    profileData,
    onProfileUpdate
}) => {
    const [previewAvatar, setPreviewAvatar] = useState(profileData.avatarUrl);
    const [usernameStatus, setUsernameStatus] = useState('idle'); // idle, available, taken, checking, invalid
    const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
    const debounceTimeoutRef = useRef(null);
    const currentUsernameRef = useRef(profileData.username);

    // Subscription context for plan-gated features
    const { info, loading } = useSubscriptionContext();
    // Plus+ and above plans have remove_branding feature
    // If loading or info unavailable, allow feature (don't block users)
    const hasBranding = loading ? true : (info?.is_subscribed ?? false);

    const { checkUsernameAvailability } = useProfileSave();

    // Input değişikliklerini handle etme
    const handleInputChange = (field, value) => {
        onProfileUpdate({ [field]: value });
    };

    // Debounced username check
    const checkUsername = (username) => {
        // Önceki timeout'u temizle
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Geçersiz username
        if (!username || username.length < 3) {
            setUsernameStatus('invalid');
            return;
        }

        // Mevcut username ile aynıysa kontrol etme
        if (username === currentUsernameRef.current) {
            setUsernameStatus('idle');
            return;
        }

        setUsernameStatus('checking');

        // 1 saniye sonra API'yi çağır
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const result = await checkUsernameAvailability(username);
                if (result.available) {
                    setUsernameStatus('available');
                } else {
                    setUsernameStatus('taken');
                }
            } catch (e) {
                // 404 veya diğer hatalar - available olarak kabul et veya hata göster
                console.error('Username check error:', e);
                setUsernameStatus('error');
            }
        }, 1000);
    };

    // Component unmount olduğunda timeout'u temizle
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);


    // Avatar seçimi (FileManager'dan)
    const handleAvatarSelect = (url) => {
        setPreviewAvatar(url);
        onProfileUpdate({ avatarUrl: url });
        setIsFileManagerOpen(false);
    };

    // Avatar silme
    const handleRemoveAvatar = () => {
        setPreviewAvatar(null);
        onProfileUpdate({ avatarUrl: null });
    };

    // URL oluşturma
    const generateProfileUrl = () => {
        return `${config.SHORT_LINK_DOMAIN}/@${profileData.username || 'kullanici-adi'}`;
    };

    // Karakter sayma
    const getBioCharCount = () => {
        return (profileData.bio || '').length;
    };

    const getUsernameStatusIcon = () => {
        switch (usernameStatus) {
            case 'checking':
                return <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent" />;
            case 'available':
                return <Check className="text-green-500" size={16} />;
            case 'taken':
                return <X className="text-red-500" size={16} />;
            case 'invalid':
                return <AlertCircle className="text-orange-500" size={16} />;
            case 'error':
                return <AlertCircle className="text-red-500" size={16} />;
            case 'idle':
            default:
                return null;
        }
    };

    const getUsernameStatusMessage = () => {
        switch (usernameStatus) {
            case 'checking':
                return { message: 'Kontrol ediliyor...', color: 'text-gray-600' };
            case 'available':
                return { message: 'Kullanılabilir', color: 'text-green-600' };
            case 'taken':
                return { message: 'Bu kullanıcı adı alınmış', color: 'text-red-600' };
            case 'invalid':
                return { message: 'En az 3 karakter olmalı', color: 'text-orange-600' };
            case 'error':
                return { message: 'Kontrol edilemedi, tekrar deneyin', color: 'text-red-600' };
            case 'idle':
            default:
                return { message: '', color: '' };
        }
    };

    const statusMessage = getUsernameStatusMessage();

    return (
        <div className="space-y-6">
            {/* Başlık */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Profil Ayarları</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Temel profil bilgilerinizi düzenleyin
                    </p>
                </div>
                <User className="text-[#010101]" size={24} />
            </div>

            {/* Avatar Yükleme */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profil Fotoğrafı
                </label>

                <div className="flex items-center space-x-6">
                    {/* Avatar Önizleme */}
                    <div className="relative">
                        {previewAvatar ? (
                            <img
                                src={getImageUrl(previewAvatar)}
                                alt="Avatar önizleme"
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-4 border-gray-200 shadow-lg flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">
                                    {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                        )}

                        {/* Silme Butonu */}
                        {previewAvatar && (
                            <button
                                onClick={handleRemoveAvatar}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                title="Fotoğrafı Sil"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Yükleme Butonu */}
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={() => setIsFileManagerOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#010101] text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                        >
                            <Camera size={18} />
                            <span>Galeri'den Seç veya Yükle</span>
                        </button>
                        <p className="text-xs text-gray-500">
                            WebP, JPG, PNG • Max 10MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Görünen İsim */}
            <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    <span>Görünen İsim *</span>
                </label>
                <input
                    type="text"
                    value={profileData.displayName || ''}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="Adınız ve soyadınız"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#010101] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Bu isim profilinizde büyük harflerle görünecek
                </p>
            </div>

            <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <User size={16} />
                    <span>Ünvan *</span>
                </label>
                <input
                    type="text"
                    value={profileData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ünvan veya meslek"
                    maxLength={50}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#010101] focus:border-transparent"
                />

            </div>

            {/* Kullanıcı Adı */}
            <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <AtSign size={16} />
                    <span>Kullanıcı Adı *</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={profileData.username || ''}
                        onChange={(e) => {
                            const username = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            handleInputChange('username', username);
                            if (username) checkUsername(username);
                        }}
                        placeholder="kullaniciadi"
                        className={`
              w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent pr-10
              ${usernameStatus === 'available' ? 'border-green-300 focus:ring-green-500' :
                                usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-300 focus:ring-red-500' :
                                    'border-gray-300 focus:ring-[#010101]'
                            }
            `}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {getUsernameStatusIcon()}
                    </div>
                </div>

                {/* Status Mesajı */}
                {statusMessage.message && (
                    <p className={`text-xs mt-1 flex items-center space-x-1 ${statusMessage.color}`}>
                        <span>{statusMessage.message}</span>
                    </p>
                )}

                {/* Profil URL Önizleme */}
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Profil Linkiniz:</p>
                    <a
                        href={`${config.PROFILE_BASE_URL}/@${profileData.username || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-mono text-blue-600 bg-white px-2 py-1 rounded border border-gray-300 hover:underline hover:text-blue-800 transition-colors block w-fit"
                    >
                        {generateProfileUrl()}
                    </a>
                </div>
            </div>

            {/* Biyografi */}
            <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText size={16} />
                    <span>Biyografi</span>
                </label>
                <textarea
                    value={profileData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Kendinizi kısaca tanıtın..."
                    rows={4}
                    maxLength={160}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#010101] focus:border-transparent resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                        Biyografiniz profilinizde isminizin altında görünür
                    </p>
                    <span className={`text-xs ${getBioCharCount() > 140 ? 'text-orange-600' : 'text-gray-500'}`}>
                        {getBioCharCount()}/160
                    </span>
                </div>
            </div>

            {/* Kart Görünümü Ayarları */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900">Kart Görünümü</h4>
                        <p className="text-xs text-gray-500">Profil bilgilerinize arkaplan ekleyin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={profileData.theme?.bioCardActive || false}
                            onChange={(e) => onProfileUpdate({
                                theme: {
                                    ...(profileData.theme || {}),
                                    bioCardActive: e.target.checked
                                }
                            })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#010101]"></div>
                    </label>
                </div>

                {profileData.theme?.bioCardActive && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Arkaplan Rengi
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="color"
                                value={profileData.theme?.bioCardColor || '#ffffff'}
                                onChange={(e) => onProfileUpdate({
                                    theme: {
                                        ...(profileData.theme || {}),
                                        bioCardColor: e.target.value
                                    }
                                })}
                                className="w-10 h-10 p-1 rounded border border-gray-300 cursor-pointer"
                            />
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">Opaklık: %{profileData.theme?.bioCardOpacity ?? 100}</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={profileData.theme?.bioCardOpacity ?? 100}
                                    onChange={(e) => onProfileUpdate({
                                        theme: {
                                            ...(profileData.theme || {}),
                                            bioCardOpacity: parseInt(e.target.value)
                                        }
                                    })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#010101]"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Shortier Markasını Gizle */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            Shortier Markasını Gizle
                            {!hasBranding && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                                    <Lock size={12} className="mr-1" />
                                    Plus+
                                </span>
                            )}
                        </h4>
                        <p className="text-xs text-gray-500">Profildeki "Shortier'e katılın" butonunu gizleyin</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            disabled={!hasBranding}
                            checked={profileData.theme?.hideJoinButton || false}
                            onChange={(e) => onProfileUpdate({
                                theme: {
                                    ...(profileData.theme || {}),
                                    hideJoinButton: e.target.checked
                                }
                            })}
                            className="sr-only peer"
                        />
                        <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${!hasBranding ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-[#010101]`}></div>
                    </label>
                </div>
            </div>

            {/* SEO Ayarları */}
            <div className="border-t border-gray-200 pt-6 hidden">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">SEO Ayarları</h4>

                <div className="space-y-4">
                    {/* Meta Başlık */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sayfa Başlığı (Meta Title)
                        </label>
                        <input
                            type="text"
                            value={profileData.metaTitle || `${profileData.displayName || 'Profil'} - Shortier.link`}
                            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                            placeholder="Sayfa başlığı"
                            maxLength={60}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#010101] focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Google arama sonuçlarında görünen başlık • {(profileData.metaTitle || `${profileData.displayName || 'Profil'} - Shortier.link`).length}/60
                        </p>
                    </div>

                    {/* Meta Açıklama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sayfa Açıklaması (Meta Description)
                        </label>
                        <textarea
                            value={profileData.metaDescription || profileData.bio || ''}
                            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                            placeholder="Sayfa açıklaması"
                            rows={3}
                            maxLength={160}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#010101] focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Google arama sonuçlarında görünen açıklama • {(profileData.metaDescription || profileData.bio || '').length}/160
                        </p>
                    </div>
                </div>
            </div>

            {/* Profil Önizleme */}
            <div className="bg-gradient-to-r hidden from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <User className="text-[#010101]" size={18} />
                    <span>Profil Önizleme</span>
                </h4>

                <div className="text-center space-y-3">
                    {/* Avatar */}
                    <div className="flex justify-center">
                        {previewAvatar ? (
                            <img
                                src={previewAvatar}
                                alt="Profil"
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white shadow-lg flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* İsim ve Username */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {profileData.displayName || 'Görünen İsim'}
                        </h3>
                        <p className="text-sm text-[#010101]">
                            @{profileData.username || 'kullaniciadi'}
                        </p>
                    </div>

                    {/* Biyografi */}
                    {profileData.bio && (
                        <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                            {profileData.bio}
                        </p>
                    )}

                    {/* URL */}
                    <div className="text-xs text-gray-500 font-mono">
                        {generateProfileUrl()}
                    </div>
                </div>
            </div>

            {/* Bilgi Notu */}
            <div className="bg-[#efefef] border border-gray-300 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="text-[#010101]" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Profil İpucu</h4>
                    <p className="text-sm text-gray-700">
                        Profil bilgileriniz tamamlandıktan sonra, sosyal medya hesaplarınızı ve linklerinizi ekleyerek profilinizi zenginleştirebilirsiniz.
                    </p>
                </div>
            </div>
            {/* File Manager Modal */}
            <FileManagerModal
                isOpen={isFileManagerOpen}
                onClose={() => setIsFileManagerOpen(false)}
                onSelect={handleAvatarSelect}
            />
        </div>
    );
};

export default ProfileSettingsPanel;
