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
    FaTools,
    FaRegStopCircle,
} from "react-icons/fa";
import {
    MdSupervisorAccount,
    MdPerson,
    MdSecurity,
    MdSubscriptions,
    MdAssignment,
    MdOutlineTimerOff,
    MdInventory,
} from "react-icons/md";
import { FaShop } from "react-icons/fa6";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { IoBagCheck } from "react-icons/io5";
import Managers from "../components/users/managers/Managers";
import Employees from "../components/users/employees/Employees";
import Moderators from "../components/users/moderators/Moderators";
import Permissions from "../components/users/Permissions";
import Subscriptions from "../components/settings/subscriptions/Subscriptions";
import EmployeeSettings from "../components/settings/employee-settings/EmployeeSettings";
import ProductCategories from "../components/settings/product-categories/ProductCategories";
import FinancialItems from "../components/settings/financial-items/FinancialItems";
import AddClient from "../components/clients/AddClient";
import { GiMoneyStack, GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import Blocklist from "../components/clients/Blocklist";
import ClientSearch from "../components/clients/ClientSearch";
import { BiSolidCategory, BiSolidOffer } from "react-icons/bi";
import Products from "../components/shop/products/Products";
import Transaction from "../components/financials/transaction/Transaction";
import Salaries from "../components/financials/salaries/Salaries";
import { TbReport, TbUserScan } from "react-icons/tb";
import { IoIosFitness } from "react-icons/io";
import { VscRunAll } from "react-icons/vsc";
import { SlCalender } from "react-icons/sl";
import SubscriptionAdd from "../components/subscriptions/SubscriptionAdd";
import ClientFilter from "../components/clients/ClientFilter";
import SubscriptionEdit from "../components/subscriptions/SubscriptionEdit";
import SubscriptionsList from "../components/subscriptions/SubscriptionsList";
import SubscriptionFilter from "../components/subscriptions/SubscriptionFilter";
import Scanner from "../components/barcode/Scanner";
import { LuFileScan, LuScanLine } from "react-icons/lu";
import BarcodeReport from "../components/barcode/AttendanceReport";
import DailyReport from "../components/reports/DailyReport";
import Sale from "../components/shop/sales/Sale";
import ConfirmSales from "../components/shop/sales/ConfirmSales";
import Offers from "../components/settings/offers/Offers";
import GymData from "../components/settings/gym-data/GymData";

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
                app_label: "users",
                model_name: "employee",
            },
            {
                id: 3,
                title: "المشرفين",
                name: "moderators",
                url: "/users/moderators",
                icon: <MdSupervisorAccount />,
                element: <Moderators />,
                app_label: "users",
                model_name: "moderator",
            },
            {
                id: 4,
                title: "الصلاحيات",
                name: "permissions",
                url: "/users/permissions",
                icon: <MdSecurity />,
                element: <Permissions />,
                permissions: "unadjustable",
                // [
                //     { id: 1, value: "تعديل الصلاحيات", name: "permissions" },
                // ],
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
                element: <GymData />,
                app_label: "gym_data",
                model_name: "gymdata",
                permissions: [
                    {
                        id: 1,
                        value: "تعديل بيانات الجيم",
                        name: "gym_data.change_gymdata",
                    },
                ],
            },
            {
                id: 2,
                title: "الموظفين",
                name: "staff-settings",
                url: "/settings/staff",
                icon: <MdPerson />,
                element: <EmployeeSettings />,
                app_label: "users",
                model_name: "employeesettings",
            },
            {
                id: 3,
                title: "الاشتراكات",
                name: "plans",
                url: "/settings/plans",
                icon: <MdSubscriptions />,
                element: <Subscriptions />,
                app_label: "subscriptions",
                model_name: "subscriptionplan",
            },
            {
                id: 4,
                title: "فئات المنتجات",
                url: "/settings/product-categories",
                icon: <BiSolidCategory />,
                element: <ProductCategories />,
                app_label: "shop",
                model_name: "productcategory",
            },
            {
                id: 5,
                title: "العروض",
                name: "offers",
                url: "/settings/offers",
                icon: <BiSolidOffer />,
                element: <Offers />,
                app_label: "shop",
                model_name: "offer",
            },
            {
                id: 6,
                title: "البنود المالية",
                name: "expenses-items",
                url: "/settings/expenses",
                icon: <FaMoneyBill />,
                element: <FinancialItems />,
                app_label: "financials",
                model_name: "financialitem",
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
                element: <AddClient />,
                app_label: "clients",
                model_name: "client",
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
                app_label: "subscriptions",
                model_name: "subscription",
            },
            {
                id: 2,
                title: "تعديل اشتراك",
                name: "edit-subscription",
                url: "/subscriptions/edit",
                icon: <FaTools />,
                permissions: "unadjustable",
                element: <SubscriptionEdit />,
            },
            {
                id: 3,
                title: "الاشتراكات الحالية",
                name: "current-subscriptions",
                url: "/subscriptions/current-active",
                icon: <VscRunAll />,
                permissions: "unadjustable",
                element: <SubscriptionsList category={"active"} />,
            },
            {
                id: 4,
                title: "الاشتراكات المعلقة",
                name: "frozen-subscriptions",
                url: "/subscriptions/frozen",
                icon: <FaRegStopCircle />,
                permissions: "unadjustable",
                element: <SubscriptionsList category={"frozen"} />,
            },
            {
                id: 5,
                title: "الاشتراكات المنتهية",
                name: "expired-subscriptions",
                url: "/subscriptions/expired",
                icon: <MdOutlineTimerOff />,
                permissions: "unadjustable",
                element: <SubscriptionsList category={"expired"} />,
            },
            {
                id: 6,
                title: "الاشتراكات خلال فترة",
                name: "subscriptions-within-duration",
                url: "/subscriptions/within-duration",
                icon: <SlCalender />,
                permissions: "unadjustable",
                element: <SubscriptionFilter />,
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
                icon: <LuScanLine />,
                element: <Scanner />,
            },
            {
                id: 2,
                title: "سجل الباركود",
                name: "barcode-attendance",
                url: "/barcode/attendance",
                icon: <LuFileScan />,
                element: <BarcodeReport key={"attendance-report"} />,
            },
            {
                id: 3,
                title: "سجل الباركود لعميل",
                name: "barcode-client-attendance",
                url: "/barcode/client-attendance",
                icon: <TbUserScan />,
                element: (
                    <BarcodeReport
                        client={true}
                        key={"attendance-client-report"}
                    />
                ),
            },
        ],
    },
    {
        id: 6,
        title: "المتجر",
        name: "shop",
        url: "/shop",
        icon: <FaShop />,
        children: [
            {
                id: 1,
                title: "المنتجات",
                name: "products",
                url: "/shop/products",
                icon: <RiShoppingBag3Fill />,
                element: <Products />,
                app_label: "shop",
                model_name: "product",
            },
            {
                id: 2,
                title: "المخزون",
                name: "products",
                url: "/shop/stock",
                icon: <MdInventory />,
                element: <Products stock={true} />,
                app_label: "shop",
                model_name: "product",
                permissions: "unadjustable",
            },
            {
                id: 3,
                title: "الطلبات",
                name: "products",
                url: "/shop/sale-products",
                icon: <RiShoppingBag3Fill />,
                element: <Sale />,
                app_label: "shop",
                model_name: "sale",
            },
            {
                id: 4,
                title: "تأكيد طلبات البيع",
                name: "sales",
                url: "/shop/sales",
                icon: <IoBagCheck />,
                element: <ConfirmSales />,
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
                permission_name: "الإيرادات والمصروفات",
                app_label: "financials",
                model_name: "transaction",
            },
            {
                id: 2,
                title: "المصروفات",
                name: "expenses",
                url: "/financials/expenses",
                icon: <GiPayMoney />,
                element: <Transaction type={"expenses"} />,
                permissions: "unadjustable",
            },
            {
                id: 3,
                title: "المرتبات الشهرية",
                name: "salaries",
                url: "/financials/salaries",
                icon: <GiMoneyStack />,
                element: <Salaries />,
                permissions: [
                    {
                        id: 1,
                        value: "تخصيص المرتبات",
                        name: "financials.change_salary",
                    },
                ],
            },
        ],
    },
    {
        id: 8,
        title: "التقارير",
        name: "reports",
        url: "/reports",
        icon: <FaFileAlt />,
        permissions: [
            {
                id: 1,
                value: "عرض الإحصائيات والتقارير",
                name: "reports.view_report",
            },
        ],
        children: [
            {
                id: 1,
                title: "التقارير اليومية",
                name: "daily-reports",
                url: "/reports/daily",
                icon: <MdAssignment />,
                element: <DailyReport />,
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
