import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Select, Textarea, Datepicker } from "flowbite-react";
import Loading from "../../groups/Loading";
import { useForm, Controller } from "react-hook-form";
import endpoints from "../../../config/config";
import { FaMoneyBill } from "react-icons/fa";
import { useToast } from "../../../providers/ToastProvider";
import {
    defaultFormSubmission,
    fetch_list_data,
} from "../../../config/actions";

const TransactionsForm = ({
    postURL,
    defaultValues,
    transactionType,
    callBack,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [post, setPost] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        control,
        reset,
    } = useForm({
        defaultValues: {
            ...defaultValues,
            category: defaultValues?.category?.id,
        },
    });
    const formFunction = defaultValues ? "edit" : "add";
    const [categories, setCategories] = useState(null);
    const { showToast } = useToast();

    const get_current_categories = () => {
        const url = `${endpoints.financial_item_list}page_size=200&type=${transactionType}`;
        fetch_list_data({
            searchURL: url,
            setData: (data) => {
                setCategories(data.results);
            },
            setFetchError: setFetchError,
            setLoading: setIsLoading,
        });
    };

    useEffect(() => {
        get_current_categories();
    }, [transactionType]);

    const onSubmit = (data) => {
        setPost(true);

        data = {
            ...data,
            category: Number(data.category),
            amount: Number(data.amount),
            date: data.date
                ? data.date
                : new Date().toLocaleDateString("en-CA"),
        };

        defaultFormSubmission({
            url: postURL,
            data: data,
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: {
                add: `تم إضافة ${
                    transactionType == "expenses" ? "مصروف" : "إيراد"
                } جديد`,
                edit: `تم تعديل ${
                    transactionType == "expenses" ? "المصروف" : "الإيراد"
                }`,
            },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={
                formFunction == "add"
                    ? transactionType === "expenses"
                        ? "إضافة مصروف"
                        : "إضافة إيراد"
                    : transactionType === "expenses"
                    ? "تعديل مصروف"
                    : "تعديل إيراد"
            }
            formFunction={formFunction}
            post={post}
        >
            {isLoading ? (
                <Loading className={`w-full text-center`} />
            ) : fetchError ? (
                <p className="text-lg text-center text-red-600 py-4 w-full m-auto">
                    خطأ في تحميل البيانات
                </p>
            ) : (
                <>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="category" value="البند :" />
                        </div>
                        <Select
                            id="category"
                            type="select"
                            color={errors.category ? "failure" : "primary"}
                            {...register("category", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("category")}
                        >
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category?.name}
                                </option>
                            ))}
                        </Select>
                        {errors.category && (
                            <p className="error-message">
                                {errors.category.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="amount" value="القيمة :" />
                        </div>
                        <TextInput
                            id="amount"
                            type="number"
                            rightIcon={FaMoneyBill}
                            placeholder="القيمة"
                            color={errors.amount ? "failure" : "primary"}
                            {...register("amount", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("amount")}
                        />
                        {errors.amount && (
                            <p className="error-message">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="date" value="التاريخ  :" />
                        </div>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <Datepicker
                                    selected={field.value}
                                    id="date"
                                    language="ar"
                                    labelClearButton="مسح"
                                    labelTodayButton="اليوم"
                                    placeholder="تاريخ الميلاد"
                                    color={"primary"}
                                    onSelectedDateChanged={(date) => {
                                        field.onChange(
                                            date.toLocaleDateString("en-CA")
                                        );
                                    }}
                                />
                            )}
                        />
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
                </>
            )}
        </FormGroup>
    );
};

export default TransactionsForm;
