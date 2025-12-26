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
        <div className="bg-white rounded-2xl shadow-custom border border-gray-200 p-8 duration-300">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                    {userData?.photo ? (
                        <img
                            src={userData.photo}
                            alt={userData?.name || 'Kullanıcı'}
                            className="w-28 h-28 rounded-full border-4 border-[#efefef] object-cover shadow-md"
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-[#efefef] flex items-center justify-center text-[#010101] font-bold text-3xl shadow-md">
                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    )}

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {userData?.name || 'Kullanıcı'}
                        </h2>

                        {/* ✅ E-posta doğrulama kısmı */}
                        {isEmailVerified ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                E-posta Doğrulandı
                            </span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    E-posta Doğrulanmadı
                                </span>

                                <button
                                    onClick={handleSendVerification}
                                    disabled={sending || sent}
                                    className={`text-xs font-medium rounded-md px-3 py-2 transition-all ${sent
                                            ? 'bg-gray-100 text-gray-500 cursor-default'
                                            : 'bg-[#010101] text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {sent
                                        ? 'E-posta Gönderildi ✔'
                                        : sending
                                            ? 'Gönderiliyor...'
                                            : 'Doğrulama Maili Gönder'}
                                </button>
                            </div>
                        )}

                        <p className="text-gray-600 text-sm">
                            E-Posta : {userData?.email || 'email@example.com'}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Üye olma tarihi: {formattedDate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
