import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext.jsx";
import { Link as LinkIcon } from "lucide-react";

const Register = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, error, setError, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);


    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.password_confirmation) {
            setError('Şifreler eşleşmiyor');
            return;
        }
        setIsSubmitting(true);
        const result = await register(userData);
        if (result.success) navigate('/');
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-3xl p-8 sm:p-10 space-y-8 border border-blue-100/70">
                {/* Logo & Başlık */}
                <div className="flex flex-col items-center mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                            <LinkIcon size={26} color="#fff" strokeWidth={3} />
                        </div>
                        <span className="font-bold text-2xl text-blue-700 tracking-tight">Shortier</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Kayıt Ol</h2>
                    <p className="text-gray-400 text-sm">Aramıza katıl, bağlantılarını yönetmeye başla!</p>
                </div>
                {/* Hata mesajı */}
                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm mb-2">
                        {error}
                    </div>
                )}
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">İsim</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-600 mb-1">Şifre Tekrar</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={userData.password_confirmation}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition disabled:opacity-70"
                    >
                        {isSubmitting ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-2">
                    Zaten hesabınız var mı?{' '}
                    <NavLink to="/login" className="text-blue-600 hover:underline font-medium">
                        Giriş Yapın
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Register;
