import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Select, Textarea } from "flowbite-react";
import Loading from "../../groups/Loading";
import { useForm } from "react-hook-form";
import { MdOutlineDriveFileRenameOutline, MdInventory } from "react-icons/md";
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

        // check whether photo is a valid
        if (!(data["photo"] instanceof File)) {
            delete data["photo"];
        }

        data = {
            ...data,
            price: Number(data.price),
            category: Number(data.category),
            stock: Number(data.stock),
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
                            <Label htmlFor="price" value="السعر :" />
                        </div>
                        <TextInput
                            id="price"
                            type="number"
                            rightIcon={FaMoneyBill}
                            placeholder="السعر"
                            color={errors.price ? "failure" : "primary"}
                            {...register("price", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("price")}
                        />
                        {errors.price && (
                            <p className="error-message">
                                {errors.price.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="stock" value="المخزون :" />
                        </div>
                        <TextInput
                            id="stock"
                            type="number"
                            rightIcon={MdInventory}
                            placeholder="المخزون"
                            color={errors.stock ? "failure" : "primary"}
                            defaultValue={0}
                            {...register("stock", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("stock")}
                        />
                        {errors.stock && (
                            <p className="error-message">
                                {errors.stock.message}
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
