import React, { useState } from "react";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import endpoints from "../../config/config";
import axios from "axios";

const SubscriptionFreeze = ({ sub, setToast, callBack }) => {
    const [post, setPost] = useState(false);
    const [freezeError, setFreezeError] = useState(null);

    const switchSubscriptionState = () => {
        setPost(true);
        const action = sub?.is_frozen ? "unfreeze" : "freeze";
        const url = `${endpoints.subscription_base}${sub?.id}/${action}`;

        axios
            .get(url)
            .then((response) => {
                setToast(
                    `تم ${action === "freeze" ? "تعليق" : "استئناف"} الاشتراك`
                );
                if (callBack) callBack();
            })
            .catch((error) => {
                console.log(error.response.data.detail);
                setFreezeError(error.response.data.detail);
            })
            .finally(() => {
                setPost(false);
            });
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">تعليق الاشتراك</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <div
                className="fields gap-x-10 gap-y-6 flex-wrap"
            >
                {sub?.plan?.freezable ? (
                    <>
                        <div className="totals my-8 ">
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-44">
                                    حالة الاشتراك :{""}
                                </span>
                                <span className="text-primary font-bold">
                                    {sub?.is_frozen ? "معلق" : "مفعل"}
                                </span>
                            </p>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-44">
                                    الحد الأقصى للتعليق:
                                </span>
                                <span className="text-primary font-bold">
                                    {sub?.plan?.freeze_no}{" "}
                                    {sub?.plan?.freeze_no > 10 ? "يوم" : "أيام"}
                                </span>
                            </p>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-44">
                                    أيام التعليق :
                                </span>
                                <span className="text-primary font-bold">
                                    {sub?.freeze_days_used}{" "}
                                    {sub?.freeze_days_used > 10
                                        ? "يوم"
                                        : "أيام"}
                                </span>
                            </p>
                            {sub?.is_frozen && (
                                <p className="mt-2 ms-10">
                                    <span className="inline-block text-black font-bold pe-1 min-w-44">
                                        تاريخ بدأ التعليق :
                                    </span>
                                    <span className="text-primary font-bold">
                                        {sub?.freeze_start_date}
                                    </span>
                                </p>
                            )}
                        </div>

                        {freezeError && (
                            <p className="w-full text-lg text-center text-red-600 py-4">
                                {freezeError}
                            </p>
                        )}

                        <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                            <Button
                                onClick={switchSubscriptionState}
                                color={sub.is_frozen ? "primary" : "accent"}
                                disabled={post}
                                className="w-32 h-10 flex justify-center items-center"
                                size={"xl"}
                                isProcessing={post}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                {sub.is_frozen ? "استئناف" : "تعليق"}
                            </Button>
                        </div>
                    </>
                ) : (
                    <p className="w-full text-lg text-center text-red-600 py-4">
                        اشتراك غير قابل للتعليق
                    </p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionFreeze;
