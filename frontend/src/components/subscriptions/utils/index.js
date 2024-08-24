import endpoints from "../../../config/config";
import { fetch_list_data } from "../../../config/actions";

export const get_subscription_data = (
    code,
    setData,
    setFetchError,
    setPost
) => {
    setData(null);
    if (setPost) {
        setPost(true);
    }
    const url = `${endpoints.subscription_list}code=${code}`;

    fetch_list_data({
        searchURL: url,
        setData: setData,
        setFetchError: setFetchError,
        setLoading: (bool) => {
            if (setPost) setPost(bool);
        },
    });
};
