import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import EmployeeSettingsForm from "./EmployeeSettingsForm";
import { fetch_list_data } from "../../../config/actions";
import ConfirmDelete from "../../groups/ConfirmDelete";
import ErrorGroup from "../../groups/ErrorGroup";
import { usePermission } from "../../../providers/PermissionProvider";
import { useDrawer } from "../../../providers/DrawerProvider";

const EmployeeSettings = () => {
    //////////////////////////////// form settings ////////////////////////////////
    const [currentSetting, setCurrentSetting] = useState({
        name: "الجنسية",
        list_url: endpoints.nationality_list,
    });
    
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { has_permission } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const [app_label, model_name, perm_name] = [
        "users",
        "employeetype",
        "employeesettings",
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
                "تعديل بند",
                MdEdit,
                <EmployeeSettingsForm
                    currentSetting={currentSetting}
                    setCurrentSetting={setCurrentSetting}
                    postURL={item.url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_items();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف بند",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف البند"}
                        itemName={item.name}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_items();
                        }}
                        toastMessage={"تم حذف البند بنجاح"}
                    />
                </>
            );
        }
    };

    const get_current_items = () => {
        const searchURL = `${currentSetting.list_url}${
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
            get_current_items();
        }
    }, [searchParam, pageNumber, currentSetting]);

    return (
        <>
            {/* add form */}
            {has_permission(
                `${app_label}.${model_name}`,
                `add_${perm_name}`
            ) ? (
                <EmployeeSettingsForm
                    currentSetting={currentSetting}
                    setCurrentSetting={setCurrentSetting}
                    postURL={currentSetting.list_url}
                    callBack={get_current_items}
                />
            ) : (
                <ErrorGroup
                    title={"إضافة اختيارات بنود الموظفين"}
                    message={"ليس لديك صلاحية"}
                />
            )}

            {/* table data */}
            {has_permission(
                `${app_label}.${model_name}`,
                `view_${perm_name}`
            ) ? (
                <ViewGroup title={`اختيارات ${currentSetting.name} الحالية`}>
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
                                                الاسم
                                            </Table.HeadCell>
                                            {currentSetting.value ===
                                                "city-district" && (
                                                <Table.HeadCell>
                                                    المدينة التابع لها
                                                </Table.HeadCell>
                                            )}
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((item) => {
                                                return (
                                                    <Table.Row
                                                        key={item.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {item.name ? (
                                                                item.name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        {currentSetting.value ===
                                                            "city-district" && (
                                                            <Table.Cell>
                                                                {item.city
                                                                    ?.name ? (
                                                                    item.city
                                                                        .name
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                        )}
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
                                                                                item
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
                                                                                item
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
                    title={`اختيارات ${currentSetting.name} الحالية`}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default EmployeeSettings;
