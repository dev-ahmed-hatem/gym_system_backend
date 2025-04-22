import React, { useState, useEffect } from "react";
import endpoints from "../../../config/config";
import Loading from "../../groups/Loading";
import BirthdayCard from "./BirthdayCard";
// import { usePermission } from "../../../providers/PermissionProvider";
import { fetch_list_data } from "../../../config/actions";

const Birthdays = () => {
    //////////////////////////////// permissions ////////////////////////////////
    // const { set_page_permissions } = usePermission();
    // const permissions = set_page_permissions("reports", "report");
    // if (!permissions.view) {
    //     return (
    //         <p className="text-lg text-center text-red-600 py-4">
    //             ليس لديك صلاحيات هنا
    //         </p>
    //     );
    // }

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const get_current_birthdays = () => {
        setLoading(true);

        fetch_list_data({
            searchURL: endpoints.birthdays,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        // if (permissions.view) {
            get_current_birthdays();
        // }
    }, []);

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">
                أعياد ميلاد اليوم {new Date().toLocaleDateString("ar-EG")}
            </h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            {loading ? (
                <Loading />
            ) : fetchError ? (
                <p className="w-full text-lg text-center text-red-600 py-4">
                    خطأ في تحميل البيانات
                </p>
            ) : (
                <>
                    <div className="subscriptions flex gap-x-10 gap-y-6 flex-wrap">
                        {data.length == 0 ? (
                            <p className="w-full text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                لا يوجد أعياد ميلاد اليوم
                            </p>
                        ) : (
                            <>
                                {data?.map((client) => (
                                    <BirthdayCard
                                        key={client.id}
                                        client={client}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                    {data.length > 0 && (
                        <div className="flex justify-center text-lg mt-5">
                            العدد : {data.length}{" "}
                            {data?.length > 10 || data?.length < 2
                                ? "عضو"
                                : "أعضاء"}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Birthdays;
