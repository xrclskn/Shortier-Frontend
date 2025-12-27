import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { AnimatePresence, motion } from "framer-motion";

// Lazy load components
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Layout = lazy(() => import("@/components/layout/Layout.jsx"));
const Links = lazy(() => import("@/pages/designer/Links.jsx"));
// const Profile = lazy(() => import("@/pages/public/Profile.jsx")); // Removed
const NotFound = lazy(() => import("@/pages/public/NotFound.jsx"));
// const LinkStatistic = lazy(() => import("@/pages/analytics/LinkStatistic.jsx")); // Removed
const Bio = lazy(() => import("@/pages/designer/Bio.jsx"));
const ProfileDesigner = lazy(() => import("@/pages/designer/ProfileDesigner.jsx"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard.jsx"));
const ShortUrl = lazy(() => import("@/pages/dashboard/ShortUrl.jsx"));
const QrCodePage = lazy(() => import("@/pages/dashboard/QrCodePage.jsx")); // Designer
const QrCodes = lazy(() => import("@/pages/dashboard/QrCodes.jsx")); // Listing
const Statistics = lazy(() => import("@/pages/analytics/Statistics.jsx"));
const LinkStats = lazy(() => import("@/pages/analytics/LinkStats.jsx"));
const Account = lazy(() => import("@/pages/account/Account.jsx"));
const Subscription = lazy(() => import("@/pages/account/Subscription.jsx"));
const EmailVerifyPage = lazy(() => import("@/pages/auth/EmailVerifyPage.jsx"));

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#eeefe6]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
);

export default function App() {
    const location = useLocation();

    return (
        <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>


                    <Route path="/:username" element={
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Bio />
                        </motion.div>
                    } />

                    <Route path="/login" element={
                        <Login />
                    } />
                    <Route path="/register" element={
                        <Register />
                    } />

                    <Route path="/app">
                        <Route element={
                            <ProtectedRoute>
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Layout />
                                </motion.div>
                            </ProtectedRoute>
                        }>
                            <Route index element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Dashboard />
                                </motion.div>
                            } />

                            <Route path="dashboard" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Dashboard />
                                </motion.div>
                            } />

                            <Route path="short-urls" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <ShortUrl />
                                </motion.div>
                            } />

                            <Route path="qr-designer" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <QrCodePage />
                                </motion.div>
                            } />

                            <Route path="qr-codes" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <QrCodes />
                                </motion.div>
                            } />


                            <Route path="subscription" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Subscription />
                                </motion.div>
                            } />

                            <Route path="links" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Links />
                                </motion.div>
                            } />

                            <Route path="account" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Account />
                                </motion.div>
                            } />

                            <Route path="*" element={
                                <motion.div
                                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <NotFound />
                                </motion.div>
                            } />
                        </Route>

                        <Route path="biography" element={
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProtectedRoute><ProfileDesigner /></ProtectedRoute>
                            </motion.div>
                        } />
                        <Route path="analytics" element={
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProtectedRoute><Statistics /></ProtectedRoute>
                            </motion.div>

                        } />
                        <Route path="analytics/:type/:id" element={
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProtectedRoute><LinkStats /></ProtectedRoute>
                            </motion.div>
                        } />
                    </Route>


                    <Route path="/api/email/verify/:id/:hash" element={<EmailVerifyPage />} />


                    <Route path="*" element={
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <NotFound />
                        </motion.div>
                    } />



                </Routes>
            </AnimatePresence>
        </Suspense>
    );
}