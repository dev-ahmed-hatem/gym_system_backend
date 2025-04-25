import React, { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";
import Loading from "../groups/Loading";
import ViewGroup from "../groups/ViewGroup";
import BarcodeReportForm from "./BarcodeReportForm";
import { usePermission } from "../../providers/PermissionProvider";
import ErrorGroup from "../groups/ErrorGroup";
import { MdDelete } from "react-icons/md";
import ConfirmDelete from "../groups/ConfirmDelete";
import { useDrawer } from "../../providers/DrawerProvider";
import TablePagination from "../groups/TablePagination";
import TableGroup from "../groups/TableGroup";
import endpoints from "../../config/config";
import { fetch_list_data } from "../../config/actions";

const BarcodeReport = ({ client }) => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("clients", "attendance");

    if (!permissions.view)
        return <ErrorGroup title={"سجل الحضور"} message={"ليس لديك صلاحية"} />;

    //////////////////////////////// list data ////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const { showDrawer, closeDrawer } = useDrawer();

    const [formData, setFormData] = useState(null);

    const get_attendance_report = ({data=null, setPost=null}) => {        
        if(formData === null) return;

        const from = data != null? data.from : formData.from;
        const to = data != null? data.to : formData.to;
        const clientId = data != null? data.client : formData.client;
        
        const url = `${endpoints.attendance}from=${from}&to=${to}${
            client ? `&client=${clientId}` : ""
        }${searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}
        `;
        
        if (setPost) setPost(true);
        setLoading(true);

        fetch_list_data({
            searchURL: url,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: () => {
                if (setPost) setPost(false);
                setLoading(false);
            },
        });
    }

    useEffect(() => {
        if (permissions.view) {
            get_attendance_report({});
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* search form */}
            <BarcodeReportForm
                setFormData={setFormData}
                client={client}
                action={get_attendance_report}
            />

            {/* table data */}
            {(data || loading || fetchError) && (
                <ViewGroup title={"النتائج"}>
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
                                searchField={false}
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
                                            <Table.Head className="text-center">
                                                <Table.HeadCell>
                                                    اسم العميل
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    كود العميل
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    الاشتراك
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    كود الاشتراك
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    الوقت
                                                </Table.HeadCell>
                                                {permissions.delete && (
                                                    <Table.HeadCell>
                                                        إجراءات
                                                    </Table.HeadCell>
                                                )}
                                            </Table.Head>
                                            <Table.Body className="text-center">
                                                {data.results.map((attendance) => {
                                                    return (
                                                        <Table.Row
                                                            key={attendance.id}
                                                            className="bg-white font-medium text-gray-900"
                                                        >
                                                            <Table.Cell>
                                                                {attendance
                                                                    ?.client
                                                                    ?.name ||
                                                                    attendance.guest}
                                                            </Table.Cell>
                                                            <Table.Cell className="text-center">
                                                                {attendance
                                                                    ?.client
                                                                    ?.id ||
                                                                    `دعوة   ${attendance.invitation_code}`}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {attendance
                                                                    ?.subscription
                                                                    ?.plan
                                                                    ?.name ? (
                                                                    attendance
                                                                        .subscription
                                                                        .plan
                                                                        .name
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {attendance
                                                                    ?.subscription
                                                                    ?.id ? (
                                                                    attendance
                                                                        .subscription
                                                                        .id
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {attendance?.timestamp ? (
                                                                    attendance.timestamp
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            {permissions.delete && (
                                                                <Table.Cell>
                                                                    <Button
                                                                        type="button"
                                                                        color={
                                                                            "failure"
                                                                        }
                                                                        onClick={() =>
                                                                            showDrawer(
                                                                                "إلغاء الحضور",
                                                                                MdDelete,
                                                                                <ConfirmDelete
                                                                                    deleteURL={
                                                                                        attendance.url
                                                                                    }
                                                                                    deletePrompt={
                                                                                        " هل أنت متأكد تريد حذف الحضور"
                                                                                    }
                                                                                    itemName={
                                                                                        ""
                                                                                    }
                                                                                    closeDrawer={
                                                                                        closeDrawer
                                                                                    }
                                                                                    callBack={() => {
                                                                                        setData(
                                                                                            null
                                                                                        );
                                                                                    }}
                                                                                    toastMessage={
                                                                                        "تم حذف الحضور بنجاح"
                                                                                    }
                                                                                />
                                                                            )
                                                                        }
                                                                        className="w-20 h-10 flex justify-center items-center"
                                                                    >
                                                                        حذف
                                                                    </Button>
                                                                </Table.Cell>
                                                            )}
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

                            <div className="flex justify-center text-lg">
                                العدد : {data?.count}{" "}
                                {data?.count > 10 ? "تسجيل" : "تسجيلات"}
                            </div>
                        </>
                    )}
                </ViewGroup>
            )}
        </>
    );
};

export default BarcodeReport;
