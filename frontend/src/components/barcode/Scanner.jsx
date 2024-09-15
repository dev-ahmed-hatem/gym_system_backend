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

const Scanner = () => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("clients", "attendance");

    if (!permissions.add)
        return (
            <ErrorGroup
                title={"تسجيل حضور"}
                message={"ليس لديك صلاحية"}
            />
        );

    const scannerRef = useRef(null);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const { showToast } = useToast();
    const { showDrawer, closeDrawer, drawerState } = useDrawer();
    const audio = new Audio("./success.mp3");

    useEffect(() => {
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
    }, []);

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
                    resumeScanning();
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
    }, [drawerState]);

    return (
        <div className="flex flex-col items-center justify-center w-500 lg:w-[700px] m-auto my-8 border-0">
            <div>
                <div id="reader" className="w-500 lg:w-[700px] m-auto"></div>
            </div>
        </div>
    );
};

export default Scanner;
