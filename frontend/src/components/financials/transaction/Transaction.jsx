import React, { useState, useEffect } from "react";
import { Label, Table, Datepicker } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import TransactionsForm from "./TransactionForm";
import { fetch_list_data } from "../../../config/actions";
import { useDrawer } from "../../../providers/DrawerProvider";
import { usePermission } from "../../../providers/PermissionProvider";
import ConfirmDelete from "../../groups/ConfirmDelete";
import ErrorGroup from "../../groups/ErrorGroup";

const Transactions = ({ type }) => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("financials", "transaction");
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
    const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleDrawer = (drawerFunction, item) => {
        if (drawerFunction == "edit") {
            showDrawer(
                type === "expenses" ? "تعديل مصروف" : "تعديل إيراد",
                MdEdit,
                <TransactionsForm
                    postURL={item.url}
                    defaultValues={item}
                    transactionType={type}
                    callBack={() => {
                        get_current_transactions();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                type === "expenses" ? "حذف مصروف" : "حذف إيراد",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={` هل أنت متأكد تريد حذف ${
                            type === "expense" ? "المصروف" : "الإيراد"
                        }`}
                        itemName={item.category?.name}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_transactions();
                        }}
                        toastMessage={`تم حذف ${
                            type === "expenses" ? "المصروف" : "الإيراد"
                        } بنجاح`}
                    />
                </>
            );
        }
    };

    const get_current_transactions = () => {
        const searchURL = `${endpoints.transaction_list}${`&type=${type}`}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}${
            date ? `&date=${date}` : ""
        }
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
            get_current_transactions();
        }
    }, [searchParam, pageNumber, date, type]);

    return (
        <div key={type}>
            {/* add form */}
            {permissions.add ? (
                <TransactionsForm
                    postURL={endpoints.transaction_list}
                    callBack={get_current_transactions}
                    transactionType={type}
                />
            ) : (
                <ErrorGroup title={"إضافة موظف"} message={"ليس لديك صلاحية"} />
            )}

            {/* table data */}
            {permissions.view ? (
                <ViewGroup
                    title={`${
                        type == "expenses" ? "مصروفات" : "إيرادات"
                    } يوم  ${date}`}
                >
                    {loading ? (
                        <Loading />
                    ) : fetchError ? (
                        <p className="text-lg text-center text-red-600 py-4">
                            خطأ في تحميل البيانات
                        </p>
                    ) : (
                        <>
                            <div className="w-full lg:max-w-md mb-5">
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="birth_date"
                                        value="التاريخ  :"
                                    />
                                </div>
                                <Datepicker
                                    id="birth_date"
                                    language="ar"
                                    labelClearButton="مسح"
                                    labelTodayButton="اليوم"
                                    placeholder="تاريخ الميلاد"
                                    color={"primary"}
                                    onSelectedDateChanged={(date) => {
                                        setDate(
                                            date.toLocaleDateString("en-CA")
                                        );
                                    }}
                                />
                            </div>
                            <TableGroup
                                onChange={(event) => {
                                    setSearchParam(event.target.value);
                                    setPageNumber(1);
                                }}
                            >
                                {data.count == 0 ? (
                                    <Table.Body>
                                        <Table.Row className="text-lg text-center py-3 font-bold">
                                            <Table.Cell>
                                                لا توجد بيانات
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ) : (
                                    <>
                                        <Table.Head>
                                            <Table.HeadCell>
                                                البند
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                القيمة
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                التاريخ
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((transaction) => {
                                                return (
                                                    <Table.Row
                                                        key={transaction.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {transaction.category ? (
                                                                transaction
                                                                    .category
                                                                    ?.name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {transaction.amount ? (
                                                                transaction.amount
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {transaction.date ? (
                                                                transaction.date
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
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
                                                                                transaction
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
                                                                                transaction
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                            </span>
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
                    title={`${
                        type == "expenses" ? "المصروفات" : "الإيرادات"
                    } الحالية`}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </div>
    );
};

export default Transactions;
