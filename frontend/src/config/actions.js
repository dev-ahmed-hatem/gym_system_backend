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

export const defaultFormSubmission = ({
    url,
    data,
    headers = {},
    formFunction,
    setPost,
    showToast,
    message,
    reset,
    callBack,
    setError,
}) => {
    const requestMethod = formFunction == "add" ? axios.post : axios.patch;
    setPost(true);
    requestMethod(url, data, { headers: headers })
        .then((response) => {
            showToast(message[formFunction]);
            reset();
            if (callBack) callBack();
        })
        .catch((error) => {
            console.log(error);
            if (error.response?.status == 400 && error.response?.data) {
                const serverErrors = error.response.data;
                for (let field in serverErrors) {
                    const message =
                        serverErrors[field][0].search("exists") == -1
                            ? "قيمة غير صالحة"
                            : "القيمة موجودة سابقا";
                    setError(field, {
                        type: "server",
                        message: message,
                    });
                }
            } else {
                showToast("خطأ فى تنفيذ العملية", true);
            }
        })
        .finally(() => {
            setPost(false);
        });
};

// fetch current entries of model
export const fetch_list_data = ({
    searchURL,
    setData,
    setFetchError,
    setLoading,
}) => {
    axios
        .get(searchURL)
        .then((response) => {
            setData(response.data);
        })
        .catch((fetchError) => {
            setFetchError(fetchError);
        })
        .finally(() => {
            setLoading(false);
        });
};
