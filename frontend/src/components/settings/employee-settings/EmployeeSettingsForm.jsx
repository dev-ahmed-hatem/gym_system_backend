import React, { useState, useEffect } from "react";
import FormGroup from "../../groups/FormGroup";
import { TextInput, Label, Select as FlowbiteSelect } from "flowbite-react";
import Loading from "../../groups/Loading";
import { useForm } from "react-hook-form";
import endpoints from "../../../config/config";
import { useToast } from "../../../providers/ToastProvider";
import {
    defaultFormSubmission,
    fetch_list_data,
} from "../../../config/actions";

const changeCurrentSetting = (event, setCurrentSetting) => {
    switch (event.target.value) {
        case "nationality":
            setCurrentSetting({
                value: "nationality",
                name: "الجنسية",
                list_url: endpoints.nationality_list,
            });
            break;
        case "marital-status":
            setCurrentSetting({
                value: "marital-status",
                name: "الحالة الاجتماعية",
                list_url: endpoints.marital_status_list,
            });
            break;
        case "employee-type":
            setCurrentSetting({
                value: "employee-type",
                name: "نوع الموظف",
                list_url: endpoints.employee_type_list,
            });
            break;
        case "city":
            setCurrentSetting({
                value: "city",
                name: "المدينة",
                list_url: endpoints.city_list,
            });
            break;
        case "city-district":
            setCurrentSetting({
                value: "city-district",
                name: "الحى",
                list_url: endpoints.city_district_list,
            });
            break;
    }
};

const EmployeeSettingsForm = ({
    postURL,
    currentSetting,
    setCurrentSetting,
    defaultValues,
    callBack,
}) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        defaultValues: { ...defaultValues, city: defaultValues?.city?.id },
    });
    const [citiesList, setCitiesList] = useState(null);
    const formFunction = defaultValues ? "edit" : "add";
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    const onSubmit = (data) => {
        if (currentSetting.value === "city-district") {
            if (data.city === "") {
                data.city = citiesList ? citiesList[0].id : null;
            } else {
                data.city = Number(data.city);
            }
        }

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

    const fetchCities = () => {
        setLoading(true);
        const url = `${endpoints.city_list}no_pagination=true&ordering=-id`;

        fetch_list_data({
            searchURL: url,
            setData: setCitiesList,
            setFetchError: (error) => {
                setFetchError(error);
                setCitiesList(null);
            },
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        if (currentSetting.value == "city-district") {
            fetchCities();
        }
    }, [currentSetting]);

    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={
                formFunction == "add"
                    ? "إضافة اختيارات بنود الموظفين"
                    : "تعديل بند"
            }
            post={post}
            formFunction={formFunction}
        >
            {loading ? (
                <Loading className={`w-full text-center`} />
            ) : fetchError ? (
                <p className="text-lg text-center text-red-600 py-4 w-full m-auto">
                    خطأ في تحميل البيانات
                </p>
            ) : (
                <>
                    {formFunction === "add" && (
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label htmlFor="options" value="اختيارات :" />
                            </div>
                            <FlowbiteSelect
                                id="options"
                                type="select"
                                color={"primary"}
                                onChange={(event) => {
                                    changeCurrentSetting(
                                        event,
                                        setCurrentSetting
                                    );
                                }}
                                value={currentSetting.value}
                            >
                                <option value={"nationality"} key={0}>
                                    الجنسية
                                </option>
                                <option value={"marital-status"} key={1}>
                                    الحالة الاجتماعية
                                </option>
                                <option value={"employee-type"} key={2}>
                                    نوع الموظف
                                </option>
                                <option value={"city"} key={3}>
                                    المدينة
                                </option>
                                <option value={"city-district"} key={4}>
                                    الحي
                                </option>
                            </FlowbiteSelect>
                            {errors.financial_type && (
                                <p className="error-message">
                                    {errors.financial_type.message}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="name" value="الاسم :" />
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            color={errors.name ? "failure" : "primary"}
                            {...register("name", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("name")}
                        />

                        {errors.name && (
                            <p className="error-message">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {currentSetting.value === "city-district" && (
                        <div className="w-full lg:max-w-md lg:w-[30%]">
                            <div className="mb-2 block">
                                <Label htmlFor="city" value="المدينة :" />
                            </div>
                            <FlowbiteSelect
                                id="city"
                                type="select"
                                placeholder="المدينة"
                                color={errors.city ? "failure" : "primary"}
                                {...register("city", {})}
                                onBlur={() => trigger("city")}
                            >
                                {citiesList?.map((city) => (
                                    <option value={city.id} key={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </FlowbiteSelect>
                        </div>
                    )}
                </>
            )}
        </FormGroup>
    );
};

export default EmployeeSettingsForm;
