import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScannerState } from "html5-qrcode";
import { useToast } from "../../providers/ToastProvider";
import { useDrawer } from "../../providers/DrawerProvider";
import axios from "../../config/axiosconfig";
import endpoints from "../../config/config";
import SubscriptionsPrompt from "./SubscriptionsPrompt";
import { FaInfoCircle } from "react-icons/fa";
import { usePermission } from "../../providers/PermissionProvider";
import ErrorGroup from "../groups/ErrorGroup";
import { Button } from "flowbite-react";
import ViewGroup from "../groups/ViewGroup";
import ClientIdForm from "./ClientIdForm";
import ClientMobileForm from "./ClientMobileForm";

const Scanner = () => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("clients", "attendance");

    if (!permissions.add)
        return <ErrorGroup title={"تسجيل حضور"} message={"ليس لديك صلاحية"} />;

    const scannerRef = useRef(null);
    const ReaderDivRef = useRef(null);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const { showToast } = useToast();
    const { showDrawer, closeDrawer, drawerState } = useDrawer();
    const audio = new Audio("./success.mp3");

    const displayReader = async () => {
        if (!scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 400, height: 350 },
                },
                false
            );
            const success = (text, result) => {
                setScanResult({ text: text, result: result });
                setScanError(null);
            };

            const error = (text) => {
                setScanError({ text: text });
            };

            scannerRef.current.render(success, error);
        }
    };

    const pauseScanning = () => {
        if (
            scannerRef.current &&
            scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING
        ) {
            scannerRef.current.pause();
        }
    };

    const resumeScanning = () => {
        if (
            scannerRef.current &&
            scannerRef.current.getState() === Html5QrcodeScannerState.PAUSED
        ) {
            scannerRef.current.resume();
        }
    };

    useEffect(() => {
        const checkCode = async (code) => {
            pauseScanning();
            axios
                .post(endpoints.scanner_code, { code: code })
                .then((response) => {
                    audio.play();
                    showDrawer(
                        "تسجيل حضور ",
                        FaInfoCircle,
                        <SubscriptionsPrompt
                            subscriptions={response.data.subscriptions}
                            client={response.data.client}
                            is_attended={response.data.is_attended}
                            callBack={() => {
                                resumeScanning();
                                closeDrawer();
                            }}
                        />
                    );
                })
                .catch((error) => {
                    showToast(error.response.data.error, true);
                    setTimeout(() => {
                        resumeScanning();
                    }, 2000);
                });
        };

        if (scanResult) {
            checkCode(scanResult.text);
        }
    }, [scanResult]);

    useEffect(() => {
        if (
            scannerRef.current &&
            scannerRef.current.getState() === Html5QrcodeScannerState.PAUSED &&
            !drawerState.open
        ) {
            resumeScanning();
        }
        if (scannerRef.current) {
            drawerState.open ? pauseScanning() : resumeScanning();
        }
    }, [drawerState]);

    return (
        <>
            <ClientIdForm />
            <ClientMobileForm />

            {/* Using device camera */}
            <ViewGroup title={"مسح بالكاميرا"}>
                <div className="flex flex-col items-center justify-center w-500 lg:w-[700px] m-auto my-8 border-0">
                    <div>
                        <div
                            id="reader"
                            className="w-500 lg:w-[700px] m-auto"
                            ref={ReaderDivRef}
                        >
                            <div className="flex flex-wrap max-h-12 min-w-full justify-center mt-5">
                                <Button
                                    color={"primary"}
                                    size={"xl"}
                                    className="w-44 h-16 flex justify-center items-center text-lg"
                                    onClick={displayReader}
                                >
                                    فتح الكاميرا
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </ViewGroup>
        </>
    );
};

export default Scanner;
