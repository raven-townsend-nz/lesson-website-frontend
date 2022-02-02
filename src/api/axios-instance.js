/**
 * axios-instance.js
 *
 * File for handling axios API requests
 */
import axios from "axios";
import storage_util from "../common/storage_util";

//Server URL
const SERVER_URL = process.env.VUE_APP_SERVER_ADD;

const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    timeout: 60000
});

axiosInstance.interceptors.request.use(
    config => {
        const token = storage_util.getToken()
        if (token) {
            config.headers["X-Authorization"] = token;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Export instance to be used within API files
export default axiosInstance;
