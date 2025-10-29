import React, { useState } from 'react';
import {
    Layout,
    Maximize2,
    Minimize2,
    AlignCenter,
    AlignLeft,
    AlignRight,
    Square,
    Circle,
    Hexagon,
    Move,
    Grid,
    Layers,
    RotateCcw
} from 'lucide-react';

const LayoutPanel = ({
                         layoutSettings = {
                             maxWidth: 400,
                             linkSpacing: 16,
                             padding: 20,
                             borderRadius: 12,
                             cardStyle: 'rounded',
                             alignment: 'center',
                             linkHeight: 56,
                             containerSpacing: 24,
                             profileSpacing: 32
                         },
                         onLayoutChange = () => {}
                     }) => {
    const [activeTab, setActiveTab] = useState('spacing');

    const updateSetting = (key, value) => {
        onLayoutChange({
            ...layoutSettings,
            [key]: value
        });
    };

    const resetToDefault = () => {
        onLayoutChange({
            maxWidth: 400,
            linkSpacing: 16,
            padding: 20,
            borderRadius: 12,
            cardStyle: 'rounded',
            alignment: 'center',
            linkHeight: 56,
            containerSpacing: 24,
            profileSpacing: 32
        });
    };

    const tabs = [
        { id: 'spacing', label: 'Spacing', icon: Move },
        { id: 'layout', label: 'Layout', icon: Layout },
        { id: 'cards', label: 'Cards', icon: Square }
    ];

    const cardStyles = [
        {
            id: 'rounded',
            label: 'Rounded',
            icon: Square,
            preview: 'rounded-xl border-2 border-gray-300'
        },
        {
            id: 'circular',
            label: 'Circular',
            icon: Circle,
            preview: 'rounded-full border-2 border-gray-300'
        },
        {
            id: 'sharp',
            label: 'Sharp',
            icon: Square,
            preview: 'border-2 border-gray-300'
        },
        {
            id: 'hexagon',
            label: 'Hexagon',
            icon: Hexagon,
            preview: 'rounded-xl border-2 border-gray-300 transform rotate-45'
        }
    ];

    const alignmentOptions = [
        { id: 'left', label: 'Left', icon: AlignLeft },
        { id: 'center', label: 'Center', icon: AlignCenter },
        { id: 'right', label: 'Right', icon: AlignRight }
    ];

    const RangeControl = ({ label, value, min, max, step = 1, suffix = 'px', onChange }) => (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {value}{suffix}
        </span>
            </div>
            <div className="relative">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div
                    className="absolute top-1 h-0 w-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-blue-500"
                    style={{
                        left: `${((value - min) / (max - min)) * 100}%`,
                        transform: 'translateX(-50%)'
                    }}
                />
            </div>
        </div>
    );

    const SpacingTab = () => (
        <div className="space-y-6">
            <RangeControl
                label="Link Spacing"
                value={layoutSettings.linkSpacing}
                min={8}
                max={48}
                onChange={(value) => updateSetting('linkSpacing', value)}
            />

            <RangeControl
                label="Container Padding"
                value={layoutSettings.padding}
                min={12}
                max={60}
                onChange={(value) => updateSetting('padding', value)}
            />

            <RangeControl
                label="Profile Spacing"
                value={layoutSettings.profileSpacing}
                min={16}
                max={80}
                onChange={(value) => updateSetting('profileSpacing', value)}
            />

            <RangeControl
                label="Section Spacing"
                value={layoutSettings.containerSpacing}
                min={12}
                max={60}
                onChange={(value) => updateSetting('containerSpacing', value)}
            />

            <RangeControl
                label="Link Height"
                value={layoutSettings.linkHeight}
                min={40}
                max={80}
                onChange={(value) => updateSetting('linkHeight', value)}
            />
        </div>
    );

    const LayoutTab = () => (
        <div className="space-y-6">
            <RangeControl
                label="Max Width"
                value={layoutSettings.maxWidth}
                min={300}
                max={600}
                onChange={(value) => updateSetting('maxWidth', value)}
            />

            <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Content Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {alignmentOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <button
                                key={option.id}
                                onClick={() => updateSetting('alignment', option.id)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                    layoutSettings.alignment === option.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                            >
                                <IconComponent className="w-5 h-5 mx-auto mb-1" />
                                <span className="text-xs font-medium">{option.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const CardsTab = () => (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Card Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {cardStyles.map((style) => {
                        const IconComponent = style.icon;
                        return (
                            <button
                                key={style.id}
                                onClick={() => updateSetting('cardStyle', style.id)}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                    layoutSettings.cardStyle === style.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className={`w-8 h-5 mx-auto mb-2 ${style.preview}`} />
                                <span className="text-xs font-medium text-gray-700">{style.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <RangeControl
                label="Border Radius"
                value={layoutSettings.borderRadius}
                min={0}
                max={32}
                onChange={(value) => updateSetting('borderRadius', value)}
            />

            <div className="pt-2">
                <div className="text-sm font-medium text-gray-700 mb-3">Preview</div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div
                        className="bg-white shadow-sm border mx-auto"
                        style={{
                            width: '100%',
                            height: layoutSettings.linkHeight + 'px',
                            borderRadius: layoutSettings.borderRadius + 'px',
                            maxWidth: '200px'
                        }}
                    >
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Sample Link
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Layout className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Layout Settings</h3>
                            <p className="text-sm text-gray-600">Spacing, alignment and card styles</p>
                        </div>
                    </div>
                    <button
                        onClick={resetToDefault}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Reset to Default"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
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
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-600'
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
                {activeTab === 'spacing' && <SpacingTab />}
                {activeTab === 'layout' && <LayoutTab />}
                {activeTab === 'cards' && <CardsTab />}
            </div>

            {/* Quick Stats */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-lg font-bold text-gray-900">{layoutSettings.maxWidth}px</div>
                        <div className="text-xs text-gray-500">Max Width</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900">{layoutSettings.linkHeight}px</div>
                        <div className="text-xs text-gray-500">Link Height</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900">{layoutSettings.borderRadius}px</div>
                        <div className="text-xs text-gray-500">Radius</div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
        </div>
    );
};

export default LayoutPanel;