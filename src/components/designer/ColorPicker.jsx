import React, { useState, useRef, useEffect } from 'react';
import {
    Palette,
    Pipette,
    Copy,
    Check,
    RotateCcw,
    Shuffle,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    Heart,
    Star,
    Zap,
    Sparkles
} from 'lucide-react';

const ColorPicker = ({
    value = '#3b82f6',
    onChange = () => { },
    showPresets = true,
    showGradients = true,
    showOpacity = true,
    type = 'color' // 'color' | 'gradient'
}) => {
    const [activeTab, setActiveTab] = useState(type === 'gradient' ? 'gradients' : 'solid');
    const [copiedColor, setCopiedColor] = useState(null);
    const [customColors, setCustomColors] = useState([]);
    const [gradientStops, setGradientStops] = useState([
        { color: '#3b82f6', position: 0 },
        { color: '#8b5cf6', position: 100 }
    ]);
    const [gradientDirection, setGradientDirection] = useState(135);

    const canvasRef = useRef();
    const pickerRef = useRef();

    // Preset solid colors
    const presetColors = [
        '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
        '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
        '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
        '#ec4899', '#f43f5e', '#64748b', '#374151', '#111827',
        '#fca5a5', '#fed7aa', '#fde68a', '#fef3c7', '#d9f99d',
        '#bbf7d0', '#a7f3d0', '#99f6e4', '#a5f3fc', '#bae6fd',
        '#bfdbfe', '#c7d2fe', '#ddd6fe', '#e9d5ff', '#f3e8ff',
        '#fce7f3', '#fecdd3', '#f1f5f9', '#e2e8f0', '#cbd5e1'
    ];

    // Preset gradients
    const presetGradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
        'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
        'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
        'linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)',
        'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
        'linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)',
        'linear-gradient(135deg, #2d3436 0%, #636e72 100%)'
    ];

    // Popular color palettes
    const colorPalettes = {
        brand: {
            name: 'Brand Colors',
            icon: Star,
            colors: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554']
        },
        warm: {
            name: 'Warm',
            icon: Zap,
            colors: ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16']
        },
        cool: {
            name: 'Cool',
            icon: Sparkles,
            colors: ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6']
        },
        nature: {
            name: 'Nature',
            icon: Heart,
            colors: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d']
        }
    };

    useEffect(() => {
        if (canvasRef.current) {
            drawColorWheel();
        }
    }, []);

    const drawColorWheel = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Create color wheel
        for (let angle = 0; angle < 360; angle += 1) {
            const startAngle = (angle - 1) * Math.PI / 180;
            const endAngle = angle * Math.PI / 180;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 2;
            ctx.strokeStyle = `hsl(${angle}, 100%, 50%)`;
            ctx.stroke();
        }

        // Create brightness gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
    };

    const handleCanvasClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= Math.min(centerX, centerY) - 10) {
            const hue = Math.atan2(dy, dx) * 180 / Math.PI + 90;
            const saturation = Math.min(distance / (Math.min(centerX, centerY) - 10) * 100, 100);
            const lightness = 50;

            const color = hslToHex(hue, saturation, lightness);
            onChange(color);
        }
    };

    const hslToHex = (h, s, l) => {
        h = ((h % 360) + 360) % 360;
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const copyToClipboard = (color) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const generateRandomColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        onChange(randomColor);
    };

    const buildGradient = () => {
        const sortedStops = [...gradientStops].sort((a, b) => a.position - b.position);
        const stops = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
        return `linear-gradient(${gradientDirection}deg, ${stops})`;
    };

    const tabs = [
        { id: 'solid', label: 'Solid', icon: Palette },
        { id: 'gradients', label: 'Gradients', icon: Sparkles },
        { id: 'picker', label: 'Picker', icon: Pipette }
    ];

    const SolidColorTab = () => (
        <div className="space-y-6">
            {/* Current Color */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Current Color</label>
                <div className="flex items-center space-x-3">
                    <div
                        className="w-16 h-16 rounded-xl border-2 border-gray-300 shadow-inner"
                        style={{ backgroundColor: value }}
                    />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#010101] focus:border-transparent font-mono text-sm"
                            placeholder="#000000"
                        />
                        <div className="flex space-x-2 mt-2">
                            <button
                                onClick={() => copyToClipboard(value)}
                                className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                            >
                                {copiedColor === value ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                <span>{copiedColor === value ? 'Copied!' : 'Copy'}</span>
                            </button>
                            <button
                                onClick={generateRandomColor}
                                className="flex items-center space-x-1 px-3 py-1 bg-[#efefef] hover:bg-gray-200 text-[#010101] rounded-lg text-sm transition-colors"
                            >
                                <Shuffle className="w-4 h-4" />
                                <span>Random</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Color Palettes */}
            {showPresets && (
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Color Palettes</label>
                    {Object.entries(colorPalettes).map(([key, palette]) => {
                        const IconComponent = palette.icon;
                        return (
                            <div key={key} className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <IconComponent className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-600">{palette.name}</span>
                                </div>
                                <div className="flex space-x-2">
                                    {palette.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => onChange(color)}
                                            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${value === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                                                }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Preset Colors */}
            {showPresets && (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Preset Colors</label>
                    <div className="grid grid-cols-10 gap-2">
                        {presetColors.map((color, index) => (
                            <button
                                key={index}
                                onClick={() => onChange(color)}
                                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${value === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                                    }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const GradientsTab = () => (
        <div className="space-y-6">
            {/* Current Gradient */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Current Gradient</label>
                <div
                    className="w-full h-16 rounded-xl border-2 border-gray-300 shadow-inner"
                    style={{ background: buildGradient() }}
                />
                <div className="flex space-x-2">
                    <button
                        onClick={() => copyToClipboard(buildGradient())}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                    >
                        {copiedColor === buildGradient() ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedColor === buildGradient() ? 'Copied!' : 'Copy CSS'}</span>
                    </button>
                </div>
            </div>

            {/* Direction */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Direction: {gradientDirection}°</label>
                <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(Number(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Gradient Stops */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Color Stops</label>
                    <button
                        onClick={() => setGradientStops([...gradientStops, { color: '#000000', position: 50 }])}
                        className="flex items-center space-x-1 px-2 py-1 bg-[#010101] text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                    </button>
                </div>
                {gradientStops.map((stop, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <input
                            type="color"
                            value={stop.color}
                            onChange={(e) => {
                                const newStops = [...gradientStops];
                                newStops[index].color = e.target.value;
                                setGradientStops(newStops);
                            }}
                            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={stop.position}
                            onChange={(e) => {
                                const newStops = [...gradientStops];
                                newStops[index].position = Number(e.target.value);
                                setGradientStops(newStops);
                            }}
                            className="flex-1"
                        />
                        <span className="text-sm text-gray-500 w-12">{stop.position}%</span>
                        {gradientStops.length > 2 && (
                            <button
                                onClick={() => setGradientStops(gradientStops.filter((_, i) => i !== index))}
                                className="p-1 text-red-500 hover:bg-red-100 rounded"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Preset Gradients */}
            {showGradients && (
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Preset Gradients</label>
                    <div className="grid grid-cols-2 gap-3">
                        {presetGradients.map((gradient, index) => (
                            <button
                                key={index}
                                onClick={() => onChange(gradient)}
                                className="h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors shadow-inner"
                                style={{ background: gradient }}
                                title="Click to use this gradient"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const PickerTab = () => (
        <div className="space-y-6">
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Color Wheel</label>
                <div className="flex justify-center">
                    <canvas
                        ref={canvasRef}
                        width={200}
                        height={200}
                        onClick={handleCanvasClick}
                        className="cursor-crosshair border border-gray-300 rounded-lg"
                    />
                </div>
                <p className="text-xs text-gray-500 text-center">
                    Click on the wheel to pick a color
                </p>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-200 rounded-lg">
                        <Palette className="w-5 h-5 text-[#010101]" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Color Picker</h3>
                        <p className="text-sm text-gray-600">Choose colors and gradients</p>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 py-3 border-b border-gray-100">
                <div className="flex space-x-1">
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                                        ? 'bg-[#010101] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <IconComponent className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'solid' && <SolidColorTab />}
                {activeTab === 'gradients' && <GradientsTab />}
                {activeTab === 'picker' && <PickerTab />}
            </div>
        </div>
    );
};

export default ColorPicker;