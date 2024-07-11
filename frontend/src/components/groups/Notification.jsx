import React, { useRef, useEffect, forwardRef } from "react";
import { HiCheck } from "react-icons/hi";
import { Toast } from "flowbite-react";

const ToggleButton = forwardRef((props, ref) => (
    <div ref={ref} className="flex items-center">
        <Toast.Toggle className="hover:text-red-500" />
    </div>
));

const Notification = ({ setToast, title }) => {
    const toggle = useRef(null);
    useEffect(() => {
        const timer1 = setTimeout(() => {
            if (toggle.current) {
                toggle.current.querySelector("button").click();
            }
        }, 3000);
        const timer2 = setTimeout(() => {
            if (title) {
                setToast(null);
            }
        }, 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <div className="fixed bottom-20 left-[50%] -translate-x-1/2 z-50 min-w-[400px]">
            <Toast className="border-x-4 border-accent shadow-2xl flex justify-between items-center min-h-20">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 me-2">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-base text-gray-800 font-bold">
                    {title}
                </div>
                <ToggleButton ref={toggle} />
            </Toast>
        </div>
    );
};

export default Notification;
