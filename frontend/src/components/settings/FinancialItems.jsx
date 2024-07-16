import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import { TextInput, Label, Table, Button, Select } from "flowbite-react";
import Loading from "../groups/Loading";
import axios from "axios";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import { useForm } from "react-hook-form";
import Notification from "../groups/Notification";
import { MdEdit, MdDelete, MdSubscriptions } from "react-icons/md";
import DrawerHeader from "../groups/DrawerHeader";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../../config";

const FinancialItemsForm = ({ setToast, postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm({ defaultValues: defaultValues });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.put;

    const onSubmit = (data) => {
        setPost(true);
        // console.log(data);
        // return;

        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة بند جديد"
                        : "تم تعديل البند"
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
            title={formFunction == "add" ? "إضافة بند جديد" : "تعديل بند"}
            buttonTitle={formFunction}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="اسم البند :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
                    rightIcon={MdSubscriptions}
                    placeholder="اسم البند"
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
                    <Label htmlFor="financial_type" value="النوع :" />
                </div>
                <Select
                    id="financial_type"
                    type="select"
                    placeholder="النوع"
                    color={errors.financial_type ? "failure" : "primary"}
                    {...register("financial_type", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("financial_type")}
                >
                    <option value={"expenses"} key={0}>
                        مصروفات
                    </option>
                    <option value={"incomes"} key={1}>
                        إيرادات
                    </option>
                </Select>
                {errors.financial_type && (
                    <p className="error-message">
                        {errors.financial_type.message}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                <Button
                    type="submit"
                    color={formFunction == "add" ? "primary" : "accent"}
                    disabled={post}
                >
                    {formFunction == "add" ? "إضافة" : "تعديل"}
                </Button>
            </div>
        </FormGroup>
    );
};

const ConfirmDelete = ({ subscription, closeDrawer, setToast, callBack }) => {
    const [post, setPost] = useState(false);

    const deleteSubscription = () => {
        setPost(true);
        axios
            .delete(subscription.url)
            .then(() => {
                setToast("تم حذف البند بنجاح");
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
                هل أنت متأكد تريد حذف البند:{" "}
                <span className="font-bold text-red-600">
                    {subscription.name}
                </span>
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
                    onClick={deleteSubscription}
                >
                    حذف
                </Button>
            </div>
        </div>
    );
};

const FinancialItems = () => {
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

    const showDrawer = (drawerFunction, subscription) => {
        if (drawerFunction == "edit") {
            setDrawerData({
                title: "تعديل بند",
                icon: MdEdit,
                content: (
                    <FinancialItemsForm
                        setToast={setToast}
                        postURL={subscription.url}
                        defaultValues={subscription}
                        callBack={() => {
                            fetchListData();
                            closeDrawer();
                        }}
                    />
                ),
            });
        } else {
            setDrawerData({
                title: "حذف بند",
                icon: MdDelete,
                content: (
                    <ConfirmDelete
                        subscription={subscription}
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
        const searchURL = `${endpoints.financial_item_list}${
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
            <FinancialItemsForm
                setToast={setToast}
                postURL={endpoints.financial_item_list}
                callBack={fetchListData}
            />

            {/* table data */}
            <ViewGroup title={"بنود المصروفات الحالية"}>
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
                                            اسم البند
                                        </Table.HeadCell>
                                        <Table.HeadCell>النوع</Table.HeadCell>
                                        <Table.HeadCell>إجراءات</Table.HeadCell>
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
                                                    <Table.Cell>
                                                        {item.financial_type ? (
                                                            item.financial_type ===
                                                            "expenses" ? (
                                                                "مصروفات"
                                                            ) : (
                                                                "إيرادات"
                                                            )
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
                                                                        item
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        item
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

export default FinancialItems;
