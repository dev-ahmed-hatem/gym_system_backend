import axios from "axios";
import endpoints from "./config";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        // add access token to all requests done by axios
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // check if the token expired and perform refresh
        if (
            false /* error.response.status == 401 && !originalRequest._retry */
        ) {
            // ensure that the refresh has not been used before
            originalRequest._retry = true;
            const refresh_token = localStorage.getItem("refresh_token");

            // refresh the token
            try {
                const response = await axiosInstance.post(
                    endpoints.token_refresh,
                    { refresh: refresh_token }
                );
                // set the new access token
                localStorage.setItem("access_token", response.data.access);
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${response.data.access}`;

                return axiosInstance(originalRequest);
            } catch (response_error) {
                console.log("Session expired");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                const next = encodeURI(location.pathname);
                window.location.href = `/login?next=${next}`;
            }
        }
        return Promise.reject(error);
    }
);

export const verifyToken = async (token) => {
    try {
        const resonse = await axios.post(endpoints.token_verify, {
            token: token,
        });
        return true;
    } catch (error) {
        return false;
    }
};

export default axiosInstance;
