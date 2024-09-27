import React, { useEffect, useState, useRef } from "react";
import JsBarcode from "jsbarcode";
import axios from "../../../config/axiosconfig";
import { Button, Label, Radio, TextInput } from "flowbite-react";
import { FiCopy } from "react-icons/fi";
import { HiDeviceMobile } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { MdEmail } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import endpoints from "../../../config/config";
import { useToast } from "../../../providers/ToastProvider";

const InvitationView = ({ inv, callBack }) => {
    const invRef = useRef(null);
    const [copied, setCopied] = useState(false);
    const [whatsapp, setWhatsapp] = useState(true);
    const [post, setPost] = useState(false);
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm();

    useEffect(() => {
        JsBarcode(invRef.current, inv.code, {
            format: "CODE128",
            height: 120,
            displayValue: true,
        });
    }, []);

    const copy = () => {
        navigator.clipboard
            .writeText(`${location.origin}/invitation-receipt/${inv.key}`)
            .then(() => {
                setCopied(true);
            });
    };

    const send = (data) => {
        const url = `${location.origin}/invitation-receipt/${inv.key}/`;
        if (data.phone) {
            window.open(
                `https://wa.me/${data.phone}?text=${encodeURIComponent(
                    `مرحباً، نود دعوتك للاستفادة من دعوة خاصة لزيارة PRO GYM
يمكنك استخدام الرابط أدناه للدخول إلى الدعوة والاستفادة من مميزاتنا الحصرية:
                    
${url}
                    
لأي استفسار، لا تتردد في التواصل معنا.
نتطلع لرؤيتك قريباً في PRO GYM!`
                )}`,
                "_blank"
            );
        } else {
            setPost(true);

            axios
                .post(endpoints.send_invitation_mail, {
                    email: data.email,
                    url: url,
                })
                .then((response) => {
                    showToast("تم إرسال البريد");
                })
                .catch((error) => {
                    showToast("خطأ أثناء تنفيذ العملية", true);
                })
                .finally(() => {
                    setPost(false);
                    if (callBack) callBack();
                });
        }
    };

    return (
        <div>
            <div className="text-center">
                <img
                    ref={invRef}
                    className="text-primary font-bold ms-2 inline-block h-[120px]"
                />
            </div>
            <br />
            كود الدعوة :{" "}
            <span className="text-primary font-bold ms-2 me-3 lg:me-5">
                {inv.code}
            </span>
            <br />
            الحالة :{" "}
            {inv.is_used ? (
                <span className="text-red-600 my-2 inline-block">منتهية</span>
            ) : (
                <span className="text-green-600 my-2 inline-block">
                    لم يتم الاستخدام
                </span>
            )}
            <br />
            الرابط :{" "}
            <div className="inline-flex items-center">
                <a href={`/invitation-receipt/${inv.key}`} target="_blank">
                    <Button
                        type="button"
                        color={"primary"}
                        className="w-32 h-10 inline-flex justify-center items-center m-3"
                        size={"xl"}
                    >
                        عرض الدعوة
                    </Button>
                </a>
                <div
                    className={`inline-flex h-10 w-9 shrink-0 items-center justify-center rounded-lg cursor-pointer border ${
                        copied
                            ? "bg-green-100 text-green-500 border-green-500"
                            : "bg-white text-primary border-primary"
                    } me-2`}
                    onClick={copy}
                    title="نسخ"
                >
                    <FiCopy className="h-5 w-5" />
                </div>
            </div>
            <br />
            <div className="text-base md:text-lg mt-3 inline-block me-4">
                إرسال عبر :
            </div>
            <div className="cont inline-flex flex-wrap gap-x-10 gap-y-2">
                <div className="flex gap-x-2 items-center max-md:w-[43%]">
                    <Radio
                        id="whatsapp"
                        onClick={(event) => {
                            if (event.target.value === "on") {
                                setWhatsapp(true);
                            }
                        }}
                        defaultChecked={whatsapp}
                        name="send-via"
                    />
                    <Label
                        htmlFor="whatsapp"
                        value="واتساب"
                        className="text-lg"
                    />
                </div>
                <div className="flex gap-x-3 items-center max-md:w-[43%]">
                    <Radio
                        id="mail"
                        onClick={(event) => {
                            if (event.target.value === "on") {
                                setWhatsapp(false);
                            }
                        }}
                        name="send-via"
                    />
                    <Label htmlFor="mail" value="بريد" className="text-lg" />
                </div>
            </div>
            <form
                onSubmit={handleSubmit(send)}
                className="fields flex gap-x-10 gap-y-6 flex-wrap mt-6"
            >
                {whatsapp && (
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="mobile" value="رقم الموبايل :" />
                        </div>
                        <TextInput
                            id="mobile"
                            type="tel"
                            rightIcon={HiDeviceMobile}
                            placeholder="رقم الموبايل"
                            color={errors.phone ? "failure" : "primary"}
                            {...register("phone", {
                                required: "أدخل رقم الموبايل",
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: "رقم الموبايل لا يحتوى على حروف",
                                },
                            })}
                            onBlur={() => trigger("phone")}
                        />
                        {errors.phone && (
                            <p className="error-message">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                )}
                {!whatsapp && (
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label
                                htmlFor="email"
                                value="البريد الالكترونى :"
                            />
                        </div>
                        <TextInput
                            id="email"
                            type="text"
                            rightIcon={MdEmail}
                            color={errors.email ? "failure" : "primary"}
                            {...register("email", {
                                required: "أدخل البريد الإلكترونى",
                                pattern: {
                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                    message: "بريد الكترونى غير صالح",
                                },
                            })}
                            placeholder="البريد الالكترونى"
                            onBlur={() => trigger("email")}
                        />
                        {errors.email && (
                            <p className="error-message">
                                {errors.email.message}
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
                        إرسال
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default InvitationView;
