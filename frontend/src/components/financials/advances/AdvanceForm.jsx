import React, { useState, useEffect } from "react";
import { TextInput, Label, Button } from "flowbite-react";
import Select from "react-select";
import Loading from "../../groups/Loading";
import { useForm } from "react-hook-form";
import endpoints from "../../../config/config";
import { FaInfoCircle, FaMoneyBill } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { useToast } from "../../../providers/ToastProvider";
import { useDrawer } from "../../../providers/DrawerProvider";
import {
    defaultFormSubmission,
    fetch_list_data,
} from "../../../config/actions";
import style from "../../../assets/rect-select-style";

const ConfirmAdvance = ({ postData, setPostData, callBack, closeDrawer }) => {
    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <p className="text-base">
                استخراج سلفة بقيمة :
                <span className="ms-1 font-bold text-primary">
                    {postData.amount}
                </span>
                <br />
                للموظف :
                <span className="ms-1 font-bold text-primary">
                    {postData.employee_name}
                </span>
            </p>
            <p className="mt-5">
                سيتم إضافة مصروف بقيمة{" "}
                <span className="text-primary font-bold mx-2">
                    {Number.parseInt(postData.amount)}{" "}
                </span>
                بتاريخ اليوم
            </p>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                <Button
                    type="button"
                    color={"failure"}
                    className="me-4"
                    onClick={closeDrawer}
                >
                    إلغاء
                </Button>
                <Button
                    type="button"
                    color={"primary"}
                    onClick={() => {
                        closeDrawer();
                        setPostData(postData);
                        callBack();
                    }}
                >
                    تأكيد
                </Button>
            </div>
        </div>
    );
};

const AdvanceForm = ({ callBack }) => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { showToast } = useToast();

    //////////////////////////////// form data ////////////////////////////////
    const [post, setPost] = useState(false);
    const [employeesList, setEmployeesList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [advanceLoading, setAdvanceLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [employeeData, setEmployeeData] = useState(null);
    const [postData, setPostData] = useState(null);
    const [currentEmployee, setcurrentEmployee] = useState(null);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm();

    ///// Handle Drawer
    const handleDrawer = (data) => {
        showDrawer(
            "تأكيد ",
            FaInfoCircle,
            <ConfirmAdvance
                postData={data}
                setPostData={setPostData}
                callBack={() => {
                    if (callBack) callBack();
                }}
                closeDrawer={closeDrawer}
            />
        );
    };

    const onSubmit = (data) => {
        data.employee = currentEmployee.value;
        data.employee_name = currentEmployee.name;
        data.amount = Number.parseFloat(data.amount);

        handleDrawer(data);
    };

    const fetchEmployees = (search_word) => {
        const options = [];
        const url = `${endpoints.employee_list}page_size=20&ordering=name${
            search_word ? `&search=${search_word}` : ""
        }`;

        fetch_list_data({
            searchURL: url,
            setData: (data) => {
                data.results.map((employee) => {
                    options.push({
                        value: employee.id,
                        label: `${employee.id} - ${employee.name}`,
                        ...employee,
                    });
                });
                setEmployeesList(options);
            },
            setFetchError: (error) => {
                setEmployeesList(null);
                setFetchError(error);
            },
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (currentEmployee) {
            setAdvanceLoading(true);
            fetch_list_data({
                searchURL: `${endpoints.employee_advance_info}employee=${currentEmployee.value}`,
                setData: setEmployeeData,
                setFetchError: setFetchError,
                setLoading: setAdvanceLoading,
            });
        } else {
            setEmployeeData(null);
        }
    }, [currentEmployee]);

    const create_advance = () => {
        defaultFormSubmission({
            url: endpoints.advance_list,
            data: postData,
            formFunction: "add",
            setPost: setPost,
            showToast: showToast,
            message: {
                add: "تم استخراج السلفة",
            },
            reset: reset,
            callBack: () => {
                setcurrentEmployee(null);
                setPostData(null);
            },
            setError: setError,
        });
    };

    useEffect(() => {
        if (postData) {
            create_advance();
        }
    }, [postData]);

    return (
        <>
            <div
                className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">استخراج سلفة</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <form
                    className="fields flex gap-x-10 gap-y-6 flex-wrap"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {loading ? (
                        <Loading className={`w-full text-center`} />
                    ) : fetchError ? (
                        <p className="text-lg text-center text-red-600 py-4 w-full m-auto">
                            خطأ في تحميل البيانات
                        </p>
                    ) : (
                        <>
                            <div className="w-full lg:max-w-md lg:w-[30%]">
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="اختر موظف :" />
                                </div>
                                <Select
                                    isClearable={true}
                                    noOptionsMessage={() =>
                                        "لا يوجد نتائج مطابقة"
                                    }
                                    placeholder="بحث ..."
                                    options={employeesList || []}
                                    onInputChange={fetchEmployees}
                                    onChange={(value) => {
                                        setcurrentEmployee(value);
                                    }}
                                    styles={style(errors.employee)}
                                />
                            </div>

                            <div className="w-full"></div>
                            {advanceLoading && <Loading />}

                            {employeeData && (
                                <>
                                    {/* prompt if there is current unpaid advance */}
                                    {employeeData.current_advance && (
                                        <p className="text-lg text-center text-red-600 py-2 w-full m-auto">
                                            يوجد سلفة غير مسددة بالكامل لهذا
                                            الموظف
                                            <span className="block">
                                                رقم السلفة :{" "}
                                                {
                                                    employeeData.current_advance
                                                        .id
                                                }
                                            </span>
                                        </p>
                                    )}

                                    <div className="totals w-full">
                                        <h1 className="font-bold text-xl mb-4 lg:mb-8">
                                            بيانات مرتب الموظف :
                                        </h1>
                                        <p className="ms-10">
                                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                                المرتب الحالى :{" "}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {Number.parseFloat(
                                                    employeeData.current_salary
                                                        .base_salary
                                                ).toFixed(2)}
                                            </span>
                                        </p>
                                        <p className="mt-2 ms-10">
                                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                                المبلغ المسموح :{" "}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {Number.parseFloat(
                                                    employeeData.current_salary
                                                        .available_advance
                                                ).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="w-full"></div>
                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="amount"
                                                value="المبلغ :"
                                            />
                                        </div>
                                        <TextInput
                                            id="amount"
                                            type="number"
                                            className="inline-block w-full"
                                            rightIcon={FaMoneyBill}
                                            placeholder="المبلغ"
                                            color={
                                                errors.amount
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("amount", {
                                                required: "أدخل المبلغ",
                                                min: {
                                                    value: 1,
                                                    message: "أدخل قيمة السلفة",
                                                },
                                                max: {
                                                    value: Number.parseFloat(
                                                        employeeData
                                                            .current_salary
                                                            .available_advance
                                                    ).toFixed(2),
                                                    message:
                                                        "قيمة أكبر من المسموح",
                                                },
                                            })}
                                            step={0.01}
                                            defaultValue={0}
                                            onBlur={() => trigger("amount")}
                                        />

                                        {errors.amount && (
                                            <p className="error-message">
                                                {errors.amount.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                                        <Button
                                            type="submit"
                                            color={"primary"}
                                            disabled={post}
                                            size={"xl"}
                                            isProcessing={post}
                                            processingSpinner={
                                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                            }
                                        >
                                            استخراج سلفة
                                        </Button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </form>
            </div>
        </>
    );
};

export default AdvanceForm;
