// LivePreview.jsx
import {User, Link2, Link, EllipsisVertical, Eye} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import {iconOptions} from "@/components/profileEditor/Constants.js";
import React from "react";
import {NavLink} from "react-router-dom";

export default function LivePreview({profileImage, fullName, username, bio, links, getCurrentBackground, textColor}) {



    return (
        <div className="w-full lg:w-2/5 xl:w-1/3 min-h-screen flex justify-center p-4">
            <div className="relative w-full max-w-sm">

                {/* View Profile Button */}
                <div className="mx-auto flex justify-center mb-3">
                    <NavLink to={`/${username.replace(/\s+/g, '').toLowerCase()}`} target="_blank" className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 backdrop-blur-md rounded-full text-sm font-medium hover:bg-blue-600 transition">
                        <Eye size={16} color="#ffffff" />
                        <span className="text-white">Profili Görüntüle</span>
                    </NavLink>
                </div>


                {/* Phone Mockup */}
                <div
                    className="relative min-h-[600px] max-h-[650px] overflow-y-auto [&::-webkit-scrollbar]:w-2 sticky top-5 rounded-[45px] shadow-custom border-8 border-slate-500 flex flex-col items-center px-6 py-10 transition-all duration-300 ease-out"
                    style={{ background: getCurrentBackground(), color: textColor }}
                >
                    {/* Status Bar Simulation */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-400 rounded-full opacity-50"></div>


                    {/* Top Right Icons */}
                    <div className="absolute top-8 right-8">
                        <div className="">
                            <EllipsisVertical size={20} strokeWidth={2} />
                        </div>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center mt-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white mb-4">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>

                        <h2 className="text-lg font-bold mb-1">
                            {fullName || "Adınız Soyadınız"}
                        </h2>

                        <p className="text-sm opacity-80 mb-6 px-2 leading-relaxed">
                            {bio || "Kısa bir biyografi yazın..."}
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="w-full space-y-3 mt-2">
                        {links.filter(link => link.label || link.url).map((link, index) => (
                            <div
                                key={link.id}
                                style={{ backgroundColor: link.color }}
                                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                    style={{
                                        backgroundColor: link.iconBg,
                                        color: link.iconColor
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={iconOptions.find(x => x.name === link.icon)?.icon || faLink}
                                        className="w-5 h-5"
                                        style={{ color: link.iconColor }}
                                    />
                                </div>
                                <span className="flex-1 truncate text-left">
                                    {link.label || "Bağlantı Başlığı"}
                                </span>
                            </div>
                        ))}

                        {(!links.some(link => link.label || link.url)) && (
                            <div className="text-center py-12 opacity-60">
                                <Link2 className="mx-auto mb-3" size={32} />
                                <p className="text-sm">Bağlantılarınız burada görünecek</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-10">
                        <button className="text-sm font-semibold px-4 py-2 bg-white text-black rounded-md">@{username} ile Shortier'e katılın!</button>
                    </div>

                    {username && (
                        <div className="mt-auto mb-4 pt-4 text-xs opacity-50 text-center">
                            @{username.replace(/\s+/g, '').toLowerCase()}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}