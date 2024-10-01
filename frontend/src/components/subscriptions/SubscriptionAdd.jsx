import React from "react";
import endpoints from "../../config/config";
import SubscriptionAddForm from "./SubscriptionAddForm";
import { usePermission } from "../../providers/PermissionProvider";

const SubscriptionAdd = ({ defaultValues, postURL, callBack, deleteCallBack }) => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("subscriptions", "subscription");
    if (!permissions.add & !permissions.change) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }
    
    return (
        <>
            {/* display subscription info in case of expired */}
            {defaultValues?.is_expired ? (
                <div
                    className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                >
                    <h1 className="font-bold text-lg text-secondary">
                        اشتراك منتهى
                    </h1>
                    <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                    <div className="totals mt-2 ">
                        <h1 className="font-bold text-xl mb-4 lg:mb-8">
                            التفاصيل :
                        </h1>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                الاشتراك :{""}
                            </span>
                            <span className="text-primary font-bold">
                                {defaultValues.plan?.name || "لا يوجد"}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                العميل :
                            </span>
                            <span className="text-primary font-bold">
                                {defaultValues.client_name || "لا يوجد"}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                المدرب :
                            </span>
                            <span className="text-primary font-bold">
                                {defaultValues.trainer?.name || "لا يوجد"}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                اشتراك بواسطة :
                            </span>
                            <span className="text-primary font-bold">
                                {defaultValues.referrer?.name || "لا يوجد"}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                تاريخ البدأ :
                            </span>
                            <span className="text-primary font-bold">
                                {defaultValues.start_date || "لا يوجد"}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                المدة :
                            </span>
                            <span className="text-primary font-bold">
                                {defaultValues.plan.is_duration
                                    ? `${defaultValues.plan.days} (يوم)`
                                    : `${defaultValues.plan.classes_no} (حصة)`}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                الصافى :
                            </span>
                            <span className="text-primary font-bold">
                                {defaultValues?.total_price}
                            </span>
                        </p>
                    </div>
                </div>
            ) : (
                // add form 
                <SubscriptionAddForm
                    postURL={postURL ? postURL : endpoints.subscription_list}
                    defaultValues={defaultValues}
                    callBack={callBack}
                    deleteCallBack={deleteCallBack}
                />
            )}
        </>
    );
};

export default SubscriptionAdd;
