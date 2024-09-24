import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, TextInput, Table } from "flowbite-react";
import { MdSubscriptions } from "react-icons/md";
import { useForm } from "react-hook-form";
import endpoints from "../../../config/config";
import { useToast } from "../../../providers/ToastProvider";
import axios from "../../../config/axiosconfig";
import ViewGroup from "../../groups/ViewGroup";

const sub = {
    subscription: {
        id: 55,
        url: "http://127.0.0.1:8000/api/subscriptions/subscription/55/",
        plan: {
            id: 6,
            url: "http://127.0.0.1:8000/api/subscriptions/subscription-plan/6/",
            sub_type: "اشتراك أساسى",
            duration_display: "30 يوم",
            num_subscriptions: null,
            name: "عرض شهر طلاب",
            price: 350.0,
            days: 30,
            subscription_type: "main",
            description: "",
            freezable: true,
            freeze_no: 10,
            invitations: 1,
            for_students: true,
            validity: 30,
            is_duration: true,
            classes_no: null,
        },
        trainer: null,
        referrer: null,
        client_name: "ماسي ياسر",
        client_id: "3000",
        is_expired: false,
        start_date: "2024-09-12",
        end_date: "2024-10-12",
        freeze_days_used: 0,
        freeze_start_date: null,
        is_frozen: false,
        unfreeze_date: null,
        total_price: 0.0,
        attendance_days: 0,
        invitations_used: 0,
        client: 2283,
    },
    invitations: [],
    // [
    //     {
    //         id: 1,
    //         url: "http://127.0.0.1:8000/api/subscriptions/invitation/1/",
    //         is_valid: true,
    //         code: "i-1",
    //         is_used: false,
    //         created_at: "2024-09-24T13:47:13.388406+03:00",
    //         subscription: 1,
    //     },
    //     {
    //         id: 2,
    //         url: "http://127.0.0.1:8000/api/subscriptions/invitation/2/",
    //         is_valid: true,
    //         code: "i-2",
    //         is_used: false,
    //         created_at: "2024-09-24T13:47:20.447589+03:00",
    //         subscription: 1,
    //     },
    // ],
    is_blocked: false,
    editable: true,
};

const AddInvitation = () => {
    const [post, setPost] = useState(false);
    const [fetchError, setFetchError] = useState(null)
    const [data, setData] = useState(null);
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        setData(null);
        setPost(true);
        const get_subscription_data = async (sub_id) => {
            axios
                .post(endpoints.subscription_invitations, { sub_id: sub_id })
                .then((response) => {
                    setData(response.data);
                })
                .catch((error) => {
                    // check connection
                    showToast(error.response.data.error, true);
                    reset();
                })
                .finally(() => {
                    setPost(false);
                });
        };

        get_subscription_data(data.sub_id);
    };

    return (
        <>
            <div
                className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">إنشاء دعوة :</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="fields flex gap-x-10 gap-y-6 flex-wrap"
                >
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="sub_id" value="الكود :" />
                        </div>
                        <TextInput
                            id="sub_id"
                            type="number"
                            rightIcon={MdSubscriptions}
                            placeholder="الكود"
                            color={errors.sub_id ? "failure" : "primary"}
                            {...register("sub_id", {
                                required: "أدخل كود الاشتراك",
                                pattern: {
                                    value: /^[1-9]\d*$/,
                                    message: "أدخل رقم صحيح موجب",
                                },
                            })}
                        />
                        {errors.sub_id && (
                            <p className="error-message">
                                {errors.sub_id.message}
                            </p>
                        )}
                    </div>
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
                            بحث
                        </Button>
                    </div>
                </form>
            </div>
            {data && (
                <>
                    <div
                        className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                    >
                        <h1 className="font-bold text-text text-lg">
                            بيانات الاشتراك :
                        </h1>
                        <hr className="h-px my-3 bg-gray-200 border-0"></hr>

                        <h1 className="text-text text-base lg:text-lg my-3">
                            اسم العميل :{" "}
                            <span className="text-primary font-bold ms-2 me-3 lg:me-5">
                                {data.subscription.client_name}
                            </span>
                            <br />
                            كود العميل :{" "}
                            <span className="text-primary font-bold ms-2">
                                {data.subscription.client_id}
                            </span>
                            <br />
                            الاشتراك :{" "}
                            <span className="text-primary font-bold ms-2">
                                {data.subscription.plan.name}
                            </span>
                            <br />
                            تاريخ البدأ :{" "}
                            <span className="text-primary font-bold ms-2">
                                {data.subscription.start_date}
                            </span>
                            <br />
                            تاريخ الانتهاء :{" "}
                            <span className="text-primary font-bold ms-2">
                                {data.subscription.end_date}
                            </span>
                            <br />
                            عدد الدعوات :{" "}
                            <span className="text-primary font-bold ms-2">
                                {data.subscription.plan.invitations}
                            </span>
                            <br />
                            الدعوات المستخدمة :{" "}
                            <span className="text-primary font-bold ms-2">
                                {data.subscription.invitations_used}
                            </span>
                            <br />
                        </h1>
                        {data.is_blocked && (
                            <p className="text-base lg:text-2xl text-center text-red-600 py-4">
                                هذا العميل محظور
                            </p>
                        )}
                        {data.subscription.is_expired && (
                            <p className="text-base lg:text-xl text-center text-red-600 py-4">
                                اشتراك منتهى
                            </p>
                        )}
                        {data.subscription.invitations_used >=
                            data.subscription.plan.invitations && (
                            <p className="text-base lg:text-xl text-center text-red-600 py-4">
                                لا يوجد دعوات متاحة
                            </p>
                        )}
                        {data.editable && (
                            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                                <Button
                                    type="button"
                                    color={"primary"}
                                    disabled={post}
                                    className="w-32 h-10 flex justify-center items-center"
                                    size={"xl"}
                                    isProcessing={post}
                                    processingSpinner={
                                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                    }
                                >
                                    إنشاء دعوة
                                </Button>
                            </div>
                        )}
                    </div>
                    {data.editable && (
                        <ViewGroup title={"الدعوات الحالية"}>
                            <div className="table-wrapper w-full overflow-x-auto">
                                {data.invitations.length == 0 ? (
                                    <p className="w-full text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                        لا توجد لهذا الاشتراك
                                    </p>
                                ) : (
                                    <Table
                                        striped
                                        className="font-bold text-right w-full"
                                    >
                                        <Table.Head>
                                            <Table.HeadCell>
                                                كود الدعوة
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الحالة
                                            </Table.HeadCell>
                                            <Table.HeadCell></Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.invitations.map((inv) => {
                                                return (
                                                    <Table.Row
                                                        key={inv.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {inv.code ? (
                                                                inv.code
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {inv.is_used ? (
                                                                <span className="text-red-600">
                                                                    تم الاستخدام
                                                                </span>
                                                            ) : (
                                                                <span className="text-green-600">
                                                                    لم يتم
                                                                    الاستخدام
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <Button
                                                                type="button"
                                                                color={
                                                                    "primary"
                                                                }
                                                                onClick={() =>
                                                                    handleDrawer(
                                                                        "confirm",
                                                                        sale
                                                                    )
                                                                }
                                                                className="w-20 h-10 flex justify-center items-center"
                                                            >
                                                                عرض
                                                            </Button>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                );
                                            })}
                                        </Table.Body>
                                    </Table>
                                )}
                            </div>
                        </ViewGroup>
                    )}
                </>
            )}
        </>
    );
};

export default AddInvitation;
