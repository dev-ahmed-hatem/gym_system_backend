import { fetch_list_data } from "../../../../config/actions";
import endpoints from "../../../../config/config";

export const get_advance_data = (code, setData, setFetchError, setPost) => {
    setData(null);
    if (setPost) {
        setPost(true);
    }
    const url = `${endpoints.advance_list}code=${code}`;

    fetch_list_data({
        searchURL: url,
        setData: setData,
        setFetchError: setFetchError,
        setLoading: (bool) => {
            if (setPost) setPost(bool);
        },
    });
};
