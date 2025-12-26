import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import usePasswordChange from "@/hooks/usePasswordChange.js";

export const PasswordChange = () => {
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const passwordChange = usePasswordChange();

    const handleUpdatePassword = async () => {
        if (!passwordData.currentPassword) return passwordChange.reset();
        if (!passwordData.newPassword) return passwordChange.reset();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            passwordChange.reset();
            passwordChange.mutateAsync.cancel && passwordChange.mutateAsync.cancel();
            return;
        }

        try {
            await passwordChange.mutateAsync({ ...passwordData });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowPasswordChange(false);
            alert("Şifre başarıyla güncellendi.");
        } catch (err) {
            // Error state'i zaten mutation tarafından yönetiliyor.
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-custom">
            <div className="flex items-center justify-between ">
                <h3 className="text-lg font-semibold text-gray-900">Şifre Değiştir</h3>
                <button
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    className="px-4 py-2 bg-[#010101] text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                    {showPasswordChange ? 'İptal' : 'Şifre Değiştir'}
                </button>
            </div>

            {showPasswordChange && (
                <div className="space-y-4 pt-6 mt-6 border-t border-gray-200">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none transition-all pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Şifreyi Onayla</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                                setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#010101] focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <button
                        onClick={handleUpdatePassword}
                        disabled={
                            passwordChange.isPending ||
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword ||
                            passwordData.newPassword !== passwordData.confirmPassword
                        }
                        className="w-full px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {passwordChange.isPending ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                    </button>
                    {passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-sm text-red-600 mt-2">Şifreler eşleşmiyor.</p>
                    )}
                    {passwordChange.isError && (
                        <p className="text-sm text-red-600 mt-2">
                            {passwordChange.error?.response?.data?.message || passwordChange.error?.message || "Şifre güncellenirken hata oluştu."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};
