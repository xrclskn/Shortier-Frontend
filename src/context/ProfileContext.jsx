import { createContext, useContext, useState } from "react";
import apiClient from "@/api/client.js";
import {useAuth} from "@/context/AuthContext.jsx";

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export function ProfileProvider({ children }) {
    // Profile state
    const [profileImage, setProfileImage] = useState(null);
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const { user } = useAuth();

    // Link state
    const [links, setLinks] = useState([
        {id: 1, url: "", label: "", icon: "website", color: "#3b82f6", iconBg: "#ffffff", iconColor: "#3b82f6"},
    ]);

    // THEME STATE -- BUNLARI EKLE!
    const [bgType, setBgType] = useState("gradient");
    const [bgGradient, setBgGradient] = useState({
        color1: "rgb(44, 62, 80)",
        color2: "rgb(0, 0, 0)",
        angle: 135
    });
    const [bgColor, setBgColor] = useState("#f8fafc");
    const [textColor, setTextColor] = useState("#f8fafc");

    // UI state
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState([]);

    const loadProfile = async () => {
        setLoading(true);         // Opsiyonel: loading göstermek için
        setErrors([]);            // Önceki hataları sıfırla

        const userId = user?.id;
        if (!userId) {
            setErrors(["Kullanıcı bilgisi bulunamadı, tekrar giriş yapınız."]);
            setLoading(false);
            return;
        }
        try {
            const res = await apiClient.get(`/profile/${userId}`); // API endpoint'in adını kendi backendine göre ayarla

            if (res.data.profile) {
                setProfileId(res.data.profile.id);                                // Güncelleme için lazım
                setFullName(res.data.profile.full_name || "");                    // null gelirse "" olsun
                setUsername(res.data.profile.username || "");
                setBio(res.data.profile.bio || "");
                setProfileImage(res.data.profile.photo || null);

                // Tasarımsal veriler: settings sütunu (JSON/text)
                let settings = {};
                if (res.data.profile.settings) {
                    try {
                        settings = res.data.profile.settings;
                    } catch (e) {
                        settings = {};
                    }
                }

                setBgType(settings.bgType || "gradient");
                setBgGradient(settings.bgGradient || { color1: "#667eea", color2: "#764ba2", angle: 135 });
                setBgColor(settings.bgColor || "#f8fafc");
                setTextColor(settings.textColor || "#1e293b");

            }else {
                setProfileId(null);
                setFullName("");
                setUsername("");
                setBio("");
                setProfileImage(null);
            }

            if (res.data.links && Array.isArray(res.data.links)) {


                setLinks(
                    res.data.links.map(link => {

                        let settings = {};
                        if (link.settings) {
                            try {
                                settings = typeof link.settings === "string"
                                    ? JSON.parse(link.settings)
                                    : link.settings;
                            } catch (e) {
                                settings = {};
                            }
                        }
                        return {
                            id: link.id,
                            url: link.original_url || "",
                            label: link.label || "",
                            icon: link.icon || "website",
                            color: settings.color || "#3b82f6",
                            iconBg: settings.iconBg || "#ffffff",
                            iconColor: settings.iconColor || "#3b82f6",
                        }
                    })
                );
            } else {
                setLinks([
                    { id: 1, url: "", label: "", icon: "website", color: "#3b82f6", iconBg: "#ffffff", iconColor: "#3b82f6" }
                ]);
            }

        } catch (error) {
            setErrors(["Profil verileri yüklenemedi!"]);
        }

        setLoading(false);
    };

    const saveProfile = async () => {
        try {
            const payload = {
                photo: profileImage,
                full_name: fullName,
                username,
                bio,
                settings: {
                    bgType,
                    bgGradient,
                    bgColor,
                    textColor,
                },
                links: links.map(link => ({
                    id: link.id, // güncellemede lazım
                    label: link.label,
                    icon: link.icon,
                    original_url: link.url, // <-- DİKKAT: url değil original_url!
                    settings: {
                        color: link.color,
                        iconBg: link.iconBg,
                        iconColor: link.iconColor,
                        textColor: link.textColor,
                    },
                })),
            };

            if (profileId) {
                await apiClient.put(`/profile`, payload);
            } else {
                await apiClient.post("/profile", payload);
            }
        } catch (err) {
            setErrors(["Profil kaydedilemedi, tekrar deneyin."]);
        }
    };

    return (
        <ProfileContext.Provider value={{
            profileId, setProfileId,
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
            saveProfile,loadProfile, loading,
            setLoading,
        }}>
            {children}
        </ProfileContext.Provider>
    );
}
