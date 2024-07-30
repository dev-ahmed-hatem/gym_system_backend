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
    FaUserTie,
} from "react-icons/fa";
import {
    MdSupervisorAccount,
    MdPerson,
    MdSecurity,
    MdSubscriptions,
    MdAssignment,
    MdOutlineTimerOff,
} from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { IoBagCheck } from "react-icons/io5";
import Managers from "../components/users/Managers";
import Employees from "../components/users/Employees";
import Moderators from "../components/users/Moderators";
import Permissions from "../components/users/Permissions";
import Subscriptions from "../components/settings/Subscriptions";
import FinancialItems from "../components/settings/FinancialItems";
import EmployeeSettings from "../components/settings/EmployeeSettings";
import Clients from "../components/clients/Clients";
import { GiMoneyStack, GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import Blocklist from "../components/clients/Blocklist";
import ClientSearch from "../components/clients/ClientSearch";
import { BiSolidCategory, BiSolidOffer } from "react-icons/bi";
import ProductCategories from "../components/settings/ProductCategories";
import Products from "../components/shop/Products";
import Transaction from "../components/financials/Transaction";
import Salaries from "../components/financials/Salaries";
import { HiMiniPlayPause } from "react-icons/hi2";
import { TbReport } from "react-icons/tb";
import { IoIosFitness } from "react-icons/io";
import { VscRunAll } from "react-icons/vsc";
import { SlCalender } from "react-icons/sl";
import SubscriptionAdd from "../components/subscriptions/SubscriptionAdd";
import ClientFilter from "../components/clients/ClientFilter";

export const routes = [
    {
        id: 1,
        title: "إدارة طاقم العمل",
        name: "user-management",
        url: "/users",
        icon: <FaUsers />,
        children: [
            {
                id: 1,
                title: "المديرين",
                name: "managers",
                url: "/users/managers",
                icon: <FaUserTie />,
                element: <Managers />,
                permissions: "unadjustable",
            },
            {
                id: 2,
                title: "الموظفين",
                name: "staff",
                url: "/users/employees",
                icon: <MdPerson />,
                element: <Employees />,
            },
            {
                id: 3,
                title: "المشرفين",
                name: "moderators",
                url: "/users/moderators",
                icon: <MdSupervisorAccount />,
                element: <Moderators />,
            },
            {
                id: 4,
                title: "الصلاحيات",
                name: "permissions",
                url: "/users/permissions",
                icon: <MdSecurity />,
                element: <Permissions />,
                permissions: [
                    { id: 1, value: "تعديل الصلاحيات", name: "permissions" },
                ],
            },
        ],
    },
    {
        id: 2,
        title: "إعدادات النظام",
        name: "system-settings",
        url: "/settings",
        icon: <FaCog />,
        children: [
            {
                id: 1,
                title: "بيانات الجيم",
                name: "gym-data",
                url: "/settings/gym-data",
                icon: <IoIosFitness />,
            },
            {
                id: 2,
                title: "الموظفين",
                name: "staff-settings",
                url: "/settings/staff",
                icon: <MdPerson />,
                element: <EmployeeSettings />,
            },
            {
                id: 3,
                title: "الاشتراكات",
                name: "plans",
                url: "/settings/plans",
                icon: <MdSubscriptions />,
                element: <Subscriptions />,
            },
            {
                id: 4,
                title: "فئات المنتجات",
                url: "/settings/product-categories",
                icon: <BiSolidCategory />,
                element: <ProductCategories />,
            },
            {
                id: 5,
                title: "العروض",
                name: "offers",
                url: "/settings/offers",
                icon: <BiSolidOffer />,
            },
            {
                id: 6,
                title: "البنود المالية",
                name: "expenses-items",
                url: "/settings/expenses",
                icon: <FaMoneyBill />,
                element: <FinancialItems />,
            },
        ],
    },
    {
        id: 3,
        title: "الأعضاء",
        name: "clients",
        url: "/clients",
        icon: <FaUsers />,
        children: [
            {
                id: 1,
                title: "إضافة عضو",
                name: "add-client",
                url: "/clients/add",
                icon: <FaUserPlus />,
                element: <Clients />,
            },
            {
                id: 2,
                title: "حظر عضو",
                name: "block-client",
                url: "/clients/block",
                icon: <FaUserSlash />,
                permissions: "unadjustable",
                element: <Blocklist />,
            },
            {
                id: 3,
                title: "بحث فردى",
                name: "individual-search",
                url: "/clients/search",
                icon: <FaSearch />,
                permissions: "unadjustable",
                element: <ClientSearch />,
            },
            {
                id: 4,
                title: "بحث مجموعة",
                name: "group-search",
                url: "/clients/filter",
                icon: <FaFilter />,
                permissions: "unadjustable",
                element: <ClientFilter />,
            },
        ],
    },
    {
        id: 4,
        title: "الاشتراكات",
        name: "subscriptions",
        url: "/subscriptions",
        icon: <MdSubscriptions />,
        children: [
            {
                id: 1,
                title: "إضافة اشتراك",
                name: "add-subscription",
                url: "/subscriptions/add",
                icon: <MdSubscriptions />,
                element: <SubscriptionAdd />,
            },
            {
                id: 2,
                title: "بحث",
                name: "search-subscriptions",
                url: "/subscriptions/search",
                icon: <FaSearch />,
                permissions: "unadjustable",
            },
            {
                id: 3,
                title: "إيقاف الاشتراكات",
                name: "freeze-subscriptions",
                url: "/subscriptions/freeze",
                icon: <HiMiniPlayPause />,
                permissions: "unadjustable",
            },
            {
                id: 4,
                title: "الاشتراكات الحالية",
                name: "current-subscriptions",
                url: "/subscriptions/current-active",
                icon: <VscRunAll />,
                permissions: "unadjustable",
            },
            {
                id: 5,
                title: "الاشتراكات المنتهية",
                name: "expired-subscriptions",
                url: "/subscriptions/expired",
                icon: <MdOutlineTimerOff />,
                permissions: "unadjustable",
            },
            {
                id: 6,
                title: "الاشتراكات خلال فترة",
                name: "subscriptions-within-duration",
                url: "/subscriptions/within-duration",
                icon: <SlCalender />,
                permissions: "unadjustable",
            },
        ],
    },
    {
        id: 5,
        title: "الباركود",
        name: "barcode",
        url: "/barcode",
        icon: <FaBarcode />,
        permissions: "unadjustable",
        children: [
            {
                id: 1,
                title: "الباركود اليومي",
                name: "today-barcode",
                url: "/barcode/today",
                icon: <FaBarcode />,
            },
            {
                id: 2,
                title: "سجل الباركود",
                name: "barcode-attendance",
                url: "/barcode/attendance",
                icon: <FaBarcode />,
            },
        ],
    },
    {
        id: 6,
        title: "المتجر",
        name: "store",
        url: "/store",
        icon: <FaShop />,
        children: [
            {
                id: 1,
                title: "المنتجات",
                name: "products",
                url: "/store/products",
                icon: <RiShoppingBag3Fill />,
                element: <Products />,
            },
            {
                id: 2,
                title: "عمليات الشراء",
                name: "sales",
                url: "/store/sales",
                icon: <IoBagCheck />,
                permissions: "unadjustable",
            },
        ],
    },
    {
        id: 7,
        title: "الشئون المالية",
        name: "financials",
        url: "/financials",
        icon: <FaMoneyBill />,
        children: [
            {
                id: 1,
                title: "الإيرادات",
                name: "incomes",
                url: "/financials/incomes",
                icon: <GiReceiveMoney />,
                element: <Transaction type={"incomes"} />,
            },
            {
                id: 2,
                title: "المصروفات",
                name: "expenses",
                url: "/financials/expenses",
                icon: <GiPayMoney />,
                element: <Transaction type={"expenses"} />,
            },
            {
                id: 3,
                title: "المرتبات الشهرية",
                name: "salaries",
                url: "/financials/salaries",
                icon: <GiMoneyStack />,
                element: <Salaries />,
            },
        ],
    },
    {
        id: 8,
        title: "التقارير",
        name: "reports",
        url: "/reports",
        icon: <FaFileAlt />,
        permissions: [{ id: 1, value: "عرض التقارير", name: "reports" }],
        children: [
            {
                id: 1,
                title: "التقارير اليومية",
                name: "daily-reports",
                url: "/reports/daily",
                icon: <MdAssignment />,
            },
            {
                id: 2,
                title: "التقارير الشهرية",
                name: "monthly-reports",
                url: "/reports/monthly",
                icon: <FaRegFileAlt />,
            },
            {
                id: 3,
                title: "التقارير خلال فترة",
                name: "within-duration-reports",
                url: "/reports/within-duration",
                icon: <TbReport />,
            },
            {
                id: 4,
                title: "تقارير الاشتراكات",
                name: "subscription-reports",
                url: "/reports/subscriptions",
                icon: <MdSubscriptions />,
            },
            {
                id: 5,
                title: "تقارير أعياد الميلاد",
                name: "birthday-reports",
                url: "/reports/birthdays",
                icon: <FaBirthdayCake />,
            },
        ],
    },
];

const formMapping = {};
