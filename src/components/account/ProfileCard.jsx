import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import apiClient from '@/api/client'; // axios instance

export default function ProfileCard({ userData, onEdit }) {
    const isEmailVerified = Boolean(userData?.email_verified_at);
    const formattedDate = userData?.created_at
        ? new Date(userData.created_at).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Tarih bilinmiyor';

    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSendVerification = async () => {
        try {
            setSending(true);
            await apiClient.post('/api/email/send-verification');
            setSent(true);
        } catch (error) {
            console.error(error);
            alert('Doğrulama e-postası gönderilemedi, lütfen tekrar deneyin.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5">
                {userData?.photo ? (
                    <img
                        src={userData.photo}
                        alt={userData?.name || 'Kullanıcı'}
                        className="w-20 h-20 rounded-full border border-gray-100 object-cover"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 font-bold text-2xl border border-gray-100">
                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}

                <div className="flex-1 text-center sm:text-left space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <h2 className="text-xl font-bold text-gray-900">
                            {userData?.name || 'Kullanıcı'}
                        </h2>
                        {/* Status Badge */}
                        {isEmailVerified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100/50">
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Doğrulanmış Hesap
                            </span>
                        ) : (
                            <div className="flex items-center gap-2 justify-center sm:justify-start">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-100">
                                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                                    Doğrulanmamış
                                </span>
                                <button
                                    onClick={handleSendVerification}
                                    disabled={sending || sent}
                                    className={`text-xs font-medium underline transition-colors ${sent
                                        ? 'text-gray-400 no-underline cursor-default'
                                        : 'text-indigo-600 hover:text-indigo-800'
                                        }`}
                                >
                                    {sent ? 'Gönderildi' : (sending ? '...' : 'Doğrula')}
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-500 text-sm">
                        {userData?.email || 'email@example.com'}
                    </p>
                    <p className="text-gray-400 text-xs pt-1">
                        Üyelik: {formattedDate}
                    </p>
                </div>
            </div>
        </div>
    );
}
