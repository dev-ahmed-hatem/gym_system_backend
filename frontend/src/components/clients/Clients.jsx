import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import {
    TextInput,
    Label,
    Table,
    Button,
    Select as FlowbiteSelect,
    Datepicker,
} from "flowbite-react";
import { HiDeviceMobile, HiUser } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import Loading from "../groups/Loading";
import { HiMiniIdentification } from "react-icons/hi2";
import axios from "axios";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import { useForm, Controller } from "react-hook-form";
import Notification from "../groups/Notification";
import { MdEdit, MdDelete, MdEmail } from "react-icons/md";
import DrawerHeader from "../groups/DrawerHeader";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../config/config";
import { FaAddressCard } from "react-icons/fa";
import CustomFileInput from "../groups/CustomFileInput";
import Select from "react-select";
import style from "../../assets/rect-select-style";

const ClientsForm = ({ setToast, postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const [age, setAge] = useState(defaultValues?.age);
    const [selectedFile, setSelectedFile] = useState(null);
    const [trainersList, setTrainersList] = useState(null);
    const [subscriptionsList, setSubscriptionsList] = useState(null);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setValue,
        setError,
        clearErrors,
        reset,
        control,
    } = useForm({ defaultValues });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.patch;

    const calculateAge = (birth) => {
        const date = new Date(birth);
        const today = new Date();
        let clientAge = today.getFullYear() - date.getFullYear();

        // Check if the birthday has occurred this year
        const monthDifference = today.getMonth() - date.getMonth();
        const dayDifference = today.getDate() - date.getDate();

        // Adjust age if the birthday has not occurred yet this year
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && dayDifference < 0)
        ) {
            clientAge--;
        }

        setAge(clientAge);
    };

    const fetchTrainers = (search_word) => {
        const options = [];
        const url = `${endpoints.employee_list}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((trainer) => {
                    options.push({
                        value: trainer.id,
                        label: `${trainer.name} ${
                            trainer?.emp_type?.name
                                ? `(${trainer.emp_type.name})`
                                : ""
                        }`,
                    });
                });
                setTrainersList(options);
            })
            .catch((error) => {
                setTrainersList(null);
            });
    };

    const fetchSubscriptions = (search_word) => {
        const options = [];
        const url = `${endpoints.subscription_plan_list}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((subscription) => {
                    options.push({
                        value: subscription.id,
                        label: subscription.name,
                    });
                });
                setSubscriptionsList(options);
            })
            .catch((error) => {
                setSubscriptionsList(null);
            });
    };

    useEffect(() => {
        fetchTrainers();
        fetchSubscriptions();
    }, []);

    const onSubmit = (data) => {
        if (age) data["age"] = age;

        // check whether photo is a valid
        if (!(data["photo"] instanceof File)) {
            delete data["photo"];
        }

        //  validate trainer
        if (data.trainer) {
            data.trainer = data.trainer.value;
        } else {
            data.trainer = null;
        }

        //  validate start date for current subscription
        if (data.subscription_plan) {
            data.subscription_plan = data.subscription_plan.value;
            if (!data.start_date) {
                data.start_date = new Date().toLocaleDateString("en-CA");
            }
        } else {
            data.subscription_plan = null;
        }

        setPost(true);

        requestMethod(postURL, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة عميل جديد"
                        : "تم تعديل العميل"
                );
                reset();
                clearErrors();
                callBack();
            })
            .catch((error) => {
                console.log(error);
                setPost(false);
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
            });
    };

    return (
        <>
            <FormGroup
                onSubmit={handleSubmit(onSubmit)}
                title={formFunction == "add" ? "إضافة عميل" : "تعديل عميل"}
                formFunction={formFunction}
                post={post}
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="اسم العميل :" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        rightIcon={HiUser}
                        placeholder="اسم العميل"
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
                        <Label htmlFor="mobile2" value="رقم الهاتف الإضافى :" />
                    </div>
                    <TextInput
                        id="mobile2"
                        type="tel"
                        rightIcon={HiDeviceMobile}
                        placeholder="رقم الهاتف الإضافى (اختيارى)"
                        color={errors.phone2 ? "failure" : "primary"}
                        {...register("phone2", {
                            pattern: {
                                value: /^[0-9]+$/,
                                message: "رقم الموبايل لا يحتوى على حروف",
                            },
                        })}
                        onBlur={() => trigger("phone2")}
                    />
                    {errors.phone2 && (
                        <p className="error-message">{errors.phone2.message}</p>
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
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="gander" value="النوع :" />
                    </div>
                    <FlowbiteSelect
                        id="gander"
                        type="select"
                        placeholder="النوع"
                        color={errors.gander ? "failure" : "primary"}
                        {...register("gander", {
                            required: "هذا الحقل مطلوب",
                        })}
                        onBlur={() => trigger("gander")}
                    >
                        <option value={"male"} key={0}>
                            ذكر
                        </option>
                        <option value={"female"} key={1}>
                            أنثى
                        </option>
                    </FlowbiteSelect>
                    {errors.gander && (
                        <p className="error-message">{errors.gander.message}</p>
                    )}
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="birth_date" value="تاريخ الميلاد :" />
                    </div>
                    <Controller
                        name="birth_date"
                        control={control}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="birth_date"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="تاريخ الميلاد"
                                color={"primary"}
                                onSelectedDateChanged={(date) => {
                                    calculateAge(date);
                                    field.onChange(
                                        date.toLocaleDateString("en-CA")
                                    );
                                }}
                                defaultDate={
                                    new Date(
                                        defaultValues?.birth_date ||
                                            "1970-01-01"
                                    )
                                }
                            />
                        )}
                    />
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="age" value="السن :" />
                    </div>
                    <TextInput
                        id="age"
                        type="number"
                        rightIcon={SlCalender}
                        color={errors.age ? "failure" : "primary"}
                        {...register("age", {})}
                        onBlur={() => trigger("age")}
                        value={age ? age : ""}
                        disabled
                    />
                    {errors.age && (
                        <p className="error-message">{errors.age.message}</p>
                    )}
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="email" value="البريد الالكترونى :" />
                    </div>
                    <TextInput
                        id="email"
                        type="email"
                        rightIcon={MdEmail}
                        color={errors.email ? "failure" : "primary"}
                        {...register("email", {
                            pattern: {
                                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                message: "بريد الكترونى غير صالح",
                            },
                        })}
                        placeholder="البريد الالكترونى"
                        onBlur={() => trigger("email")}
                    />
                    {errors.email && (
                        <p className="error-message">{errors.email.message}</p>
                    )}
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="address" value="العنوان :" />
                    </div>
                    <TextInput
                        id="address"
                        rightIcon={FaAddressCard}
                        color={"primary"}
                        {...register("address", {})}
                        placeholder="العنوان"
                    />
                </div>

                {formFunction === "add" && (
                    <>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label htmlFor="trainer" value="المدرب :" />
                            </div>

                            <Controller
                                name="trainer"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            isClearable
                                            noOptionsMessage={() =>
                                                "لا يوجد نتائج مطابقة"
                                            }
                                            placeholder="بحث ..."
                                            options={trainersList || []}
                                            onInputChange={fetchTrainers}
                                            value={field.value}
                                            onBlur={() => {
                                                trigger("trainer");
                                            }}
                                            {...field}
                                            styles={style(errors.trainer)}
                                        ></Select>
                                        {errors.trainer && (
                                            <p className="error-message">
                                                {errors.trainer.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="subscription_plan"
                                    value="اشتراك ابتدائى :"
                                />
                            </div>

                            <Controller
                                name="subscription_plan"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            isClearable
                                            noOptionsMessage={() =>
                                                "لا يوجد نتائج مطابقة"
                                            }
                                            placeholder="بحث ..."
                                            options={subscriptionsList || []}
                                            onInputChange={fetchSubscriptions}
                                            value={field.value}
                                            onBlur={() => {
                                                trigger("subscription_plan");
                                            }}
                                            {...field}
                                            styles={style(
                                                errors.subscription_plan
                                            )}
                                        ></Select>
                                        {errors.subscription_plan && (
                                            <p className="error-message">
                                                {
                                                    errors.subscription_plan
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="start_date"
                                    value="تاريخ بدأ الاشتراك :"
                                />
                            </div>
                            <Controller
                                name="start_date"
                                control={control}
                                render={({ field }) => (
                                    <Datepicker
                                        selected={field.value}
                                        id="start_date"
                                        language="ar"
                                        labelClearButton="مسح"
                                        labelTodayButton="اليوم"
                                        placeholder="تاريخ بدأ الاشتراك"
                                        color={"primary"}
                                        onSelectedDateChanged={(date) => {
                                            field.onChange(
                                                date.toLocaleDateString("en-CA")
                                            );
                                        }}
                                        defaultDate={new Date()}
                                    />
                                )}
                            />
                        </div>
                    </>
                )}

                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="photo" value="الصورة :" />
                    </div>
                    <CustomFileInput
                        register={register}
                        setValue={setValue}
                        name={"photo"}
                        error={errors.photo ? "صورة غير صالحة" : null}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        onBlur={() => {
                            trigger("photo");
                        }}
                    />
                </div>

                {formFunction === "edit" && (
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label value="الصورة الحالية :" />
                        </div>
                        {defaultValues?.photo ? (
                            <img
                                src={defaultValues.photo}
                                width={100}
                                height={100}
                                alt=""
                            />
                        ) : (
                            <p className="error-message">لا توجد صورة</p>
                        )}
                    </div>
                )}
            </FormGroup>
        </>
    );
};

const ConfirmDelete = ({ user, closeDrawer, setToast, callBack }) => {
    const [post, setPost] = useState(false);

    const deleteManager = () => {
        setPost(true);
        axios
            .delete(user.url)
            .then(() => {
                setToast("تم حذف العميل بنجاح");
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
                هل أنت متأكد تريد حذف العميل:{" "}
                <span className="font-bold text-red-600">{user.name}</span>
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

const Clients = () => {
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
                title: "تعديل عميل",
                icon: MdEdit,
                content: (
                    <ClientsForm
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
                title: "حذف عميل",
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

            {/* add form */}
            <ClientsForm
                setToast={setToast}
                postURL={endpoints.client_list}
                callBack={fetchListData}
            />

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
                                        <Table.HeadCell>
                                            رقم الهاتف
                                        </Table.HeadCell>
                                        <Table.HeadCell>إجراءات</Table.HeadCell>
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
                                                        {client.phone ? (
                                                            client.phone
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
                                                                        client
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        client
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

export default Clients;
