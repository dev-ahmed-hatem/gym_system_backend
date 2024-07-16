import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import {
    TextInput,
    Label,
    Table,
    Button,
    Select,
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
import endpoints from "../../../config";
import { FaAddressCard, FaPercentage } from "react-icons/fa";
import CustomFileInput from "../groups/CustomFileInput";

const EmployeesForm = ({ setToast, postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const [age, setAge] = useState(defaultValues?.age);
    const [selectedFile, setSelectedFile] = useState(null);
    const [employeeOptions, setEmployeeOptions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [currentCity, setCurrentCity] = useState(defaultValues?.city?.id);
    const [currentDistrict, setCurrentDistrict] = useState(
        defaultValues?.district?.id
    );

    const transformValues = (defaultValue) => {
        if (defaultValue) {
            const transformed_values = { ...defaultValue };
            const nested_fields = [
                "gander",
                "emp_type",
                "nationality",
                "religion",
                "marital_status",
                "city",
                "district",
            ];

            nested_fields.forEach((field) => {
                if (transformed_values[field] && transformed_values[field].id) {
                    transformed_values[field] = transformed_values[field].id;
                }
            });
            return transformed_values;
        }
    };

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setValue,
        setError,
        reset,
        control,
    } = useForm({ defaultValues: transformValues(defaultValues) });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.put;

    const calculateAge = (birth) => {
        const date = new Date(birth);
        const today = new Date();
        let employeeAge = today.getFullYear() - date.getFullYear();

        // Check if the birthday has occurred this year
        const monthDifference = today.getMonth() - date.getMonth();
        const dayDifference = today.getDate() - date.getDate();

        // Adjust age if the birthday has not occurred yet this year
        if (
            monthDifference < 0 ||
            (monthDifference === 0 && dayDifference < 0)
        ) {
            employeeAge--;
        }

        setAge(employeeAge);
    };

    const fetchEmployeeOptions = async () => {
        try {
            const [
                nationalityResponse,
                maritalStatusResponse,
                employeeTypeResponse,
                cityResponse,
                cityDistrictResponse,
            ] = await Promise.all([
                axios.get(endpoints.nationality_list),
                axios.get(endpoints.marital_status_list),
                axios.get(endpoints.employee_type_list),
                axios.get(endpoints.city_list),
                axios.get(endpoints.city_district_list),
            ]);

            const employee_options = {
                nationality_list: nationalityResponse.data.results,
                marital_status_list: maritalStatusResponse.data.results,
                employee_type_list: employeeTypeResponse.data.results,
                city_list: cityResponse.data.results,
                city_district_list: cityDistrictResponse.data.results,
            };

            setEmployeeOptions(employee_options);
        } catch (error) {
            console.log(error);
            setFetchError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeOptions();
    }, []);

    const onSubmit = (data) => {
        setPost(true);

        // check whether photo is a valid
        if (!(data["photo"] instanceof File)) {
            delete data["photo"];
        }

        data["city"] = Number(currentCity) || null;
        data["district"] = Number(currentDistrict) || null;

        if (age) data["age"] = age;
        // console.log(data);
        // return;

        requestMethod(postURL, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة موظف جديد"
                        : "تم تعديل الموظف"
                );
                reset();
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
                title={formFunction == "add" ? "إضافة موظف" : "تعديل موظف"}
                buttonTitle={formFunction}
                post={post}
            >
                {loading ? (
                    <Loading className={`w-full text-center`} />
                ) : fetchError ? (
                    <p className="text-lg text-center text-red-600 py-4 w-full m-auto">
                        خطأ في تحميل البيانات
                    </p>
                ) : (
                    <>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="اسم الموظف :" />
                            </div>
                            <TextInput
                                id="name"
                                type="text"
                                rightIcon={HiUser}
                                placeholder="اسم الموظف"
                                color={errors.name ? "failure" : "primary"}
                                {...register("name", {
                                    required: "هذا الحقل مطلوب",
                                })}
                                onBlur={() => trigger("name")}
                            />

                            {errors.name && (
                                <p className="error-message">
                                    {errors.name.message}
                                </p>
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
                                        message:
                                            "رقم الموبايل لا يحتوى على حروف",
                                    },
                                })}
                                onBlur={() => trigger("phone")}
                            />
                            {errors.phone && (
                                <p className="error-message">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="mobile2"
                                    value="رقم الهاتف الإضافى :"
                                />
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
                                        message:
                                            "رقم الموبايل لا يحتوى على حروف",
                                    },
                                })}
                                onBlur={() => trigger("phone2")}
                            />
                            {errors.phone2 && (
                                <p className="error-message">
                                    {errors.phone2.message}
                                </p>
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
                                color={
                                    errors.national_id ? "failure" : "primary"
                                }
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
                            <Select
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
                            </Select>
                            {errors.gander && (
                                <p className="error-message">
                                    {errors.gander.message}
                                </p>
                            )}
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="birth_date"
                                    value="تاريخ الميلاد :"
                                />
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
                                <p className="error-message">
                                    {errors.age.message}
                                </p>
                            )}
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="email"
                                    value="البريد الالكترونى :"
                                />
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
                                <p className="error-message">
                                    {errors.email.message}
                                </p>
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
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="subscription_percent"
                                    value="النسبة على الاشتراكات : (%)"
                                />
                            </div>
                            <TextInput
                                id="subscription_percent"
                                type="number"
                                rightIcon={FaPercentage}
                                placeholder="النسبة على الاشتراكات"
                                color={"primary"}
                                {...register("subscription_percent", {})}
                                defaultValue={0}
                            />
                            {errors.subscription_percent && (
                                <p className="error-message">
                                    {errors.subscription_percent.message}
                                </p>
                            )}
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="emp_type"
                                    value="نوع الموظف :"
                                />
                            </div>
                            <Select
                                id="emp_type"
                                type="select"
                                placeholder="نوع الموظف"
                                color={errors.emp_type ? "failure" : "primary"}
                                {...register("emp_type", {})}
                                onBlur={() => trigger("emp_type")}
                            >
                                {employeeOptions.employee_type_list.map(
                                    (emp_type) => (
                                        <option
                                            value={emp_type.id}
                                            key={emp_type.id}
                                        >
                                            {emp_type.name}
                                        </option>
                                    )
                                )}
                            </Select>
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="nationality"
                                    value="الجنسية :"
                                />
                            </div>
                            <Select
                                id="nationality"
                                type="select"
                                placeholder="الجنسية"
                                color={
                                    errors.nationality ? "failure" : "primary"
                                }
                                {...register("nationality", {})}
                                onBlur={() => trigger("nationality")}
                            >
                                <option key={0} value={null}></option>
                                {employeeOptions.nationality_list.map(
                                    (nationality) => (
                                        <option
                                            value={nationality.id}
                                            key={nationality.id}
                                        >
                                            {nationality.name}
                                        </option>
                                    )
                                )}
                            </Select>
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label htmlFor="religion" value="الديانة :" />
                            </div>
                            <Select
                                id="religion"
                                type="select"
                                placeholder="الديانة"
                                color={"primary"}
                                {...register("religion", {})}
                                onBlur={() => trigger("religion")}
                                defaultValue={"muslim"}
                            >
                                <option value="muslim" key={0}>
                                    مسلم
                                </option>
                                <option value="christian" key={1}>
                                    مسيحى
                                </option>
                                <option value="other" key={2}>
                                    غير ذلك
                                </option>
                            </Select>
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="marital_status"
                                    value="الحالة الاجتماعية :"
                                />
                            </div>
                            <Select
                                id="marital_status"
                                type="select"
                                placeholder="الحالة الاجتماعية"
                                color={
                                    errors.marital_status
                                        ? "failure"
                                        : "primary"
                                }
                                {...register("marital_status", {})}
                                onBlur={() => trigger("marital_status")}
                            >
                                <option key={0} value={null}></option>
                                {employeeOptions.marital_status_list.map(
                                    (marital_status) => (
                                        <option
                                            value={marital_status.id}
                                            key={marital_status.id}
                                        >
                                            {marital_status.name}
                                        </option>
                                    )
                                )}
                            </Select>
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label htmlFor="city" value="المدينة :" />
                            </div>
                            <Select
                                id="city"
                                type="select"
                                placeholder="المدينة"
                                color={errors.city ? "failure" : "primary"}
                                {...register("city", {})}
                                onBlur={() => trigger("city")}
                                onChange={(e) => {
                                    e.target.value == 0
                                        ? setCurrentCity(null)
                                        : setCurrentCity(e.target.value);
                                    setCurrentDistrict(null);
                                }}
                            >
                                <option key={0} value={0}></option>
                                {employeeOptions.city_list.map((city) => (
                                    <option value={city.id} key={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label htmlFor="city_district" value="الحى :" />
                            </div>
                            <Select
                                id="city_district"
                                type="select"
                                placeholder="الحى"
                                color={errors.district ? "failure" : "primary"}
                                {...register("district", {})}
                                onBlur={() => trigger("district")}
                                onChange={(e) => {
                                    e.target.value == 0
                                        ? setCurrentDistrict(null)
                                        : setCurrentDistrict(e.target.value);
                                }}
                            >
                                {currentCity && (
                                    <>
                                        <option key={0} value={0}></option>
                                        {employeeOptions.city_district_list
                                            .filter(
                                                (district) =>
                                                    district.city == currentCity
                                            )
                                            .map((city_district) => (
                                                <option
                                                    value={city_district.id}
                                                    key={city_district.id}
                                                >
                                                    {city_district.name}
                                                </option>
                                            ))}
                                    </>
                                )}
                            </Select>
                        </div>

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
                                    <p className="error-message">
                                        لا توجد صورة
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                                <Button
                                    type="submit"
                                    color={
                                        formFunction == "add"
                                            ? "primary"
                                            : "accent"
                                    }
                                    disabled={post}
                                >
                                    {formFunction == "add" ? "إضافة" : "تعديل"}
                                </Button>
                            </div>
                        </div>
                    </>
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
                setToast("تم حذف الموظف بنجاح");
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
                هل أنت متأكد تريد حذف الموظف:{" "}
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

const Employess = () => {
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
                title: "تعديل موظف",
                icon: MdEdit,
                content: (
                    <EmployeesForm
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
                title: "حذف موظف",
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
        const searchURL = `${endpoints.employee_list}${
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
            <EmployeesForm
                setToast={setToast}
                postURL={endpoints.employee_list}
                callBack={fetchListData}
            />

            {/* table data */}
            <ViewGroup title={"الموظفين الحاليين"}>
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
                                        <Table.HeadCell>الجنسية</Table.HeadCell>
                                        <Table.HeadCell>إجراءات</Table.HeadCell>
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
                                                            employee.emp_type
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
                                                            employee.nationality
                                                                .name
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
                                                                        employee
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        employee
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

export default Employess;
