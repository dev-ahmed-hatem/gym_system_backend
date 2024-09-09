import React, { useState, useEffect } from "react";
import {
    TextInput,
    Label,
    Button,
    Select as FlowbiteSelect,
    Table,
} from "flowbite-react";
import Select from "react-select";
import Loading from "../../groups/Loading";
import axios from "../../../config/axiosconfig";
import { useForm } from "react-hook-form";
import {
    MdOutlineHolidayVillage,
    MdOutlineMoreTime,
    MdOutlineTimer,
} from "react-icons/md";
import endpoints from "../../../config/config";
import { FaInfoCircle, FaMoneyBill, FaPercentage } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import { GrMoney } from "react-icons/gr";
import { LuCalendarDays, LuClock2 } from "react-icons/lu";
import { GiTakeMyMoney } from "react-icons/gi";
import { useToast } from "../../../providers/ToastProvider";
import { useDrawer } from "../../../providers/DrawerProvider";
import { defaultFormSubmission } from "../../../config/actions";
import style from "../../../assets/rect-select-style";

const ConfirmUpdate = ({ postData, setPostData, callBack, closeDrawer }) => {
    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <p className="text-base">تأكيد تحديث البيانات ؟</p>
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
                    حفظ
                </Button>
            </div>
        </div>
    );
};

const SalariesForm = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { showToast } = useToast();

    //////////////////////////////// form data ////////////////////////////////
    const [post, setPost] = useState(false);
    const [employeesList, setEmployeesList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const [salaryParams, setSalaryParams] = useState({
        employee: null,
        month: currentMonth,
        year: currentYear,
    });
    const [currentSalary, setCurrentSalary] = useState(null);
    const [postData, setPostData] = useState(null);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm();

    const updateSalary = () => {
        setPost(true);
        const url = postData.url;
        const submitData = {};

        const dataKeys = [
            "working_hours",
            "working_days",
            "base_salary",
            "deductions",
            "extra_hours",
            "vacations",
            "bonuses",
            "subscription_percent",
            "private_percent",
            "advance_payment",
        ];

        for (let i of dataKeys) {
            submitData[i] = Number(postData[i]).toFixed(2);
        }

        defaultFormSubmission({
            url: url,
            data: submitData,
            formFunction: "edit",
            setPost: setPost,
            showToast: showToast,
            message: {
                edit: "تم حفظ بيانات الموظف",
            },
            reset: reset,
            callBack: () => {
                setPostData(null);
            },
            setError: setError,
        });
    };

    useEffect(() => {
        if (postData) {
            updateSalary();
        }
    }, [postData]);

    ///// Handle Drawer
    const handleDrawer = (data) => {
        showDrawer(
            "تأكيد ",
            FaInfoCircle,
            <ConfirmUpdate
                postData={data}
                setPostData={setPostData}
                callBack={() => {
                    setSalaryParams({ ...salaryParams, employee: null });
                }}
                closeDrawer={closeDrawer}
            />
        );
    };

    const onSubmit = (data) => {
        handleDrawer(data);
    };

    const fetchCurrentSalary = () => {
        if (salaryParams.employee === null) {
            setCurrentSalary(null);
            return;
        }
        setCurrentSalary("loading");
        const url = `${endpoints.salary_list}${
            salaryParams.employee ? `&employee=${salaryParams?.employee}` : ""
        }${salaryParams.month ? `&month=${salaryParams?.month}` : ""}${
            salaryParams.year ? `&year=${salaryParams?.year}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                if (response?.data?.results?.length !== 0) {
                    const salary = response?.data?.results[0];
                    const reprSalary = {};
                    setCurrentSalary(salary);

                    // round all number values to two digits:
                    for (let val in salary) {
                        reprSalary[val] =
                            typeof salary[val] === "number"
                                ? Number(Number(salary[val]).toFixed(2))
                                : salary[val];
                    }
                    reset(salary);
                } else {
                    setCurrentSalary("no data");
                }
            })
            .catch((error) => {
                setFetchError(error);
            });
    };

    useEffect(() => {
        fetchCurrentSalary();
    }, [salaryParams]);

    const fetchEmployees = (search_word) => {
        const options = [];
        const url = `${endpoints.employee_list}page_size=20&ordering=name${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((employee) => {
                    options.push({
                        value: employee.id,
                        label: `${employee.id} - ${employee.name}`,
                    });
                });
                setEmployeesList(options);
            })
            .catch((error) => {
                setEmployeesList(null);
                setFetchError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <>
            <div
                className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">
                    البيانات المالية الشهرية
                </h1>
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
                                        setSalaryParams({
                                            ...salaryParams,
                                            employee: value
                                                ? value.value
                                                : null,
                                        });
                                    }}
                                    styles={style(errors.employee)}
                                />
                            </div>
                            <div className="w-full lg:max-w-md lg:w-[30%]">
                                <div className="mb-2 block">
                                    <Label htmlFor="year" value="السنة :" />
                                </div>
                                <FlowbiteSelect
                                    id="year"
                                    type="select"
                                    placeholder="السنة"
                                    color={"primary"}
                                    defaultValue={currentYear}
                                    onChange={(event) => {
                                        setSalaryParams({
                                            ...salaryParams,
                                            year: Number(event.target.value),
                                        });
                                    }}
                                >
                                    {Array.from(
                                        { length: currentYear - 2023 },
                                        (_, i) => 2024 + i
                                    ).map((num) => (
                                        <option value={num} key={num}>
                                            {num}
                                        </option>
                                    ))}
                                </FlowbiteSelect>
                                {errors.year && (
                                    <p className="error-message">
                                        {errors.year.message}
                                    </p>
                                )}
                            </div>
                            <div className="w-full lg:max-w-md lg:w-[30%]">
                                <div className="mb-2 block">
                                    <Label htmlFor="month" value="الشهر :" />
                                </div>
                                <FlowbiteSelect
                                    id="month"
                                    type="select"
                                    placeholder="الشهر"
                                    color={"primary"}
                                    defaultValue={currentMonth}
                                    onChange={(event) => {
                                        setSalaryParams({
                                            ...salaryParams,
                                            month: Number(event.target.value),
                                        });
                                    }}
                                >
                                    {Array.from(
                                        { length: 12 },
                                        (_, i) => i + 1
                                    ).map((num) => (
                                        <option value={num} key={num}>
                                            {num}
                                        </option>
                                    ))}
                                </FlowbiteSelect>
                                {errors.month && (
                                    <p className="error-message">
                                        {errors.month.message}
                                    </p>
                                )}
                            </div>

                            {currentSalary === "loading" ? (
                                <Loading className={`w-full text-center`} />
                            ) : currentSalary === null ? (
                                <></>
                            ) : currentSalary === "no data" ? (
                                <p className="text-lg text-center py-4 w-full m-auto">
                                    لا توجد بيانات
                                </p>
                            ) : (
                                <>
                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="working_hours"
                                                value="ساعات العمل اليومية : "
                                            />
                                        </div>
                                        <TextInput
                                            id="working_hours"
                                            type="number"
                                            rightIcon={LuClock2}
                                            placeholder="ساعات العمل اليومية"
                                            color={
                                                errors.working_hours
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("working_hours", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^\d+$/,
                                                    message: "أدخل عدد صحيح",
                                                },
                                            })}
                                            onBlur={() =>
                                                trigger("working_hours")
                                            }
                                            min={1}
                                        />
                                        {errors.working_hours && (
                                            <p className="error-message">
                                                {errors.working_hours.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="working_days"
                                                value="أيام العمل في الشهر :"
                                            />
                                        </div>
                                        <TextInput
                                            id="working_days"
                                            type="number"
                                            rightIcon={LuCalendarDays}
                                            placeholder="أيام العمل"
                                            color={
                                                errors.working_days
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("working_days", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^\d+$/,
                                                    message: "أدخل عدد صحيح",
                                                },
                                            })}
                                            onBlur={() =>
                                                trigger("working_days")
                                            }
                                            min={1}
                                        />
                                        {errors.working_days && (
                                            <p className="error-message">
                                                {errors.working_days.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="hourly_rate"
                                                value="الأجر بالساعة : "
                                            />
                                        </div>
                                        <TextInput
                                            disabled
                                            id="hourly_rate"
                                            type="number"
                                            rightIcon={LuClock2}
                                            placeholder="الأجر بالساعة"
                                            color={"primary"}
                                            value={Number(
                                                currentSalary.hourly_rate
                                            ).toFixed(2)}
                                        />
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="base_salary"
                                                value="المرتب الأساسى : "
                                            />
                                        </div>
                                        <TextInput
                                            id="base_salary"
                                            type="number"
                                            rightIcon={GrMoney}
                                            placeholder="المرتب الأساسى"
                                            color={
                                                errors.base_salary
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("base_salary", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^(0*[0-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
                                                    message:
                                                        "غير مسموح بقيم سالبة",
                                                },
                                            })}
                                            onBlur={() =>
                                                trigger("base_salary")
                                            }
                                            defaultValue={10000}
                                            step={"any"}
                                            min={0}
                                        />
                                        {errors.base_salary && (
                                            <p className="error-message">
                                                {errors.base_salary.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="deductions"
                                                value="الخصومات : (ساعة)"
                                            />
                                        </div>
                                        <TextInput
                                            id="deductions"
                                            type="number"
                                            rightIcon={MdOutlineTimer}
                                            placeholder="الخصومات"
                                            color={
                                                errors.deductions
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("deductions", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^(0*[0-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
                                                    message:
                                                        "غير مسموح بقيم سالبة",
                                                },
                                            })}
                                            onBlur={() => trigger("deductions")}
                                            defaultValue={0}
                                            step={"any"}
                                            min={0}
                                        />
                                        {errors.deductions && (
                                            <p className="error-message">
                                                {errors.deductions.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="extra_hours"
                                                value="الساعات الإضافية : (ساعة)"
                                            />
                                        </div>
                                        <TextInput
                                            id="extra_hours"
                                            type="number"
                                            rightIcon={MdOutlineMoreTime}
                                            placeholder="الساعات الإضافية"
                                            color={
                                                errors.extra_hours
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("extra_hours", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^(0*[0-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
                                                    message:
                                                        "غير مسموح بقيم سالبة",
                                                },
                                            })}
                                            onBlur={() =>
                                                trigger("extra_hours")
                                            }
                                            defaultValue={0}
                                            step={"any"}
                                            min={0}
                                        />
                                        {errors.extra_hours && (
                                            <p className="error-message">
                                                {errors.extra_hours.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="vacations"
                                                value="الأجازات : (يوم)"
                                            />
                                        </div>
                                        <TextInput
                                            id="vacations"
                                            type="number"
                                            rightIcon={MdOutlineHolidayVillage}
                                            placeholder="الأجازات"
                                            color={
                                                errors.vacations
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("vacations", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^\d+$/,
                                                    message: "أدخل عدد صحيح",
                                                },
                                            })}
                                            onBlur={() => trigger("vacations")}
                                            defaultValue={0}
                                            step={"any"}
                                            min={0}
                                        />
                                        {errors.vacations && (
                                            <p className="error-message">
                                                {errors.vacations.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="bonuses"
                                                value="المكافئات : (مبلغ)"
                                            />
                                        </div>
                                        <TextInput
                                            id="bonuses"
                                            type="number"
                                            rightIcon={FaMoneyBill}
                                            placeholder="المكافئات"
                                            color={
                                                errors.bonuses
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("bonuses", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^(0*[0-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/,
                                                    message:
                                                        "غير مسموح بقيم سالبة",
                                                },
                                            })}
                                            onBlur={() => trigger("bonuses")}
                                            defaultValue={0}
                                            min={0}
                                        />
                                        {errors.bonuses && (
                                            <p className="error-message">
                                                {errors.bonuses.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="private_percent"
                                                value="النسبة على التدريب : (%)"
                                            />
                                        </div>
                                        <TextInput
                                            id="private_percent"
                                            type="number"
                                            rightIcon={FaPercentage}
                                            placeholder="النسبة على التدريب"
                                            color={
                                                errors.private_percent
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register("private_percent", {
                                                required: "هذا الحقل مطلوب",
                                                pattern: {
                                                    value: /^\d{1,2}(\.\d{1,2})?$/,
                                                    message:
                                                        "مسموح من 0 إلى 99",
                                                },
                                            })}
                                            defaultValue={0}
                                            min={0}
                                            max={99}
                                            step={"any"}
                                            onBlur={() => {
                                                trigger("private_percent");
                                            }}
                                        />
                                        {errors.private_percent && (
                                            <p className="error-message">
                                                {errors.private_percent.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full lg:max-w-md lg:w-[30%]">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="subscription_percent"
                                                value="النسبة على الاشتراكات : (%)"
                                            />
                                        </div>
                                        <TextInput
                                            id="subscription_percent"
                                            type="number"
                                            rightIcon={FaPercentage}
                                            placeholder="النسبة على الاشتراكات"
                                            color={
                                                errors.subscription_percent
                                                    ? "failure"
                                                    : "primary"
                                            }
                                            {...register(
                                                "subscription_percent",
                                                {
                                                    required: "هذا الحقل مطلوب",
                                                    pattern: {
                                                        value: /^\d{1,2}(\.\d{1,2})?$/,
                                                        message:
                                                            "مسموح من 0 إلى 99",
                                                    },
                                                }
                                            )}
                                            defaultValue={0}
                                            min={0}
                                            max={99}
                                            step={"any"}
                                            onBlur={() => {
                                                trigger("subscription_percent");
                                            }}
                                        />
                                        {errors.subscription_percent && (
                                            <p className="error-message">
                                                {
                                                    errors.subscription_percent
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {/* Trainings */}
                                    <div className="w-full h-px my-3 bg-gray-200 border-0"></div>
                                    <div className="table-wrapper w-full overflow-x-auto">
                                        <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                            اشتراكات خاصة
                                        </h1>
                                        <Table
                                            striped
                                            className="font-bold text-right"
                                        >
                                            {currentSalary?.private_trainings
                                                ?.length == 0 ? (
                                                <Table.Body className="!rounded-none">
                                                    <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                        <Table.Cell className="!rounded-t-none">
                                                            لا توجد اشتراكات
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            ) : (
                                                <>
                                                    <Table.Head>
                                                        <Table.HeadCell>
                                                            كود الاشتراك
                                                        </Table.HeadCell>
                                                        <Table.HeadCell>
                                                            تاريخ بدأ الاشتراك
                                                        </Table.HeadCell>
                                                        <Table.HeadCell>
                                                            القيمة
                                                        </Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body>
                                                        {currentSalary.private_trainings.map(
                                                            (sub) => (
                                                                <Table.Row
                                                                    key={sub.id}
                                                                    className="bg-white font-medium text-gray-900"
                                                                >
                                                                    <Table.Cell>
                                                                        {sub.id ? (
                                                                            sub.id
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {sub.start_date ? (
                                                                            sub.start_date
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {sub.total_price ? (
                                                                            sub.total_price
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        )}
                                                        <Table.Row className="font-bold text-lg">
                                                            <Table.Cell
                                                                colSpan={2}
                                                            >
                                                                الإجمالى
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {currentSalary?.total_trainings_price ||
                                                                    0}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="font-bold text-lg">
                                                            <Table.Cell
                                                                colSpan={2}
                                                            >
                                                                النسبة
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {currentSalary?.private_percent ||
                                                                    null}{" "}
                                                                %
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="font-bold text-lg">
                                                            <Table.Cell
                                                                colSpan={2}
                                                            >
                                                                الصافى
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {
                                                                    currentSalary?.private_trainings_net
                                                                }
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </>
                                            )}
                                        </Table>
                                    </div>

                                    {/* referred Subscriptions */}
                                    <div className="table-wrapper w-full overflow-x-auto">
                                        <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                            اشتراكات بواسطة الموظف
                                        </h1>
                                        <Table
                                            striped
                                            className="font-bold text-right"
                                        >
                                            {currentSalary
                                                ?.referred_subscriptions
                                                ?.length == 0 ? (
                                                <Table.Body className="!rounded-none">
                                                    <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                        <Table.Cell className="!rounded-t-none">
                                                            لا توجد اشتراكات
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            ) : (
                                                <>
                                                    <Table.Head>
                                                        <Table.HeadCell>
                                                            كود الاشتراك
                                                        </Table.HeadCell>
                                                        <Table.HeadCell>
                                                            تاريخ بدأ الاشتراك
                                                        </Table.HeadCell>
                                                        <Table.HeadCell>
                                                            القيمة
                                                        </Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body>
                                                        {currentSalary.referred_subscriptions.map(
                                                            (sub) => (
                                                                <Table.Row
                                                                    key={sub.id}
                                                                    className="bg-white font-medium text-gray-900"
                                                                >
                                                                    <Table.Cell>
                                                                        {sub.id ? (
                                                                            sub.id
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {sub.start_date ? (
                                                                            sub.start_date
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        {sub.total_price ? (
                                                                            sub.total_price
                                                                        ) : (
                                                                            <span className="text-red-600">
                                                                                غير
                                                                                مسجل
                                                                            </span>
                                                                        )}
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        )}
                                                        <Table.Row className="font-bold text-lg">
                                                            <Table.Cell
                                                                colSpan={2}
                                                            >
                                                                الإجمالى
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {currentSalary?.total_subscriptions_price ||
                                                                    0}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="font-bold text-lg">
                                                            <Table.Cell
                                                                colSpan={2}
                                                            >
                                                                النسبة
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {currentSalary?.subscription_percent ||
                                                                    null}{" "}
                                                                %
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="font-bold text-lg">
                                                            <Table.Cell
                                                                colSpan={2}
                                                            >
                                                                الصافى
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {
                                                                    currentSalary?.referred_subscriptions_net
                                                                }
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </>
                                            )}
                                        </Table>
                                    </div>

                                    {/* Totals */}
                                    <div className="w-full h-px my-3 bg-gray-200 border-0"></div>
                                    <div className="totals mt-2 ">
                                        <h1 className="font-bold text-xl mb-4 lg:mb-8">
                                            إجمالى حساب الشهر :
                                        </h1>
                                        <p className="mt-2 ms-10">
                                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                                إجمالى الخصومات :{" "}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {Number(
                                                    currentSalary.total_deductions
                                                ) == 0
                                                    ? "لا توجد"
                                                    : currentSalary.total_deductions.toFixed(
                                                          2
                                                      )}
                                            </span>
                                        </p>
                                        <p className="mt-2 ms-10">
                                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                                إجمالى الزيادات :{" "}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {Number(
                                                    currentSalary.total_extra
                                                ) == 0
                                                    ? "لا توجد"
                                                    : currentSalary.total_extra.toFixed(
                                                          2
                                                      )}
                                            </span>
                                        </p>
                                        <p className="mt-2 ms-10">
                                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                                اشتراكات خاصة :{" "}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {
                                                    currentSalary?.private_trainings_net
                                                }
                                            </span>
                                        </p>
                                        <p className="mt-2 ms-10">
                                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                                اشتراكات اخرى :{" "}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {
                                                    currentSalary?.referred_subscriptions_net
                                                }
                                            </span>
                                        </p>
                                        <p className="mt-2 ms-10">
                                            <span className="inline-block text-black font-bold pe-1 min-w-40">
                                                المرتب النهائى :{" "}
                                            </span>
                                            <span className="text-primary font-bold">
                                                {currentSalary.total_salary.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Save Button */}
                                    <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                                        <Button
                                            type="submit"
                                            color={"primary"}
                                            disabled={post}
                                            className="w-32 h-10 flex justify-center items-center"
                                            size={"xl"}
                                            isProcessing={post}
                                            processingSpinner={
                                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                            }
                                        >
                                            حفظ
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

export default SalariesForm;
