import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import ModeratorsForm from "./ModeratorsForm";
import ConfirmDelete from "../../groups/ConfirmDelete";
import { usePermission } from "../../../providers/PermissionProvider";
import { useDrawer } from "../../../providers/DrawerProvider";
import ErrorGroup from "../../groups/ErrorGroup";
import { fetch_list_data } from "../../../config/actions";

const Moderators = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { has_permission } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const [app_label, model_name, perm_name] = [
        "users",
        "moderator",
        "moderator",
    ];

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleDrawer = (drawerFunction, item) => {
        if (drawerFunction == "edit") {
            showDrawer(
                "تعديل مشرف",
                MdEdit,
                <ModeratorsForm
                    postURL={item.url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_moderators();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف مشرف",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف المشرف"}
                        itemName={item.username}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_moderators();
                        }}
                        toastMessage={"تم حذف المشرف بنجاح"}
                    />
                </>
            );
        }
    };

    const get_current_moderators = () => {
        const searchURL = `${endpoints.moderator_list}${
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
        if (has_permission(`${app_label}.${model_name}`, `view_${perm_name}`)) {
            get_current_moderators();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* add form */}
            {has_permission(
                `${app_label}.${model_name}`,
                `add_${perm_name}`
            ) ? (
                <ModeratorsForm
                    postURL={endpoints.moderator_list}
                    callBack={fetch_list_data}
                />
            ) : (
                <ErrorGroup title={"إضافة مشرف"} message={"ليس لديك صلاحية"} />
            )}

            {/* table data */}
            {has_permission(
                `${app_label}.${model_name}`,
                `view_${perm_name}`
            ) ? (
                <ViewGroup title={"المشرفين الحاليين"}>
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
                                                اسم المشرف
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                اسم المستخدم
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                رقم الهوية
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                رقم الهاتف
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((moderator) => {
                                                return (
                                                    <Table.Row
                                                        key={moderator.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {moderator.employee
                                                                .name ? (
                                                                moderator
                                                                    .employee
                                                                    .name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {moderator.user
                                                                .username ? (
                                                                moderator.user
                                                                    .username
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {moderator.employee
                                                                .national_id ? (
                                                                moderator
                                                                    .employee
                                                                    .national_id
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {moderator.employee
                                                                .phone ? (
                                                                moderator
                                                                    .employee
                                                                    .phone
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <span className="flex text-xl gap-x-3">
                                                                {has_permission(
                                                                    `${app_label}.${model_name}`,
                                                                    `change_${perm_name}`
                                                                ) && (
                                                                    <MdEdit
                                                                        className="text-accent cursor-pointer"
                                                                        onClick={() => {
                                                                            handleDrawer(
                                                                                "edit",
                                                                                moderator
                                                                            );
                                                                        }}
                                                                    />
                                                                )}
                                                                {has_permission(
                                                                    `${app_label}.${model_name}`,
                                                                    `delete_${perm_name}`
                                                                ) && (
                                                                    <MdDelete
                                                                        className="text-secondary cursor-pointer"
                                                                        onClick={() => {
                                                                            handleDrawer(
                                                                                "delete",
                                                                                moderator
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
                                    onPageChange={(page) => setPageNumber(page)}
                                />
                            )}
                        </>
                    )}
                </ViewGroup>
            ) : (
                <ErrorGroup
                    title={"المشرفين الحاليين"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Moderators;
