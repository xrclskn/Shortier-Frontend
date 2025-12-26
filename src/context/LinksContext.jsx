import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "@/api/client.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useParams } from "react-router-dom";

const LinksContext = createContext();

export const useLinks = () => useContext(LinksContext);

export function LinksProvider({ children }) {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [saved, setSaved] = useState(false);
    const id = useParams().id;
    const { user } = useAuth(); // EN KRİTİK NOKTA!


    const getAllLinks = async () => {
        setLoading(true);
        setErrors([]);
        try {
            const res = await apiClient.get("/api/profile/get");
            setLinks(res.data.links || []);
        } catch (error) {
            console.error("Error fetching links:", error);
            setErrors(["Linkler yüklenirken bir hata oluştu."]);
        } finally {
            setLoading(false);
        }
    };

    const getLinkById = async (id) => {
        setLoading(true);
        setErrors([]);
        try {
            const existingLink = links.find((link) => String(link.id) === String(id));
            if (existingLink) return existingLink;

            const response = await apiClient.get(`/profile-links/${id}`);
            return response.data; // Doğru dönüş!
        } catch (error) {
            console.error("Error fetching link by ID:", error);
            setErrors(["Link getirilirken bir hata oluştu."]);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteLink = async (id) => {
        setLoading(true);
        setErrors([]);
        try {
            await apiClient.delete(`/profile-links/delete/${id}`);
            setLinks((prev) => prev.filter(link => link.id !== Number(id)));
            return true;
        } catch (error) {
            setErrors(["Link silinirken bir hata oluştu."]);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const toggleLinkStatus = async (id, currentStatus) => {
        try {
            // Optimistic UI update
            setLinks(links.map(link =>
                link.id === id ? { ...link, is_active: !currentStatus } : link
            ));

            await apiClient.put(`/api/profile/links/visibility/${id}`, {
                visibility: !currentStatus
            });
            return true;
        } catch (error) {
            console.error("Error toggling link status:", error);
            // Revert on error
            setLinks(links.map(link =>
                link.id === id ? { ...link, is_active: currentStatus } : link
            ));
            return false;
        }
    };


    useEffect(() => {
        if (user?.id) {
            getAllLinks();
        } else {
            console.log("User not authenticated, skipping link fetch.")
            setLinks([]);
        }
    }, [user?.id]);



    useEffect(() => {
        const handleAuthLogout = () => {
            setLinks([]);
            setLoading(false);
            setErrors([]);
            setSaved(false);
        };

        window.addEventListener('auth:logout', handleAuthLogout);
        return () => window.removeEventListener('auth:logout', handleAuthLogout);
    }, []);

    return (
        <LinksContext.Provider
            value={{
                links,
                loading,
                errors,
                saved,
                getAllLinks,
                getLinkById,
                deleteLink,
                setLinks,      // Ekstra export, ihtiyaç olursa
                setSaved,
                setErrors,
            }}
        >
            {children}
        </LinksContext.Provider>
    );
}
