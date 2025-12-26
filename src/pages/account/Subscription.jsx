import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchPlans, getPlansSync } from '../../config/plans';
import { Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Subscription = () => {
    const { user } = useAuth();
    const [subInfo, setSubInfo] = useState(null);
    const [loadingSub, setLoadingSub] = useState(true);
    const [plans, setPlans] = useState(getPlansSync()); // Start with fallback

    const [billingCycle, setBillingCycle] = useState('monthly');
    const PLAN_ORDER = ['free', 'plus', 'premium', 'business'];

    useEffect(() => {
        // Fetch plans from API
        fetchPlans().then(({ plans: fetchedPlans }) => {
            console.log('Plans fetched from API:', fetchedPlans);
            setPlans(fetchedPlans);
        });
    }, []);

    useEffect(() => {
        console.log('Subscription component mounted', user);
        console.log('Plans loaded:', plans);
        if (user) {
            fetchSubscriptionInfo();
        } else {
            setLoadingSub(false);
        }
    }, [user]);

    const fetchSubscriptionInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing/subscription`, {
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Subscription data:', data);
                setSubInfo(data);
            }
        } catch (error) {
            console.error("Abonelik bilgisi çekilemedi:", error);
        } finally {
            setLoadingSub(false);
        }
    };

    const handleManageSubscription = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing/portal`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();

            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                alert("Portal bağlantısı oluşturulamadı.");
            }
        } catch (e) {
            alert("Bir hata oluştu.");
        }
    };

    const handleSubscribe = async (planKey) => {
        if (!user || !user.id) {
            alert("Lütfen önce giriş yapın.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ plan: planKey, cycle: billingCycle })
            });

            const data = await response.json();

            if (response.status === 409) {
                if (confirm(data.message + "\n\nAbonelik yönetimine gitmek ister misiniz?")) {
                    handleManageSubscription();
                }
                return;
            }

            if (!response.ok) {
                throw new Error(data.message || 'Ödeme başlatılamadı.');
            }

            if (window.LemonSqueezy && window.LemonSqueezy.Url) {
                window.LemonSqueezy.Url.Open(data.checkout_url);
            } else {
                window.open(data.checkout_url, '_blank');
            }

        } catch (error) {
            alert(error.message);
        }
    };

    const handleResumeSubscription = async () => {
        if (!confirm("Aboneliğinizi devam ettirmek istediğinize emin misiniz?")) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing/resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await response.json();

            if (response.ok) {
                alert("Aboneliğiniz başarıyla devam ettirildi! 🎉");
                fetchSubscriptionInfo(); // Refresh UI
            } else {
                alert(data.message || "Bir hata oluştu.");
            }
        } catch (e) {
            alert("Bağlantı hatası.");
        }
    };

    // Helper to render check/cross
    const renderFeature = (available, text) => (
        <li className={`flex items-center space-x-3 ${available ? 'text-gray-900' : 'text-gray-400'}`}>
            {available ? (
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
                <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
            )}
            <span className="text-sm">{text}</span>
        </li>
    );

    const getPlanStatus = (key) => {
        // 1. Try to match by Variant ID (Most accurate)
        let currentPlanKey = 'free';

        if (subInfo && subInfo.is_subscribed && subInfo.current_plan) {
            const foundKey = Object.keys(plans).find(k => {
                const p = plans[k];
                if (!p.variant_ids) return false;
                // Check both monthly and yearly
                return String(p.variant_ids.monthly) === String(subInfo.current_plan) ||
                    String(p.variant_ids.yearly) === String(subInfo.current_plan);
            });
            if (foundKey) currentPlanKey = foundKey;
        } else {
            // 2. Fallback to User Plan Name (if subInfo not loaded yet or legacy)
            const currentPlanName = user?.plan?.name?.toLowerCase() || 'free';
            currentPlanKey = Object.keys(plans).find(k => plans[k].name.toLowerCase() === currentPlanName) || 'free';
        }

        const currentIndex = PLAN_ORDER.indexOf(currentPlanKey.toLowerCase());
        const targetIndex = PLAN_ORDER.indexOf(key.toLowerCase());

        if (currentPlanKey.toLowerCase() === key.toLowerCase()) return 'current';
        if (targetIndex > currentIndex) return 'upgrade';
        return 'downgrade';
    };

    const handlePlanAction = (key, status) => {
        if (status === 'current') return;

        if (subInfo && subInfo.is_subscribed) {
            handleManageSubscription();
            return;
        }

        handleSubscribe(key);
    };

    const [expandedPlans, setExpandedPlans] = useState({});

    const togglePlan = (key) => {
        setExpandedPlans(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div className="mx-auto py-4">

            {/* Header - Moved Outside of Subscribed Check */}
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Abonelik ve Planlar
                </h2>
                <p className="mt-4 text-xl text-gray-600">
                    Profilinizi bir üst seviyeye taşıyın.
                </p>
            </div>

            {/* Dashboard View for Active Subscribers */}
            {subInfo && subInfo.is_subscribed && (
                <motion.div variants={itemVariants} className="mb-6">
                    <div className="bg-white rounded-xl p-8 border border-gray-200 space-y-6">

                        {/* Info Cards Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Plan Info */}
                            <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm custom-card">
                                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Plan Bilgileri</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Plan</span>
                                        <span className="text-sm font-bold text-gray-900">{user?.plan?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Abonelik ID</span>
                                        <span className="text-sm font-mono text-gray-900">{subInfo.subscription_id}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Durum</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${subInfo.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {subInfo.status}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Method */}
                            <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm custom-card">
                                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Ödeme Yöntemi</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Kart</span>
                                        <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <span className="capitalize">{subInfo.card_brand}</span> •••• {subInfo.card_last_four}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Durum</span>
                                        <span className="text-sm font-bold text-emerald-600">Ödeme Aktif</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Dates */}
                            <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm custom-card">
                                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Tarihler</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Başlangıç</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {new Date(subInfo.started_at).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Yenilenme</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            {new Date(subInfo.renews_at).toLocaleDateString("tr-TR")}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Actions Section */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Faturalandırma ve Abonelik</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Tüm işlemler güvenli ödeme ortağımız Lemon Squeezy üzerinden yönetilir.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Manage / Portal */}
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={handleManageSubscription}
                                    className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Ödeme Yöntemi / Fatura</h4>
                                            <p className="text-xs text-gray-500 mt-1">Kartını güncelle veya faturalarını gör.</p>
                                        </div>
                                    </div>
                                </motion.button>

                                {/* Cancel / Resume */}
                                {subInfo.status === 'cancelled' ? (
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={handleResumeSubscription}
                                        className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Aboneliği Devam Ettir</h4>
                                                <p className="text-xs text-gray-500 mt-1">İptal işlemini geri al ve kullanıma devam et.</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={handleManageSubscription}
                                        className="group flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-red-300 hover:shadow-sm transition-all text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line x1="12" y1="2" x2="12" y2="12" /></svg>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Aboneliği İptal Et</h4>
                                                <p className="text-xs text-gray-500 mt-1">Yenilemeyi durdur (dönem sonuna kadar devam eder).</p>
                                            </div>
                                        </div>
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Pricing Grid Container with Background */}
            <motion.div variants={itemVariants} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">

                {/* Billing Cycle Toggle */}
                <div className="flex justify-center mb-10">
                    <div className="bg-gray-100 p-1 rounded-xl flex items-center border border-gray-200 relative">
                        <motion.div
                            className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm border border-gray-200"
                            layout
                            initial={false}
                            animate={{
                                x: billingCycle === 'monthly' ? 0 : '100%'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 relative z-10 w-32 ${billingCycle === 'monthly' ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Aylık
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 relative z-10 w-32 ${billingCycle === 'yearly' ? 'text-black' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Yıllık <span className="text-emerald-600 text-xs ml-1 font-extrabold">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                    {Object.entries(plans)
                        .filter(([key]) => key !== 'free')
                        .map(([key, plan]) => {
                            const status = getPlanStatus(key);
                            const isCurrent = status === 'current';
                            const isPremium = key === 'premium';
                            const isExpanded = expandedPlans[key];

                            return (
                                <motion.div
                                    layout
                                    variants={itemVariants}
                                    key={key}
                                    className={`relative bg-white rounded-2xl p-8 transition-shadow duration-300 flex flex-col
                                    border border-gray-200 
                                    ${isPremium
                                            ? 'shadow-lg ring-1 ring-black/5 scale-[1.02] z-10'
                                            : 'shadow-sm hover:shadow-md'
                                        }
                                `}
                                >
                                    {isPremium && (
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1000">
                                            <span className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                                                En Popüler
                                            </span>
                                        </div>
                                    )}

                                    <motion.div layout>
                                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                        <p className="mt-4 text-sm text-gray-500 h-10">
                                            {key === 'free' ? 'Bireysel kullanım ve başlangıç için.' :
                                                key === 'plus' ? 'İçerik üreticileri için ideal.' :
                                                    key === 'business' ? 'Ajanslar ve büyük ekipler için.' :
                                                        'Profesyoneller için sınırsız güç.'}
                                        </p>
                                        <div className="h-8 flex items-end">
                                            <AnimatePresence mode="wait">
                                                <motion.p
                                                    key={billingCycle}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-xl font-bold text-gray-900"
                                                >
                                                    {billingCycle === 'monthly' ? plan.price.monthly + '$' : plan.price.yearly + '$'} / {billingCycle === 'monthly' ? 'ay' : 'yıl'}
                                                </motion.p>
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>

                                    <motion.div layout className="mt-8">
                                        <motion.button
                                            whileHover={!isCurrent ? { scale: 1.02, y: -2 } : {}}
                                            whileTap={!isCurrent ? { scale: 0.98 } : {}}
                                            onClick={() => handlePlanAction(key, status)}
                                            disabled={isCurrent}
                                            className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-colors duration-200 border
                                            ${isCurrent
                                                    ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-default'
                                                    : 'bg-black text-white border-black hover:bg-gray-800'
                                                }`}
                                        >
                                            {isCurrent ? 'Mevcut Plan' : (status === 'upgrade' ? 'Yükselt' : (key === 'free' && !subInfo?.is_subscribed ? 'Şu Anki Plan' : 'Seç'))}
                                        </motion.button>
                                    </motion.div>

                                    <div className="mt-8 flex-1">
                                        <ul className="space-y-4">
                                            {renderFeature(true, `${plan.limits.profiles === -1 ? 'Sınırsız' : plan.limits.profiles} Profil`)}
                                            {renderFeature(true, `${plan.limits.bio_links === -1 ? 'Sınırsız' : plan.limits.bio_links} Biyografi Linki`)}
                                            {renderFeature(true, `${plan.limits.short_urls_monthly === -1 ? 'Sınırsız' : plan.limits.short_urls_monthly + ' Aylık'} Kısa Link`)}
                                            {renderFeature(true, `${plan.limits.qr_codes === -1 ? 'Sınırsız' : plan.limits.qr_codes} QR Kod Oluşturma`)}
                                        </ul>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.ul
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-4 mt-4 pt-4 border-t border-gray-100 overflow-hidden"
                                                >
                                                    {renderFeature(plan.features.qr_design, "Gelişmiş QR Tasarımı")}
                                                    {renderFeature(plan.features.detailed_analytics, `${plan.limits.analytics_history_days === 365 ? '1 Yıllık' : '24 Saatlik'} İstatistik Geçmişi`)}
                                                    {renderFeature(plan.features.remove_branding, "Branding Kaldırma")}
                                                    {renderFeature(plan.features.custom_domain, "Özel Domain")}
                                                    {renderFeature(plan.features.team_members, "Ekip Üyeleri & API")}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>

                                        <button
                                            onClick={() => togglePlan(key)}
                                            className="mt-6 w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-gray-900 transition-colors"
                                        >
                                            {isExpanded ? 'Daha Az Göster' : 'Tüm Özellikler'}
                                            <motion.svg
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </motion.svg>
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })}
                </div>
            </motion.div>
        </div>
    );
};

export default Subscription;
