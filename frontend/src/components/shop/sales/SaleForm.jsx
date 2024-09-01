import React, { useState, useEffect } from "react";
import { TextInput, Table, Button } from "flowbite-react";
import Loading from "../../groups/Loading";
import endpoints from "../../../config/config";
import { FaMoneyBill, FaPercent, FaInfoCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { fetch_list_data } from "../../../config/actions";
import { useToast } from "../../../providers/ToastProvider";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "../../../config/axiosconfig";
import { TbMultiplier1X } from "react-icons/tb";
import { useDrawer } from "../../../providers/DrawerProvider";
import ConfirmPrompt from "./ConfirmPrompt";

const SaleForm = ({ callBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const { showDrawer, closeDrawer } = useDrawer();
    const {
        handleSubmit,
        trigger,
        formState: { errors },
        reset,
    } = useForm();
    const [products, setProducts] = useState(null);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [discount, setDiscount] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountedPrice, setDiscountedPrice] = useState(0);

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedProducts, discount, discountPercent]);

    const handleGameChange = (product, amount) => {
        console.log(amount > product.stock);

        if (amount > product.stock) {
            return;
        }
        console.log("here");

        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            if (exists) {
                return prev.map((p) =>
                    p.id === product.id
                        ? { ...p, amount: amount || p.amount }
                        : p
                );
            } else {
                return [...prev, { ...product, amount: amount || 1 }];
            }
        });
    };

    const handleCheckboxChange = (product) => {
        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            if (exists) {
                return prev.filter((p) => p.id !== product.id);
            } else {
                return [...prev, { ...product, amount: 1 }];
            }
        });
    };

    const calculateTotalPrice = () => {
        const total = selectedProducts.reduce(
            (acc, product) => acc + product.sell_price * product.amount,
            0
        );
        setTotalPrice(total);
        if (discount && discountPercent > 0) {
            setDiscountedPrice(total - total * (discountPercent / 100));
        } else {
            setDiscountedPrice(total);
        }
    };

    const handleDrawer = ({ sale, callBack }) => {
        showDrawer(
            "تأكيد عملية البيع",
            FaInfoCircle,
            <ConfirmPrompt
                sale={sale}
                closeDrawer={closeDrawer}
                callBack={() => {
                    if (callBack) callBack();
                }}
            />
        );
    };

    const onSubmit = () => {
        const saleData = {
            products: selectedProducts.map((product) => ({
                product_id: product.id,
                amount: product.amount,
                total_price: product.price * product.amount,
            })),
            total_price: totalPrice,
            discount: discountPercent,
            after_discount: discountedPrice,
        };

        axios
            .post(endpoints.sale_list, saleData)
            .then((response) => {
                showToast("تم إضافة طلب البيع");
                reset();
                setSelectedProducts([]);
                handleDrawer({
                    sale: response.data,
                    callBack: callBack ?? null,
                });
                if (callBack) callBack();
            })
            .catch((error) => {
                console.log(error);

                showToast("خطأ فى تنفيذ العملية", true);
            })
            .finally(() => {
                setPost(false);
            });
    };

    const get_current_products = () => {
        fetch_list_data({
            searchURL: `${endpoints.product_list}no_pagination=true`,
            setData: setProducts,
            setFetchError: setFetchError,
            setLoading: setIsLoading,
        });
    };

    useEffect(() => {
        get_current_products();
    }, []);

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">إضافة طلب</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
                onSubmit={handleSubmit(onSubmit)}
            >
                {isLoading ? (
                    <Loading className={`w-full text-center`} />
                ) : fetchError ? (
                    <p className="text-lg text-center text-red-600 py-4 w-full m-auto">
                        خطأ في تحميل البيانات
                    </p>
                ) : (
                    <>
                        <div className="w-full lg:w-3/4">
                            <div className="table-wrapper overflow-x-auto w-full">
                                <Table className="min-w-[400px]">
                                    <Table.Head className="text-right">
                                        <Table.HeadCell>اختر</Table.HeadCell>
                                        <Table.HeadCell>
                                            اسم المنتج
                                        </Table.HeadCell>
                                        <Table.HeadCell>السعر</Table.HeadCell>
                                        <Table.HeadCell>الكمية</Table.HeadCell>
                                        <Table.HeadCell>متوفر</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {products.map((product) => (
                                            <Table.Row
                                                key={product.id}
                                                className="mb-8 text-right"
                                            >
                                                <Table.Cell>
                                                    {product.stock > 0 && (
                                                        <input
                                                            type="checkbox"
                                                            id={`product_${product.id}`}
                                                            onChange={() =>
                                                                handleCheckboxChange(
                                                                    product
                                                                )
                                                            }
                                                            checked={
                                                                !!selectedProducts.find(
                                                                    (p) =>
                                                                        p.id ===
                                                                        product.id
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <label
                                                        htmlFor={`product_${product.id}`}
                                                        className="mx-4"
                                                    >
                                                        {product.name}
                                                    </label>
                                                </Table.Cell>
                                                <Table.Cell className="min-w-[230px]">
                                                    <TextInput
                                                        id="sell_price"
                                                        type="number"
                                                        className="inline-block me-4"
                                                        rightIcon={FaMoneyBill}
                                                        placeholder="السعر"
                                                        color={"primary"}
                                                        value={
                                                            product.sell_price
                                                        }
                                                        disabled
                                                    />
                                                </Table.Cell>
                                                <Table.Cell className="min-w-[230px]">
                                                    {product.stock > 0 ? (
                                                        <TextInput
                                                            id="amount"
                                                            type="number"
                                                            className="inline-block"
                                                            rightIcon={
                                                                TbMultiplier1X
                                                            }
                                                            placeholder="العدد"
                                                            color={
                                                                errors.amount
                                                                    ? "failure"
                                                                    : "primary"
                                                            }
                                                            value={
                                                                selectedProducts.find(
                                                                    (p) =>
                                                                        p.id ===
                                                                        product.id
                                                                )
                                                                    ? selectedProducts.find(
                                                                          (p) =>
                                                                              p.id ===
                                                                              product.id
                                                                      ).amount
                                                                    : 0
                                                            }
                                                            onChange={(e) =>
                                                                handleGameChange(
                                                                    product,
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                            onBlur={() =>
                                                                trigger(
                                                                    "amount"
                                                                )
                                                            }
                                                            disabled={
                                                                !selectedProducts.find(
                                                                    (p) =>
                                                                        p.id ===
                                                                        product.id
                                                                )
                                                            }
                                                        />
                                                    ) : (
                                                        <span className="text-secondary">
                                                            غير متوفر
                                                        </span>
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {product.stock}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                            <div className="totals text-base">
                                <div className="my-6">
                                    <label>
                                        الإجمالى : {totalPrice.toFixed(2)} جنيه
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="me-4"
                                            checked={discount}
                                            onChange={() =>
                                                setDiscount(!discount)
                                            }
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
                                                {discountedPrice.toFixed(2)}{" "}
                                                جنيه
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                            <Button
                                type="submit"
                                color={"primary"}
                                disabled={post || selectedProducts.length == 0}
                                className="w-32 h-10 flex justify-center items-center"
                                size={"xl"}
                                isProcessing={post}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                إضافة
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default SaleForm;
