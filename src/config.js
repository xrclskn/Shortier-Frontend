const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || (isDev ? "http://localhost:8000/api" : "https://shortier.link/"),
    APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL || (isDev ? "http://localhost:8000" : "https://shortier.link"),
    PROFILE_BASE_URL: import.meta.env.VITE_PROFILE_BASE_URL || (isDev ? "http://localhost:5173" : "https://shortier.link"),
    REDIRECT_BASE_URL: import.meta.env.VITE_REDIRECT_BASE_URL || (isDev ? "http://localhost:8001" : "https://shortier.link"),
    SHORT_LINK_DOMAIN: import.meta.env.VITE_SHORT_LINK_DOMAIN || (isDev ? "localhost:8001" : "shortier.link"),
};

export default config;
