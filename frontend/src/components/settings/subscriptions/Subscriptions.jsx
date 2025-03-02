import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import SubscriptionPlanForm from "./SubscriptionsForm";
import { fetch_list_data } from "../../../config/actions";
import ConfirmDelete from "../../groups/ConfirmDelete";
import ErrorGroup from "../../groups/ErrorGroup";
import { usePermission } from "../../../providers/PermissionProvider";
import { useDrawer } from "../../../providers/DrawerProvider";

const Subscriptions = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions(
        "subscriptions",
        "subscriptionplan"
    );
    if (!permissions.add && !permissions.view) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleDrawer = (drawerFunction, item) => {
        if (drawerFunction == "edit") {
            showDrawer(
                "تعديل اشتراك",
                MdEdit,
                <SubscriptionPlanForm
                    postURL={item.url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_subscriptions();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف بند",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف الاشتراك"}
                        itemName={item.name}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_subscriptions();
                        }}
                        toastMessage={"تم حذف الاشتراك بنجاح"}
                    />
                </>
            );
        }
    };

    const get_current_subscriptions = () => {
        const searchURL = `${endpoints.subscription_plan_list}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}
        `;

        fetch_list_data({
            searchURL: searchURL,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        if (permissions.view) {
            get_current_subscriptions();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* add form */}
            {permissions.add ? (
                <SubscriptionPlanForm
                    postURL={endpoints.subscription_plan_list}
                    callBack={get_current_subscriptions}
                />
            ) : (
                <ErrorGroup
                    title={"إضافة اشتراك"}
                    message={"ليس لديك صلاحية"}
                />
            )}

            {/* table data */}
            {permissions.view ? (
                <ViewGroup title={"الاشتراكات الحالية"}>
                    {loading ? (
                        <Loading />
                    ) : fetchError ? (
                        <p className="text-lg text-center text-red-600 py-4">
                            خطأ في تحميل البيانات
                        </p>
                    ) : (
                        <>
                            <TableGroup
                                onChange={(event) => {
                                    setSearchParam(event.target.value);
                                    setPageNumber(1);
                                }}
                            >
                                {data.count == 0 ? (
                                    <Table.Body>
                                        <Table.Row className="text-lg text-center text-gray-800 py-3 font-bold bg-red-500">
                                            <Table.Cell>
                                                لا توجد بيانات
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ) : (
                                    <>
                                        <Table.Head>
                                            <Table.HeadCell>
                                                اسم الاشتراك
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                النوع
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                السعر
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الفترة
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الصلاحية
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                اشتراك طلاب
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map(
                                                (subscription) => {
                                                    return (
                                                        <Table.Row
                                                            key={
                                                                subscription.id
                                                            }
                                                            className="bg-white font-medium text-gray-900"
                                                        >
                                                            <Table.Cell>
                                                                {subscription.name ? (
                                                                    subscription.name
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {subscription.sub_type ? (
                                                                    subscription.sub_type
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {subscription.price ? (
                                                                    subscription.price
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {subscription.duration_display ? (
                                                                    <span className="text-sm">
                                                                        {
                                                                            subscription.duration_display
                                                                        }
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {subscription.validity ? (
                                                                    <span className="text-sm">
                                                                        {
                                                                            subscription.validity
                                                                        }{" "}
                                                                        {subscription.validity >
                                                                        10
                                                                            ? "يوم"
                                                                            : "أيام"}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {subscription.active ? (
                                                                    <span className="font-bold text-green-500">
                                                                        نعم
                                                                    </span>
                                                                ) : (
                                                                    <span className="font-bold text-yellow-500">
                                                                        لا
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                <span className="flex text-xl gap-x-3">
                                                                    {permissions.change && (
                                                                        <MdEdit
                                                                            className="text-accent cursor-pointer"
                                                                            onClick={() => {
                                                                                handleDrawer(
                                                                                    "edit",
                                                                                    subscription
                                                                                );
                                                                            }}
                                                                        />
                                                                    )}
                                                                    {permissions.delete && (
                                                                        <MdDelete
                                                                            className="text-secondary cursor-pointer"
                                                                            onClick={() => {
                                                                                handleDrawer(
                                                                                    "delete",
                                                                                    subscription
                                                                                );
                                                                            }}
                                                                        />
                                                                    )}
                                                                </span>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    );
                                                }
                                            )}
                                        </Table.Body>
                                    </>
                                )}
                            </TableGroup>

                            {data.total_pages > 1 && (
                                <TablePagination
                                    totalPages={data.total_pages}
                                    currentPage={data.current_page}
                                    onPageChange={(page) => {
                                        setPageNumber(page);
                                    }}
                                />
                            )}
                        </>
                    )}
                </ViewGroup>
            ) : (
                <ErrorGroup
                    title={"الاشتراكات الحالية"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Subscriptions;
