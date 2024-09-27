import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, TextInput } from "flowbite-react";
import { MdOutlinePermIdentity } from "react-icons/md";
import { useForm } from "react-hook-form";
import SubscriptionsPrompt from "./SubscriptionsPrompt";
import { FaInfoCircle } from "react-icons/fa";
import endpoints from "../../config/config";
import { useToast } from "../../providers/ToastProvider";
import axios from "../../config/axiosconfig";
import { useDrawer } from "../../providers/DrawerProvider";
import InvitationPrompt from "./InvitationPrompt";

const ClientIdForm = () => {
    const [post, setPost] = useState(false);
    const audio = new Audio("./success.mp3");
    const { showDrawer, closeDrawer } = useDrawer();
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        setPost(true);

        const checkCode = async (code) => {
            axios
                .post(endpoints.scanner_code, { code: code })
                .then((response) => {
                    audio.play();
                    showDrawer(
                        `تسجيل حضور${
                            response?.data?.invitation ? " دعوة" : ""
                        }`,
                        FaInfoCircle,
                        response.data.invitation ? (
                            <InvitationPrompt
                                invitation={response.data.invitation}
                                subscription={response.data.subscription}
                                callBack={() => {
                                    closeDrawer();
                                }}
                            />
                        ) : (
                            <SubscriptionsPrompt
                                subscriptions={response.data.subscriptions}
                                client={response.data.client}
                                callBack={() => {
                                    closeDrawer();
                                }}
                            />
                        )
                    );
                })
                .catch((error) => {
                    showToast(error.response.data.error, true);
                })
                .finally(() => {
                    reset();
                    setPost(false);
                });
        };

        checkCode(data.code);
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">بحث الباركود :</h1>
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
                        type="text"
                        rightIcon={MdOutlinePermIdentity}
                        placeholder="الكود"
                        color={errors.code ? "failure" : "primary"}
                        {...register("code", {
                            required: "أدخل كود العميل",
                            pattern: {
                                value: /^[0-9]\d*$|^i-\d+$/,
                                message: "كود غير صالح",
                            },
                        })}
                        autoFocus
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

export default ClientIdForm;
