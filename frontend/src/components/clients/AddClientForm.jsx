import React, { useState, useEffect, useRef } from "react";
import FormGroup from "../groups/FormGroup";
import {
    TextInput,
    Label,
    Select as FlowbiteSelect,
    Datepicker,
    Button,
} from "flowbite-react";
import { HiDeviceMobile, HiUser } from "react-icons/hi";
import { SlCalender } from "react-icons/sl";
import { HiMiniIdentification } from "react-icons/hi2";
import axios from "../../config/axiosconfig";
import { useForm, Controller } from "react-hook-form";
import { MdEmail } from "react-icons/md";
import endpoints from "../../config/config";
import { FaAddressCard, FaCamera } from "react-icons/fa";
import CustomFileInput from "../groups/CustomFileInput";
import Select from "react-select";
import style from "../../assets/rect-select-style";
import { defaultFormSubmission } from "../../config/actions";
import { calculateAge } from "../../utils";
import { useToast } from "../../providers/ToastProvider";
import { CiBarcode } from "react-icons/ci";
import Loading from "../groups/Loading";
import Webcam from "react-webcam";

const AddClientForm = ({ postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const [age, setAge] = useState(defaultValues?.age);
    const [selectedFile, setSelectedFile] = useState(null);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [trainersList, setTrainersList] = useState(null);
    const [subscriptionsList, setSubscriptionsList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [nextId, setNextId] = useState(null);
    const { showToast } = useToast();

    // handle camera

    const webcamRef = useRef(null);
    const [openCam, setOpenCam] = useState(false);
    const [image, setImage] = useState(null);

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc); // Set the captured image
        setSelectedFile("صورة من الكاميرا");
        setValue("photo", base64ToFile(imageSrc, `screenshot.jpg`));
    };

    const base64ToFile = (base64, fileName) => {
        const arr = base64.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], fileName, { type: mime });
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
    } = useForm({ defaultValues });
    const formFunction = defaultValues ? "edit" : "add";

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
        const url = `${
            endpoints.subscription_plan_list
        }&sub_type=main&page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((subscription) => {
                    options.push({
                        value: subscription.id,
                        label: subscription.name,
                        price: subscription.price,
                    });
                });
                setSubscriptionsList(options);
            })
            .catch((error) => {
                setSubscriptionsList(null);
            });
    };

    const get_next_client_id = () => {
        setLoading(true);
        axios
            .get(endpoints.next_id)
            .then((response) => {
                setNextId(response.data.id);
            })
            .catch((error) => {
                setFetchError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTrainers();
        fetchSubscriptions();
        get_next_client_id();
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
        if (currentPlan) {
            data.subscription_plan = currentPlan.value;
            if (!data.start_date) {
                data.start_date = new Date().toLocaleDateString("en-CA");
            }
        } else {
            data.subscription_plan = null;
        }

        defaultFormSubmission({
            url: postURL,
            data: data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة عميل جديد", edit: "تم تعديل العميل" },
            reset: reset,
            callBack: () => {
                if (callBack) callBack();
                setSelectedFile(null);
                setImage(null);
                setOpenCam(false);
                if (formFunction === "add") get_next_client_id();
            },
            setError: setError,
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
                                <Label htmlFor="id" value="كود العميل :" />
                            </div>
                            <TextInput
                                id="id"
                                type="number"
                                rightIcon={CiBarcode}
                                placeholder="كود العميل"
                                color={errors.id ? "failure" : "primary"}
                                {...register("id", {
                                    required: "هذا الحقل مطلوب",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "كود العميل لا يحتوى على حروف",
                                    },
                                })}
                                onBlur={() => trigger("id")}
                                disabled={formFunction == "edit"}
                                defaultValue={nextId ?? null}
                            />
                            {errors.id && (
                                <p className="error-message">
                                    {errors.id.message}
                                </p>
                            )}
                        </div>
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
                                    // required: "هذا الحقل مطلوب",
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

                        {formFunction === "add" && (
                            <>
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
                                                    options={
                                                        subscriptionsList || []
                                                    }
                                                    onInputChange={
                                                        fetchSubscriptions
                                                    }
                                                    value={field.value}
                                                    onBlur={() => {
                                                        trigger(
                                                            "subscription_plan"
                                                        );
                                                    }}
                                                    {...field}
                                                    styles={style(
                                                        errors.subscription_plan
                                                    )}
                                                    onChange={(plan) => {
                                                        setCurrentPlan(plan);
                                                    }}
                                                ></Select>
                                                {errors.subscription_plan && (
                                                    <p className="error-message">
                                                        {
                                                            errors
                                                                .subscription_plan
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
                                            htmlFor="trainer"
                                            value="المدرب :"
                                        />
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
                                                    onInputChange={
                                                        fetchTrainers
                                                    }
                                                    value={field.value}
                                                    onBlur={() => {
                                                        trigger("trainer");
                                                    }}
                                                    {...field}
                                                    styles={style(
                                                        errors.trainer
                                                    )}
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
                                                onSelectedDateChanged={(
                                                    date
                                                ) => {
                                                    field.onChange(
                                                        date.toLocaleDateString(
                                                            "en-CA"
                                                        )
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
                            <div className="mb-2 flex items-center justify-between">
                                <Label
                                    htmlFor="photo"
                                    value="الصورة :"
                                    className="inline-block"
                                />
                            </div>
                            <div>
                                <CustomFileInput
                                    register={register}
                                    setValue={setValue}
                                    name={"photo"}
                                    error={
                                        errors.photo ? "صورة غير صالحة" : null
                                    }
                                    selectedFile={selectedFile}
                                    setSelectedFile={setSelectedFile}
                                    onBlur={() => {
                                        trigger("photo");
                                    }}
                                />

                                <span
                                    className="ms-4 mt-2 inline-flex gap-x-3 items-center hover:text-accent cursor-pointer"
                                    onClick={() => {
                                        setOpenCam(true);
                                    }}
                                >
                                    <FaCamera className=" size-4" />
                                    <span>التقاط صورة</span>
                                </span>
                            </div>
                        </div>

                        {/* take a photo */}
                        {openCam && (
                            <div style={{ textAlign: "center" }}>
                                {!image ? (
                                    <>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            width={300}
                                        />
                                        <br />
                                        <div className="flex justify-center gap-x-2">
                                            <Button
                                                type="button"
                                                color={"primary"}
                                                size={"lg"}
                                                onClick={capturePhoto}
                                            >
                                                التقاط
                                            </Button>
                                            <Button
                                                type="button"
                                                color={"failure"}
                                                size={"lg"}
                                                onClick={() => {
                                                    setImage(null);
                                                    setSelectedFile(null);
                                                    setOpenCam(false);
                                                }}
                                            >
                                                إغلاق
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={image}
                                            alt="Captured"
                                            style={{ maxWidth: "300px" }}
                                        />
                                        <br />
                                        <div className="flex justify-center gap-x-2">
                                            <Button
                                                type="button"
                                                color={"primary"}
                                                size={"lg"}
                                                onClick={() => {
                                                    setImage(null);
                                                    setSelectedFile(null);
                                                }}
                                            >
                                                إعادة
                                            </Button>
                                            <Button
                                                type="button"
                                                color={"failure"}
                                                size={"lg"}
                                                onClick={() => {
                                                    setImage(null);
                                                    setSelectedFile(null);
                                                    setOpenCam(false);
                                                }}
                                            >
                                                إغلاق
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        {/* end */}

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

                        {formFunction === "add" && currentPlan && (
                            <div className="w-full my-3">
                                <p>
                                    سيتم إضافة إيراد بقيمة{" "}
                                    <span className="text-primary font-bold mx-2">
                                        {currentPlan?.price.toFixed(2)}{" "}
                                    </span>
                                    بتاريخ اليوم
                                </p>
                            </div>
                        )}
                    </>
                )}
            </FormGroup>
        </>
    );
};

export default AddClientForm;
