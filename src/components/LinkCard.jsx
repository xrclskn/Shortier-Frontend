import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInstagram, faTwitter, faLinkedin, faGithub, faTiktok} from "@fortawesome/free-brands-svg-icons";
import {faEdit, faGlobe, faLink, faTrash} from "@fortawesome/free-solid-svg-icons";
import {buttonColors, iconOptions} from "@/components/profileEditor/Constants.js";
import {MousePointer, ChartLine} from "lucide-react";
import {NavLink} from "react-router-dom";
import {useLinks} from "@/context/LinksContext.jsx";
import {toast} from "react-toastify";

export default function LinkCard({id, iconBg, icon, color, title, url, clicks, growth}) {

    const linkData = {id, iconBg, icon, color, title, url, clicks, growth};

    const {deleteLink} = useLinks();
    const handleDelete = async () => {
        if (!window.confirm("Bu linki silmek istediğinize emin misiniz?")) return;
        const success = await deleteLink(linkData.id);
        if (success) {
            toast.success('Başarıyla Silindi')
        }
    };


    return (
        <div
            className="rounded-lg p-6 bg-gradient-to-br from-blue-500 to-indigo-700 border hover:bg-gradient-to-tr transition ">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="text-white/50 cursor-grab"><i className="fas fa-grip-vertical"/></div>

                    {/* iconbg rgb formatında geliyor ona göre kullanım olması gerek */}

                    <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${buttonColors.find(x => x.name === iconBg.iconBg)?.bg || 'bg-white'}`}>
                        <FontAwesomeIcon
                            fontSize={30}
                            icon={iconOptions.find(x => x.name === icon)?.icon || faLink}
                            className={`w-8 h-8`}
                        />
                    </div>

                    <div>
                        <h3 className="text-white font-semibold text-lg">{title}</h3>
                        <p className="text-white/60">{url}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-white flex items-center gap-2">
                                <MousePointer size={14}/> {clicks} tıklama
                            </span>
                            <span className="text-white flex items-center gap-2">
                                <ChartLine size={14}/> {growth} bu ay
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="w-14 h-8 rounded-full bg-white/20 relative">
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full"/>
                    </div>

                    {/* Bu alanda her bir link için id ile sorgu atıp edit sayfasına gitmemiz gerekiyor. */}

                    <NavLink to={`/link/statistic/${id}`}>
                        <button className="text-white/80 hover:text-white"><FontAwesomeIcon icon={faEdit}/></button>
                    </NavLink>

                    <button onClick={handleDelete} className="text-white/80 hover:text-white"><FontAwesomeIcon
                        icon={faTrash}/></button>


                </div>
            </div>
        </div>
    );
}