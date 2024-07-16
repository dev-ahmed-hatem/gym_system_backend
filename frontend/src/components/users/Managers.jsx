import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import { TextInput, Label, Table, Button } from "flowbite-react";
import { HiLockClosed, HiDeviceMobile, HiUser } from "react-icons/hi";
import Loading from "../groups/Loading";
import { HiMiniIdentification } from "react-icons/hi2";
import axios from "axios";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import { useForm } from "react-hook-form";
import Notification from "../groups/Notification";
import { MdEdit, MdDelete } from "react-icons/md";
import DrawerHeader from "../groups/DrawerHeader";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../../config";

const ManagersForm = ({ setToast, postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
        setError,
        clearErrors,
        reset,
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
        data["is_superuser"] = true;
        setPost(true);
        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة مدير جديد"
                        : "تم تعديل المدير"
                );
                reset();
                callBack();
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const serverErrors = error.response.data;
                    for (let field in serverErrors) {
                        const message =
                            serverErrors[field][0].search("exists") == -1
                                ? "قيمة غير صالحة"
                                : "القيمة موجودة سابقا";
                        setError(field, {
                            type: "server",
                            message: message,
                        });
                    }
                }
                setPost(false);
            });
    };
    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة مدير" : "تعديل مدير"}
            formFunction={formFunction}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="اسم المدير :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
                    rightIcon={HiUser}
                    placeholder="اسم المدير"
                    color={errors.name ? "failure" : "primary"}
                    {...register("name", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("name")}
                />

                {errors.name && (
                    <p className="error-message">{errors.name.message}</p>
                )}
            </div>
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
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="mobile" value="رقم الهاتف :" />
                </div>
                <TextInput
                    id="mobile"
                    type="tel"
                    rightIcon={HiDeviceMobile}
                    placeholder="رقم الهاتف"
                    color={errors.phone ? "failure" : "primary"}
                    {...register("phone", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "رقم الموبايل لا يحتوى على حروف",
                        },
                    })}
                    onBlur={() => trigger("phone")}
                />
                {errors.phone && (
                    <p className="error-message">{errors.phone.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="id-num" value="رقم الهوية :" />
                </div>
                <TextInput
                    id="id-num"
                    type="text"
                    rightIcon={HiMiniIdentification}
                    placeholder="رقم الهوية"
                    color={errors.national_id ? "failure" : "primary"}
                    {...register("national_id", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "رقم الهوية لا يحتوى على حروف",
                        },
                    })}
                    onBlur={() => trigger("national_id")}
                />
                {errors.national_id && (
                    <p className="error-message">
                        {errors.national_id.message}
                    </p>
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
                setToast("تم حذف المدير بنجاح");
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
                هل أنت متأكد تريد حذف المدير:{" "}
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

const Managers = () => {
    //////////////////////////////// form settings ////////////////////////////////

    //////////////////////////////// drawer settings ////////////////////////////////
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState(null);

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchEror, setFetchError] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const showDrawer = (drawerFunction, userdata) => {
        if (drawerFunction == "edit") {
            setDrawerData({
                title: "تعديل مدير",
                icon: MdEdit,
                content: (
                    <ManagersForm
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
                title: "حذف مدير",
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
        const searchURL = `${endpoints.manager_list}${
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
            <ManagersForm
                setToast={setToast}
                postURL={endpoints.manager_list}
                callBack={fetchListData}
            />

            {/* table data */}
            <ViewGroup title={"المديرين الحاليين"}>
                {loading ? (
                    <Loading />
                ) : fetchEror ? (
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
                                            اسم المدير
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
                                        {data.results.map((user) => {
                                            return (
                                                <Table.Row
                                                    key={user.id}
                                                    className="bg-white font-medium text-gray-900"
                                                >
                                                    <Table.Cell>
                                                        {user.name ? (
                                                            user.name
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {user.username ? (
                                                            user.username
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {user.national_id ? (
                                                            user.national_id
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {user.phone ? (
                                                            user.phone
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
                                                                        user
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        user
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

export default Managers;
