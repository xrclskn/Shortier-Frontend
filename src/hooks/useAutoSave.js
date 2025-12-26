import { useEffect, useRef, useCallback } from 'react';

/**
 * Auto-save hook with debouncing
 * Automatically saves data after a delay when it changes
 * 
 * @param {object} data - Data to save
 * @param {function} saveFunction - Async function that saves the data
 * @param {object} options - Configuration options
 * @param {number} options.delay - Debounce delay in ms (default: 2000)
 * @param {boolean} options.enabled - Whether auto-save is enabled (default: true)
 * @param {function} options.onSuccess - Callback after successful save
 * @param {function} options.onError - Callback after failed save
 * @returns {{isSaving: boolean}} - Current save status
 */
export const useAutoSave = (data, saveFunction, options = {}) => {
    const {
        delay = 2000,
        enabled = true,
        onSuccess,
        onError
    } = options;

    const timeoutRef = useRef(null);
    const previousDataRef = useRef(data);
    const isSavingRef = useRef(false);
    const isFirstRenderRef = useRef(true);

    const save = useCallback(async () => {
        if (isSavingRef.current) return;

        isSavingRef.current = true;
        try {
            await saveFunction(data);
            previousDataRef.current = data;
            onSuccess?.();
        } catch (error) {
            console.error('Auto-save error:', error);
            onError?.(error);
        } finally {
            isSavingRef.current = false;
        }
    }, [data, saveFunction, onSuccess, onError]);

    useEffect(() => {
        // Skip on first render
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            previousDataRef.current = data;
            return;
        }

        if (!enabled) return;

        // Skip if data unchanged (deep comparison using JSON)
        if (JSON.stringify(data) === JSON.stringify(previousDataRef.current)) {
            return;
        }

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Schedule save
        timeoutRef.current = setTimeout(save, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, delay, enabled, save]);

    return { isSaving: isSavingRef.current };
};
