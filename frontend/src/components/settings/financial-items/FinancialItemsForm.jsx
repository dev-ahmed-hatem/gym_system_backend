import React, { useState } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import { MdSubscriptions } from "react-icons/md";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";

const FinancialItemsForm = ({ postURL, defaultValues, callBack }) => {
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
            message: { add: "تم إضافة بند جديد", edit: "تم تعديل البند" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };
    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة بند جديد" : "تعديل بند"}
            formFunction={formFunction}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="اسم البند :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
                    rightIcon={MdSubscriptions}
                    placeholder="اسم البند"
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
                    <Label htmlFor="financial_type" value="النوع :" />
                </div>
                <Select
                    id="financial_type"
                    type="select"
                    placeholder="النوع"
                    color={errors.financial_type ? "failure" : "primary"}
                    {...register("financial_type", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("financial_type")}
                >
                    <option value={"expenses"} key={0}>
                        مصروفات
                    </option>
                    <option value={"incomes"} key={1}>
                        إيرادات
                    </option>
                </Select>
                {errors.financial_type && (
                    <p className="error-message">
                        {errors.financial_type.message}
                    </p>
                )}
            </div>
        </FormGroup>
    );
};

export default FinancialItemsForm;
