import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, TextInput } from "flowbite-react";
import axios from "axios";
import endpoints from "../../../config";
import { MdSubscriptions } from "react-icons/md";
import { useForm } from "react-hook-form";
import SubscriptionAdd from "./SubscriptionAdd";
import SubscriptionFreeze from "./SubscriptionFreeze";

const fetchData = (code, setData, setFetchError, setPost) => {
    setData(null);
    if (setPost) {
        setPost(true);
    }
    const url = `${endpoints.subscription_list}code=${code}`;
    // return

    axios
        .get(url)
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            console.log(error);
            setFetchError(error);
        })
        .finally(() => {
            if (setPost) {
                setPost(false);
            }
        });
};

const SubscriptionEditForm = ({ setFetchError, setData }) => {
    const [post, setPost] = useState(false);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        fetchData(data.code, setData, setFetchError, setPost);
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">بحث بكود الاشتراك :</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="code" value="الكود :" />
                    </div>
                    <TextInput
                        id="code"
                        type="number"
                        rightIcon={MdSubscriptions}
                        placeholder="الكود"
                        color={errors.code ? "failure" : "primary"}
                        {...register("code", {
                            required: "أدخل كود الاشتراك",
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

const SubscriptionEdit = () => {
    //////////////////////////////// list data ////////////////////////////////
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);

    return (
        <>
            {/* search form */}
            <SubscriptionEditForm
                setFetchError={setFetchError}
                setData={setData}
            />

            {/* table data */}
            {(data || fetchError) && (
                <>
                    {fetchError ? (
                        <div
                            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                        >
                            <h1 className="font-bold text-text text-lg">خطأ</h1>
                            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                            <p className="text-lg text-center text-red-600 py-4">
                                خطأ في تحميل البيانات
                            </p>
                        </div>
                    ) : data.count == 0 ? (
                        <div
                            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                        >
                            <h1 className="font-bold text-text text-lg">
                                كود اشتراك غير موجود
                            </h1>
                            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                            <p className="text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                لا توجد بيانات
                            </p>
                        </div>
                    ) : (
                        <>
                            <SubscriptionAdd
                                defaultValues={data?.results[0]}
                                postURL={data?.results[0]?.url}
                                callBack={() => {
                                    fetchData(
                                        data?.results[0].id,
                                        setData,
                                        setFetchError
                                    );
                                }}
                            />
                            {/* freeze options */}
                            <SubscriptionFreeze sub={data?.results[0]} />
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default SubscriptionEdit;
