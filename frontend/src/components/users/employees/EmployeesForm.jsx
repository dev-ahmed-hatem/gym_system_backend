import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Select, Datepicker } from "flowbite-react";
import { HiDeviceMobile, HiUser } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import Loading from "../../groups/Loading";
import { HiMiniIdentification } from "react-icons/hi2";
import axios from "../../../config/axiosconfig";
import { useForm, Controller } from "react-hook-form";
import { MdEmail } from "react-icons/md";
import endpoints from "../../../config/config";
import { FaAddressCard } from "react-icons/fa";
import CustomFileInput from "../../groups/CustomFileInput";
import { transformValues, calculateAge } from "../../../utils";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";

const EmployeesForm = ({ postURL, defaultValues, callBack }) => {
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
    const { showToast } = useToast();

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

    useEffect(() => {
        // get the data of the relationship fields of employee
        const fetchEmployeeOptions = async () => {
            try {
                const [
                    nationalityResponse,
                    maritalStatusResponse,
                    employeeTypeResponse,
                    cityResponse,
                    cityDistrictResponse,
                ] = await Promise.all([
                    axios.get(
                        `${endpoints.nationality_list}no_pagination=true`
                    ),
                    axios.get(
                        `${endpoints.marital_status_list}no_pagination=true`
                    ),
                    axios.get(
                        `${endpoints.employee_type_list}no_pagination=true`
                    ),
                    axios.get(`${endpoints.city_list}no_pagination=true`),
                    axios.get(
                        `${endpoints.city_district_list}no_pagination=true`
                    ),
                ]);

                const employee_options = {
                    nationality_list: nationalityResponse.data,
                    marital_status_list: maritalStatusResponse.data,
                    employee_type_list: employeeTypeResponse.data,
                    city_list: cityResponse.data,
                    city_district_list: cityDistrictResponse.data,
                };

                setEmployeeOptions(employee_options);
            } catch (error) {
                console.log(error);
                setFetchError(error);
            } finally {
                setLoading(false);
            }
        };
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

        defaultFormSubmission({
            url: postURL,
            data: data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة موظف جديد", edit: "تم تعديل الموظف" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    return (
        <>
            <FormGroup
                onSubmit={handleSubmit(onSubmit)}
                title={formFunction == "add" ? "إضافة موظف" : "تعديل موظف"}
                formFunction={formFunction}
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
                                            calculateAge({
                                                birth: date,
                                                setAge: setAge,
                                            });
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
                                                    district.city.id ==
                                                    currentCity
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
                    </>
                )}
            </FormGroup>
        </>
    );
};

export default EmployeesForm;
