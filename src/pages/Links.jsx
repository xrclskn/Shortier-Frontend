import LinkCard from "@/components/LinkCard";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useLinks } from "@/context/LinksContext.jsx";

export default function Links() {
    const { links, loading, getAllLinks } = useLinks();



    useEffect(() => {
        getAllLinks(); // Fetch all links on component mount
    }, []);

    return (
        <div className="rounded-lg p-6 bg-white shadow-custom">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-blue-600 mb-2">Link Yönetimi</h2>
                    <p className="text-blue-500">Biyografi sayfandaki linkleri düzenle ve yönet</p>
                </div>
            </div>

            <div className="space-y-2">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl p-6 bg-gray-200 animate-pulse flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-xl bg-gray-300"></div>
                                    <div>
                                        <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                            </div>
                        ))}
                    </div>
                ) : links && links.length > 0 ? (
                    links.map((link) => (
                        <LinkCard
                            key={link.id}
                            id={link.id}
                            iconBg={link.settings}
                            icon={link.icon}
                            color={link.settings}
                            title={link.label}
                            url={link.url}
                            clicks={link.clicks || 0}
                            growth={link.growth || "0%"}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">Henüz link eklenmemiş.</p>
                )}
            </div>
        </div>
    );
}