// iconConstants.js
import {
    faInstagram, faTwitter, faFacebook, faLinkedin, faGithub, faYoutube,
    faTiktok, faDiscord, faTelegram, faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import {
    faLink, faEnvelope, faPhone, faLocationDot, faMusic, faBook,
    faCamera, faHeart, faGlobe, faArrowUpRightFromSquare, faMapLocation
} from "@fortawesome/free-solid-svg-icons";
import {
    Facebook,
    Github,
    Globe,
    Instagram,
    Linkedin,
    Mail, MapPin,
    MessageCircle,
    Music,
    Phone,
    Twitter,
    Youtube
} from "lucide-react";

export const iconOptions = [
    { name: "instagram", icon: faInstagram, label: "Instagram", category: "social", color: "#E4405F" },
    { name: "twitter", icon: faTwitter, label: "Twitter", category: "social", color: "#1DA1F2" },
    { name: "facebook", icon: faFacebook, label: "Facebook", category: "social", color: "#1877F2" },
    { name: "linkedin", icon: faLinkedin, label: "LinkedIn", category: "social", color: "#0A66C2" },
    { name: "youtube", icon: faYoutube, label: "YouTube", category: "social", color: "#FF0000" },
    { name: "tiktok", icon: faTiktok, label: "TikTok", category: "social", color: "#000000" },
    { name: "discord", icon: faDiscord, label: "Discord", category: "social", color: "#5865F2" },
    { name: "whatsapp", icon: faWhatsapp, label: "WhatsApp", category: "social", color: "#25D366" },
    { name: "telegram", icon: faTelegram, label: "Telegram", category: "social", color: "#0088CC" },
    { name: "github", icon: faGithub, label: "GitHub", category: "tech", color: "#333333" },
    { name: "website", icon: faGlobe, label: "Website", category: "general", color: "#6366F1" },
    { name: "email", icon: faEnvelope, label: "Email", category: "general", color: "#EA4335" },
    { name: "phone", icon: faPhone, label: "Telefon", category: "general", color: "#34A853" },
    { name: "location", icon: faLocationDot, label: "Konum", category: "general", color: "#F59E0B" },
    { name: "music", icon: faMusic, label: "Müzik", category: "general", color: "#1DB954" },
    { name: "book", icon: faBook, label: "Kitap", category: "general", color: "#059669" },
    { name: "camera", icon: faCamera, label: "Fotoğraf", category: "general", color: "#F59E0B" },
    { name: "heart", icon: faHeart, label: "Kalp", category: "general", color: "#EC4899" },
    { name: "link", icon: faLink, label: "Link", category: "general", color: "#6B7280" },
    { name: "globe", icon: faGlobe, label: "Globe", category: "general", color: "#6366F1" },
    { name: "external", icon: faArrowUpRightFromSquare, label: "External", category: "general", color: "#6366F1" },
];

export const buttonColors = [
    { name: "Instagram", color: "#E4405F", iconBg: "#ffffff", iconColor: "#E4405F" },
    { name: "Twitter", color: "#1DA1F2", iconBg: "#ffffff", iconColor: "#1DA1F2" },
    { name: "LinkedIn", color: "#0A66C2", iconBg: "#ffffff", iconColor: "#0A66C2" },
    { name: "YouTube", color: "#FF0000", iconBg: "#ffffff", iconColor: "#FF0000" },
    { name: "GitHub", color: "#333333", iconBg: "#ffffff", iconColor: "#333333" },
    { name: "WhatsApp", color: "#25D366", iconBg: "#ffffff", iconColor: "#25D366" },
];


export const colorSchemes = [
    {
        name: "Okyanus",
        bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        text: "#ffffff",
        primary: "#4f46e5"
    },
    {
        name: "Gün Batımı",
        bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
        text: "#2d1b69",
        primary: "#f59e0b"
    },
    {
        name: "Nane",
        bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        text: "#1f2937",
        primary: "#10b981"
    },
    {
        name: "Ateş",
        bg: "linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)",
        text: "#ffffff",
        primary: "#ef4444"
    },
    {
        name: "Altın",
        bg: "linear-gradient(135deg, #ffd89b 0%, #19547b 100%)",
        text: "#ffffff",
        primary: "#f59e0b"
    },
    {
        name: "Gece",
        bg: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)",
        text: "#f1f5f9",
        primary: "#0ea5e9"
    }
];

export const fontOptions = [
    {
        value: "Inter",
        label: "Inter",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
        proOnly : true
    },

    {
        value: "Poppins",
        label: "Poppins",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap",
        proOnly : true
    },
    {
        value: "Roboto",
        label: "Roboto",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
        proOnly : true
    },

    {
        value: "Montserrat",
        label: "Montserrat",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap",
        proOnly : true
    },

    {
        value: "Raleway",
        label: "Raleway",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;700&display=swap",
        proOnly : true
    },

    {
        value: "Playfair Display",
        label: "Playfair Display",
        category: "Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap",
        proOnly : false
    },

    {
        value: "Dancing Script",
        label: "Dancing Script",
        category: "Handwriting",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap",
        proOnly : false
    },

    // Daha fazla font eklemeliyiz popüler fonrlardan ekler misin?

    {
        value: "Lato",
        label: "Lato",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap",
        proOnly : false
    },
    {
        value: "Oswald",
        label: "Oswald",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap",
        proOnly : false
    },
    {
        value: "Merriweather",
        label: "Merriweather",
        category: "Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap",
        proOnly : false
    },
    {
        value: "Pacifico",
        label: "Pacifico",
        category: "Handwriting",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Pacifico&display=swap",
        proOnly : false
    },
    {
        value: "Ubuntu",
        label: "Ubuntu",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap",
        proOnly : false
    },
    {
        value: "Fira Sans",
        label: "Fira Sans",
        category: "Sans Serif",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700&display=swap",
        proOnly : false
    },
    {
        value: "Caveat",
        label: "Caveat",
        category: "Handwriting",
        preview: "Aa",
        url: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap",
        proOnly : false
    },

];

export const socialPlatforms = [
    //{ id: 'instagram', name: 'Instagram', icon: faInstagram, color: '#E4405F', baseUrl: 'https://instagram.com/' },
    //{ id: 'twitter', name: 'Twitter', icon: faTwitter, color: '#1DA1F2', baseUrl: 'https://twitter.com/' },
    //{ id: 'youtube', name: 'YouTube', icon: faYoutube , color: '#FF0000', baseUrl: 'https://youtube.com/' },
    //{ id: 'facebook', name: 'Facebook', icon: faFacebook , color: '#1877F2', baseUrl: 'https://facebook.com/' },
    //{ id: 'linkedin', name: 'LinkedIn', icon: faLinkedin, color: '#0A66C2', baseUrl: 'https://linkedin.com/in/' },
    //{ id: 'github', name: 'GitHub', icon: faGithub, color: '#181717', baseUrl: 'https://github.com' },
    //{ id: 'tiktok', name: 'TikTok', icon: faTiktok, color: '#000000', baseUrl: 'https://tiktok.com/@' },
    { id: 'whatsapp', name: 'WhatsApp', icon: faWhatsapp, color: '#25D366', baseUrl: 'https://wa.me/' },
    { id: 'website', name: 'Website', icon: faGlobe, color: '#6366F1', baseUrl: 'https://' },
    { id: 'email', name: 'E-posta', icon: faEnvelope, color: '#EA4335', baseUrl: 'mailto:' },
    { id: 'phone', name: 'Telefon', icon: faPhone, color: '#34A853', baseUrl: 'tel:' },
    { id: 'location', name: 'Konum', icon: faMapLocation, color: '#10B981', baseUrl: 'https://maps.google.com/?q=' }
];


