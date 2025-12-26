import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Plus, UserCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/api/client';

export default function ProfileSwitcher({ className = "", align = "left" }) {
    const { profiles, activeProfile, switchProfile, refreshProfiles, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [error, setError] = useState('');

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await apiClient.post('/api/profile/create', { username: newProfileName });
            await refreshProfiles();
            setIsCreating(false);
            setNewProfileName('');
            // Auto switch to new profile? Maybe not necessary yet.
        } catch (err) {
            setError(err.response?.data?.message || 'Profil oluşturulamadı.');
        }
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={toggleOpen}
                className="w-full flex items-center justify-between p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-white gap-2"
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {activeProfile?.username?.substring(0, 2).toUpperCase() || 'TR'}
                    </div>
                    <div className="flex flex-col items-start min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                            {activeProfile?.username || 'Profil Seç'}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-[120px]">
                            {user?.email}
                        </span>
                    </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden min-w-[240px] ${align === 'right' ? 'right-0' : 'left-0'}`}
                    >
                        <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Profillerim</h3>
                            {profiles.map(profile => (
                                <button
                                    key={profile.id}
                                    onClick={() => {
                                        switchProfile(profile.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors text-left ${activeProfile?.id === profile.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <UserCircle className="w-4 h-4 opacity-70" />
                                        <span className="text-sm font-medium">{profile.username}</span>
                                    </div>
                                    {activeProfile?.id === profile.id && <Check className="w-4 h-4 text-blue-600" />}
                                </button>
                            ))}
                        </div>

                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                            {!isCreating ? (
                                <button
                                    onClick={() => setIsCreating(true)}
                                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                    Yeni Profil Oluştur
                                </button>
                            ) : (
                                <form onSubmit={handleCreateProfile} className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Kullanıcı adı..."
                                        value={newProfileName}
                                        onChange={(e) => setNewProfileName(e.target.value)}
                                        className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        autoFocus
                                    />
                                    {error && <p className="text-xs text-red-500">{error}</p>}
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="flex-1 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800"
                                        >
                                            Oluştur
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsCreating(false);
                                                setError('');
                                            }}
                                            className="flex-1 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300"
                                        >
                                            İptal
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
