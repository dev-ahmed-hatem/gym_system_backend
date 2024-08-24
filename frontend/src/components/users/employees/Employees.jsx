import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import EmployeesForm from "./EmployeesForm";
import { fetch_list_data } from "../../../config/actions";
import { useDrawer } from "../../../providers/DrawerProvider";
import { usePermission } from "../../../providers/PermissionProvider";
import ConfirmDelete from "../../groups/ConfirmDelete";
import ErrorGroup from "../../groups/ErrorGroup";

const Employees = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { has_permission } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const [app_label, model_name, perm_name] = [
        "users",
        "employee",
        "employee",
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
                "تعديل موظف",
                MdEdit,
                <EmployeesForm
                    postURL={item.url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_employees();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف موظف",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف الموظف"}
                        itemName={item.name}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_employees();
                        }}
                        toastMessage={"تم حذف الموظف بنجاح"}
                    />
                </>
            );
        }
    };

    const get_current_employees = () => {
        const searchURL = `${endpoints.employee_list}${
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
            get_current_employees();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* add form */}
            {has_permission(
                `${app_label}.${model_name}`,
                `add_${perm_name}`
            ) ? (
                <EmployeesForm
                    postURL={endpoints.employee_list}
                    callBack={get_current_employees}
                />
            ) : (
                <ErrorGroup title={"إضافة موظف"} message={"ليس لديك صلاحية"} />
            )}

            {/* table data */}
            {has_permission(
                `${app_label}.${model_name}`,
                `view_${perm_name}`
            ) ? (
                <ViewGroup title={"الموظفين الحاليين"}>
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
                                    setPageNumber(1);
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
                                                اسم الموظف
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                نوع الموظف
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                رقم الهوية
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                رقم الهاتف
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الجنسية
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((employee) => {
                                                return (
                                                    <Table.Row
                                                        key={employee.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {employee.name ? (
                                                                employee.name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {employee.emp_type ? (
                                                                employee
                                                                    .emp_type
                                                                    .name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {employee.national_id ? (
                                                                employee.national_id
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {employee.phone ? (
                                                                employee.phone
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {employee.nationality ? (
                                                                employee
                                                                    .nationality
                                                                    .name
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
                                                                                employee
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
                                                                                employee
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
                    title={"الموظفين الحاليين"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Employees;
