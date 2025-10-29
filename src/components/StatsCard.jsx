import React from "react";

export default function StatsCard({
                                      loading = false,
                                      iconBg,
                                      icon: Icon,
                                      delta,
                                      value,
                                      label,
                                  }) {
    return (
        <div className="rounded-xl p-6 transition bg-white backdrop-blur-xl shadow-custom hover:bg-white/40">
            {loading ? (
                // LOADING STATE (animasyon)
                <div className="flex items-center justify-center h-24">
                    <svg
                        className="animate-spin h-8 w-8 text-blue-500"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                </div>
            ) : (
                // DATA STATE
                <>
                    <div className="flex items-center justify-between mb-4">
                        <div
                            className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}
                        >
                            <Icon className="w-6 h-6 text-white" />
                        </div>
                        {delta && (
                            <span className="text-sm font-semibold text-green-500">
                                {delta}
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold text-black">{value}</h3>
                    <p className="text-blue-600 text-sm">{label}</p>
                </>
            )}
        </div>
    );
}
