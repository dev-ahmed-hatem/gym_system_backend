import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import {
    TextInput,
    Label,
    Table,
    Button,
    Select as FlowbiteSelect,
} from "flowbite-react";
import Select from "react-select";
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

const EmployeeSettingsForm = ({
    setToast,
    postURL,
    currentSetting,
    setCurrentSetting,
    defaultValues,
    callBack,
}) => {
    const [post, setPost] = useState(false);
    const [citiesList, setCitiesList] = useState(null);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
        control,
    } = useForm({ defaultValues: defaultValues });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.put;

    const changeCurrentSetting = (event) => {
        switch (event.target.value) {
            case "nationality":
                setCurrentSetting({
                    value: "nationality",
                    name: "الجنسية",
                    list_url: endpoints.nationality_list,
                });
                break;
            case "marital-status":
                setCurrentSetting({
                    value: "marital-status",
                    name: "الحالة الاجتماعية",
                    list_url: endpoints.marital_status_list,
                });
                break;
            case "employee-type":
                setCurrentSetting({
                    value: "employee-type",
                    name: "نوع الموظف",
                    list_url: endpoints.employee_type_list,
                });
                break;
            case "city":
                setCurrentSetting({
                    value: "city",
                    name: "المدينة",
                    list_url: endpoints.city_list,
                });
                break;
            case "city-district":
                setCurrentSetting({
                    value: "city-district",
                    name: "الحى",
                    list_url: endpoints.city_district_list,
                });
                fetchCities();
                break;
        }
    };

    const onSubmit = (data) => {
        setPost(true);

        if (currentSetting.value === "city-district") {
            data.city = data.city.value;
        }

        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة بند جديد"
                        : "تم تعديل البند"
                );
                callBack();
                reset();
                setCurrentSetting(currentSetting);
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

    const fetchCities = (search_word) => {
        const options = [];
        const url = `${endpoints.city_list}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((city) => {
                    options.push({ value: city.id, label: city.name });
                });
                setCitiesList(options);
            })
            .catch((error) => {
                setCitiesList(null);
            });
    };

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={
                formFunction == "add"
                    ? "إضافة اختيارات بنود الموظفين"
                    : "تعديل بند"
            }
            post={post}
            formFunction={formFunction}
        >
            {formFunction === "add" && (
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="options" value="اختيارات :" />
                    </div>
                    <FlowbiteSelect
                        id="options"
                        type="select"
                        color={"primary"}
                        onChange={changeCurrentSetting}
                        value={currentSetting.value}
                    >
                        <option value={"nationality"} key={0}>
                            الجنسية
                        </option>
                        <option value={"marital-status"} key={1}>
                            الحالة الاجتماعية
                        </option>
                        <option value={"employee-type"} key={2}>
                            نوع الموظف
                        </option>
                        <option value={"city"} key={3}>
                            المدينة
                        </option>
                        <option value={"city-district"} key={4}>
                            الحي
                        </option>
                    </FlowbiteSelect>
                    {errors.financial_type && (
                        <p className="error-message">
                            {errors.financial_type.message}
                        </p>
                    )}
                </div>
            )}

            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="الاسم :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
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

            {currentSetting.value === "city-district" && (
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label
                            htmlFor="city"
                            value="اختر المدينة التابع لها :"
                        />
                    </div>

                    <Controller
                        name="city"
                        control={control}
                        rules={{ required: "يجب اختيار مدينة" }}
                        render={({ field }) => (
                            <>
                                <Select
                                    noOptionsMessage={() =>
                                        "لا يوجد نتائج مطابقة"
                                    }
                                    placeholder="بحث ..."
                                    options={citiesList || []}
                                    onInputChange={fetchCities}
                                    value={field.value}
                                    onBlur={() => {
                                        trigger("city");
                                    }}
                                    {...field}
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderColor: errors.city
                                                ? "red"
                                                : base.borderColor,
                                            color: errors.city
                                                ? "red"
                                                : base.color,
                                            "&:hover": {
                                                borderColor: errors.city
                                                    ? "red"
                                                    : base["&:hover"]
                                                          .borderColor,
                                            },
                                            boxShadow: state.isFocused
                                                ? errors.city
                                                    ? "0 0 0 1px red"
                                                    : "0 0 0 1px blue"
                                                : base.boxShadow,
                                        }),
                                        placeholder: (base, state) => ({
                                            ...base,
                                            color: errors.city
                                                ? "red"
                                                : base.color,
                                        }),
                                    }}
                                ></Select>
                                {errors.city && (
                                    <p className="error-message">
                                        {errors.city.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>
            )}
        </FormGroup>
    );
};

const ConfirmDelete = ({ item, closeDrawer, setToast, callBack }) => {
    const [post, setPost] = useState(false);

    const deleteItem = () => {
        setPost(true);
        axios
            .delete(item.url)
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
                <span className="font-bold text-red-600">{item.name}</span>
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
                    onClick={deleteItem}
                >
                    حذف
                </Button>
            </div>
        </div>
    );
};

const EmployeeSettings = () => {
    //////////////////////////////// form settings ////////////////////////////////
    const [currentSetting, setCurrentSetting] = useState({
        name: "الجنسية",
        list_url: endpoints.nationality_list,
    });

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

    const showDrawer = (drawerFunction, item) => {
        if (drawerFunction == "edit") {
            setDrawerData({
                title: "تعديل بند",
                icon: MdEdit,
                content: (
                    <EmployeeSettingsForm
                        currentSetting={currentSetting}
                        setCurrentSetting={setCurrentSetting}
                        setToast={setToast}
                        postURL={item.url}
                        defaultValues={item}
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
                        item={item}
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
        const searchURL = `${currentSetting.list_url}${
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
    }, [searchParam, pageNumber, currentSetting]);

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
            <EmployeeSettingsForm
                currentSetting={currentSetting}
                setCurrentSetting={setCurrentSetting}
                setToast={setToast}
                postURL={currentSetting.list_url}
                callBack={fetchListData}
            />

            {/* table data */}
            <ViewGroup title={`اختيارات ${currentSetting.name} الحالية`}>
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
                                        <Table.HeadCell>الاسم</Table.HeadCell>
                                        {currentSetting.value ===
                                            "city-district" && (
                                            <Table.HeadCell>
                                                المدينة التابع لها
                                            </Table.HeadCell>
                                        )}
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
                                                    {currentSetting.value ===
                                                        "city-district" && (
                                                        <Table.Cell>
                                                            {item.city?.name ? (
                                                                item.city.name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                    )}
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

export default EmployeeSettings;
