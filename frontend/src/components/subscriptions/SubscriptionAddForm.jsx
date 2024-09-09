import React, { useState, useEffect } from "react";
import {
    Label,
    Select as FlowbiteSelect,
    Datepicker,
    TextInput,
} from "flowbite-react";
import axios from "../../config/axiosconfig";
import { useForm, Controller } from "react-hook-form";
import endpoints from "../../config/config";
import Select from "react-select";
import style from "../../assets/rect-select-style";
import Loading from "../groups/Loading";
import FormGroup from "../groups/FormGroup";
import { useToast } from "../../providers/ToastProvider";
import { defaultFormSubmission } from "../../config/actions";
import { FaPercent } from "react-icons/fa";

const transformValues = (defaultValues) => {
    if (defaultValues) {
        const transformedValues = {};
        // transform client
        if (defaultValues.client) {
            transformedValues["client"] = {
                value: defaultValues.client_id,
                label: defaultValues.client_name,
            };
        }

        // transform trainer
        if (defaultValues.trainer) {
            transformedValues["trainer"] = {
                value: defaultValues.trainer.id,
                label: `${defaultValues.trainer.name} ${
                    defaultValues.trainer?.emp_type?.name
                        ? `(${defaultValues.trainer.emp_type.name})`
                        : ""
                }`,
            };
        }

        // transform plan
        if (defaultValues.plan) {
            transformedValues["plan"] = {
                value: defaultValues.client.id,
                label: defaultValues.plan.name,
                duration: defaultValues.plan.is_duration
                    ? `${defaultValues.plan.days} (يوم)`
                    : `${defaultValues.plan.classes_no} (حصة)`,
                price: defaultValues.plan?.price,
            };
        }

        // transform referrer
        if (defaultValues.referrer) {
            transformedValues["referrer"] = {
                value: defaultValues.referrer.id,
                label: `${defaultValues.referrer.name} ${
                    defaultValues.referrer?.emp_type?.name
                        ? `(${defaultValues.referrer.emp_type.name})`
                        : ""
                }`,
            };
        }

        transformedValues.start_date = defaultValues?.start_date;
        return transformedValues;
    } else {
        return null;
    }
};

const SubscriptionAddForm = ({ postURL, defaultValues, callBack }) => {
    const [blockedClient, setBlockedClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [post, setPost] = useState(false);
    const { showToast } = useToast();

    const [discount, setDiscount] = useState(false);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);

    const {
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        clearErrors,
        reset,
        control,
        watch,
        setValue,
        getValues,
    } = useForm({ defaultValues: transformValues(defaultValues) });
    const formFunction = defaultValues ? "edit" : "add";

    const [subType, setSubType] = useState(
        defaultValues?.plan?.subscription_type
            ? defaultValues.plan.subscription_type
            : "main"
    );
    const [dataList, setDataList] = useState({
        subscriptions: [],
        trainers: [],
        clients: [],
    });
    // get the selected values for show in details
    const currentClient = watch("client");
    const currentplan = watch("plan");
    const currentTrainer = watch("trainer");
    const startDate = watch("start_date");
    const currentReferrer = watch("referrer");

    useEffect(() => {
        if (discount) {
            if (currentplan) {
                setDiscountedPrice(
                    currentplan?.price -
                        (currentplan?.price * discountPercent) / 100
                );
            }
        }
    }, [discountPercent, discount, currentplan]);

    const fetchData = (key, search_word) => {
        let endpoint = ``;
        switch (key) {
            case "clients":
                endpoint = endpoints.client_list;
                break;
            case "trainers":
                endpoint = endpoints.employee_list;
                break;
            case "plans":
                endpoint = `${endpoints.subscription_plan_list}sub_type=${subType}&`;
                break;
        }
        const options = [];
        const url = `${endpoint}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((instance) => {
                    let option = {};

                    // add (emp type) beside the label in case of trainers
                    const label =
                        key === "trainers"
                            ? `${instance.name} ${
                                  instance?.emp_type?.name
                                      ? `(${instance.emp_type.name})`
                                      : ""
                              }`
                            : `${instance.name}`;
                    option.label = label;

                    // add duration or classes number in case of plans
                    if (key == "plans") {
                        option.duration = instance.is_duration
                            ? `${instance.days} (يوم)`
                            : `${instance.classes_no} (حصة)`;
                        option.price = instance?.price;
                    }
                    if (key == "clients") {
                        option.is_blocked = instance.is_blocked;
                    }
                    options.push({
                        value: instance.id,
                        ...option,
                    });
                });
                setDataList((prevDataList) => {
                    return { ...prevDataList, [key]: options };
                });
            })
            .catch((error) => {
                setDataList(null);
                setFetchError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData("clients");
        fetchData("plans");
        fetchData("trainers");
    }, []);

    useEffect(() => {
        fetchData("plans");
    }, [subType]);

    const onSubmit = (data) => {
        setBlockedClient(false);
        if (currentClient.is_blocked) {
            setBlockedClient(true);
            return;
        }
        if (formFunction === "edit" && defaultValues?.is_expired) {
            setSubmitError(true);
            return;
        }

        const dataKeys = ["client", "plan", "referrer", "trainer"];
        for (let i of dataKeys) {
            if (data[i]) {
                data[i] = data[i].value;
            } else {
                data[i] = null;
            }
        }

        data["total_price"] = discount ? discountedPrice : currentplan?.price;

        defaultFormSubmission({
            url: postURL,
            data: data,
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة الاشتراك", edit: "تم تعديل الاشتراك" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    return (
        <>
            <FormGroup
                onSubmit={handleSubmit(onSubmit)}
                title={formFunction == "add" ? "إضافة اشتراك" : "تعديل اشتراك"}
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
                        {formFunction == "add" && (
                            <>
                                <div className="w-full lg:max-w-md lg:w-[30%]">
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="sub_type"
                                            value="نوع الاشتراك :"
                                        />
                                    </div>
                                    <FlowbiteSelect
                                        id="sub_type"
                                        type="select"
                                        color={
                                            errors.sub_type
                                                ? "failure"
                                                : "primary"
                                        }
                                        onChange={(event) => {
                                            setSubType(event.target.value);
                                        }}
                                        defaultValue={subType}
                                    >
                                        <option value={"main"} key={0}>
                                            أساسى
                                        </option>
                                        <option value={"sub"} key={1}>
                                            إضافى
                                        </option>
                                        <option value={"locker"} key={2}>
                                            لوكر
                                        </option>
                                    </FlowbiteSelect>
                                    {errors.sub_type && (
                                        <p className="error-message">
                                            {errors.sub_type.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full lg:max-w-md lg:w-[30%]">
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="client"
                                            value="العميل :"
                                        />
                                    </div>

                                    <Controller
                                        name="client"
                                        control={control}
                                        rules={{ required: "يجب اختيار عميل" }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    isClearable
                                                    noOptionsMessage={() =>
                                                        "لا يوجد نتائج مطابقة"
                                                    }
                                                    placeholder="بحث ..."
                                                    options={
                                                        dataList.clients || []
                                                    }
                                                    onInputChange={(value) => {
                                                        fetchData(
                                                            "clients",
                                                            value
                                                        );
                                                    }}
                                                    value={field.value}
                                                    onBlur={() => {
                                                        trigger("client");
                                                    }}
                                                    {...field}
                                                    styles={style(
                                                        errors.client
                                                    )}
                                                ></Select>
                                                {errors.client && (
                                                    <p className="error-message">
                                                        {errors.client.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                                <div className="w-full lg:max-w-md lg:w-[30%]">
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="plan"
                                            value="الاشتراك :"
                                        />
                                    </div>

                                    <Controller
                                        name="plan"
                                        control={control}
                                        rules={{
                                            required: "يجب اختيار اشتراك",
                                        }}
                                        render={({ field }) => (
                                            <>
                                                <Select
                                                    isClearable
                                                    noOptionsMessage={() =>
                                                        "لا يوجد نتائج مطابقة"
                                                    }
                                                    placeholder="بحث ..."
                                                    options={
                                                        dataList.plans || []
                                                    }
                                                    onInputChange={(value) => {
                                                        fetchData(
                                                            "plans",
                                                            value
                                                        );
                                                    }}
                                                    value={field.value}
                                                    onBlur={() => {
                                                        trigger("plan");
                                                    }}
                                                    {...field}
                                                    styles={style(errors.plan)}
                                                    onChange={(value) => {
                                                        setValue("plan", value);
                                                        if (!startDate) {
                                                            setValue(
                                                                "start_date",
                                                                new Date().toLocaleDateString(
                                                                    "en-CA"
                                                                )
                                                            );
                                                        }
                                                    }}
                                                ></Select>
                                                {errors.plan && (
                                                    <p className="error-message">
                                                        {errors.plan.message}
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    />
                                </div>
                            </>
                        )}
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
                                            options={dataList.trainers || []}
                                            onInputChange={(value) => {
                                                fetchData("trainers", value);
                                            }}
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
                                    htmlFor="referrer"
                                    value="اشتراك بواسطة :"
                                />
                            </div>

                            <Controller
                                name="referrer"
                                control={control}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            isClearable
                                            noOptionsMessage={() =>
                                                "لا يوجد نتائج مطابقة"
                                            }
                                            placeholder="بحث ..."
                                            options={dataList.trainers || []}
                                            onInputChange={(value) => {
                                                fetchData("trainers", value);
                                            }}
                                            value={field.value}
                                            onBlur={() => {
                                                trigger("referrer");
                                            }}
                                            {...field}
                                            styles={style(errors.referrer)}
                                        ></Select>
                                        {errors.referrer && (
                                            <p className="error-message">
                                                {errors.referrer.message}
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
                                        defaultDate={
                                            defaultValues?.start_date
                                                ? new Date(
                                                      defaultValues?.start_date
                                                  )
                                                : new Date()
                                        }
                                    />
                                )}
                            />
                        </div>
                        <div className="w-full">
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="me-4"
                                        checked={discount}
                                        onChange={() => setDiscount(!discount)}
                                    />
                                    الخصم
                                </label>
                            </div>
                            {discount && (
                                <>
                                    <div className="mb-6">
                                        <label>
                                            نسبة الخصم :
                                            <TextInput
                                                id="discount"
                                                type="number"
                                                className="inline-block mx-3"
                                                rightIcon={FaPercent}
                                                placeholder="الخصم"
                                                color={"primary"}
                                                value={discountPercent}
                                                onChange={(e) =>
                                                    setDiscountPercent(
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                min={0}
                                                max={100}
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label>
                                            الصافى :{" "}
                                            {discountedPrice.toFixed(2)} جنيه
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* totals */}
                        <div className="w-full h-px my-3 bg-gray-200 border-0"></div>
                        <div className="totals mt-2 ">
                            <h1 className="font-bold text-xl mb-4 lg:mb-8">
                                التفاصيل :
                            </h1>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-40">
                                    الاشتراك :{""}
                                </span>
                                <span className="text-primary font-bold">
                                    {currentplan?.label || "لا يوجد"}
                                </span>
                            </p>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-40">
                                    العميل :
                                </span>
                                <span className="text-primary font-bold">
                                    {currentClient?.label || "لا يوجد"}
                                </span>
                            </p>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-40">
                                    المدرب :
                                </span>
                                <span className="text-primary font-bold">
                                    {currentTrainer?.label || "لا يوجد"}
                                </span>
                            </p>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-40">
                                    اشتراك بواسطة :
                                </span>
                                <span className="text-primary font-bold">
                                    {currentReferrer?.label || "لا يوجد"}
                                </span>
                            </p>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-40">
                                    تاريخ البدأ :
                                </span>
                                <span className="text-primary font-bold">
                                    {startDate || "لا يوجد"}
                                </span>
                            </p>
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-40">
                                    المدة :
                                </span>
                                <span className="text-primary font-bold">
                                    {currentplan
                                        ? currentplan?.duration
                                        : "لا يوجد"}
                                </span>
                            </p>
                            {currentplan && formFunction == "edit" && (
                                <p className="mt-2 ms-10">
                                    <span className="inline-block text-black font-bold pe-1 min-w-40">
                                        الصافى :
                                    </span>
                                    <span className="text-primary font-bold">
                                        {defaultValues?.total_price}
                                    </span>
                                </p>
                            )}
                            {currentplan && formFunction == "add" && (
                                <>
                                    <p className="mt-2 ms-10">
                                        <span className="inline-block text-black font-bold pe-1 min-w-40">
                                            السعر :
                                        </span>
                                        <span className="text-primary font-bold">
                                            {currentplan
                                                ? currentplan?.price
                                                : "0"}
                                        </span>
                                    </p>
                                    <p className="mt-2 ms-10">
                                        <span className="inline-block text-black font-bold pe-1 min-w-40">
                                            نسبة الخصم :
                                        </span>
                                        <span className="text-primary font-bold">
                                            {discountPercent && discount
                                                ? `${discountPercent} %`
                                                : "لا يوجد"}
                                        </span>
                                    </p>
                                    <p className="mt-2 ms-10">
                                        <span className="inline-block text-black font-bold pe-1 min-w-40">
                                            الصافى :
                                        </span>
                                        <span className="text-primary font-bold">
                                            {discount
                                                ? discountedPrice.toFixed(2)
                                                : currentplan?.price
                                                ? currentplan?.price
                                                : 0}
                                        </span>
                                    </p>
                                    <div className="w-full my-3">
                                        <p>
                                            سيتم إضافة إيراد بقيمة{" "}
                                            <span className="text-primary font-bold mx-2">
                                                {discount
                                                    ? discountedPrice.toFixed(2)
                                                    : currentplan?.price}{" "}
                                            </span>
                                            بتاريخ اليوم
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}

                {submitError && (
                    <>
                        <br />

                        <p className="text-lg text-center text-red-600 py-4">
                            غير مسموح بالتعديل (اشتراك منتهى)
                        </p>
                    </>
                )}
                {blockedClient && (
                    <p className="w-full text-base lg:text-lg text-center text-red-600 py-4">
                        عميل محظور
                    </p>
                )}
            </FormGroup>
        </>
    );
};

export default SubscriptionAddForm;
