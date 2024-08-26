import React, { useState } from "react";
import { Table } from "flowbite-react";
import Loading from "../groups/Loading";
import ViewGroup from "../groups/ViewGroup";
import BarcodeReportForm from "./BarcodeReportForm";

const BarcodeReport = ({ client }) => {
    //////////////////////////////// list data ////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);

    return (
        <>
            {/* search form */}
            <BarcodeReportForm
                setLoading={setLoading}
                setFetchError={setFetchError}
                setData={setData}
                client={client}
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
                            <div className="table-wrapper w-full overflow-x-auto">
                                <Table striped className="font-bold text-right">
                                    {data.length == 0 ? (
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
                                            </Table.Head>
                                            <Table.Body className="text-center">
                                                {data.map((attendance) => {
                                                    return (
                                                        <Table.Row
                                                            key={attendance.id}
                                                            className="bg-white font-medium text-gray-900"
                                                        >
                                                            <Table.Cell>
                                                                {attendance
                                                                    ?.client
                                                                    ?.name ? (
                                                                    attendance
                                                                        .client
                                                                        .name
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell className="text-center">
                                                                {attendance
                                                                    ?.client
                                                                    ?.id ? (
                                                                    attendance
                                                                        .client
                                                                        .id
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
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
                                                        </Table.Row>
                                                    );
                                                })}
                                            </Table.Body>
                                        </>
                                    )}
                                </Table>
                            </div>

                            <div className="flex justify-center text-lg">
                                العدد : {data?.length}{" "}
                                {data?.length > 10 ? "تسجيل" : "تسجيلات"}
                            </div>
                        </>
                    )}
                </ViewGroup>
            )}
        </>
    );
};

export default BarcodeReport;
