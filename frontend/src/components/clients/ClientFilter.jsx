import React, { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Table, Button, Datepicker } from "flowbite-react";
import Loading from "../groups/Loading";
import ViewGroup from "../groups/ViewGroup";
import { useForm, Controller } from "react-hook-form";
import endpoints from "../../config/config";
import { fetch_list_data } from "../../config/actions";
import { usePermission } from "../../providers/PermissionProvider";
import ErrorGroup from "../groups/ErrorGroup";
import TablePagination from "../groups/TablePagination";

const ClientFilterForm = ({
    setLoading,
    setFetchError,
    setData,
    pageNumber,
}) => {
    const [post, setPost] = useState(false);
    const today = new Date().toLocaleDateString("en-CA");
    const {
        handleSubmit,
        formState: { errors },
        setError,
        control,
        watch,
        clearErrors,
    } = useForm({ defaultValues: { from: today, to: today } });
    const from = watch("from");
    const to = watch("to");

    useEffect(() => {
        if (to < from) {
            setError("to", {
                type: "manual",
                message: "تاريخ النهاية أقدم من تاريخ البداية",
            });
        } else {
            clearErrors();
        }
    }, [from, to]);

    const get_current_clients = (data) => {
        const url = `${endpoints.client_list}from=${
            data ? data.from : from
        }&to=${data ? data.to : to}${pageNumber ? `&page=${pageNumber}` : ""}`;
        setPost(true);
        setLoading(true);

        fetch_list_data({
            searchURL: url,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: () => {
                setPost(false);
                setLoading(false);
            },
        });
    };

    const onSubmit = (data) => {
        if (data.to < data.from) {
            setError("to", {
                type: "manual",
                message: "تاريخ النهاية أقدم من تاريخ البداية",
            });
            return;
        }

        get_current_clients(data);
    };

    useEffect(() => {
        get_current_clients();
    }, [pageNumber]);

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">
                عملاء تمت إضافتهم في الفترة :
            </h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="from" value="من :" />
                    </div>
                    <Controller
                        name="from"
                        control={control}
                        rules={{ required: "" }}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="from"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="من"
                                color={"primary"}
                                onSelectedDateChanged={(date) => {
                                    field.onChange(
                                        date.toLocaleDateString("en-CA")
                                    );
                                }}
                                {...field}
                            />
                        )}
                    />
                    {errors.from && (
                        <p className="error-message">{errors.from.message}</p>
                    )}
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="to" value="إلى :" />
                    </div>
                    <Controller
                        name="to"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="to"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="إلى"
                                color={errors.to ? "failure" : "primary"}
                                onSelectedDateChanged={(date) => {
                                    field.onChange(
                                        date.toLocaleDateString("en-CA")
                                    );
                                }}
                                {...field}
                            />
                        )}
                    />
                    {errors.to && (
                        <p className="error-message">{errors.to.message}</p>
                    )}
                </div>
                <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                    <Button
                        type="submit"
                        color={"primary"}
                        disabled={post}
                        className="w-32 h-10 flex justify-center items-center"
                        size={"xl"}
                        isProcessing={post}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        بحث
                    </Button>
                </div>
            </form>
        </div>
    );
};

const ClientFilter = () => {
    //////////////////////////////// list data ////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("clients", "client");

    if (!permissions.view)
        return (
            <ErrorGroup
                title={"العملاء الحاليين"}
                message={"ليس لديك صلاحية"}
            />
        );

    return (
        <>
            {/* search form */}
            <ClientFilterForm
                setLoading={setLoading}
                setFetchError={setFetchError}
                setData={setData}
                pageNumber={pageNumber}
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
                                                    اسم العميل
                                                </Table.HeadCell>
                                                <Table.HeadCell className="text-center">
                                                    الكود
                                                </Table.HeadCell>
                                                <Table.HeadCell>
                                                    تمت الإضافة فى
                                                </Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body>
                                                {data.results.map((client) => {
                                                    return (
                                                        <Table.Row
                                                            key={client.id}
                                                            className="bg-white font-medium text-gray-900"
                                                        >
                                                            <Table.Cell>
                                                                {client.name ? (
                                                                    client.name
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell className="text-center">
                                                                {client?.id ? (
                                                                    client.id
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {client?.date_created ? (
                                                                    client.date_created
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

                            {data.total_pages > 1 && (
                                <TablePagination
                                    totalPages={data.total_pages}
                                    currentPage={data.current_page}
                                    onPageChange={(page) => {
                                        setPageNumber(page);
                                    }}
                                />
                            )}

                            {data.count > 0 && (
                                <div className="flex justify-center text-lg">
                                    العدد : {data?.count}{" "}
                                    {data?.count > 10 ? "عميل" : "عملاء"}
                                </div>
                            )}
                        </>
                    )}
                </ViewGroup>
            )}
        </>
    );
};

export default ClientFilter;
