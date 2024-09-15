import axios from "axios";
import endpoints from "./config";

const axiosInstance = axios.create();

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
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        // console.log(error);

        // check if the token expired and perform refresh
        if (error.response.status == 401 && !originalRequest._retry) {
            // ensure that the refresh has not been used before
            originalRequest._retry = true;
            console.log(originalRequest);

            const refresh_token = localStorage.getItem("refresh_token");
            if (refresh_token) {
                // refresh the token
                try {
                    const response = await axios.post(endpoints.token_refresh, {
                        refresh: refresh_token,
                    });
                    // set the new access token
                    localStorage.setItem("access_token", response.data.access);
                    axiosInstance.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${response.data.access}`;

                    return axiosInstance(originalRequest);
                } catch (response_error) {
                    if (
                        response_error.response &&
                        response_error.response.status === 401
                    ) {
                        console.log("Session expired");
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        const next = encodeURI(location.pathname);
                        window.location.href = `/login?next=${next}`;
                    } else {
                        console.error(
                            "Error refreshing token:",
                            response_error
                        );
                    }
                    return Promise.reject(response_error);
                }
            } else {
                window.location.href = `/login`;
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
