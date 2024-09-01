import React, { useState, useEffect } from "react";
import { Label, Table, Datepicker } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import { fetch_list_data } from "../../../config/actions";
import SaleForm from "./SaleForm";
import { usePermission } from "../../../providers/PermissionProvider";
import ErrorGroup from "../../groups/ErrorGroup";

const Sale = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("shop", "sale");
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

    const get_current_sales = () => {
        const searchURL = `${endpoints.sale_list}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}${
            date ? `&date=${date}` : ""
        }&ordering=-id
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
    }, [searchParam, pageNumber, date]);

    return (
        <>
            {/* add form */}
            {/* add form */}
            {permissions.add ? (
                <SaleForm
                    callBack={() => {
                        setSearchParam(null);
                        setPageNumber(null);
                        get_current_sales();
                    }}
                />
            ) : (
                <ErrorGroup title={"إضافة طلب"} message={"ليس لديك صلاحية"} />
            )}

            {/* table data */}
            {permissions.view ? (
                <ViewGroup title={`طلبات البيع المضافة يوم  ${date}`}>
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
                                                التاريخ
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الحالة
                                            </Table.HeadCell>
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
                    title={`طلبات البيع المضافة يوم  ${date}`}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Sale;
