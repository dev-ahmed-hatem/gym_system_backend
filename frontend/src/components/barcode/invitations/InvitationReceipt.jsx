import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { get_gym_data } from "../../../config/actions";
import Loading from "../../groups/Loading";
import endpoints from "../../../config/config";
import axios from "../../../config/axiosconfig";
import JsBarcode from "jsbarcode";

export const InvitationReceipt = () => {
    const { key } = useParams();
    const [gymData, setGymData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [invitation, setInvitation] = useState(null);
    const invRef = useRef(null);

    const fetch_invitation_data = (key) => {
        axios
            .post(endpoints.invitation_data, { key: key })
            .then((response) => {
                setInvitation(response.data);
            })
            .catch((error) => {
                setFetchError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        get_gym_data().then(({ gym_data }) => {
            setGymData(gym_data);
            fetch_invitation_data(key);
        });
    }, []);

    useEffect(() => {
        document.body.style.backgroundColor = "#000";
        document.body.style.overflow = "hidden";
    }, []);

    useEffect(() => {
        if (invitation) {
            JsBarcode(invRef.current, invitation.code, {
                format: "CODE128",
                height: 130,
                displayValue: true,
            });
        }
    }, [invitation]);

    return (
        <>
            {loading ? (
                <div className="h-dvh flex justify-center items-center">
                    <Loading />
                </div>
            ) : fetchError ? (
                <p className="text-lg text-center text-red-600 py-4">
                    وجهة غير صحيحة
                </p>
            ) : (
                <div className="max-w-[400px] m-auto text-white bg-primary flex justify-center flex-col">
                    {/* <header className="h-16 bg-primary flex items-center justify-center">
                        <h1 className="text-accent font-bold text-2xl lg:block ">
                            {gymData?.title}
                        </h1>
                    </header> */}
                    <img
                        src={gymData?.logo}
                        className="w-[350px] block m-auto"
                    />
                    <h1 className="text-center font-bold text-xl text-accent">
                        دعوة حضور خاصة
                    </h1>
                    <div className="text-center my-20">
                        <img
                            ref={invRef}
                            className="text-primary font-bold ms-2 inline-block h-[130px]"
                        />
                    </div>
                    <p className="text-lg my-6">
                        مرحباً بك في
                        <span className="text-accent font-bold"> PRO GYM</span>،
                        ونتطلع لاستقبالك لتجربة رياضية مميزة وفريدة من نوعها
                    </p>
                    <div className="text-lg my-6">
                        تفاصيل الدعوة:
                        <ul className="list-disc">
                            <li className="ms-10">
                                هذه الدعوة صالحة للاستخدام مرة واحدة
                            </li>
                            <li className="ms-10">
                                الدعوة صالحة حتى:{" "}
                                <span className="text-accent font-bold">
                                    {invitation.end_date}
                                </span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-lg my-6">
                        يرجى التأكد من إحضار الدعوة معك عند الحضور، حيث ستحتاج
                        إلى استخدامها لتسجيل الدخول. <br />
                        نتمنى لك وقتاً ممتعاً ونتطلع لرؤيتك قريباً في{" "}
                        <span className="text-accent font-bold">PRO GYM</span>
                    </p>
                </div>
            )}
        </>
    );
};
