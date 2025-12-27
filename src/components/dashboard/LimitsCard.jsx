import React from 'react';
import { Link2, QrCode, User, Calendar, Crown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import useSubscription from '@/hooks/useSubscription';

function LimitBar({ current, max, label, icon: Icon }) {
    const isUnlimited = max === -1;
    const percentage = isUnlimited ? 100 : Math.min((current / max) * 100, 100);
    const isNearLimit = !isUnlimited && percentage >= 80;
    const isAtLimit = !isUnlimited && current >= max;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <span className={`text-sm font-bold ${isAtLimit ? 'text-red-600' : 'text-gray-900'}`}>
                    {current} / {isUnlimited ? '∞' : max}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${isAtLimit ? 'bg-red-500' : 'bg-[#010101]'}`}
                    style={{ width: isUnlimited ? '100%' : `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default function LimitsCard({ usage = {}, limits: propLimits, planName: propPlanName }) {
    const { info, loading } = useSubscription();

    if (loading && !propLimits) {
        return (
            <div className="rounded-xl p-6 bg-white shadow-custom animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 w-full bg-gray-100 rounded" />
                            <div className="h-2 w-full bg-gray-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const limits = propLimits || info?.limits || {};
    const planName = propPlanName || info?.plan_name || 'Free';

    return (
        <div className="rounded-xl p-6 bg-white shadow-custom">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#010101]" />
                    <h3 className="text-lg font-bold text-gray-900">Limitler</h3>
                </div>
                <span className="px-3 py-1 bg-[#010101] text-white text-xs font-bold rounded-full uppercase">
                    {planName}
                </span>
            </div>

            <div className="space-y-5">
                <LimitBar
                    current={usage.profiles || 0}
                    max={limits.profiles ?? 1}
                    label="Profil"
                    icon={User}
                />
                <LimitBar
                    current={usage.bio_links || 0}
                    max={limits.bio_links ?? 5}
                    label="Biyografi Linki"
                    icon={Link2}
                />
                <LimitBar
                    current={usage.short_urls_this_month || 0}
                    max={limits.short_urls_monthly ?? 5}
                    label="Kısa Link (Bu Ay)"
                    icon={Link2}
                />
                <LimitBar
                    current={usage.qr_codes || 0}
                    max={limits.qr_codes ?? 1}
                    label="QR Kod"
                    icon={QrCode}
                />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>İstatistik Geçmişi</span>
                    </div>
                    <span className="font-bold text-gray-900">
                        {limits.analytics_history_days === 365 ? '1 Yıl' : `${limits.analytics_history_days || 1} Gün`}
                    </span>
                </div>
            </div>

            {planName === 'Free' && (
                <NavLink
                    to="/app/subscription"
                    className="mt-6 block w-full text-center py-3 bg-[#010101] text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                    🚀 Planı Yükselt
                </NavLink>
            )}
        </div>
    );
}

