import axios from 'axios';
import { API_BASE_URL } from '../constants/routes';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and log details
axiosInstance.interceptors.request.use(
    async (config) => { // Make async to await AsyncStorage
        if (__DEV__) {
            console.log("---------------------");
            console.log("Axios Request - Method:", config.method?.toUpperCase());
            console.log("Axios Request - URL:", config.url);
            // Avoid dumping large payloads
            if (config.data && typeof config.data === 'object') {
                console.log("Axios Request - Data: [object]");
            } else {
                console.log("Axios Request - Data:", config.data);
            }
            // Only log header keys in dev
            console.log("Axios Request - Headers:", {
                ...(config.headers || {}),
            });
        }

        // Retrieve token from AsyncStorage
        // const token = await AsyncStorage.getItem('authToken'); // Placeholder for AsyncStorage
        const token = "YOUR_ASYNC_STORAGE_TOKEN_HERE"; // Replace with actual AsyncStorage logic
        if (token && token !== "YOUR_ASYNC_STORAGE_TOKEN_HERE") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error("Axios Request Error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
    (response) => {
        if (__DEV__) {
            console.log("---------------------");
            console.log("Axios Response - Status:", response.status);
            // Avoid huge dumps
            const preview = typeof response.data === 'string' ? response.data.slice(0, 300) : response.data;
            console.log("Axios Response - Data:", preview);
            // Only log minimal headers
            console.log("Axios Response - Headers:", {
                'content-type': response.headers?.['content-type'],
                'x-powered-by': response.headers?.['x-powered-by'],
            });
        }
        return response;
    },
    (error) => {
        if (__DEV__) {
            console.log("---------------------");
        }
        const status = error.response?.status;
        const url = error.config?.url as string | undefined;
        const isStudentProfilePath = (
            url === '/admin/dashboard/stats' ||
            url === '/api/admin/dashboard-stats-api' ||
            url?.startsWith('/api/admin/view-lecture-api') ||
            url?.startsWith('/api/admin/student-profile-ap') ||
            url?.startsWith('/api/admin/student-profile-api') ||
            url?.startsWith('/api/admin/student-profile') ||
            url?.startsWith('/api/student-profile')
        );

        // Suppress noisy logs for expected 404s and known backend 500 on student profile
        const isExpected404 = status === 404 && isStudentProfilePath;
        const isKnownStudent500 = status === 500 && isStudentProfilePath;

        if (!isExpected404 && !isKnownStudent500 && __DEV__) {
            console.error("Axios Response Error:", {
                message: error.message,
                response: error.response?.data,
                status: status,
                headers: error.response?.headers,
                config: error.config,
            });
        }

        if (error.response?.status === 401) {
            // Handle unauthorized access
            // AsyncStorage.removeItem('authToken'); // Placeholder for AsyncStorage
            console.log("Unauthorized access - potentially redirect to login");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
