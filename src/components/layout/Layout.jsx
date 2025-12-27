import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "@/components/layout/Footer.jsx";
import React, { useState } from "react";
import MobileSidebar from "@/components/layout/MobileSidebar.jsx";
import { ToastContainer } from "react-toastify";
import { LinksProvider } from "@/context/LinksContext.jsx";

export default function Layout() {
    const { pathname } = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const titleMap = {
        "/app": "Anasayfa",
        "/app/dashboard": "Anasayfa",
        "/app/profile": "Profil",
        "/app/short-urls": "Linkler",
        "/app/themes": "Temalar",
        "/app/analytics": "İstatistikler",
        "/app/account": "Hesap Ayarları",
        '/app/subscription': "Abonelik",
        '/app/biography': "Biyografi Tasarla",
        '/app/qr-codes': "QR Kodlarım",
    };

    const headerTitle = titleMap[pathname] || "";

    return (
        <LinksProvider>
            <div className="min-h-screen flex flex-col bg-[#eeefe6]">

                <ToastContainer position="bottom-right" autoClose={2000} />

                <div className="flex-1 w-full  mx-auto px-2 sm:px-4 md:px-6 py-2 md:py-6  flex">
                    {/* Sidebar */}
                    <aside className="hidden md:block md:w-64 lg:w-72 xl:w-80 mr-4">
                        <Sidebar />
                    </aside>

                    <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />


                    {/* İçerik */}
                    <main className="flex-1 min-w-0 space-y-4">
                        <Header title={headerTitle} onOpenSidebar={() => setSidebarOpen(true)} />

                        <Outlet />
                    </main>
                </div>

                <Footer />
            </div>
        </LinksProvider>
    );
}
