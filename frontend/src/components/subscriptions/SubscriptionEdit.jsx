import React, { useState } from "react";
import SubscriptionAdd from "./SubscriptionAdd";
import SubscriptionFreeze from "./SubscriptionFreeze";
import { get_subscription_data } from "./utils";
import SubscriptionEditForm from "./SubscriptionEditForm";
import { usePermission } from "../../providers/PermissionProvider";

const SubscriptionEdit = () => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("subscriptions", "subscription");
    if (!permissions.change && !permissions.view) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }
    //////////////////////////////// list data ////////////////////////////////
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);

    return (
        <>
            {/* search form */}
            <SubscriptionEditForm
                setFetchError={setFetchError}
                setData={setData}
            />

            {/* table data */}
            {(data || fetchError) && (
                <>
                    {fetchError ? (
                        <div
                            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                        >
                            <h1 className="font-bold text-text text-lg">خطأ</h1>
                            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                            <p className="text-lg text-center text-red-600 py-4">
                                خطأ في تحميل البيانات
                            </p>
                        </div>
                    ) : data.count == 0 ? (
                        <div
                            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                        >
                            <h1 className="font-bold text-text text-lg">
                                كود اشتراك غير موجود
                            </h1>
                            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                            <p className="text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                لا توجد بيانات
                            </p>
                        </div>
                    ) : (
                        <>
                            <SubscriptionAdd
                                defaultValues={data?.results[0]}
                                postURL={data?.results[0]?.url}
                                callBack={() => {
                                    get_subscription_data(
                                        data?.results[0].id,
                                        setData,
                                        setFetchError
                                    );
                                }}
                            />

                            {/* freeze options */}
                            {!data?.results[0]?.is_expired && (
                                <SubscriptionFreeze
                                    sub={data?.results[0]}
                                    callBack={() => {
                                        get_subscription_data(
                                            data?.results[0].id,
                                            setData,
                                            setFetchError
                                        );
                                    }}
                                />
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default SubscriptionEdit;
