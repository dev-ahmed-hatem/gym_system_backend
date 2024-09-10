import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, TextInput } from "flowbite-react";
import { MdSubscriptions } from "react-icons/md";
import { useForm } from "react-hook-form";
import endpoints from "../../../config/config";
import { fetch_list_data } from "../../../config/actions";

const AdvanceCollectForm = ({ setFetchError, setData }) => {
    const [post, setPost] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm();

    const get_advance_data = (code, setData, setFetchError, setPost) => {
        setData(null);
        if (setPost) {
            setPost(true);
        }
        const url = `${endpoints.advance_list}code=${code}`;

        fetch_list_data({
            searchURL: url,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: (bool) => {
                if (setPost) setPost(bool);
            },
        });
    };

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
