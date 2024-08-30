import React, { useState } from "react";
import { Radio, Label, Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import axios from "../../config/axiosconfig";
import endpoints from "../../config/config";
import { useToast } from "../../providers/ToastProvider";

const client = {
    id: 13,
    date_created: "2024-07-18 - 18:30:06",
    name: "czxcxcfs",
    national_id: "4324234",
    gander: "male",
    birth_date: null,
    age: null,
    phone: "423423",
    phone2: "",
    email: "",
    address: "",
    photo: "http://127.0.0.1:8000/media/photos/mage_9mWSiNS.jpg",
    created_at: "2024-07-18T21:30:06.733917+03:00",
    is_blocked: false,
};

const subscriptions = [
    {
        id: 2,
        url: "http://127.0.0.1:8000/api/subscriptions/subscription/2/",
        plan: {
            id: 1,
            url: "http://127.0.0.1:8000/api/subscriptions/subscription-plan/1/",
            sub_type: "اشتراك أساسى",
            duration_display: "30 يوم",
            name: "test subscription 1",
            price: 400.0,
            days: 30,
            subscription_type: "main",
            description: "",
            freezable: true,
            freeze_no: 7,
            invitations: 2,
            for_students: true,
            validity: 30,
            is_duration: true,
            classes_no: null,
        },
        trainer: null,
        referrer: null,
        client_name: "czxcxcfs",
        client_id: 13,
        is_expired: false,
        start_date: "2024-07-28",
        end_date: "2024-08-27",
        freeze_days_used: 0,
        freeze_start_date: null,
        is_frozen: false,
        unfreeze_date: null,
        client: 13,
    },
    {
        id: 9,
        url: "http://127.0.0.1:8000/api/subscriptions/subscription/9/",
        plan: {
            id: 4,
            url: "http://127.0.0.1:8000/api/subscriptions/subscription-plan/4/",
            sub_type: "اشتراك إضافى",
            duration_display: "12 حصة",
            name: "test subscription 4",
            price: 1200.0,
            days: 30,
            subscription_type: "sub",
            description: "",
            freezable: true,
            freeze_no: 7,
            invitations: 5,
            for_students: true,
            validity: 30,
            is_duration: false,
            classes_no: 12,
        },
        trainer: null,
        referrer: null,
        client_name: "czxcxcfs",
        client_id: 13,
        is_expired: false,
        start_date: "2024-08-26",
        end_date: "2024-09-25",
        freeze_days_used: 0,
        freeze_start_date: null,
        is_frozen: false,
        unfreeze_date: null,
        client: 13,
    },
];

const SubscriptionsPrompt = ({ /* subscriptions, client, */ callBack }) => {
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
            </h1>
            {subscriptions.length == 0 ? (
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
                            <Label
                                className="ms-4 text-base lg:text-lg font-bold"
                                htmlFor={`sub-${sub.id}`}
                            >
                                {sub.plan.name}
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
