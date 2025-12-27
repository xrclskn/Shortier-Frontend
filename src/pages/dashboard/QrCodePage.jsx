import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QrCodeDesigner from '@/components/designer/QrCodeDesigner';
import axios from "axios";
import { toast } from '@/utils/toast';
import { config } from '@/config';
import { BarChart2 } from 'lucide-react';

export default function QrCodePage() {
    const [searchParams] = useSearchParams();
    const url = searchParams.get('url');
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const navigate = useNavigate();

    const [initialSettings, setInitialSettings] = useState(null);

    useEffect(() => {
        if (type && id) {
            fetchSettings();
        }
    }, [type, id]);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${config.API_BASE_URL}/api/qr-design/${type}/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data) {
                setInitialSettings(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const handleSave = async (settings) => {
        if (!type || !id) return;
        try {
            await axios.post(`${config.API_BASE_URL}/api/qr-design`, {
                type,
                id,
                settings
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            toast.success('Tasarım kaydedildi');
        } catch (error) {
            console.error("Failed to save settings", error);
            toast.error('Kaydetme başarısız');
        }
    };

    if (!url) {
        return (
            <div className="p-8 text-center text-gray-500">
                Lütfen QR kodu oluşturulacak bir link belirtin.
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] h-auto relative">
            {type && id && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => navigate(`/app/analytics/${type}/${id}`)}
                        className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md flex items-center hover:bg-gray-50 border border-gray-200 transition-colors"
                    >
                        <BarChart2 size={18} className="mr-2" />
                        İstatistikler
                    </button>
                </div>
            )}
            <QrCodeDesigner
                url={decodeURIComponent(url)}
                initialTitle="QR Kod Oluşturucu"
                initialSettings={initialSettings}
                onSave={type && id ? handleSave : undefined}
            />
        </div>
    );
}
