import axios from "./axiosconfig";
import endpoints from "./config";

export const fetchUserData = async () => {
    try {
        const response = await axios.get(endpoints.authenticated_user);
        return response.data;
    } catch (error) {
        return {};
    }
};
