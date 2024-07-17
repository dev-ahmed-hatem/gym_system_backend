import React, { useState, useEffect, useRef } from "react";
import FormGroup from "../groups/FormGroup";
import { TextInput, Label, Table, Button } from "flowbite-react";
import { HiLockClosed, HiUser } from "react-icons/hi";
import Loading from "../groups/Loading";
import axios from "axios";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import { useForm, Controller } from "react-hook-form";
import Notification from "../groups/Notification";
import { MdEdit, MdDelete } from "react-icons/md";
import DrawerHeader from "../groups/DrawerHeader";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../../config";
import Select from "react-select";

const ModeratorsForm = ({ setToast, postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const [employeesList, setEmployeesList] = useState(null);
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
        setError,
        clearErrors,
        reset,
        control,
    } = useForm({ defaultValues: defaultValues });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.put;
    const password = watch("password");
    const password2 = watch("password2");

    useEffect(() => {
        if (password2) {
            if (password !== password2) {
                setError("password2", {
                    type: "manual",
                    message: "كلمة مرور غير متطابقة",
                });
            } else {
                clearErrors("password2");
            }
        }
    }, [password, password2]);

    const onSubmit = (data) => {
        data = {
            user: {
                username: data.username,
                password: data.password,
                password2: data.password2,
                is_moderator: true,
            },
            employee: data.employee.value,
        };
        console.log(data);

        setPost(true);
        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة مشرف جديد"
                        : "تم تعديل المشرف"
                );
                reset();
                callBack();
            })
            .catch((error) => {
                console.log(error);
                // handle possible errors
                if (error.response && error.response.data) {
                    const serverErrors = error.response.data;
                    if (serverErrors.user?.username) {
                        const message =
                            serverErrors.user.username[0].search("exists") == -1
                                ? "قيمة غير صالحة"
                                : "اسم المستخدم موجود سابقا";
                        setError("username", {
                            type: "server",
                            message: message,
                        });
                    }
                    if (
                        serverErrors.user?.password ||
                        serverErrors.user?.password2
                    ) {
                        setError("password", {
                            type: "server",
                            message: "كلمة مرور غير متطابقة",
                        });
                        setError("password2", {
                            type: "server",
                            message: "كلمة مرور غير متطابقة",
                        });
                    }
                    if (serverErrors.employee) {
                        setError("employee", {
                            type: "server",
                            message: "هذا الموظف لديه حساب مشرف مسبق",
                        });
                    }
                }
                setPost(false);
            });
    };

    const fetchEmployees = (search_word) => {
        const options = [];
        const url = `${endpoints.employee_list}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((employee) => {
                    options.push({ value: employee.id, label: employee.name });
                });
                setEmployeesList(options);
            })
            .catch((error) => {
                setEmployeesList(null);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة مشرف" : "تعديل مشرف"}
            formFunction={formFunction}
            post={post}
        >
            {formFunction === "add" && (
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="اختر موظف :" />
                    </div>

                    <Controller
                        name="employee"
                        control={control}
                        rules={{ required: "يجب اختيار موظف" }}
                        render={({ field }) => (
                            <>
                                <Select
                                    noOptionsMessage={() =>
                                        "لا يوجد نتائج مطابقة"
                                    }
                                    placeholder="بحث ..."
                                    options={employeesList || []}
                                    onInputChange={fetchEmployees}
                                    value={field.value}
                                    onBlur={() => {
                                        trigger("employee");
                                    }}
                                    {...field}
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.employee
                                                ? "red"
                                                : base.borderColor,
                                            color: errors.employee
                                                ? "red"
                                                : base.color,
                                            "&:hover": {
                                                borderColor: errors.employee
                                                    ? "red"
                                                    : base["&:hover"]
                                                          .borderColor,
                                            },
                                            boxShadow: state.isFocused
                                                ? errors.employee
                                                    ? "0 0 0 1px red"
                                                    : "0 0 0 1px blue"
                                                : base.boxShadow,
                                        }),
                                        placeholder: (base, state) => ({
                                            ...base,
                                            color: errors.employee
                                                ? "red"
                                                : base.color,
                                        }),
                                    }}
                                ></Select>
                                {errors.employee && (
                                    <p className="error-message">
                                        {errors.employee.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>
            )}
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label
                        htmlFor="username"
                        value="اسم المستخدم : (يستخدم لتسجيل الدخول)"
                    />
                </div>
                <TextInput
                    id="username"
                    type="text"
                    rightIcon={HiUser}
                    placeholder="اسم المستخدم"
                    color={errors.username ? "failure" : "primary"}
                    {...register("username", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[\w.@+-]+$/,
                            message: "اسم المستخدم غير مناسب",
                        },
                    })}
                    onBlur={() => trigger("username")}
                />
                {errors.username && (
                    <p className="error-message">{errors.username.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="pass" value="كلمة المرور :" />
                </div>
                <TextInput
                    id="pass"
                    type="password"
                    rightIcon={HiLockClosed}
                    placeholder="كلمة المرور"
                    color={errors.password ? "failure" : "primary"}
                    {...register("password", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("password")}
                />
                {errors.password && (
                    <p className="error-message">{errors.password.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="pass2" value="تأكيد كلمة المرور :" />
                </div>
                <TextInput
                    id="pass2"
                    type="password"
                    rightIcon={HiLockClosed}
                    placeholder="تأكيد كلمة المرور"
                    color={errors.password2 ? "failure" : "primary"}
                    {...register("password2", {
                        required: "هذا الحقل مطلوب",
                        validate: (value) =>
                            value === password || "كلمة مرور غير متطابقة",
                    })}
                    onBlur={() => trigger("password2")}
                />
                {errors.password2 && (
                    <p className="error-message">{errors.password2.message}</p>
                )}
            </div>
        </FormGroup>
    );
};

const ConfirmDelete = ({ user, closeDrawer, setToast, callBack }) => {
    const [post, setPost] = useState(false);

    const deleteManager = () => {
        setPost(true);
        axios
            .delete(user.url)
            .then(() => {
                setToast("تم حذف المشرف بنجاح");
                callBack();
                closeDrawer();
            })
            .catch((error) => {
                setPost(false);
            });
    };

    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <p className="text-base">
                هل أنت متأكد تريد حذف المشرف:{" "}
                <span className="font-bold text-red-600">{user.username}</span>
            </p>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                <Button
                    type="button"
                    color={"blue"}
                    className="me-4"
                    disabled={post}
                    onClick={closeDrawer}
                >
                    إلغاء
                </Button>
                <Button
                    type="button"
                    color={"failure"}
                    disabled={post}
                    onClick={deleteManager}
                >
                    حذف
                </Button>
            </div>
        </div>
    );
};

const Moderators = () => {
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

    const showDrawer = (drawerFunction, userdata) => {
        if (drawerFunction == "edit") {
            setDrawerData({
                title: "تعديل مشرف",
                icon: MdEdit,
                content: (
                    <ModeratorsForm
                        setToast={setToast}
                        postURL={userdata.url}
                        defaultValues={userdata}
                        callBack={() => {
                            fetchListData();
                            closeDrawer();
                        }}
                    />
                ),
            });
        } else {
            setDrawerData({
                title: "حذف مشرف",
                icon: MdDelete,
                content: (
                    <ConfirmDelete
                        user={userdata}
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
        const searchURL = `${endpoints.moderator_list}${
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

            {/* add form */}
            <ModeratorsForm
                setToast={setToast}
                postURL={endpoints.moderator_list}
                callBack={fetchListData}
            />

            {/* table data */}
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
                                        <Table.Cell>لا توجد بيانات</Table.Cell>
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
                                        <Table.HeadCell>إجراءات</Table.HeadCell>
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
                                                            moderator.employee
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
                                                            moderator.employee
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
                                                            moderator.employee
                                                                .phone
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <span className="flex text-xl gap-x-3">
                                                            <MdEdit
                                                                className="text-accent cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "edit",
                                                                        moderator
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        moderator
                                                                    );
                                                                }}
                                                            />
                                                        </span>
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

export default Moderators;
