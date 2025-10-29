// IconPickerModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {iconOptions} from "@/components/profileEditor/Constants.js";

export default function IconPickerModal({ isOpen, onClose, onSelectIcon }) {
    const [iconFilter, setIconFilter] = useState("all");

    if (!isOpen) return null;

    const filteredIcons = iconFilter === "all"
        ? iconOptions
        : iconOptions.filter(icon => icon.category === iconFilter);

    return (
        <div className="fixed inset-0 bg-black/50  m-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">İkon Seçin</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 p-6 border-b border-gray-200">
                    {["all", "social", "tech", "general"].map(category => (
                        <button
                            key={category}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                iconFilter === category
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => setIconFilter(category)}
                        >
                            {category === "all" && "Tümü"}
                            {category === "social" && "Sosyal"}
                            {category === "tech" && "Teknoloji"}
                            {category === "general" && "Genel"}
                        </button>
                    ))}
                </div>

                {/* Icons Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {filteredIcons.map((icon, index) => (
                            <button
                                key={index}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                                onClick={() => onSelectIcon(icon.name)}
                                title={icon.label}
                            >
                                <FontAwesomeIcon icon={icon.icon} size="2x" />
                                <span className="text-xs text-gray-600 text-center leading-tight">
                                    {icon.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}