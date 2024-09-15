import React from "react";

const SubscriptionCard = ({ sub }) => {
    return (
        <div className="border-2 flex flex-col gap-y-3 border-primary rounded-lg w-full lg:max-w-lg lg:min-w-96 p-4 relative">
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
                اسم العميل :{" "}
                <span className="text-primary font-bold ms-2">
                    {sub?.client_name}
                </span>
            </p>
            <p>
                كود العميل :{" "}
                <span className="text-primary font-bold ms-2">
                    {sub?.client_id}
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
            <p>
                أيام الحضور:{" "}
                <span className="text-primary font-bold ms-2">
                    {sub?.attendance_days}
                </span>
            </p>
            <p className="state absolute top-5 left-8">
                {sub?.is_expired ? (
                    <span className="bg-secondary-500 w-20 h-12 flex justify-center items-center rounded-lg text-white font-bold">
                        منتهى
                    </span>
                ) : sub?.is_frozen ? (
                    <span className="bg-accent-500 w-20 h-12 flex justify-center items-center rounded-lg text-white font-bold">
                        معلق
                    </span>
                ) : (
                    <span className="bg-green-400 w-20 h-12 flex justify-center items-center rounded-lg text-white font-bold">
                        حالى
                    </span>
                )}
            </p>
        </div>
    );
};

export default SubscriptionCard;
