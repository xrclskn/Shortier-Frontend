import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/Footer.jsx";
import React, {useState} from "react";
import MobileSidebar from "@/components/MobileSidebar.jsx";
import {ToastContainer} from "react-toastify";

export default function Layout() {
    const { pathname } = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const titleMap = {
        "/": "Dashboard",
        "/profile": "Profil",
        "/links": "Linkler",
        "/themes": "Temalar",
        "/analytics": "İstatistikler",
        "/account": "Hesap Ayarları",
        '/subscription': "Abonelik",
    };

    const headerTitle = titleMap[pathname] || "";

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f5f7fa] to-[#e4e8f0]">

            <ToastContainer position="bottom-right" autoClose={2000} />

            <div className="flex-1 w-full  mx-auto px-2 sm:px-4 md:px-6 py-2 md:py-6  flex">
                {/* Sidebar */}
                <aside className="hidden md:block md:w-64 lg:w-72 xl:w-80 mr-4">
                    <Sidebar />
                </aside>

                <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}/>


                {/* İçerik */}
                <main className="flex-1 min-w-0 space-y-4">
                    <Header title={headerTitle} onOpenSidebar={() => setSidebarOpen(true)} />

                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
}
