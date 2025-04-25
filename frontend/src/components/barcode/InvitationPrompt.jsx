import React, { useState } from "react";
import { Label, Button, TextInput } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "../../config/axiosconfig";
import endpoints from "../../config/config";
import { useToast } from "../../providers/ToastProvider";
import { HiUser } from "react-icons/hi";
import { useForm } from "react-hook-form";

const InvitationPrompt = ({ invitation, subscription, callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setError
    } = useForm();

    const submit = (data) => {
        setPost(true);
        data = {
            invitation: invitation.id,
            guest_name: data.name,
            unique_number: data.unique_number,
            subscription: subscription.id,
        };

        axios
            .post(endpoints.attendance, data)
            .then((response) => {
                showToast("تم تسجيل الحضور");
                if (callBack) callBack();
            })
            .catch((error) => {
                console.log(error);
                if (error.response?.status == 400 && error.response?.data?.unique_number) {
                    const unique_number = error.response.data.unique_number;
                        setError("unique_number", {
                            type: "server",
                            message: `لقد تمت دعوة العميل ${unique_number.guest} من قبل`,
                        });
                } else{
                    showToast("خطأ فى تنفيذ العملية", true);
                }
            })
            .finally(() => {
                setPost(false);
            });
    };

    return (
        <div>
            <h1 className="text-text text-base lg:text-lg my-3">
                اسم العميل :{" "}
                <span className="text-primary font-bold ms-2 me-3 lg:me-5">
                    {subscription.client_name}
                </span>
                <br />
                كود العميل :{" "}
                <span className="text-primary font-bold ms-2">
                    {subscription.client_id}
                </span>
                <br />
                <br />
                الاشتراك :{" "}
                <span className="text-primary font-bold ms-2">
                    {subscription.plan.name}
                </span>
                <br />
                كود الاشتراك :{" "}
                <span className="text-primary font-bold ms-2">
                    {subscription.id}
                </span>
                <br />
            </h1>
            {subscription.is_blocked ? (
                <p className="text-base lg:text-2xl text-center text-red-600 py-4">
                    محظور
                </p>
            ) : !invitation.is_valid ? (
                <p className="text-base lg:text-lg text-center text-red-600 py-4">
                    كود دعوة منتهي
                </p>
            ) : (
                <>
                    <form onSubmit={handleSubmit(submit)}>
                        <div className="w-full flex gap-8 flex-wrap my-4">

                            <div className="w-full lg:max-w-md lg:w-[30%]">
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="اسم المدعو :" />
                                </div>
                                <TextInput
                                    id="name"
                                    type="text"
                                    rightIcon={HiUser}
                                    placeholder="اسم المدعو"
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
                                    <Label htmlFor="unique_number" value="رقم الموبايل :" />
                                </div>
                                <TextInput
                                    id="unique_number"
                                    type="text"
                                    rightIcon={HiUser}
                                    placeholder="رقم الموبايل"
                                    color={errors.unique_number ? "failure" : "primary"}
                                    {...register("unique_number", {
                                        required: "هذا الحقل مطلوب",
                                    })}
                                    onBlur={() => trigger("unique_number")}
                                    />

                                {errors.unique_number && (
                                    <p className="error-message">
                                        {errors.unique_number.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap max-h-12 min-w-full justify-center mt-3">
                            <Button
                                color={"primary"}
                                type="submit"
                                disabled={post}
                                className="h-14 flex justify-center items-center text-lg"
                                size={"xl"}
                                isProcessing={post}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                استخدام الدعوة
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default InvitationPrompt;
