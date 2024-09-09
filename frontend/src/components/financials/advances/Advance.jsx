import { useState, useEffect } from "react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { Table } from "flowbite-react";
import endpoints from "../../../config/config";
import { usePermission } from "../../../providers/PermissionProvider";
import AdvanceForm from "./AdvanceForm";
import { fetch_list_data } from "../../../config/actions";
import ErrorGroup from "../../groups/ErrorGroup";

const Advance = () => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("financials", "advance");
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

    const get_current_advances = () => {
        const searchURL = `${endpoints.advance_list}${
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
            get_current_advances();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* add form */}
            {permissions.add ? (
                <AdvanceForm />
            ) : (
                <ErrorGroup
                    title={"استخراج سلفة"}
                    message={"ليس لديك صلاحية"}
                />
            )}

            {/* table data */}
            {permissions.view ? (
                <ViewGroup title={"سجل السلفات"}>
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
                                                رقم السلفة
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الموظف
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                المبلغ
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الحالة
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                التاريخ
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((advance) => {
                                                return (
                                                    <Table.Row
                                                        key={advance.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {advance.id ? (
                                                                advance.id
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {advance.employee_display ? (
                                                                advance.employee_display
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {advance.amount ? (
                                                                <span className="text-sm">
                                                                    {
                                                                        advance.amount
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {advance.fully_paid ? (
                                                                <span className="font-bold text-green-500">
                                                                    مدفوعة
                                                                </span>
                                                            ) : (
                                                                <span className="font-bold text-accent-600">
                                                                    حالية
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <span className="text-sm">
                                                                {advance.date}
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
                <ErrorGroup title={"سجل السلفات"} message={"ليس لديك صلاحية"} />
            )}
        </>
    );
};

export default Advance;
