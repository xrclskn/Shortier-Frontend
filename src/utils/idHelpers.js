/**
 * Generate a unique temporary ID for unsaved entities
 * Format: temp-{timestamp}-{random}
 */
export const generateTempId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `temp-${timestamp}-${random}`;
};

/**
 * Check if an ID is a temporary ID
 */
export const isTempId = (id) => {
    return String(id).startsWith('temp-');
};

/**
 * Check if an ID is a real server ID
 */
export const isServerId = (id) => {
    return !isTempId(id) && id != null;
};
