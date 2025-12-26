import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Check, Loader2 } from 'lucide-react';
import apiClient from "@/api/client";
import { toast } from '@/utils/toast';

const FileManagerModal = ({ isOpen, onClose, onSelect, title = "Görsel Seç" }) => {
    const [activeTab, setActiveTab] = useState('library'); // library, upload
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Modalı açınca verileri yükle
    useEffect(() => {
        if (isOpen) {
            fetchMedia();
            setActiveTab('library');
            setSelectedFile(null);
        }
    }, [isOpen]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/media');
            setMedia(res.data);
        } catch (error) {
            console.error('Medya yüklenemedi:', error);
            toast.error('Görseller yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kontrol
        if (!file.type.startsWith('image/')) {
            toast.error('Lütfen geçerli bir resim dosyası seçin.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await apiClient.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Görsel başarıyla yüklendi.');
            await fetchMedia(); // Listeyi yenile
            setActiveTab('library'); // Kütüphaneye dön
        } catch (error) {
            console.error('Upload hatası:', error);
            toast.error('Yükleme başarısız oldu.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e, path) => {
        e.stopPropagation(); // Seçimi engelle
        if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return;

        try {
            await apiClient.delete('/api/media', { data: { path } });
            setMedia(prev => prev.filter(item => item.path !== path));
            toast.success('Görsel silindi.');
            if (selectedFile?.path === path) setSelectedFile(null);
        } catch (error) {
            console.error('Silme hatası:', error);
            toast.error('Silinemedi.');
        }
    };

    const handleConfirm = () => {
        if (selectedFile) {
            onSelect(selectedFile.url);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50 px-4">
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'library'
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Medya Kütüphanesi
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'upload'
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Yeni Yükle
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 min-h-[400px]">
                    {activeTab === 'library' ? (
                        loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="animate-spin text-purple-500" size={32} />
                            </div>
                        ) : media.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <ImageIcon size={48} className="mb-4 opacity-50" />
                                <p>Henüz hiç görsel yüklemediniz.</p>
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className="mt-4 text-purple-600 hover:underline font-medium"
                                >
                                    İlk görselini yükle
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {media.map((item) => (
                                    <div
                                        key={item.path}
                                        onClick={() => setSelectedFile(item)}
                                        className={`group relative aspect-square bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${selectedFile?.path === item.path
                                            ? 'border-purple-500 ring-2 ring-purple-200'
                                            : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <img
                                            src={(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + item.url}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error('Image Error:', e.target.src);
                                                e.target.src = 'https://via.placeholder.com/150?text=Error';
                                            }}
                                        />

                                        {/* Overlay & Actions */}
                                        <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-start justify-end p-2 ${selectedFile?.path === item.path ? 'bg-black/10' : ''
                                            }`}>
                                            <button
                                                onClick={(e) => handleDelete(e, item.path)}
                                                className="bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                                                title="Sil"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Selection Indicator */}
                                        {selectedFile?.path === item.path && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-purple-500/20 pointer-events-none">
                                                <div className="bg-purple-500 text-white p-2 rounded-full shadow-lg">
                                                    <Check size={20} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-1 text-[10px] text-center truncate text-gray-600">
                                            {item.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <label className={`
                                flex flex-col items-center justify-center w-full max-w-lg h-80 
                                border-2 border-dashed rounded-xl cursor-pointer transition-all
                                ${uploading
                                    ? 'bg-gray-50 border-gray-300 opacity-50 cursor-wait'
                                    : 'bg-white border-purple-200 hover:border-purple-400 hover:bg-purple-50'
                                }
                            `}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploading ? (
                                        <>
                                            <Loader2 className="w-12 h-12 mb-3 text-purple-500 animate-spin" />
                                            <p className="mb-2 text-sm text-gray-500 font-semibold">Görsel işleniyor...</p>
                                            <p className="text-xs text-gray-400">WebP formatına dönüştürülüyor</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 mb-3 text-purple-500" />
                                            <p className="mb-2 text-lg text-gray-700 font-medium">Görsel Yüklemek İçin Tıklayın</p>
                                            <p className="text-sm text-gray-500">veya sürükleyip bırakın</p>
                                            <p className="mt-4 text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                                JPG, PNG, WEBP (Max 5MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    disabled={uploading}
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedFile || activeTab === 'upload'}
                        className={`
                            px-6 py-2 rounded-lg font-medium text-sm transition-all flex items-center space-x-2
                            ${!selectedFile || activeTab === 'upload'
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-purple-500/30'
                            }
                        `}
                    >
                        <span>Seç ve Kullan</span>
                        <Check size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FileManagerModal;
