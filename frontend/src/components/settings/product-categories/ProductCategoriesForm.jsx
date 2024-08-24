import React, { useState } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label } from "flowbite-react";
import { MdSubscriptions } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";

const ProductCategoriesForm = ({ postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm({ defaultValues: defaultValues });
    const formFunction = defaultValues ? "edit" : "add";

    const onSubmit = (data) => {
        defaultFormSubmission({
            url: postURL,
            data: data,
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة فئة جديدة", edit: "تم تعديل الفئة" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };
    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة فئة جديدة" : "تعديل فئة"}
            formFunction={formFunction}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="اسم الفئة :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
                    rightIcon={MdSubscriptions}
                    placeholder="اسم الفئة"
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
        </FormGroup>
    );
};

export default ProductCategoriesForm;
