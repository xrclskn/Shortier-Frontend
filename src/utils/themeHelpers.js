export const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('data:')) return url;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    // Fix localhost URL issues (http://localhost/storage or http://localhost anything matching replacement)
    // We want to replace any localhost domain with our API_BASE_URL if it's not actually usable 
    // But usually we just want to ensure /storage paths are correct.

    if (url.startsWith('http://localhost/') || url.startsWith('http://127.0.0.1/')) {
        // Replace the origin with our baseUrl's origin if needed, or just ensure port is included?
        // Simplest fix: if we have a relative path concept, use it.
        // But usually backend returns http://localhost/storage/...
        const urlObj = new URL(url);
        const path = urlObj.pathname + urlObj.search;
        return `${baseUrl.replace(/\/$/, '')}${path}`;
    }

    if (url.startsWith('http://localhost:8000') || url.startsWith(baseUrl)) {
        return url;
    }

    // Fix relative storage paths
    if (url.startsWith('/storage')) {
        return `${baseUrl.replace(/\/$/, '')}${url}`;
    }

    // External links
    if (url.startsWith('http')) return url;

    // Fallback for paths without /storage prefix if they are local
    return `${baseUrl.replace(/\/$/, '')}/storage/${url.replace(/^\//, '')}`;
};

export const getBackgroundStyle = (theme) => {
    if (!theme) return { backgroundColor: "#f8fafc" };

    if (theme.backgroundType === "image" && theme.backgroundImage) {
        return {
            backgroundImage: `url(${getImageUrl(theme.backgroundImage)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            //backgroundAttachment: 'fixed', // Keep fixed for parallax, but ensure center alignment
            minHeight: '100vh',
            width: '100%',
        };
    } else if (theme.backgroundType === "gradient") {
        return {
            background: `linear-gradient(135deg, ${theme.gradientStart || "#667eea"}, ${theme.gradientEnd || "#764ba2"})`
        };
    } else if (theme.backgroundType === "solid") {
        return {
            backgroundColor: theme.backgroundColor || "#f8fafc"
        };
    }
    return { backgroundColor: "#f8fafc" };
};
