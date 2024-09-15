import React, { useState } from "react";
import { Radio, Label, Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "../../config/axiosconfig";
import endpoints from "../../config/config";
import { useToast } from "../../providers/ToastProvider";

const SubscriptionsPrompt = ({ subscriptions, client, callBack }) => {
    const [post, setPost] = useState(false);
    const [selected, setSelected] = useState(subscriptions[0]?.id);
    const { showToast } = useToast();

    const submit = () => {
        setPost(true);
        const data = {
            client: Number.parseInt(client.id),
            subscription: Number.parseInt(selected),
        };
        axios
            .post(endpoints.attendance, data)
            .then((response) => {
                showToast("تم تسجيل الحضور");
            })
            .catch((error) => {
                console.log(error);
                showToast("خطأ فى تنفيذ العملية", true);
            })
            .finally(() => {
                setPost(false);
                if (callBack) callBack();
            });
    };

    return (
        <div>
            <h1 className="font-bold text-text text-base lg:text-lg my-3">
                اسم العميل :{" "}
                <span className="text-primary font-bold ms-2 me-3 lg:me-5">
                    {client.name}
                </span>
                <br />
                كود العميل :{" "}
                <span className="text-primary font-bold ms-2">{client.id}</span>
                <br />
                <p className="flex justify-between items-center pe-6 md:pe-10">
                    صورة العميل :{" "}
                    <span className="text-primary font-bold ms-2">
                        {client.photo ? (
                            <img
                                src={client.photo}
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
            {client.is_blocked ? (
                <p className="text-base lg:text-2xl text-center text-red-600 py-4">
                    هذا العميل محظور
                </p>
            ) : subscriptions.length == 0 ? (
                <p className="text-base lg:text-lg text-center text-red-600 py-4">
                    لا يوجد اشتراكات مفعلة حاليا
                </p>
            ) : (
                <>
                    <h1 className="text-text text-base lg:text-lg">
                        اختر الاشتراك لتسجيل الحضور فيه :
                    </h1>
                    {subscriptions.map((sub) => (
                        <div
                            className="my-3 p-1 border rounded border-primary flex items-center"
                            key={sub.id}
                        >
                            <Radio
                                id={`sub-${sub.id}`}
                                className="w-6 h-6 border-black"
                                size={"xl"}
                                name="sub"
                                defaultChecked={selected == sub.id}
                                onChange={() => {
                                    setSelected(sub.id);
                                }}
                            />
                            <Label className="ms-4 " htmlFor={`sub-${sub.id}`}>
                                <span className="font-bold text-base lg:text-lg">
                                    {sub.plan.name}
                                </span>
                                <span className="text-[14px] lg:text-[15px]">
                                    <br />
                                    تاريخ البدأ : {sub.start_date}
                                    <br />
                                    تاريخ الانتهاء : {sub.end_date}
                                    <br />
                                    <span
                                        className={`${
                                            !sub.plan.is_duration &&
                                            sub.attendance_days ==
                                                sub.plan.classes_no - 1 &&
                                            "text-secondary font-bold"
                                        }`}
                                    >
                                        أيام الحضور : {sub.attendance_days}
                                    </span>
                                </span>
                            </Label>
                        </div>
                    ))}
                    <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                        <Button
                            color={"primary"}
                            disabled={post}
                            className="w-44 h-14 flex justify-center items-center text-lg"
                            size={"xl"}
                            isProcessing={post}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                            onClick={submit}
                        >
                            تسجيل حضور
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default SubscriptionsPrompt;
