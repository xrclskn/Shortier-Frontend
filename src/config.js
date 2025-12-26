export const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
    APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000", // Backend URL for storage/assets
    PROFILE_BASE_URL: import.meta.env.VITE_PROFILE_BASE_URL || "http://localhost:5173",
    REDIRECT_BASE_URL: import.meta.env.VITE_REDIRECT_BASE_URL || "http://localhost:8001",
    SHORT_LINK_DOMAIN: import.meta.env.VITE_SHORT_LINK_DOMAIN || "localhost:8001", // Display domain
};

export default config;
