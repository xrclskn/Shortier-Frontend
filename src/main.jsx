import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import {AuthProvider} from "@/context/AuthContext.jsx";
import {ProfileSaveProvider} from "@/context/ProfileSaveContext.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <StrictMode>
            <BrowserRouter>
                    <ProfileSaveProvider>
                        <QueryClientProvider client={queryClient}>
                            <App/>
                        </QueryClientProvider>
                    </ProfileSaveProvider>
            </BrowserRouter>
        </StrictMode>
    </AuthProvider>
);
