import React, { useState } from "react";
import FormGroup from "../../groups/FormGroup";
import {
    TextInput,
    Label,
    ToggleSwitch,
    Textarea,
    Select,
} from "flowbite-react";
import { useForm } from "react-hook-form";
import { MdSubscriptions } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { FcInvite } from "react-icons/fc";
import { TbTimeDuration30 } from "react-icons/tb";
import { GiDuration } from "react-icons/gi";
import { PiNumberEightFill } from "react-icons/pi";
import { FaCircleStop } from "react-icons/fa6";
import { useToast } from "../../../providers/ToastProvider";
import { defaultFormSubmission } from "../../../config/actions";

const SubscriptionPlanForm = ({ postURL, defaultValues, callBack }) => {
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
    const [forStudents, setForStudents] = useState(
        formFunction === "edit" ? defaultValues?.for_students : false
    );
    const [isDuration, setIsDuration] = useState(
        formFunction === "edit" ? defaultValues?.is_duration : true
    );
    const [isFreezable, setIsFreezable] = useState(
        formFunction === "edit" ? defaultValues?.freezable : true
    );

    const onSubmit = (data) => {
        if (isFreezable && data.freeze_no == "") {
            data.freeze_no = 0;
        }
        data = {
            name: data["name"],
            invitations: Number(data.invitations),
            price: Number(data.price),
            description: data.description,
            for_students: forStudents,
            validity: Number(data.validity),
            is_duration: isDuration,
            days: data.days ? Number(data.days) : null,
            classes_no: data.classes_no ? Number(data.classes_no) : null,
            freezable: isFreezable,
            freeze_no: Number(data.freeze_no),
            subscription_type: data.subscription_type,
        };

        defaultFormSubmission({
            url: postURL,
            data: data,
            formFunction: formFunction,
            setPost: setPost,
            showToast: showToast,
            message: { add: "تم إضافة اشتراك جديد", edit: "تم تعديل الاشتراك" },
            reset: reset,
            callBack: callBack,
            setError: setError,
        });
    };

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة اشتراك" : "تعديل اشتراك"}
            formFunction={formFunction}
            post={post}
        >
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="subscription_type" value="النوع :" />
                </div>
                <Select
                    id="subscription_type"
                    type="select"
                    placeholder="النوع"
                    color={errors.subscription_type ? "failure" : "primary"}
                    {...register("subscription_type", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("subscription_type")}
                >
                    <option value={"main"} key={0}>
                        اشتراك أساسى
                    </option>
                    <option value={"sub"} key={1}>
                        اشتراك إضافى
                    </option>
                    <option value={"locker"} key={2}>
                        اشتراك لوكر
                    </option>
                </Select>
                {errors.subscription_type && (
                    <p className="error-message">
                        {errors.subscription_type.message}
                    </p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="name" value="اسم الاشتراك :" />
                </div>
                <TextInput
                    id="name"
                    type="text"
                    rightIcon={MdSubscriptions}
                    placeholder="اسم الاشتراك"
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
                    <Label htmlFor="price" value="السعر :" />
                </div>
                <TextInput
                    id="price"
                    type="number"
                    rightIcon={FaMoneyBill}
                    placeholder="السعر"
                    color={errors.price ? "failure" : "primary"}
                    {...register("price", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("price")}
                />
                {errors.price && (
                    <p className="error-message">{errors.price.message}</p>
                )}
            </div>
            <div className="w-full flex items-center lg:max-w-md lg:w-[30%] min-h-[70px] lg:pt-5">
                <div className="mb-2 me-10 hidden">
                    <Label htmlFor="for_students" value="اشتراك محدد بفترة :" />
                </div>
                <ToggleSwitch
                    id="for_students"
                    checked={isDuration}
                    onChange={setIsDuration}
                    label="اشتراك محدد بفترة"
                    sizing={"lg"}
                    color={"primary"}
                />
            </div>
            {isDuration && (
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="days" value="مدة الاشتراك : (يوم)" />
                    </div>
                    <TextInput
                        id="days"
                        type="number"
                        defaultValue={30}
                        rightIcon={TbTimeDuration30}
                        placeholder="مدة الاشتراك"
                        color={errors.days ? "failure" : "primary"}
                        {...register("days", {
                            required: "هذا الحقل مطلوب",
                        })}
                        onBlur={() => trigger("days")}
                    />
                    {errors.days && (
                        <p className="error-message">{errors.days.message}</p>
                    )}
                </div>
            )}
            {!isDuration && (
                <>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="classes_no" value="عدد الحصص :" />
                        </div>
                        <TextInput
                            id="classes_no"
                            type="number"
                            defaultValue={8}
                            rightIcon={PiNumberEightFill}
                            placeholder="عدد الحصص"
                            color={errors.classes_no ? "failure" : "primary"}
                            {...register("classes_no", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("classes_no")}
                        />
                        {errors.classes_no && (
                            <p className="error-message">
                                {errors.classes_no.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label
                                htmlFor="validity"
                                value="فترة صلاحية الاشتراك : (يوم)"
                            />
                        </div>
                        <TextInput
                            id="validity"
                            type="number"
                            rightIcon={GiDuration}
                            placeholder="فترة صلاحية الاشتراك"
                            color={errors.validity ? "failure" : "primary"}
                            defaultValue={30}
                            {...register("validity", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("validity")}
                        />
                        {errors.validity && (
                            <p className="error-message">
                                {errors.validity.message}
                            </p>
                        )}
                    </div>
                </>
            )}
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label
                        htmlFor="invitations"
                        value="عدد الدعوات المتاحة :"
                    />
                </div>
                <TextInput
                    id="invitations"
                    type="number"
                    rightIcon={FcInvite}
                    placeholder="عدد الدعوات المتاحة"
                    color={errors.invitations ? "failure" : "primary"}
                    defaultValue={0}
                    {...register("invitations", {
                        required: "هذا الحقل مطلوب",
                    })}
                    onBlur={() => trigger("invitations")}
                />
                {errors.invitations && (
                    <p className="error-message">
                        {errors.invitations.message}
                    </p>
                )}
            </div>
            <div className="w-full flex items-center lg:max-w-md lg:w-[30%] min-h-[70px] lg:pt-5">
                <div className="mb-2 me-10 hidden">
                    <Label htmlFor="for_students" value="اشتراك طلاب :" />
                </div>
                <ToggleSwitch
                    id="for_students"
                    checked={forStudents}
                    onChange={setForStudents}
                    label="اشتراك طلاب "
                    sizing={"lg"}
                    color={"primary"}
                />
            </div>
            <div className="w-full flex items-center lg:max-w-md lg:w-[30%] min-h-[70px] lg:pt-5">
                <div className="mb-2 me-10 hidden">
                    <Label htmlFor="freezable" value="اشتراك قابل للتعليق :" />
                </div>
                <ToggleSwitch
                    id="freezable"
                    checked={isFreezable}
                    onChange={setIsFreezable}
                    label="اشتراك قابل للتعليق"
                    sizing={"lg"}
                    color={"primary"}
                />
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label
                        className={`${isFreezable ? "" : "text-gray-400"}`}
                        htmlFor="freeze_no"
                        value="مدة التعليق : (يوم)"
                    />
                </div>
                <TextInput
                    id="freeze_no"
                    type="number"
                    defaultValue={7}
                    rightIcon={FaCircleStop}
                    placeholder="مدة التعليق"
                    color={errors.freeze_no ? "failure" : "primary"}
                    {...register("freeze_no", {})}
                    onBlur={() => trigger("freeze_no")}
                    disabled={!isFreezable}
                />
                {errors.freeze_no && (
                    <p className="error-message">{errors.freeze_no.message}</p>
                )}
            </div>
            <div className="w-full lg:max-w-md lg:w-[30%]">
                <div className="mb-2 block">
                    <Label htmlFor="description" value="إضافة وصف :" />
                </div>
                <Textarea
                    id="description"
                    placeholder="وصف"
                    color={"primary"}
                    {...register("description", {})}
                    rows={3}
                />

                {errors.description && (
                    <p className="error-message">
                        {errors.description.message}
                    </p>
                )}
            </div>
        </FormGroup>
    );
};

export default SubscriptionPlanForm;
