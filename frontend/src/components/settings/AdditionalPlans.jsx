import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import {
    TextInput,
    Label,
    Table,
    Button,
    ToggleSwitch,
    Textarea,
} from "flowbite-react";
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
import { FaMoneyBill } from "react-icons/fa";
import { TbTimeDuration30 } from "react-icons/tb";
import { FaCircleStop } from "react-icons/fa6";

const AdditionalPlansForm = ({
    setToast,
    postURL,
    defaultValues,
    callBack,
}) => {
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
    const [isFreezable, setIsFreezable] = useState(
        formFunction === "edit" ? defaultValues?.freezable : true
    );

    const onSubmit = (data) => {
        setPost(true);

        if (isFreezable && data.freeze_no == "") {
            data.freeze_no = 0;
        }
        data = {
            name: data["name"],
            price: Number(data.price),
            description: data.description,
            days: data.days ? Number(data.days) : null,
            freezable: isFreezable,
            freeze_no: Number(data.freeze_no),
        };
        // console.log(data);
        // return;

        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة اشتراك إضافى جديد"
                        : "تم تعديل الاشتراك الإضافى"
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
            title={
                formFunction == "add"
                    ? "إضافة اشتراك إضافى"
                    : "تعديل اشتراك إضافى"
            }
            post={post}
            formFunction={formFunction}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="اسم الاشتراك :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
                    rightIcon={MdSubscriptions}
                    placeholder="اسم الاشتراك"
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
                    <Label htmlFor="price" value="السعر :" />
                </div>
                <TextInput
                    id="price"
                    type="number"
                    rightIcon={FaMoneyBill}
                    placeholder="السعر"
                    color={errors.price ? "failure" : "primary"}
                    {...register("price", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("price")}
                />
                {errors.price && (
                    <p className="error-message">{errors.price.message}</p>
                )}
            </div>

            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="days" value="مدة الاشتراك : (يوم)" />
                </div>
                <TextInput
                    id="days"
                    type="number"
                    defaultValue={30}
                    rightIcon={TbTimeDuration30}
                    placeholder="مدة الاشتراك"
                    color={errors.days ? "failure" : "primary"}
                    {...register("days", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("days")}
                />
                {errors.days && (
                    <p className="error-message">{errors.days.message}</p>
                )}
            </div>

            <div className="w-full flex items-center lg:max-w-md lg:w-[30%] min-h-[70px] lg:pt-5">
                <div className="mb-2 me-10 hidden">
                    <Label htmlFor="freezable" value="اشتراك قابل للتعليق :" />
                </div>
                <ToggleSwitch
                    id="freezable"
                    checked={isFreezable}
                    onChange={setIsFreezable}
                    label="اشتراك قابل للتعليق"
                    sizing={"lg"}
                    color={"primary"}
                />
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label
                        className={`${isFreezable ? "" : "text-gray-400"}`}
                        htmlFor="freeze_no"
                        value="مدة التعليق : (يوم)"
                    />
                </div>
                <TextInput
                    id="freeze_no"
                    type="number"
                    defaultValue={7}
                    rightIcon={FaCircleStop}
                    placeholder="مدة التعليق"
                    color={errors.freeze_no ? "failure" : "primary"}
                    {...register("freeze_no", {})}
                    onBlur={() => trigger("freeze_no")}
                    disabled={!isFreezable}
                />
                {errors.freeze_no && (
                    <p className="error-message">{errors.freeze_no.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="description" value="إضافة وصف :" />
                </div>
                <Textarea
                    id="description"
                    placeholder="وصف"
                    color={"primary"}
                    {...register("description", {})}
                    rows={3}
                />

                {errors.description && (
                    <p className="error-message">
                        {errors.description.message}
                    </p>
                )}
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
                setToast("تم حذف الاشتراك بنجاح");
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
                هل أنت متأكد تريد حذف الاشتراك:{" "}
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

const AdditionalPlans = () => {
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

    const showDrawer = (drawerFunction, subscription) => {
        if (drawerFunction == "edit") {
            setDrawerData({
                title: "تعديل اشتراك",
                icon: MdEdit,
                content: (
                    <AdditionalPlansForm
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
                title: "حذف اشتراك",
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
        const searchURL = `${endpoints.additional_plan_list}${
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
            <AdditionalPlansForm
                setToast={setToast}
                postURL={endpoints.additional_plan_list}
                callBack={fetchListData}
            />

            {/* table data */}
            <ViewGroup title={"الاشتراكات الحالية"}>
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
                                            اسم الاشتراك
                                        </Table.HeadCell>
                                        <Table.HeadCell>السعر</Table.HeadCell>
                                        <Table.HeadCell>الفترة</Table.HeadCell>
                                        <Table.HeadCell>إجراءات</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {data.results.map((subscription) => {
                                            return (
                                                <Table.Row
                                                    key={subscription.id}
                                                    className="bg-white font-medium text-gray-900"
                                                >
                                                    <Table.Cell>
                                                        {subscription.name ? (
                                                            subscription.name
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {subscription.price ? (
                                                            subscription.price
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {subscription.days ? (
                                                            <span className="text-sm">
                                                                {
                                                                    subscription.days
                                                                }{" "}
                                                                {subscription.days >
                                                                9
                                                                    ? "يوم"
                                                                    : "أيام"}
                                                            </span>
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
                                                                        subscription
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        subscription
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

export default AdditionalPlans;
