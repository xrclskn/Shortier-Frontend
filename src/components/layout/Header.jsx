import React from "react";
import HeaderDropdown from "@/components/layout/HeaderDropdown.jsx";
import HamburgerButton from "@/components/layout/HamburgerButton.jsx";
import ProfileSwitcher from "@/components/layout/ProfileSwitcher.jsx";
import useSubscription from "@/hooks/useSubscription";
import { NavLink } from "react-router-dom";

export default function Header({ title = "Başlık", onOpenSidebar }) {
    const { info, loading } = useSubscription();
    // During loading, we assume false to prevent flicker (or handle separate loading state)
    // User requested "başta görünür olmasın", so we wait for loading to finish.
    const isFreePlan = !loading && info && !info.is_subscribed;

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
                        {isFreePlan && (
                            <NavLink
                                to="/app/subscription"
                                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#010101] text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-sm"
                            >
                                <span>🚀</span>
                                <span>Planı Yükselt</span>
                            </NavLink>
                        )}
                        <div className="hidden md:block w-64">
                            <ProfileSwitcher align="right" />
                        </div>
                        <HeaderDropdown />
                        <HamburgerButton onClick={onOpenSidebar} />
                    </div>
                </div>
            </div>
        </header>
    );
}
