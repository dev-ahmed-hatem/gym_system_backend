import React from "react";

const SubscriptionCard = ({ sub }) => {
    return (
        <div className="border-2 flex flex-col gap-y-6 border-primary rounded-lg w-full lg:max-w-lg lg:min-w-96 p-4 relative">
            <p className="text-primary-900 font-bold">{sub?.plan?.name}</p>
            <p>
                كود الاشتراك:{" "}
                <span className="text-primary font-bold ms-2">{sub.id}</span>
            </p>
            <p>
                نوع الاشتراك:{" "}
                <span className="text-primary font-bold ms-2">
                    {sub?.plan?.sub_type}
                </span>
            </p>
            <p>
                تاريخ البداية:{" "}
                <span className="text-primary font-bold ms-2">
                    {sub?.start_date}
                </span>
            </p>
            <p>
                تاريخ النهاية:{" "}
                <span className="text-primary font-bold ms-2">
                    {sub?.end_date}
                </span>
            </p>
            <p className="state absolute top-5 left-8">
                {!sub?.is_expired ? (
                    <span className="bg-green-400 w-20 h-12 flex justify-center items-center rounded-lg text-white font-bold">
                        حالى
                    </span>
                ) : (
                    <span className="bg-secondary-500 w-20 h-12 flex justify-center items-center rounded-lg text-white font-bold">
                        منتهى
                    </span>
                )}
            </p>
        </div>
    );
};

export default SubscriptionCard;
