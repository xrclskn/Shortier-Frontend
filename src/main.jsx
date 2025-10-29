import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import {AuthProvider} from "@/context/AuthContext.jsx";
import {ProfileProvider} from "@/context/ProfileContext.jsx";
// import {LinksProvider} from "@/context/LinksContext.jsx";
import {UserProvider} from "@/context/UserContext.jsx";
import {ProfileSaveProvider} from "@/context/ProfileSaveContext.jsx";
import {StatisticsProvider} from "@/context/StatisticsContext.jsx";
import {AccountProvider} from "@/context/AccountContext.jsx";
import {SubscriptionProvider} from "@/context/SubscriptionContext.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <StrictMode>
            <BrowserRouter>
                <UserProvider>
                    <SubscriptionProvider>
                        <ProfileSaveProvider>
                            <StatisticsProvider>
                                <ProfileProvider>
                                    <AccountProvider>
                                        <App/>
                                    </AccountProvider>
                                </ProfileProvider>
                            </StatisticsProvider>
                        </ProfileSaveProvider>
                    </SubscriptionProvider>
                </UserProvider>
            </BrowserRouter>
        </StrictMode>
    </AuthProvider>
);
