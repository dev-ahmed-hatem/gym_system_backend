import React, { useState, useEffect } from "react";
import { Label, Select as FlowbiteSelect, Datepicker } from "flowbite-react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import Notification from "../groups/Notification";
import endpoints from "../../../config";
import Select from "react-select";
import style from "../../assets/rect-select-style";
import Loading from "../groups/Loading";
import FormGroup from "../groups/FormGroup";

const SubscriptionAddForm = ({
    setToast,
    postURL,
    defaultValues,
    callBack,
}) => {
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const [post, setPost] = useState(false);

    const transformValues = () => {
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
    } = useForm({ defaultValues: transformValues(defaultValues) });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.patch;

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
            .finally(setLoading(false));
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

        // console.log(data);
        // return;
        setPost(true);

        requestMethod(postURL, data)
            .then((response) => {
                // console.log(response);
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة الاشتراك"
                        : "تم تعديل الاشتراك"
                );
                reset();
                clearErrors();
                if (callBack) callBack();
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
                                color={errors.sub_type ? "failure" : "primary"}
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
                                <Label htmlFor="client" value="العميل :" />
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
                                            options={dataList.clients || []}
                                            onInputChange={(value) => {
                                                fetchData("clients", value);
                                            }}
                                            value={field.value}
                                            onBlur={() => {
                                                trigger("client");
                                            }}
                                            {...field}
                                            styles={style(errors.client)}
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
                                <Label htmlFor="plan" value="الاشتراك :" />
                            </div>

                            <Controller
                                name="plan"
                                control={control}
                                rules={{ required: "يجب اختيار اشتراك" }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            isClearable
                                            noOptionsMessage={() =>
                                                "لا يوجد نتائج مطابقة"
                                            }
                                            placeholder="بحث ..."
                                            options={dataList.plans || []}
                                            onInputChange={(value) => {
                                                fetchData("plans", value);
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
                                    {startDate ? startDate : "لا يوجد"}
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
                            <p className="mt-2 ms-10">
                                <span className="inline-block text-black font-bold pe-1 min-w-40">
                                    السعر :
                                </span>
                                <span className="text-primary font-bold">
                                    {currentplan
                                        ? currentplan?.price
                                        : "لا يوجد"}
                                </span>
                            </p>
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
            </FormGroup>
        </>
    );
};

const SubscriptionAdd = ({ defaultValues, postURL, callBack }) => {
    const [toast, setToast] = useState(null);

    return (
        <>
            {/*  notification */}
            {toast && <Notification setToast={setToast} title={toast} />}

            {/* add form */}
            <SubscriptionAddForm
                setToast={setToast}
                postURL={postURL ? postURL : endpoints.subscription_list}
                defaultValues={defaultValues}
                callBack={callBack}
            />
        </>
    );
};

export default SubscriptionAdd;
