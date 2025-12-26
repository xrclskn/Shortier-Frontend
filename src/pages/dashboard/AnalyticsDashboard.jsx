import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Calendar, BarChart2, PieChart as IconPieChart, TrendingUp, Smartphone, Globe, MapPin, MousePointer, Link2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from '@/utils/toast';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {/* Trend placeholder */}
            {trend && (
                <div className={`flex items-center text-xs font-medium mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                    {Math.abs(trend)}% geçen döneme göre
                </div>
            )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
    </div>
);

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('7d');

    useEffect(() => {
        fetchStats();
    }, [period]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/stats?period=${period}`);
            setStats(response.data);
        } catch (error) {
            console.error('İstatistikler yüklenemedi:', error);
            toast.error('Veriler alınırken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!stats) return null;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Genel Bakış</h1>
                    <p className="text-gray-500">Tüm linklerinizin ve profilinizin performans raporu</p>
                </div>

                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    {['24h', '7d', '30d', 'all'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${period === p
                                    ? 'bg-black text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {p === '24h' ? '24 Saat' : p === '7d' ? '7 Gün' : p === '30d' ? '30 Gün' : 'Tümü'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Toplam Tıklama"
                    value={stats.totals.clicks}
                    icon={MousePointer}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Profil Görüntüleme"
                    value={stats.totals.visits}
                    icon={Globe}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Tekil Ziyaretçi"
                    value={stats.totals.unique_visitors}
                    icon={Users}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Dönen Ziyaretçi"
                    value={stats.totals.returning_visits}
                    icon={TrendingUp}
                    color="bg-orange-500"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Zaman Çizelgesi</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chart.data}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="views" name="Görüntülenme" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                                <Area type="monotone" dataKey="clicks" name="Tıklama" stroke="#82ca9d" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Smartphone size={20} className="text-gray-500" /> Cihaz Dağılımı
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.breakdowns.device}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="visits"
                                >
                                    {stats.breakdowns.device.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {stats.breakdowns.device.slice(0, 4).map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-gray-600">{item.device}</span>
                                </div>
                                <span className="font-semibold">{item.visits}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Links */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Link2 size={20} className="text-gray-500" /> En Çok Tıklanan Linkler
                    </h3>
                    <div className="space-y-4">
                        {stats.top_links.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Henüz veri yok</p>
                        ) : (
                            stats.top_links.map((link, i) => (
                                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-medium text-gray-900 truncate">{link.title || 'İsimsiz Link'}</p>
                                            <p className="text-xs text-gray-500 truncate">{link.url}</p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-gray-900 pl-4">{link.clicks}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Locations */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin size={20} className="text-gray-500" /> Konumlar (Ülke)
                    </h3>
                    <div className="space-y-4">
                        {stats.breakdowns.country.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Henüz veri yok</p>
                        ) : (
                            stats.breakdowns.country.slice(0, 5).map((item, i) => (
                                <div key={i} className="flex items-center justify-between relative">
                                    <div className="flex items-center gap-3 z-10">
                                        <span className="text-2xl">{item.country_code ? `🇹🇷` : '🏳️'}</span> {/* Bayrak placeholder */}
                                        <span className="font-medium text-gray-700">{item.country}</span>
                                    </div>
                                    <div className="flex items-center gap-4 z-10">
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(item.visits / stats.totals.visits) * 100}%` }}
                                            />
                                        </div>
                                        <span className="font-bold text-gray-900 w-8 text-right">{item.visits}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AnalyticsDashboard;
