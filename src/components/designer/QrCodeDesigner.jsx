import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { X, Download, Upload, Palette, LayoutGrid, Save, ArrowLeft } from 'lucide-react';
import { toast } from '@/utils/toast';

const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    image: "",
    dotsOptions: {
        color: "#000000",
        type: "rounded"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4 // Reduced default
    },
    qrOptions: {
        errorCorrectionLevel: 'H' // High error correction
    }
});

export default function QrCodeDesigner({ url, initialTitle = "QR Kod", onClose, initialSettings, onSave }) {

    const ref = useRef(null);
    const [fileExt, setFileExt] = useState("png");

    // Config State
    const [color, setColor] = useState(initialSettings?.color || "#000000");
    const [bgColor, setBgColor] = useState(initialSettings?.bgColor || "#ffffff");
    const [dotType, setDotType] = useState(initialSettings?.dotType || "rounded");
    const [cornerType, setCornerType] = useState(initialSettings?.cornerType || "extra-rounded");
    const [cornerColor, setCornerColor] = useState(initialSettings?.cornerColor || "#000000");
    const [image, setImage] = useState(initialSettings?.image || "");
    const [imageSize, setImageSize] = useState(initialSettings?.imageSize || 0.4);

    // Update state when initialSettings changes (e.g. after fetch)
    useEffect(() => {
        if (initialSettings) {
            if (initialSettings.color) setColor(initialSettings.color);
            if (initialSettings.bgColor) setBgColor(initialSettings.bgColor);
            if (initialSettings.dotType) setDotType(initialSettings.dotType);
            if (initialSettings.cornerType) setCornerType(initialSettings.cornerType);
            if (initialSettings.cornerColor) setCornerColor(initialSettings.cornerColor);
            if (initialSettings.image) setImage(initialSettings.image);
            if (initialSettings.imageSize) setImageSize(initialSettings.imageSize);
        }
    }, [initialSettings]);

    useEffect(() => {
        qrCode.append(ref.current);
    }, []);

    useEffect(() => {
        qrCode.update({
            data: url,
            image: image,
            dotsOptions: {
                color: color,
                type: dotType
            },
            backgroundOptions: {
                color: bgColor,
            },
            cornersSquareOptions: {
                type: cornerType,
                color: cornerColor
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5,
                imageSize: imageSize
            },
            qrOptions: {
                errorCorrectionLevel: 'H'
            }
        });
    }, [url, color, bgColor, dotType, cornerType, cornerColor, image, imageSize]);

    const handleDownload = () => {
        qrCode.download({
            extension: fileExt
        });
        toast.success(`QR Kod indirildi (.${fileExt})`);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const dotTypes = ["dots", "rounded", "classy", "classy-rounded", "square", "extra-rounded"];
    const cornerTypes = ["dot", "square", "extra-rounded"];

    const handleBack = () => {
        if (onClose) {
            onClose();
        } else {
            // Default behavior if not modal
            window.history.back();
        }
    };


    return (
        <div className="flex flex-col md:flex-row h-full gap-6">

            {/* Sol: Ayarlar - Daha Geniş ve Beyaz Tema */}
            <div className="w-full md:w-7/12 bg-white border border-gray-200 rounded-xl p-8 shadow-sm h-full">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{initialTitle}</h2>
                        <p className="text-sm text-gray-500 mt-1">QR kodunuzu özelleştirin</p>
                    </div>
                    <button onClick={handleBack} className="p-2 rounded-full bg-black text-gray-100 hover:bg-gray-600 hover:text-white transition-colors">
                        <ArrowLeft size={24} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="space-y-10">

                    {/* Renkler */}
                    <div className="space-y-4">
                        <h3 className="flex items-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                            <Palette size={16} className="mr-2 text-gray-400" /> Renk Paleti
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="group">
                                <label className="text-xs text-gray-500 block mb-2 font-medium">Nokta Rengi</label>
                                <div className="flex items-center bg-gray-50 p-1.5 rounded-lg border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-8 w-8 rounded-md cursor-pointer border-0 bg-transparent p-0 mr-2" />
                                    <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-transparent border-0 text-sm font-mono text-gray-900 focus:ring-0 uppercase" />
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-xs text-gray-500 block mb-2 font-medium">Arkaplan</label>
                                <div className="flex items-center bg-gray-50 p-1.5 rounded-lg border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-8 rounded-md cursor-pointer border-0 bg-transparent p-0 mr-2" />
                                    <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full bg-transparent border-0 text-sm font-mono text-gray-900 focus:ring-0 uppercase" />
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-xs text-gray-500 block mb-2 font-medium">Köşe Rengi</label>
                                <div className="flex items-center bg-gray-50 p-1.5 rounded-lg border border-gray-200 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                                    <input type="color" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} className="h-8 w-8 rounded-md cursor-pointer border-0 bg-transparent p-0 mr-2" />
                                    <input type="text" value={cornerColor} onChange={(e) => setCornerColor(e.target.value)} className="w-full bg-transparent border-0 text-sm font-mono text-gray-900 focus:ring-0 uppercase" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Şekiller */}
                    <div className="space-y-6">
                        <h3 className="flex items-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                            <LayoutGrid size={16} className="mr-2 text-gray-400" /> Görünüm & Stil
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-xs text-gray-500 block mb-3 font-medium">Nokta Stili</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {dotTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setDotType(t)}
                                            className={`py-2 px-1 text-[10px] font-medium rounded border transition-all duration-200 capitalize truncate
                                                ${dotType === t
                                                    ? 'bg-black text-white border-black shadow-md'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            {t.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-3 font-medium">Köşe Stili</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {cornerTypes.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setCornerType(t)}
                                            className={`py-2 px-1 text-[10px] font-medium rounded border transition-all duration-200 capitalize truncate
                                                ${cornerType === t
                                                    ? 'bg-black text-white border-black shadow-md'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                                                }`}
                                        >
                                            {t.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100"></div>

                    {/* Logo */}
                    <div className="space-y-4">
                        <h3 className="flex items-center text-sm font-medium text-gray-900 uppercase tracking-wider">
                            <Upload size={16} className="mr-2 text-gray-400" /> Marka Logosu
                        </h3>
                        <div className={`border border-dashed rounded-xl p-8 text-center transition-all relative cursor-pointer group
                            ${image ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}>

                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />

                            {image ? (
                                <div className="relative z-0">
                                    <div className="w-20 h-20 mx-auto bg-white rounded-lg shadow-sm border p-2 mb-3 object-contain flex items-center justify-center">
                                        <img src={image} alt="Logo" className="max-w-full max-h-full" />
                                    </div>
                                    <p className="text-xs text-gray-900 font-medium">Logo Yüklendi</p>
                                    <p className="text-[10px] text-gray-400 mt-1">Değiştirmek için tıklayın</p>
                                </div>
                            ) : (
                                <div>
                                    <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-black group-hover:text-white transition-colors">
                                        <Upload size={18} />
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium group-hover:text-gray-900">Logo Yükle</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG veya JPG (Max 2MB)</p>
                                </div>
                            )}
                        </div>
                        {image && (
                            <>
                                <div className="mt-4">
                                    <label className="text-xs text-gray-500 block mb-2 font-medium">Logo Boyutu: {Math.round(imageSize * 100)}%</label>
                                    <input
                                        type="range"
                                        min="0.2"
                                        max="0.4"
                                        step="0.05"
                                        value={imageSize}
                                        onChange={(e) => setImageSize(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>Küçük</span>
                                        <span>Büyük</span>
                                    </div>
                                </div>
                                <button onClick={() => setImage("")} className="text-xs font-medium text-red-500 hover:text-red-700 underline decoration-red-200 hover:decoration-red-500 underline-offset-2 transition-all mt-2">
                                    Logoyu Kaldır
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* Sağ: Önizleme - Sticky ve Dar Alan */}
            <div className="w-full md:w-5/12 relative">
                <div className="sticky top-6 flex flex-col bg-white border border-gray-200 rounded-2xl p-8 shadow-sm justify-start items-center">

                    <div className="text-center mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Önizleme</h3>
                        <p className="text-sm text-gray-500">Tasarımınız anlık güncellenir</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50 mb-8 transform transition-transform duration-300">
                        <div ref={ref} />
                    </div>

                    <div className="w-full max-w-xs space-y-3">
                        <div className="flex space-x-2">
                            <div className="relative">
                                <select
                                    value={fileExt}
                                    onChange={(e) => setFileExt(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-3 pr-8 py-2.5 outline-none focus:ring-1 focus:ring-black focus:border-black font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <option value="png">PNG</option>
                                    <option value="jpeg">JPEG</option>
                                    <option value="svg">SVG</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                onClick={handleDownload}
                                className="flex-1 bg-black hover:bg-gray-800 text-white rounded-lg px-4 py-2.5 flex items-center justify-center font-medium shadow-lg shadow-gray-200 transition-all active:scale-95"
                            >
                                <Download size={16} className="mr-2" />
                                <span>İndir</span>
                            </button>
                        </div>

                        {onSave && (
                            <button
                                onClick={() => onSave({ color, bgColor, dotType, cornerType, cornerColor, image, imageSize })}
                                className="w-full bg-white border border-gray-200 hover:border-black text-gray-900 rounded-lg px-4 py-2.5 flex items-center justify-center font-medium transition-all active:scale-95 hover:shadow-md"
                            >
                                <Save size={16} className="mr-2" />
                                <span>Kaydet</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
