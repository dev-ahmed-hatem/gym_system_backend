import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import {
    TextInput,
    Label,
    Select as FlowbiteSelect,
    Datepicker,
} from "flowbite-react";
import Loading from "../../groups/Loading";
import { useForm, Controller } from "react-hook-form";
import endpoints from "../../../config/config";
import { useToast } from "../../../providers/ToastProvider";
import {
    defaultFormSubmission,
    fetch_list_data,
} from "../../../config/actions";
import { FaPercentage } from "react-icons/fa";

const OffersForm = ({ postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 10);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
        control,
        watch,
        setValue,
        clearErrors,
    } = useForm({
        defaultValues: {
            ...defaultValues,
        },
    });
    const [offerType, setOfferType] = useState(
        defaultValues ? defaultValues.offer_type : "plan"
    );
    const [dataList, setDataList] = useState(null);

    const formFunction = defaultValues ? "edit" : "add";
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const start_date = watch("start_date");
    const end_date = watch("end_date");

    useEffect(() => {
        if (end_date < start_date) {
            setError("end_date", {
                type: "manual",
                message: "تاريخ النهاية أقدم من تاريخ البداية",
            });
        } else {
            clearErrors();
        }
    }, [start_date, end_date]);

    const get_select_data = (search_word) => {
        const searchURL = `${
            offerType === "plan"
                ? endpoints.subscription_plan_list
                : endpoints.product_list
        }${
            search_word ? `&search=${search_word}` : ``
        }&no_pagination=true&ordering=name`;
        fetch_list_data({
            searchURL: searchURL,
            setData: (data) => {
                setDataList(data);
                setValue(offerType, data?.[0]?.id);
            },
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    const onSubmit = (data) => {
        let transformed_data = {
            percentage: Number.parseFloat(data.percentage),
            start_date: data.start_date,
            end_date: data.end_date,
            offer_type: offerType,
            item_id: Number.parseInt(data[offerType]),
        };

        defaultFormSubmission({
            url: postURL,
            data: transformed_data,
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة عرض جديد", edit: "تم تعديل العرض" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    useEffect(() => {
        get_select_data();
    }, [offerType]);

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة عرض" : "تعديل عرض"}
            post={post}
            formFunction={formFunction}
        >
            {loading ? (
                <Loading className={`w-full text-center`} />
            ) : fetchError ? (
                <p className="text-lg text-center text-red-600 py-4 w-full m-auto">
                    خطأ في تحميل البيانات
                </p>
            ) : (
                <>
                    {formFunction === "add" && (
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="offer-type"
                                    value="نوع العرض :"
                                />
                            </div>
                            <FlowbiteSelect
                                id="offer-type"
                                type="select"
                                color={"primary"}
                                onChange={(event) => {
                                    setOfferType(event.target.value);
                                }}
                                value={offerType}
                            >
                                <option value={"plan"}>عرض على اشتراك</option>
                                <option value={"product"}>عرض على منتج</option>
                            </FlowbiteSelect>
                        </div>
                    )}

                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label
                                htmlFor="item"
                                value={`${
                                    offerType == "plan" ? "الاشتراك" : "المنتج"
                                } :`}
                            />
                        </div>
                        <FlowbiteSelect
                            id="item"
                            type="select"
                            color={"primary"}
                            onChange={(event) => {
                                setOfferType(event.target.value);
                            }}
                            {...register(offerType, {})}
                        >
                            {dataList?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </FlowbiteSelect>
                    </div>

                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label
                                htmlFor="percentage"
                                value="نسبة الخصم : (%)"
                            />
                        </div>
                        <TextInput
                            id="percentage"
                            type="number"
                            rightIcon={FaPercentage}
                            placeholder="نسبة الخصم"
                            color={errors.percentage ? "failure" : "primary"}
                            {...register("percentage", {
                                required: "هذا الحقل مطلوب",
                                pattern: {
                                    value: /^\d{1,2}(\.\d{1,2})?$/,
                                    message: "مسموح من 0 إلى 99",
                                },
                            })}
                            defaultValue={10.0}
                            min={0}
                            max={99}
                            step={"any"}
                            onBlur={() => {
                                trigger("percentage");
                            }}
                        />
                        {errors.percentage && (
                            <p className="error-message">
                                {errors.percentage.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label
                                htmlFor="start_date"
                                value="تاريخ البداية :"
                            />
                        </div>
                        <Controller
                            name="start_date"
                            control={control}
                            rules={{ required: "هذا الحقل مطلوب" }}
                            defaultValue={today.toLocaleDateString("en-CA")}
                            render={({ field }) => (
                                <Datepicker
                                    selected={field.value}
                                    id="start_date"
                                    language="ar"
                                    labelClearButton="مسح"
                                    labelTodayButton="اليوم"
                                    placeholder="تاريخ البداية"
                                    color={
                                        errors.start_date
                                            ? "failure"
                                            : "primary"
                                    }
                                    onSelectedDateChanged={(date) => {
                                        field.onChange(
                                            date.toLocaleDateString("en-CA")
                                        );
                                    }}
                                    {...field}
                                />
                            )}
                        />
                        {errors.start_date && (
                            <p className="error-message">
                                {errors.start_date.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="end_date" value="تاريخ النهاية :" />
                        </div>
                        <Controller
                            name="end_date"
                            control={control}
                            rules={{ required: "هذا الحقل مطلوب" }}
                            defaultValue={futureDate.toLocaleDateString(
                                "en-CA"
                            )}
                            render={({ field }) => (
                                <Datepicker
                                    selected={field.value}
                                    id="end_date"
                                    language="ar"
                                    labelClearButton="مسح"
                                    labelTodayButton="اليوم"
                                    placeholder="تاريخ النهاية"
                                    color={
                                        errors.end_date ? "failure" : "primary"
                                    }
                                    onSelectedDateChanged={(date) => {
                                        field.onChange(
                                            date.toLocaleDateString("en-CA")
                                        );
                                    }}
                                    {...field}
                                />
                            )}
                        />
                        {errors.end_date && (
                            <p className="error-message">
                                {errors.end_date.message}
                            </p>
                        )}
                    </div>
                </>
            )}
        </FormGroup>
    );
};

export default OffersForm;
