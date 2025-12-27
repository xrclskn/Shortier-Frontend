import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, ArrowLeft, Lock, CheckCircle, AlertTriangle } from 'lucide-react';
import apiClient from '@/api/client';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token || !email) {
            setError('Geçersiz şifre sıfırlama bağlantısı.');
        }
    }, [token, email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (password !== passwordConfirmation) {
            setError('Şifreler eşleşmiyor.');
            setIsSubmitting(false);
            return;
        }

        try {
            await apiClient.post('/api/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/app/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eeefe6]">
            <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-3xl p-8 sm:p-10 space-y-6 border border-gray-100">
                {/* Logo & Başlık */}
                <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-11 h-11 rounded-xl bg-[#010101] flex items-center justify-center shadow-lg">
                            <LinkIcon size={26} color="#fff" strokeWidth={3} />
                        </div>
                        <span className="font-bold text-2xl text-[#010101] tracking-tight">Shortier</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Yeni Şifre Belirle</h2>
                    <p className="text-gray-400 text-sm text-center">
                        Hesabınız için yeni bir şifre oluşturun.
                    </p>
                </div>

                {success ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Şifre Güncellendi!</h3>
                        <p className="text-gray-500 text-sm">
                            Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
                        </p>
                    </div>
                ) : !token || !email ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Geçersiz Bağlantı</h3>
                        <p className="text-gray-500 text-sm">
                            Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
                        </p>
                        <Link
                            to="/app/forgot-password"
                            className="inline-flex items-center gap-2 text-[#010101] font-medium hover:underline"
                        >
                            Yeni bağlantı iste
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                                    Yeni Şifre
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#010101] bg-gray-50"
                                        placeholder="En az 8 karakter"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-600 mb-1">
                                    Şifre Tekrar
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        id="passwordConfirmation"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        required
                                        minLength={8}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#010101] bg-gray-50"
                                        placeholder="Şifreyi tekrar girin"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#010101] hover:bg-gray-800 text-white font-semibold py-3 rounded-xl shadow-lg transition disabled:opacity-70"
                            >
                                {isSubmitting ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                            </button>
                        </form>

                        <div className="text-center">
                            <Link
                                to="/app/login"
                                className="inline-flex items-center gap-2 text-gray-500 text-sm hover:text-[#010101]"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Giriş sayfasına dön
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
