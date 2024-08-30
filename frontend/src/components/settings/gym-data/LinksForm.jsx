import React, { useState } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label } from "flowbite-react";
import { useForm } from "react-hook-form";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import CustomFileInput from "../../groups/CustomFileInput";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";
import { HiOutlineExternalLink } from "react-icons/hi";

const LinksForm = ({ postURL, defaultValues, callBack }) => {
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
        defaultValues: defaultValues ?? null,
    });
    const formFunction = defaultValues ? "edit" : "add";

    const onSubmit = (data) => {
        setPost(true);

        // check whether logo is a valid
        if (!(data["logo"] instanceof File)) {
            delete data["logo"];
        }

        defaultFormSubmission({
            url: postURL,
            data: data,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة رابط", edit: "تم تعديل الرابط" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };
    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة رابط" : "تعديل رابط"}
            formFunction={formFunction}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="title" value="الاسم :" />
                </div>
                <TextInput
                    id="title"
                    type="text"
                    rightIcon={MdOutlineDriveFileRenameOutline}
                    placeholder="الاسم"
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
                    <Label htmlFor="url" value="الرابط :" />
                </div>
                <TextInput
                    id="url"
                    type="text"
                    rightIcon={HiOutlineExternalLink}
                    placeholder="الرابط"
                    color={errors.url ? "failure" : "primary"}
                    {...register("url", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("url")}
                />

                {errors.url && (
                    <p className="error-message">{errors.url.message}</p>
                )}
            </div>
            <div className="seperator w-full h-0"></div>

            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="icon" value="الصورة :" />
                </div>
                <CustomFileInput
                    register={register}
                    setValue={setValue}
                    name={"icon"}
                    error={errors.icon ? "صورة غير صالحة" : null}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    onBlur={() => {
                        trigger("icon");
                    }}
                />
            </div>

            {formFunction === "edit" && (
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label value="الأيقون الحالية :" />
                    </div>
                    {defaultValues?.icon ? (
                        <img
                            src={defaultValues.icon}
                            width={100}
                            height={100}
                            alt=""
                        />
                    ) : (
                        <p className="error-message">لا توجد صورة</p>
                    )}
                </div>
            )}
        </FormGroup>
    );
};

export default LinksForm;
