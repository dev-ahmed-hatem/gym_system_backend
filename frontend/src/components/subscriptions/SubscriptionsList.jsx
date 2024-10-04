import React, { useState, useEffect } from "react";
import endpoints from "../../config/config";
import Loading from "../groups/Loading";
import TablePagination from "../groups/TablePagination";
import SubscriptionCard from "./SubscriptionCard";
import { usePermission } from "../../providers/PermissionProvider";
import { fetch_list_data } from "../../config/actions";

const SubscriptionsList = ({ category }) => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("subscriptions", "subscription");
    if (!permissions.view) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }

    let arabicCategory;
    switch (category) {
        case "active":
            arabicCategory = "الحالية";
            break;
        case "frozen":
            arabicCategory = "المعلقة";
            break;
        case "expired":
            arabicCategory = "المنتهية";
            break;
    }

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const get_current_subscriptions = () => {
        setLoading(true);
        const searchURL = `${endpoints.subscription_base}${category}/?${
            pageNumber ? `&page=${pageNumber}` : ""
        }
        `;

        fetch_list_data({
            searchURL: searchURL,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        if (permissions.view) {
            get_current_subscriptions();
        }
    }, [pageNumber, category]);

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">
                الاشتراكات {arabicCategory} - يوم{" "}
                {new Date().toLocaleDateString("ar-EG")}
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
                        {data.count == 0 ? (
                            <p className="w-full text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                لا توجد بيانات
                            </p>
                        ) : (
                            <>
                                {data?.results?.map((sub) => (
                                    <SubscriptionCard
                                        key={sub.id}
                                        sub={sub}
                                        callBack={() => {
                                            get_current_subscriptions();
                                        }}
                                        deleteCallBack={() => {
                                            get_current_subscriptions();
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                    {data.total_pages > 1 && (
                        <TablePagination
                            totalPages={data.total_pages}
                            currentPage={data.current_page}
                            onPageChange={(page) => {
                                setPageNumber(page);
                            }}
                        />
                    )}
                    <div className="flex justify-center text-lg mt-5">
                        العدد : {data.count}{" "}
                        {data?.count > 10 ? "اشتراك" : "اشتراكات"}
                    </div>
                </>
            )}
        </div>
    );
};

export default SubscriptionsList;
