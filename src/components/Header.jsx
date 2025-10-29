import React from "react";
import HeaderDropdown from "@/components/HeaderDropdown.jsx";
import HamburgerButton from "@/components/HamburgerButton.jsx";

export default function Header({ title = "Başlık", onOpenSidebar  }) {
    return (
        <header className=" z-50 ">
            <div className="rounded-lg px-6 py-4 mx-auto
                      bg-white  shadow-custom">
                <div className="flex items-center justify-between">
                    {/* Title */}
                    <div>
                        <h3 className="text-2xl font-bold ">{title}</h3>
                    </div>


                    <div className="flex items-center space-x-4">
                        <HeaderDropdown/>
                        <HamburgerButton onClick={onOpenSidebar}/>
                    </div>
                </div>
            </div>
        </header>
    );
}
