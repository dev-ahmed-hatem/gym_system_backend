import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { Label, TextInput } from "flowbite-react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";
import endpoints from "../../../config/config";
import { MdInventory } from "react-icons/md";
import axios from "../../../config/axiosconfig";
import style from "../../../assets/rect-select-style";

const StockForm = ({ callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        control,
        reset,
        watch,
    } = useForm();

    const [productsList, setProductsList] = useState(null);
    const currentProduct = watch("product");
    const stock = watch("stock");

    const onSubmit = (data) => {
        data = {
            product_id: data.product.value,
            amount: data.stock,
        };

        defaultFormSubmission({
            url: endpoints.add_stock,
            data: data,
            formFunction: "add",
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة المخزون" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    const fetchProducts = (search_word) => {
        const options = [];
        const url = `${endpoints.product_list}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((product) => {
                    options.push({
                        value: product.id,
                        label: product.name,
                        cost_price: Number.parseFloat(product.cost_price),
                    });
                });
                setProductsList(options);
            })
            .catch((error) => {
                setProductsList(null);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={"إضافة مخزون منتج"}
            formFunction={"add"}
            post={post}
        >
            <>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="product" value="اختر منتج :" />
                    </div>

                    <Controller
                        name="product"
                        control={control}
                        rules={{ required: "يجب اختيار منتج" }}
                        render={({ field }) => (
                            <>
                                <Select
                                    isClearable
                                    noOptionsMessage={() =>
                                        "لا يوجد نتائج مطابقة"
                                    }
                                    placeholder="بحث ..."
                                    options={productsList || []}
                                    onInputChange={fetchProducts}
                                    value={field.value}
                                    onBlur={() => {
                                        trigger("product");
                                    }}
                                    styles={style(errors.product)}
                                    {...field}
                                ></Select>
                                {errors.product && (
                                    <p className="error-message">
                                        {errors.product.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
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
                        defaultValue={1}
                        {...register("stock", {
                            required: "هذا الحقل مطلوب",
                            pattern: {
                                value: /^[1-9]\d*$/,
                                message: "أدخل رقم صحيح موجب",
                            },
                        })}
                        min={1}
                        onBlur={() => trigger("stock")}
                    />
                    {errors.stock && (
                        <p className="error-message">{errors.stock.message}</p>
                    )}
                </div>

                {currentProduct && stock > 0 && (
                    <div className="w-full my-4">
                        <p>
                            سيتم إضافة عدد{" "}
                            <span className="text-primary font-bold mx-2">
                                {stock}
                            </span>{" "}
                            إلى مخزون المنتج{" "}
                            <span className="text-primary font-bold mx-2">
                                {currentProduct.label}
                            </span>
                        </p>
                        <p>
                            سيتم إضافة مصروف بقيمة{" "}
                            <span className="text-primary font-bold mx-2">
                                {currentProduct.cost_price *
                                    Number.parseInt(stock)}{" "}
                            </span>
                            بتاريخ اليوم
                        </p>
                    </div>
                )}
            </>
        </FormGroup>
    );
};

export default StockForm;
