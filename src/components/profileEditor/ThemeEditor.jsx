// ThemeEditor.jsx
import { Palette } from "lucide-react";
import {colorSchemes} from "@/components/profileEditor/Constants.js";

export default function ThemeEditor({
                                        bgType,
                                        setBgType,
                                        bgGradient,
                                        setBgGradient,
                                        bgColor,
                                        setBgColor,
                                        textColor,
                                        setTextColor,
                                        onApplyColorScheme
                                    }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Palette className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Tema ve Görünüm</h2>
            </div>

            <div className="space-y-6">
                {/* Arkaplan Türü Seçimi */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Arkaplan Türü</h3>
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                bgType === "solid" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setBgType("solid")}
                        >
                            Düz Renk
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                bgType === "gradient" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setBgType("gradient")}
                        >
                            Gradient
                        </button>
                    </div>

                    {bgType === "gradient" ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">1. Renk</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={bgGradient.color1}
                                            onChange={e => setBgGradient({...bgGradient, color1: e.target.value})}
                                            className="w-10 h-10 border-2 border-gray-200 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={bgGradient.color1}
                                            onChange={e => setBgGradient({...bgGradient, color1: e.target.value})}
                                            className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">2. Renk</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={bgGradient.color2}
                                            onChange={e => setBgGradient({...bgGradient, color2: e.target.value})}
                                            className="w-10 h-10 border-2 border-gray-200 rounded-lg cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={bgGradient.color2}
                                            onChange={e => setBgGradient({...bgGradient, color2: e.target.value})}
                                            className="flex-1 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Gradient Açısı: {bgGradient.angle}°</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={bgGradient.angle}
                                    onChange={e => setBgGradient({...bgGradient, angle: parseInt(e.target.value)})}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Arkaplan Rengi</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={e => setBgColor(e.target.value)}
                                    className="w-12 h-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={bgColor}
                                    onChange={e => setBgColor(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                    placeholder="#f8fafc"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Hazır Gradient Temalar */}
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Hazır Temalar</h3>
                    <div className="flex flex-wrap gap-3">
                        {colorSchemes.map((theme, i) => (
                            <button
                                key={i}
                                className="relative w-20 h-20 rounded-lg border-2 border-gray-200 overflow-hidden hover:border-gray-300 transition-colors group"
                                style={{ background: theme.bg }}
                                onClick={() => onApplyColorScheme(theme)}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                        className="text-xs font-medium px-1 py-1 rounded bg-white/50 backdrop-blur-sm"
                                        style={{ color: theme.text }}
                                    >
                                        {theme.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Metin Rengi */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Metin Rengi</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={textColor}
                            onChange={e => setTextColor(e.target.value)}
                            className="w-12 h-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                        />
                        <input
                            type="text"
                            value={textColor}
                            onChange={e => setTextColor(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                            placeholder="#1e293b"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}