import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label } from "flowbite-react";
import { HiLockClosed, HiUser } from "react-icons/hi";
import axios from "../../../config/axiosconfig";
import { useForm, Controller } from "react-hook-form";
import endpoints from "../../../config/config";
import Select from "react-select";
import style from "../../../assets/rect-select-style";
import { useToast } from "../../../providers/ToastProvider";

const ModeratorsForm = ({ postURL, defaultValues, callBack }) => {
    const [post, setPost] = useState(false);
    const [employeesList, setEmployeesList] = useState(null);
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
        setError,
        clearErrors,
        reset,
        control,
    } = useForm({
        defaultValues: { ...defaultValues, ...defaultValues?.user },
    });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.patch;
    const password = watch("password");
    const password2 = watch("password2");

    const { showToast } = useToast();

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

    // custom onsubmit method, has barely different signature from defaultFoemSubmittion
    const onSubmit = (data) => {
        data = {
            user: {
                username: data.username,
                password: data.password,
                password2: data.password2,
                is_moderator: true,
            },
            employee: data.employee.value,
        };

        if (defaultValues?.user?.username == data.user.username) {
            delete data.user.username;
        }

        setPost(true);
        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                showToast(
                    formFunction == "add"
                        ? "تم إضافة مشرف جديد"
                        : "تم تعديل المشرف"
                );
                reset();
                if (callBack) callBack();
            })
            .catch((error) => {
                console.log(error);
                // handle possible errors
                if (error.response && error.response.data) {
                    const serverErrors = error.response.data;
                    if (serverErrors.user?.username) {
                        const message =
                            serverErrors.user.username[0].search("exists") == -1
                                ? "قيمة غير صالحة"
                                : "اسم المستخدم موجود سابقا";
                        setError("username", {
                            type: "server",
                            message: message,
                        });
                    }
                    if (
                        serverErrors.user?.password ||
                        serverErrors.user?.password2
                    ) {
                        setError("password", {
                            type: "server",
                            message: "كلمة مرور غير متطابقة",
                        });
                        setError("password2", {
                            type: "server",
                            message: "كلمة مرور غير متطابقة",
                        });
                    }
                    if (serverErrors.employee) {
                        setError("employee", {
                            type: "server",
                            message: "هذا الموظف لديه حساب مشرف مسبق",
                        });
                    }
                } else {
                    showToast("خطأ فى تنفيذ العملية", true);
                }
            })
            .finally(() => {
                setPost(false);
            });
    };

    const fetchEmployees = (search_word) => {
        const options = [];
        const url = `${endpoints.employee_list}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((employee) => {
                    options.push({ value: employee.id, label: `${employee.id} - ${employee.name}` });
                });
                setEmployeesList(options);
            })
            .catch((error) => {
                setEmployeesList(null);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة مشرف" : "تعديل مشرف"}
            formFunction={formFunction}
            post={post}
        >
            {formFunction === "add" && (
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="اختر موظف :" />
                    </div>

                    <Controller
                        name="employee"
                        control={control}
                        rules={{ required: "يجب اختيار موظف" }}
                        render={({ field }) => (
                            <>
                                <Select
                                    isClearable
                                    noOptionsMessage={() =>
                                        "لا يوجد نتائج مطابقة"
                                    }
                                    placeholder="بحث ..."
                                    options={employeesList || []}
                                    onInputChange={fetchEmployees}
                                    value={field.value}
                                    onBlur={() => {
                                        trigger("employee");
                                    }}
                                    {...field}
                                    styles={style(errors.employee)}
                                ></Select>
                                {errors.employee && (
                                    <p className="error-message">
                                        {errors.employee.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>
            )}
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
        </FormGroup>
    );
};

export default ModeratorsForm;
