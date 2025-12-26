import axios from 'axios';
import { Plus, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { toast } from '@/utils/toast';
import ShortLinkCard from '@/components/dashboard/ShortLinkCard';
import apiClient from '@/api/client';
import { useState, useEffect } from 'react';
import config from '@/config';

export default function ShortUrl() {
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newUrl, setNewUrl] = useState('');
    const [title, setTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const [editingLink, setEditingLink] = useState(null);

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            const response = await apiClient.get('api/short-urls');
            setUrls(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Linkler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await apiClient.post('api/short-urls', {
                original_url: newUrl,
                title: title
            });
            setNewUrl('');
            setTitle('');
            fetchUrls();
            toast.success('Kısa link oluşturuldu');
        } catch (error) {
            toast.error('Link oluşturulurken hata oluştu');
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = (link) => {
        setEditingLink(link);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put(`api/short-urls/${editingLink.id}`, {
                title: editingLink.title,
                original_url: editingLink.originalUrl
            });

            setUrls(urls.map(u => u.id === editingLink.id ? { ...u, title: editingLink.title, original_url: editingLink.originalUrl } : u));
            setEditingLink(null);
            toast.success('Link güncellendi');
        } catch (error) {
            console.error(error);
            toast.error('Güncelleme başarısız');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await apiClient.delete(`api/short-urls/${id}`);
            setUrls(urls.filter(u => u.id !== id));
            toast.success('Link silindi');
        } catch (error) {
            toast.error('Silme işlemi başarısız');
        }
    };

    const handleToggle = async (id, currentStatus) => {
        // Optimistic update
        setUrls(urls.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u));

        try {
            // Assuming endpoint exists or using generic update
            await apiClient.put(`api/short-urls/${id}`, {
                is_active: !currentStatus
            });
        } catch (error) {
            // Revert
            setUrls(urls.map(u => u.id === id ? { ...u, is_active: currentStatus } : u));
            toast.error('Durum değiştirilemedi');
        }
    };

    return (
        <div className="mx-auto space-y-6">

            {/* Header & Create Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LinkIcon className="text-black" />
                        Link Kısaltıcı
                    </h1>
                    <p className="text-gray-500 mt-1">Uzun bağlantılarınızı kısaltın, paylaşın ve analiz edin.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <input
                                type="url"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all outline-none"
                                placeholder="https://ornek-uzun-link.com/..."
                                value={newUrl}
                                onChange={(e) => setNewUrl(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all outline-none"
                                placeholder="Link Başlığı (Opsiyonel)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={creating || !newUrl}
                            className={`px-6 py-3 bg-black text-white font-medium rounded-xl shadow-lg shadow-gray-200 hover:bg-gray-800 transform transition-all active:scale-95 flex items-center gap-2 ${creating ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Plus size={20} />
                            {creating ? 'Kısaltılıyor...' : 'Kısalt'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 px-1">Linkleriniz</h2>

                {loading ? (
                    // ... existing loading skeleton ...
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : urls.length === 0 ? (
                    // ... existing empty state ...
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LinkIcon className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Henüz link kısaltmadınız</h3>
                        <p className="text-gray-500 mt-1">Yukarıdaki formu kullanarak ilk linkinizi oluşturun.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {urls.map(url => (
                            <ShortLinkCard
                                key={url.id}
                                id={url.id}
                                title={url.title}
                                shortCode={url.short_code}
                                originalUrl={url.original_url}
                                clickCount={url.click_count}
                                isActive={url.is_active}
                                onDelete={handleDelete}
                                onToggle={handleToggle}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingLink && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Linki Düzenle</h2>
                                <p className="text-gray-500 text-sm mt-1">Link detaylarını güncelleyin</p>
                            </div>
                            <button
                                onClick={() => setEditingLink(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <span className="sr-only">Kapat</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kısa Link (Değiştirilemez)</label>
                                <div className="flex items-center px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-mono select-none">
                                    <span className="text-gray-400">{config.SHORT_LINK_DOMAIN}/</span>
                                    <span className="text-gray-900 font-semibold ml-0.5">{editingLink.shortCode}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Link Başlığı</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                    value={editingLink.title || ''}
                                    onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hedef URL</label>
                                <input
                                    type="url"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                                    value={editingLink.originalUrl || ''} // Using originalUrl from passed object
                                    onChange={(e) => setEditingLink({ ...editingLink, originalUrl: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setEditingLink(null)}
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-black text-white font-medium rounded-lg shadow-lg shadow-gray-200 hover:bg-gray-800 transition-colors"
                                >
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
