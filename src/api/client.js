import axios from 'axios';

import { config } from "@/config";

const apiClient = axios.create({ baseURL: config.API_BASE_URL });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // veya başka yerde saklıysa
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const profileId = localStorage.getItem("activeProfileId");
    if (profileId) config.headers['X-Profile-Id'] = profileId;

    return config;
});

export default apiClient;