import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label } from "flowbite-react";
import { HiLockClosed, HiDeviceMobile, HiUser } from "react-icons/hi";
import { HiMiniIdentification } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";

const ManagersForm = ({ postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
        setError,
        clearErrors,
        reset,
    } = useForm({ defaultValues: defaultValues });
    const formFunction = defaultValues ? "edit" : "add";
    const password = watch("password");
    const password2 = watch("password2");

    useEffect(() => {
        if (password2) {
            if (password !== password2) {
                setError("password2", {
                    type: "manual",
                    message: "كلمة مرور غير متطابقة",
                });
            } else {
                clearErrors("password2");
            }
        }
    }, [password, password2]);

    const onSubmit = (data) => {
        data["is_superuser"] = true;
        defaultFormSubmission({
            url: postURL,
            data: data,
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة مدير جديد", edit: "تم تعديل المدير" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة مدير" : "تعديل مدير"}
            formFunction={formFunction}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="اسم المدير :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
                    rightIcon={HiUser}
                    placeholder="اسم المدير"
                    color={errors.name ? "failure" : "primary"}
                    {...register("name", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("name")}
                />

                {errors.name && (
                    <p className="error-message">{errors.name.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label
                        htmlFor="username"
                        value="اسم المستخدم : (يستخدم لتسجيل الدخول)"
                    />
                </div>
                <TextInput
                    id="username"
                    type="text"
                    rightIcon={HiUser}
                    placeholder="اسم المستخدم"
                    color={errors.username ? "failure" : "primary"}
                    {...register("username", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[\w.@+-]+$/,
                            message: "اسم المستخدم غير مناسب",
                        },
                    })}
                    onBlur={() => trigger("username")}
                />
                {errors.username && (
                    <p className="error-message">{errors.username.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="pass" value="كلمة المرور :" />
                </div>
                <TextInput
                    id="pass"
                    type="password"
                    rightIcon={HiLockClosed}
                    placeholder="كلمة المرور"
                    color={errors.password ? "failure" : "primary"}
                    {...register("password", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("password")}
                />
                {errors.password && (
                    <p className="error-message">{errors.password.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="pass2" value="تأكيد كلمة المرور :" />
                </div>
                <TextInput
                    id="pass2"
                    type="password"
                    rightIcon={HiLockClosed}
                    placeholder="تأكيد كلمة المرور"
                    color={errors.password2 ? "failure" : "primary"}
                    {...register("password2", {
                        required: "هذا الحقل مطلوب",
                        validate: (value) =>
                            value === password || "كلمة مرور غير متطابقة",
                    })}
                    onBlur={() => trigger("password2")}
                />
                {errors.password2 && (
                    <p className="error-message">{errors.password2.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="mobile" value="رقم الهاتف :" />
                </div>
                <TextInput
                    id="mobile"
                    type="tel"
                    rightIcon={HiDeviceMobile}
                    placeholder="رقم الهاتف"
                    color={errors.phone ? "failure" : "primary"}
                    {...register("phone", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "رقم الموبايل لا يحتوى على حروف",
                        },
                    })}
                    onBlur={() => trigger("phone")}
                />
                {errors.phone && (
                    <p className="error-message">{errors.phone.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="id-num" value="رقم الهوية :" />
                </div>
                <TextInput
                    id="id-num"
                    type="text"
                    rightIcon={HiMiniIdentification}
                    placeholder="رقم الهوية"
                    color={errors.national_id ? "failure" : "primary"}
                    {...register("national_id", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "رقم الهوية لا يحتوى على حروف",
                        },
                    })}
                    onBlur={() => trigger("national_id")}
                />
                {errors.national_id && (
                    <p className="error-message">
                        {errors.national_id.message}
                    </p>
                )}
            </div>
        </FormGroup>
    );
};

export default ManagersForm;
