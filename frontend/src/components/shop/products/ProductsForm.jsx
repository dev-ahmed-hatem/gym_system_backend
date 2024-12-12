import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Select, Textarea } from "flowbite-react";
import Loading from "../../groups/Loading";
import { useForm } from "react-hook-form";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import CustomFileInput from "../../groups/CustomFileInput";
import endpoints from "../../../config/config";
import { FaMoneyBill } from "react-icons/fa";
import { useToast } from "../../../providers/ToastProvider";
import {
    defaultFormSubmission,
    fetch_list_data,
} from "../../../config/actions";

const ProductsForm = ({ postURL, defaultValues, callBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
        setValue,
    } = useForm({
        defaultValues: defaultValues
            ? { ...defaultValues, category: defaultValues?.category?.id }
            : null,
    });
    const formFunction = defaultValues ? "edit" : "add";
    const [categories, setCategories] = useState(null);

    const fetchCategories = () => {
        const searchURL = `${endpoints.product_category_list}no_pagination=true`;

        fetch_list_data({
            searchURL: searchURL,
            setData: setCategories,
            setFetchError: setFetchError,
            setLoading: setIsLoading,
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = (data) => {
        setPost(true);

        // check whether image is a valid
        if (!(data["image"] instanceof File)) {
            delete data["image"];
        }

        data = {
            ...data,
            cost_price: Number(data.cost_price),
            sell_price: Number(data.sell_price),
            category: Number(data.category),
        };

        defaultFormSubmission({
            url: postURL,
            data: data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة منتج جديد", edit: "تم تعديل المنتج" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };
    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة منتج" : "تعديل منتج"}
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
                            <Label htmlFor="name" value="اسم المنتج :" />
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            rightIcon={MdOutlineDriveFileRenameOutline}
                            placeholder="اسم المنتج"
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
                            <Label htmlFor="cost_price" value="سعر الشراء :" />
                        </div>
                        <TextInput
                            id="cost_price"
                            type="number"
                            rightIcon={FaMoneyBill}
                            placeholder="سعر الشراء"
                            color={errors.cost_price ? "failure" : "primary"}
                            {...register("cost_price", {
                                required: "هذا الحقل مطلوب",
                                pattern: {
                                    value: /^[0-9]+(\.[0-9]+)?$/,
                                    message: "أدخل رقم صحيح",
                                },
                            })}
                            min={0}
                            step={0.1}
                            onBlur={() => trigger("cost_price")}
                        />
                        {errors.cost_price && (
                            <p className="error-message">
                                {errors.cost_price.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="sell_price" value="سعر البيع :" />
                        </div>
                        <TextInput
                            id="sell_price"
                            type="number"
                            rightIcon={FaMoneyBill}
                            placeholder="سعر البيع"
                            color={errors.sell_price ? "failure" : "primary"}
                            {...register("sell_price", {
                                required: "هذا الحقل مطلوب",
                                pattern: {
                                    value: /^[0-9]+(\.[0-9]+)?$/,
                                    message: "أدخل رقم صحيح",
                                },
                            })}
                            min={0}
                            step={0.1}
                            onBlur={() => trigger("sell_price")}
                        />
                        {errors.sell_price && (
                            <p className="error-message">
                                {errors.sell_price.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="category" value="الفئة :" />
                        </div>
                        <Select
                            id="category"
                            type="select"
                            placeholder="الفئة"
                            color={errors.category ? "failure" : "primary"}
                            {...register("category", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("category")}
                        >
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category.name}
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

                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="image" value="الصورة :" />
                        </div>
                        <CustomFileInput
                            register={register}
                            setValue={setValue}
                            name={"image"}
                            error={errors.image ? "صورة غير صالحة" : null}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            onBlur={() => {
                                trigger("image");
                            }}
                        />
                    </div>

                    {formFunction === "edit" && (
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label value="الصورة الحالية :" />
                            </div>
                            {defaultValues?.image ? (
                                <img
                                    src={defaultValues.image}
                                    width={100}
                                    height={100}
                                    alt=""
                                />
                            ) : (
                                <p className="error-message">لا توجد صورة</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </FormGroup>
    );
};

export default ProductsForm;
