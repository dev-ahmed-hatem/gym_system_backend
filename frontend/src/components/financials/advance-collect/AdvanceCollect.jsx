import React, { useState } from "react";
import { usePermission } from "../../../providers/PermissionProvider";
import AdvanceCollectForm from "./AdvanceCollectForm";
import ViewGroup from "../../groups/ViewGroup";
import { Table } from "flowbite-react";
import AdvancePaymentForm from "./AdvancePaymentForm";
import { get_advance_data } from "./utils";

const AdvanceCollect = () => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("financials", "advance");
    if (!permissions.change) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }
    //////////////////////////////// list data ////////////////////////////////
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);
    const [post, setPost] = useState(false);

    return (
        <>
            {/* search form */}
            <AdvanceCollectForm
                setFetchError={setFetchError}
                setData={setData}
                post={post}
                setPost={setPost}
            />

            {/* table data */}
            {(data || fetchError) && (
                <>
                    {fetchError ? (
                        <div
                            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                        >
                            <h1 className="font-bold text-text text-lg">خطأ</h1>
                            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                            <p className="text-lg text-center text-red-600 py-4">
                                خطأ في تحميل البيانات
                            </p>
                        </div>
                    ) : data.count == 0 ? (
                        <ViewGroup title={"رقم سلفة غير صحيح"}>
                            <p className="text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                لا توجد بيانات
                            </p>
                        </ViewGroup>
                    ) : (
                        <>
                            {/* Advance payment form */}
                            <AdvancePaymentForm
                                advance_info={data?.results[0]}
                                callBack={() => {
                                    get_advance_data(
                                        data?.results[0].id,
                                        setData,
                                        setFetchError,
                                        setPost
                                    );
                                }}
                            />

                            {/* Payments history */}
                            <ViewGroup title={"سجل السداد للسلفة"}>
                                <div className="table-wrapper w-full overflow-x-auto">
                                    <Table
                                        striped
                                        className="font-bold text-right"
                                    >
                                        {data?.results[0].payments.length ==
                                        0 ? (
                                            <Table.Body>
                                                <Table.Row className="text-lg text-center text-gray-800 py-3 font-bold bg-red-500">
                                                    <Table.Cell>
                                                        لم يتم سداد أى مبلغ
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        ) : (
                                            <>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        رقم السداد
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        المبلغ
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        التاريخ
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {data?.results[0].payments.map(
                                                        (advance_payment) => {
                                                            return (
                                                                <Table.Row
                                                                    key={
                                                                        advance_payment.id
                                                                    }
                                                                    className="bg-white font-medium text-gray-900"
                                                                >
                                                                    <Table.Cell>
                                                                        {advance_payment.id ? (
                                                                            advance_payment.id
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {advance_payment.amount ? (
                                                                            advance_payment.amount
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <span className="text-sm">
                                                                            {
                                                                                advance_payment.date
                                                                            }
                                                                        </span>
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            );
                                                        }
                                                    )}
                                                </Table.Body>
                                            </>
                                        )}
                                    </Table>
                                </div>
                            </ViewGroup>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default AdvanceCollect;
