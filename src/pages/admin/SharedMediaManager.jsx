import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader2, Image as ImageIcon, FolderHeart, AlertCircle } from 'lucide-react';
import apiClient from "@/api/client";
import { toast } from '@/utils/toast';
import { config } from '@/config';
import { useAuth } from '@/context/AuthContext';

const SharedMediaManager = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { user } = useAuth();

    // Admin check from API response (set via ADMIN_EMAILS in backend .env)
    const isAdmin = user?.is_admin === true;

    useEffect(() => {
        if (isAdmin) {
            fetchMedia();
        }
    }, [isAdmin]);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/api/media/shared');
            setMedia(res.data);
        } catch (error) {
            console.error('Ortak görseller yüklenemedi:', error);
            toast.error('Görseller yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        let successCount = 0;
        let errorCount = 0;

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                errorCount++;
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                errorCount++;
                continue;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                await apiClient.post('/api/media/shared/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                successCount++;
            } catch (error) {
                console.error('Upload hatası:', error);
                errorCount++;
            }
        }

        if (successCount > 0) {
            toast.success(`${successCount} görsel başarıyla yüklendi.`);
            await fetchMedia();
        }
        if (errorCount > 0) {
            toast.error(`${errorCount} görsel yüklenemedi.`);
        }

        setUploading(false);
        e.target.value = ''; // Reset input
    };

    const handleDelete = async (path) => {
        if (!confirm('Bu görseli silmek istediğinize emin misiniz?')) return;

        try {
            await apiClient.delete('/api/media/shared', { data: { path } });
            setMedia(prev => prev.filter(item => item.path !== path));
            toast.success('Görsel silindi.');
        } catch (error) {
            console.error('Silme hatası:', error);
            toast.error('Silinemedi.');
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#eeefe6] p-6 flex items-center justify-center">
                <div className="bg-white rounded-xl p-8 shadow-lg text-center max-w-md">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
                    <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmuyor.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#eeefe6] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#010101] rounded-xl flex items-center justify-center">
                                <FolderHeart className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Ortak Görseller Yönetimi</h1>
                                <p className="text-gray-500">Tüm kullanıcıların erişebileceği ortak görseller</p>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {media.length} görsel
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                    <label className={`
                        flex flex-col items-center justify-center w-full h-40 
                        border-2 border-dashed rounded-xl cursor-pointer transition-all
                        ${uploading
                            ? 'bg-gray-50 border-gray-300 opacity-50 cursor-wait'
                            : 'bg-gray-50 border-gray-300 hover:border-[#010101] hover:bg-gray-100'
                        }
                    `}>
                        <div className="flex flex-col items-center justify-center">
                            {uploading ? (
                                <>
                                    <Loader2 className="w-10 h-10 mb-3 text-[#010101] animate-spin" />
                                    <p className="text-sm text-gray-500 font-semibold">Yükleniyor...</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-10 h-10 mb-3 text-[#010101]" />
                                    <p className="text-lg text-gray-700 font-medium">Toplu Görsel Yükle</p>
                                    <p className="text-sm text-gray-500 mt-1">Birden fazla görsel seçebilirsiniz</p>
                                    <p className="mt-3 text-xs text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
                                        JPG, PNG, WEBP (Max 10MB)
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            disabled={uploading}
                            onChange={handleFileUpload}
                        />
                    </label>
                </div>

                {/* Media Grid */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Yüklü Görseller</h2>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="animate-spin text-[#010101]" size={32} />
                        </div>
                    ) : media.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <ImageIcon size={48} className="mb-4 opacity-50" />
                            <p>Henüz ortak görsel bulunmuyor.</p>
                            <p className="text-sm mt-2">Yukarıdan görsel yükleyerek başlayın.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {media.map((item) => (
                                <div
                                    key={item.path}
                                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                                >
                                    <img
                                        src={config.API_BASE_URL + item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150?text=Error';
                                        }}
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <button
                                            onClick={() => handleDelete(item.path)}
                                            className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Filename */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 text-[10px] text-center truncate text-white">
                                        {item.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedMediaManager;
