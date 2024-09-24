import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, TextInput, Table } from "flowbite-react";
import { MdSubscriptions } from "react-icons/md";
import { useForm } from "react-hook-form";
import { fetch_list_data } from "../../../config/actions";
import endpoints from "../../../config/config";
import Loading from "../../groups/Loading";
import { useToast } from "../../../providers/ToastProvider";

const ClientSubscriptions = () => {
    const [post, setPost] = useState(false);
    const [currentClient, setCurrentClient] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const { showToast } = useToast();

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        setPost(true);
        fetch_list_data({
            searchURL: `${endpoints.client_list}client=${data.client_id}`,
            setData: (data) => {
                if (data.results.length == 0) {
                    showToast("كود عميل غير موجود", true);
                    reset();
                } else {
                    setCurrentClient(data.results[0]);
                }
            },
            setLoading: setPost,
            setFetchError: (error) => {
                setFetchError(error);
                setCurrentClient(null);
            },
        });
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">عرض اشتراكات عميل :</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="client_id" value="كود العميل :" />
                    </div>
                    <TextInput
                        id="client_id"
                        type="number"
                        rightIcon={MdSubscriptions}
                        placeholder="كود العميل"
                        color={errors.client_id ? "failure" : "primary"}
                        {...register("client_id", {
                            required: "أدخل كود الاشتراك",
                            pattern: {
                                value: /^[1-9]\d*$/,
                                message: "أدخل رقم صحيح موجب",
                            },
                        })}
                        onBlur={() => trigger("client_id")}
                    />
                    {errors.client_id && (
                        <p className="error-message">
                            {errors.client_id.message}
                        </p>
                    )}
                </div>
                <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                    <Button
                        type="submit"
                        color={"primary"}
                        disabled={post}
                        className="min-w-32 h-10 flex justify-center items-center"
                        size={"xl"}
                        isProcessing={post}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        عرض الاشتراكات
                    </Button>
                </div>
            </form>
            <div className="subscriptions">
                {post ? (
                    <Loading />
                ) : fetchError ? (
                    <p className="text-lg text-center text-red-600 py-4">
                        خطأ في تحميل البيانات
                    </p>
                ) : (
                    <>
                        {currentClient && (
                            <>
                                <h1 className="text-text text-base lg:text-lg my-3">
                                    اسم العميل :{" "}
                                    <span className="text-primary font-bold ms-2 me-3 lg:me-5">
                                        {currentClient.name}
                                    </span>
                                    <br />
                                    <p className="flex justify-between items-center pe-6 md:pe-10">
                                        صورة العميل :{" "}
                                        <span className="text-primary ms-2">
                                            {currentClient.photo ? (
                                                <img
                                                    src={currentClient.photo}
                                                    width={100}
                                                    className="text-left w-16 md:w-24"
                                                />
                                            ) : (
                                                <span className="block w-full text-base lg:text-lg text-left text-red-600 py-4">
                                                    لا يوجد صورة
                                                </span>
                                            )}
                                        </span>
                                    </p>
                                </h1>
                                {currentClient.is_blocked ? (
                                    <p className="text-base lg:text-2xl text-center text-red-600 py-4">
                                        هذا العميل محظور
                                    </p>
                                ) : (
                                    <div className="subscriptions w-full mt-3">
                                        {currentClient.subscriptions.filter(
                                            (sub) => !sub.is_expired
                                        )?.length == 0 ? (
                                            <p className="w-full text-lg text-center text-gray-800 py-3 font-bold bg-primary-200">
                                                لا توجد اشتراكات حالية
                                            </p>
                                        ) : (
                                            <>
                                                <h1 className="text-center font-bold text-lg my-5">
                                                    الاشتراكات الحالية
                                                </h1>

                                                <div className="table-wrapper w-full overflow-x-auto">
                                                    <Table
                                                        striped
                                                        className="font-bold text-right w-full"
                                                    >
                                                        <Table.Head>
                                                            <Table.HeadCell>
                                                                الاشتراك
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                كود الاشتراك
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                عدد الدعوات
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                الدعوات
                                                                المستخدمة
                                                            </Table.HeadCell>
                                                        </Table.Head>
                                                        <Table.Body>
                                                            {currentClient.subscriptions
                                                                .filter(
                                                                    (sub) =>
                                                                        !sub.is_expired
                                                                )
                                                                .map((sub) => {
                                                                    return (
                                                                        <Table.Row
                                                                            key={
                                                                                sub.id
                                                                            }
                                                                            className="bg-white font-medium text-gray-900"
                                                                        >
                                                                            <Table.Cell>
                                                                                {sub
                                                                                    .plan
                                                                                    .name ? (
                                                                                    sub
                                                                                        .plan
                                                                                        .name
                                                                                ) : (
                                                                                    <span className="text-red-600">
                                                                                        غير
                                                                                        مسجل
                                                                                    </span>
                                                                                )}
                                                                            </Table.Cell>
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
                                                                                {sub
                                                                                    .plan
                                                                                    ?.invitations
                                                                                    ? sub
                                                                                          .plan
                                                                                          ?.invitations
                                                                                    : 0}
                                                                            </Table.Cell>
                                                                            <Table.Cell>
                                                                                {sub.invitations_used
                                                                                    ? sub.invitations_used
                                                                                    : 0}
                                                                            </Table.Cell>
                                                                        </Table.Row>
                                                                    );
                                                                })}
                                                        </Table.Body>
                                                    </Table>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientSubscriptions;
