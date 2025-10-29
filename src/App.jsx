import {Routes, Route, useLocation} from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Layout from "@/components/Layout.jsx";
import Links from "@/pages/Links.jsx";
import Profile from "@/pages/Profile.jsx";
import NotFound from "@/pages/NotFound.jsx";
import LinkStatistic from "@/pages/LinkStatistic.jsx";
import Bio from "@/pages/Bio.jsx";
import ProfileDesigner from "@/pages/ProfileDesigner.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Statistics from "@/pages/Statistics.jsx";
import { AnimatePresence, motion } from "framer-motion";
import Account from "@/pages/Account.jsx";
import Subscription from "@/pages/Subscription.jsx";

export default function App() {
    const location = useLocation();

    return (
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

                <Route path="/"
                       element={
                           <ProtectedRoute>
                               <motion.div
                                   initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                   animate={{ opacity: 1, y: 0, scale: 1 }}
                                   exit={{ opacity: 0, y: -20, scale: 0.98 }}
                                   transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                               >
                               <Layout/>
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
                    }/>

                    <Route path="subscription" element={
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Subscription />
                        </motion.div>
                    }/>

                    <Route path="links" element={
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Links />
                        </motion.div>
                    }/>

                   <Route path="/account" element={
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Account />
                        </motion.div>
                    }/>

                    <Route path="*" element={
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <NotFound />
                        </motion.div>
                    }/>
                </Route>

                <Route path="/profile-designer" element={
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ProtectedRoute><ProfileDesigner/></ProtectedRoute>
                    </motion.div>
                }/>
                <Route path="analytics" element={
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ProtectedRoute><Statistics/></ProtectedRoute>
                    </motion.div>
                }/>

                <Route path="*" element={
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <NotFound />
                    </motion.div>
                }/>
            </Routes>
        </AnimatePresence>
    );
}