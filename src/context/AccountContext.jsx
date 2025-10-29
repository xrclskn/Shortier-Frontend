// Account sayfasındaki gerekli istekleri yazacağımız yer
import { createContext, useContext, useState } from "react";
import apiClient from "@/api/client.js";
import { useAuth } from "@/context/AuthContext.jsx";

const AccountContext = createContext();

export function AccountProvider({ children }) {
    const {user} = useAuth();
    const userId = user?.id;

    const [accountData, setAccountData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Hesap bilgilerini çek
    const fetchAccountData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/account/${userId}`);
            setAccountData(response.data);
        } catch (err) {
            setError("Hesap bilgileri alınamadı.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    const accountProfileData = async () => {
        try {
            const response = await apiClient.get(`/account/profile/${userId}`);
            setProfileData(response.data);
        } catch (err) {
            setError("Hesap bilgileri alınamadı.");
            console.error("Profil bilgileri alınamadı.", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    const passwordChange = async (currentPassword, newPassword, confirmPassword) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(
                `/account/password/change/${userId}`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                }
            );
            return response.data;
        } catch (err) {
            setError("Şifre değiştirilemedi.");
            console.error("Şifre değiştirilemedi.", err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    const deleteAccount = async (password, reason) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await apiClient.delete("/account/delete", {
                data: { password, reason },
            });
            return res.data;
        } catch (err) {
            console.error("Hesap silinemedi:", err);

            const apiMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Hesap silme işlemi başarısız oldu.";

            setError(apiMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <AccountContext.Provider value={{ accountData, profileData, isLoading, error, fetchAccountData, accountProfileData, passwordChange, deleteAccount }}>
            {children}
        </AccountContext.Provider>
    );

}

export const useAccount = () => useContext(AccountContext);
