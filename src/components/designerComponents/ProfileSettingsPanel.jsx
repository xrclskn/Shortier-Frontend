import React, { useState, useRef } from 'react';
import { User, AtSign, FileText, Camera, Upload, X, Check, AlertCircle } from 'lucide-react';
import {useProfileSave} from "@/context/ProfileSaveContext.jsx";

const ProfileSettingsPanel = ({
                                  profileData,
                                  onProfileUpdate
                              }) => {
    const [previewAvatar, setPreviewAvatar] = useState(profileData.avatarUrl);
    const [usernameStatus, setUsernameStatus] = useState('available'); // available, taken, checking
    const fileInputRef = useRef(null);

    // Input değişikliklerini handle etme
    const handleInputChange = (field, value) => {
        onProfileUpdate({ [field]: value });
    };

    const { checkUsernameAvailability } = useProfileSave();

    const checkUsername = async (username) => {
        if (!username || username.length < 3) {
            setUsernameStatus('invalid');
            return;
        }
        setUsernameStatus('checking');
        try {
            const result = await checkUsernameAvailability(username);
            if (result.available) {
                setUsernameStatus('available');
            } else {
                setUsernameStatus('taken');
            }
        } catch (e) {
            setUsernameStatus('invalid');
        }
    };


    // Avatar dosya seçimi
    const handleAvatarSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Dosya boyut kontrolü (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                alert('Dosya boyutu 2MB\'den küçük olmalıdır.');
                return;
            }

            // Dosya tipi kontrolü
            if (!file.type.startsWith('image/')) {
                alert('Lütfen bir resim dosyası seçin.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const avatarUrl = e.target.result;
                setPreviewAvatar(avatarUrl);
                onProfileUpdate({ avatarUrl: avatarUrl });
            };
            reader.readAsDataURL(file);
        }
    };

    // Avatar silme
    const handleRemoveAvatar = () => {
        setPreviewAvatar(null);
        onProfileUpdate({ avatarUrl: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // URL oluşturma
    const generateProfileUrl = () => {
        return `shortier.link/${profileData.username || 'kullanici-adi'}`;
    };

    // Karakter sayma
    const getBioCharCount = () => {
        return (profileData.bio || '').length;
    };

    const getUsernameStatusIcon = () => {
        switch (usernameStatus) {
            case 'checking':
                return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />;
            case 'available':
                return <Check className="text-green-500" size={16} />;
            case 'taken':
                return <X className="text-red-500" size={16} />;
            case 'invalid':
                return <AlertCircle className="text-orange-500" size={16} />;
            default:
                return null;
        }
    };

    const getUsernameStatusMessage = () => {
        switch (usernameStatus) {
            case 'checking':
                return { message: 'Kontrol ediliyor...', color: 'text-blue-600' };
            case 'available':
                return { message: 'Kullanılabilir', color: 'text-green-600' };
            case 'taken':
                return { message: 'Bu kullanıcı adı alınmış', color: 'text-red-600' };
            case 'invalid':
                return { message: 'En az 3 karakter olmalı', color: 'text-orange-600' };
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
                <User className="text-blue-500" size={24} />
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
                                src={previewAvatar}
                                alt="Avatar önizleme"
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 border-4 border-gray-200 shadow-lg flex items-center justify-center">
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

                    {/* Yükleme Butonları */}
                    <div className="flex flex-col space-y-2">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarSelect}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <Camera size={18} />
                            <span>Fotoğraf Seç</span>
                        </button>
                        <p className="text-xs text-gray-500">
                            JPG, PNG veya GIF • Max 2MB
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                'border-gray-300 focus:ring-blue-500'
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
                    <code className="text-sm font-mono text-blue-600 bg-white px-2 py-1 rounded border border-blue-200">
                        {generateProfileUrl()}
                    </code>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Google arama sonuçlarında görünen açıklama • {(profileData.metaDescription || profileData.bio || '').length}/160
                        </p>
                    </div>
                </div>
            </div>

            {/* Profil Önizleme */}
            <div className="bg-gradient-to-r hidden from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <User className="text-blue-600" size={18} />
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
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 border-2 border-white shadow-lg flex items-center justify-center">
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
                        <p className="text-sm text-blue-600">
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={16} />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">Profil İpucu</h4>
                    <p className="text-sm text-blue-700">
                        Profil bilgileriniz tamamlandıktan sonra, sosyal medya hesaplarınızı ve linklerinizi ekleyerek profilinizi zenginleştirebilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
};


export default ProfileSettingsPanel;