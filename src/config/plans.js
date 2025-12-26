// src/config/plans.js
// Plans are fetched from backend API - this file provides fallback and helper functions

import apiClient from '@/api/client';

// Fallback plans (used while loading or if API fails)
const FALLBACK_PLANS = {
    free: {
        name: 'Free',
        price: { monthly: 0, yearly: 0 },
        limits: {
            profiles: 1,
            bio_links: 5,
            short_urls_monthly: 5,
            qr_codes: 1,
            analytics_history_days: 1,
        },
        features: {
            qr_design: false,
            detailed_analytics: false,
            remove_branding: false,
            custom_domain: false,
            api_access: false,
            team_members: false,
        }
    },
    plus: {
        name: 'Plus',
        price: { monthly: 6.99, yearly: 69.99 },
        limits: {
            profiles: 1,
            bio_links: 50,
            short_urls_monthly: 50,
            qr_codes: -1,
            analytics_history_days: 365,
        },
        features: {
            qr_design: true,
            detailed_analytics: true,
            remove_branding: true,
            custom_domain: false,
            api_access: false,
            team_members: false,
        }
    },
    premium: {
        name: 'Premium',
        price: { monthly: 15.99, yearly: 159.99 },
        limits: {
            profiles: 3,
            bio_links: -1,
            short_urls_monthly: -1,
            qr_codes: -1,
            analytics_history_days: 365,
        },
        features: {
            qr_design: true,
            detailed_analytics: true,
            remove_branding: true,
            custom_domain: true,
            api_access: false,
            team_members: false,
        }
    },
    business: {
        name: 'Business',
        price: { monthly: 49.99, yearly: 499.99 },
        limits: {
            profiles: 20,
            bio_links: -1,
            short_urls_monthly: -1,
            qr_codes: -1,
            analytics_history_days: 365,
        },
        features: {
            qr_design: true,
            detailed_analytics: true,
            remove_branding: true,
            custom_domain: true,
            api_access: true,
            team_members: true,
        }
    }
};

// Cache for fetched plans
let cachedPlans = null;
let cachedStoreId = null;

/**
 * Fetch plans from backend API (single source of truth)
 * Returns cached data if available
 */
export async function fetchPlans() {
    if (cachedPlans) {
        return { plans: cachedPlans, store_id: cachedStoreId };
    }

    try {
        const response = await apiClient.get('/api/plans');
        cachedPlans = response.data.plans;
        cachedStoreId = response.data.store_id;
        return { plans: cachedPlans, store_id: cachedStoreId };
    } catch (error) {
        console.error('Failed to fetch plans from API, using fallback:', error);
        return { plans: FALLBACK_PLANS, store_id: null };
    }
}

/**
 * Get plans synchronously (returns cached or fallback)
 */
export function getPlansSync() {
    return cachedPlans || FALLBACK_PLANS;
}

/**
 * Get a single plan by key
 */
export function getPlan(key) {
    const plans = getPlansSync();
    return plans[key] || plans.free;
}

/**
 * Get store ID for Lemon Squeezy checkout
 */
export function getStoreId() {
    return cachedStoreId || import.meta.env.VITE_LEMON_SQUEEZY_STORE;
}

/**
 * Clear cache (useful for testing or refresh)
 */
export function clearPlanCache() {
    cachedPlans = null;
    cachedStoreId = null;
}

// Export PLANS for backward compatibility (will be populated after fetch)
export const PLANS = FALLBACK_PLANS;
