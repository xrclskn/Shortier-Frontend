import { Trash2, LogOut } from "lucide-react";
import { useState } from "react";

export default function DangerZone({ deleteAccount, logout }) {
    const [showModal, setShowModal] = useState(false);
    const [deleteStep, setDeleteStep] = useState(1); // 1: reason, 2: password
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteReason, setDeleteReason] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const handleNextStep = () => {
        if (deleteStep === 1 && !deleteReason.trim()) {
            setDeleteError('Lütfen bir neden belirtin.');
            return;
        }
        setDeleteError(null);
        setDeleteStep(2);
    };

    const handleConfirmDelete = async () => {
        setDeleteError(null);
        if (!deletePassword) {
            setDeleteError('Şifrenizi girmeniz gerekiyor.');
            return;
        }
        try {
            setDeleteLoading(true);
            await deleteAccount({ password: deletePassword, reason: deleteReason });
            logout();
            window.location.href = "/";
        } catch (err) {
            setDeleteError(err?.response?.data?.message || "Silme hatası oluştu");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>
            <div className="space-y-6">
                {/* Logout Section */}
                <div className="bg-white flex justify-between  items-center rounded-xl border border-gray-200 p-6 shadow-custom">
                    <h3 className="text-lg font-semibold text-gray-900">Oturumu kapat</h3>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                        <LogOut size={16} className="inline-block mr-2" />
                        Oturumu Kapat
                    </button>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 rounded-2xl shadow-custom border border-red-200 p-8">
                    <h3 className="text-xl font-bold text-red-900 mb-2">Hesabı Sil</h3>
                    <p className="text-red-700 mb-4">
                        Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                    </p>

                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-6 flex items-center justify-center space-x-2 px-6 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all font-medium"
                    >
                        <Trash2 size={18} />
                        <span>Hesabı Sil</span>
                    </button>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {deleteStep === 1 ? 'Hesabı Sil' : 'Şifre Doğrulaması'}
                        </h3>

                        {deleteStep === 1 && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Neden silmek istiyorsunuz?</label>
                                <textarea
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    placeholder="Örn: artık kullanmıyorum..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none transition-all resize-none"
                                    rows={4}
                                />
                                {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => { setShowModal(false); setDeleteStep(1); setDeleteError(null); }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleNextStep}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        İleri
                                    </button>
                                </div>
                            </div>
                        )}

                        {deleteStep === 2 && (
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Şifrenizi girin</label>
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 outline-none transition-all"
                                />
                                {deleteError && <p className="text-sm text-red-600">{deleteError}</p>}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => { setDeleteStep(1); setDeleteError(null); }}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                                    >
                                        Geri
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        disabled={deleteLoading}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-60"
                                    >
                                        {deleteLoading ? 'Siliniyor...' : 'Hesabı Sil'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
