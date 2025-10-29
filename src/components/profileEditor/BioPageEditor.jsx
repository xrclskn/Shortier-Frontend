// BioPageEditor.jsx
import {Save, Sparkles} from "lucide-react";
import ProfileForm from "@/components/profileEditor/ProfileForm.jsx";
import LinksEditor from "@/components/profileEditor/LinkEditor.jsx";
import ThemeEditor from "@/components/profileEditor/ThemeEditor.jsx";
import LivePreview from "@/components/profileEditor/LivePreview.jsx";
import {useProfile} from "@/context/ProfileContext.jsx";
import {useEffect} from "react";

export default function BioPageEditor() {
    // Tüm state’ler context’ten!
    const {
        profileImage, setProfileImage,
        fullName, setFullName,
        username, setUsername,
        bio, setBio,
        links, setLinks,
        bgType, setBgType,
        bgGradient, setBgGradient,
        bgColor, setBgColor,
        textColor, setTextColor,
        saved, setSaved, errors, setErrors,
        saveProfile,loadProfile
    } = useProfile();


    useEffect(() => {
        loadProfile();
    }, []);


    // Form validasyonu (component içi)
    const validateForm = () => {
        const validationErrors = [];
        if (!username.trim()) validationErrors.push("Kullanıcı adı gereklidir");
        const validLinks = links.filter(link =>
            typeof link.label === "string" &&
            typeof link.url === "string" &&
            link.label.trim() &&
            link.url.trim()
        );
        if (validLinks.length === 0) validationErrors.push("En az bir bağlantı eklemelisiniz");
        return validationErrors;
    };

    // Kaydet (hem validasyon hem kayıt işlemi)
    const handleSave = async () => {
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setTimeout(() => setErrors([]), 5000);
            return;
        }
        setErrors([]);
        await saveProfile(); // context'ten api kaydı
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Arkaplan oluşturucu
    const getCurrentBackground = () => {

        if (bgType === "gradient") {
            return `linear-gradient(${bgGradient.angle}deg, ${bgGradient.color1} 0%, ${bgGradient.color2} 100%)`;
        }
        return bgColor;
    };

    // Tema uygulayıcı (preset seçince)
    const applyColorScheme = (scheme) => {
        if (scheme.bg.includes('gradient')) {
            setBgType("gradient");
            const matches = scheme.bg.match(/#[0-9a-f]{6}/gi);
            if (matches && matches.length >= 2) {
                setBgGradient({ color1: matches[0], color2: matches[1], angle: 135 });
            }
        } else {
            setBgType("solid");
            setBgColor(scheme.bg);
        }
        setTextColor(scheme.text);
        setLinks(links.map(link => ({...link, color: scheme.primary})));
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Sol Panel - Düzenleyici */}
            <div className="w-full lg:w-3/5 xl:w-2/3 bg-white rounded-lg shadow-custom">
                <div className="h-full overflow-y-auto">
                    <div className="max-w-3xl mx-auto p-6 space-y-8">
                        {/* Header */}
                        <div className="text-center py-2">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bio Sayfası Düzenleyici</h1>
                            <p className="text-gray-600">Kişisel bağlantı sayfanızı oluşturun ve özelleştirin</p>
                        </div>

                        {/* Profile Form */}
                        <ProfileForm
                            profileImage={profileImage}
                            setProfileImage={setProfileImage}
                            fullName={fullName}
                            setFullName={setFullName}
                            username={username}
                            setUsername={setUsername}
                            bio={bio}
                            setBio={setBio}
                        />

                        {/* Links Editor */}
                        <LinksEditor links={links} setLinks={setLinks} />

                        {/* Theme Editor */}
                        <ThemeEditor
                            bgType={bgType}
                            setBgType={setBgType}
                            bgGradient={bgGradient}
                            setBgGradient={setBgGradient}
                            bgColor={bgColor}
                            setBgColor={setBgColor}
                            textColor={textColor}
                            setTextColor={setTextColor}
                            onApplyColorScheme={applyColorScheme}
                        />

                        {/* Save Button ve Hata Mesajları */}
                        <div className="sticky bottom-0 bg-white pt-6 pb-2">
                            <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
                                {errors && errors.map((error, index) => (
                                    <div
                                        key={index}
                                        className="bg-red-500 text-white px-4 py-2 rounded shadow-custom animate-fadein duration-300"
                                        style={{minWidth: 260, maxWidth: 350, pointerEvents: "auto"}}
                                    >
                                        {error}
                                    </div>
                                ))}
                            </div>
                            <button
                                className={`w-full font-semibold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                    saved
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                                onClick={handleSave}
                            >
                                {saved ? (
                                    <>
                                        <Sparkles size={20}/>
                                        <span>Kaydedildi!</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={20}/>
                                        <span>Kaydet ve Yayınla</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sağ Panel - Canlı Önizleme */}
            <LivePreview
                profileImage={profileImage}
                fullName={fullName}
                username={username}
                bio={bio}
                links={links}
                getCurrentBackground={getCurrentBackground}
                textColor={textColor}
            />
        </div>
    );
}
