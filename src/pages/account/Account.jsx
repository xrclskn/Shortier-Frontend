import ProfileCard from "@/components/account/ProfileCard.jsx";
import DangerZone from "@/components/account/DangerZone.jsx";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { PasswordChange } from "@/components/account/PasswordChange.jsx";
import useDeleteAccount from "@/hooks/useDeleteAccount.js";

export default function Account() {
    const { mutateAsync: deleteAccount } = useDeleteAccount();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <main className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex bg-white rounded-lg p-4 border-gray-200">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === "profile"
                        ? "bg-[#010101] text-white"
                        : "text-gray-500 hover:text-gray-700 hover:bg-[#efefef]"
                        }`}
                >
                    Profil & Şifre
                </button>
                <button
                    onClick={() => setActiveTab("account")}
                    className={`px-4 py-2 rounded-lg font-medium ${activeTab === "account"
                        ? "bg-[#010101] text-white"
                        : "text-gray-500 hover:text-gray-700 hover:bg-[#efefef]"
                        }`}
                >
                    Hesap & Oturum
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "profile" && (
                <div className="space-y-6">
                    <ProfileCard userData={user} />
                    <PasswordChange />
                </div>
            )}

            {activeTab === "account" && (
                <div className="space-y-6">
                    <DangerZone deleteAccount={deleteAccount} logout={logout} />
                </div>
            )}
        </main>
    );
}
