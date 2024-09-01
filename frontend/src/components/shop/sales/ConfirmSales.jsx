import React, { useState, useEffect } from "react";
import { Table, Button } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import TablePagination from "../../groups/TablePagination";
import { usePermission } from "../../../providers/PermissionProvider";
import ErrorGroup from "../../groups/ErrorGroup";
import endpoints from "../../../config/config";
import { fetch_list_data } from "../../../config/actions";
import { useDrawer } from "../../../providers/DrawerProvider";
import { FaInfoCircle } from "react-icons/fa";
import ConfirmPrompt from "./ConfirmPrompt";
import { MdDelete } from "react-icons/md";
import ConfirmDelete from "../../groups/ConfirmDelete";

const ConfirmSales = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("shop", "sale");
    if (!permissions.change && !permissions.view) {
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
    const { showDrawer, closeDrawer } = useDrawer();

    const handleDrawer = (drawerFunction, sale) => {
        if (drawerFunction == "confirm") {
            showDrawer(
                "تأكيد عملية البيع",
                FaInfoCircle,
                <ConfirmPrompt
                    sale={sale}
                    closeDrawer={closeDrawer}
                    callBack={() => {
                        setSearchParam(null);
                        setPageNumber(null);
                        get_current_sales();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف طلب",
                MdDelete,
                <ConfirmDelete
                    deleteURL={sale.url}
                    deletePrompt={" هل أنت متأكد تريد حذف الطلب"}
                    itemName={sale.id}
                    closeDrawer={closeDrawer}
                    callBack={() => {
                        setSearchParam(null);
                        setPageNumber(null);
                        get_current_sales();
                    }}
                    toastMessage={"تم حذف الطلب بنجاح"}
                />
            );
        }
    };

    const get_current_sales = () => {
        const searchURL = `${endpoints.sale_list}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}&ordering=-id
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
            get_current_sales();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* table data */}
            {permissions.view ? (
                <ViewGroup title={"الطلبات الحالية"}>
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
                                    setPageNumber(null);
                                    setSearchParam(event.target.value);
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
                                                رقم الطلب
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الصافى
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                تاريخ الطلب
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الحالة
                                            </Table.HeadCell>
                                            <Table.HeadCell></Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((sale) => {
                                                return (
                                                    <Table.Row
                                                        key={sale.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {sale.id ? (
                                                                sale.id
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {sale.after_discount ? (
                                                                sale.after_discount
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {sale.date ? (
                                                                sale.date
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {sale.state ? (
                                                                <span
                                                                    className={`font-bold ${
                                                                        sale.state ===
                                                                        "معلق"
                                                                            ? "text-accent-600"
                                                                            : "text-green-500"
                                                                    }`}
                                                                >
                                                                    {sale.state}
                                                                </span>
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell className="flex gap-x-2 text-center items-center">
                                                            {sale.state ==
                                                            "معلق" ? (
                                                                <>
                                                                    {permissions.change && (
                                                                        <Button
                                                                            type="button"
                                                                            color={
                                                                                "primary"
                                                                            }
                                                                            onClick={() =>
                                                                                handleDrawer(
                                                                                    "confirm",
                                                                                    sale
                                                                                )
                                                                            }
                                                                            className="w-20 h-10 flex justify-center items-center"
                                                                        >
                                                                            تأكيد
                                                                        </Button>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <span
                                                                    className={`font-bold text-green-500`}
                                                                >
                                                                    {
                                                                        sale.confirm_date
                                                                    }
                                                                </span>
                                                            )}
                                                            {permissions.delete && (
                                                                <Button
                                                                    type="button"
                                                                    color={
                                                                        "failure"
                                                                    }
                                                                    onClick={() =>
                                                                        handleDrawer(
                                                                            "delte",
                                                                            sale
                                                                        )
                                                                    }
                                                                    className="w-20 h-10 flex justify-center items-center"
                                                                >
                                                                    حذف
                                                                </Button>
                                                            )}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                );
                                            })}
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
                    title={"الطلبات الحالية"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default ConfirmSales;
