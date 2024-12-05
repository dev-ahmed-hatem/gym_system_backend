import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Datepicker, Textarea } from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import CustomFileInput from "../../groups/CustomFileInput";

const NewsForm = ({ postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 10);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
        control,
        setValue,
        watch,
        clearErrors,
    } = useForm({
        defaultValues: {
            ...defaultValues,
        },
    });

    const created_at = watch("created_at");

    const [selectedFile, setSelectedFile] = useState(null);
    const formFunction = defaultValues ? "edit" : "add";

    const onSubmit = (data) => {
        if (
            new Date(created_at).setHours(0, 0, 0, 0) >
            new Date().setHours(0, 0, 0, 0)
        ) {
            setError("created_at", {
                type: "manual",
                message: "تاريخ لم يأت بعد",
            });
            return;
        } else {
            clearErrors();
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
            message: { add: "تم إضافة خير جديد", edit: "تم تعديل الخبر" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة خبر" : "تعديل خبر"}
            post={post}
            formFunction={formFunction}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="title" value="اسم الخبر :" />
                </div>
                <TextInput
                    id="title"
                    type="text"
                    rightIcon={MdOutlineDriveFileRenameOutline}
                    placeholder="اسم الخبر"
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
                    <Label htmlFor="created_at" value="تاريخ النشر :" />
                </div>
                <Controller
                    name="created_at"
                    control={control}
                    rules={{ required: "هذا الحقل مطلوب" }}
                    defaultValue={today.toLocaleDateString("en-CA")}
                    render={({ field }) => (
                        <Datepicker
                            selected={field.value}
                            id="created_at"
                            language="ar"
                            labelClearButton="مسح"
                            labelTodayButton="اليوم"
                            placeholder="تاريخ النشر"
                            maxDate={new Date()}
                            color={errors.created_at ? "failure" : "primary"}
                            onSelectedDateChanged={(date) => {
                                field.onChange(
                                    date.toLocaleDateString("en-CA")
                                );
                            }}
                            {...field}
                        />
                    )}
                />
                {errors.created_at && (
                    <p className="error-message">{errors.created_at.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="content" value="المحتوي :" />
                </div>
                <Textarea
                    id="content"
                    placeholder="المحتوي"
                    color={"primary"}
                    {...register("content", {})}
                    rows={3}
                />

                {errors.content && (
                    <p className="error-message">{errors.content.message}</p>
                )}
            </div>

            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="picture" value="الصورة :" />
                </div>
                <CustomFileInput
                    register={register}
                    setValue={setValue}
                    name={"picture"}
                    error={errors.picture ? "صورة غير صالحة" : null}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                    onBlur={() => {
                        trigger("picture");
                    }}
                />
            </div>

            {formFunction === "edit" && (
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label value="الصورة الحالية :" />
                    </div>
                    {defaultValues?.picture ? (
                        <img
                            src={defaultValues.picture}
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

export default NewsForm;
