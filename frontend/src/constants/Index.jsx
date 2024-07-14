import {
    FaUsers,
    FaCog,
    FaUserPlus,
    FaUserSlash,
    FaSearch,
    FaFilter,
    FaBarcode,
    FaMoneyBill,
    FaFileAlt,
    FaRegFileAlt,
    FaBirthdayCake,
} from "react-icons/fa";
import {
    MdSupervisorAccount,
    MdPerson,
    MdSecurity,
    MdSubscriptions,
    MdLock,
    MdLockOpen,
    MdMoneyOff,
    MdAssignment,
    MdReport,
} from "react-icons/md";
import Managers from "../components/users/Managers";
import Employees from "../components/users/Employees";

export const routes = [
    {
        id: 1,
        title: "إدارة المستخدمين",
        url: "/users",
        icon: <FaUsers />,
        children: [
            {
                id: 1,
                title: "المديرين",
                url: "/users/managers",
                icon: <MdSupervisorAccount />,
                element: <Managers />,
            },
            {
                id: 2,
                title: "الموظفين",
                url: "/users/staff",
                icon: <MdPerson />,
                element: <Employees />,
            },
            {
                id: 3,
                title: "المشرفين",
                url: "/users/moderators",
                icon: <MdSupervisorAccount />,
            },
            {
                id: 4,
                title: "الصلاحيات",
                url: "/users/permissions",
                icon: <MdSecurity />,
            },
        ],
    },
    {
        id: 2,
        title: "إعدادات النظام",
        url: "/settings",
        icon: <FaCog />,
        children: [
            {
                id: 1,
                title: "الاشتراكات",
                url: "/settings/plans",
                icon: <MdSubscriptions />,
            },
            {
                id: 2,
                title: "اللوكر",
                url: "/settings/lockers",
                icon: <MdLock />,
            },
            {
                id: 3,
                title: "أرقام اللوكر",
                url: "/settings/lockers-numbers",
                icon: <MdLockOpen />,
            },
            {
                id: 4,
                title: "الاشتراكات الإضافية",
                url: "/settings/additional-plans",
                icon: <MdSubscriptions />,
            },
            {
                id: 5,
                title: "بنود المصروفات",
                url: "/settings/expenses",
                icon: <FaMoneyBill />,
            },
            {
                id: 6,
                title: "الموظفين",
                url: "/settings/staff",
                icon: <MdPerson />,
            },
        ],
    },
    {
        id: 3,
        title: "الأعضاء",
        url: "/clients",
        icon: <FaUsers />,
        children: [
            {
                id: 1,
                title: "إضافة عضو",
                url: "/clients/add",
                icon: <FaUserPlus />,
            },
            {
                id: 2,
                title: "حظر عضو",
                url: "/clients/block",
                icon: <FaUserSlash />,
            },
            {
                id: 3,
                title: "بحث فردى",
                url: "/clients/search",
                icon: <FaSearch />,
            },
            {
                id: 4,
                title: "بحث مجموعة",
                url: "/clients/filter",
                icon: <FaFilter />,
            },
        ],
    },
    {
        id: 4,
        title: "الاشتراكات",
        url: "/subscriptions",
        icon: <MdSubscriptions />,
        children: [
            {
                id: 1,
                title: "إضافة اشتراك",
                url: "/subscriptions/add",
                icon: <MdSubscriptions />,
            },
            {
                id: 2,
                title: "الاشتراكات خلال فترة",
                url: "/subscriptions/within-duration",
                icon: <MdSubscriptions />,
            },
            {
                id: 3,
                title: "الاشتراكات الحالية",
                url: "/subscriptions/current-active",
                icon: <MdSubscriptions />,
            },
            {
                id: 4,
                title: "بحث",
                url: "/subscriptions/search",
                icon: <FaSearch />,
            },
            {
                id: 5,
                title: "إيقاف الاشتراكات",
                url: "/subscriptions/freeze",
                icon: <MdMoneyOff />,
            },
            {
                id: 6,
                title: "الاشتراكات المنتهية",
                url: "/subscriptions/expired",
                icon: <MdSubscriptions />,
            },
        ],
    },
    {
        id: 5,
        title: "الباركود",
        url: "/barcode",
        icon: <FaBarcode />,
        children: [
            {
                id: 1,
                title: "الباركود اليومي",
                url: "/barcode/today",
                icon: <FaBarcode />,
            },
            {
                id: 2,
                title: "سجل الباركود",
                url: "/barcode/attendance",
                icon: <FaBarcode />,
            },
        ],
    },
    {
        id: 6,
        title: "الشؤون المالية",
        url: "/financials",
        icon: <FaMoneyBill />,
        children: [
            {
                id: 1,
                title: "الإيرادات",
                url: "/financials/incomes",
                icon: <FaMoneyBill />,
            },
            {
                id: 2,
                title: "المصروفات",
                url: "/financials/expenses",
                icon: <FaMoneyBill />,
            },
        ],
    },
    {
        id: 7,
        title: "التقارير",
        url: "/reports",
        icon: <FaFileAlt />,
        children: [
            {
                id: 1,
                title: "التقارير اليومية",
                url: "/reports/daily",
                icon: <FaRegFileAlt />,
            },
            {
                id: 2,
                title: "التقارير الشهرية",
                url: "/reports/monthly",
                icon: <FaRegFileAlt />,
            },
            {
                id: 3,
                title: "التقارير خلال فترة",
                url: "/reports/within-duration",
                icon: <MdReport />,
            },
            {
                id: 4,
                title: "تقارير الاشتراكات",
                url: "/reports/subscriptions",
                icon: <MdAssignment />,
            },
            {
                id: 5,
                title: "تقارير أعياد الميلاد",
                url: "/reports/birthdays",
                icon: <FaBirthdayCake />,
            },
        ],
    },
];

const formMapping = {};
