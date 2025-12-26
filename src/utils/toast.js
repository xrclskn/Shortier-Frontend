import { toast as toastify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Varsayılan ayarlar
const defaultOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const toast = {
    success: (message, options = {}) => {
        toastify.success(message, { ...defaultOptions, ...options });
    },
    error: (message, options = {}) => {
        toastify.error(message, { ...defaultOptions, ...options });
    },
    info: (message, options = {}) => {
        toastify.info(message, { ...defaultOptions, ...options });
    },
    warning: (message, options = {}) => {
        toastify.warning(message, { ...defaultOptions, ...options });
    },
    // Custom notification types can be added here
};
