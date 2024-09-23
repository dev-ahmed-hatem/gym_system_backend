import React, { useState } from "react";
import FormGroup from "../groups/FormGroup";
import { TextInput, Label } from "flowbite-react";
import { useForm } from "react-hook-form";
import { useToast } from "../../providers/ToastProvider";
import { defaultFormSubmission } from "../../config/actions";
import { CiBarcode } from "react-icons/ci";

const ChangeIdForm = ({ postURL, client, callBack }) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm();
    const formFunction = "edit";

    const onSubmit = (data) => {
        const url = `${postURL}change_id/`;

        defaultFormSubmission({
            url: url,
            data: data,
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { edit: "تم تعديل كود العميل" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title="تعديل كود عميل"
            formFunction={formFunction}
            post={post}
        >
            <div className="w-full">
                اسم العميل: <span className="ms-2">{client.name}</span>
            </div>
            <div className="w-full">
                الكود الحالي: <span className="ms-2">{client.id}</span>
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="new_id" value="الكود الجديد :" />
                </div>
                <TextInput
                    id="new_id"
                    type="number"
                    rightIcon={CiBarcode}
                    placeholder="الكود الجديد"
                    color={errors.new_id ? "failure" : "primary"}
                    {...register("new_id", {
                        required: "هذا الحقل مطلوب",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "كود العميل لا يحتوى على حروف",
                        },
                    })}
                    onBlur={() => trigger("new_id")}
                />
                {errors.new_id && (
                    <p className="error-message">{errors.new_id.message}</p>
                )}
            </div>
        </FormGroup>
    );
};

export default ChangeIdForm;
