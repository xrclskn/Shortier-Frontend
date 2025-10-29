import { AlertCircle } from "lucide-react";

export default function DeleteAccountModal({
                                               open,
                                               onClose,
                                               onConfirm,
                                               loading,
                                               error
                                           }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                    <AlertCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    Hesabı Sil?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
                </p>

                {error && (
                    <p className="text-sm text-red-600 text-center mb-4">{error}</p>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg transition-all font-medium"
                    >
                        İptal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Siliniyor..." : "Sil"}
                    </button>
                </div>
            </div>
        </div>
    );
}
