import React, { useState, useEffect } from "react";
import { TextInput, Label, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import endpoints from "../../../config/config";
import { FaInfoCircle, FaMoneyBill } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { useToast } from "../../../providers/ToastProvider";
import { useDrawer } from "../../../providers/DrawerProvider";
import { defaultFormSubmission } from "../../../config/actions";

const ConfirmAdvancePayment = ({ paymentData, setConfirm, closeDrawer }) => {
    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <p className="text-base">
                تسديد مبلغ من سلفة بقيمة :
                <span className="ms-1 font-bold text-primary">
                    {paymentData.amount}
                </span>
                <br />
                للموظف :
                <span className="ms-1 font-bold text-primary">
                    {paymentData.employee_name}
                </span>
            </p>
            <p className="mt-5">
                سيتم إضافة إيراد بقيمة{" "}
                <span className="text-primary font-bold mx-2">
                    {Number.parseInt(paymentData.amount)}{" "}
                </span>
                بتاريخ اليوم
            </p>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                <Button
                    type="button"
                    color={"failure"}
                    className="me-4"
                    onClick={closeDrawer}
                >
                    إلغاء
                </Button>
                <Button
                    type="button"
                    color={"primary"}
                    onClick={() => {
                        setConfirm(true);
                        closeDrawer();
                    }}
                >
                    تأكيد
                </Button>
            </div>
        </div>
    );
};

const AdvancePaymentForm = ({ advance_info, callBack }) => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { showToast } = useToast();

    //////////////////////////////// form data ////////////////////////////////
    const [post, setPost] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [confirm, setConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm();

    ///// Handle Drawer
    const handleDrawer = (data) => {
        showDrawer(
            "تأكيد ",
            FaInfoCircle,
            <ConfirmAdvancePayment
                paymentData={data}
                setConfirm={setConfirm}
                closeDrawer={closeDrawer}
            />
        );
    };

    const onSubmit = (data) => {
        data.employee_name = advance_info.employee_display;
        data.amount = Number.parseFloat(data.amount);
        data.advance = advance_info.id;
        setPaymentData(data);

        handleDrawer(data);
    };

    const create_advance_payment = () => {
        defaultFormSubmission({
            url: endpoints.advance_payment_list,
            data: paymentData,
            formFunction: "add",
            setPost: setPost,
            showToast: showToast,
            message: {
                add: "تم تسجيل المبلغ",
            },
            reset: reset,
            callBack: () => {
                setConfirm(false);
                if (callBack) callBack();
            },
            setError: setError,
        });
    };

    useEffect(() => {
        if (confirm && paymentData) {
            create_advance_payment();
        }
    }, [confirm]);

    return (
        <>
            <div
                className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">
                    تسديد مبلغ من سلفة
                </h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <form
                    className="fields flex gap-x-10 gap-y-6 flex-wrap"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="totals w-full">
                        <h1 className="font-bold text-xl mb-4 lg:mb-8">
                            بيانات السلفة :
                        </h1>
                        <p className="ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                الموظف :{" "}
                            </span>
                            <span className="text-primary font-bold">
                                {advance_info.employee_display}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                المبلغ الكلى :{" "}
                            </span>
                            <span className="text-primary font-bold">
                                {Number.parseFloat(advance_info.amount).toFixed(
                                    2
                                )}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                المبلغ المدفوع :{" "}
                            </span>
                            <span className="text-primary font-bold">
                                {Number.parseFloat(
                                    advance_info.total_repaid
                                ).toFixed(2)}
                            </span>
                        </p>
                        <p className="mt-2 ms-10">
                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                المبلغ المتبقى :{" "}
                            </span>
                            <span className="text-primary font-bold">
                                {Number.parseFloat(
                                    advance_info.remaining_payments
                                ).toFixed(2)}
                            </span>
                        </p>
                    </div>
                    <div className="w-full"></div>
                    {advance_info.fully_paid ? (
                        <p className="w-full font-bold text-green-500 text-lg my-2 text-center">تم سداد السلفة بالكامل</p>
                    ) : (
                        <>
                            <div className="w-full lg:max-w-md lg:w-[30%]">
                                <div className="mb-2 block">
                                    <Label htmlFor="amount" value="المبلغ :" />
                                </div>
                                <TextInput
                                    id="amount"
                                    type="number"
                                    className="inline-block w-full"
                                    rightIcon={FaMoneyBill}
                                    placeholder="المبلغ"
                                    color={
                                        errors.amount ? "failure" : "primary"
                                    }
                                    {...register("amount", {
                                        required: "أدخل المبلغ",
                                        min: {
                                            value: 1,
                                            message: "أدخل المبلغ",
                                        },
                                        max: {
                                            value: Number.parseFloat(
                                                advance_info.remaining_payments
                                            ).toFixed(2),
                                            message: "قيمة أكبر من المسموح",
                                        },
                                    })}
                                    step={0.01}
                                    defaultValue={0}
                                    onBlur={() => trigger("amount")}
                                />

                                {errors.amount && (
                                    <p className="error-message">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            {/* Save Button */}
                            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                                <Button
                                    type="submit"
                                    color={"primary"}
                                    disabled={post}
                                    size={"xl"}
                                    isProcessing={post}
                                    processingSpinner={
                                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                    }
                                >
                                    تأكيد الدفع
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </>
    );
};

export default AdvancePaymentForm;
