import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, TextInput } from "flowbite-react";
import { MdSubscriptions } from "react-icons/md";
import { useForm } from "react-hook-form";
import { get_advance_data } from "./utils";

const AdvanceCollectForm = ({ setFetchError, setData, post, setPost }) => {
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        get_advance_data(data.code, setData, setFetchError, setPost);
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">سداد مبلغ من سلفة</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="code" value="رقم السلفة :" />
                    </div>
                    <TextInput
                        id="code"
                        type="number"
                        rightIcon={MdSubscriptions}
                        placeholder="رقم السلفة"
                        color={errors.code ? "failure" : "primary"}
                        {...register("code", {
                            required: "أدخل رقم السلفة",
                            pattern: {
                                value: /^[1-9]\d*$/,
                                message: "أدخل رقم صحيح موجب",
                            },
                        })}
                        onBlur={() => trigger("code")}
                    />
                    {errors.code && (
                        <p className="error-message">{errors.code.message}</p>
                    )}
                </div>
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

export default AdvanceCollectForm;
