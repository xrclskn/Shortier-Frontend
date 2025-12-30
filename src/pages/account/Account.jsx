import ProfileCard from "@/components/account/ProfileCard.jsx";
import DangerZone from "@/components/account/DangerZone.jsx";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";
import { PasswordChange } from "@/components/account/PasswordChange.jsx";
import useDeleteAccount from "@/hooks/useDeleteAccount.js";

export default function Account() {
    const { mutateAsync: deleteAccount } = useDeleteAccount();
    const { user, logout } = useAuth();
    return (
        <div className=" mx-auto space-y-4 pb-20">
            {/* Header / Title could go here if needed, but ProfileCard serves as a good header */}

            <ProfileCard userData={user} />

            <PasswordChange />

            <div className="">
                <DangerZone deleteAccount={deleteAccount} logout={logout} />
            </div>
        </div>
    );
}
