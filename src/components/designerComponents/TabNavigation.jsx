import React from "react";
import { Palette, Link2, Settings, CaseSensitive, Wallpaper } from "lucide-react";

// Tek tek tab butonunu çizen küçük alt component
function TabButton({
                       tab,
                       isActive,
                       locked,
                       isMobile,
                       onSelect,
                   }) {
    const Icon = tab.icon;

    if (isMobile) {
        // Mobile görünüm
        return (
            <button
                key={tab.id}
                onClick={() => {
                    if (!locked) onSelect(tab.id);
                }}
                disabled={locked}
                className={`
                    flex flex-col items-center justify-center min-w-[90px] py-2 rounded-lg transition-all duration-200
                    ${isActive
                    ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600"
                }
                    ${locked ? "opacity-40 cursor-not-allowed" : ""}
                `}
            >
                <Icon size={20} className="mb-1" />
                <span className="text-xs font-medium flex items-center gap-1">
                    {tab.label}
                    {tab.proOnly && (
                        <span
                            className={`text-[10px] leading-none font-semibold rounded px-1 py-0.5 border
                                ${
                                locked
                                    ? "text-violet-700 bg-violet-50 border-violet-200"
                                    : "text-emerald-700 bg-emerald-50 border-emerald-200"
                            }
                            `}
                        >
                            Pro
                        </span>
                    )}
                </span>
            </button>
        );
    }

    // Desktop görünüm
    return (
        <button
            key={tab.id}
            onClick={() => {
                if (!locked) onSelect(tab.id);
            }}
            disabled={locked}
            className={`
                group relative flex items-center space-x-3 px-6 py-2 rounded-lg font-medium transition-all duration-200
                ${
                isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }
                ${locked ? "opacity-40 cursor-not-allowed hover:text-gray-600" : ""}
            `}
        >
            <Icon
                size={20}
                className={`
                    transition-transform duration-200
                    ${
                    isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                }
                `}
            />

            <div className="text-left">
                <div className="font-semibold text-blue-600 flex items-center gap-1">
                    {tab.label}

                    {tab.proOnly && (
                        <span
                            className={`text-[10px] leading-none font-semibold rounded px-1.5 py-0.5 border
                                ${
                                locked
                                    ? "text-violet-700 bg-violet-50 border-violet-200"
                                    : "text-emerald-700 bg-emerald-50 border-emerald-200"
                            }
                            `}
                        >
                            Pro
                        </span>
                    )}
                </div>

                <div
                    className={`
                        text-xs transition-opacity duration-200
                        ${
                        isActive
                            ? "text-blue-600 opacity-100"
                            : "text-gray-500 opacity-0 group-hover:opacity-100"
                    }
                    `}
                >
                    {tab.description}
                </div>
            </div>
        </button>
    );
}

export default function TabNavigation({
                                          activeTab = "design",
                                          onTabChange,
                                          isPro = false,
                                          loadingSubscription = false,
                                          tabs = [
                                              {
                                                  id: "design",
                                                  label: "Temalar",
                                                  icon: Palette,
                                                  description: "Tema ve görünüm ayarları",
                                                  proOnly: true,
                                              },
                                              {
                                                  id: "background",
                                                  label: "Arkaplan",
                                                  icon: Wallpaper,
                                                  description: "Arkaplan ayarları",
                                                  proOnly: true,
                                              },
                                              {
                                                  id: "typography",
                                                  label: "Yazı Tipi",
                                                  icon: CaseSensitive,
                                                  description: "Yazı tipi ayarları",
                                                  proOnly: true,
                                              },
                                              {
                                                  id: "links",
                                                  label: "Linkler",
                                                  icon: Link2,
                                                  description: "Link ekleme ve düzenleme",
                                                  proOnly: false,
                                              },
                                              {
                                                  id: "social",
                                                  label: "İletişim",
                                                  icon: Link2,
                                                  description: "Sosyal / iletişim linkleri",
                                                  proOnly: false,
                                              },
                                              {
                                                  id: "settings",
                                                  label: "Ayarlar",
                                                  icon: Settings,
                                                  description: "Profil ve genel ayarlar",
                                                  proOnly: false,
                                              },
                                          ],
                                      }) {
    // hem mobile hem desktop için aynı hesaplamayı yapacağız
    // locked: tab.proOnly && !isPro, ama sub bilgisi hâlâ loading ise hiçbir şeyi kilitlemiyoruz
    // (loadingSubscription true iken yanlış kilit efekti göstermeyelim)
    const getLocked = (tab) =>
        !loadingSubscription && tab.proOnly && !isPro;

    return (
        <div className="bg-white border-gray-200 sticky rounded-b-xl top-16 z-40 shadow-custom">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">

                {/* Desktop */}
                <nav className="hidden md:flex space-x-1 py-2" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.id}
                            tab={tab}
                            isActive={activeTab === tab.id}
                            locked={getLocked(tab)}
                            isMobile={false}
                            onSelect={onTabChange}
                        />
                    ))}
                </nav>

                {/* Mobile */}
                <nav className="md:hidden py-3" aria-label="Mobile Tabs">
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                tab={tab}
                                isActive={activeTab === tab.id}
                                locked={getLocked(tab)}
                                isMobile={true}
                                onSelect={onTabChange}
                            />
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
}
