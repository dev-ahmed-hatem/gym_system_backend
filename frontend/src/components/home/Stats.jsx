import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import Loading from "../groups/Loading";
import endpoints from "../../config/config";
import { usePermission } from "../../providers/PermissionProvider";
import { fetch_list_data } from "../../config/actions";
import { FaUserPlus, FaUsers } from "react-icons/fa";
import {
    MdOutlinePendingActions,
    MdOutlineTimerOff,
    MdSubscriptions,
} from "react-icons/md";
import { LuFileScan } from "react-icons/lu";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";

const statistics = [
    {
        title: "إجمالي العملاء",
        key: "clients_count",
        icon: <FaUsers />,
    },
    {
        title: "المضافون حديثا",
        key: "recently_clients",
        icon: <FaUserPlus />,
    },
    {
        title: "الاشتراكات الحالية",
        key: "active_subscriptions",
        icon: <MdSubscriptions />,
    },
    {
        title: "الاشتراكات المنتهية",
        key: "recently_expired_subscriptions",
        icon: <MdOutlineTimerOff />,
    },
    {
        title: "تسجيلات الباركود",
        key: "today_barcode",
        icon: <LuFileScan />,
    },
    {
        title: "طلبات البيع",
        key: "today_sales",
        icon: <RiShoppingBag3Fill />,
    },
    {
        title: "الطلبات المعلقة",
        key: "pending_sales",
        icon: <MdOutlinePendingActions />,
    },
    {
        title: "إيرادات اليوم",
        key: "today_incomes",
        icon: <GiReceiveMoney />,
    },
    {
        title: "إيرادات الشهر",
        key: "month_incomes",
        icon: <GiReceiveMoney />,
    },
    {
        title: "مصروفات اليوم",
        key: "today_expenses",
        icon: <GiPayMoney />,
    },
    {
        title: "مصروفات الشهر",
        key: "month_expenses",
        icon: <GiPayMoney />,
    },
];

const Stats = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("reports", "report");
    if (!permissions.view) {
        return <></>;
    }

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const get_statistics = () => {
        fetch_list_data({
            searchURL: endpoints.statistics,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        if (permissions.view) {
            get_statistics();
        }
    }, []);

    return (
        <div className={`wrapper p-4`}>
            <h1 className="font-bold text-2xl text-gray-600 mb-6">
                إحصائيات اليوم {new Date().toLocaleDateString("ar-EG")}
            </h1>

            {loading ? (
                <Loading />
            ) : fetchError ? (
                <p className="text-lg text-center text-red-600 py-4">
                    خطأ في تحميل البيانات
                </p>
            ) : (
                <>
                    {data && (
                        <div className="font mt-10 text-center flex justify-center lg:justify-start flex-wrap gap-3">
                            {statistics.map((stat, index) => (
                                <StatCard
                                    key={index}
                                    title={stat.title}
                                    value={data?.[stat.key] ?? ""}
                                    icon={stat.icon}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Stats;
