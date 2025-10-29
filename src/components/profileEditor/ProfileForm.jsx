// ProfileForm.jsx
import {useCallback, useEffect, useReducer, useRef, useState} from "react";
import { User, Upload } from "lucide-react";

export default function ProfileForm({
                                        profileImage,
                                        setProfileImage,
                                        fullName,
                                        setFullName,
                                        username,
                                        setUsername,
                                        bio,
                                        setBio
                                    }) {
    const fileInputRef = useRef(null);
    const [usernameError, setUsernameError] = useState('');
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setProfileImage(reader.result); // reader.result base64 string olacak!
        };
        reader.readAsDataURL(file);
    };

    function toUsername(str) {


        return str
            .replace(/ç/g, 'c')
            .replace(/ğ/g, 'g')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ş/g, 's')
            .replace(/ü/g, 'u')
            .replace(/Ç/g, 'c')
            .replace(/Ğ/g, 'g')
            .replace(/İ/g, 'i')
            .replace(/Ö/g, 'o')
            .replace(/Ş/g, 's')
            .replace(/Ü/g, 'u')
            .replace(/[^a-z0-9_]/gi, '') // sadece harf, rakam, alt çizgi
            .toLowerCase();
    }


    const handleUsernameChange = (e) => {
        let val = e.target.value;

        val = toUsername(val);

        setUsername(val);

        // Validasyon
        if (val.length < 5) {
            setUsernameError("En az 5 karakter olmalı.");
        } else if (/[^a-z0-9_]/.test(val)) {
            setUsernameError("Sadece küçük harf, rakam ve alt çizgi kullanılabilir.");
        } else {
            setUsernameError('');
        }
    };


    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Profil Bilgileri</h2>
            </div>

            <div className="space-y-6">
                {/* Profil Resmi */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                        <div
                            className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-gray-400" />
                            )}
                        </div>
                        <button
                            className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={16} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                {/* Form Alanları */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kullanıcı Adı</label>
                        <input
                            type="text"
                            placeholder="Kullanıcı Adı"
                            value={username}
                            onChange={handleUsernameChange}
                            className={`w-full px-4 py-3 rounded-xl border ${usernameError ? "border-red-400" : "border-gray-300"} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                            minLength={5}
                            autoCorrect="off"
                            spellCheck={false}
                        />
                        <span className="font-normal text-xs text-slate-500">
                            Küçük harfler kullanın ve Türkçe karakterlerden kaçının.
                        </span>
                        {usernameError && (
                            <span className="text-xs text-red-500 block mt-1">{usernameError}</span>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                        <input
                            type="text"
                            placeholder="Adınız ve soyadınız"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Biyografi</label>
                        <textarea
                            placeholder="Kendinizi kısaca tanıtın..."
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            rows={3}
                            maxLength={150}
                        />
                        <div className="flex justify-between items-center mt-1">
                            <p className="text-xs text-gray-500">{bio.length}/150 karakter</p>
                            {bio.length > 100 && <span className="text-xs text-amber-600">Az karakter kaldı!</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}