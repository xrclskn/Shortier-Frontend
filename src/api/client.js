import axios from 'axios';

const apiClient = axios.create({ baseURL: "http://shortierv2.local/api" });

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // veya başka yerde saklıysa
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default apiClient;