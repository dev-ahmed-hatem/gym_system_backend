import React, { useState, useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, Datepicker, TextInput } from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import { HiUser } from "react-icons/hi";

const BarcodeReportForm = ({ setFormData, client, action }) => {
    const [post, setPost] = useState(false);
    const today = new Date().toLocaleDateString("en-CA");
    const {
        handleSubmit,
        formState: { errors },
        setError,
        control,
        watch,
        clearErrors,
        register,
        trigger,
    } = useForm({ defaultValues: { from: today, to: today } });
    const from = watch("from");
    const to = watch("to");

    useEffect(() => {
        if (to < from) {
            setError("to", {
                type: "manual",
                message: "تاريخ النهاية أقدم من تاريخ البداية",
            });
        } else {
            clearErrors();
        }
        setFormData({from: from, to: to});
    }, [from, to]);

    const onSubmit = (data) => {
        if (data.to < data.from) {
            setError("to", {
                type: "manual",
                message: "تاريخ النهاية أقدم من تاريخ البداية",
            });
            return;
        }
        
        setFormData(data);
        action({data: data, setPost: setPost});
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">
                سجل الحضور في الفترة :
            </h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="from" value="من :" />
                    </div>
                    <Controller
                        name="from"
                        control={control}
                        rules={{ required: "" }}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="from"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="من"
                                color={"primary"}
                                onSelectedDateChanged={(date) => {
                                    field.onChange(
                                        date.toLocaleDateString("en-CA")
                                    );
                                }}
                                {...field}
                            />
                        )}
                    />
                    {errors.from && (
                        <p className="error-message">{errors.from.message}</p>
                    )}
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="to" value="إلى :" />
                    </div>
                    <Controller
                        name="to"
                        control={control}
                        rules={{ required: "هذا الحقل مطلوب" }}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="to"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="إلى"
                                color={errors.to ? "failure" : "primary"}
                                onSelectedDateChanged={(date) => {
                                    field.onChange(
                                        date.toLocaleDateString("en-CA")
                                    );
                                }}
                                {...field}
                            />
                        )}
                    />
                    {errors.to && (
                        <p className="error-message">{errors.to.message}</p>
                    )}
                </div>

                {client && (
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="client" value="كود العميل :" />
                        </div>
                        <TextInput
                            id="client"
                            type="number"
                            rightIcon={HiUser}
                            placeholder="كود العميل"
                            color={errors.client ? "failure" : "primary"}
                            {...register("client", {
                                required: "أدخل كود العميل",
                                pattern: {
                                    value: /^[1-9]\d*$/,
                                    message: "أدخل رقم صحيح موجب",
                                },
                            })}
                            onBlur={() => trigger("client")}
                        />
                        {errors.client && (
                            <p className="error-message">
                                {errors.client.message}
                            </p>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                    <Button
                        type="submit"
                        color={"primary"}
                        disabled={post}
                        className="w-32 h-10 flex justify-center items-center"
                        size={"xl"}
                        isProcessing={post}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        بحث
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BarcodeReportForm;
