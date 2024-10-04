import React from "react";
import { usePermission } from "../../providers/PermissionProvider";
import SubscriptionAdd from "./SubscriptionAdd";
import SubscriptionFreeze from "./SubscriptionFreeze";
import { FaTools } from "react-icons/fa";
import { useDrawer } from "../../providers/DrawerProvider";

const SubscriptionCard = ({ sub, callBack, deleteCallBack }) => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("subscriptions", "subscription");

    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();

    const handleClick = () => {
        if (permissions.change || permissions.delete) {
            showDrawer(
                "تعديل اشتراك",
                FaTools,
                <>
                    <SubscriptionAdd
                        defaultValues={sub}
                        postURL={sub?.url}
                        callBack={() => {
                            if (callBack) callBack();
                            closeDrawer();
                        }}
                        deleteCallBack={() => {
                            if (deleteCallBack) deleteCallBack();
                        }}
                    />

                    {/* freeze options */}
                    {permissions.change && !sub?.is_expired && (
                        <SubscriptionFreeze
                            sub={sub}
                            callBack={() => {
                                if (callBack) callBack();
                                closeDrawer();
                            }}
                        />
                    )}
                </>
            );
        }
    };

    return (
        <div
            className={`border-2 flex flex-col gap-y-3 border-primary rounded-lg w-full lg:max-w-lg lg:min-w-96 p-4 relative ${
                (permissions.change || permissions.delete) &&
                "hover:shadow-xl cursor-pointer"
            }`}
            onClick={handleClick}
        >
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
