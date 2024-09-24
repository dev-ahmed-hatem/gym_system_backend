import React, { useState, useEffect } from "react";
import { Table, Button } from "flowbite-react";
import Loading from "../groups/Loading";
import axios from "../../config/axiosconfig";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import { MdBlock } from "react-icons/md";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../config/config";
import { IoAccessibility } from "react-icons/io5";
import { usePermission } from "../../providers/PermissionProvider";
import { useToast } from "../../providers/ToastProvider";
import { useDrawer } from "../../providers/DrawerProvider";
import { fetch_list_data } from "../../config/actions";
import ErrorGroup from "../groups/ErrorGroup";

const ConfirmBlock = ({ client, state, closeDrawer, callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();

    const block = () => {
        const data = { is_blocked: !state };
        setPost(true);
        axios
            .patch(client.url, data)
            .then(() => {
                showToast(`تم ${state ? "إلغاء" : ""} حظر العميل بنجاح`);
                if (callBack) callBack();
                closeDrawer();
            })
            .catch((error) => {
                console.log(error);
                setPost(false);
                showToast("خطأ فى تنفيذ العملية", true);
            });
    };

    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <p className="text-base">
                هل أنت متأكد تريد {state ? "إلغاء" : ""} حظر العميل:{" "}
                <span className="font-bold text-red-600">{client.name}</span>
            </p>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                <Button
                    type="button"
                    color={"blue"}
                    disabled={post}
                    onClick={closeDrawer}
                    className="w-28 h-10 flex justify-center items-center me-4"
                >
                    لا
                </Button>
                <Button
                    type="button"
                    color={state ? "accent" : "failure"}
                    disabled={post}
                    onClick={block}
                    className="w-28 h-10 flex justify-center items-center"
                >
                    {state ? " إلغاء" : ""}حظر
                </Button>
            </div>
        </div>
    );
};

const Blocklist = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
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

    const handleDrawer = (client_block_state, client) => {
        showDrawer(
            client_block_state ? "إلغاء حظر عميل" : "حظر عميل",
            client_block_state ? IoAccessibility : MdBlock,
            <ConfirmBlock
                client={client}
                state={client_block_state}
                closeDrawer={closeDrawer}
                callBack={() => {
                    setSearchParam(null);
                    setPageNumber(null);
                    get_current_clients();
                }}
            />
        );
    };

    const get_current_clients = () => {
        const searchURL = `${endpoints.client_list}${
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

    useEffect(() => {
        if (permissions.view) {
            get_current_clients();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* table data */}
            {permissions.view ? (
                <ViewGroup title={"العملاء الحاليين"}>
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
                                                اسم العميل
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                كود العميل
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                رقم الهوية
                                            </Table.HeadCell>
                                            <Table.HeadCell className="text-center">
                                                محظور
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
                                                        <Table.Cell>
                                                            {client.id ? (
                                                                client.id
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {client.national_id ? (
                                                                client.national_id
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell className="text-center">
                                                            <span>
                                                                {client.is_blocked
                                                                    ? "نعم"
                                                                    : "لا"}
                                                            </span>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {permissions.change && (
                                                                <Button
                                                                    color={
                                                                        client.is_blocked
                                                                            ? "accent"
                                                                            : "failure"
                                                                    }
                                                                    className="w-28 h-10 flex justify-center items-center"
                                                                    onClick={() => {
                                                                        handleDrawer(
                                                                            client.is_blocked,
                                                                            client
                                                                        );
                                                                    }}
                                                                >
                                                                    {client.is_blocked ? (
                                                                        <span>
                                                                            إلغاء
                                                                            حظر{" "}
                                                                        </span>
                                                                    ) : (
                                                                        <span>
                                                                            حظر
                                                                        </span>
                                                                    )}
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
                    title={"العملاء الحاليين"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Blocklist;
