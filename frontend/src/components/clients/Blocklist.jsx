import React, { useState, useEffect } from "react";
import { Table, Button } from "flowbite-react";
import Loading from "../groups/Loading";
import axios from "axios";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import Notification from "../groups/Notification";
import { MdBlock } from "react-icons/md";
import DrawerHeader from "../groups/DrawerHeader";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../../config";
import { IoAccessibility } from "react-icons/io5";

const ConfirmBlock = ({ client, state, closeDrawer, setToast, callBack }) => {
    const [post, setPost] = useState(false);

    const block = () => {
        const data = { is_blocked: !state };
        setPost(true);
        axios
            .patch(client.url, data)
            .then(() => {
                setToast(`تم ${state ? "إلغاء" : ""} حظر العميل بنجاح`);
                callBack();
                closeDrawer();
            })
            .catch((error) => {
                console.log(error);
                setPost(false);
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
    //////////////////////////////// form settings ////////////////////////////////

    //////////////////////////////// drawer settings ////////////////////////////////
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState(null);

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const showDrawer = (client_block_state, client) => {
        {
            setDrawerData({
                title: client_block_state ? "إلغاء حظر عميل" : "حظر عميل",
                icon: client_block_state ? IoAccessibility : MdBlock,
                content: (
                    <ConfirmBlock
                        client={client}
                        state={client_block_state}
                        closeDrawer={closeDrawer}
                        setToast={setToast}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            fetchListData();
                        }}
                    />
                ),
            });
        }
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerData(null);
        setDrawerOpen(false);
    };

    const changePage = (page) => {
        setPageNumber(page);
    };

    const fetchListData = () => {
        const searchURL = `${endpoints.client_list}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}
        `;
        axios
            .get(searchURL)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((fetchError) => {
                setFetchError(fetchError);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchListData();
    }, [searchParam, pageNumber]);

    return (
        <>
            {/*  notification */}
            {toast && <Notification setToast={setToast} title={toast} />}

            {/* drawer */}
            {{ drawerOpen } && (
                <DrawerHeader
                    title={drawerData?.title}
                    openState={drawerOpen}
                    setOpenState={setDrawerOpen}
                    icon={drawerData?.icon}
                    handleClose={closeDrawer}
                >
                    {drawerData?.content}
                </DrawerHeader>
            )}

            {/* table data */}
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
                                        <Table.Cell>لا توجد بيانات</Table.Cell>
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
                                        <Table.HeadCell>محظور</Table.HeadCell>
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
                                                    <Table.Cell>
                                                        {client.is_blocked ? (
                                                            <span>نعم</span>
                                                        ) : (
                                                            <span>لا</span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <Button
                                                            color={
                                                                client.is_blocked
                                                                    ? "accent"
                                                                    : "failure"
                                                            }
                                                            className="w-28 h-10 flex justify-center items-center"
                                                            onClick={() => {
                                                                showDrawer(
                                                                    client.is_blocked,
                                                                    client
                                                                );
                                                            }}
                                                        >
                                                            {client.is_blocked ? (
                                                                <span>
                                                                    إلغاء حظر{" "}
                                                                </span>
                                                            ) : (
                                                                <span>حظر</span>
                                                            )}
                                                        </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </>
                            )}
                        </TableGroup>

                        {data.total_pages > 1 ? (
                            <TablePagination
                                totalPages={data.total_pages}
                                currentPage={data.current_page}
                                onPageChange={changePage}
                            />
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </ViewGroup>
        </>
    );
};

export default Blocklist;
