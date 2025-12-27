import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/client';
import { toast } from '@/utils/toast';
import { QrCode, Edit2, BarChart2, ExternalLink, Trash2, Loader2, Download } from 'lucide-react';

const QrCodes = () => {
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQrCodes();
    }, []);

    const fetchQrCodes = async () => {
        try {
            const response = await axios.get('/api/qr-designs');
            setQrCodes(response.data);
        } catch (error) {
            console.error('QR kodları alınamadı:', error);
            toast.error('QR kodlarınız yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (qr) => {
        // Navigate to QrDesigner with params
        // Adjust URL params to match QrCodePage expectations
        const targetUrl = qr.target_url;
        const type = qr.type; // profile_link or short_url
        const id = qr.designable_id;

        // We need to pass the FULL URL that the QR codes. 
        // For short_url type, the QR content is usually the short link itself (e.g. shortier.link/abc).
        // For profile_link type, it might be the original URL or a redirect link.
        // Looking at QrCodePage, it reads `url`, `type`, `id`.

        let urlParam = targetUrl;
        if (qr.type === 'short_url') {
            urlParam = qr.short_url || targetUrl;
        }

        navigate(`/app/qr-designer?url=${encodeURIComponent(urlParam)}&type=${type}&id=${id}`);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f8f9fa]">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#ffffff] p-4 md:p-8 ">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">QR Kodlarım</h1>
                        <p className="text-gray-500 mt-1">Oluşturduğunuz ve özelleştirdiğiniz tüm QR kodlar burada.</p>
                    </div>
                </div>

                {qrCodes.length === 0 ? (
                    <div className="bg-white rounded-xl  p-12 text-center">
                        <QrCode size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">Henüz QR kodunuz yok</h3>
                        <p className="text-gray-500 mt-2 mb-6">
                            Link kısaltarak veya profilinizdeki linkler için QR kod tasarlayabilirsiniz.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {qrCodes.map((qr) => (
                            <div key={qr.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-shadow group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${qr.type === 'short_url' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {qr.type === 'short_url' ? 'Kısa Link' : 'Profil Linki'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(qr.updated_at).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 truncate" title={qr.name}>
                                                {qr.name}
                                            </h3>
                                            <a
                                                href={qr.short_url || qr.target_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-gray-500 hover:text-gray-700 truncate block mt-1 flex items-center gap-1"
                                            >
                                                {qr.short_url || qr.target_url}
                                                <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview Area - Could render actual QR here if we had the component, but for now placeholders or actions */}
                                <div className="px-6 pb-6 pt-0">
                                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-40 group-hover:bg-gray-100 transition-colors">
                                        {/* We rely on QrCodeDesigner for rendering, here just a placeholder or the stored image/logo if possible */}
                                        {/* Since we don't store the rendered image, just show icon */}
                                        <QrCode size={64} style={{ color: qr.settings?.fgColor || '#000000' }} />
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(qr)}
                                            className="p-2 text-gray-600 hover:bg-white hover:text-[#010101] rounded-lg transition-all"
                                            title="Düzenle"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/app/analytics/${qr.type}/${qr.designable_id}`)}
                                            className="p-2 text-gray-600 hover:bg-white hover:text-green-600 rounded-lg transition-all"
                                            title="İstatistikler"
                                        >
                                            <BarChart2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default QrCodes;
