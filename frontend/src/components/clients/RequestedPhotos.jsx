import React, { useState, useEffect } from "react";
import { Table, Button } from "flowbite-react";
import Loading from "../groups/Loading";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../config/config";
import { defaultFormSubmission, fetch_list_data } from "../../config/actions";
import ErrorGroup from "../groups/ErrorGroup";
import { usePermission } from "../../providers/PermissionProvider";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "../../config/axiosconfig";
import { useToast } from "../../providers/ToastProvider";

const RequestedPhotos = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("clients", "client");
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
    const [currentClient, setCurrentClient] = useState(null);

    const [post, setPost] = useState(false);
    const { showToast } = useToast();

    const get_current_clients = () => {
        const searchURL = `${endpoints.client_list}requested_photos=true${
            searchParam ? `&client=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}
        `;

        fetch_list_data({
            searchURL: searchURL,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    const handle_requested_photo = (url, action) => {
        setPost(true);
        const requested_photo_url = `${url}requested_photo/`;
        axios
            .post(requested_photo_url, { action: action })
            .then((response) => {
                showToast(`تم ${action == "accept" ? "قبول" : "رفض"} الصورة`);
                setCurrentClient(null);
                get_current_clients();
            })
            .catch((error) => {
                showToast("خطأ في تنفيذ العملية", true);
            })
            .finally(() => {
                setPost(false);
            });
    };

    useEffect(() => {
        if (permissions.view) {
            get_current_clients();
        }
    }, [searchParam, pageNumber]);

    useEffect(() => {
        const clientData = document.getElementById("client-data");
        if (clientData) {
            clientData.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentClient]);

    if (!permissions.view)
        return (
            <ErrorGroup
                title={"طلبات تغيير الصور"}
                message={"ليس لديك صلاحية"}
            />
        );

    return (
        <>
            {/* table data */}
            <ViewGroup title={"طلبات تغيير الصور"}>
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
                                        <Table.Cell>لا توجد بيانات</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ) : (
                                <>
                                    <Table.Head>
                                        <Table.HeadCell>
                                            اسم العميل
                                        </Table.HeadCell>
                                        <Table.HeadCell className="text-center">
                                            كود العميل
                                        </Table.HeadCell>
                                        <Table.HeadCell></Table.HeadCell>
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
                                                        {client.id ? (
                                                            client.id
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button
                                                            color={"primary"}
                                                            className="w-28 h-10 flex justify-center items-center"
                                                            onClick={() => {
                                                                setCurrentClient(
                                                                    client
                                                                );
                                                            }}
                                                        >
                                                            <span>معاينة</span>
                                                        </Button>
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
                        <div className="flex justify-center text-lg">
                            العدد : {data.count} طلب
                        </div>
                    </>
                )}
            </ViewGroup>

            {/* request data */}
            {currentClient && (
                <div
                    id="client-data"
                    className={`client-data p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                >
                    <h1 className="font-bold text-text text-lg">
                        بيانات الطلب
                    </h1>
                    <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                    <div className="flex justify-evenly flex-wrap gap-y-16">
                        <div className="flex flex-col items-center">
                            <div className="title">الصورة الحالية</div>
                            <div>
                                {currentClient?.photo ? (
                                    <img
                                        src={currentClient.photo}
                                        className="w-72 grow-0"
                                    />
                                ) : (
                                    <span className="text-secondary block h-full">
                                        لا توجد صورة حالية
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="title">الصورة الجديدة</div>
                            <div>
                                {currentClient?.requested_photo ? (
                                    <img
                                        src={currentClient.requested_photo}
                                        className="w-72"
                                    />
                                ) : (
                                    <span className="text-secondary">
                                        لا توجد صورة حالية
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="actions mt-8 flex justify-center gap-7">
                        <Button
                            type="button"
                            color={"primary"}
                            disabled={post}
                            size={"xl"}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                            onClick={() => {
                                handle_requested_photo(
                                    currentClient.url,
                                    "accept"
                                );
                            }}
                        >
                            قبول
                        </Button>
                        <Button
                            type="button"
                            color={"failure"}
                            disabled={post}
                            size={"xl"}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                            onClick={() => {
                                handle_requested_photo(
                                    currentClient.url,
                                    "decline"
                                );
                            }}
                        >
                            رفض
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RequestedPhotos;
