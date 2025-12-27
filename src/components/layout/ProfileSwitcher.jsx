import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Plus, UserCircle, Check, Trash2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '@/api/client';

export default function ProfileSwitcher({ className = "", align = "left" }) {
    const { profiles, activeProfile, switchProfile, refreshProfiles, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [error, setError] = useState('');

    // Delete modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState(null);
    const [confirmText, setConfirmText] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await apiClient.post('/api/profile/create', { username: newProfileName });
            await refreshProfiles();
            setIsCreating(false);
            setNewProfileName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Profil oluşturulamadı.');
        }
    };

    const openDeleteModal = (profile) => {
        setProfileToDelete(profile);
        setConfirmText('');
        setDeleteError('');
        setDeleteModalOpen(true);
        setIsOpen(false);
    };

    const handleDeleteProfile = async () => {
        if (confirmText !== 'DELETE') {
            setDeleteError('Lütfen silme işlemini onaylamak için "DELETE" yazın.');
            return;
        }

        setIsDeleting(true);
        setDeleteError('');

        try {
            await apiClient.delete(`/api/profile/${profileToDelete.id}`, {
                data: { confirm: 'DELETE' }
            });
            await refreshProfiles();
            setDeleteModalOpen(false);
            setProfileToDelete(null);
            setConfirmText('');
        } catch (err) {
            setDeleteError(err.response?.data?.message || 'Profil silinemedi.');
        } finally {
            setIsDeleting(false);
        }
    };

    const canDeleteProfile = profiles.length > 1;

    return (
        <>
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
                            className={`absolute top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden min-w-[260px] ${align === 'right' ? 'right-0' : 'left-0'}`}
                        >
                            <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Profillerim</h3>
                                {profiles.map(profile => (
                                    <div
                                        key={profile.id}
                                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors ${activeProfile?.id === profile.id ? 'bg-blue-50' : ''}`}
                                    >
                                        <button
                                            onClick={() => {
                                                switchProfile(profile.id);
                                                setIsOpen(false);
                                            }}
                                            className={`flex-1 flex items-center gap-2 text-left ${activeProfile?.id === profile.id ? 'text-blue-700' : 'text-gray-700'}`}
                                        >
                                            <UserCircle className="w-4 h-4 opacity-70" />
                                            <span className="text-sm font-medium">{profile.username}</span>
                                            {activeProfile?.id === profile.id && <Check className="w-4 h-4 text-blue-600" />}
                                        </button>
                                        {canDeleteProfile && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteModal(profile);
                                                }}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Profili Sil"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
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

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                        onClick={() => setDeleteModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-red-50 p-4 flex items-center gap-3 border-b border-red-100">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-red-900">Profili Sil</h3>
                                    <p className="text-sm text-red-700">Bu işlem geri alınamaz!</p>
                                </div>
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-red-600" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2">
                                        <strong className="text-gray-900">@{profileToDelete?.username}</strong> profilini silmek üzeresiniz.
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Silinecek veriler:
                                    </p>
                                    <ul className="text-xs text-gray-500 list-disc list-inside mt-1 space-y-0.5">
                                        <li>Tüm linkler ve sosyal bağlantılar</li>
                                        <li>QR kod tasarımları</li>
                                        <li>Kısa URL'ler</li>
                                        <li>Ziyaret ve tıklama istatistikleri</li>
                                    </ul>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Onaylamak için <strong className="text-red-600">DELETE</strong> yazın:
                                    </label>
                                    <input
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                        className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        placeholder="DELETE"
                                        autoComplete="off"
                                    />
                                </div>

                                {deleteError && (
                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{deleteError}</p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleDeleteProfile}
                                    disabled={confirmText !== 'DELETE' || isDeleting}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-colors ${confirmText === 'DELETE'
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {isDeleting ? 'Siliniyor...' : 'Profili Sil'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
