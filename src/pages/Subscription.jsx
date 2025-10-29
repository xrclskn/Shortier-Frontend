import React, {useState} from 'react';
import {
    ArrowLeft,
    Check,
    Calendar,
    RefreshCw,
    CreditCard,
    AlertCircle,
    Zap,
    Crown
} from 'lucide-react';
import {NavLink} from 'react-router-dom';
import CheckoutButton from "@/components/lemon/CheckoutButton.jsx";
import ManageBillingButton from "@/components/lemon/ManageBillingButton.jsx";
import SubscriptionStatusCard from "@/components/lemon/SubscriptionStatusCard.jsx";
import {SubscriptionProvider} from "@/context/SubscriptionContext.jsx";

const Subscription = () => {
    // Dummy user subscription status - değiştir: true = abone, false = abone değil
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [autoRenew, setAutoRenew] = useState(true);


    const subscribedUserData = {
        plan: 'Premium',
        status: 'Aktif',
        startDate: '15 Ocak 2024',
        nextPaymentDate: '15 Ocak 2025',
        daysRemaining: 187,
        price: 0.99,
        currency: '$',
        billingCycle: 'Aylık',
        autoRenew: true
    };

    // Paket bilgileri
    const packageInfo = {
        name: 'Premium Paket',
        price: 0.99,
        currency: '$',
        billingCycle: 'Aylık',
        description: 'Tüm özelliklere erişim sağlayan tam paket',
        features: [
            {name: 'Sınırsız Link Oluşturma', icon: '∞'},
            {name: 'Gelişmiş İstatistikler', icon: '📊'},
            {name: 'Özel Tasarım Seçenekleri', icon: '🎨'},
            {name: 'API Erişimi', icon: '⚙️'},
            {name: 'Öncelikli Destek', icon: '🎯'},
            {name: 'Ekip İşbirliği', icon: '👥'}
        ]
    };

    return (
            <div className="min-h-screen">
                <main className="mx-auto space-y-6">

                    <SubscriptionStatusCard/>

                </main>
            </div>
    );
};

export default Subscription;

