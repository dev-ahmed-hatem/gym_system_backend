import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, TextInput, Table } from "flowbite-react";
import { MdDelete, MdSubscriptions } from "react-icons/md";
import { useForm } from "react-hook-form";
import endpoints from "../../../config/config";
import { useToast } from "../../../providers/ToastProvider";
import axios from "../../../config/axiosconfig";
import ViewGroup from "../../groups/ViewGroup";
import ConfirmDelete from "../../groups/ConfirmDelete";
import { useDrawer } from "../../../providers/DrawerProvider";
import { FcInvite } from "react-icons/fc";
import InvitationView from "./InvitationView";

const AddInvitation = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();

    const [post, setPost] = useState(false);
    const [adding, setAdding] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const get_subscription_data = async (sub_id) => {
        setFetchError(null);
        axios
            .post(endpoints.subscription_invitations, { sub_id: sub_id })
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                if (error?.response?.data) {
                    showToast(error.response.data.error, true);
                } else {
                    setFetchError(error);
                }
                reset();
            })
            .finally(() => {
                setPost(false);
            });
    };

    const onSubmit = (data) => {
        setData(null);
        setPost(true);

        get_subscription_data(data.sub_id);
    };

    const create_invitation = () => {
        if (!data) {
            return;
        }

        const postData = {
            subscription: data?.subscription?.id,
        };
        setAdding(true);

        axios
            .post(endpoints.invitation_list, postData)
            .then(() => {
                showToast("تم إنشاء دعوة");
                get_subscription_data(data.subscription.id);
            })
            .catch((error) => {
                console.log(error);

                showToast("خطأ فى تنفيذ العملية", true);
            })
            .finally(() => {
                setAdding(false);
            });
    };

    const handleDrawer = (drawerFunction, item) => {
        if (drawerFunction == "view") {
            showDrawer(
                "عرض دعوة",
                FcInvite,
                <InvitationView
                    inv={item}
                    callBack={() => {
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف دعوة",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف الدعوة"}
                        itemName={item.code}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            get_subscription_data(data.subscription.id);
                        }}
                        toastMessage={"تم حذف الدعوة بنجاح"}
                    />
                </>
            );
        }
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
                            <Label htmlFor="sub_id" value="كود الاشتراك :" />
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
                    {fetchError && (
                        <p className="w-full text-base lg:text-lg text-center text-red-600 py-4">
                            خطأ في التحميل
                        </p>
                    )}
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
                                    onClick={create_invitation}
                                    type="button"
                                    color={"primary"}
                                    disabled={adding}
                                    className="w-32 h-10 flex justify-center items-center"
                                    size={"xl"}
                                    isProcessing={adding}
                                    processingSpinner={
                                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                    }
                                >
                                    إنشاء دعوة
                                </Button>
                            </div>
                        )}
                    </div>

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
                                        <Table.HeadCell>الحالة</Table.HeadCell>
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
                                                        {inv.is_valid ? (
                                                            <span className="text-green-600">
                                                                لم يتم الاستخدام
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600">
                                                                منتهية
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell className="flex gap-x-2 text-center items-center">
                                                        {data.editable &&
                                                            inv.is_valid && (
                                                                <>
                                                                    <Button
                                                                        type="button"
                                                                        color={
                                                                            "primary"
                                                                        }
                                                                        onClick={() =>
                                                                            handleDrawer(
                                                                                "view",
                                                                                inv
                                                                            )
                                                                        }
                                                                        className="w-20 h-10 flex justify-center items-center"
                                                                    >
                                                                        عرض
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        color={
                                                                            "failure"
                                                                        }
                                                                        onClick={() =>
                                                                            handleDrawer(
                                                                                "delete",
                                                                                inv
                                                                            )
                                                                        }
                                                                        className="w-20 h-10 flex justify-center items-center"
                                                                    >
                                                                        حذف
                                                                    </Button>
                                                                </>
                                                            )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </Table>
                            )}
                        </div>
                    </ViewGroup>
                </>
            )}
        </>
    );
};

export default AddInvitation;
