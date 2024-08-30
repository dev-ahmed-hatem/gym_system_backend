import React, { useState } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Textarea } from "flowbite-react";
import { useForm } from "react-hook-form";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import CustomFileInput from "../../groups/CustomFileInput";
import endpoints from "../../../config/config";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";
import { HiDeviceMobile } from "react-icons/hi";

const GymDataForm = ({ gymData, callBack }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
        setValue,
    } = useForm({
        defaultValues: gymData ?? null,
    });

    const onSubmit = (data) => {
        setPost(true);

        // check whether logo is a valid
        if (!(data["logo"] instanceof File)) {
            delete data["logo"];
        }

        defaultFormSubmission({
            url: `${endpoints.gym_data}1/`,
            data: data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            formFunction: "edit",
            setPost: setPost,
            showToast: showToast,
            message: { edit: "تم تعديل البيانات" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };
    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={"تعديل بيانات الجيم"}
            formFunction={"edit"}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="title" value="اسم الجيم :" />
                </div>
                <TextInput
                    id="title"
                    type="text"
                    rightIcon={MdOutlineDriveFileRenameOutline}
                    placeholder="اسم الجيم"
                    color={errors.title ? "failure" : "primary"}
                    {...register("title", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("title")}
                />

                {errors.title && (
                    <p className="error-message">{errors.title.message}</p>
                )}
            </div>

            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="telephone" value="رقم التواصل :" />
                </div>
                <TextInput
                    id="telephone"
                    type="tel"
                    rightIcon={HiDeviceMobile}
                    placeholder="رقم التواصل"
                    color={errors.telephone ? "failure" : "primary"}
                    {...register("telephone", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "رقم الموبايل لا يحتوى على حروف",
                        },
                    })}
                    onBlur={() => trigger("telephone")}
                />
                {errors.telephone && (
                    <p className="error-message">{errors.telephone.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="address" value="العنوان :" />
                </div>
                <Textarea
                    id="address"
                    placeholder="العنوان"
                    color={"primary"}
                    {...register("address", {})}
                    rows={3}
                />

                {errors.address && (
                    <p className="error-message">{errors.address.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="logo" value="الصورة :" />
                </div>
                <CustomFileInput
                    register={register}
                    setValue={setValue}
                    name={"logo"}
                    error={errors.logo ? "صورة غير صالحة" : null}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    onBlur={() => {
                        trigger("logo");
                    }}
                />
            </div>

            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label value="الصورة الحالية :" />
                </div>
                {gymData?.logo ? (
                    <img src={gymData.logo} width={100} alt="" />
                ) : (
                    <p className="error-message">لا توجد صورة</p>
                )}
            </div>
        </FormGroup>
    );
};

export default GymDataForm;
